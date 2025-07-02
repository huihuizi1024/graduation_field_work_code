import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Avatar, Descriptions, Spin, Alert, Button, message, Tag, Row, Col } from 'antd';
import { BankOutlined, MailOutlined, PhoneOutlined, UserOutlined, EditOutlined, ArrowLeftOutlined, IdcardOutlined, EnvironmentOutlined, InfoCircleOutlined, GiftOutlined, HomeOutlined } from '@ant-design/icons';
import { getCurrentInstitution, updateCurrentInstitution } from '../api';
import EditProfileModal from './EditProfileModal'; 
import './UserProfile.css';

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
                // 直接使用从后端获取的机构信息
                setInstitutionData(response.data);
            } else {
                throw new Error('无效的API响应');
            }
        } catch (err) {
            const errorMessage = err.response?.data?.message || err.message || '获取机构信息失败';
            setError(errorMessage);
            message.error(errorMessage);
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
            // 调用API更新机构信息
            const response = await updateCurrentInstitution(values);
            
            if (response && response.code === 200) {
                // 重新获取机构信息以确保数据一致性
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

    if (loading) {
        return (
            <div className="profile-info flex-center" style={{ paddingTop: '100px', minHeight: '50vh' }}>
                <Spin size="large" tip="正在加载机构信息..." />
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

    if (!institutionData) {
        return (
            <div className="profile-info flex-center" style={{ paddingTop: '100px' }}>
                <Alert message="信息" description="无法加载机构信息。" type="info" showIcon />
            </div>
        );
    }
    
    // 获取机构类型名称
    const getInstitutionTypeName = (type) => {
        switch(type) {
            case 1: return '高等院校';
            case 2: return '职业院校';
            case 3: return '培训机构';
            case 4: return '社会组织';
            default: return '未知类型';
        }
    };

    // 获取机构级别名称
    const getInstitutionLevelName = (level) => {
        switch(level) {
            case 1: return '国家级';
            case 2: return '省级';
            case 3: return '市级';
            case 4: return '区县级';
            default: return '未知级别';
        }
    };

    // 获取认证等级名称
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

    return (
        <div className="profile-info">
            <div className="avatar-wrapper">
                <Avatar size={100} icon={<BankOutlined />} />
                <h2 className="user-name">{institutionData.institutionName}</h2>
                <Tag color="green">@{institutionData.username}</Tag>
                <div className="points-display-profile" style={{ cursor: 'pointer' }} onClick={() => navigate('/points-mall')}>
                    <GiftOutlined /> {institutionData.pointsBalance || 0} 积分
                </div>
            </div>
            
            <Card
                title={
                    <Button type="link" icon={<HomeOutlined />} onClick={() => navigate('/')} style={{ padding: 0 }}>
                        返回首页
                    </Button>
                }
                extra={<Button icon={<EditOutlined />} onClick={handleEdit}>编辑信息</Button>}
                className="profile-details-card"
            >
                <Descriptions bordered column={1} layout="horizontal" contentStyle={{ textAlign: 'right' }}>
                    <Descriptions.Item label={<><InfoCircleOutlined /> 机构名称</>}>
                        {institutionData.institutionName || '未填写'}
                    </Descriptions.Item>
                    <Descriptions.Item label={<><IdcardOutlined /> 社会信用代码</>}>
                        {institutionData.socialCreditCode || '未填写'}
                    </Descriptions.Item>
                     <Descriptions.Item label={<><UserOutlined /> 法定代表人</>}>
                        {institutionData.legalRepresentative || '未填写'}
                    </Descriptions.Item>
                    <Descriptions.Item label={<><UserOutlined /> 联系人</>}>
                        {institutionData.contactPerson || '未填写'}
                    </Descriptions.Item>
                    <Descriptions.Item label={<><MailOutlined /> 联系邮箱</>}>
                        {institutionData.contactEmail || '未填写'}
                    </Descriptions.Item>
                    <Descriptions.Item label={<><PhoneOutlined /> 联系电话</>}>
                        {institutionData.contactPhone || '未填写'}
                    </Descriptions.Item>
                    <Descriptions.Item label={<><EnvironmentOutlined /> 机构地址</>}>
                        {(institutionData.province || institutionData.city || institutionData.district) ? 
                            `${institutionData.province || ''} ${institutionData.city || ''} ${institutionData.district || ''} ${institutionData.address || ''}` 
                            : (institutionData.address || '未填写')}
                    </Descriptions.Item>
                    <Descriptions.Item label="机构类型">
                        {getInstitutionTypeName(institutionData.institutionType)}
                    </Descriptions.Item>
                    <Descriptions.Item label="机构级别">
                        {getInstitutionLevelName(institutionData.institutionLevel)}
                    </Descriptions.Item>
                    <Descriptions.Item label="认证等级">
                        {getCertificationLevelName(institutionData.certificationLevel)}
                    </Descriptions.Item>
                    <Descriptions.Item label="机构简介">
                        {institutionData.institutionDescription || '该机构很低调，什么都没留下。'}
                    </Descriptions.Item>
                </Descriptions>
            </Card>

            {institutionData && (
                <EditProfileModal
                    visible={isModalVisible}
                    onCancel={handleCancelModal}
                    onOk={handleUpdateProfile}
                    initialData={institutionData}
                    role="institution"
                />
            )}
        </div>
    );
};

export default InstitutionProfile; 