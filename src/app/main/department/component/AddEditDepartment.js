import React, { useEffect } from "react";
import { Modal, Form, Input, Select, Button } from "antd";

const { Option } = Select;

const AddEditDepartmentModal = ({
    open,
    department,
    onCancel,
    onSubmit
}) => {
    const [form] = Form.useForm();

    useEffect(() => {
        if (open && department) {
            form.setFieldsValue({
                departmentName: department.departmentName,
                description: department.description
            });
        }
    }, [open, department, form]);

    const handleFinish = (values) => {
        onSubmit({
            departmentName: values.departmentName,
            description: values.description
        });
    };

    return (
        <Modal
            open={open}
            title={department ? "Cập nhật phòng ban" : "Thêm phòng ban"}
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
                    label="Tên phòng ban"
                    name="departmentName"
                    rules={[
                        { required: true, message: "Vui lòng nhập phòng ban" }
                    ]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    label="Mô tả phòng ban"
                    name="description"
                    rules={[
                        { required: true, message: "Vui lòng nhập mô tả phòng ban" }
                    ]}
                >
                    <Input />
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

export default AddEditDepartmentModal;
