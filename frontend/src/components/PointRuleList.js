import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, InputNumber, Select, Space, message, Popconfirm } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';

const { Option } = Select;

const PointRuleList = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingRule, setEditingRule] = useState(null);

  // 模拟从后端获取数据
  useEffect(() => {
    fetchPointRules();
  }, []);

  const fetchPointRules = async () => {
    setLoading(true);
    try {
      // 实际项目中这里会调用后端API
      // const response = await fetch('/api/point-rules');
      // const result = await response.json();
      // setData(result.data);

      // 模拟数据
      const mockData = [
        { id: '1', ruleName: '签到积分', ruleCode: 'SIGNIN', pointType: 1, points: 5, status: 1, description: '每日签到获取积分' },
        { id: '2', ruleName: '课程学习', ruleCode: 'COURSE', pointType: 1, points: 100, status: 1, description: '完成一门课程获取积分' },
        { id: '3', ruleName: '活动参与', ruleCode: 'ACTIVITY', pointType: 1, points: 50, status: 0, description: '参与平台活动获取积分' },
      ];
      setData(mockData);
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
    setIsModalVisible(true);
  };

  const handleEdit = (record) => {
    setEditingRule(record);
    form.setFieldsValue(record);
    setIsModalVisible(true);
  };

  const handleDelete = async (id) => {
    try {
      // 实际项目中这里会调用后端API
      // await fetch(`/api/point-rules/${id}`, { method: 'DELETE' });
      message.success('积分规则删除成功！');
      fetchPointRules(); // 刷新列表
    } catch (error) {
      message.error('删除积分规则失败！');
      console.error('Error deleting point rule:', error);
    }
  };

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);
      if (editingRule) {
        // 编辑
        // 实际项目中这里会调用后端API
        // await fetch(`/api/point-rules/${editingRule.id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...editingRule, ...values }) });
        message.success('积分规则更新成功！');
      } else {
        // 添加
        // 实际项目中这里会调用后端API
        // await fetch('/api/point-rules', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(values) });
        message.success('积分规则添加成功！');
      }
      setIsModalVisible(false);
      fetchPointRules(); // 刷新列表
    } catch (error) {
      message.error('操作失败，请检查表单！');
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
      render: (type) => (type === 1 ? '获得积分' : '消费积分'),
    },
    {
      title: '分值',
      dataIndex: 'points',
      key: 'points',
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (status === 1 ? '启用' : '禁用'),
    },
    {
      title: '描述',
      dataIndex: 'description',
      key: 'description',
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
      >
        <Form form={form} layout="vertical" name="point_rule_form">
          <Form.Item
            name="ruleName"
            label="规则名称"
            rules={[{ required: true, message: '请输入规则名称！' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="ruleCode"
            label="规则编码"
            rules={[{ required: true, message: '请输入规则编码！' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="pointType"
            label="积分类型"
            rules={[{ required: true, message: '请选择积分类型！' }]}
          >
            <Select placeholder="请选择积分类型">
              <Option value={1}>获得积分</Option>
              <Option value={2}>消费积分</Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="points"
            label="分值"
            rules={[{ required: true, message: '请输入分值！', type: 'number' }]}
          >
            <InputNumber min={0} style={{ width: '100%' }} />
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
            name="description"
            label="描述"
          >
            <Input.TextArea rows={4} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default PointRuleList; 