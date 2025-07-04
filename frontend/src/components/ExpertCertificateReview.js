import React, { useEffect, useState } from 'react';
import { Table, Tag, Button, message, Modal, Spin, Input, Tabs } from 'antd';
import { CheckCircleOutlined, CloseCircleOutlined, ReloadOutlined } from '@ant-design/icons';
import { getApplications, reviewApplication, getMyReviewedApplications } from '../api/certificate';
import { useNavigate } from 'react-router-dom';

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

const ExpertCertificateReview = () => {
  const [activeKey, setActiveKey] = useState('pending');
  const [pendingData, setPendingData] = useState([]);
  const [historyData, setHistoryData] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const fetchPending = async () => {
    setLoading(true);
    try {
      const res = await getApplications(0); // 待审核
      if (res && res.code === 200) {
        setPendingData(res.data || []);
      } else {
        message.error(res?.message || '获取申请列表失败');
      }
    } catch (e) {
      message.error('获取申请列表失败');
    } finally {
      setLoading(false);
    }
  };

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const res = await getMyReviewedApplications();
      if(res && res.code===200){
        setHistoryData(res.data||[]);
      }
    }catch(err){
      message.error('获取审核记录失败');
    }finally{setLoading(false);}
  };

  useEffect(()=>{
    if(activeKey==='pending') fetchPending();
    else fetchHistory();
  },[activeKey]);

  const handleReview = (record, approve) => {
    let reason = '';
    Modal.confirm({
      title: approve ? '确认通过申请？' : '确认拒绝申请？',
      content: approve ? (
        `申请人ID: ${record.userId}, 认证标准ID: ${record.standardId} (${record.standardName || ''})`
      ) : (
        <Input.TextArea rows={3} placeholder="请输入拒绝理由" onChange={(e)=>{reason=e.target.value;}} />
      ),
      okText: approve ? '通过' : '拒绝',
      onOk: async () => {
        try {
          if(!approve && !reason.trim()){
            message.warning('请填写拒绝理由');
            throw new Error('empty');
          }
          await reviewApplication(record.id, approve ? 1 : 2, approve ? '' : reason);
          message.success('操作成功');
          fetchPending();
        } catch (e) {
          if(e.message!=='empty') message.error('操作失败');
        }
      }
    });
  };

  // 统一的查看链接渲染
  const evidenceRender = (_, record) => (
    <a onClick={() => navigate(`/expert/application/${record.id}`, { state: { application: record } })}>查看</a>
  );

  const baseColumns = [
    { title: '申请ID', dataIndex: 'id', key: 'id' },
    { title: '用户ID', dataIndex: 'userId', key: 'userId' },
    { title: '标准ID', dataIndex: 'standardId', key: 'standardId' },
    { title: '证书名称', dataIndex: 'standardName', key: 'standardName' },
    {
      title: '证明材料',
      dataIndex: 'evidenceUrl',
      key: 'evidenceUrl',
      render: evidenceRender
    },
  ];

  // 待审核列表列（含操作）
  const pendingColumns = [
    ...baseColumns,
    { title: '状态', dataIndex: 'status', key: 'status', render: statusTag },
    { title: '申请时间', dataIndex: 'applyTime', key: 'applyTime' },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        record.status === 0 && (
          <>
            <Button type="link" icon={<CheckCircleOutlined />} onClick={() => handleReview(record, true)}>通过</Button>
            <Button type="link" danger icon={<CloseCircleOutlined />} onClick={() => handleReview(record, false)}>拒绝</Button>
          </>
        )
      )
    }
  ];

  // 审核记录列
  const historyColumns = [
    ...baseColumns,
    { title: '审核结果', dataIndex: 'status', key: 'status', render: statusTag },
    { title: '审核时间', dataIndex: 'reviewTime', key: 'reviewTime' },
  ];

  return (
    <div style={{ padding: 24 }}>
      <Tabs
        activeKey={activeKey}
        onChange={setActiveKey}
        items={[
          {
            key: 'pending',
            label: '待审核',
            children: (
              <>
                <Button icon={<ReloadOutlined />} onClick={fetchPending} style={{ marginBottom: 16 }}>刷新</Button>
                <Table rowKey="id" dataSource={pendingData} columns={pendingColumns} loading={loading} />
              </>
            )
          },
          {
            key: 'history',
            label: '审核记录',
            children: (
              <>
                <Button icon={<ReloadOutlined />} onClick={fetchHistory} style={{ marginBottom: 16 }}>刷新</Button>
                <Table rowKey="id" dataSource={historyData} columns={historyColumns} loading={loading} />
              </>
            )
          }
        ]}
      />
    </div>
  );
};

export default ExpertCertificateReview; 