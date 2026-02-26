import React, { useEffect } from "react";
import { Modal, Form, Input, Row, Col, Select, Radio, DatePicker, TimePicker, InputNumber } from "antd";
import dayjs from "dayjs";

const AddEditOT = ({
    open,
    onCancel,
    AddEditOtSubmit,
    otDay,
    employee
}) => {
    const [form] = Form.useForm();
    const { Option } = Select;

    useEffect(() => {
        if (otDay) {
            form.setFieldsValue({
                ...otDay,
                employeeId: otDay.employeeId ?? employee.employeeId,
                workDate: otDay.workDate ? dayjs(otDay.workDate) : null,
                startTime: otDay.startTime ? dayjs(otDay.startTime, "HH:mm") : null,
                endTime: otDay.endTime ? dayjs(otDay.endTime, "HH:mm") : null,
                approvedAt: otDay.approvedAt ? dayjs(otDay.approvedAt) : null,
                fullName: employee.fullName || "",
            });
        } else {
            form.resetFields();
            form.setFieldsValue({
                fullName: employee.fullName || "",
                employeeId: employee.employeeId,
            });
        }
    }, [otDay, form]);

    const handleFinish = (values) => {
        const reqData = {
            ...values,
            workDate: values.workDate.format("YYYY-MM-DD"),
            startTime: values.startTime.format("HH:mm"),
            endTime: values.endTime.format("HH:mm"),
            approvedAt: values.approvedAt
                ? values.approvedAt.format("YYYY-MM-DDTHH:mm:ss")
                : null,
            otType: Number(values.otType),
            status: Number(values.status),
        };

        AddEditOtSubmit(reqData, form);
    };

    const calcOtMinutes = () => {
        const start = form.getFieldValue("startTime");
        const end = form.getFieldValue("endTime");

        if (start && end && end.isAfter(start)) {
            const minutes = end.diff(start, "minute");
            form.setFieldValue("otMinutes", minutes);
        } else {
            form.setFieldValue("otMinutes", null);
        }
    };

    return (
        <Modal
            title={otDay ? "Sửa OT" : "Thêm OT"}
            open={open}
            onOk={() => form.submit()}
            onCancel={onCancel}
            okText="Lưu"
            cancelText="Hủy"
            centered
            destroyOnHidden
            width={600}
        >
            <Form
                form={form}
                layout="vertical"
                onFinish={handleFinish}
                className="model-from"
                initialValues={{
                    status: 0,
                    otRate: 1.5,
                }}
            >
                <Form.Item name="employeeId" hidden>
                    <Input />
                </Form.Item>
                {/* Employee */}
                <Form.Item name="fullName" label="Nhân viên">
                    <Input disabled />
                </Form.Item>

                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item
                            label="Ngày làm OT"
                            name="workDate"
                            rules={[{ required: true, message: "Chọn ngày OT" }]}
                        >
                            <DatePicker
                                format="DD/MM/YYYY"
                                className="w-100"
                                disabledDate={(current) =>
                                    current && current > dayjs().endOf("day")
                                }
                            />
                        </Form.Item>
                    </Col>

                    <Col span={12}>
                        <Form.Item
                            label="Loại OT"
                            name="otType"
                            rules={[{ required: true, message: "Chọn loại OT" }]}
                        >
                            <Select>
                                <Option value="0">OT ngày thường</Option>
                                <Option value="1">OT cuối tuần</Option>
                                <Option value="2">OT lễ</Option>
                            </Select>
                        </Form.Item>
                    </Col>
                </Row>

                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item
                            label="Giờ bắt đầu"
                            name="startTime"
                            rules={[{ required: true, message: "Chọn giờ bắt đầu" }]}
                        >
                            <TimePicker 
                                format="HH:mm" 
                                className="w-100" 
                                onChange={calcOtMinutes}
                            />
                        </Form.Item>
                    </Col>

                    <Col span={12}>
                        <Form.Item
                            label="Giờ kết thúc"
                            name="endTime"
                            dependencies={["startTime"]}
                            rules={[
                                { required: true, message: "Chọn giờ kết thúc" },
                                ({ getFieldValue }) => ({
                                    validator(_, value) {
                                        const start = getFieldValue("startTime");
                                        if (!value || !start) return Promise.resolve();
                                        if (value.isBefore(start)) {
                                            return Promise.reject("Giờ kết thúc phải sau giờ bắt đầu");
                                        }
                                        return Promise.resolve();
                                    },
                                }),
                            ]}
                        >
                            <TimePicker 
                                format="HH:mm" 
                                className="w-100" 
                                onChange={calcOtMinutes}
                            />
                        </Form.Item>
                    </Col>
                </Row>

                <Form.Item
                    label="Số phút OT"
                    name="otMinutes"
                    rules={[{ required: true, message: "Nhập số phút OT" }]}
                >
                    <InputNumber min={1} className="w-100" disabled />
                </Form.Item>

                <Form.Item
                    label="Công việc"
                    name="jobTitle"
                    rules={[{ required: true, message: "Nhập công việc OT" }]}
                >
                    <Input placeholder="VD: Trực ca đêm" />
                </Form.Item>

                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item
                            label="Người duyệt"
                            name="approvedBy"
                        >
                            <Input />
                        </Form.Item>
                    </Col>

                    <Col span={12}>
                        <Form.Item
                            label="Thời gian duyệt"
                            name="approvedAt"
                        >
                            <DatePicker
                                showTime
                                format="DD/MM/YYYY HH:mm"
                                className="w-100"
                            />
                        </Form.Item>
                    </Col>
                </Row>

                <Form.Item
                    label="Hệ số OT"
                    name="otRate"
                    rules={[{ required: true }]}
                >
                    <InputNumber min={1} step={0.1} className="w-100" />
                </Form.Item>

                <Form.Item
                    label="Trạng thái"
                    name="status"
                    rules={[{ required: true }]}
                >
                    <Radio.Group>
                        <Radio value={0}>Chờ duyệt</Radio>
                        <Radio value={1}>Đã duyệt</Radio>
                        <Radio value={2}>Từ chối</Radio>
                    </Radio.Group>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default AddEditOT;
