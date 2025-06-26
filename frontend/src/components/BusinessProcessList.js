import React, { useState, useEffect, useCallback } from 'react';
import { Table, Button, Modal, Form, Input, Select, Space, message, Popconfirm, Tag, Tooltip, DatePicker, InputNumber } from 'antd';
import api from '../api';
import { PlusOutlined, EditOutlined, DeleteOutlined, SearchOutlined, ReloadOutlined, CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import debounce from 'lodash/debounce';
import moment from 'moment';

const { Option } = Select;
const { TextArea } = Input;

const BusinessProcessList = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingProcess, setEditingProcess] = useState(null);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [filters, setFilters] = useState({
    processName: '',
    processCode: '',
    category: undefined,
    status: undefined,
  });

  const fetchBusinessProcesses = useCallback(async () => {
    setLoading(true);
    try {
      const { current, pageSize } = pagination;
      const queryParams = new URLSearchParams({
        page: current - 1, // 后端页码从0开始
        size: pageSize,
        ...filters,
      }).toString();

      const result = await api.get(`/api/business-processes`, {
        params: {
          page: current - 1,
          size: pageSize,
          ...filters
        }
      });
      console.log('业务流程API响应:', result);
      if (result.code === 200) {
        setData(result.data.records || []);
        setPagination((prev) => ({
          ...prev,
          total: result.data.total,
        }));
      } else {
        message.error(result.message || '获取业务流程失败！');
      }
    } catch (error) {
      message.error('获取业务流程失败！');
      console.error('Error fetching business processes:', error);
    } finally {
      setLoading(false);
    }
  }, [pagination.current, pagination.pageSize, filters]);

  useEffect(() => {
    fetchBusinessProcesses();
  }, [fetchBusinessProcesses]);

  const handleTableChange = (newPagination, newFilters, sorter) => {
    console.log('Table Change:', newPagination, newFilters, sorter);
    setPagination(newPagination);
    setFilters({
      ...filters,
      category: newFilters.category ? newFilters.category[0] : undefined,
      status: newFilters.status ? newFilters.status[0] : undefined,
    });
  };

  const handleSearch = (value, name) => {
    setFilters((prev) => ({ ...prev, [name]: value }));
    setPagination((prev) => ({ ...prev, current: 1 })); // Reset to first page on search
  };

  const debouncedSearchProcessName = useCallback(debounce((value) => handleSearch(value, 'processName'), 500), []);
  const debouncedSearchProcessCode = useCallback(debounce((value) => handleSearch(value, 'processCode'), 500), []);

  const handleResetFilters = () => {
    setFilters({
      processName: '',
      processCode: '',
      category: undefined,
      status: undefined,
    });
    setPagination((prev) => ({ ...prev, current: 1 }));
  };

  const handleAdd = () => {
    setEditingProcess(null);
    form.resetFields();
    form.setFieldsValue({
      category: 1, // 默认积分获取
      status: 1, // 默认启用
    });
    setIsModalVisible(true);
  };

  const handleEdit = (record) => {
    console.log('编辑流程:', record);
    setEditingProcess(record);
    form.setFieldsValue(record);
    setIsModalVisible(true);
  };

  const handleDelete = async (id) => {
    try {
      setLoading(true);
      const result = await api.delete(`/api/business-processes/${id}`);
      if (result.code === 200) {
        message.success('业务流程删除成功！');
        fetchBusinessProcesses();
      } else {
        message.error(result.message || '删除业务流程失败！');
      }
    } catch (error) {
      message.error('删除业务流程失败！');
      console.error('Error deleting business process:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      console.log('表单提交值:', values);

      setLoading(true);
      let response;
      let result;
      if (editingProcess) {
        result = await api.put(`/api/business-processes/${editingProcess.id}`, values);
        if (result.code === 200) {
          message.success('业务流程更新成功！');
        } else {
          message.error(result.message || '业务流程更新失败！');
        }
      } else {
        result = await api.post('/api/business-processes', values);
        if (result.code === 200) {
          message.success('业务流程添加成功！');
        } else {
          message.error(result.message || '业务流程添加失败！');
        }
      }
      setIsModalVisible(false);
      fetchBusinessProcesses();
    } catch (error) {
      message.error('操作失败，请检查表单或网络！');
      console.error('Operation failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setEditingProcess(null);
    form.resetFields();
  };

  const handleChangeStatus = async (id, currentStatus) => {
    const newStatus = currentStatus === 1 ? 0 : 1; // 切换状态：1-启用，0-禁用
    try {
      setLoading(true);
      const result = await api.post(`/api/business-processes/${id}/status`, null, {
        params: { status: newStatus }
      });
      if (result.code === 200) {
        message.success(`业务流程已${newStatus === 1 ? '启用' : '禁用'}！`);
        fetchBusinessProcesses();
      } else {
        message.error(result.message || '状态更改失败！');
      }
    } catch (error) {
      message.error('状态更改失败！');
      console.error('Error changing business process status:', error);
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      title: '流程名称',
      dataIndex: 'processName',
      key: 'processName',
      filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
        <div style={{ padding: 8 }}>
          <Input
            placeholder="搜索流程名称"
            value={selectedKeys[0]}
            onChange={(e) => {
              setSelectedKeys(e.target.value ? [e.target.value] : []);
              debouncedSearchProcessName(e.target.value);
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
            <Button onClick={() => { clearFilters(); handleSearch('', 'processName'); }} size="small" style={{ width: 90 }}>
              重置
            </Button>
          </Space>
        </div>
      ),
      filterIcon: (filtered) => <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />,
    },
    {
      title: '流程编码',
      dataIndex: 'processCode',
      key: 'processCode',
      filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
        <div style={{ padding: 8 }}>
          <Input
            placeholder="搜索流程编码"
            value={selectedKeys[0]}
            onChange={(e) => {
              setSelectedKeys(e.target.value ? [e.target.value] : []);
              debouncedSearchProcessCode(e.target.value);
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
            <Button onClick={() => { clearFilters(); handleSearch('', 'processCode'); }} size="small" style={{ width: 90 }}>
              重置
            </Button>
          </Space>
        </div>
      ),
      filterIcon: (filtered) => <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />,
    },
    {
      title: '流程类别',
      dataIndex: 'category',
      key: 'category',
      render: (text) => {
        switch (text) {
          case 1: return <Tag color="blue">积分获取</Tag>;
          case 2: return <Tag color="green">积分转换</Tag>;
          case 3: return <Tag color="purple">认证申请</Tag>;
          case 4: return <Tag color="orange">活动参与</Tag>;
          case 5: return <Tag color="cyan">课程学习</Tag>;
          default: return <Tag>未知</Tag>;
        }
      },
      filters: [
        { text: '积分获取', value: 1 },
        { text: '积分转换', value: 2 },
        { text: '认证申请', value: 3 },
        { text: '活动参与', value: 4 },
        { text: '课程学习', value: 5 },
      ],
      filterMultiple: false,
    },
    {
      title: '负责部门',
      dataIndex: 'responsibleDepartment',
      key: 'responsibleDepartment',
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (text) => {
        switch (text) {
          case 1: return <Tag color="green">启用</Tag>;
          case 0: return <Tag color="red">禁用</Tag>;
          default: return <Tag>未知</Tag>;
        }
      },
      filters: [
        { text: '启用', value: 1 },
        { text: '禁用', value: 0 },
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
      width: 140,
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
            title="确定删除此流程吗？"
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
      <h2 style={{ marginBottom: 24 }}>业务流程管理</h2>
      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between' }}>
        <Space>
          <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
            添加业务流程
          </Button>
          <Button icon={<ReloadOutlined />} onClick={fetchBusinessProcesses}>
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
        title={editingProcess ? '编辑业务流程' : '添加业务流程'}
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        width={800}
        confirmLoading={loading}
      >
        <Form
          form={form}
          layout="vertical"
          name="business_process_form"
          initialValues={{
            category: 1,
            status: 1,
          }}
        >
          <Form.Item
            name="processName"
            label="流程名称"
            rules={[{ required: true, message: '请输入流程名称！' }]}
          >
            <Input placeholder="例如：在线课程积分获取流程" />
          </Form.Item>
          <Form.Item
            name="processCode"
            label="流程编码"
            rules={[{ required: true, message: '请输入流程编码！' }]}
            tooltip="流程编码是流程的唯一标识。建议使用大写字母和下划线，例如：ONLINE_COURSE_POINT。"
          >
            <Input placeholder="例如：ONLINE_COURSE_POINT" />
          </Form.Item>
          <Form.Item
            name="processDescription"
            label="流程描述"
          >
            <TextArea rows={3} placeholder="请输入流程描述（可选）" />
          </Form.Item>
          <Form.Item
            name="category"
            label="流程类别"
            rules={[{ required: true, message: '请选择流程类别！' }]}
          >
            <Select placeholder="请选择流程类别">
              <Option value={1}>积分获取</Option>
              <Option value={2}>积分转换</Option>
              <Option value={3}>认证申请</Option>
              <Option value={4}>活动参与</Option>
              <Option value={5}>课程学习</Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="responsibleDepartment"
            label="负责部门"
          >
            <Input placeholder="例如：教务处" />
          </Form.Item>
          <Form.Item
            name="status"
            label="状态"
            rules={[{ required: true, message: '请选择状态！' }]}
          >
            <Select placeholder="请选择状态">
              <Option value={1}>启用</Option>
              <Option value={0}>禁用</Option>
            </Select>
          </Form.Item>
          {editingProcess && (
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

export default BusinessProcessList;
