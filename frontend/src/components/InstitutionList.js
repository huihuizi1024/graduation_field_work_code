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

  const institutionTypeMap = {
    1: '高等院校',
    2: '职业院校',
    3: '培训机构',
    4: '社会组织',
  };

  useEffect(() => {
    fetchInstitutions();
  }, []);

  const fetchInstitutions = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/institutions'); // 使用相对路径，利用proxy
      if (!response.ok) {
        throw new Error('网络响应错误');
      }
      const result = await response.json();
      console.log('API响应:', result); // 添加调试日志
      if (result.code === 200) {
        // 后端返回的数据结构是 { code: 200, message: "操作成功", data: { records: [...] } }
        // 我们需要的是 data.records 数组
        setData(result.data.records || []);
      } else {
        message.error(result.message || '获取机构列表失败！');
      }
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
      dataIndex: 'institutionName',
      key: 'institutionName',
    },
    {
      title: '机构编码',
      dataIndex: 'institutionCode',
      key: 'institutionCode',
    },
    {
      title: '机构类型',
      dataIndex: 'institutionType',
      key: 'institutionType',
      render: (type) => institutionTypeMap[type] || '未知',
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
      dataIndex: 'institutionDescription',
      key: 'institutionDescription',
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
            name="institutionName"
            label="机构名称"
            rules={[{ required: true, message: '请输入机构名称！' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="institutionCode"
            label="机构编码"
            rules={[{ required: true, message: '请输入机构编码！' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="institutionType"
            label="机构类型"
            rules={[{ required: true, message: '请选择机构类型！' }]}
          >
            <Select placeholder="请选择机构类型">
              <Option value={1}>高等院校</Option>
              <Option value={2}>职业院校</Option>
              <Option value={3}>培训机构</Option>
              <Option value={4}>社会组织</Option>
            </Select>
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
            name="institutionDescription"
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