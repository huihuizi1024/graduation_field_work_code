import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, InputNumber, Select, Space, message, Popconfirm } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';

const { Option } = Select;

const API_BASE_URL = 'http://localhost:8080/api/point-rules'; // 后端API基础URL

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
      const response = await fetch(API_BASE_URL);
      const result = await response.json();
      if (result.code === 200) {
        setData(result.data.content); // 后端返回的是PageResponse，数据在content字段
      } else {
        message.error(`获取积分规则失败: ${result.message}`);
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
    setIsModalVisible(true);
  };

  const handleEdit = (record) => {
    setEditingRule(record);
    form.setFieldsValue(record);
    setIsModalVisible(true);
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/${id}`, { method: 'DELETE' });
      const result = await response.json();
      if (result.code === 200) {
        message.success('积分规则删除成功！');
        fetchPointRules(); // 刷新列表
      } else {
        message.error(`删除积分规则失败: ${result.message}`);
      }
    } catch (error) {
      message.error('删除积分规则失败！');
      console.error('Error deleting point rule:', error);
    }
  };

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);
      let response;
      let result;
      if (editingRule) {
        // 编辑
        response = await fetch(`${API_BASE_URL}/${editingRule.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(values),
        });
        result = await response.json();
        if (result.code === 200) {
          message.success('积分规则更新成功！');
        } else {
          message.error(`积分规则更新失败: ${result.message}`);
        }
      } else {
        // 添加
        response = await fetch(API_BASE_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(values),
        });
        result = await response.json();
        if (result.code === 200) {
          message.success('积分规则添加成功！');
        } else {
          message.error(`积分规则添加失败: ${result.message}`);
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