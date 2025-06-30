import React, { useEffect } from 'react';
import { Modal, Form, Input, message } from 'antd';

const { TextArea } = Input;

const EditProfileModal = ({ visible, onCancel, onOk, initialData, role }) => {
    const [form] = Form.useForm();

    useEffect(() => {
        if (visible && initialData) {
            form.setFieldsValue(initialData);
        }
    }, [visible, initialData, form]);

    const handleOk = () => {
        form.validateFields()
            .then(() => {
                const values = form.getFieldsValue();
                onOk(values);
                form.resetFields();
            })
            .catch(info => {
                console.log('Validate Failed:', info);
                message.error('请检查表单输入！');
            });
    };

    return (
        <Modal
            title="编辑个人信息"
            visible={visible}
            onOk={handleOk}
            onCancel={onCancel}
            okText="保存"
            cancelText="取消"
            destroyOnClose
        >
            <Form form={form} layout="vertical" name="edit_profile_form">
                <Form.Item
                    name="fullName"
                    label="真实姓名"
                    rules={[{ required: true, message: '请输入您的真实姓名!' }]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    name="email"
                    label="电子邮箱"
                    rules={[
                        { required: true, message: '请输入您的电子邮箱!' },
                        { type: 'email', message: '请输入有效的电子邮箱地址!' }
                    ]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    name="phone"
                    label="手机号码"
                    rules={[{ required: true, message: '请输入您的手机号码!' }]}
                >
                    <Input />
                </Form.Item>

                {role === 'expert' && (
                    <>
                        <Form.Item
                            name="expertise"
                            label="专业领域"
                            rules={[{ required: true, message: '请输入您的专业领域!' }]}
                        >
                            <Input />
                        </Form.Item>
                        <Form.Item
                            name="description"
                            label="个人简介"
                        >
                            <TextArea rows={4} />
                        </Form.Item>
                    </>
                )}
            </Form>
        </Modal>
    );
};

export default EditProfileModal; 