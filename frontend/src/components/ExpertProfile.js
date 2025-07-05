import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Avatar, Descriptions, Spin, Alert, Button, message, Tag, Layout, Upload, Breadcrumb } from 'antd';
import { 
    UserOutlined, MailOutlined, PhoneOutlined, StarOutlined, EditOutlined, 
    ReadOutlined, HomeOutlined, UploadOutlined
} from '@ant-design/icons';
import { getCurrentExpert, updateCurrentExpert } from '../api';
import EditProfileModal from './EditProfileModal';
import './UserProfile.css';

const { Content } = Layout;

const ExpertProfile = () => {
    const navigate = useNavigate();
    const [expertData, setExpertData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isModalVisible, setIsModalVisible] = useState(false);

    const fetchCurrentExpert = async () => {
        try {
            setLoading(true);
            const response = await getCurrentExpert();
            if (response && response.data) {
                setExpertData(response.data);
            } else {
                throw new Error('无效的API响应');
            }
        } catch (err) {
            const errorMessage = err.response?.data?.message || err.message || '获取专家信息失败';
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCurrentExpert();
    }, []);

    const handleEdit = () => {
        setIsModalVisible(true);
    };

    const handleCancelModal = () => {
        setIsModalVisible(false);
    };

    const handleUpdateProfile = async (values) => {
        try {
            setLoading(true);
            const response = await updateCurrentExpert(values);
            if (response && response.code === 200) {
                await fetchCurrentExpert();
                setIsModalVisible(false);
                message.success('信息更新成功！');
            } else {
                throw new Error(response?.message || '更新失败');
            }
        } catch (updateError) {
            message.error(updateError.response?.data?.message || '更新失败，请重试');
        } finally {
            setLoading(false);
        }
    };

    // Avatar upload props
    const uploadProps = {
        name: 'file',
        showUploadList: false,
        action: '/api/upload/file', 
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token') || ''}`
        },
        beforeUpload: (file) => {
            const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
            if (!isJpgOrPng) {
                message.error('您只能上传 JPG/PNG 格式的图片!');
            }
            const isLt2M = file.size / 1024 / 1024 < 2;
            if (!isLt2M) {
                message.error('图片大小必须小于 2MB!');
            }
            return isJpgOrPng && isLt2M;
        },
        onChange: async (info) => {
            if (info.file.status === 'done') {
                const res = info.file.response;
                if (res.code === 200 && res.data?.url) {
                    try {
                        await handleUpdateProfile({ avatarUrl: res.data.url });
                        message.success('头像更新成功！');
                    } catch (e) {
                        message.error('保存头像失败');
                    }
                } else {
                    message.error(res.message || '上传失败');
                }
            } else if (info.file.status === 'error') {
                message.error('上传失败');
            }
        },
    };

    if (loading) {
        return <div className="spinner-container"><Spin size="large" /></div>;
    }
    if (error) {
        return <div className="page-container"><Alert message="加载失败" description={error} type="error" showIcon /></div>;
    }
    if (!expertData) {
        return <div className="page-container"><Alert message="信息" description="无法加载专家信息。" type="info" showIcon /></div>;
    }

    return (
        <Layout className="my-courses-layout">
            <Content className="content-container" style={{maxWidth: '1200px', margin: 'auto'}}>
                <div className="page-header">
                    <Breadcrumb>
                        <Breadcrumb.Item href="/">
                            <HomeOutlined />
                            <span>首页</span>
                        </Breadcrumb.Item>
                        <Breadcrumb.Item>专家中心</Breadcrumb.Item>
                    </Breadcrumb>
                </div>

                <div className="profile-info-container">
                    <Card className="profile-avatar-card">
                        <Upload {...uploadProps}>
                            <div className="profile-avatar-container">
                                <Avatar size={128} icon={<UserOutlined />} src={expertData.avatarUrl} />
                                <div className="avatar-upload-overlay">
                                    <UploadOutlined />
                                    <span>更换头像</span>
                                </div>
                            </div>
                        </Upload>
                        <h2 className="user-name">{expertData.fullName}</h2>
                        <Tag color="cyan">@{expertData.username}</Tag>
                        <Button type="primary" icon={<EditOutlined />} onClick={handleEdit} style={{ marginTop: 16 }}>
                            编辑信息
                        </Button>
                    </Card>

                    <Card title="专家详细信息" className="profile-details-card">
                        <Descriptions bordered column={1} layout="horizontal">
                            <Descriptions.Item label={<UserOutlined />} labelStyle={{width: 120}}>
                                {expertData.fullName || '未填写'}
                            </Descriptions.Item>
                            <Descriptions.Item label={<MailOutlined />}>
                                {expertData.email || '未填写'}
                            </Descriptions.Item>
                            <Descriptions.Item label={<PhoneOutlined />}>
                                {expertData.phone || '未填写'}
                            </Descriptions.Item>
                            <Descriptions.Item label={<StarOutlined />}>
                                {expertData.expertise || '未填写'}
                            </Descriptions.Item>
                            <Descriptions.Item label={<ReadOutlined />}>
                                {expertData.description || '这位专家很低调，什么都没留下。'}
                            </Descriptions.Item>
                        </Descriptions>
                    </Card>
                </div>

                {expertData && (
                    <EditProfileModal
                        visible={isModalVisible}
                        onCancel={handleCancelModal}
                        onOk={handleUpdateProfile}
                        initialData={expertData}
                        role="expert"
                    />
                )}
            </Content>
        </Layout>
    );
};

export default ExpertProfile;
