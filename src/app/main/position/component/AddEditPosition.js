import React, { useEffect } from "react";
import { Modal, Form, Input, Button, Select } from "antd";

const AddEditPositionModal = ({
    open,
    position,
    leverData,
    onCancel,
    onSubmit
}) => {
    const [form] = Form.useForm();

    useEffect(() => {
        if (open && position) {
            form.setFieldsValue({
                positionName: position.positionName,
                description: position.description,
                leverNumber: position.leverNumber
            });
        }
    }, [open, position, form]);

    const handleFinish = (values) => {
        onSubmit({
            positionName: values.positionName,
            description: values.description,
            leverId: values.leverId,
        });
    };

    return (
        <Modal
            open={open}
            title={position ? "Cập nhật chức vụ" : "Thêm chức vụ"}
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
                    label="Tên chức vụ"
                    name="positionName"
                    rules={[
                        { required: true, message: "Vui lòng nhập chức vụ" }
                    ]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    label="Mô tả chức vụ"
                    name="description"
                    rules={[
                        { required: true, message: "Vui lòng nhập mô tả chức vụ" }
                    ]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    label="Cấp bậc"
                    name="leverId"
                    rules={[
                        { required: true, message: "Vui lòng chọn cấp bậc" }
                    ]}
                >
                    <Select
                        placeholder="Chọn cấp bậc"
                        options={(leverData || []).map(item => ({
                            value: item.id,
                            label: `Level ${item.leverNumber} - ${item.description}`
                        }))}
                    />
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

export default AddEditPositionModal;
