import React, { useEffect } from "react";
import { Modal, Form, Input, Button } from "antd";

const AddEditLeverModal = ({
    open,
    lever,
    onCancel,
    onSubmit
}) => {
    const [form] = Form.useForm();

    useEffect(() => {
        if (open && lever) {
            form.setFieldsValue({
                leverNumber: lever.leverNumber,
                description: lever.description
            });
        }
    }, [open, lever, form]);

    const handleFinish = (values) => {
        onSubmit({
            leverNumber: values.leverNumber,
            description: values.description
        });
    };

    return (
        <Modal
            open={open}
            title={lever ? "Cập nhật chức vụ" : "Thêm chức vụ"}
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
                    label="Cấp bậc"
                    name="leverNumber"
                    rules={[
                        { required: true, message: "Vui lòng nhập cấp bặc" }
                    ]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    label="Mô tả về cấp bặc"
                    name="description"
                    rules={[
                        { required: true, message: "Vui lòng nhập mô tả cấp bặc" }
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

export default AddEditLeverModal;
