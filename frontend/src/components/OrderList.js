import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, Select, Space, message, Tag, Descriptions, Divider } from 'antd';
import { EditOutlined, EyeOutlined } from '@ant-design/icons';
import * as orderAPI from '../api/order';
import * as productAPI from '../api/product';
import dayjs from 'dayjs';

const { Option } = Select;

const OrderList = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0
  });
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isViewModalVisible, setIsViewModalVisible] = useState(false);
  const [editingOrder, setEditingOrder] = useState(null);
  const [viewingOrder, setViewingOrder] = useState(null);
  const [productInfo, setProductInfo] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, [pagination.current, pagination.pageSize]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await orderAPI.getOrders({
        page: pagination.current - 1,
        size: pagination.pageSize
      });
      
      if (response.code === 200 && response.data) {
        setData(response.data.records || []);
        setPagination({
          ...pagination,
          total: response.data.total || 0
        });
      } else {
        message.error('获取订单列表失败');
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
      message.error('获取订单列表失败');
    } finally {
      setLoading(false);
    }
  };

  const handleTableChange = (pagination) => {
    setPagination(pagination);
  };

  const handleEdit = (record) => {
    setEditingOrder(record);
    form.setFieldsValue({
      orderStatus: record.orderStatus,
      remark: record.remark
    });
    setIsModalVisible(true);
  };

  const handleView = async (record) => {
    setViewingOrder(record);
    setIsViewModalVisible(true);
    
    // 获取商品详情
    try {
      const response = await productAPI.getProductById(record.productId);
      if (response.code === 200) {
        setProductInfo(response.data);
      }
    } catch (error) {
      console.error('Error fetching product info:', error);
    }
  };

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);
      
      await orderAPI.changeOrderStatus(editingOrder.id, values.orderStatus);
      
      // 如果有备注更新，需要更新整个订单
      if (values.remark !== editingOrder.remark) {
        const orderData = {
          ...editingOrder,
          orderStatus: values.orderStatus,
          remark: values.remark
        };
        await orderAPI.updateOrder(editingOrder.id, orderData);
      }
      
      message.success('订单更新成功');
      setIsModalVisible(false);
      fetchOrders();
    } catch (error) {
      console.error('Error updating order:', error);
      message.error('更新订单失败');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleViewCancel = () => {
    setIsViewModalVisible(false);
    setViewingOrder(null);
    setProductInfo(null);
  };

  const getOrderStatusTag = (status) => {
    switch (status) {
      case 1:
        return <Tag color="gold">待发货</Tag>;
      case 2:
        return <Tag color="blue">已发货</Tag>;
      case 3:
        return <Tag color="green">已完成</Tag>;
      case 4:
        return <Tag color="red">已取消</Tag>;
      default:
        return <Tag color="default">未知状态</Tag>;
    }
  };

  const columns = [
    {
      title: '订单ID',
      dataIndex: 'id',
      key: 'id',
      width: 80
    },
    {
      title: '用户ID',
      dataIndex: 'userId',
      key: 'userId',
      width: 80
    },
    {
      title: '商品ID',
      dataIndex: 'productId',
      key: 'productId',
      width: 80
    },
    {
      title: '消耗积分',
      dataIndex: 'pointsUsed',
      key: 'pointsUsed'
    },
    {
      title: '订单状态',
      dataIndex: 'orderStatus',
      key: 'orderStatus',
      render: (status) => getOrderStatusTag(status)
    },
    {
      title: '收货人',
      dataIndex: 'contactName',
      key: 'contactName'
    },
    {
      title: '联系电话',
      dataIndex: 'contactPhone',
      key: 'contactPhone'
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      key: 'createTime',
      render: (text) => text ? dayjs(text).format('YYYY-MM-DD HH:mm:ss') : '-'
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Button icon={<EyeOutlined />} onClick={() => handleView(record)}>
            查看
          </Button>
          <Button icon={<EditOutlined />} onClick={() => handleEdit(record)}>
            编辑
          </Button>
        </Space>
      )
    }
  ];

  return (
    <div>
      <Table
        columns={columns}
        dataSource={data}
        rowKey="id"
        pagination={pagination}
        loading={loading}
        onChange={handleTableChange}
      />

      {/* 编辑订单状态弹窗 */}
      <Modal
        title="更新订单状态"
        open={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        confirmLoading={loading}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="orderStatus"
            label="订单状态"
            rules={[{ required: true, message: '请选择订单状态' }]}
          >
            <Select>
              <Option value={1}>待发货</Option>
              <Option value={2}>已发货</Option>
              <Option value={3}>已完成</Option>
              <Option value={4}>已取消</Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="remark"
            label="备注"
          >
            <Input.TextArea rows={4} placeholder="请输入备注信息" />
          </Form.Item>
        </Form>
      </Modal>

      {/* 查看订单详情弹窗 */}
      <Modal
        title="订单详情"
        open={isViewModalVisible}
        onCancel={handleViewCancel}
        footer={[
          <Button key="back" onClick={handleViewCancel}>
            关闭
          </Button>
        ]}
        width={700}
      >
        {viewingOrder && (
          <>
            <Descriptions title="订单信息" bordered column={1}>
              <Descriptions.Item label="订单ID">{viewingOrder.id}</Descriptions.Item>
              <Descriptions.Item label="用户ID">{viewingOrder.userId}</Descriptions.Item>
              <Descriptions.Item label="订单状态">{getOrderStatusTag(viewingOrder.orderStatus)}</Descriptions.Item>
              <Descriptions.Item label="消耗积分">{viewingOrder.pointsUsed}</Descriptions.Item>
              <Descriptions.Item label="创建时间">
                {viewingOrder.createTime ? dayjs(viewingOrder.createTime).format('YYYY-MM-DD HH:mm:ss') : '-'}
              </Descriptions.Item>
              <Descriptions.Item label="交易ID">{viewingOrder.transactionId || '-'}</Descriptions.Item>
            </Descriptions>
            
            <Divider />
            
            <Descriptions title="收货信息" bordered column={1}>
              <Descriptions.Item label="收货人">{viewingOrder.contactName}</Descriptions.Item>
              <Descriptions.Item label="联系电话">{viewingOrder.contactPhone}</Descriptions.Item>
              <Descriptions.Item label="收货地址">{viewingOrder.shippingAddress}</Descriptions.Item>
              <Descriptions.Item label="备注">{viewingOrder.remark || '-'}</Descriptions.Item>
            </Descriptions>
            
            <Divider />
            
            {productInfo && (
              <Descriptions title="商品信息" bordered column={1}>
                <Descriptions.Item label="商品ID">{productInfo.id}</Descriptions.Item>
                <Descriptions.Item label="商品名称">{productInfo.name}</Descriptions.Item>
                <Descriptions.Item label="商品描述">{productInfo.description}</Descriptions.Item>
                <Descriptions.Item label="所需积分">{productInfo.points}</Descriptions.Item>
                <Descriptions.Item label="商品分类">{productInfo.category}</Descriptions.Item>
                {productInfo.imageUrl && (
                  <Descriptions.Item label="商品图片">
                    <img src={productInfo.imageUrl} alt="商品图片" style={{ maxWidth: '200px' }} />
                  </Descriptions.Item>
                )}
              </Descriptions>
            )}
          </>
        )}
      </Modal>
    </div>
  );
};

export default OrderList; 