import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, Select, Space, message, Popconfirm } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';

const { Option } = Select;

const BusinessProcessList = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingProcess, setEditingProcess] = useState(null);

  useEffect(() => {
    fetchBusinessProcesses();
  }, []);

  const fetchBusinessProcesses = async () => {
    setLoading(true);
    try {
      // 模拟数据
      const mockData = [
        { id: 'bp1', processName: '学分认定流程', processCode: 'CREDIT_RECOG', status: 1, description: '终身学习学分认定审批流程' },
        { id: 'bp2', processName: '积分兑换流程', processCode: 'POINT_EXCHANGE', status: 1, description: '积分兑换奖品或学分的流程' },
        { id: 'bp3', processName: '机构入驻审批', processCode: 'INST_APPROVAL', status: 0, description: '新机构申请入驻平台审批流程' },
      ];
      setData(mockData);
    } catch (error) {
      message.error('获取业务流程失败！');
      console.error('Error fetching business processes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setEditingProcess(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleEdit = (record) => {
    setEditingProcess(record);
    form.setFieldsValue(record);
    setIsModalVisible(true);
  };

  const handleDelete = async (id) => {
    try {
      message.success('业务流程删除成功！');
      fetchBusinessProcesses();
    } catch (error) {
      message.error('删除业务流程失败！');
      console.error('Error deleting business process:', error);
    }
  };

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);
      if (editingProcess) {
        message.success('业务流程更新成功！');
      } else {
        message.success('业务流程添加成功！');
      }
      setIsModalVisible(false);
      fetchBusinessProcesses();
    } catch (error) {
      message.error('操作失败，请检查表单！');
      console.error('Error saving business process:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setEditingProcess(null);
    form.resetFields();
  };

  const columns = [
    {
      title: '流程名称',
      dataIndex: 'processName',
      key: 'processName',
    },
    {
      title: '流程编码',
      dataIndex: 'processCode',
      key: 'processCode',
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
            title="确定删除此流程吗？"
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
        添加业务流程
      </Button>
      <Table columns={columns} dataSource={data} rowKey="id" loading={loading} />

      <Modal
        title={editingProcess ? '编辑业务流程' : '添加业务流程'}
        open={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        confirmLoading={loading}
      >
        <Form form={form} layout="vertical" name="business_process_form">
          <Form.Item
            name="processName"
            label="流程名称"
            rules={[{ required: true, message: '请输入流程名称！' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="processCode"
            label="流程编码"
            rules={[{ required: true, message: '请输入流程编码！' }]}
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

export default BusinessProcessList; 