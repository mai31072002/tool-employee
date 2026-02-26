import React, { useEffect } from "react";
import { Modal, Form, Input, Select, Button } from "antd";

const { Option } = Select;

const EditAccountForm = ({
    open,
    onCancel,
    onSubmit,
    account
}) => {
    const [form] = Form.useForm();

    useEffect(() => {
        if (open && account) {
            form.setFieldsValue({
                username: account.username,
                email: account.email,
                firstName: account.firstName,
                lastName: account.lastName,
                roles: account.roles,
            });
        }
    }, [open, account, form]);

    const handleFinish = (values) => {
        onSubmit(values);
    };

    return (
        <Modal
            open={open}
            title="Chỉnh sửa thông tin tài khoản"
            onCancel={onCancel}
            footer={null}
            destroyOnHidden
        >
            <Form
                layout="vertical"
                form={form}
                onFinish={handleFinish}
            >
                <Form.Item
                    label="Username"
                    name="username"
                >
                    <Input disabled />
                </Form.Item>

                <Form.Item
                    label="Email"
                    name="email"
                    rules={[
                        { required: true, message: "Vui lòng nhập email" },
                        { type: "email", message: "Email không hợp lệ" }
                    ]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    label="Họ"
                    name="firstName"
                    rules={[{ required: true, message: "Vui lòng nhập họ" }]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    label="Tên"
                    name="lastName"
                    rules={[{ required: true, message: "Vui lòng nhập tên" }]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    label="Roles"
                    name="roles"
                    rules={[{ required: true, message: "Vui lòng chọn role" }]}
                >
                    <Select mode="multiple" placeholder="Chọn role">
                        <Option value="ADMIN">ADMIN</Option>
                        <Option value="USER">USER</Option>
                        <Option value="MANAGER">MANAGER</Option>
                    </Select>
                </Form.Item>

                <Form.Item style={{ textAlign: "right" }}>
                    <Button onClick={onCancel} style={{ marginRight: 8 }}>
                        Hủy
                    </Button>
                    <Button type="primary" htmlType="submit">
                        Lưu
                    </Button>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default EditAccountForm;