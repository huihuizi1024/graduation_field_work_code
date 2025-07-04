import React, { useState, useEffect, useCallback } from 'react';
import { Table, Button, Modal, Form, Input, Select, Space, message, Popconfirm, Tag, Tooltip, DatePicker, InputNumber, Radio } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, SearchOutlined, ReloadOutlined, AuditOutlined, CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import debounce from 'lodash/debounce';
import moment from 'moment';
import api from '../api';

const { Option } = Select;
const { TextArea } = Input;
const { RangePicker } = DatePicker;

const CertificationStandardList = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingStandard, setEditingStandard] = useState(null);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [filters, setFilters] = useState({
    standardName: '',
    standardCode: '',
    category: undefined,
    status: undefined,
    reviewStatus: undefined,
  });

  const fetchCertificationStandards = useCallback(async () => {
    setLoading(true);
    try {
      const { current, pageSize } = pagination;
      const queryParams = new URLSearchParams({
        page: current - 1, // 后端页码从0开始
        size: pageSize,
        ...filters,
      }).toString();

      const result = await api.get(`/api/certification-standards?${queryParams}`);
      console.log('认证标准API响应:', result);
      if (result.code === 200) {
        setData(result.data?.records || []);
        setPagination((prev) => ({
          ...prev,
          total: result.data?.total || 0,
        }));
      } else {
        message.error(result.message || '获取认证标准失败！');
      }
    } catch (error) {
      message.error('获取认证标准失败！');
      console.error('Error fetching certification standards:', error);
    } finally {
      setLoading(false);
    }
  }, [pagination.current, pagination.pageSize, filters]);

  useEffect(() => {
    fetchCertificationStandards();
  }, [fetchCertificationStandards]);

  const handleTableChange = (newPagination, newFilters, sorter) => {
    console.log('Table Change:', newPagination, newFilters, sorter);
    setPagination(newPagination);
    setFilters({
      ...filters,
      category: newFilters.category ? newFilters.category[0] : undefined,
      status: newFilters.status ? newFilters.status[0] : undefined,
      reviewStatus: newFilters.reviewStatus ? newFilters.reviewStatus[0] : undefined,
    });
  };

  const handleSearch = (value, name) => {
    setFilters((prev) => ({ ...prev, [name]: value }));
    setPagination((prev) => ({ ...prev, current: 1 })); // Reset to first page on search
  };

  const debouncedSearchStandardName = useCallback(debounce((value) => handleSearch(value, 'standardName'), 500), []);
  const debouncedSearchStandardCode = useCallback(debounce((value) => handleSearch(value, 'standardCode'), 500), []);

  const handleResetFilters = () => {
    setFilters({
      standardName: '',
      standardCode: '',
      category: undefined,
      status: undefined,
      reviewStatus: undefined,
    });
    setPagination((prev) => ({ ...prev, current: 1 }));
  };

  const handleAdd = () => {
    setEditingStandard(null);
    form.resetFields();
    form.setFieldsValue({
      category: 1, // 默认课程
      status: 1,
      reviewStatus: 0, // 默认待审核
    });
    setIsModalVisible(true);
  };

  const handleEdit = (record) => {
    setEditingStandard(record);
    form.setFieldsValue({
      ...record,
      effectiveTime: record.effectiveStartTime && record.effectiveEndTime
        ? [moment(record.effectiveStartTime), moment(record.effectiveEndTime)]
        : undefined
    });
    setIsModalVisible(true);
  };

  const handleDelete = async (id) => {
    try {
      setLoading(true);
      const result = await api.delete(`/api/certification-standards/${id}`);
      if (result.code === 200) {
        message.success('认证标准删除成功！');
        fetchCertificationStandards();
      } else {
        message.error(result.message || '删除认证标准失败！');
      }
    } catch (error) {
      message.error('删除认证标准失败！');
      console.error('Error deleting certification standard:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      
      // 处理时间范围字段
      if (values.effectiveTime && values.effectiveTime.length === 2) {
        values.effectiveStartTime = values.effectiveTime[0].format('YYYY-MM-DD HH:mm:ss');
        values.effectiveEndTime = values.effectiveTime[1].format('YYYY-MM-DD HH:mm:ss');
      }
      delete values.effectiveTime;

      const saveUrl = editingStandard 
        ? `/api/certification-standards/${editingStandard.id}` 
        : '/api/certification-standards';
      const method = editingStandard ? 'PUT' : 'POST';

      setLoading(true);
      const response = await api.fetch(saveUrl, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(values)
      });
      
      if (!response.ok) {
        const error = await response.text();
        throw new Error(error || '保存失败');
      }
      
      message.success(editingStandard ? '更新成功' : '添加成功');
      setIsModalVisible(false);
      fetchCertificationStandards();
    } catch (error) {
      message.error(`保存失败: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setEditingStandard(null);
    form.resetFields();
  };

  const handleReview = async (id) => {
    Modal.confirm({
      title: '审核认证标准',
      content: (
        <div>
          <p>请选择审核结果：</p>
          <Input.TextArea 
            id="reviewComment" 
            placeholder="请输入审核意见（可选）" 
            rows={4} 
            maxLength={500} 
          />
        </div>
      ),
      okText: '通过',
      cancelText: '拒绝',
      onOk: async () => {
        const reviewComment = document.getElementById('reviewComment').value;
        try {
          setLoading(true);
          const result = await api.post(`/api/certification-standards/${id}/review`, null, {
            params: {
              reviewStatus: 1,
              reviewComment: reviewComment
            }
          });
          if (result.code === 200) {
            message.success('认证标准审核通过！');
            fetchCertificationStandards();
          } else {
            message.error(result.message || '审核操作失败！');
          }
        } catch (error) {
          message.error('审核操作失败！');
          console.error('Error reviewing certification standard:', error);
        } finally {
          setLoading(false);
        }
      },
      onCancel: async () => {
        const reviewComment = document.getElementById('reviewComment').value;
        try {
          setLoading(true);
          const result = await api.post(`/api/certification-standards/${id}/review`, null, {
            params: {
              reviewStatus: 2,
              reviewComment: reviewComment
            }
          });
          if (result.code === 200) {
            message.success('认证标准审核拒绝！');
            fetchCertificationStandards();
          } else {
            message.error(result.message || '审核操作失败！');
          }
        } catch (error) {
          message.error('审核操作失败！');
          console.error('Error reviewing certification standard:', error);
        } finally {
          setLoading(false);
        }
      },
    });
  };

  const handleChangeStatus = async (id, currentStatus) => {
    const newStatus = currentStatus === 1 ? 0 : 1; // 切换状态：1-有效，0-无效
    try {
      setLoading(true);
      const result = await api.post(`/api/certification-standards/${id}/status`, null, {
        params: { status: newStatus }
      });
      if (result.code === 200) {
        message.success(`认证标准已${newStatus === 1 ? '启用' : '禁用'}！`);
        fetchCertificationStandards();
      } else {
        message.error(result.message || '状态更改失败！');
      }
    } catch (error) {
      message.error('状态更改失败！');
      console.error('Error changing certification standard status:', error);
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      title: '标准名称',
      dataIndex: 'standardName',
      key: 'standardName',
      filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
        <div style={{ padding: 8 }}>
          <Input
            placeholder="搜索标准名称"
            value={selectedKeys[0]}
            onChange={(e) => {
              setSelectedKeys(e.target.value ? [e.target.value] : []);
              debouncedSearchStandardName(e.target.value);
            }}
            onPressEnter={() => confirm()}
            style={{ marginBottom: 8, display: 'block' }}
          />
          <Space>
            <Button
              type="primary"
              onClick={() => confirm()}
              icon={<SearchOutlined />}
              size="small"
              style={{ width: 90 }}
            >
              搜索
            </Button>
            <Button onClick={() => { clearFilters(); handleSearch('', 'standardName'); }} size="small" style={{ width: 90 }}>
              重置
            </Button>
          </Space>
        </div>
      ),
      filterIcon: (filtered) => <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />,
      render: (text, record) => (
        <Tooltip title={record.standardDescription || '暂无描述'}>
          <span style={{ cursor: 'pointer' }}>{text}</span>
        </Tooltip>
      ),
    },
    {
      title: '标准编码',
      dataIndex: 'standardCode',
      key: 'standardCode',
      filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
        <div style={{ padding: 8 }}>
          <Input
            placeholder="搜索标准编码"
            value={selectedKeys[0]}
            onChange={(e) => {
              setSelectedKeys(e.target.value ? [e.target.value] : []);
              debouncedSearchStandardCode(e.target.value);
            }}
            onPressEnter={() => confirm()}
            style={{ marginBottom: 8, display: 'block' }}
          />
          <Space>
            <Button
              type="primary"
              onClick={() => confirm()}
              icon={<SearchOutlined />}
              size="small"
              style={{ width: 90 }}
            >
              搜索
            </Button>
            <Button onClick={() => { clearFilters(); handleSearch('', 'standardCode'); }} size="small" style={{ width: 90 }}>
              重置
            </Button>
          </Space>
        </div>
      ),
      filterIcon: (filtered) => <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />,
    },
    {
      title: '标准类别',
      dataIndex: 'category',
      key: 'category',
      render: category => {
        const categoryMap = {
          1: '课程',
          2: '项目',
          3: '活动',
          4: '考试',
          5: '证书'
        };
        return categoryMap[category] || '未知类别';
      },
      filters: [
        { text: '课程', value: 1 },
        { text: '项目', value: 2 },
        { text: '活动', value: 3 },
        { text: '考试', value: 4 },
        { text: '证书', value: 5 },
      ],
      filterMultiple: false,
    },
    {
      title: '颁发机构',
      dataIndex: 'issuingOrganization',
      key: 'issuingOrganization',
    },
    {
      title: '积分奖励',
      dataIndex: 'pointValue',
      key: 'pointValue',
      render: (pointValue) => pointValue ? <Tag color="gold">{pointValue} 积分</Tag> : '-',
    },
    {
      title: '有效期开始时间',
      dataIndex: 'effectiveStartTime',
      key: 'effectiveStartTime',
      render: (text) => text ? moment(text).format('YYYY-MM-DD HH:mm:ss') : '-',
      sorter: (a, b) => moment(a.effectiveStartTime).valueOf() - moment(b.effectiveStartTime).valueOf(),
    },
    {
      title: '有效期结束时间',
      dataIndex: 'effectiveEndTime',
      key: 'effectiveEndTime',
      render: (text) => text ? moment(text).format('YYYY-MM-DD HH:mm:ss') : '-',
      sorter: (a, b) => moment(a.effectiveEndTime).valueOf() - moment(b.effectiveEndTime).valueOf(),
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: status => (
        <Tag color={status === 1 ? 'green' : 'red'}>
          {status === 1 ? '有效' : '无效'}
        </Tag>
      ),
      filters: [
        { text: '有效', value: 1 },
        { text: '无效', value: 0 },
      ],
      filterMultiple: false,
    },
    {
      title: '审核状态',
      dataIndex: 'reviewStatus',
      key: 'reviewStatus',
      render: (text) => {
        switch (text) {
          case 0: return <Tag color="orange">待审核</Tag>;
          case 1: return <Tag color="green">审核通过</Tag>;
          case 2: return <Tag color="red">审核拒绝</Tag>;
          default: return <Tag>未知</Tag>;
        }
      },
      filters: [
        { text: '待审核', value: 0 },
        { text: '审核通过', value: 1 },
        { text: '审核拒绝', value: 2 },
      ],
      filterMultiple: false,
    },
    {
      title: '创建人',
      dataIndex: 'creatorName',
      key: 'creatorName',
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      key: 'createTime',
      render: (text) => text ? moment(text).toLocaleString() : '-',
      sorter: (a, b) => moment(a.createTime).valueOf() - moment(b.createTime).valueOf(),
    },
    {
      title: '操作',
      key: 'actions',
      fixed: 'right',
      width: 180,
      render: (_, record) => (
        <Space size="small">
          <Button 
            icon={<EditOutlined />} 
            onClick={() => handleEdit(record)}
            type="link"
            size="small"
            title="编辑"
          />
          <Popconfirm
            title="确定删除此标准吗？"
            onConfirm={() => handleDelete(record.id)}
            okText="是"
            cancelText="否"
          >
            <Button 
              icon={<DeleteOutlined />} 
              danger 
              type="link"
              size="small"
              title="删除"
            />
          </Popconfirm>
          {record.reviewStatus === 0 && (
            <Button 
              icon={<AuditOutlined />} 
              onClick={() => handleReview(record.id)}
              type="link"
              size="small"
              title="审核"
            />
          )}
          <Button
            icon={record.status === 1 ? <CloseCircleOutlined /> : <CheckCircleOutlined />}
            onClick={() => handleChangeStatus(record.id, record.status)}
            type="link"
            size="small"
            title={record.status === 1 ? "禁用" : "启用"}
            danger={record.status === 1}
          />
        </Space>
      ),
    },
  ];

  const renderFormItems = () => {
    return (
      <>
        <Form.Item
          name="standardName"
          label="标准名称"
          rules={[{ required: true, message: '请输入标准名称' }]}
        >
          <Input placeholder="请输入标准名称" />
        </Form.Item>
        <Form.Item
          name="standardCode"
          label="标准编码"
          rules={[{ required: true, message: '请输入标准编码' }]}
        >
          <Input placeholder="请输入标准编码" />
        </Form.Item>
        <Form.Item
          name="standardDescription"
          label="标准描述"
        >
          <Input.TextArea rows={4} placeholder="请输入标准描述" />
        </Form.Item>
        <Form.Item
          name="category"
          label="标准类别"
          rules={[{ required: true, message: '请选择标准类别' }]}
        >
          <Select placeholder="请选择标准类别">
            <Select.Option value={1}>课程</Select.Option>
            <Select.Option value={2}>项目</Select.Option>
            <Select.Option value={3}>活动</Select.Option>
            <Select.Option value={4}>考试</Select.Option>
            <Select.Option value={5}>证书</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item
          name="issuingOrganization"
          label="颁发机构"
        >
          <Input placeholder="请输入颁发机构" />
        </Form.Item>
        <Form.Item
          name="pointValue"
          label="积分奖励"
        >
          <InputNumber min={0} precision={2} placeholder="获得证书可奖励的积分值" />
        </Form.Item>
        <Form.Item
          name="effectiveTime"
          label="有效期"
        >
          <RangePicker 
            showTime={{ format: 'HH:mm' }}
            format="YYYY-MM-DD HH:mm"
            placeholder={['开始时间', '结束时间']}
          />
        </Form.Item>
        <Form.Item
          name="status"
          label="状态"
          initialValue={1}
        >
          <Radio.Group>
            <Radio value={1}>有效</Radio>
            <Radio value={0}>无效</Radio>
          </Radio.Group>
        </Form.Item>
      </>
    );
  };

  return (
    <div style={{ padding: 24 }}>
      <h2 style={{ marginBottom: 24 }}>认证标准管理</h2>
      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between' }}>
        <Space>
          <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
            添加认证标准
          </Button>
          <Button icon={<ReloadOutlined />} onClick={fetchCertificationStandards}>
            刷新
          </Button>
          <Button onClick={handleResetFilters}>
            重置筛选
          </Button>
        </Space>
      </div>
      <Table
        columns={columns}
        dataSource={data}
        rowKey="id"
        loading={loading}
        pagination={pagination}
        onChange={handleTableChange}
        scroll={{ x: 'max-content' }}
      />

      <Modal
        title={editingStandard ? '编辑认证标准' : '添加认证标准'}
        visible={isModalVisible}
        onOk={handleSave}
        onCancel={handleCancel}
        width={800}
        confirmLoading={loading}
      >
        <Form
          form={form}
          layout="vertical"
          name="certification_standard_form"
          initialValues={{
            category: 1,
            status: 1,
            reviewStatus: 0,
          }}
        >
          {renderFormItems()}
          {editingStandard && (
            <>
              <Form.Item name="creatorName" label="创建人">
                <Input disabled />
              </Form.Item>
              <Form.Item name="creatorId" label="创建人ID">
                <InputNumber disabled style={{ width: '100%' }} />
              </Form.Item>
              <Form.Item name="createTime" label="创建时间">
                <Input disabled />
              </Form.Item>
              <Form.Item name="reviewerName" label="审核人">
                <Input disabled />
              </Form.Item>
              <Form.Item name="reviewerId" label="审核人ID">
                <InputNumber disabled style={{ width: '100%' }} />
              </Form.Item>
              <Form.Item name="reviewTime" label="审核时间">
                <Input disabled />
              </Form.Item>
              <Form.Item name="reviewComment" label="审核意见">
                <TextArea rows={2} disabled />
              </Form.Item>
              <Form.Item name="updateTime" label="更新时间">
                <Input disabled />
              </Form.Item>
            </>
          )}
        </Form>
      </Modal>
    </div>
  );
};

export default CertificationStandardList;
