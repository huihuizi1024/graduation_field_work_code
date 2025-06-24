import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, Select, Space, message, Popconfirm, DatePicker, InputNumber } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';

const { Option } = Select;

const TransactionList = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    setLoading(true);
    try {
      // 模拟数据
      const mockData = [
        { id: 't1', transactionId: 'TXN2025001', userId: 'user001', transactionType: 1, amount: 100, status: 1, transactionDate: '2025-06-20', description: '积分获取：签到奖励' },
        { id: 't2', transactionId: 'TXN2025002', userId: 'user002', transactionType: 2, amount: 50, status: 1, transactionDate: '2025-06-21', description: '积分消费：兑换礼品' },
        { id: 't3', transactionId: 'TXN2025003', userId: 'user001', transactionType: 1, amount: 200, status: 0, transactionDate: '2025-06-22', description: '学分获取：课程完成' },
      ];
      setData(mockData.map(item => ({ ...item, transactionDate: dayjs(item.transactionDate) })));
    } catch (error) {
      message.error('获取交易记录失败！');
      console.error('Error fetching transactions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setEditingTransaction(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleEdit = (record) => {
    setEditingTransaction(record);
    form.setFieldsValue({ ...record, transactionDate: dayjs(record.transactionDate) });
    setIsModalVisible(true);
  };

  const handleDelete = async (id) => {
    try {
      message.success('交易记录删除成功！');
      fetchTransactions();
    } catch (error) {
      message.error('删除交易记录失败！');
      console.error('Error deleting transaction:', error);
    }
  };

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);
      const formattedValues = {
        ...values,
        transactionDate: values.transactionDate ? values.transactionDate.format('YYYY-MM-DD') : null,
      };

      if (editingTransaction) {
        message.success('交易记录更新成功！');
      } else {
        message.success('交易记录添加成功！');
      }
      setIsModalVisible(false);
      fetchTransactions();
    } catch (error) {
      message.error('操作失败，请检查表单！');
      console.error('Error saving transaction:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setEditingTransaction(null);
    form.resetFields();
  };

  const columns = [
    {
      title: '交易ID',
      dataIndex: 'transactionId',
      key: 'transactionId',
    },
    {
      title: '用户ID',
      dataIndex: 'userId',
      key: 'userId',
    },
    {
      title: '交易类型',
      dataIndex: 'transactionType',
      key: 'transactionType',
      render: (type) => (type === 1 ? '获取' : '消费'),
    },
    {
      title: '金额/分值',
      dataIndex: 'amount',
      key: 'amount',
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (status === 1 ? '成功' : '失败'),
    },
    {
      title: '交易日期',
      dataIndex: 'transactionDate',
      key: 'transactionDate',
      render: (text) => text ? dayjs(text).format('YYYY-MM-DD') : '',
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
            title="确定删除此交易记录吗？"
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
        添加交易记录
      </Button>
      <Table columns={columns} dataSource={data} rowKey="id" loading={loading} />

      <Modal
        title={editingTransaction ? '编辑交易记录' : '添加交易记录'}
        open={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        confirmLoading={loading}
      >
        <Form form={form} layout="vertical" name="transaction_form">
          <Form.Item
            name="transactionId"
            label="交易ID"
            rules={[{ required: true, message: '请输入交易ID！' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="userId"
            label="用户ID"
            rules={[{ required: true, message: '请输入用户ID！' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="transactionType"
            label="交易类型"
            rules={[{ required: true, message: '请选择交易类型！' }]}
          >
            <Select placeholder="请选择交易类型">
              <Option value={1}>获取</Option>
              <Option value={2}>消费</Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="amount"
            label="金额/分值"
            rules={[{ required: true, message: '请输入金额或分值！', type: 'number' }]}
          >
            <InputNumber min={0} style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item
            name="status"
            label="状态"
            rules={[{ required: true, message: '请选择状态！' }]}
          >
            <Select placeholder="请选择状态">
              <Option value={1}>成功</Option>
              <Option value={0}>失败</Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="transactionDate"
            label="交易日期"
            rules={[{ required: true, message: '请选择交易日期！' }]}
          >
            <DatePicker style={{ width: '100%' }} format="YYYY-MM-DD" />
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

export default TransactionList; 