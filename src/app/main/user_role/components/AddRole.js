import React, { useEffect } from "react";
import { Modal, Form, Input, Select, Button } from "antd";
import { useDispatch, useSelector } from "react-redux";
import * as Actions from "../store/actions";

const { Option } = Select;

const AddRoleForm = ({
    open,
    onCancel,
    onSubmit
}) => {
    const dispatch = useDispatch();
    const [form] = Form.useForm();

    const permission = useSelector(
        state => state.userRole.userRole.permissionList?.data || []
    );

    useEffect(() => {
        if (!permission || permission?.length === 0) {
            dispatch(Actions.fetchListPermission());
        }
    }, [dispatch, permission]);

    useEffect(() => {
        if (open) {
            form.resetFields();
        }
    }, [open, form]);

    const handleFinish = (values) => {
        onSubmit({
            roleName: values.roleName,
            description: values.description,
            permission: values.permission
        });
    };

    return (
        <Modal
            open={open}
            title="Thêm role mới"
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
                    label="Tên role"
                    name="roleName"
                    rules={[
                        { required: true, message: "Vui lòng nhập tên role" }
                    ]}
                >
                    <Input placeholder="VD: EMPLOYEE" />
                </Form.Item>

                <Form.Item
                    label="Mô tả"
                    name="description"
                    rules={[
                        { required: true, message: "Vui lòng nhập mô tả" }
                    ]}
                >
                    <Input placeholder="VD: Nhân viên" />
                </Form.Item>

                <Form.Item
                    label="Permission"
                    name="permission"
                    rules={[
                        { required: true, message: "Vui lòng chọn permission" }
                    ]}
                >
                    <Select
                        mode="multiple"
                        placeholder="Chọn permission"
                    >
                        {permission.map(p => (
                            <Option key={p.id} value={p.id}>
                                {p.permissionName}
                            </Option>
                        ))}
                    </Select>
                </Form.Item>

                <Form.Item style={{ textAlign: "right" }}>
                    <Button onClick={onCancel} style={{ marginRight: 8 }}>
                        Hủy
                    </Button>
                    <Button type="primary" htmlType="submit">
                        Tạo role
                    </Button>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default AddRoleForm;
