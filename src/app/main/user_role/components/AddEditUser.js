import React, { useEffect } from "react";
import { Modal, Form, Input, Select, Button } from "antd";

const { Option } = Select;

const EditUserModal = ({
    open,
    onCancel,
    onSubmit,
    user,
    roleOptions
}) => {
    const [form] = Form.useForm();

    useEffect(() => {
        if (open && user) {
            form.setFieldsValue({
                username: user.username,
                email: user.email,
                roles: user.roles
            });
        }
    }, [open, user, form]);

    const handleFinish = (values) => {
        console.log("values: ", values);
        
        onSubmit({
            userId: user.userId,
            username: values.username,
            email: values.email,
            roles: values.roles
        });
    };

    return (
        <Modal
            open={open}
            title="Chỉnh sửa thông tin người dùng"
            onCancel={onCancel}
            footer={null}
            destroyOnHidden
        >
            <Form
                layout="vertical"
                form={form}
                onFinish={handleFinish}
            >
                <Form.Item label="Username" name="username">
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
                    label="Roles"
                    name="roles"
                    rules={[{ required: true, message: "Chọn ít nhất 1 role" }]}
                >
                    <Select mode="multiple">
                        {roleOptions.map(role => (
                            <Option key={role.roleName} value={role.roleName}>
                                {role.discription}
                            </Option>
                        ))}
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

export default EditUserModal;
