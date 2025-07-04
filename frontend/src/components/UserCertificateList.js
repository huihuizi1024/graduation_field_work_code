import React, { useState, useEffect } from 'react';
import { Table, Card, Button, Space, Tag, Empty, message, Modal, Descriptions, Typography } from 'antd';
import { FilePdfOutlined, InfoCircleOutlined } from '@ant-design/icons';
import moment from 'moment';
import api from '../api';
import Loading from './Loading';

const { Title } = Typography;

const UserCertificateList = () => {
  const [loading, setLoading] = useState(false);
  const [certificates, setCertificates] = useState([]);
  const [detailVisible, setDetailVisible] = useState(false);
  const [currentCertificate, setCurrentCertificate] = useState(null);

  const showCertificateDetails = (record) => {
    setCurrentCertificate(record);
    setDetailVisible(true);
  };

  const fetchCertificates = async () => {
    setLoading(true);
    try {
      const response = await api.get('/api/user/certificates');
      if (response.code === 200) {
        setCertificates(response.data || []);
      } else {
        message.error(response.message || '获取证书列表失败');
      }
    } catch (error) {
      console.error('获取证书列表出错:', error);
      message.error('获取证书列表失败，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCertificates();
  }, []);

  const handleDownload = async (record) => {
    message.info(`正在准备下载证书: ${record.standardName}`);
    try {
      // 实际项目中，这里需要调用后端API生成证书PDF并下载
      const response = await api.get(`/api/user/certificates/${record.id}/download`, { responseType: 'blob' });
      
      // 创建Blob链接并下载
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `证书-${record.standardName}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      
      message.success('证书下载成功');
    } catch (error) {
      console.error('证书下载失败:', error);
      message.error('证书下载失败，请稍后重试');
    }
  };

  const columns = [
    {
      title: '证书名称',
      dataIndex: 'standardName',
      key: 'standardName',
      render: (text, record) => (
        <Space>
          {text}
          {record.pointValue > 0 && (
            <Tag color="gold">+{record.pointValue} 积分</Tag>
          )}
        </Space>
      ),
    },
    {
      title: '颁发机构',
      dataIndex: 'issuingOrganization',
      key: 'issuingOrganization',
    },
    {
      title: '获得时间',
      dataIndex: 'issuedTime',
      key: 'issuedTime',
      render: (text) => text ? moment(text).format('YYYY-MM-DD') : '-',
    },
    {
      title: '有效期',
      key: 'expiry',
      render: (_, record) => {
        if (record.expiryTime) {
          const isExpired = moment(record.expiryTime).isBefore(moment());
          return (
            <span style={{ color: isExpired ? 'red' : 'inherit' }}>
              {moment(record.expiryTime).format('YYYY-MM-DD')}
              {isExpired && ' (已过期)'}
            </span>
          );
        }
        return '永久有效';
      },
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Button 
            type="link" 
            icon={<InfoCircleOutlined />} 
            onClick={() => showCertificateDetails(record)}
          >
            详情
          </Button>
          <Button 
            type="link" 
            icon={<FilePdfOutlined />} 
            onClick={() => handleDownload(record)}
          >
            下载
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div className="user-certificate-list">
      <Card title="我的证书" extra={<Button type="primary" onClick={fetchCertificates}>刷新</Button>}>
        {loading ? (
          <Loading />
        ) : certificates.length > 0 ? (
          <Table
            columns={columns}
            dataSource={certificates}
            rowKey="id"
            pagination={{ pageSize: 10 }}
          />
        ) : (
          <Empty description="暂无证书记录" />
        )}
      </Card>

      <Modal
        title="证书详情"
        open={detailVisible}
        onCancel={() => setDetailVisible(false)}
        footer={[
          <Button key="download" type="primary" onClick={() => currentCertificate && handleDownload(currentCertificate)}>
            下载证书
          </Button>,
          <Button key="close" onClick={() => setDetailVisible(false)}>
            关闭
          </Button>,
        ]}
        width={800}
      >
        {currentCertificate && (
          <Descriptions bordered column={1}>
            <Descriptions.Item label="证书ID">{currentCertificate.id}</Descriptions.Item>
            <Descriptions.Item label="证书名称">
              {currentCertificate.standardName}
              {currentCertificate.pointValue > 0 && (
                <Tag color="gold" style={{ marginLeft: '8px' }}>+{currentCertificate.pointValue} 积分</Tag>
              )}
            </Descriptions.Item>
            <Descriptions.Item label="颁发机构">{currentCertificate.issuingOrganization}</Descriptions.Item>
            <Descriptions.Item label="颁发时间">
              {currentCertificate.issuedTime ? moment(currentCertificate.issuedTime).format('YYYY-MM-DD HH:mm:ss') : '-'}
            </Descriptions.Item>
            <Descriptions.Item label="有效期">
              {currentCertificate.expiryTime ? moment(currentCertificate.expiryTime).format('YYYY-MM-DD') : '永久有效'}
            </Descriptions.Item>
            <Descriptions.Item label="证书说明">
              {currentCertificate.standardDescription || '暂无说明'}
            </Descriptions.Item>
          </Descriptions>
        )}
      </Modal>
    </div>
  );
};

export default UserCertificateList; 