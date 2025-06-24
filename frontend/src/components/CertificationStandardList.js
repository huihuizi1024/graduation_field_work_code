import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, Select, Space, message, Popconfirm } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';

const { Option } = Select;

const CertificationStandardList = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingStandard, setEditingStandard] = useState(null);

  useEffect(() => {
    fetchCertificationStandards();
  }, []);

  const fetchCertificationStandards = async () => {
    setLoading(true);
    try {
      // 模拟数据
      const mockData = [
        { id: 's1', name: '国家职业资格一级', code: 'NQCC1', level: '一级', status: 1, description: '国家级职业资格认证' },
        { id: 's2', name: '行业技能认证', code: 'ISAC_BASIC', level: '初级', status: 1, description: '特定行业技能认证' },
        { id: 's3', name: '企业内部培训认证', code: 'COMPANY_TRAIN', level: '不分级', status: 0, description: '公司内部培训通过认证' },
      ];
      setData(mockData);
    } catch (error) {
      message.error('获取认证标准失败！');
      console.error('Error fetching certification standards:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setEditingStandard(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleEdit = (record) => {
    setEditingStandard(record);
    form.setFieldsValue(record);
    setIsModalVisible(true);
  };

  const handleDelete = async (id) => {
    try {
      message.success('认证标准删除成功！');
      fetchCertificationStandards();
    } catch (error) {
      message.error('删除认证标准失败！');
      console.error('Error deleting certification standard:', error);
    }
  };

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);
      if (editingStandard) {
        message.success('认证标准更新成功！');
      } else {
        message.success('认证标准添加成功！');
      }
      setIsModalVisible(false);
      fetchCertificationStandards();
    } catch (error) {
      message.error('操作失败，请检查表单！');
      console.error('Error saving certification standard:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setEditingStandard(null);
    form.resetFields();
  };

  const columns = [
    {
      title: '标准名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '标准编码',
      dataIndex: 'code',
      key: 'code',
    },
    {
      title: '等级',
      dataIndex: 'level',
      key: 'level',
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
            title="确定删除此标准吗？"
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
        添加认证标准
      </Button>
      <Table columns={columns} dataSource={data} rowKey="id" loading={loading} />

      <Modal
        title={editingStandard ? '编辑认证标准' : '添加认证标准'}
        open={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        confirmLoading={loading}
      >
        <Form form={form} layout="vertical" name="certification_standard_form">
          <Form.Item
            name="name"
            label="标准名称"
            rules={[{ required: true, message: '请输入标准名称！' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="code"
            label="标准编码"
            rules={[{ required: true, message: '请输入标准编码！' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="level"
            label="等级"
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

export default CertificationStandardList; 