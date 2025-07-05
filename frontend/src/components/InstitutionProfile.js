import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Avatar, Descriptions, Spin, Alert, Button, message, Tag, Layout, Upload, Breadcrumb } from 'antd';
import { 
    BankOutlined, MailOutlined, PhoneOutlined, UserOutlined, EditOutlined, 
    HomeOutlined, GiftOutlined, InfoCircleOutlined, EnvironmentOutlined, UploadOutlined
} from '@ant-design/icons';
import { getCurrentInstitution, updateCurrentInstitution, updateUserInfo } from '../api';
import EditProfileModal from './EditProfileModal'; 
import { validateImage } from '../utils/fileValidator';
import './UserProfile.css';

const { Content } = Layout;

const InstitutionProfile = () => {
    const navigate = useNavigate();
    const [institutionData, setInstitutionData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isModalVisible, setIsModalVisible] = useState(false);

    const fetchCurrentInstitution = async () => {
        try {
            setLoading(true);
            const response = await getCurrentInstitution();
            if (response && response.data) {
                setInstitutionData(response.data);
            } else {
                throw new Error('无效的API响应');
            }
        } catch (err) {
            const errorMessage = err.response?.data?.message || err.message || '获取机构信息失败';
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCurrentInstitution();
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
            const response = await updateCurrentInstitution(values);
            if (response && response.code === 200) {
                await fetchCurrentInstitution();
                setIsModalVisible(false);
                message.success('机构信息更新成功！');
            } else {
                throw new Error(response?.message || '更新失败');
            }
        } catch (error) {
            message.error('更新失败: ' + (error.response?.data?.message || error.message));
        } finally {
            setLoading(false);
        }
    };

    const uploadProps = {
        name: 'file',
        showUploadList: false,
        action: '/api/upload/file',
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token') || ''}`
        },
        beforeUpload: (file) => {
            return validateImage(file);
        },
        onSuccess: async (res) => {
            if (res.code === 200 && res.data?.url) {
                try {
                    const updateResponse = await updateUserInfo({ avatarUrl: res.data.url });
                    if (updateResponse && updateResponse.code === 200) {
                        message.success('头像更新成功！');
                        setInstitutionData(prev => ({ ...prev, avatarUrl: res.data.url }));
                    } else {
                        message.error(updateResponse.message || '保存头像失败');
                    }
                } catch (e) {
                    message.error('保存头像失败');
                }
            } else {
                message.error(res.message || '上传失败');
            }
        },
        onError: () => {
            message.error('上传失败');
        },
    };
    
    const getInstitutionTypeName = (type) => {
        switch(type) {
            case 1: return '高等院校';
            case 2: return '职业院校';
            case 3: return '培训机构';
            case 4: return '社会组织';
            default: return '未知类型';
        }
    };

    const getInstitutionLevelName = (level) => {
        switch(level) {
            case 1: return '国家级';
            case 2: return '省级';
            case 3: return '市级';
            case 4: return '区县级';
            default: return '未知级别';
        }
    };

    const getCertificationLevelName = (level) => {
        switch(level) {
            case 1: return 'AAA级';
            case 2: return 'AA级';
            case 3: return 'A级';
            case 4: return 'B级';
            case 5: return 'C级';
            default: return '未认证';
        }
    };

    if (loading) {
        return <div className="spinner-container"><Spin size="large" /></div>;
    }
    if (error) {
        return <div className="page-container"><Alert message="加载失败" description={error} type="error" showIcon /></div>;
    }
    if (!institutionData) {
        return <div className="page-container"><Alert message="信息" description="无法加载机构信息。" type="info" showIcon /></div>;
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
                        <Breadcrumb.Item>机构中心</Breadcrumb.Item>
                    </Breadcrumb>
                </div>

                <div className="profile-info-container">
                    <Card className="profile-avatar-card">
                         <Upload {...uploadProps}>
                            <div className="profile-avatar-container">
                                <Avatar size={128} icon={<BankOutlined />} src={institutionData.avatarUrl} />
                                <div className="avatar-upload-overlay">
                                    <UploadOutlined />
                                    <span>更换头像</span>
                                </div>
                            </div>
                        </Upload>
                        <h2 className="user-name">{institutionData.institutionName}</h2>
                        <Tag color="purple">@{institutionData.username}</Tag>
                        <div className="user-points-card" style={{marginTop: '12px'}}>
                            <GiftOutlined /> {institutionData.pointsBalance || 0} 积分
                        </div>
                        <Button type="primary" icon={<EditOutlined />} onClick={handleEdit} style={{ marginTop: 16 }}>
                            编辑信息
                        </Button>
                    </Card>

                    <Card title="机构详细信息" className="profile-details-card">
                        <Descriptions bordered column={2} layout="horizontal">
                            <Descriptions.Item label={<InfoCircleOutlined />} span={2}>
                                {institutionData.institutionName || '未填写'}
                            </Descriptions.Item>
                            <Descriptions.Item label="社会信用代码" span={2}>
                                {institutionData.socialCreditCode || '未填写'}
                            </Descriptions.Item>
                            <Descriptions.Item label="法定代表人">
                                {institutionData.legalRepresentative || '未填写'}
                            </Descriptions.Item>
                            <Descriptions.Item label="联系人">
                                {institutionData.contactPerson || '未填写'}
                            </Descriptions.Item>
                            <Descriptions.Item label="联系邮箱">
                                {institutionData.contactEmail || '未填写'}
                            </Descriptions.Item>
                            <Descriptions.Item label="联系电话">
                                {institutionData.contactPhone || '未填写'}
                            </Descriptions.Item>
                            <Descriptions.Item label="机构地址" span={2}>
                                {(institutionData.province || institutionData.city || institutionData.district) ? 
                                    `${institutionData.province || ''} ${institutionData.city || ''} ${institutionData.district || ''} ${institutionData.address || ''}` 
                                    : (institutionData.address || '未填写')}
                            </Descriptions.Item>
                            <Descriptions.Item label="机构类型">
                                <Tag>{getInstitutionTypeName(institutionData.institutionType)}</Tag>
                            </Descriptions.Item>
                            <Descriptions.Item label="机构级别">
                                <Tag>{getInstitutionLevelName(institutionData.institutionLevel)}</Tag>
                            </Descriptions.Item>
                             <Descriptions.Item label="认证等级">
                                <Tag color="gold">{getCertificationLevelName(institutionData.certificationLevel)}</Tag>
                            </Descriptions.Item>
                            <Descriptions.Item label="机构简介" span={2}>
                                {institutionData.institutionDescription || '该机构很低调，什么都没留下。'}
                            </Descriptions.Item>
                        </Descriptions>
                    </Card>
                </div>

                {institutionData && (
                    <EditProfileModal
                        visible={isModalVisible}
                        onCancel={handleCancelModal}
                        onOk={handleUpdateProfile}
                        initialData={institutionData}
                        role="institution"
                    />
                )}
            </Content>
        </Layout>
    );
};

export default InstitutionProfile;
