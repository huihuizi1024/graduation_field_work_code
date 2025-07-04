import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { Card, Image, Typography, Button, message, Spin } from 'antd';
import { ArrowLeftOutlined, DownloadOutlined } from '@ant-design/icons';
import { getApplicationById } from '../api/certificate';

const { Paragraph, Text } = Typography;

// 假设后端服务运行在 localhost:8080，这应该根据实际部署环境进行配置
// 在生产环境中，这通常会从环境变量或配置文件中读取
const BACKEND_BASE_URL = 'http://localhost:8080'; 

/**
 * 证书申请材料查看页面
 * 支持展示文字描述、图片预览以及其他文件下载
 */
const CertificateApplicationView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  // 启用 location.state 以减少一次网络请求
  const [application, setApplication] = useState(location.state?.application || null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!application) {
      // 若无缓存，则从后台拉取
      (async () => {
        try {
          setLoading(true);
          const res = await getApplicationById(id);
          if (res && res.code === 200) {
            setApplication(res.data);
          } else {
            message.error(res?.message || '获取申请信息失败');
          }
        } catch (err) {
          message.error('获取申请信息失败');
        } finally {
          setLoading(false);
        }
      })();
    }
  }, [application, id]);

  const renderMaterials = () => {
    if (!application?.evidenceUrl) return <Text type="secondary">暂无文件材料</Text>;
    const parts = application.evidenceUrl.split('||').filter(Boolean);
    return parts.map((part, idx) => {
      let materialPath = part.trim();
      const isAbsoluteUrl = /^(http|https):\/\//i.test(materialPath);

      // 如果不是绝对URL，但以/uploads/开头，则认为是相对路径，需要拼接后端URL
      if (!isAbsoluteUrl && materialPath.startsWith('/uploads/')) {
        materialPath = BACKEND_BASE_URL + materialPath;
      }

      const lower = materialPath.toLowerCase();
      const isImage = lower.match(/\.(png|jpe?g|gif|bmp|webp)$/i);
      const isPdf = lower.endsWith('.pdf');
      const fileName = materialPath.split('/').pop();
      
      if (isImage) {
        return <Image key={idx} src={materialPath} style={{ maxWidth: '100%', marginBottom: 16 }} />;
      } else if (isPdf) {
        return (
          <iframe
            key={idx}
            src={materialPath}
            title={`pdf-${idx}`}
            style={{ width: '100%', height: 600, border: 'none', marginBottom: 16 }}
          />
        );
      }
      // 其他文件，显示下载按钮
      return (
        <Button
          key={idx}
          type="link"
          icon={<DownloadOutlined />}
          href={materialPath}
          target="_blank"
          rel="noreferrer"
          style={{ padding: 0, marginBottom: 8 }}
        >
          下载 {fileName || `文件${idx + 1}`}
        </Button>
      );
    });
  };

  return (
    <Card
      style={{ margin: 24 }}
      title={
        <>
          <Button type="link" icon={<ArrowLeftOutlined />} onClick={() => navigate(-1)} style={{ padding: 0, marginRight: 8 }} />
          申请详情
        </>
      }
    >
      <Spin spinning={loading} tip="加载中...">
        {application && (
          <>
            <Paragraph>
              <Text strong>申请ID：</Text>{application.id}
            </Paragraph>
            <Paragraph>
              <Text strong>用户ID：</Text>{application.userId}
            </Paragraph>
            <Paragraph>
              <Text strong>证书：</Text>{application.standardName || application.standardId}
            </Paragraph>
            <Paragraph>
              <Text strong>申请时间：</Text>{application.applyTime}
            </Paragraph>
            {application.description && (
              <Paragraph>
                <Text strong>补充说明：</Text>{application.description}
              </Paragraph>
            )}
            <Paragraph>
              <Text strong>证明文件：</Text>
            </Paragraph>
            {renderMaterials()}
          </>
        )}
      </Spin>
    </Card>
  );
};

export default CertificateApplicationView; 