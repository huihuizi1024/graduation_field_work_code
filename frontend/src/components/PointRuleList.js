import React, { useState, useEffect, useCallback } from 'react';
import { Table, Button, Modal, Form, Input, InputNumber, Select, Space, message, Popconfirm, Tooltip, Tag, DatePicker } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, ThunderboltOutlined, BulbOutlined, SearchOutlined, ReloadOutlined, AuditOutlined, CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import api from '../api';
import debounce from 'lodash/debounce';

const { Option } = Select;
const { RangePicker } = DatePicker;

const PointRuleList = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingRule, setEditingRule] = useState(null);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [filters, setFilters] = useState({
    ruleName: '',
    ruleCode: '',
    pointType: undefined,
    applicableObject: undefined,
    status: undefined,
    reviewStatus: undefined,
  });

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

  const fetchPointRules = useCallback(async () => {
    setLoading(true);
    try {
      const { current, pageSize } = pagination;
      const queryParams = new URLSearchParams({
        page: current - 1, // 后端页码从0开始
        size: pageSize,
        ...filters,
      }).toString();

      const result = await api.get(`/api/point-rules`, {
        params: {
          page: current - 1,
          size: pageSize,
          ...filters
        }
      });
      console.log('积分规则API响应:', result);
      if (result.code === 200) {
        setData(result.data.records || []);
        setPagination((prev) => ({
          ...prev,
          total: result.data.total,
        }));
      } else {
        message.error(result.message || '获取积分规则失败！');
      }
    } catch (error) {
      message.error('获取积分规则失败！');
      console.error('Error fetching point rules:', error);
    } finally {
      setLoading(false);
    }
  }, [pagination.current, pagination.pageSize, filters]);

  useEffect(() => {
    fetchPointRules();
  }, [fetchPointRules]);

  const handleTableChange = (newPagination, newFilters, sorter) => {
    console.log('Table Change:', newPagination, newFilters, sorter);
    setPagination(newPagination);
    // Ant Design filters return an array, we need to extract the first element or keep undefined
    setFilters({
      ...filters,
      pointType: newFilters.pointType ? newFilters.pointType[0] : undefined,
      applicableObject: newFilters.applicableObject ? newFilters.applicableObject[0] : undefined,
      status: newFilters.status ? newFilters.status[0] : undefined,
      reviewStatus: newFilters.reviewStatus ? newFilters.reviewStatus[0] : undefined,
    });
    // If pagination changes, fetchPointRules will be called by useEffect
    // If filters change, fetchPointRules will be called by useEffect
  };

  const handleSearch = (value, name) => {
    setFilters((prev) => ({ ...prev, [name]: value }));
    setPagination((prev) => ({ ...prev, current: 1 })); // Reset to first page on search
  };

  const debouncedSearchRuleName = useCallback(debounce((value) => handleSearch(value, 'ruleName'), 500), []);
  const debouncedSearchRuleCode = useCallback(debounce((value) => handleSearch(value, 'ruleCode'), 500), []);

  const handleResetFilters = () => {
    setFilters({
      ruleName: '',
      ruleCode: '',
      pointType: undefined,
      applicableObject: undefined,
      status: undefined,
      reviewStatus: undefined,
    });
    setPagination((prev) => ({ ...prev, current: 1 }));
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
    console.log('编辑规则:', record);
    setEditingRule(record);
    const formValues = {
      ...record,
      pointValue: record.pointValue ? parseFloat(record.pointValue) : 0
    };
    console.log('设置表单值:', formValues);
    form.setFieldsValue(formValues);
    setIsModalVisible(true);
  };

  const handleDelete = async (id) => {
    try {
      setLoading(true);
      const result = await api.delete(`/api/point-rules/${id}`);
      if (result.code === 200) {
        message.success('积分规则删除成功！');
        fetchPointRules();
      } else {
        message.error(result.message || '删除积分规则失败！');
      }
    } catch (error) {
      message.error('删除积分规则失败！');
      console.error('Error deleting point rule:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      console.log('表单提交值:', values);
      
      const submitData = {
        ...values,
        // 确保pointValue是字符串，后端Decimal类型接收字符串
        pointValue: values.pointValue !== undefined && values.pointValue !== null ? values.pointValue.toString() : "0"
      };
      console.log('提交给后端的数据:', submitData);
      
      setLoading(true);
      let response;
      let result;
      if (editingRule) {
        // 编辑
        console.log('执行编辑操作，ID:', editingRule.id);
        result = await api.put(`/api/point-rules/${editingRule.id}`, submitData);
        console.log('编辑响应:', result);
        if (result.code === 200) {
          message.success('积分规则更新成功！');
        } else {
          message.error(result.message || '积分规则更新失败！');
        }
      } else {
        // 添加
        console.log('执行添加操作');
        result = await api.post('/api/point-rules', submitData);
        console.log('添加响应:', result);
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
      console.error('Operation failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setEditingRule(null);
    form.resetFields();
  };

  const handleReview = async (id, currentReviewStatus) => {
    Modal.confirm({
      title: '审核积分规则',
      content: (
        <div>
          <p>请选择审核结果：</p>
          <Input.TextArea 
            id="reviewComment" 
            placeholder="请输入审核意见（可选）" 
            rows={4} 
            maxLength={500} 
          />
        </div>
      ),
      okText: '通过',
      cancelText: '拒绝',
      onOk: async () => {
        const reviewComment = document.getElementById('reviewComment').value;
        try {
          setLoading(true);
          const result = await api.post(`/api/point-rules/${id}/review`, null, {
            params: {
              reviewStatus: 1,
              reviewComment: reviewComment
            }
          });
          if (result.code === 200) {
            message.success('积分规则审核通过！');
            fetchPointRules();
          } else {
            message.error(result.message || '审核操作失败！');
          }
        } catch (error) {
          message.error('审核操作失败！');
          console.error('Error reviewing point rule:', error);
        } finally {
          setLoading(false);
        }
      },
      onCancel: async () => {
        const reviewComment = document.getElementById('reviewComment').value;
        try {
          setLoading(true);
          const result = await api.post(`/api/point-rules/${id}/review`, null, {
            params: {
              reviewStatus: 2,
              reviewComment: reviewComment
            }
          });
          if (result.code === 200) {
            message.success('积分规则审核拒绝！');
            fetchPointRules();
          } else {
            message.error(result.message || '审核操作失败！');
          }
        } catch (error) {
          message.error('审核操作失败！');
          console.error('Error reviewing point rule:', error);
        } finally {
          setLoading(false);
        }
      },
    });
  };

  const handleChangeStatus = async (id, currentStatus) => {
    const newStatus = currentStatus === 1 ? 0 : 1;
    try {
      setLoading(true);
      const result = await api.post(`/api/point-rules/${id}/status`, null, {
        params: {
          status: newStatus
        }
      });
      if (result.code === 200) {
        message.success(`积分规则已${newStatus === 1 ? '启用' : '禁用'}！`);
        fetchPointRules();
      } else {
        message.error(result.message || '状态更改失败！');
      }
    } catch (error) {
      message.error('状态更改失败！');
      console.error('Error changing point rule status:', error);
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      title: '规则名称',
      dataIndex: 'ruleName',
      key: 'ruleName',
      filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
        <div style={{ padding: 8 }}>
          <Input
            placeholder="搜索规则名称"
            value={selectedKeys[0]}
            onChange={(e) => {
              setSelectedKeys(e.target.value ? [e.target.value] : []);
              debouncedSearchRuleName(e.target.value);
            }}
            onPressEnter={() => confirm()}
            style={{ marginBottom: 8, display: 'block' }}
          />
          <Space>
            <Button
              type="primary"
              onClick={() => confirm()}
              icon={<SearchOutlined />}
              size="small"
              style={{ width: 90 }}
            >
              搜索
            </Button>
            <Button onClick={() => { clearFilters(); handleSearch('', 'ruleName'); }} size="small" style={{ width: 90 }}>
              重置
            </Button>
          </Space>
        </div>
      ),
      filterIcon: (filtered) => <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />,
    },
    {
      title: '规则编码',
      dataIndex: 'ruleCode',
      key: 'ruleCode',
      filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
        <div style={{ padding: 8 }}>
          <Input
            placeholder="搜索规则编码"
            value={selectedKeys[0]}
            onChange={(e) => {
              setSelectedKeys(e.target.value ? [e.target.value] : []);
              debouncedSearchRuleCode(e.target.value);
            }}
            onPressEnter={() => confirm()}
            style={{ marginBottom: 8, display: 'block' }}
          />
          <Space>
            <Button
              type="primary"
              onClick={() => confirm()}
              icon={<SearchOutlined />}
              size="small"
              style={{ width: 90 }}
            >
              搜索
            </Button>
            <Button onClick={() => { clearFilters(); handleSearch('', 'ruleCode'); }} size="small" style={{ width: 90 }}>
              重置
            </Button>
          </Space>
        </div>
      ),
      filterIcon: (filtered) => <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />,
    },
    {
      title: '积分值',
      dataIndex: 'pointValue',
      key: 'pointValue',
      sorter: (a, b) => a.pointValue - b.pointValue,
    },
    {
      title: '积分类型',
      dataIndex: 'pointType',
      key: 'pointType',
      render: (text) => {
        switch (text) {
          case 1: return <Tag color="blue">学习积分</Tag>;
          case 2: return <Tag color="green">活动积分</Tag>;
          case 3: return <Tag color="purple">贡献积分</Tag>;
          default: return <Tag>未知</Tag>;
        }
      },
      filters: [
        { text: '学习积分', value: 1 },
        { text: '活动积分', value: 2 },
        { text: '贡献积分', value: 3 },
      ],
      filterMultiple: false,
    },
    {
      title: '适用对象',
      dataIndex: 'applicableObject',
      key: 'applicableObject',
      render: (text) => {
        switch (text) {
          case 1: return <Tag color="cyan">学生</Tag>;
          case 2: return <Tag color="geekblue">教师</Tag>;
          case 3: return <Tag color="volcano">专家</Tag>;
          case 4: return <Tag color="magenta">管理员</Tag>;
          default: return <Tag>未知</Tag>;
        }
      },
      filters: [
        { text: '学生', value: 1 },
        { text: '教师', value: 2 },
        { text: '专家', value: 3 },
        { text: '管理员', value: 4 },
      ],
      filterMultiple: false,
    },
    {
      title: '有效期类型',
      dataIndex: 'validityType',
      key: 'validityType',
      render: (text) => {
        switch (text) {
          case 1: return <Tag>永久有效</Tag>;
          case 2: return <Tag>固定期限</Tag>;
          case 3: return <Tag>相对期限</Tag>;
          default: return <Tag>未知</Tag>;
        }
      },
    },
    {
      title: '有效期（天）',
      dataIndex: 'validityDays',
      key: 'validityDays',
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (text) => {
        switch (text) {
          case 1: return <Tag color="green">启用</Tag>;
          case 0: return <Tag color="red">禁用</Tag>;
          default: return <Tag>未知</Tag>;
        }
      },
      filters: [
        { text: '启用', value: 1 },
        { text: '禁用', value: 0 },
      ],
      filterMultiple: false,
    },
    {
      title: '审核状态',
      dataIndex: 'reviewStatus',
      key: 'reviewStatus',
      render: (text) => {
        switch (text) {
          case 0: return <Tag color="orange">待审核</Tag>;
          case 1: return <Tag color="green">审核通过</Tag>;
          case 2: return <Tag color="red">审核拒绝</Tag>;
          default: return <Tag>未知</Tag>;
        }
      },
      filters: [
        { text: '待审核', value: 0 },
        { text: '审核通过', value: 1 },
        { text: '审核拒绝', value: 2 },
      ],
      filterMultiple: false,
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      key: 'createTime',
      render: (text) => text ? new Date(text).toLocaleString() : '-',
      sorter: (a, b) => new Date(a.createTime) - new Date(b.createTime),
    },
    {
      title: '操作',
      key: 'actions',
      render: (_, record) => (
        <Space size="small">
          <Button 
            icon={<EditOutlined />} 
            onClick={() => handleEdit(record)}
            type="link"
            size="small"
            title="编辑"
          />
          <Popconfirm
            title="确定删除此规则吗？"
            onConfirm={() => handleDelete(record.id)}
            okText="是"
            cancelText="否"
          >
            <Button 
              icon={<DeleteOutlined />} 
              danger 
              type="link"
              size="small"
              title="删除"
            />
          </Popconfirm>
          {record.reviewStatus === 0 && (
            <Button 
              icon={<AuditOutlined />} 
              onClick={() => handleReview(record.id, record.reviewStatus)}
              type="link"
              size="small"
              title="审核"
            />
          )}
          <Button
            icon={record.status === 1 ? <CloseCircleOutlined /> : <CheckCircleOutlined />}
            onClick={() => handleChangeStatus(record.id, record.status)}
            type="link"
            size="small"
            title={record.status === 1 ? "禁用" : "启用"}
            danger={record.status === 1}
          />
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <h2 style={{ marginBottom: 24 }}>积分规则管理</h2>
      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between' }}>
        <Space>
          <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
            添加积分规则
          </Button>
          <Button icon={<ReloadOutlined />} onClick={fetchPointRules}>
            刷新
          </Button>
          <Button onClick={handleResetFilters}>
            重置筛选
          </Button>
        </Space>
      </div>
      <Table
        columns={columns}
        dataSource={data}
        rowKey="id"
        loading={loading}
        pagination={pagination}
        onChange={handleTableChange}
        scroll={{ x: 'max-content' }}
      />

      <Modal
        title={editingRule ? '编辑积分规则' : '添加积分规则'}
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        width={800}
        confirmLoading={loading}
      >
        <Form
          form={form}
          layout="vertical"
          name="point_rule_form"
          initialValues={{
            pointType: 1,
            applicableObject: 1,
            validityType: 1,
            status: 1,
            reviewStatus: 0 // 默认待审核
          }}
        >
          <Form.Item
            name="ruleName"
            label="规则名称"
            rules={[{ required: true, message: '请输入规则名称！' }]}
          >
            <Input 
              placeholder="例如：完成在线课程学习" 
              onChange={(e) => {
                const generatedCode = generateRuleCode(e.target.value);
                form.setFieldsValue({ ruleCode: generatedCode });
              }}
            />
          </Form.Item>
          <Form.Item
            name="ruleCode"
            label="规则编码"
            rules={[{ required: true, message: '请输入规则编码！' }]}
            tooltip={
                <div>
                    <p>规则编码是规则的唯一标识。建议使用大写字母和下划线，例如：ONLINE_COURSE_COMPLETE。</p>
                    <p>您也可以从常用模板中选择或根据规则名称智能生成。</p>
                </div>
            }
          >
            <Input 
              placeholder="例如：ONLINE_COURSE_COMPLETE" 
              addonAfter={
                <Tooltip title="智能生成编码">
                  <ThunderboltOutlined 
                    onClick={() => {
                      const ruleName = form.getFieldValue('ruleName');
                      if (ruleName) {
                        form.setFieldsValue({ ruleCode: generateRuleCode(ruleName) });
                      } else {
                        message.warning('请先输入规则名称以生成编码！');
                      }
                    }}
                  />
                </Tooltip>
              }
            />
          </Form.Item>
          <Form.Item
            name="ruleDescription"
            label="规则描述"
          >
            <Input.TextArea rows={4} placeholder="请输入规则的详细描述" />
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
            label="积分值"
            rules={[{ required: true, message: '请输入积分值！' }, { type: 'number', min: 0.01, message: '积分值必须是大于0的数字！' }]}
          >
            <InputNumber min={0.01} step={0.01} style={{ width: '100%' }} placeholder="请输入积分值" />
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
            <Select 
              placeholder="请选择有效期类型"
              onChange={(value) => {
                if (value === 1) { // 永久有效
                  form.setFieldsValue({ validityDays: null });
                }
              }}
            >
              <Option value={1}>永久有效</Option>
              <Option value={2}>固定期限</Option>
              <Option value={3}>相对期限</Option>
            </Select>
          </Form.Item>
          <Form.Item
            noStyle
            shouldUpdate={(prevValues, currentValues) => prevValues.validityType !== currentValues.validityType}
          >
            {({ getFieldValue }) => {
              const validityType = getFieldValue('validityType');
              return validityType === 3 ? (
                <Form.Item
                  name="validityDays"
                  label="有效期（天数）"
                  rules={[{ required: true, message: '请输入有效期天数！' }, { type: 'integer', min: 1, message: '天数必须是正整数！' }]}
                >
                  <InputNumber min={1} style={{ width: '100%' }} placeholder="请输入有效期天数" />
                </Form.Item>
              ) : null;
            }}
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
          {editingRule && (
            <>
              <Form.Item name="creatorName" label="创建人">
                <Input disabled />
              </Form.Item>
              <Form.Item name="createTime" label="创建时间">
                <Input disabled />
              </Form.Item>
              <Form.Item name="reviewerName" label="审核人">
                <Input disabled />
              </Form.Item>
              <Form.Item name="reviewTime" label="审核时间">
                <Input disabled />
              </Form.Item>
              <Form.Item name="reviewComment" label="审核意见">
                <Input.TextArea rows={2} disabled />
              </Form.Item>
              <Form.Item name="updateTime" label="更新时间">
                <Input disabled />
              </Form.Item>
            </>
          )}
        </Form>
      </Modal>
    </div>
  );
};

export default PointRuleList;
