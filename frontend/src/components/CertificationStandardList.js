import React, { useState, useEffect, useCallback } from 'react';
import { Table, Button, Modal, Form, Input, Select, Space, message, Popconfirm, Tag, Tooltip, DatePicker, InputNumber } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, SearchOutlined, ReloadOutlined, AuditOutlined, CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import debounce from 'lodash/debounce';
import moment from 'moment';
import api from '../api';

const { Option } = Select;
const { TextArea } = Input;

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
    console.log('编辑标准:', record);
    setEditingStandard(record);
    const formValues = {
      ...record,
      effectiveStartTime: record.effectiveStartTime ? moment(record.effectiveStartTime) : null,
      effectiveEndTime: record.effectiveEndTime ? moment(record.effectiveEndTime) : null,
    };
    form.setFieldsValue(formValues);
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

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      console.log('表单提交值:', values);

      const submitData = {
        ...values,
        effectiveStartTime: values.effectiveStartTime ? values.effectiveStartTime.format('YYYY-MM-DD HH:mm:ss') : null,
        effectiveEndTime: values.effectiveEndTime ? values.effectiveEndTime.format('YYYY-MM-DD HH:mm:ss') : null,
      };
      console.log('提交给后端的数据:', submitData);

      setLoading(true);
      let response;
      let result;
      if (editingStandard) {
        result = await api.put(`/api/certification-standards/${editingStandard.id}`, submitData);
        if (result.code === 200) {
          message.success('认证标准更新成功！');
        } else {
          message.error(result.message || '认证标准更新失败！');
        }
      } else {
        result = await api.post('/api/certification-standards', submitData);
        if (result.code === 200) {
          message.success('认证标准添加成功！');
        } else {
          message.error(result.message || '认证标准添加失败！');
        }
      }
      setIsModalVisible(false);
      fetchCertificationStandards();
    } catch (error) {
      message.error('操作失败，请检查表单或网络！');
      console.error('Operation failed:', error);
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
      render: (text) => {
        switch (text) {
          case 1: return <Tag color="blue">课程</Tag>;
          case 2: return <Tag color="green">项目</Tag>;
          case 3: return <Tag color="purple">活动</Tag>;
          case 4: return <Tag color="orange">考试</Tag>;
          case 5: return <Tag color="cyan">证书</Tag>;
          default: return <Tag>未知</Tag>;
        }
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
      render: (text) => {
        switch (text) {
          case 1: return <Tag color="green">有效</Tag>;
          case 0: return <Tag color="red">无效</Tag>;
          default: return <Tag>未知</Tag>;
        }
      },
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
        onOk={handleOk}
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
          <Form.Item
            name="standardName"
            label="标准名称"
            rules={[{ required: true, message: '请输入标准名称！' }]}
          >
            <Input placeholder="例如：计算机等级考试二级" />
          </Form.Item>
          <Form.Item
            name="standardCode"
            label="标准编码"
            rules={[{ required: true, message: '请输入标准编码！' }]}
            tooltip="标准编码是标准的唯一标识。建议使用大写字母和下划线，例如：COMPUTER_GRADE_II。"
          >
            <Input placeholder="例如：COMPUTER_GRADE_II" />
          </Form.Item>
          <Form.Item
            name="standardDescription"
            label="标准描述"
          >
            <TextArea rows={3} placeholder="请输入标准描述（可选）" />
          </Form.Item>
          <Form.Item
            name="category"
            label="标准类别"
            rules={[{ required: true, message: '请选择标准类别！' }]}
          >
            <Select placeholder="请选择标准类别">
              <Option value={1}>课程</Option>
              <Option value={2}>项目</Option>
              <Option value={3}>活动</Option>
              <Option value={4}>考试</Option>
              <Option value={5}>证书</Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="issuingOrganization"
            label="颁发机构"
          >
            <Input placeholder="请输入颁发机构（可选）" />
          </Form.Item>
          <Form.Item
            name="effectiveStartTime"
            label="有效期开始时间"
          >
            <DatePicker showTime format="YYYY-MM-DD HH:mm:ss" style={{ width: '100%' }} placeholder="请选择有效期开始时间（可选）" />
          </Form.Item>
          <Form.Item
            name="effectiveEndTime"
            label="有效期结束时间"
          >
            <DatePicker showTime format="YYYY-MM-DD HH:mm:ss" style={{ width: '100%' }} placeholder="请选择有效期结束时间（可选）" />
          </Form.Item>
          <Form.Item
            name="status"
            label="状态"
            rules={[{ required: true, message: '请选择状态！' }]}
          >
            <Select placeholder="请选择状态">
              <Option value={1}>有效</Option>
              <Option value={0}>无效</Option>
            </Select>
          </Form.Item>
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
