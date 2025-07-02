import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, Select, Space, message, Popconfirm, DatePicker, InputNumber, Upload } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, UploadOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import api from '../api';

const { Option } = Select;
const { TextArea } = Input;

const ProjectList = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0
  });
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [userInfo, setUserInfo] = useState(null);
  const [fileList, setFileList] = useState([]);

  useEffect(() => {
    fetchProjects();
    fetchUserInfo();
  }, []);

  const fetchUserInfo = async () => {
    try {
      const storedUser = localStorage.getItem('userInfo');
      if (storedUser) {
        const userInfo = JSON.parse(storedUser);
        setUserInfo(userInfo);
      }
    } catch (error) {
      console.error('获取用户信息失败:', error);
    }
  };

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const result = await api.get('/api/projects', {
        params: {
          page: pagination.current - 1,
          size: pagination.pageSize,
          institutionId: userInfo?.institutionId
        }
      });
      console.log('项目API响应:', result.data);
      if (result.data) {
        const records = result.data.records || result.data.data?.records || result.data.data || [];
        const formattedProjects = records.map(item => ({
          ...item,
          instructor: item.manager,
          startDate: item.startDate ? dayjs(item.startDate) : null,
          endDate: item.endDate ? dayjs(item.endDate) : null,
          category: item.category || 1
        }));
        setData(formattedProjects);
        setPagination({
          ...pagination,
          total: result.data.data?.total || 0,
          current: result.data.data?.current + 1 || 1,
          pageSize: result.data.data?.size || 10,
        });
      } else {
        message.error(result.data.message || '获取项目列表失败！');
      }
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
    form.setFieldsValue({
      status: 1,
      pointsReward: 5,
      viewCount: 0,
      category: 1,
      institutionId: userInfo?.institutionId
    });
    setFileList([]);
    setIsModalVisible(true);
  };

  const handleEdit = (record) => {
    setEditingProject(record);
    form.setFieldsValue({ 
      ...record, 
      startDate: dayjs(record.startDate), 
      endDate: dayjs(record.endDate),
      institutionId: record.institutionId || userInfo?.institutionId
    });
    setFileList([]);
    if (record.coverImageUrl) {
      setFileList([
        {
          uid: '-1',
          name: 'cover.jpg',
          status: 'done',
          url: record.coverImageUrl,
        },
      ]);
    }
    setIsModalVisible(true);
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/api/projects/${id}`);
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
      const projectData = {
        projectName: values.projectName,
        projectCode: values.projectCode,
        manager: values.instructor,
        startDate: values.startDate ? values.startDate.format('YYYY-MM-DD') : null,
        endDate: values.endDate ? values.endDate.format('YYYY-MM-DD') : null,
        status: values.status,
        description: values.description || '',
        institutionId: values.institutionId || userInfo?.institutionId,
        category: values.category,
        videoUrl: values.videoUrl,
        coverImageUrl: values.coverImageUrl,
        pointsReward: values.pointsReward,
        duration: values.duration,
        viewCount: values.viewCount || 0
      };
      console.log('发送的项目数据:', projectData);

      if (editingProject) {
        await api.put(`/api/projects/${editingProject.id}`, projectData);
        message.success('项目更新成功！');
      } else {
        await api.post('/api/projects', projectData);
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
    setFileList([]);
  };

  // 封面图片上传处理
  const handleUploadChange = ({ fileList }) => {
    setFileList(fileList);
    if (fileList.length > 0 && fileList[0].status === 'done' && fileList[0].response) {
      form.setFieldsValue({ coverImageUrl: fileList[0].response.url });
    }
  };

  const handleUploadBeforeUpload = (file) => {
    const isImage = file.type.startsWith('image/');
    if (!isImage) {
      message.error('只能上传图片文件!');
      return false;
    }
    
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error('图片必须小于2MB!');
      return false;
    }
    
    return true;
  };

  // 获取项目分类名称
  const getCategoryName = (category) => {
    switch (category) {
      case 1: return '生活技能';
      case 2: return '职场进阶';
      case 3: return '老年教育';
      case 4: return '学历提升';
      case 5: return '兴趣培养';
      case 6: return '技能认证';
      default: return '未分类';
    }
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
      dataIndex: 'instructor',
      key: 'instructor',
    },
    {
      title: '分类',
      dataIndex: 'category',
      key: 'category',
      render: (category) => getCategoryName(category),
    },
    {
      title: '积分奖励',
      dataIndex: 'pointsReward',
      key: 'pointsReward',
    },
    {
      title: '时长(分钟)',
      dataIndex: 'duration',
      key: 'duration',
    },
    {
      title: '浏览量',
      dataIndex: 'viewCount',
      key: 'viewCount',
      render: (text) => text || 0,
    },
    {
      title: '上线日期',
      dataIndex: 'startDate',
      key: 'startDate',
      render: (text) => text ? dayjs(text).format('YYYY-MM-DD') : '',
    },
    {
      title: '下线日期',
      dataIndex: 'endDate',
      key: 'endDate',
      render: (text) => text ? dayjs(text).format('YYYY-MM-DD') : '',
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status) => status === 1 ? '进行中' : '已完成',
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Button type="primary" icon={<EditOutlined />} onClick={() => handleEdit(record)}>
            编辑
          </Button>
          <Popconfirm
            title="确定删除此项目吗?"
            onConfirm={() => handleDelete(record.id)}
            okText="确定"
            cancelText="取消"
          >
            <Button type="primary" danger icon={<DeleteOutlined />}>
              删除
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ marginBottom: '16px', display: 'flex', justifyContent: 'space-between' }}>
        <h2>项目管理</h2>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
          添加项目
        </Button>
      </div>
      <Table
        columns={columns}
        dataSource={data}
        rowKey="id"
        pagination={pagination}
        loading={loading}
        onChange={(pagination) => {
          setPagination(pagination);
          fetchProjects();
        }}
      />

      <Modal
        title={editingProject ? "编辑项目" : "添加项目"}
        open={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        width={800}
        confirmLoading={loading}
      >
        <Form
          form={form}
          layout="vertical"
          initialValues={{ status: 1, pointsReward: 5, viewCount: 0 }}
        >
          <Form.Item
            name="projectName"
            label="项目名称"
            rules={[{ required: true, message: '请输入项目名称!' }]}
          >
            <Input placeholder="请输入项目名称" />
          </Form.Item>

          <Form.Item
            name="projectCode"
            label="项目编码"
            rules={[{ required: true, message: '请输入项目编码!' }]}
          >
            <Input placeholder="请输入项目编码" />
          </Form.Item>

          <Form.Item
            name="instructor"
            label="负责人"
            rules={[{ required: true, message: '请输入负责人!' }]}
          >
            <Input placeholder="请输入负责人" />
          </Form.Item>

          <Form.Item
            name="category"
            label="项目分类"
            rules={[{ required: true, message: '请选择项目分类!' }]}
          >
            <Select placeholder="请选择项目分类">
              <Option value={1}>生活技能</Option>
              <Option value={2}>职场进阶</Option>
              <Option value={3}>老年教育</Option>
              <Option value={4}>学历提升</Option>
              <Option value={5}>兴趣培养</Option>
              <Option value={6}>技能认证</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="startDate"
            label="上线日期"
            rules={[{ required: true, message: '请选择上线日期!' }]}
          >
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item
            name="endDate"
            label="下线日期"
            rules={[{ required: true, message: '请选择下线日期!' }]}
          >
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item
            name="status"
            label="状态"
            rules={[{ required: true, message: '请选择状态!' }]}
          >
            <Select placeholder="请选择状态">
              <Option value={1}>进行中</Option>
              <Option value={0}>已完成</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="pointsReward"
            label="积分奖励"
            rules={[{ required: true, message: '请输入积分奖励!' }]}
          >
            <InputNumber min={0} style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item
            name="duration"
            label="时长(分钟)"
            rules={[{ required: true, message: '请输入时长!' }]}
          >
            <InputNumber min={1} style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item
            name="viewCount"
            label="浏览量"
          >
            <InputNumber min={0} style={{ width: '100%' }} disabled />
          </Form.Item>

          <Form.Item
            name="videoUrl"
            label="视频URL"
          >
            <Input placeholder="请输入视频URL" />
          </Form.Item>

          <Form.Item
            name="coverImageUrl"
            label="封面图片"
          >
            <Input placeholder="请输入封面图片URL" style={{ marginBottom: 8 }} />
            <Upload
              name="file"
              action="/api/upload/image"
              listType="picture"
              maxCount={1}
              fileList={fileList}
              onChange={handleUploadChange}
              beforeUpload={handleUploadBeforeUpload}
            >
              <Button icon={<UploadOutlined />}>上传封面</Button>
            </Upload>
          </Form.Item>

          <Form.Item
            name="description"
            label="项目描述"
          >
            <TextArea rows={4} placeholder="请输入项目描述" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ProjectList;