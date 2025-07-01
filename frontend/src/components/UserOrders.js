import React, { useState, useEffect } from 'react';
import { Table, Button, Tag, Space, message, Modal, Descriptions, Divider } from 'antd';
import { ArrowLeftOutlined, EyeOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import * as orderAPI from '../api/order';
import * as productAPI from '../api/product';
import dayjs from 'dayjs';

const UserOrders = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [orders, setOrders] = useState([]);
  const [isViewModalVisible, setIsViewModalVisible] = useState(false);
  const [viewingOrder, setViewingOrder] = useState(null);
  const [productInfo, setProductInfo] = useState(null);

  useEffect(() => {
    fetchMyOrders();
  }, []);

  const fetchMyOrders = async () => {
    setLoading(true);
    try {
      const response = await orderAPI.getMyOrders();
      if (response.code === 200) {
        setOrders(response.data || []);
      } else {
        message.error('获取订单失败');
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
      message.error('获取订单失败');
    } finally {
      setLoading(false);
    }
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
    },
    {
      title: '商品名称',
      dataIndex: 'productName',
      key: 'productName',
      render: (text, record) => text || `商品 #${record.productId}`
    },
    {
      title: '消耗积分',
      dataIndex: 'pointsUsed',
      key: 'pointsUsed',
    },
    {
      title: '订单状态',
      dataIndex: 'orderStatus',
      key: 'orderStatus',
      render: (status) => getOrderStatusTag(status)
    },
    {
      title: '下单时间',
      dataIndex: 'createTime',
      key: 'createTime',
      render: (text) => text ? dayjs(text).format('YYYY-MM-DD HH:mm:ss') : '-'
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Button icon={<EyeOutlined />} onClick={() => handleView(record)}>
          查看详情
        </Button>
      ),
    },
  ];

  return (
    <div className="user-orders">
      <div className="orders-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <Button 
          type="link" 
          icon={<ArrowLeftOutlined />} 
          onClick={() => navigate(-1)}
        >
          返回
        </Button>
        <h2>我的订单</h2>
        <div></div>
      </div>

      <Table 
        columns={columns} 
        dataSource={orders} 
        rowKey="id" 
        loading={loading}
        pagination={false}
      />

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
              <Descriptions.Item label="订单状态">{getOrderStatusTag(viewingOrder.orderStatus)}</Descriptions.Item>
              <Descriptions.Item label="消耗积分">{viewingOrder.pointsUsed}</Descriptions.Item>
              <Descriptions.Item label="下单时间">
                {viewingOrder.createTime ? dayjs(viewingOrder.createTime).format('YYYY-MM-DD HH:mm:ss') : '-'}
              </Descriptions.Item>
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

export default UserOrders; 