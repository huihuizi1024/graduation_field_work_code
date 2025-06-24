import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, InputNumber, Select, Space, message, Popconfirm, Tooltip } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, ThunderboltOutlined, BulbOutlined } from '@ant-design/icons';

const { Option } = Select;

const PointRuleList = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingRule, setEditingRule] = useState(null);

  // 智能生成规则编码
  const generateRuleCode = (ruleName) => {
    if (!ruleName) return '';
    
    // 中文到英文的映射 - 改为词组匹配，而不是单字符匹配
    const chineseToEnglish = {
      '在线课程': 'ONLINE_COURSE',
      '在线': 'ONLINE',
      '课程学习': 'COURSE_LEARN',
      '课程': 'COURSE', 
      '学习': 'LEARN',
      '完成': 'COMPLETE',
      '参与技能': 'SKILL_ATTEND',
      '技能培训': 'SKILL_TRAINING',
      '参与': 'ATTEND',
      '学术讲座': 'ACADEMIC_LECTURE',
      '学术': 'ACADEMIC',
      '讲座': 'LECTURE',
      '发表': 'PUBLISH',
      '论文': 'PAPER',
      '社区服务': 'COMMUNITY_SERVICE',
      '社区': 'COMMUNITY',
      '服务': 'SERVICE',
      '技能认证': 'SKILL_CERT',
      '技能': 'SKILL',
      '认证': 'CERT',
      '考试': 'EXAM',
      '培训': 'TRAINING',
      '会议': 'MEETING',
      '研讨会': 'SEMINAR',
      '研讨': 'SEMINAR',
      '竞赛': 'CONTEST',
      '比赛': 'COMPETITION',
      '项目': 'PROJECT',
      '实习': 'INTERNSHIP',
      '志愿服务': 'VOLUNTEER_SERVICE',
      '志愿': 'VOLUNTEER',
      '义工': 'VOLUNTEER',
      '获奖': 'AWARD',
      '专利': 'PATENT',
      '著作': 'BOOK',
      '教学': 'TEACHING',
      '指导': 'GUIDE',
      '评审': 'REVIEW'
    };

    let code = '';
    let remainingText = ruleName;
    
    // 优先匹配长词组，然后匹配单个词
    const sortedKeys = Object.keys(chineseToEnglish).sort((a, b) => b.length - a.length);
    
    for (let key of sortedKeys) {
      if (remainingText.includes(key)) {
        code += chineseToEnglish[key] + '_';
        remainingText = remainingText.replace(key, '');
      }
    }
    
    // 移除末尾的下划线
    code = code.replace(/_$/, '');
    
    // 如果没有匹配到任何词，生成基于拼音的编码
    if (!code) {
      // 为常见字符提供简单映射
      const charMap = {
        '参': 'ATTEND',
        '与': '',
        '技': 'SKILL',
        '能': '',
        '培': 'TRAIN',
        '训': 'TRAINING'
      };
      
      for (let char of ruleName) {
        if (charMap[char]) {
          code += charMap[char] + '_';
        }
      }
      
      code = code.replace(/_$/, '');
      
      // 如果还是没有，使用通用规则
      if (!code) {
        code = 'CUSTOM_RULE_' + Date.now().toString().slice(-4);
      }
    }
    
    return code || 'CUSTOM_RULE';
  };

  // 常用编码模板
  const codeTemplates = [
    { label: '学习类', codes: [
      'ONLINE_COURSE_COMPLETE',
      'OFFLINE_TRAINING_ATTEND', 
      'WEBINAR_PARTICIPATE',
      'READING_COMPLETE'
    ]},
    { label: '活动类', codes: [
      'ACADEMIC_LECTURE_ATTEND',
      'CONFERENCE_PARTICIPATE',
      'SEMINAR_JOIN',
      'WORKSHOP_ATTEND'
    ]},
    { label: '贡献类', codes: [
      'PAPER_PUBLISH',
      'PATENT_APPLY',
      'BOOK_WRITE',
      'VOLUNTEER_SERVICE'
    ]},
    { label: '考核类', codes: [
      'SKILL_CERT_PASS',
      'EXAM_PASS',
      'ASSESSMENT_COMPLETE',
      'EVALUATION_PASS'
    ]}
  ];

  useEffect(() => {
    fetchPointRules();
  }, []);

  const fetchPointRules = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/point-rules'); // 使用相对路径，利用proxy
      if (!response.ok) {
        throw new Error('网络响应错误');
      }
      const result = await response.json();
      console.log('积分规则API响应:', result); // 添加调试日志
      if (result.code === 200) {
        setData(result.data.records || []); // 后端返回的是PageResponse，数据在records字段
      } else {
        message.error(result.message || '获取积分规则失败！');
      }
    } catch (error) {
      message.error('获取积分规则失败！');
      console.error('Error fetching point rules:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setEditingRule(null);
    form.resetFields();
    // 设置默认值
    form.setFieldsValue({
      validityType: 1, // 默认永久有效
      status: 1, // 默认启用
      pointType: 1, // 默认学习积分
      applicableObject: 1 // 默认学生
    });
    setIsModalVisible(true);
  };

  const handleEdit = (record) => {
    console.log('编辑规则:', record); // 添加调试日志
    setEditingRule(record);
    // 处理pointValue的显示格式
    const formValues = {
      ...record,
      pointValue: record.pointValue ? parseFloat(record.pointValue) : 0
    };
    console.log('设置表单值:', formValues); // 添加调试日志
    form.setFieldsValue(formValues);
    setIsModalVisible(true);
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`/api/point-rules/${id}`, { method: 'DELETE' });
      const result = await response.json();
      if (result.code === 200) {
        message.success('积分规则删除成功！');
        fetchPointRules(); // 刷新列表
      } else {
        message.error(result.message || '删除积分规则失败！');
      }
    } catch (error) {
      message.error('删除积分规则失败！');
      console.error('Error deleting point rule:', error);
    }
  };

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      console.log('表单提交值:', values); // 添加调试日志
      
      // 确保pointValue是数字格式
      const submitData = {
        ...values,
        pointValue: values.pointValue ? values.pointValue.toString() : "0"
      };
      console.log('提交给后端的数据:', submitData); // 添加调试日志
      
      setLoading(true);
      let response;
      let result;
      if (editingRule) {
        // 编辑
        console.log('执行编辑操作，ID:', editingRule.id); // 添加调试日志
        response = await fetch(`/api/point-rules/${editingRule.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(submitData),
        });
        result = await response.json();
        console.log('编辑响应:', result); // 添加调试日志
        if (result.code === 200) {
          message.success('积分规则更新成功！');
        } else {
          message.error(result.message || '积分规则更新失败！');
        }
      } else {
        // 添加
        console.log('执行添加操作'); // 添加调试日志
        response = await fetch('/api/point-rules', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(submitData),
        });
        result = await response.json();
        console.log('添加响应:', result); // 添加调试日志
        if (result.code === 200) {
          message.success('积分规则添加成功！');
        } else {
          message.error(result.message || '积分规则添加失败！');
        }
      }
      setIsModalVisible(false);
      fetchPointRules(); // 刷新列表
    } catch (error) {
      message.error('操作失败，请检查表单或网络！');
      console.error('Error saving point rule:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setEditingRule(null);
    form.resetFields();
  };

  const columns = [
    {
      title: '规则名称',
      dataIndex: 'ruleName',
      key: 'ruleName',
    },
    {
      title: '规则编码',
      dataIndex: 'ruleCode',
      key: 'ruleCode',
    },
    {
      title: '积分类型',
      dataIndex: 'pointType',
      key: 'pointType',
      render: (type) => {
        const typeMap = {
          1: '学习积分',
          2: '活动积分', 
          3: '贡献积分'
        };
        return typeMap[type] || '未知类型';
      },
    },
    {
      title: '分值',
      dataIndex: 'pointValue',
      key: 'pointValue',
      render: (value) => {
        // 确保数值正确显示
        return typeof value === 'number' ? value : parseFloat(value) || 0;
      },
    },
    {
      title: '适用对象',
      dataIndex: 'applicableObject',
      key: 'applicableObject',
      render: (obj) => {
        const objMap = {
          1: '学生',
          2: '教师',
          3: '专家',
          4: '管理员'
        };
        return objMap[obj] || '未知对象';
      },
    },
    {
      title: '有效期',
      dataIndex: 'validityType',
      key: 'validityType',
      render: (type, record) => {
        const typeMap = {
          1: '永久有效',
          2: '固定期限',
          3: '相对期限'
        };
        const typeText = typeMap[type] || '未知';
        const days = record.validityDays;
        if (type === 1 || !days) {
          return typeText;
        }
        return `${typeText}(${days}天)`;
      },
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (status === 1 ? '启用' : '禁用'),
    },
    {
      title: '描述',
      dataIndex: 'ruleDescription',
      key: 'ruleDescription',
      ellipsis: true,
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Button icon={<EditOutlined />} onClick={() => handleEdit(record)}>编辑</Button>
          <Popconfirm
            title="确定删除此规则吗？"
            onConfirm={() => handleDelete(record.id)}
            okText="是"
            cancelText="否"
          >
            <Button icon={<DeleteOutlined />} danger>删除</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd} style={{ marginBottom: 16 }}>
        添加积分规则
      </Button>
      <Table columns={columns} dataSource={data} rowKey="id" loading={loading} />

      <Modal
        title={editingRule ? '编辑积分规则' : '添加积分规则'}
        open={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        confirmLoading={loading}
        width={600}
      >
        <Form form={form} layout="vertical" name="point_rule_form">
          <Form.Item
            name="ruleName"
            label="规则名称"
            rules={[{ required: true, message: '请输入规则名称！' }]}
          >
            <Input 
              placeholder="请输入规则名称" 
              onChange={(e) => {
                const ruleName = e.target.value;
                // 如果是新增且编码为空，自动生成编码
                if (!editingRule && ruleName) {
                  const generatedCode = generateRuleCode(ruleName);
                  form.setFieldsValue({ ruleCode: generatedCode });
                }
              }}
            />
          </Form.Item>
          <Form.Item
            label={
              <Space>
                规则编码
                <Tooltip title="点击闪电图标自动生成编码，或点击灯泡图标选择模板">
                  <BulbOutlined style={{ color: '#1890ff' }} />
                </Tooltip>
              </Space>
            }
            tooltip="规则编码是积分规则的唯一标识符，用于系统内部识别和API调用。建议格式：ONLINE_COURSE_COMPLETE"
          >
            <Input.Group compact>
              <Form.Item
                name="ruleCode"
                style={{ width: 'calc(100% - 80px)', display: 'inline-block' }}
                rules={[
                  { required: true, message: '请输入规则编码！' },
                  { 
                    pattern: /^[A-Z][A-Z0-9_]*[A-Z0-9]$/, 
                    message: '编码格式：大写字母开头，可包含大写字母、数字、下划线！' 
                  }
                ]}
              >
                <Input 
                  placeholder="请输入规则编码，如：ONLINE_COURSE_COMPLETE" 
                  style={{ textTransform: 'uppercase' }}
                />
              </Form.Item>
              <Tooltip title="根据规则名称自动生成编码">
                <Button 
                  type="default"
                  icon={<ThunderboltOutlined />}
                  style={{ width: '40px' }}
                  onClick={(e) => {
                    e.preventDefault();
                    console.log('点击了自动生成按钮'); // 调试日志
                    const ruleName = form.getFieldValue('ruleName');
                    console.log('当前规则名称:', ruleName); // 调试日志
                    if (ruleName) {
                      const generatedCode = generateRuleCode(ruleName);
                      console.log('生成的编码:', generatedCode); // 调试日志
                      form.setFieldsValue({ ruleCode: generatedCode });
                      message.success(`编码已自动生成: ${generatedCode}`);
                    } else {
                      message.warning('请先输入规则名称！');
                    }
                  }}
                />
              </Tooltip>
              <Tooltip title="选择编码模板">
                <Button 
                  type="default"
                  icon={<BulbOutlined />}
                  style={{ width: '40px' }}
                  onClick={(e) => {
                    e.preventDefault();
                    console.log('点击了模板选择按钮'); // 调试日志
                    const modal = Modal.info({
                      title: '常用编码模板',
                      width: 600,
                      content: (
                        <div>
                          {codeTemplates.map(category => (
                            <div key={category.label} style={{ marginBottom: 16 }}>
                              <h4>{category.label}</h4>
                              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                                {category.codes.map(code => (
                                  <Button
                                    key={code}
                                    size="small"
                                    onClick={() => {
                                      console.log('选择了模板:', code); // 调试日志
                                      form.setFieldsValue({ ruleCode: code });
                                      modal.destroy();
                                      message.success(`编码模板 ${code} 已应用！`);
                                    }}
                                  >
                                    {code}
                                  </Button>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      ),
                    });
                  }}
                />
              </Tooltip>
            </Input.Group>
          </Form.Item>
          <Form.Item
            name="pointType"
            label="积分类型"
            rules={[{ required: true, message: '请选择积分类型！' }]}
          >
            <Select placeholder="请选择积分类型">
              <Option value={1}>学习积分</Option>
              <Option value={2}>活动积分</Option>
              <Option value={3}>贡献积分</Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="pointValue"
            label="分值"
            rules={[{ required: true, message: '请输入分值！', type: 'number' }]}
          >
            <InputNumber min={0} step={0.1} style={{ width: '100%' }} placeholder="请输入分值" />
          </Form.Item>
          <Form.Item
            name="applicableObject"
            label="适用对象"
            rules={[{ required: true, message: '请选择适用对象！' }]}
          >
            <Select placeholder="请选择适用对象">
              <Option value={1}>学生</Option>
              <Option value={2}>教师</Option>
              <Option value={3}>专家</Option>
              <Option value={4}>管理员</Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="validityType"
            label="有效期类型"
            rules={[{ required: true, message: '请选择有效期类型！' }]}
          >
            <Select placeholder="请选择有效期类型">
              <Option value={1}>永久有效</Option>
              <Option value={2}>固定期限</Option>
              <Option value={3}>相对期限</Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="validityDays"
            label="有效期（天数）"
            dependencies={['validityType']}
            rules={[
              ({ getFieldValue }) => ({
                validator(_, value) {
                  const validityType = getFieldValue('validityType');
                  if (validityType === 1) {
                    // 永久有效时不需要填写天数
                    return Promise.resolve();
                  }
                  if (validityType === 2 || validityType === 3) {
                    if (!value || value <= 0) {
                      return Promise.reject(new Error('请输入有效的天数！'));
                    }
                  }
                  return Promise.resolve();
                },
              }),
            ]}
          >
            <Form.Item noStyle shouldUpdate={(prevValues, currentValues) => 
              prevValues.validityType !== currentValues.validityType
            }>
              {({ getFieldValue }) => {
                const validityType = getFieldValue('validityType');
                return (
                  <InputNumber 
                    min={1} 
                    style={{ width: '100%' }} 
                    placeholder={
                      validityType === 1 
                        ? "永久有效，无需填写" 
                        : "请输入有效期天数"
                    }
                    disabled={validityType === 1}
                  />
                );
              }}
            </Form.Item>
          </Form.Item>
          <Form.Item
            name="status"
            label="状态"
            rules={[{ required: true, message: '请选择状态！' }]}
          >
            <Select placeholder="请选择状态">
              <Option value={1}>启用</Option>
              <Option value={0}>禁用</Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="ruleDescription"
            label="描述"
          >
            <Input.TextArea rows={4} placeholder="请输入规则描述" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default PointRuleList; 