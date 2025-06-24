import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, Select, Space, message, Popconfirm, DatePicker } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';

const { Option } = Select;

const ProjectList = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingProject, setEditingProject] = useState(null);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    setLoading(true);
    try {
      // 模拟数据
      const mockData = [
        { id: 'p1', projectName: '学分银行系统一期', projectCode: 'XYH_P1',负责人: '张三', startDate: '2024-01-01', endDate: '2024-12-31', status: 1, description: '学分银行系统核心功能开发' },
        { id: 'p2', projectName: '积分管理模块优化', projectCode: 'POINT_OPT',负责人: '李四', startDate: '2025-03-01', endDate: '2025-06-30', status: 1, description: '提升积分计算和兑换效率' },
        { id: 'p3', projectName: '移动端APP开发', projectCode: 'MOBILE_APP',负责人: '王五', startDate: '2025-07-01', endDate: '2025-12-31', status: 0, description: '开发学分银行移动端应用' },
      ];
      setData(mockData.map(item => ({ ...item, startDate: dayjs(item.startDate), endDate: dayjs(item.endDate) })));
    } catch (error) {
      message.error('获取项目列表失败！');
      console.error('Error fetching projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setEditingProject(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleEdit = (record) => {
    setEditingProject(record);
    form.setFieldsValue({ ...record, startDate: dayjs(record.startDate), endDate: dayjs(record.endDate) });
    setIsModalVisible(true);
  };

  const handleDelete = async (id) => {
    try {
      message.success('项目删除成功！');
      fetchProjects();
    } catch (error) {
      message.error('删除项目失败！');
      console.error('Error deleting project:', error);
    }
  };

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);
      const formattedValues = {
        ...values,
        startDate: values.startDate ? values.startDate.format('YYYY-MM-DD') : null,
        endDate: values.endDate ? values.endDate.format('YYYY-MM-DD') : null,
      };

      if (editingProject) {
        message.success('项目更新成功！');
      } else {
        message.success('项目添加成功！');
      }
      setIsModalVisible(false);
      fetchProjects();
    } catch (error) {
      message.error('操作失败，请检查表单！');
      console.error('Error saving project:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setEditingProject(null);
    form.resetFields();
  };

  const columns = [
    {
      title: '项目名称',
      dataIndex: 'projectName',
      key: 'projectName',
    },
    {
      title: '项目编码',
      dataIndex: 'projectCode',
      key: 'projectCode',
    },
    {
      title: '负责人',
      dataIndex: '负责人',
      key: '负责人',
    },
    {
      title: '开始日期',
      dataIndex: 'startDate',
      key: 'startDate',
      render: (text) => text ? dayjs(text).format('YYYY-MM-DD') : '',
    },
    {
      title: '结束日期',
      dataIndex: 'endDate',
      key: 'endDate',
      render: (text) => text ? dayjs(text).format('YYYY-MM-DD') : '',
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (status === 1 ? '进行中' : '已完成'),
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
            title="确定删除此项目吗？"
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
        添加项目
      </Button>
      <Table columns={columns} dataSource={data} rowKey="id" loading={loading} />

      <Modal
        title={editingProject ? '编辑项目' : '添加项目'}
        open={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        confirmLoading={loading}
      >
        <Form form={form} layout="vertical" name="project_form">
          <Form.Item
            name="projectName"
            label="项目名称"
            rules={[{ required: true, message: '请输入项目名称！' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="projectCode"
            label="项目编码"
            rules={[{ required: true, message: '请输入项目编码！' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="负责人"
            label="负责人"
            rules={[{ required: true, message: '请输入负责人！' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="startDate"
            label="开始日期"
            rules={[{ required: true, message: '请选择开始日期！' }]}
          >
            <DatePicker style={{ width: '100%' }} format="YYYY-MM-DD" />
          </Form.Item>
          <Form.Item
            name="endDate"
            label="结束日期"
            rules={[{ required: true, message: '请选择结束日期！' }]}
          >
            <DatePicker style={{ width: '100%' }} format="YYYY-MM-DD" />
          </Form.Item>
          <Form.Item
            name="status"
            label="状态"
            rules={[{ required: true, message: '请选择状态！' }]}
          >
            <Select placeholder="请选择状态">
              <Option value={1}>进行中</Option>
              <Option value={0}>已完成</Option>
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

export default ProjectList; 