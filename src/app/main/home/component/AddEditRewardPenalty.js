import React, { useEffect } from "react";
import { Modal, Form, Input, DatePicker, Select, InputNumber } from "antd";
import dayjs from "dayjs";

const AddEditRewardPenalty = ({ open, onCancel, onSubmit, employee, dataAddAndEdit }) => {
    const [form] = Form.useForm();

    useEffect(() => {
        if (open && dataAddAndEdit) {
            form.setFieldsValue({
                month: dayjs(dataAddAndEdit.month),
                amount: dataAddAndEdit.amount,
                reason: dataAddAndEdit.reason,
                type: dataAddAndEdit.type,
            });
        }

        if (open && !dataAddAndEdit) {
            form.resetFields();
            form.setFieldsValue({
                month: dayjs(),
                type: 0,
            });
        }
    }, [open, dataAddAndEdit]);

    const handleOk = async () => {
        try {
            const values = await form.validateFields();

            const payload = {
                employeeId: employee.employeeId,
                month: values.month.format("YYYY-MM-DD"),
                amount: values.amount,
                reason: values.reason,
                type: values.type,
            };

            // dispatch(Actions.createRewardPenalty(payload));

            onSubmit(payload);
        } catch (err) {
            console.log("Validate failed", err);
        }
    };

    return (
        <Modal
            title={dataAddAndEdit ? "Cập nhật Thưởng / Phạt" : "Thêm Thưởng / Phạt"}
            open={open}
            onOk={handleOk}
            onCancel={onCancel}
            okText="Lưu"
            cancelText="Hủy"
            destroyOnHidden
        >
            <Form
                form={form}
                layout="vertical"
                initialValues={{
                    month: dayjs(),
                    type: 0,
                }}
            >
                <Form.Item
                    label="Ngày - Tháng"
                    name="month"
                    rules={[{ required: true, message: "Vui lòng chọn tháng" }]}
                >
                    <DatePicker
                        picker="date"
                        format="YYYY-MM-DD"
                        style={{ width: "100%" }}
                        disabled={!!dataAddAndEdit}
                    />
                </Form.Item>

                <Form.Item
                    label="Số tiền"
                    name="amount"
                    rules={[
                        { required: true, message: "Vui lòng nhập số tiền" },
                    ]}
                >
                    <InputNumber
                        style={{ width: "100%" }}
                        min={0}
                        formatter={(value) =>
                            `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                        }
                        parser={(value) => value.replace(/,/g, "")}
                    />
                </Form.Item>

                <Form.Item
                    label="Lý do"
                    name="reason"
                    rules={[
                        { required: true, message: "Vui lòng nhập lý do" },
                    ]}
                >
                    <Input.TextArea rows={3} />
                </Form.Item>

                <Form.Item
                    label="Loại"
                    name="type"
                    rules={[{ required: true }]}
                >
                    <Select
                        options={[
                            { value: 0, label: "Thưởng" },
                            { value: 1, label: "Phạt" },
                        ]}
                    />
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default AddEditRewardPenalty;
