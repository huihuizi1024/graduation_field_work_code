import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, Select, Space, message, Popconfirm } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';

const { Option } = Select;

const ExpertList = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingExpert, setEditingExpert] = useState(null);

  useEffect(() => {
    fetchExperts();
  }, []);

  const fetchExperts = async () => {
    setLoading(true);
    try {
      // 模拟数据
      const mockData = [
        { id: 'e1', name: '张专家', expertise: '人工智能', contact: '13812345678', status: 1, description: '在人工智能领域有深厚研究' },
        { id: 'e2', name: '李教授', expertise: '区块链技术', contact: 'expert_li@example.com', status: 1, description: '区块链技术资深专家' },
        { id: 'e3', name: '王博士', expertise: '数据分析', contact: 'wang.phd@example.com', status: 0, description: '数据挖掘和分析专家' },
      ];
      setData(mockData);
    } catch (error) {
      message.error('获取专家列表失败！');
      console.error('Error fetching experts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setEditingExpert(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleEdit = (record) => {
    setEditingExpert(record);
    form.setFieldsValue(record);
    setIsModalVisible(true);
  };

  const handleDelete = async (id) => {
    try {
      message.success('专家删除成功！');
      fetchExperts();
    } catch (error) {
      message.error('删除专家失败！');
      console.error('Error deleting expert:', error);
    }
  };

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);
      if (editingExpert) {
        message.success('专家更新成功！');
      } else {
        message.success('专家添加成功！');
      }
      setIsModalVisible(false);
      fetchExperts();
    } catch (error) {
      message.error('操作失败，请检查表单！');
      console.error('Error saving expert:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setEditingExpert(null);
    form.resetFields();
  };

  const columns = [
    {
      title: '姓名',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '专业领域',
      dataIndex: 'expertise',
      key: 'expertise',
    },
    {
      title: '联系方式',
      dataIndex: 'contact',
      key: 'contact',
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
            title="确定删除此专家吗？"
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
        添加专家
      </Button>
      <Table columns={columns} dataSource={data} rowKey="id" loading={loading} />

      <Modal
        title={editingExpert ? '编辑专家' : '添加专家'}
        open={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        confirmLoading={loading}
      >
        <Form form={form} layout="vertical" name="expert_form">
          <Form.Item
            name="name"
            label="姓名"
            rules={[{ required: true, message: '请输入姓名！' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="expertise"
            label="专业领域"
            rules={[{ required: true, message: '请输入专业领域！' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="contact"
            label="联系方式"
            rules={[{ required: true, message: '请输入联系方式！' }]}
          >
            <Input />
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

export default ExpertList; 