import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, Select, Space, message, Popconfirm, InputNumber, Upload } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, UploadOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import * as productAPI from '../api/product';
import * as uploadAPI from '../api/upload';

const { Option } = Select;
const { TextArea } = Input;

const ProductList = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0
  });
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [fileList, setFileList] = useState([]);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, [pagination.current, pagination.pageSize]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await productAPI.getProducts({
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
        message.error('获取商品列表失败');
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      message.error('获取商品列表失败');
    } finally {
      setLoading(false);
    }
  };

  const handleTableChange = (pagination) => {
    setPagination(pagination);
  };

  const handleAdd = () => {
    setEditingProduct(null);
    form.resetFields();
    setFileList([]);
    setIsModalVisible(true);
  };

  const handleEdit = (record) => {
    setEditingProduct(record);
    form.setFieldsValue({
      ...record,
      imageUrl: record.imageUrl || ''
    });
    setFileList(record.imageUrl ? [{ uid: '-1', name: 'image.png', status: 'done', url: record.imageUrl }] : []);
    setIsModalVisible(true);
  };

  const handleDelete = async (id) => {
    try {
      await productAPI.deleteProduct(id);
      message.success('商品删除成功');
      fetchProducts();
    } catch (error) {
      console.error('Error deleting product:', error);
      message.error('删除商品失败');
    }
  };

  const handleStatusChange = async (id, status) => {
    try {
      await productAPI.changeProductStatus(id, status);
      message.success('商品状态更新成功');
      fetchProducts();
    } catch (error) {
      console.error('Error changing product status:', error);
      message.error('更新商品状态失败');
    }
  };

  const handleUpload = async (file) => {
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await uploadAPI.uploadImage(formData);
      if (response.code === 200 && response.data) {
        message.success('图片上传成功');
        // 设置图片URL到表单字段
        form.setFieldsValue({ imageUrl: response.data.url });
        return response.data.url;
      } else {
        message.error('图片上传失败');
        return null;
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      message.error('图片上传失败: ' + (error.message || '未知错误'));
      return null;
    } finally {
      setUploading(false);
    }
  };

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);
      
      // 处理图片上传
      let imageUrl = values.imageUrl;
      
      // 如果有新上传的文件，先上传图片
      if (fileList.length > 0 && fileList[0].originFileObj) {
        const uploadedUrl = await handleUpload(fileList[0].originFileObj);
        if (uploadedUrl) {
          imageUrl = uploadedUrl;
        } else {
          // 如果上传失败且没有提供URL，则返回错误
          if (!values.imageUrl) {
            message.error('图片上传失败，请重试或提供图片URL');
            setLoading(false);
            return;
          }
        }
      }
      
      const productData = {
        ...values,
        imageUrl,
        status: values.status || 1
      };
      
      if (editingProduct) {
        await productAPI.updateProduct(editingProduct.id, productData);
        message.success('商品更新成功');
      } else {
        await productAPI.createProduct(productData);
        message.success('商品添加成功');
      }
      
      setIsModalVisible(false);
      fetchProducts();
    } catch (error) {
      console.error('Error saving product:', error);
      message.error('保存商品失败: ' + (error.message || '未知错误'));
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 80
    },
    {
      title: '商品图片',
      dataIndex: 'imageUrl',
      key: 'imageUrl',
      width: 100,
      render: (text) => text ? <img src={text} alt="商品图片" style={{ width: 50, height: 50, objectFit: 'cover' }} /> : '-'
    },
    {
      title: '商品名称',
      dataIndex: 'name',
      key: 'name'
    },
    {
      title: '商品描述',
      dataIndex: 'description',
      key: 'description',
      ellipsis: true
    },
    {
      title: '所需积分',
      dataIndex: 'points',
      key: 'points'
    },
    {
      title: '分类',
      dataIndex: 'category',
      key: 'category'
    },
    {
      title: '库存',
      dataIndex: 'stock',
      key: 'stock'
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <span style={{ color: status === 1 ? 'green' : 'red' }}>
          {status === 1 ? '上架' : '下架'}
        </span>
      )
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Button icon={<EditOutlined />} onClick={() => handleEdit(record)}>
            编辑
          </Button>
          {record.status === 1 ? (
            <Button type="danger" onClick={() => handleStatusChange(record.id, 0)}>
              下架
            </Button>
          ) : (
            <Button type="primary" onClick={() => handleStatusChange(record.id, 1)}>
              上架
            </Button>
          )}
          <Popconfirm
            title="确定删除此商品吗？"
            onConfirm={() => handleDelete(record.id)}
            okText="是"
            cancelText="否"
            icon={<ExclamationCircleOutlined style={{ color: 'red' }} />}
          >
            <Button danger icon={<DeleteOutlined />}>
              删除
            </Button>
          </Popconfirm>
        </Space>
      )
    }
  ];

  const uploadProps = {
    onRemove: (file) => {
      setFileList([]);
      form.setFieldsValue({ imageUrl: '' });
    },
    beforeUpload: (file) => {
      // 检查文件类型
      const isImage = file.type.startsWith('image/');
      if (!isImage) {
        message.error('只能上传图片文件!');
        return Upload.LIST_IGNORE;
      }
      
      // 检查文件大小
      const isLt10M = file.size / 1024 / 1024 < 10;
      if (!isLt10M) {
        message.error('图片大小不能超过10MB!');
        return Upload.LIST_IGNORE;
      }
      
      setFileList([file]);
      return false; // 阻止自动上传
    },
    fileList
  };

  return (
    <div>
      <Button
        type="primary"
        icon={<PlusOutlined />}
        onClick={handleAdd}
        style={{ marginBottom: 16 }}
      >
        添加商品
      </Button>
      <Table
        columns={columns}
        dataSource={data}
        rowKey="id"
        pagination={pagination}
        loading={loading}
        onChange={handleTableChange}
      />

      <Modal
        title={editingProduct ? '编辑商品' : '添加商品'}
        open={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        confirmLoading={loading}
        width={600}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="name"
            label="商品名称"
            rules={[{ required: true, message: '请输入商品名称' }]}
          >
            <Input placeholder="请输入商品名称" />
          </Form.Item>
          <Form.Item
            name="description"
            label="商品描述"
            rules={[{ required: true, message: '请输入商品描述' }]}
          >
            <TextArea rows={4} placeholder="请输入商品描述" />
          </Form.Item>
          <Form.Item
            name="points"
            label="所需积分"
            rules={[{ required: true, message: '请输入所需积分', type: 'number' }]}
          >
            <InputNumber min={1} style={{ width: '100%' }} placeholder="请输入所需积分" />
          </Form.Item>
          <Form.Item
            name="category"
            label="商品分类"
            rules={[{ required: true, message: '请选择商品分类' }]}
          >
            <Select placeholder="请选择商品分类">
              <Option value="学习用品">学习用品</Option>
              <Option value="在线课程">在线课程</Option>
              <Option value="学习工具">学习工具</Option>
              <Option value="咨询服务">咨询服务</Option>
              <Option value="电子设备">电子设备</Option>
              <Option value="其他">其他</Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="stock"
            label="库存数量"
            rules={[{ required: true, message: '请输入库存数量', type: 'number' }]}
          >
            <InputNumber min={0} style={{ width: '100%' }} placeholder="请输入库存数量" />
          </Form.Item>
          <Form.Item
            name="imageUrl"
            label="商品图片URL"
            rules={[{ 
              required: fileList.length === 0, 
              message: '请上传商品图片或输入图片URL' 
            }]}
          >
            <Input placeholder="请输入商品图片URL或使用下方上传图片" />
          </Form.Item>
          <Form.Item label="上传图片">
            <Upload
              listType="picture"
              maxCount={1}
              {...uploadProps}
            >
              <Button icon={<UploadOutlined />} loading={uploading}>
                选择图片
              </Button>
            </Upload>
            <div style={{ marginTop: 8, color: '#888' }}>
              支持JPG、PNG格式，文件大小不超过10MB
            </div>
          </Form.Item>
          <Form.Item
            name="status"
            label="商品状态"
            initialValue={1}
          >
            <Select>
              <Option value={1}>上架</Option>
              <Option value={0}>下架</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ProductList; 