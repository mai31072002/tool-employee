import React, { useState, useEffect } from "react";
import { Modal, Form, Input, Row, Col, Select, Radio, DatePicker } from "antd";
import vietnamData from "assets/json/full_json_generated_data_vn_units.json";
import { useDispatch, useSelector } from "react-redux";
import * as Action from "../store/actions";
import dayjs from "dayjs";

const AddEditEmployee = ({
    open,
    onCancel,
    onSubmit,
    editingRecord,
    position,
}) => {
    const dispatch = useDispatch();
    const { Option } = Select;
    const { TextArea } = Input;
    const [form] = Form.useForm();
    const [districts, setDistricts] = useState([]);

    const { departmentList } = useSelector(state => state.dashboard.dashboard);

    useEffect(() => {
        if (!departmentList.department || departmentList.department.length === 0) {
            dispatch(Action.fetchListDepartment());
        }
    }, [dispatch, departmentList]);

    useEffect(() => {
        if (editingRecord) {
            const province = vietnamData.find((p) => p.Name === editingRecord.province);
            setDistricts(province?.Wards || []);
            const birthday = editingRecord.birthday ? dayjs(editingRecord.birthday) : null;
            const startDate = editingRecord.startDate ? dayjs(editingRecord.startDate) : null;
            const endDate = editingRecord.endDate ? dayjs(editingRecord.endDate) : null;
            const age = birthday ? dayjs().diff(birthday, "year") : undefined;
            form.setFieldsValue({
                ...editingRecord,
                birthday, 
                age, 
                startDate, 
                endDate,
                positionId: editingRecord.position?.id,
            });
        } else {
            form.resetFields();
            form.setFieldsValue({
                status: 1,
            });
            setDistricts([]);  
        }
    }, [editingRecord, form]);

    const handleProvinceChange = (provinceName) => {
        const province = vietnamData.find((p) => p.Name === provinceName);
        setDistricts(province?.Wards || []);
    };

    const handleFinish = (values) => {
        const { age, ...cleanValues } = values;

        const reqData = {
            ...cleanValues,
            birthday: dayjs(values.birthday).format("YYYY-MM-DD"),
            gender: Number(values.gender),
            status: Number(values.status),
            isAvatarCleared: values.isAvatarCleared || false,
        };

        onSubmit(reqData, form);
    };

  const handleDistrictChange = () => {                                                                                                   
    // const district = districts.find((d) => d.Name === districtName);
    // setWards(district?.Wards || []);
  };

  return (
    <Modal
        title={editingRecord ? "Sửa thông tin nhân viên" : "Thêm nhân viên mới"}
        open={open}
        onOk={() => form.submit()}
        onCancel={onCancel}
        okText="Lưu"
        cancelText="Hủy"
        centered
        destroyOnHidden
        width={600}
        className={"candidate-model"}
    >
        <Form 
            form={form} 
            layout="vertical" 
            onFinish={handleFinish} 
            className="model-from"
        >
            <Form.Item name="employeeId" hidden>
                <Input />
            </Form.Item>

            <Row gutter={16}>
                <Col span={12}>
                    <Form.Item
                        label="Họ"
                        name="firstName"
                        rules={[
                            { required: true, message: "Vui lòng nhập họ" },
                            { min: 2, max: 50, message: "Độ dài họ từ 2–50 ký tự" },
                            { pattern: /^[\p{L}\s]+$/u, message: "Họ chỉ được chứa chữ cái" },
                            {
                                validator: (_, value) =>
                                value && value.trim().length === 0
                                    ? Promise.reject("Không được nhập toàn khoảng trắng")
                                    : Promise.resolve(),
                            },
                        ]}
                    >
                        <Input placeholder="Nhập họ" />
                    </Form.Item>
                </Col>
                <Col span={12}>
                    <Form.Item
                        label="Tên"
                        name="lastName"
                        rules={[
                            { required: true, message: "Vui lòng nhập tên" },
                            { min: 1, max: 50, message: "Độ dài tên từ 1–50 ký tự" },
                            { pattern: /^[\p{L}\s]+$/u, message: "Tên chỉ được chứa chữ cái" },
                            {
                                validator: (_, value) =>
                                value && value.trim().length === 0
                                    ? Promise.reject("Không được nhập toàn khoảng trắng")
                                    : Promise.resolve(),
                            },
                        ]}
                    >
                        <Input placeholder="Nhập tên" />
                    </Form.Item>
                </Col>
            </Row>

            <Form.Item 
                name="username"
                rules={[
                    { required: true, message: "Vui lòng nhập tên đăng nhập" },
                    { min: 4, max: 100, message: "Tên đăng nhập từ 4–100 ký tự" },
                    {
                        validator: (_, value) =>
                        value && value.toLowerCase().includes("admin")
                            ? Promise.reject("Không được chứa từ 'admin'")
                            : Promise.resolve(),
                    },
                ]}
            >
                <Input placeholder="Tên đăng nhập (tùy chọn)" />
            </Form.Item>

            <Form.Item 
                label="Email"
                rules={[
                    { required: true, message: "Vui lòng nhập tên" },
                    { type: "email", message: "Email không hợp lệ" },
                ]}
                name="email"
            >
                <Input placeholder="nhập email" />
            </Form.Item>

            <Form.Item 
                label="Điện thoại" 
                name="phone" 
                rules={[
                    { required: true, message: "Vui lòng nhập số điện thoại" },
                    { pattern: /^(0|\+84)(\d{8,10})$/, message: "Số điện thoại không hợp lệ" },
                ]}
            >
                <Input 
                    placeholder="Nhập số điện thoại"
                    onKeyPress={(e) => {
                        if (!/[0-9]/.test(e.key)) {
                            e.preventDefault();
                        }
                    }}
                />
            </Form.Item>

            <Form.Item 
                label="CCCD" 
                name="cccd" 
                rules={[
                    // { required: true, message: "Vui lòng nhập số CCCD" },
                    { pattern: /^[0-9]{9,15}$/, message: "CCCD phải là dãy số từ 9 đến 15 chữ số" },
                ]}
            >
                <Input 
                    placeholder="Nhập CCCD"
                    onKeyPress={(e) => {
                        if (!/[0-9]/.test(e.key)) {
                            e.preventDefault();
                        }
                    }}
                />
            </Form.Item>

            <Row gutter={16}>
                <Col span={12}>
                    <Form.Item
                        label="Ngày sinh"
                        name="birthday"
                        rules={[
                            { required: true, message: "Vui lòng nhập ngày sinh" },
                            {
                                validator: (_, value) => {
                                    if (!value) return Promise.resolve();
                                    const age = dayjs().diff(value, "year");
                                    if (age < 15) return Promise.reject("Tuổi tối thiểu là 15");
                                    if (age > 70) return Promise.reject("Tuổi tối đa là 70");
                                    return Promise.resolve();
                                },
                            },
                        ]}
                    >
                        <DatePicker 
                            format="DD/MM/YYYY" 
                            inputReadOnly={false} 
                            placeholder="MM/DD/YY"
                            allowClear
                            disabledDate={(current) => {
                                return current && current > dayjs().endOf("day");
                            }}
                            onChange={(date) => {
                                if (date) form.setFieldValue("age", dayjs().diff(date, "year"));
                                else form.setFieldValue("age", undefined);
                            }}
                        />
                    </Form.Item>
                </Col>
                <Col span={12}>
                    <Form.Item
                        label="Giới tính"
                        name="gender"
                        rules={[{ required: true, message: "Vui lòng chọn giới tính" }]}
                    >
                        <Radio.Group>
                            <Radio value={1}>Nam</Radio>
                            <Radio value={0}>Nữ</Radio>
                        </Radio.Group>
                    </Form.Item>
                </Col>
            </Row>

            <Form.Item label="Tuổi" name="age" rules={[{ required: true, message: "Vui lòng nhập tuổi" }]}>
                <Input placeholder="Nhập tuổi" disabled />
            </Form.Item>

            <Form.Item
                label="Ngày bắt đầu"
                name="startDate"
                rules={[{ required: true, message: "Chọn ngày bắt đầu" }]}
            >
                <DatePicker format="DD/MM/YYYY" className="w-100" />
            </Form.Item>
            <Form.Item
                label="Ngày kết thúc"
                name="endDate"
                dependencies={["startDate"]}
                rules={[
                    { required: false, message: "Chọn ngày kết thúc" },
                    ({ getFieldValue }) => ({
                        validator(_, value) {
                            const start = getFieldValue("startDate");
                            if (!value || !start) {
                                return Promise.resolve();
                            }

                            if (value.isBefore(start, "day")) {
                                return Promise.reject(
                                    new Error("Ngày kết thúc phải sau hoặc bằng ngày bắt đầu")
                                );
                            }
                            return Promise.resolve();
                        },
                    }),
                ]}
            >
                <DatePicker format="DD/MM/YYYY" className="w-100" />
            </Form.Item>

            <Form.Item label="Thành Phố / Tỉnh" name="province" rules={[{ required: true, message: "Vui lòng nhập thành phố / Tỉnh" }]}>
                <Select
                    showSearch
                    placeholder="Chọn Thành Phố / Tỉnh"
                    optionFilterProp="children"
                    onChange={handleProvinceChange}
                    filterOption={(input, option) =>
                        option.children.toLowerCase().includes(input.toLowerCase())
                    }
                    classNames={{
                        popup: {
                            root: "select-address-dropdown",
                        },
                        container: "select-address"
                    }}

                >
                    {vietnamData.map((province) => (
                        <Option key={province.Code} value={province.Name}>
                            {province.Name}
                        </Option>
                    ))}
                </Select>
            </Form.Item>

            <Form.Item label="Quận" name="district" rules={[{ required: true, message: "Vui lòng nhập Quận" }]}>
                <Select
                    showSearch
                    placeholder="Chọn Quận / Huyện"
                    disabled={!districts.length && !form.getFieldValue("district")}
                    optionFilterProp="children"
                    onChange={handleDistrictChange}
                    filterOption={(input, option) =>
                        option.children.toLowerCase().includes(input.toLowerCase())
                    }
                    classNames={{
                        popup: {
                        root: 'my-select-popup',
                        },
                    }}
                >
                    {districts.map((district) => (
                        <Option key={`${district.Code || ''}-${district.Name || ''}`} value={district.Name}>
                            {district.Name}
                        </Option>
                    ))}
                </Select>
            </Form.Item>

            <Form.Item 
                label="Địa chỉ" 
                name="address" 
                rules={[
                    { required: true, message: "Vui lòng nhập địa chỉ" },
                    { max: 255, message: "Địa chỉ tối đa 255 ký tự" },
                ]}
            >
                <Input placeholder="Nhập địa chỉ" />
            </Form.Item>

            <Form.Item label="Chức vụ" name="positionId" rules={[{ required: true }]}>
                <Select placeholder="Chọn chức vụ">
                    {position.map((item) => (
                    <Option key={item.id} value={item.id}>
                        {item.positionName}
                    </Option>
                    ))}
                </Select>
            </Form.Item>

            <Form.Item
                label="Phòng ban"
                name="departmentId"
                rules={[{ required: true, message: "Vui lòng chọn phòng ban" }]}
            >
                <Select
                    placeholder="Chọn phòng ban"
                    allowClear
                >
                    {departmentList?.department?.map((item) => (
                        <Select.Option key={item.id} value={item.id}>
                            {item.departmentName}
                        </Select.Option>
                    ))}
                </Select>
            </Form.Item>


            <Form.Item
                label="Mã nhân viên"
                name="employeesCode"
                rules={[{ required: true, message: "Vui lòng nhập mã nhân viên" }]}
            >
                <Input placeholder="Nhập mã nhân viên" />
            </Form.Item>

            <Row gutter={16}>
                <Col span={12}>
                    <Form.Item
                        label="Lương cơ bản"
                        name="baseSalary"
                        rules={[{ required: true, message: "Vui lòng nhập lương cơ bản" }]}
                    >
                        <Input type="number" min={0} />
                    </Form.Item>
                </Col>
                <Col span={12}>
                    <Form.Item
                        label="Phụ cấp"
                        name="allowance"
                        rules={[{ required: true, message: "Vui lòng nhập phụ cấp" }]}
                    >
                        <Input type="number" min={0} />
                    </Form.Item>
                </Col>
            </Row>

            <Form.Item 
                label="Người quản lý" 
                name="manages"
                rules={[{ required: true, message: "Vui lòng nhập người quản lý" }]}
            >
                <Input placeholder="Nhập tên người quản lý" />
            </Form.Item>

            <Form.Item label="Mô tả" name="description">
                <TextArea rows={3} placeholder="Nhập mô tả" />
            </Form.Item>

            <Form.Item label="Trạng thái" name="status" rules={[{ required: true, message: "Vui lòng chọn trạng thái" }]}>
                <Radio.Group>
                    <Radio value={1}>Đang làm việc</Radio>
                    {editingRecord && <Radio value={2}>Nghỉ việc</Radio>}
                    {editingRecord && <Radio value={3}>Thử việc</Radio>}
                </Radio.Group>
            </Form.Item>
        </Form>
    </Modal>
  );
};

export default AddEditEmployee;
