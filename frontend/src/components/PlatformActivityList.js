import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, Select, Space, message, Popconfirm, DatePicker } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';

const { Option } = Select;

const PlatformActivityList = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingActivity, setEditingActivity] = useState(null);

  useEffect(() => {
    fetchPlatformActivities();
  }, []);

  const fetchPlatformActivities = async () => {
    setLoading(true);
    try {
      // 模拟数据
      const mockData = [
        { id: 'a1', activityName: '迎新积分赠送', activityCode: 'NEW_USER_BONUS', startTime: '2025-01-01', endTime: '2025-01-31', status: 1, description: '新用户注册并完成实名认证赠送积分' },
        { id: 'a2', activityName: '学分兑换优惠', activityCode: 'CREDIT_DISCOUNT', startTime: '2025-03-01', endTime: '2025-03-15', status: 1, description: '学分兑换商品限时优惠' },
        { id: 'a3', activityName: '年度学分清零', activityCode: 'YEAR_END_CLEAN', startTime: '2025-12-01', endTime: '2025-12-31', status: 0, description: '年度学分清零活动通知' },
      ];
      setData(mockData.map(item => ({ ...item, startTime: dayjs(item.startTime), endTime: dayjs(item.endTime) })));
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
    form.setFieldsValue({ ...record, startTime: dayjs(record.startTime), endTime: dayjs(record.endTime) });
    setIsModalVisible(true);
  };

  const handleDelete = async (id) => {
    try {
      message.success('平台活动删除成功！');
      fetchPlatformActivities();
    } catch (error) {
      message.error('删除平台活动失败！');
      console.error('Error deleting platform activity:', error);
    }
  };

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);
      // 转换日期格式为字符串，以便后端处理
      const formattedValues = {
        ...values,
        startTime: values.startTime ? values.startTime.format('YYYY-MM-DD') : null,
        endTime: values.endTime ? values.endTime.format('YYYY-MM-DD') : null,
      };

      if (editingActivity) {
        message.success('平台活动更新成功！');
      } else {
        message.success('平台活动添加成功！');
      }
      setIsModalVisible(false);
      fetchPlatformActivities();
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

  const columns = [
    {
      title: '活动名称',
      dataIndex: 'activityName',
      key: 'activityName',
    },
    {
      title: '活动编码',
      dataIndex: 'activityCode',
      key: 'activityCode',
    },
    {
      title: '开始时间',
      dataIndex: 'startTime',
      key: 'startTime',
      render: (text) => text ? dayjs(text).format('YYYY-MM-DD') : '',
    },
    {
      title: '结束时间',
      dataIndex: 'endTime',
      key: 'endTime',
      render: (text) => text ? dayjs(text).format('YYYY-MM-DD') : '',
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
      <Table columns={columns} dataSource={data} rowKey="id" loading={loading} />

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

export default PlatformActivityList; 