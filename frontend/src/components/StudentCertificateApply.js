import React, { useEffect, useState } from 'react';
import { Table, Button, Tag, Modal, Input, message, Spin, Upload, Tabs, Popconfirm, Card, Tooltip, Typography } from 'antd';
import { FileAddOutlined, UploadOutlined, InfoCircleOutlined, SwapOutlined } from '@ant-design/icons';
import { getCertificationStandards } from '../api/standard';
import { applyCertificate, getMyApplications, getMyCertificates, cancelApplication } from '../api/certificate';
import { getConversionRules } from '../api';

const { Text } = Typography;
const { TabPane } = Tabs;

const statusTag = (status) => {
  switch (status) {
    case 0:
      return <Tag color="gold">待审核</Tag>;
    case 1:
      return <Tag color="green">已通过</Tag>;
    case 2:
      return <Tag color="red">已拒绝</Tag>;
    case 3:
      return <Tag>已取消</Tag>;
    default:
      return <Tag>未知</Tag>;
  }
};

const StudentCertificatePage = () => {
  const [activeKey, setActiveKey] = useState('available');

  const [standards, setStandards] = useState([]);
  const [applications, setApplications] = useState([]);
  const [certificates, setCertificates] = useState([]);
  const [conversionRules, setConversionRules] = useState([]);

  const [loading, setLoading] = useState(false);
  const [applyLoading, setApplyLoading] = useState(false);
  const [rulesLoading, setRulesLoading] = useState(false);

  const fetchStandards = async () => {
    setLoading(true);
    try {
      const res = await getCertificationStandards(1);
      if (res && res.code === 200) {
        const list = Array.isArray(res.data?.records) ? res.data.records : res.data;
        setStandards(list || []);
      } else {
        message.error(res?.message || '获取认证标准失败');
      }
    } catch (e) {
      message.error('获取认证标准失败');
    } finally {
      setLoading(false);
    }
  };

  const fetchApplications = async () => {
    setLoading(true);
    try {
      const res = await getMyApplications();
      if (res && res.code === 200) {
        setApplications(res.data || []);
      } else {
        message.error(res?.message || '获取申请列表失败');
      }
    } catch (e) {
      message.error('获取申请列表失败');
    } finally {
      setLoading(false);
    }
  };

  const fetchCertificates = async () => {
    setLoading(true);
    try {
      const res = await getMyCertificates();
      if (res && res.code === 200) {
        setCertificates(res.data || []);
      } else {
        message.error(res?.message || '获取证书失败');
      }
    } catch (e) {
      message.error('获取证书失败');
    } finally {
      setLoading(false);
    }
  };

  const fetchConversionRules = async () => {
    setRulesLoading(true);
    try {
      const response = await getConversionRules({
        page: 0,
        size: 100,
        status: 1, // 只获取有效的规则
        reviewStatus: 1 // 只获取审核通过的规则
      });
      
      if (response && response.code === 200 && response.data && response.data.records) {
        setConversionRules(response.data.records);
      } else {
        console.log('没有找到转换规则数据');
        setConversionRules([]);
      }
    } catch (error) {
      console.error('获取转换规则失败:', error);
      message.error('获取转换规则失败');
      setConversionRules([]);
    } finally {
      setRulesLoading(false);
    }
  };

  useEffect(() => {
    if (activeKey === 'available') fetchStandards();
    if (activeKey === 'applications') fetchApplications();
    if (activeKey === 'certificates') fetchCertificates();
    if (activeKey === 'conversionRules') fetchConversionRules();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeKey]);

  const handleApply = (record) => {
    let evidenceText = '';
    let evidenceFile = '';
    Modal.confirm({
      width: 600,
      title: `申请证书「${record.standardName}」`,
      content: (
        <>
          <Input.TextArea
            rows={3}
            placeholder="可填写补充说明"
            onChange={(e) => {
              evidenceText = e.target.value;
            }}
            style={{ marginBottom: 12 }}
          />
          <UploadEvidence onUploaded={(url)=>{evidenceFile=url;}} />
        </>
      ),
      okText: '提交申请',
      onOk: async () => {
        try {
          setApplyLoading(true);
          await applyCertificate(record.id, evidenceFile, evidenceText);
          message.success('申请已提交，等待审核');
        } catch (e) {
          message.error(e.response?.data?.message || '提交失败');
        } finally {
          setApplyLoading(false);
        }
      }
    });
  };

  const availableCols = [
    { title: '标准ID', dataIndex: 'id', key: 'id' },
    { title: '标准名称', dataIndex: 'standardName', key: 'standardName' },
    { title: '颁发机构', dataIndex: 'issuingOrganization', key: 'issuingOrganization' },
    { title: '有效期', key: 'term', render: (_, r) => `${r.effectiveStartTime || ''} ~ ${r.effectiveEndTime || ''}` },
    { 
      title: '积分奖励', 
      dataIndex: 'pointValue', 
      key: 'pointValue',
      render: (value) => value ? <Tag color="gold">{value} 积分</Tag> : '-' 
    },
    { title: '状态', dataIndex: 'status', key: 'status', render: statusTag },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Button type="primary" icon={<FileAddOutlined />} onClick={() => handleApply(record)} loading={applyLoading}>
          申请
        </Button>
      )
    }
  ];

  const applicationCols = [
    { title: '申请ID', dataIndex: 'id', key: 'id' },
    { title: '标准ID', dataIndex: 'standardId', key: 'standardId' },
    { title: '证书名称', dataIndex: 'standardName', key: 'standardName' },
    { title: '状态', dataIndex: 'status', key: 'status', render: statusTag },
    { title: '申请时间', dataIndex: 'applyTime', key: 'applyTime' },
    { title: '审核时间', dataIndex: 'reviewTime', key: 'reviewTime' },
    { title: '审核人', dataIndex: 'reviewerName', key: 'reviewerName' },
    { title: '审核意见', dataIndex: 'reviewComment', key: 'reviewComment', render: (text)=> text || '-' },
    {
      title:'操作',
      key:'action',
      render:(_,record)=>(record.status===0?(<Popconfirm title="确定取消申请?" onConfirm={async ()=>{
        try{
          await cancelApplication(record.id);
          message.success('已取消');
          fetchApplications();
        }catch(e){message.error(e.response?.data?.message||'取消失败');}
      }}>
        <Button danger size="small">取消</Button>
      </Popconfirm>):null)
    }
  ];

  const certificateCols = [
    { title: '记录ID', dataIndex: 'id', key: 'id' },
    { title: '标准ID', dataIndex: 'standardId', key: 'standardId' },
    { title: '证书名称', dataIndex: 'standardName', key: 'standardName' },
    { title: '审核人', dataIndex: 'reviewerName', key: 'reviewerName' },
    { title: '颁发时间', dataIndex: 'issuedTime', key: 'issuedTime' },
    { title: '过期时间', dataIndex: 'expiryTime', key: 'expiryTime' }
  ];

  // 转换规则表格列定义
  const conversionRuleColumns = [
    {
      title: '规则名称',
      dataIndex: 'ruleName',
      key: 'ruleName',
      render: (text) => <strong>{text}</strong>
    },
    {
      title: '转换类型',
      key: 'conversionType',
      render: (_, record) => {
        const getTypeName = (type) => {
          switch (type) {
            case 1: return '积分';
            case 2: return '学分';
            case 3: return '证书';
            default: return '其他';
          }
        };
        
        return (
          <span>
            <Tag color="blue">{getTypeName(record.sourceType)}</Tag>
            <SwapOutlined style={{ margin: '0 8px' }} />
            <Tag color="green">{getTypeName(record.targetType)}</Tag>
          </span>
        );
      }
    },
    {
      title: '转换比例',
      dataIndex: 'conversionRatio',
      key: 'conversionRatio',
      render: (ratio) => <Tag color="gold">{ratio}</Tag>
    },
    {
      title: '转换限制',
      key: 'limits',
      render: (_, record) => (
        <>
          {record.minConversionAmount && (
            <div>最小: {record.minConversionAmount}</div>
          )}
          {record.maxConversionAmount && (
            <div>最大: {record.maxConversionAmount}</div>
          )}
        </>
      )
    },
    {
      title: '说明',
      dataIndex: 'conversionConditions',
      key: 'conversionConditions',
      ellipsis: {
        showTitle: false,
      },
      render: (conditions) => (
        <Tooltip placement="topLeft" title={conditions || '暂无说明'}>
          <Text ellipsis style={{ maxWidth: 200 }}>{conditions || '暂无说明'}</Text>
        </Tooltip>
      )
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <Tabs activeKey={activeKey} onChange={setActiveKey} items={[
        {
          key: 'available',
          label: '申请新证书',
          children: (
            <Spin spinning={loading}>
              <Table rowKey="id" dataSource={standards} columns={availableCols} pagination={{ pageSize: 8 }} />
            </Spin>
          )
        },
        {
          key: 'applications',
          label: '我的申请',
          children: (
            <Spin spinning={loading}>
              <Table rowKey="id" dataSource={applications} columns={applicationCols} pagination={{ pageSize: 8 }} />
            </Spin>
          )
        },
        {
          key: 'certificates',
          label: '已获证书',
          children: (
            <Spin spinning={loading}>
              <Table rowKey="id" dataSource={certificates} columns={certificateCols} pagination={{ pageSize: 8 }} />
            </Spin>
          )
        },
        {
          key: 'conversionRules',
          label: '转换规则',
          children: (
            <div>
              <Card title={<div><InfoCircleOutlined /> 证书与学分转换规则</div>} style={{ marginBottom: '24px' }}>
                {rulesLoading ? (
                  <div style={{ textAlign: 'center', padding: '20px 0' }}>
                    <Spin size="large" />
                  </div>
                ) : conversionRules.length > 0 ? (
                  <Table 
                    dataSource={conversionRules} 
                    columns={conversionRuleColumns} 
                    rowKey="id"
                    pagination={{ pageSize: 5 }}
                  />
                ) : (
                  <div style={{ textAlign: 'center', padding: '20px 0' }}>
                    暂无转换规则数据
                  </div>
                )}
              </Card>
              
              <Card title="转换规则说明" style={{ marginBottom: '24px' }}>
                <ul style={{ paddingLeft: '20px' }}>
                  <li>通过认证考试可获得相应证书</li>
                  <li>证书可根据规则转换为学分或积分</li>
                  <li>不同级别证书的转换比例不同</li>
                  <li>转换后的学分可用于学历提升或课程抵扣</li>
                  <li>转换规则可能会根据教育政策调整</li>
                  <li>部分转换需要提交申请并经过审核</li>
                </ul>
              </Card>
            </div>
          )
        }
      ]} />
    </div>
  );
};

// 简易上传组件，上传到 /api/upload 返回 URL
const UploadEvidence = ({ onUploaded }) => {
  const [uploading, setUploading] = useState(false);

  const props = {
    name: 'file',
    action: (process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080') + '/api/upload/file',
    headers: {
      Authorization: 'Bearer ' + (localStorage.getItem('token') || '')
    },
    showUploadList: false,
    beforeUpload: () => {
      setUploading(true);
    },
    onChange(info) {
      if (info.file.status === 'done') {
        setUploading(false);
        const url = info.file.response?.data?.url || info.file.response?.data; // 适配不同返回结构
        if (url) {
          message.success('上传成功');
          onUploaded(url);
        } else {
          message.error('上传失败');
        }
      } else if (info.file.status === 'error') {
        setUploading(false);
        message.error('上传失败');
      }
    }
  };

  return (
    <Upload {...props}>
      <Button icon={<UploadOutlined />} loading={uploading}>
        上传证明文件
      </Button>
    </Upload>
  );
};

export default StudentCertificatePage; 