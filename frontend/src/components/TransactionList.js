import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, Select, Space, message, Popconfirm, DatePicker, InputNumber, Empty } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import * as transactionAPI from '../api/transaction';

const { Option } = Select;

const TransactionList = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);

  useEffect(() => {
    const controller = new AbortController();
    fetchTransactions(controller.signal);
    return () => controller.abort();
  }, []);

  const fetchTransactions = async (signal) => {
    setLoading(true);
    try {
      const response = await transactionAPI.getTransactions({ page: 0, size: 10 }, { signal });
      console.log('交易记录API响应:', {
        status: response.code,
        data: response.data,
        timestamp: new Date(response.timestamp).toLocaleString()
      });

      if (response.data?.records) {
        setData(response.data.records.map(item => ({
          ...item,
          transactionDate: dayjs(item.transactionTime),
          amount: item.pointsChange
        })));
      } else {
        message.info('暂无交易记录数据');
        setData([]);
      }
    } catch (error) {
      if (error.name !== 'AbortError') {
        message.error('获取交易记录失败！');
        console.error('Error fetching transactions:', error);
      }
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
    form.setFieldsValue({ 
      ...record,
      transactionDate: dayjs(record.transactionDate)
    });
    setIsModalVisible(true);
  };

  const handleDelete = async (id) => {
    try {
      await transactionAPI.deleteTransaction(id);
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
      const transactionData = {
        ...values,
        transactionTime: values.transactionDate ? values.transactionDate.startOf('day').format('YYYY-MM-DD HH:mm:ss') : null,
        pointsChange: values.amount
      };

      if (editingTransaction) {
        await transactionAPI.updateTransaction(editingTransaction.id, transactionData);
        message.success('交易记录更新成功！');
      } else {
        await transactionAPI.createTransaction(transactionData);
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
      dataIndex: 'id',
      key: 'id',
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
      render: (type) => (type === 1 ? '获取' : type === 2 ? '消费' : '过期'),
    },
    {
      title: '金额/分值',
      dataIndex: 'amount',
      key: 'amount',
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
      <Table 
        columns={columns} 
        dataSource={data} 
        rowKey="id" 
        loading={loading}
        locale={{
          emptyText: <Empty description="暂无交易记录" />
        }}
      />

      <Modal
        title={editingTransaction ? '编辑交易记录' : '添加交易记录'}
        open={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        confirmLoading={loading}
      >
        <Form form={form} layout="vertical" name="transaction_form">
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
              <Option value={3}>过期</Option>
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
