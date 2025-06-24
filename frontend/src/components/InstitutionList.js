import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, Select, Space, message, Popconfirm } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';

const { Option } = Select;

const InstitutionList = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingInstitution, setEditingInstitution] = useState(null);

  useEffect(() => {
    fetchInstitutions();
  }, []);

  const fetchInstitutions = async () => {
    setLoading(true);
    try {
      // 模拟数据
      const mockData = [
        { id: 'i1', name: '国家开放大学', code: 'GKD', type: '大学', contactPerson: '李老师', contactPhone: '010-12345678', status: 1, description: '终身教育国家级大学' },
        { id: 'i2', name: 'XX职业技术学院', code: 'XXZY', type: '职业院校', contactPerson: '王主任', contactPhone: '021-87654321', status: 1, description: '提供多种职业技能培训' },
        { id: 'i3', name: 'ABC教育培训中心', code: 'ABC_EDU', type: '培训机构', contactPerson: '赵经理', contactPhone: '0755-11223344', status: 0, description: '专注于成人职业技能培训' },
      ];
      setData(mockData);
    } catch (error) {
      message.error('获取机构列表失败！');
      console.error('Error fetching institutions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setEditingInstitution(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleEdit = (record) => {
    setEditingInstitution(record);
    form.setFieldsValue(record);
    setIsModalVisible(true);
  };

  const handleDelete = async (id) => {
    try {
      message.success('机构删除成功！');
      fetchInstitutions();
    } catch (error) {
      message.error('删除机构失败！');
      console.error('Error deleting institution:', error);
    }
  };

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);
      if (editingInstitution) {
        message.success('机构更新成功！');
      } else {
        message.success('机构添加成功！');
      }
      setIsModalVisible(false);
      fetchInstitutions();
    } catch (error) {
      message.error('操作失败，请检查表单！');
      console.error('Error saving institution:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setEditingInstitution(null);
    form.resetFields();
  };

  const columns = [
    {
      title: '机构名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '机构编码',
      dataIndex: 'code',
      key: 'code',
    },
    {
      title: '机构类型',
      dataIndex: 'type',
      key: 'type',
    },
    {
      title: '联系人',
      dataIndex: 'contactPerson',
      key: 'contactPerson',
    },
    {
      title: '联系电话',
      dataIndex: 'contactPhone',
      key: 'contactPhone',
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
            title="确定删除此机构吗？"
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
        添加机构
      </Button>
      <Table columns={columns} dataSource={data} rowKey="id" loading={loading} />

      <Modal
        title={editingInstitution ? '编辑机构' : '添加机构'}
        open={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        confirmLoading={loading}
      >
        <Form form={form} layout="vertical" name="institution_form">
          <Form.Item
            name="name"
            label="机构名称"
            rules={[{ required: true, message: '请输入机构名称！' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="code"
            label="机构编码"
            rules={[{ required: true, message: '请输入机构编码！' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="type"
            label="机构类型"
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="contactPerson"
            label="联系人"
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="contactPhone"
            label="联系电话"
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

export default InstitutionList; 