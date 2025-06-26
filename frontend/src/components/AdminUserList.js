import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, Select, Space, message, Popconfirm, InputNumber } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import axios from 'axios';

const { Option } = Select;

const AdminUserList = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0
  });
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  useEffect(() => {
    fetchAdminUsers();
  }, []);

  const fetchAdminUsers = async () => {
    setLoading(true);
    try {
      const result = await axios.get('/api/auth/users', {
        params: {
          page: pagination.current - 1,
          size: pagination.pageSize
        }
      });
      console.log('用户API响应:', result);
      if (result.data.code === 200) {
        setData(result.data.data?.records || []);
        setPagination({
          ...pagination,
          total: result.data.data?.total || 0,
          current: result.data.data?.current + 1 || 1,
          pageSize: result.data.data?.size || 10,
        });
      } else {
        message.error(result.data.message || '获取用户列表失败！');
      }
    } catch (error) {
      message.error('获取管理用户列表失败！');
      console.error('Error fetching admin users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setEditingUser(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleEdit = (record) => {
    setEditingUser(record);
    form.setFieldsValue(record);
    setIsModalVisible(true);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/auth/users/${id}`);
      message.success('管理用户删除成功！');
      fetchAdminUsers();
    } catch (error) {
      message.error('删除管理用户失败！');
      console.error('Error deleting admin user:', error);
    }
  };

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);
      if (editingUser) {
        await axios.put(`/api/auth/users/${editingUser.id}`, values);
        message.success('管理用户更新成功！');
      } else {
        await axios.post('/api/auth/users', values);
        message.success('管理用户添加成功！');
      }
      setIsModalVisible(false);
      fetchAdminUsers();
    } catch (error) {
      message.error('操作失败，请检查表单！');
      console.error('Error saving admin user:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setEditingUser(null);
    form.resetFields();
  };

  const columns = [
    {
      title: '用户名',
      dataIndex: 'username',
      key: 'username',
    },
    {
      title: '姓名',
      dataIndex: 'full_name',
      key: 'full_name',
    },
    {
      title: '角色',
      dataIndex: 'role',
      key: 'role',
      render: (role) => {
        const roleMap = {
          1: '学生',
          2: '教师',
          3: '专家',
          4: '管理员'
        };
        return roleMap[role] || role;
      }
    },
    {
      title: '邮箱',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: '手机号',
      dataIndex: 'phone',
      key: 'phone',
    },
    {
      title: '积分余额',
      dataIndex: 'pointsBalance',
      key: 'pointsBalance',
      render: (points) => points || '0.00'
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (status === 1 ? '正常' : '禁用')
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Button icon={<EditOutlined />} onClick={() => handleEdit(record)}>编辑</Button>
          <Popconfirm
            title="确定删除此用户吗？"
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
        添加管理用户
      </Button>
      <Table 
        columns={columns} 
        dataSource={data} 
        rowKey="id" 
        loading={loading}
        pagination={pagination}
        onChange={(newPagination) => {
          setPagination(newPagination);
          fetchAdminUsers();
        }}
      />

      <Modal
        title={editingUser ? '编辑管理用户' : '添加管理用户'}
        open={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        confirmLoading={loading}
      >
        <Form form={form} layout="vertical" name="admin_user_form">
          <Form.Item
            name="username"
            label="用户名"
            rules={[{ required: true, message: '请输入用户名！' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="fullName"
            label="姓名"
            rules={[{ required: true, message: '请输入姓名！' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="passwordHash"
            label="密码"
            rules={[{ required: true, message: '请输入密码！' }]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item
            name="role"
            label="角色"
            rules={[{ required: true, message: '请选择角色！' }]}
          >
            <Select placeholder="请选择角色">
              <Option value={1}>学生</Option>
              <Option value={2}>教师</Option>
              <Option value={3}>专家</Option>
              <Option value={4}>管理员</Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="email"
            label="邮箱"
            rules={[{ required: true, type: 'email', message: '请输入有效的邮箱地址！' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="phone"
            label="手机号"
            rules={[{ required: true, message: '请输入手机号！' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="pointsBalance"
            label="积分余额"
            rules={[{ type: 'number', message: '请输入有效数字' }]}
          >
            <InputNumber min={0} precision={2} style={{ width: '100%' }} />
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
        </Form>
      </Modal>
    </div>
  );
};

export default AdminUserList;
