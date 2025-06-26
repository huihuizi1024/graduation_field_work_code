import React, { useState, useEffect, useCallback } from 'react';
import { Table, Button, Modal, Form, Input, InputNumber, Select, Space, message, Popconfirm, Tag, Tooltip, DatePicker } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, SearchOutlined, ReloadOutlined, AuditOutlined, CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import api from '../api';
import debounce from 'lodash/debounce';

const { Option } = Select;
const { TextArea } = Input;

const ConversionRuleList = () => {
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
    sourceType: undefined,
    targetType: undefined,
    status: undefined,
    reviewStatus: undefined,
  });

  const fetchConversionRules = useCallback(async () => {
    setLoading(true);
    try {
      const { current, pageSize } = pagination;
      const queryParams = new URLSearchParams({
        page: current - 1, // 后端页码从0开始
        size: pageSize,
        ...filters,
      }).toString();

      const result = await api.get(`/api/conversion-rules`, {
        params: {
          page: current - 1,
          size: pageSize,
          ...filters
        }
      });
      console.log('转换规则API响应:', result);
      if (result.code === 200) {
        setData(result.data.records || []);
        setPagination((prev) => ({
          ...prev,
          total: result.data.total,
        }));
      } else {
        message.error(result.message || '获取转换规则失败！');
      }
    } catch (error) {
      message.error('获取转换规则失败！');
      console.error('Error fetching conversion rules:', error);
    } finally {
      setLoading(false);
    }
  }, [pagination.current, pagination.pageSize, filters]);

  useEffect(() => {
    fetchConversionRules();
  }, [fetchConversionRules]);

  const handleTableChange = (newPagination, newFilters, sorter) => {
    console.log('Table Change:', newPagination, newFilters, sorter);
    setPagination(newPagination);
    setFilters({
      ...filters,
      sourceType: newFilters.sourceType ? newFilters.sourceType[0] : undefined,
      targetType: newFilters.targetType ? newFilters.targetType[0] : undefined,
      status: newFilters.status ? newFilters.status[0] : undefined,
      reviewStatus: newFilters.reviewStatus ? newFilters.reviewStatus[0] : undefined,
    });
  };

  const handleSearch = (value, name) => {
    setFilters((prev) => ({ ...prev, [name]: value }));
    setPagination((prev) => ({ ...prev, current: 1 })); // Reset to first page on search
  };

  const debouncedSearchRuleName = useCallback(debounce((value) => handleSearch(value, 'ruleName'), 500), []);

  const handleResetFilters = () => {
    setFilters({
      ruleName: '',
      sourceType: undefined,
      targetType: undefined,
      status: undefined,
      reviewStatus: undefined,
    });
    setPagination((prev) => ({ ...prev, current: 1 }));
  };

  const handleAdd = () => {
    setEditingRule(null);
    form.resetFields();
    form.setFieldsValue({
      sourceType: 1,
      targetType: 1,
      reviewRequired: 0,
      status: 1,
      reviewStatus: 0, // 默认待审核
    });
    setIsModalVisible(true);
  };

  const handleEdit = (record) => {
    console.log('编辑规则:', record);
    setEditingRule(record);
    const formValues = {
      ...record,
      // 确保转换比例是数字，而不是字符串
      conversionRatio: record.conversionRatio ? parseFloat(record.conversionRatio) : 0,
      minConversionAmount: record.minConversionAmount ? parseFloat(record.minConversionAmount) : undefined,
      maxConversionAmount: record.maxConversionAmount ? parseFloat(record.maxConversionAmount) : undefined,
    };
    console.log('设置表单值:', formValues);
    form.setFieldsValue(formValues);
    setIsModalVisible(true);
  };

  const handleDelete = async (id) => {
    try {
      setLoading(true);
      const result = await api.delete(`/api/conversion-rules/${id}`);
      if (result.code === 200) {
        message.success('转换规则删除成功！');
        fetchConversionRules();
      } else {
        message.error(result.message || '删除转换规则失败！');
      }
    } catch (error) {
      message.error('删除转换规则失败！');
      console.error('Error deleting conversion rule:', error);
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
        // 确保数字字段转换为字符串，以便后端Decimal类型接收
        conversionRatio: values.conversionRatio !== undefined && values.conversionRatio !== null ? values.conversionRatio.toString() : "0",
        minConversionAmount: values.minConversionAmount !== undefined && values.minConversionAmount !== null ? values.minConversionAmount.toString() : null,
        maxConversionAmount: values.maxConversionAmount !== undefined && values.maxConversionAmount !== null ? values.maxConversionAmount.toString() : null,
      };
      console.log('提交给后端的数据:', submitData);
      
      setLoading(true);
      let response;
      let result;
      if (editingRule) {
        result = await api.put(`/api/conversion-rules/${editingRule.id}`, submitData);
        if (result.code === 200) {
          message.success('转换规则更新成功！');
        } else {
          message.error(result.message || '转换规则更新失败！');
        }
      } else {
        result = await api.post('/api/conversion-rules', submitData);
        if (result.code === 200) {
          message.success('转换规则添加成功！');
        } else {
          message.error(result.message || '转换规则添加失败！');
        }
      }
      setIsModalVisible(false);
      fetchConversionRules();
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
      title: '审核转换规则',
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
          const result = await api.post(`/api/conversion-rules/${id}/review`, null, {
            params: {
              reviewStatus: 1,
              reviewComment: reviewComment
            }
          });
          if (result.code === 200) {
            message.success('转换规则审核通过！');
            fetchConversionRules();
          } else {
            message.error(result.message || '审核操作失败！');
          }
        } catch (error) {
          message.error('审核操作失败！');
          console.error('Error reviewing conversion rule:', error);
        } finally {
          setLoading(false);
        }
      },
      onCancel: async () => {
        const reviewComment = document.getElementById('reviewComment').value;
        try {
          setLoading(true);
          const result = await api.post(`/api/conversion-rules/${id}/review`, null, {
            params: {
              reviewStatus: 2,
              reviewComment: reviewComment
            }
          });
          if (result.code === 200) {
            message.success('转换规则审核拒绝！');
            fetchConversionRules();
          } else {
            message.error(result.message || '审核操作失败！');
          }
        } catch (error) {
          message.error('审核操作失败！');
          console.error('Error reviewing conversion rule:', error);
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
      const result = await api.post(`/api/conversion-rules/${id}/status`, null, {
        params: {
          status: newStatus
        }
      });
      if (result.code === 200) {
        message.success(`转换规则已${newStatus === 1 ? '启用' : '禁用'}！`);
        fetchConversionRules();
      } else {
        message.error(result.message || '状态更改失败！');
      }
    } catch (error) {
      message.error('状态更改失败！');
      console.error('Error changing conversion rule status:', error);
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
    },
    {
      title: '源类型',
      dataIndex: 'sourceType',
      key: 'sourceType',
      render: (text) => {
        switch (text) {
          case 1: return <Tag color="blue">积分</Tag>;
          case 2: return <Tag color="green">学分</Tag>;
          case 3: return <Tag color="purple">证书</Tag>;
          default: return <Tag>未知</Tag>;
        }
      },
      filters: [
        { text: '积分', value: 1 },
        { text: '学分', value: 2 },
        { text: '证书', value: 3 },
      ],
      filterMultiple: false,
    },
    {
      title: '目标类型',
      dataIndex: 'targetType',
      key: 'targetType',
      render: (text) => {
        switch (text) {
          case 1: return <Tag color="blue">积分</Tag>;
          case 2: return <Tag color="green">学分</Tag>;
          case 3: return <Tag color="purple">证书</Tag>;
          default: return <Tag>未知</Tag>;
        }
      },
      filters: [
        { text: '积分', value: 1 },
        { text: '学分', value: 2 },
        { text: '证书', value: 3 },
      ],
      filterMultiple: false,
    },
    {
      title: '转换比例',
      dataIndex: 'conversionRatio',
      key: 'conversionRatio',
      sorter: (a, b) => parseFloat(a.conversionRatio) - parseFloat(b.conversionRatio),
    },
    {
      title: '最小转换数量',
      dataIndex: 'minConversionAmount',
      key: 'minConversionAmount',
    },
    {
      title: '最大转换数量',
      dataIndex: 'maxConversionAmount',
      key: 'maxConversionAmount',
    },
    {
      title: '审核要求',
      dataIndex: 'reviewRequired',
      key: 'reviewRequired',
      render: (text) => (text === 1 ? <Tag color="volcano">需要</Tag> : <Tag>无需</Tag>),
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
      <h2 style={{ marginBottom: 24 }}>转换规则管理</h2>
      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between' }}>
        <Space>
          <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
            添加转换规则
          </Button>
          <Button icon={<ReloadOutlined />} onClick={fetchConversionRules}>
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
        title={editingRule ? '编辑转换规则' : '添加转换规则'}
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        width={800}
        confirmLoading={loading}
      >
        <Form
          form={form}
          layout="vertical"
          name="conversion_rule_form"
          initialValues={{
            sourceType: 1,
            targetType: 1,
            reviewRequired: 0,
            status: 1,
            reviewStatus: 0,
          }}
        >
          <Form.Item
            name="ruleName"
            label="规则名称"
            rules={[{ required: true, message: '请输入规则名称！' }]}
          >
            <Input placeholder="例如：学分转积分" />
          </Form.Item>
          <Form.Item
            name="ruleCode"
            label="规则编码"
            rules={[{ required: true, message: '请输入规则编码！' }]}
            tooltip="规则编码是规则的唯一标识。建议使用大写字母和下划线，例如：CREDIT_TO_POINT。"
          >
            <Input placeholder="例如：CREDIT_TO_POINT" />
          </Form.Item>
          <Form.Item
            name="sourceType"
            label="源类型"
            rules={[{ required: true, message: '请选择源类型！' }]}
          >
            <Select placeholder="请选择源类型">
              <Option value={1}>积分</Option>
              <Option value={2}>学分</Option>
              <Option value={3}>证书</Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="targetType"
            label="目标类型"
            rules={[{ required: true, message: '请选择目标类型！' }]}
          >
            <Select placeholder="请选择目标类型">
              <Option value={1}>积分</Option>
              <Option value={2}>学分</Option>
              <Option value={3}>证书</Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="conversionRatio"
            label="转换比例"
            rules={[{ required: true, message: '请输入转换比例！' }, { type: 'number', min: 0.0001, message: '转换比例必须是大于0的数字！' }]}
          >
            <InputNumber min={0.0001} step={0.0001} style={{ width: '100%' }} placeholder="请输入转换比例 (源:目标)" />
          </Form.Item>
          <Form.Item
            name="minConversionAmount"
            label="最小转换数量"
            rules={[{ type: 'number', min: 0, message: '最小转换数量必须是大于等于0的数字！' }]}
          >
            <InputNumber min={0} step={0.01} style={{ width: '100%' }} placeholder="请输入最小转换数量（可选）" />
          </Form.Item>
          <Form.Item
            name="maxConversionAmount"
            label="最大转换数量"
            rules={[{ type: 'number', min: 0, message: '最大转换数量必须是大于等于0的数字！' }]}
          >
            <InputNumber min={0} step={0.01} style={{ width: '100%' }} placeholder="请输入最大转换数量（可选）" />
          </Form.Item>
          <Form.Item
            name="conversionConditions"
            label="转换条件描述"
          >
            <TextArea rows={3} placeholder="请输入转换的具体条件或说明（可选）" />
          </Form.Item>
          <Form.Item
            name="reviewRequired"
            label="审核要求"
            rules={[{ required: true, message: '请选择审核要求！' }]}
          >
            <Select placeholder="请选择是否需要审核">
              <Option value={0}>无需审核</Option>
              <Option value={1}>需要审核</Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="applicableInstitutionId"
            label="适用机构ID"
          >
            <InputNumber style={{ width: '100%' }} placeholder="请输入适用机构ID（可选）" />
          </Form.Item>
          <Form.Item
            name="applicableInstitutionName"
            label="适用机构名称"
          >
            <Input placeholder="请输入适用机构名称（可选）" />
          </Form.Item>
          <Form.Item
            name="effectiveStartTime"
            label="有效期开始时间"
          >
            <DatePicker showTime format="YYYY-MM-DD HH:mm:ss" style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item
            name="effectiveEndTime"
            label="有效期结束时间"
          >
            <DatePicker showTime format="YYYY-MM-DD HH:mm:ss" style={{ width: '100%' }} />
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
              <Form.Item name="creatorId" label="创建人ID">
                <Input disabled />
              </Form.Item>
              <Form.Item name="createTime" label="创建时间">
                <Input disabled />
              </Form.Item>
              <Form.Item name="reviewerName" label="审核人">
                <Input disabled />
              </Form.Item>
              <Form.Item name="reviewerId" label="审核人ID">
                <Input disabled />
              </Form.Item>
              <Form.Item name="reviewTime" label="审核时间">
                <Input disabled />
              </Form.Item>
              <Form.Item name="reviewComment" label="审核意见">
                <TextArea rows={2} disabled />
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

export default ConversionRuleList;
