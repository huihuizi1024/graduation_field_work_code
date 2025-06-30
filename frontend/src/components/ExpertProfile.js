import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Avatar, Descriptions, Spin, Alert, Button, message, Tag } from 'antd';
import { UserOutlined, MailOutlined, PhoneOutlined, StarOutlined, EditOutlined, ReadOutlined, IdcardOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { getCurrentExpert, updateCurrentExpert } from '../api';
import EditProfileModal from './EditProfileModal';
import './UserProfile.css'; // Reuse the UserProfile CSS

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
            message.error(errorMessage);
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
            // This is the actual API call to the backend.
            const response = await updateCurrentExpert(values);

            if (response && response.code === 200) {
                // Refetch data after update to ensure consistency
                await fetchCurrentExpert();
                
                setIsModalVisible(false);
                message.success('信息更新成功！');
            } else {
                throw new Error(response?.message || '更新失败');
            }
        } catch (updateError) {
            message.error(updateError.response?.data?.message || '更新失败，请重试');
        }
    };

    if (loading) {
        return (
            <div className="profile-info flex-center" style={{ paddingTop: '100px', minHeight: '50vh' }}>
                <Spin size="large" tip="正在加载专家信息..." />
            </div>
        );
    }

    if (error) {
        return (
            <div className="profile-info flex-center" style={{ paddingTop: '100px' }}>
                <Alert message="加载失败" description={error} type="error" showIcon />
            </div>
        );
    }
    
    if (!expertData) {
        return (
            <div className="profile-info flex-center" style={{ paddingTop: '100px' }}>
                <Alert message="信息" description="无法加载专家信息。" type="info" showIcon />
            </div>
        );
    }

    return (
        <div className="profile-info">
             <div className="avatar-wrapper">
                <Avatar size={100} icon={<UserOutlined />} src={expertData.avatarUrl} />
                <h2 className="user-name">{expertData.fullName}</h2>
                <Tag color="blue">@{expertData.username}</Tag>
            </div>
            <Card
                title={
                    <Button type="link" onClick={() => navigate('/')} icon={<ArrowLeftOutlined />}>
                        返回主页
                    </Button>
                }
                extra={<Button icon={<EditOutlined />} onClick={handleEdit}>编辑信息</Button>}
                className="profile-details-card"
            >
                <Descriptions bordered column={1} layout="horizontal" contentStyle={{ textAlign: 'right' }}>
                    <Descriptions.Item label={<><IdcardOutlined /> 真实姓名</>}>
                        {expertData.fullName || '未填写'}
                    </Descriptions.Item>
                    <Descriptions.Item label={<><MailOutlined /> 联系邮箱</>}>
                        {expertData.email || '未填写'}
                    </Descriptions.Item>
                    <Descriptions.Item label={<><PhoneOutlined /> 手机号码</>}>
                        {expertData.phone || '未填写'}
                    </Descriptions.Item>
                    <Descriptions.Item label={<><StarOutlined /> 专业领域</>}>
                        {expertData.expertise || '未填写'}
                    </Descriptions.Item>
                    <Descriptions.Item label={<><ReadOutlined /> 个人简介</>}>
                        {expertData.description || '这位专家很低调，什么都没留下。'}
                    </Descriptions.Item>
                </Descriptions>
            </Card>

            {expertData && (
                <EditProfileModal
                    visible={isModalVisible}
                    onCancel={handleCancelModal}
                    onOk={handleUpdateProfile}
                    initialData={expertData}
                    role="expert"
                />
            )}
        </div>
    );
};

export default ExpertProfile; 