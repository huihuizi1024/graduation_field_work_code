import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, Select, Space, message, Popconfirm, DatePicker, Pagination } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, SwapOutlined, SearchOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import api from '../api';

const { Option } = Select;

const PlatformActivityList = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingActivity, setEditingActivity] = useState(null);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [filters, setFilters] = useState({});

  useEffect(() => {
    fetchPlatformActivities({ ...pagination, ...filters });
  }, [pagination.current, pagination.pageSize, filters]);

  const fetchPlatformActivities = async (params = {}) => {
    setLoading(true);
    try {
      const result = await api.get('/api/platform-activities', {
        params: {
          page: params.current - 1,
          size: params.pageSize,
          activityName: params.activityName,
          activityCode: params.activityCode,
          status: params.status,
        },
      });
      
      console.log('平台活动API响应:', result);
      if (result.code === 200) {
        setData(result.data?.records?.map(item => ({
          ...item,
          startTime: item.startTime ? dayjs(item.startTime) : null,
          endTime: item.endTime ? dayjs(item.endTime) : null,
        })) || []);
        setPagination({
          ...pagination,
          total: result.data?.total || 0,
          current: result.data?.current || 1,
          pageSize: result.data?.size || 10,
        });
      } else {
        message.error(result.message || '获取平台活动失败！');
      }
      
      setData(result.data.records.map(item => ({
        ...item,
        startTime: item.startTime ? dayjs(item.startTime) : null,
        endTime: item.endTime ? dayjs(item.endTime) : null,
      })));
      setPagination({
        ...pagination,
        total: result.data.total || 0,
        current: result.data.current || 1,
        pageSize: result.data.size || 10,
      });
    } catch (error) {
      message.error('获取平台活动失败！');
      console.error('Error fetching platform activities:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setEditingActivity(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleEdit = (record) => {
    setEditingActivity(record);
    form.setFieldsValue({
      ...record,
      startTime: record.startTime ? dayjs(record.startTime) : null,
      endTime: record.endTime ? dayjs(record.endTime) : null,
      activityName: record.activityName,
      activityCode: record.activityCode,
      activityDescription: record.activityDescription,
      imageUrl: record.imageUrl,
      activityType: record.activityType,
      status: record.status,
    });
    setIsModalVisible(true);
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/api/platform-activities/${id}`);
      message.success('平台活动删除成功！');
      fetchPlatformActivities({ ...pagination, ...filters });
    } catch (error) {
      message.error('删除平台活动失败！');
      console.error('Error deleting platform activity:', error);
    }
  };

  const handleStatusChange = async (record) => {
    try {
      const newStatus = record.status === 1 ? 0 : 1;
      await api.put(`/api/platform-activities/${record.id}/status`, null, {
        params: { status: newStatus }
      });
      message.success('平台活动状态更新成功！');
      fetchPlatformActivities({ ...pagination, ...filters });
    } catch (error) {
      message.error('更新平台活动状态失败！');
      console.error('Error updating platform activity status:', error);
    }
  };

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);
      const formattedValues = {
        ...values,
        startTime: values.startTime ? values.startTime.format('YYYY-MM-DD HH:mm:ss') : null,
        endTime: values.endTime ? values.endTime.format('YYYY-MM-DD HH:mm:ss') : null,
      };

      if (editingActivity) {
        console.log('更新活动请求数据:', { id: editingActivity.id, data: formattedValues });
      const response = await api.put(`/api/platform-activities/${editingActivity.id}`, formattedValues);
      console.log('平台活动API响应:', response);
      if (response.code === 200) {
        message.success('平台活动更新成功！');
      } else {
        message.error(response.message || '更新平台活动失败！');
      }
      } else {
        console.log('新增活动请求数据:', formattedValues);
        const response = await api.post('/api/platform-activities', formattedValues);
        console.log('平台活动API响应:', response);
        if (response.code === 200) {
          message.success('平台活动添加成功！');
        } else {
          message.error(response.message || '添加平台活动失败！');
        }
      }
      setIsModalVisible(false);
      setEditingActivity(null);
      form.resetFields();
      fetchPlatformActivities({ ...pagination, ...filters });
    } catch (error) {
      message.error('操作失败，请检查表单！');
      console.error('Error saving platform activity:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setEditingActivity(null);
    form.resetFields();
  };

  const handleTableChange = (pagination, filters, sorter) => {
    setPagination(pagination);
    setFilters(filters);
    fetchPlatformActivities({ ...pagination, ...filters, ...sorter });
  };

  const columns = [
    {
      title: '活动名称',
      dataIndex: 'activityName',
      key: 'activityName',
      sorter: true,
      filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
        <div style={{ padding: 8 }}>
          <Input
            placeholder="搜索活动名称"
            value={selectedKeys[0]}
            onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
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
            <Button onClick={() => clearFilters()} size="small" style={{ width: 90 }}>
              重置
            </Button>
          </Space>
        </div>
      ),
      filterIcon: filtered => <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />,
      onFilter: (value, record) => record.activityName.toLowerCase().includes(value.toLowerCase()),
    },
    {
      title: '活动编码',
      dataIndex: 'activityCode',
      key: 'activityCode',
      sorter: true,
      filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
        <div style={{ padding: 8 }}>
          <Input
            placeholder="搜索活动编码"
            value={selectedKeys[0]}
            onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
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
            <Button onClick={() => clearFilters()} size="small" style={{ width: 90 }}>
              重置
            </Button>
          </Space>
        </div>
      ),
      filterIcon: filtered => <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />,
      onFilter: (value, record) => record.activityCode.toLowerCase().includes(value.toLowerCase()),
    },
    {
      title: '活动图片URL',
      dataIndex: 'imageUrl',
      key: 'imageUrl',
      ellipsis: true,
      render: (text) => text ? <a href={text} target="_blank" rel="noopener noreferrer">{text.substring(0, 30)}...</a> : '-',
    },
    {
      title: '开始时间',
      dataIndex: 'startTime',
      key: 'startTime',
      render: (text) => text ? dayjs(text).format('YYYY-MM-DD') : '',
      sorter: true,
    },
    {
      title: '结束时间',
      dataIndex: 'endTime',
      key: 'endTime',
      render: (text) => text ? dayjs(text).format('YYYY-MM-DD') : '',
      sorter: true,
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (status === 1 ? '启用' : '禁用'),
      filters: [
        { text: '启用', value: 1 },
        { text: '禁用', value: 0 },
      ],
      onFilter: (value, record) => record.status === value,
    },
    {
      title: '描述',
      dataIndex: 'activityDescription',
      key: 'activityDescription',
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Button icon={<EditOutlined />} onClick={() => handleEdit(record)}>编辑</Button>
          <Button
            icon={<SwapOutlined />}
            onClick={() => handleStatusChange(record)}
            type={record.status === 1 ? 'default' : 'primary'}
          >
            {record.status === 1 ? '禁用' : '启用'}
          </Button>
          <Popconfirm
            title="确定删除此活动吗？"
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
        添加平台活动
      </Button>
      <Table
        columns={columns}
        dataSource={data}
        rowKey="id"
        loading={loading}
        pagination={pagination}
        onChange={handleTableChange}
      />

      <Modal
        title={editingActivity ? '编辑平台活动' : '添加平台活动'}
        open={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        confirmLoading={loading}
      >
        <Form form={form} layout="vertical" name="platform_activity_form">
          <Form.Item
            name="activityName"
            label="活动名称"
            rules={[{ required: true, message: '请输入活动名称！' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="activityCode"
            label="活动编码"
            rules={[{ required: true, message: '请输入活动编码！' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="imageUrl"
            label="活动图片URL"
          >
            <Input placeholder="请输入活动图片URL，例如：https://picsum.photos/1200/400?random=1" />
          </Form.Item>
          <Form.Item
            name="startTime"
            label="开始时间"
            rules={[{ required: true, message: '请选择开始时间！' }]}
          >
            <DatePicker style={{ width: '100%' }} format="YYYY-MM-DD" />
          </Form.Item>
          <Form.Item
            name="endTime"
            label="结束时间"
            rules={[{ required: true, message: '请选择结束时间！' }]}
          >
            <DatePicker style={{ width: '100%' }} format="YYYY-MM-DD" />
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
            name="activityDescription"
            label="活动描述"
          >
            <Input.TextArea rows={4} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default PlatformActivityList;
