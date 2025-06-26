import React, { useState, useEffect, useCallback } from 'react';
import { Table, Button, Modal, Form, Input, Select, Space, message, Popconfirm, Tag, Tooltip, DatePicker, InputNumber } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, SearchOutlined, ReloadOutlined, AuditOutlined, CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import debounce from 'lodash/debounce';
import moment from 'moment';
import api from '../api';

const { Option } = Select;
const { TextArea } = Input;

const InstitutionList = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingInstitution, setEditingInstitution] = useState(null);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [filters, setFilters] = useState({
    institutionName: '',
    institutionCode: '',
    institutionType: undefined,
    institutionLevel: undefined,
    province: '',
    city: '',
    status: undefined,
    reviewStatus: undefined,
  });
  const [isCertifyModalVisible, setIsCertifyModalVisible] = useState(false);
  const [certifyingInstitution, setCertifyingInstitution] = useState(null);
  const [certifyForm] = Form.useForm();

  const institutionTypeMap = {
    1: '高等院校',
    2: '职业院校',
    3: '培训机构',
    4: '社会组织',
  };

  const fetchInstitutions = useCallback(async () => {
    setLoading(true);
    try {
      const { current, pageSize } = pagination;
      // 过滤掉undefined/null/空字符串参数
      const filteredParams = Object.fromEntries(
        Object.entries({
          page: current - 1, // 后端页码从0开始
          size: pageSize,
          ...filters
        }).filter(([_, value]) => value !== undefined && value !== null && value !== '')
      );

      const result = await api.get('/api/institutions', { params: filteredParams });
      console.log('API响应:', result);
      if (result.code === 200) {
        setData(result.data?.records || []);
        setPagination((prev) => ({
          ...prev,
          total: result.data?.total || 0,
        }));
      } else {
        message.error(result.message || '获取机构列表失败！');
      }
    } catch (error) {
      message.error('获取机构列表失败！');
      console.error('Error fetching institutions:', error);
    } finally {
      setLoading(false);
    }
  }, [pagination.current, pagination.pageSize, filters]);

  useEffect(() => {
    fetchInstitutions();
  }, [fetchInstitutions]);

  const handleTableChange = (newPagination, newFilters, sorter) => {
    console.log('Table Change:', newPagination, newFilters, sorter);
    setPagination(newPagination);
    setFilters({
      ...filters,
      institutionType: newFilters.institutionType ? newFilters.institutionType[0] : undefined,
      institutionLevel: newFilters.institutionLevel ? newFilters.institutionLevel[0] : undefined,
      status: newFilters.status ? newFilters.status[0] : undefined,
      reviewStatus: newFilters.reviewStatus ? newFilters.reviewStatus[0] : undefined,
    });
  };

  const handleSearch = (value, name) => {
    setFilters((prev) => ({ ...prev, [name]: value }));
    setPagination((prev) => ({ ...prev, current: 1 }));
  };

  const debouncedSearchInstitutionName = useCallback(debounce((value) => handleSearch(value, 'institutionName'), 500), []);
  const debouncedSearchInstitutionCode = useCallback(debounce((value) => handleSearch(value, 'institutionCode'), 500), []);
  const debouncedSearchProvince = useCallback(debounce((value) => handleSearch(value, 'province'), 500), []);
  const debouncedSearchCity = useCallback(debounce((value) => handleSearch(value, 'city'), 500), []);

  const handleResetFilters = () => {
    setFilters({
      institutionName: '',
      institutionCode: '',
      institutionType: undefined,
      institutionLevel: undefined,
      province: '',
      city: '',
      status: undefined,
      reviewStatus: undefined,
    });
    setPagination((prev) => ({ ...prev, current: 1 }));
  };

  const handleAdd = () => {
    setEditingInstitution(null);
    form.resetFields();
    form.setFieldsValue({
      institutionType: 1,
      institutionLevel: 1,
      certificationLevel: 4,
      status: 1,
      reviewStatus: 0, // 默认待审核
    });
    setIsModalVisible(true);
  };

  const handleEdit = (record) => {
    console.log('编辑机构:', record);
    setEditingInstitution(record);
    const formValues = {
      ...record,
      certificationExpiryDate: record.certificationExpiryDate ? moment(record.certificationExpiryDate) : null,
    };
    form.setFieldsValue(formValues);
    setIsModalVisible(true);
  };

  const handleDelete = async (id) => {
    try {
      setLoading(true);
      const result = await api.delete(`/api/institutions/${id}`);
      if (result.code === 200) {
        message.success('机构删除成功！');
        fetchInstitutions();
      } else {
        message.error(result.message || '删除机构失败！');
      }
    } catch (error) {
      message.error('删除机构失败！');
      console.error('Error deleting institution:', error);
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
        certificationExpiryDate: values.certificationExpiryDate ? values.certificationExpiryDate.format('YYYY-MM-DD HH:mm:ss') : null,
      };
      console.log('提交给后端的数据:', submitData);

      setLoading(true);
      let response;
      let result;
      if (editingInstitution) {
        result = await api.put(`/api/institutions/${editingInstitution.id}`, submitData);
        if (result.code === 200) {
          message.success('机构更新成功！');
        } else {
          message.error(result.message || '机构更新失败！');
        }
      } else {
        result = await api.post('/api/institutions', submitData);
        if (result.code === 200) {
          message.success('机构添加成功！');
        } else {
          message.error(result.message || '机构添加失败！');
        }
      }
      setIsModalVisible(false);
      fetchInstitutions();
    } catch (error) {
      message.error('操作失败，请检查表单或网络！');
      console.error('Operation failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setEditingInstitution(null);
    form.resetFields();
  };

  const handleReview = async (id) => {
    Modal.confirm({
      title: '审核机构',
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
          const result = await api.post(`/api/institutions/${id}/review`, null, {
            params: {
              reviewStatus: 1,
              reviewComment: reviewComment
            }
          });
          if (result.code === 200) {
            message.success('机构审核通过！');
            fetchInstitutions();
          } else {
            message.error(result.message || '审核操作失败！');
          }
        } catch (error) {
          message.error('审核操作失败！');
          console.error('Error reviewing institution:', error);
        } finally {
          setLoading(false);
        }
      },
      onCancel: async () => {
        const reviewComment = document.getElementById('reviewComment').value;
        try {
          setLoading(true);
          const result = await api.post(`/api/institutions/${id}/review`, null, {
            params: {
              reviewStatus: 2,
              reviewComment: reviewComment
            }
          });
          if (result.code === 200) {
            message.success('机构审核拒绝！');
            fetchInstitutions();
          } else {
            message.error(result.message || '审核操作失败！');
          }
        } catch (error) {
          message.error('审核操作失败！');
          console.error('Error reviewing institution:', error);
        } finally {
          setLoading(false);
        }
      },
    });
  };

  const handleChangeStatus = async (id, currentStatus) => {
    let newStatus;
    if (currentStatus === 1) newStatus = 2; // 正常 -> 暂停
    else if (currentStatus === 2) newStatus = 3; // 暂停 -> 注销
    else newStatus = 1; // 注销或其他 -> 正常
    
    try {
      setLoading(true);
      const result = await api.post(`/api/institutions/${id}/status`, null, {
        params: { status: newStatus }
      });
      if (result.code === 200) {
        message.success(`机构状态已更改为${newStatus === 1 ? '正常' : newStatus === 2 ? '暂停' : '注销'}！`);
        fetchInstitutions();
      } else {
        message.error(result.message || '状态更改失败！');
      }
    } catch (error) {
      message.error('状态更改失败！');
      console.error('Error changing institution status:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCertify = (record) => {
    setCertifyingInstitution(record);
    certifyForm.resetFields();
    certifyForm.setFieldsValue({
      certificationLevel: record.certificationLevel,
      validityMonths: null, // 默认不填
    });
    setIsCertifyModalVisible(true);
  };

  const handleCertifyOk = async () => {
    try {
      const values = await certifyForm.validateFields();
      console.log('认证表单提交值:', values);

      setLoading(true);
      const result = await api.post(`/api/institutions/${certifyingInstitution.id}/certification`, null, {
        params: {
          certificationLevel: values.certificationLevel,
          validityMonths: values.validityMonths || ''
        }
      });
      if (result.code === 200) {
        message.success('机构认证等级评定成功！');
        setIsCertifyModalVisible(false);
        fetchInstitutions();
      } else {
        message.error(result.message || '机构认证等级评定失败！');
      }
    } catch (error) {
      message.error('机构认证等级评定失败，请检查表单或网络！');
      console.error('Error certifying institution:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCertifyCancel = () => {
    setIsCertifyModalVisible(false);
    setCertifyingInstitution(null);
    certifyForm.resetFields();
  };

  const columns = [
    {
      title: '机构名称',
      dataIndex: 'institutionName',
      key: 'institutionName',
      filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
        <div style={{ padding: 8 }}>
          <Input
            placeholder="搜索机构名称"
            value={selectedKeys[0]}
            onChange={(e) => {
              setSelectedKeys(e.target.value ? [e.target.value] : []);
              debouncedSearchInstitutionName(e.target.value);
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
            <Button onClick={() => { clearFilters(); handleSearch('', 'institutionName'); }} size="small" style={{ width: 90 }}>
              重置
            </Button>
          </Space>
        </div>
      ),
      filterIcon: (filtered) => <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />,
    },
    {
      title: '机构编码',
      dataIndex: 'institutionCode',
      key: 'institutionCode',
      filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
        <div style={{ padding: 8 }}>
          <Input
            placeholder="搜索机构编码"
            value={selectedKeys[0]}
            onChange={(e) => {
              setSelectedKeys(e.target.value ? [e.target.value] : []);
              debouncedSearchInstitutionCode(e.target.value);
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
            <Button onClick={() => { clearFilters(); handleSearch('', 'institutionCode'); }} size="small" style={{ width: 90 }}>
              重置
            </Button>
          </Space>
        </div>
      ),
      filterIcon: (filtered) => <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />,
    },
    {
      title: '统一社会信用代码',
      dataIndex: 'socialCreditCode',
      key: 'socialCreditCode',
    },
    {
      title: '机构类型',
      dataIndex: 'institutionType',
      key: 'institutionType',
      render: (text) => {
        switch (text) {
          case 1: return <Tag color="blue">高等院校</Tag>;
          case 2: return <Tag color="green">职业院校</Tag>;
          case 3: return <Tag color="purple">培训机构</Tag>;
          case 4: return <Tag color="orange">社会组织</Tag>;
          default: return <Tag>未知</Tag>;
        }
      },
      filters: [
        { text: '高等院校', value: 1 },
        { text: '职业院校', value: 2 },
        { text: '培训机构', value: 3 },
        { text: '社会组织', value: 4 },
      ],
      filterMultiple: false,
    },
    {
      title: '机构级别',
      dataIndex: 'institutionLevel',
      key: 'institutionLevel',
      render: (text) => {
        switch (text) {
          case 1: return <Tag color="gold">国家级</Tag>;
          case 2: return <Tag color="lime">省级</Tag>;
          case 3: return <Tag color="geekblue">市级</Tag>;
          case 4: return <Tag color="cyan">区县级</Tag>;
          default: return <Tag>未知</Tag>;
        }
      },
      filters: [
        { text: '国家级', value: 1 },
        { text: '省级', value: 2 },
        { text: '市级', value: 3 },
        { text: '区县级', value: 4 },
      ],
      filterMultiple: false,
    },
    {
      title: '法定代表人',
      dataIndex: 'legalRepresentative',
      key: 'legalRepresentative',
    },
    {
      title: '联系人',
      dataIndex: 'contactPerson',
      key: 'contactPerson',
    },
    {
      title: '联系电话',
      dataIndex: 'contactPhone',
      key: 'contactPhone',
    },
    {
      title: '联系邮箱',
      dataIndex: 'contactEmail',
      key: 'contactEmail',
    },
    {
      title: '省份',
      dataIndex: 'province',
      key: 'province',
      filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
        <div style={{ padding: 8 }}>
          <Input
            placeholder="搜索省份"
            value={selectedKeys[0]}
            onChange={(e) => {
              setSelectedKeys(e.target.value ? [e.target.value] : []);
              debouncedSearchProvince(e.target.value);
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
            <Button onClick={() => { clearFilters(); handleSearch('', 'province'); }} size="small" style={{ width: 90 }}>
              重置
            </Button>
          </Space>
        </div>
      ),
      filterIcon: (filtered) => <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />,
    },
    {
      title: '城市',
      dataIndex: 'city',
      key: 'city',
      filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
        <div style={{ padding: 8 }}>
          <Input
            placeholder="搜索城市"
            value={selectedKeys[0]}
            onChange={(e) => {
              setSelectedKeys(e.target.value ? [e.target.value] : []);
              debouncedSearchCity(e.target.value);
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
            <Button onClick={() => { clearFilters(); handleSearch('', 'city'); }} size="small" style={{ width: 90 }}>
              重置
            </Button>
          </Space>
        </div>
      ),
      filterIcon: (filtered) => <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />,
    },
    {
      title: '区县',
      dataIndex: 'district',
      key: 'district',
    },
    {
      title: '认证等级',
      dataIndex: 'certificationLevel',
      key: 'certificationLevel',
      render: (text) => {
        switch (text) {
          case 1: return <Tag color="gold">AAA级</Tag>;
          case 2: return <Tag color="lime">AA级</Tag>;
          case 3: return <Tag color="green">A级</Tag>;
          case 4: return <Tag color="geekblue">B级</Tag>;
          case 5: return <Tag color="cyan">C级</Tag>;
          default: return <Tag>未认证</Tag>;
        }
      },
    },
    {
      title: '认证有效期',
      dataIndex: 'certificationExpiryDate',
      key: 'certificationExpiryDate',
      render: (text) => text ? moment(text).format('YYYY-MM-DD') : '-',
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (text) => {
        switch (text) {
          case 1: return <Tag color="green">正常</Tag>;
          case 2: return <Tag color="orange">暂停</Tag>;
          case 3: return <Tag color="red">注销</Tag>;
          default: return <Tag>未知</Tag>;
        }
      },
      filters: [
        { text: '正常', value: 1 },
        { text: '暂停', value: 2 },
        { text: '注销', value: 3 },
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
            title="确定删除此机构吗？"
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
            title={record.status === 1 ? "暂停/注销" : "恢复正常"}
            danger={record.status === 1 || record.status === 2}
          />
          <Button
            icon={<CheckCircleOutlined />}
            onClick={() => handleCertify(record)}
            type="link"
            size="small"
            title="认证评定"
          />
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <h2 style={{ marginBottom: 24 }}>机构管理</h2>
      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between' }}>
        <Space>
          <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
            添加机构
          </Button>
          <Button icon={<ReloadOutlined />} onClick={fetchInstitutions}>
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
        title={editingInstitution ? '编辑机构' : '添加机构'}
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        width={800}
        confirmLoading={loading}
      >
        <Form
          form={form}
          layout="vertical"
          name="institution_form"
          initialValues={{
            institutionType: 1,
            institutionLevel: 1,
            certificationLevel: 4, // 默认B级
            status: 1,
            reviewStatus: 0,
          }}
        >
          <Form.Item
            name="institutionName"
            label="机构名称"
            rules={[{ required: true, message: '请输入机构名称！' }]}
          >
            <Input placeholder="例如：北京大学" />
          </Form.Item>
          <Form.Item
            name="institutionCode"
            label="机构编码"
            rules={[{ required: true, message: '请输入机构编码！' }]}
            tooltip="机构编码是机构的唯一标识。建议使用大写字母和下划线，例如：PKU。"
          >
            <Input placeholder="例如：PKU" />
          </Form.Item>
          <Form.Item
            name="institutionType"
            label="机构类型"
            rules={[{ required: true, message: '请选择机构类型！' }]}
          >
            <Select placeholder="请选择机构类型">
              <Option value={1}>高等院校</Option>
              <Option value={2}>职业院校</Option>
              <Option value={3}>培训机构</Option>
              <Option value={4}>社会组织</Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="institutionLevel"
            label="机构级别"
          >
            <Select placeholder="请选择机构级别（可选）">
              <Option value={1}>国家级</Option>
              <Option value={2}>省级</Option>
              <Option value={3}>市级</Option>
              <Option value={4}>区县级</Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="socialCreditCode"
            label="统一社会信用代码"
          >
            <Input placeholder="请输入统一社会信用代码（可选）" />
          </Form.Item>
          <Form.Item
            name="legalRepresentative"
            label="法定代表人"
          >
            <Input placeholder="请输入法定代表人（可选）" />
          </Form.Item>
          <Form.Item
            name="contactPerson"
            label="联系人"
            rules={[{ required: true, message: '请输入联系人！' }]}
          >
            <Input placeholder="请输入联系人" />
          </Form.Item>
          <Form.Item
            name="contactPhone"
            label="联系电话"
            rules={[{ required: true, message: '请输入联系电话！' }]}
          >
            <Input placeholder="请输入联系电话" />
          </Form.Item>
          <Form.Item
            name="contactEmail"
            label="联系邮箱"
            rules={[{ type: 'email', message: '请输入有效的邮箱地址！' }]}
          >
            <Input placeholder="请输入联系邮箱（可选）" />
          </Form.Item>
          <Form.Item
            name="province"
            label="省份"
          >
            <Input placeholder="请输入省份（可选）" />
          </Form.Item>
          <Form.Item
            name="city"
            label="城市"
          >
            <Input placeholder="请输入城市（可选）" />
          </Form.Item>
          <Form.Item
            name="district"
            label="区县"
          >
            <Input placeholder="请输入区县（可选）" />
          </Form.Item>
          <Form.Item
            name="address"
            label="详细地址"
          >
            <TextArea rows={2} placeholder="请输入详细地址（可选）" />
          </Form.Item>
          <Form.Item
            name="institutionDescription"
            label="机构简介"
          >
            <TextArea rows={3} placeholder="请输入机构简介（可选）" />
          </Form.Item>
          <Form.Item
            name="businessScope"
            label="业务范围"
          >
            <TextArea rows={3} placeholder="请输入业务范围（可选）" />
          </Form.Item>
          <Form.Item
            name="certificationLevel"
            label="认证等级"
          >
            <Select placeholder="请选择认证等级（可选）">
              <Option value={1}>AAA级</Option>
              <Option value={2}>AA级</Option>
              <Option value={3}>A级</Option>
              <Option value={4}>B级</Option>
              <Option value={5}>C级</Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="certificationExpiryDate"
            label="认证有效期"
          >
            <DatePicker showTime format="YYYY-MM-DD HH:mm:ss" style={{ width: '100%' }} placeholder="请选择认证有效期（可选）" />
          </Form.Item>
          <Form.Item
            name="status"
            label="状态"
            rules={[{ required: true, message: '请选择状态！' }]}
          >
            <Select placeholder="请选择状态">
              <Option value={1}>正常</Option>
              <Option value={2}>暂停</Option>
              <Option value={3}>注销</Option>
            </Select>
          </Form.Item>
          {editingInstitution && (
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
      <Modal
        title="机构认证评定"
        visible={isCertifyModalVisible}
        onOk={handleCertifyOk}
        onCancel={handleCertifyCancel}
        confirmLoading={loading}
      >
        <Form
          form={certifyForm}
          layout="vertical"
          name="certify_form"
          initialValues={{ certificationLevel: 4 }}
        >
          <Form.Item
            name="certificationLevel"
            label="认证等级"
            rules={[{ required: true, message: '请选择认证等级！' }]}
          >
            <Select placeholder="请选择认证等级">
              <Option value={1}>AAA级</Option>
              <Option value={2}>AA级</Option>
              <Option value={3}>A级</Option>
              <Option value={4}>B级</Option>
              <Option value={5}>C级</Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="validityMonths"
            label="认证有效期（月）"
            tooltip="若不填写，则表示无固定有效期。"
          >
            <InputNumber min={0} style={{ width: '100%' }} placeholder="请输入有效期月数（可选）" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default InstitutionList;
