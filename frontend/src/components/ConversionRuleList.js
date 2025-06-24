import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, InputNumber, Select, Space, message, Popconfirm } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';

const { Option } = Select;

const ConversionRuleList = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingRule, setEditingRule] = useState(null);

  useEffect(() => {
    fetchConversionRules();
  }, []);

  const fetchConversionRules = async () => {
    setLoading(true);
    try {
      // 模拟数据
      const mockData = [
        { id: 'c1', ruleName: '学分转积分', ruleCode: 'CREDIT_TO_POINT', conversionRate: 10, status: 1, description: '1学分等于10积分' },
        { id: 'c2', ruleName: '证书转学分', ruleCode: 'CERT_TO_CREDIT', conversionRate: 2, status: 1, description: '1个证书等于2学分' },
        { id: 'c3', ruleName: '积分转学分', ruleCode: 'POINT_TO_CREDIT', conversionRate: 0.1, status: 0, description: '10积分等于1学分' },
      ];
      setData(mockData);
    } catch (error) {
      message.error('获取转换规则失败！');
      console.error('Error fetching conversion rules:', error);
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
      message.success('转换规则删除成功！');
      fetchConversionRules();
    } catch (error) {
      message.error('删除转换规则失败！');
      console.error('Error deleting conversion rule:', error);
    }
  };

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);
      if (editingRule) {
        message.success('转换规则更新成功！');
      } else {
        message.success('转换规则添加成功！');
      }
      setIsModalVisible(false);
      fetchConversionRules();
    } catch (error) {
      message.error('操作失败，请检查表单！');
      console.error('Error saving conversion rule:', error);
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
      title: '转换比例',
      dataIndex: 'conversionRate',
      key: 'conversionRate',
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
        添加转换规则
      </Button>
      <Table columns={columns} dataSource={data} rowKey="id" loading={loading} />

      <Modal
        title={editingRule ? '编辑转换规则' : '添加转换规则'}
        open={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        confirmLoading={loading}
      >
        <Form form={form} layout="vertical" name="conversion_rule_form">
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
            name="conversionRate"
            label="转换比例"
            rules={[{ required: true, message: '请输入转换比例！', type: 'number' }]}
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

export default ConversionRuleList; 