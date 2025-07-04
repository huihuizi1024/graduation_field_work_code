import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, Select, Space, message, Popconfirm, InputNumber, Upload } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, UploadOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import * as productAPI from '../api/product';
import * as uploadAPI from '../api/upload';
import { validateImage, FILE_SIZE_LIMITS } from '../utils/fileValidator';

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
      console.log('Uploading file:', {
        name: file.name,
        type: file.type,
        size: file.size,
        lastModified: file.lastModified
      });
      
      const response = await uploadAPI.uploadImage(file);
      console.log('Upload response:', response);
      
      if (response.code === 200 && response.data) {
        message.success('图片上传成功');
        const imageUrl = response.data.url;
        
        // 更新表单字段和文件列表
        form.setFieldsValue({ imageUrl });
        setFileList([{
          uid: '-1',
          name: file.name,
          status: 'done',
          url: imageUrl,
          response: response.data // 保存响应数据
        }]);
        
        return imageUrl;
      } else {
        message.error('图片上传失败');
        setFileList([]);
        return null;
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      message.error('图片上传失败: ' + (error.message || '未知错误'));
      setFileList([]);
      return null;
    } finally {
      setUploading(false);
    }
  };

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      console.log('Form values before save:', values);
      setLoading(true);
      
      // 构建商品数据
      const productData = {
        ...values,
        imageUrl: values.imageUrl,
        status: values.status || 1,
        points: Number(values.points),
        stock: Number(values.stock)
      };
      
      console.log('Product data to save:', productData);
      
      if (editingProduct) {
        await productAPI.updateProduct(editingProduct.id, productData);
        message.success('商品更新成功');
      } else {
        await productAPI.createProduct(productData);
        message.success('商品添加成功');
      }
      
      setIsModalVisible(false);
      setFileList([]);
      form.resetFields();
      fetchProducts();
    } catch (error) {
      console.error('Error saving product:', {
        error,
        formValues: form.getFieldsValue(),
        fileList
      });
      if (error.errorFields) {
        const errorMessages = error.errorFields
          .map(field => `${field.name.join('.')}: ${field.errors.join(', ')}`)
          .join('\n');
        message.error('表单验证失败：\n' + errorMessages);
      } else {
        message.error('保存商品失败: ' + (error.message || '未知错误'));
      }
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
    name: 'file',
    multiple: false,
    showUploadList: true,
    accept: 'image/*',
    maxCount: 1,
    onRemove: (file) => {
      setFileList([]);
      form.setFieldsValue({ imageUrl: '' });
    },
    beforeUpload: async (file) => {
      // 添加调试日志
      console.log('Before upload file details:', {
        fileName: file.name,
        fileType: file.type,
        fileSize: file.size,
        lastModified: file.lastModified
      });
      
      // 使用统一的文件验证工具
      if (!validateImage(file)) {
        return Upload.LIST_IGNORE;
      }
      
      try {
        const imageUrl = await handleUpload(file);
        if (imageUrl) {
          // 更新表单字段
          form.setFieldsValue({ imageUrl });
        }
      } catch (error) {
        console.error('Upload error:', error);
      }
      return false;
    },
    onChange: async (info) => {
      console.log('Upload onChange:', info);
      if (info.file.status === 'removed') {
        setFileList([]);
        form.setFieldsValue({ imageUrl: '' });
      }
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
        onCancel={() => {
          setIsModalVisible(false);
          setFileList([]);
          form.resetFields();
        }}
        confirmLoading={loading}
        width={600}
      >
        <Form 
          form={form} 
          layout="vertical" 
          initialValues={{ 
            status: 1,
            points: 0,
            stock: 0
          }}
        >
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
            rules={[
              { required: true, message: '请输入所需积分' },
              { type: 'number', min: 0, message: '积分必须大于等于0' }
            ]}
          >
            <InputNumber
              min={0}
              style={{ width: '100%' }}
              placeholder="请输入所需积分"
            />
          </Form.Item>
          
          <Form.Item
            name="stock"
            label="库存数量"
            rules={[
              { required: true, message: '请输入库存数量' },
              { type: 'number', min: 0, message: '库存必须大于等于0' }
            ]}
          >
            <InputNumber
              min={0}
              style={{ width: '100%' }}
              placeholder="请输入库存数量"
            />
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
            name="imageUrl"
            label="商品图片"
            rules={[{ 
              required: true,
              message: '请上传商品图片或输入图片URL' 
            }]}
            validateTrigger={['onChange', 'onBlur']}
          >
            <Input placeholder="请输入商品图片URL或使用下方上传图片" />
          </Form.Item>
          
          <Form.Item label="上传图片">
            <Upload {...uploadProps}>
              {fileList.length < 1 && (
                <Button icon={<UploadOutlined />} loading={uploading}>
                  {uploading ? '上传中...' : '点击上传'}
                </Button>
              )}
            </Upload>
            <div style={{ marginTop: 8, color: '#888' }}>
              支持 JPG、PNG、GIF、WEBP 格式，最大 {FILE_SIZE_LIMITS.IMAGE}MB
            </div>
          </Form.Item>
          
          <Form.Item
            name="status"
            label="商品状态"
            rules={[{ required: true, message: '请选择商品状态' }]}
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