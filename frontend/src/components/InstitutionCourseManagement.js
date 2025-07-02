import React, { useState, useEffect } from 'react';
import { 
  Table, Button, Modal, Form, Input, Select, DatePicker, 
  InputNumber, Upload, message, Tabs, Typography, Space 
} from 'antd';
import { 
  PlusOutlined, EditOutlined, DeleteOutlined, 
  UploadOutlined, VideoCameraOutlined, BarChartOutlined,
  EyeOutlined, InboxOutlined, HomeOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import dayjs from 'dayjs';

const { Title, Text } = Typography;
const { TabPane } = Tabs;
const { Option } = Select;
const { TextArea } = Input;

const InstitutionCourseManagement = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [currentCourse, setCurrentCourse] = useState(null);
  const [fileList, setFileList] = useState([]);
  const [videoFileList, setVideoFileList] = useState([]);
  const [activeTab, setActiveTab] = useState('1');

  // 获取课程列表
  const fetchCourses = async () => {
    setLoading(true);
    try {
      const result = await api.get('/api/projects', {
        params: {
          institutionId: 'me' // 获取当前机构的课程
        }
      });
      
      if (result && result.data) {
        const records = result.data.records || result.data.data?.records || [];
        setCourses(records);
      }
    } catch (error) {
      message.error('获取课程失败：' + (error.message || '未知错误'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  // 打开新增/编辑模态框
  const handleOpenModal = (course = null) => {
    setCurrentCourse(course);
    form.resetFields();
    
    if (course) {
      form.setFieldsValue({
        ...course,
        startDate: course.startDate ? dayjs(course.startDate) : null,
        endDate: course.endDate ? dayjs(course.endDate) : null
      });
      
      // 设置封面图预览
      if (course.coverImageUrl) {
        setFileList([
          {
            uid: '-1',
            name: 'cover.jpg',
            status: 'done',
            url: course.coverImageUrl
          }
        ]);
      } else {
        setFileList([]);
      }
      
      // 设置视频预览
      if (course.videoUrl) {
        setVideoFileList([
          {
            uid: '-1',
            name: 'video.mp4',
            status: 'done',
            url: course.videoUrl
          }
        ]);
      } else {
        setVideoFileList([]);
      }
    } else {
      // 新增时设置默认值
      form.setFieldsValue({
        status: 1,
        category: 1,
        pointsReward: 5,
        duration: 30
      });
      setFileList([]);
      setVideoFileList([]);
    }
    
    setModalVisible(true);
  };

  // 提交表单
  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      
      const courseData = {
        ...values,
        startDate: values.startDate ? values.startDate.format('YYYY-MM-DD') : null,
        endDate: values.endDate ? values.endDate.format('YYYY-MM-DD') : null,
        manager: values.manager || '未指定',
        // 使用form中设置的值或从上传组件中获取
        coverImageUrl: values.coverImageUrl,
        videoUrl: values.videoUrl
      };
      
      if (currentCourse) {
        // 更新课程
        await api.put(`/api/projects/${currentCourse.id}`, courseData);
        message.success('课程更新成功');
      } else {
        // 新增课程
        await api.post('/api/projects', courseData);
        message.success('课程发布成功');
      }
      
      setModalVisible(false);
      fetchCourses();
    } catch (error) {
      message.error('提交失败：' + (error.message || '请检查表单填写'));
    }
  };

  // 删除课程
  const handleDelete = async (id) => {
    try {
      await api.delete(`/api/projects/${id}`);
      message.success('课程删除成功');
      fetchCourses();
    } catch (error) {
      message.error('删除失败：' + (error.message || '未知错误'));
    }
  };

  // 封面图上传
  const handleCoverChange = (info) => {
    let fileList = [...info.fileList];
    fileList = fileList.slice(-1); // 只保留最后一个文件
    
    if (info.file.status === 'done') {
      message.success(`${info.file.name} 上传成功`);
      // 假设服务器返回的结构是 {url: "图片地址"}
      const url = info.file.response?.url || info.file.response?.data?.url;
      if (url) {
        form.setFieldsValue({ coverImageUrl: url });
      }
    } else if (info.file.status === 'error') {
      message.error(`${info.file.name} 上传失败`);
    }
    
    setFileList(fileList);
  };

  // 视频上传
  const handleVideoChange = (info) => {
    let fileList = [...info.fileList];
    fileList = fileList.slice(-1); // 只保留最后一个文件
    
    if (info.file.status === 'done') {
      message.success(`${info.file.name} 上传成功`);
      // 假设服务器返回的结构是 {url: "视频地址"}
      const url = info.file.response?.url || info.file.response?.data?.url;
      if (url) {
        form.setFieldsValue({ videoUrl: url });
      }
    } else if (info.file.status === 'error') {
      message.error(`${info.file.name} 上传失败`);
    }
    
    setVideoFileList(fileList);
  };

  // 表格列定义
  const columns = [
    {
      title: '课程名称',
      dataIndex: 'projectName',
      key: 'projectName',
      render: (text, record) => (
        <a onClick={() => navigate(`/projects/${record.id}`)}>{text}</a>
      )
    },
    {
      title: '类别',
      dataIndex: 'category',
      key: 'category',
      render: category => {
        const categoryMap = {
          1: '专业技能',
          2: '学术教育',
          3: '职业发展',
          4: '创新创业',
          5: '人文艺术',
          6: '科学技术'
        };
        return categoryMap[category] || '未分类';
      }
    },
    {
      title: '负责人',
      dataIndex: 'manager',
      key: 'manager'
    },
    {
      title: '积分奖励',
      dataIndex: 'pointsReward',
      key: 'pointsReward'
    },
    {
      title: '时长(分钟)',
      dataIndex: 'duration',
      key: 'duration'
    },
    {
      title: '浏览量',
      dataIndex: 'viewCount',
      key: 'viewCount',
      render: count => count || 0
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: status => status === 1 ? '已上线' : '已下线'
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Space size="small">
          <Button 
            type="primary" 
            icon={<EditOutlined />} 
            size="small"
            onClick={() => handleOpenModal(record)}
          />
          <Button 
            type="primary" 
            danger 
            icon={<DeleteOutlined />} 
            size="small"
            onClick={() => handleDelete(record.id)}
          />
          <Button 
            icon={<EyeOutlined />} 
            size="small"
            onClick={() => navigate(`/projects/${record.id}`)}
          />
        </Space>
      )
    }
  ];

  return (
    <div className="institution-course-management">
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
        <Title level={2}>课程管理</Title>
        <Space>
          <Button 
            type="primary" 
            icon={<HomeOutlined />} 
            onClick={() => navigate('/')}
          >
            返回首页
          </Button>
        </Space>
      </div>

      <Tabs activeKey={activeTab} onChange={setActiveTab}>
        <TabPane 
          tab={<span><VideoCameraOutlined /> 课程列表</span>} 
          key="1"
        >
          <div className="table-operations">
            <Button 
              type="primary" 
              icon={<PlusOutlined />} 
              onClick={() => handleOpenModal()}
            >
              发布新课程
            </Button>
          </div>
          
          <Table 
            columns={columns} 
            dataSource={courses} 
            rowKey="id"
            loading={loading}
            pagination={{ pageSize: 10 }}
          />
        </TabPane>
        
        <TabPane 
          tab={<span><BarChartOutlined /> 数据统计</span>} 
          key="2"
        >
          <div className="stats-container">
            <Title level={3}>课程数据统计</Title>
            <Text>即将推出数据统计功能，敬请期待！</Text>
          </div>
        </TabPane>
      </Tabs>

      {/* 新增/编辑课程模态框 */}
      <Modal
        title={currentCourse ? '编辑课程' : '发布新课程'}
        open={modalVisible}
        onOk={handleSubmit}
        onCancel={() => setModalVisible(false)}
        width={800}
        destroyOnClose
      >
        <Form
          form={form}
          layout="vertical"
          initialValues={{
            status: 1,
            category: 1,
            pointsReward: 5
          }}
        >
          <Form.Item
            name="projectName"
            label="课程名称"
            rules={[{ required: true, message: '请输入课程名称' }]}
          >
            <Input placeholder="请输入课程名称" />
          </Form.Item>
          
          <Form.Item
            name="projectCode"
            label="课程编码"
            rules={[{ required: true, message: '请输入课程编码' }]}
          >
            <Input placeholder="请输入课程编码（唯一标识）" />
          </Form.Item>
          
          <Form.Item
            name="category"
            label="课程类别"
            rules={[{ required: true, message: '请选择课程类别' }]}
          >
            <Select placeholder="请选择课程类别">
              <Option value={1}>专业技能</Option>
              <Option value={2}>学术教育</Option>
              <Option value={3}>职业发展</Option>
              <Option value={4}>创新创业</Option>
              <Option value={5}>人文艺术</Option>
              <Option value={6}>科学技术</Option>
            </Select>
          </Form.Item>
          
          <Form.Item
            name="manager"
            label="负责人/讲师"
          >
            <Input placeholder="请输入负责人或讲师姓名" />
          </Form.Item>
          
          <Form.Item
            name="description"
            label="课程描述"
          >
            <TextArea rows={4} placeholder="请输入课程描述" />
          </Form.Item>
          
          <Form.Item
            name="pointsReward"
            label="积分奖励"
            rules={[{ required: true, message: '请输入完成课程可获得的积分奖励' }]}
          >
            <InputNumber min={0} max={100} placeholder="完成课程可获得的积分" style={{ width: '100%' }} />
          </Form.Item>
          
          <Form.Item
            name="duration"
            label="课程时长(分钟)"
            rules={[{ required: true, message: '请输入课程时长' }]}
          >
            <InputNumber min={1} placeholder="课程时长（分钟）" style={{ width: '100%' }} />
          </Form.Item>
          
          <Form.Item
            name="status"
            label="课程状态"
            rules={[{ required: true, message: '请选择课程状态' }]}
          >
            <Select placeholder="请选择课程状态">
              <Option value={1}>上线</Option>
              <Option value={0}>下线</Option>
            </Select>
          </Form.Item>
          
          <Form.Item
            name="startDate"
            label="上线日期"
          >
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>
          
          <Form.Item
            name="endDate"
            label="下线日期"
          >
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>
          
          <Form.Item
            name="coverImageUrl"
            label="课程封面"
          >
            <Input placeholder="请输入课程封面图片URL" />
          </Form.Item>
          
          <Form.Item label="上传封面图片">
            <Upload
              name="file"
              action="/api/upload/image"
              listType="picture-card"
              fileList={fileList}
              onChange={handleCoverChange}
              maxCount={1}
            >
              {fileList.length < 1 && (
                <div>
                  <PlusOutlined />
                  <div style={{ marginTop: 8 }}>上传封面</div>
                </div>
              )}
            </Upload>
          </Form.Item>
          
          <Form.Item
            name="videoUrl"
            label="课程视频URL"
          >
            <Input placeholder="请输入课程视频URL" />
          </Form.Item>
          
          <Form.Item label="上传课程视频">
            <Upload
              name="file"
              action="/api/upload/video"
              listType="text"
              fileList={videoFileList}
              onChange={handleVideoChange}
              maxCount={1}
            >
              <Button icon={<UploadOutlined />}>上传视频</Button>
            </Upload>
            <Text type="secondary" style={{ display: 'block', marginTop: 8 }}>
              支持mp4、webm等格式，建议大小不超过500MB
            </Text>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default InstitutionCourseManagement; 