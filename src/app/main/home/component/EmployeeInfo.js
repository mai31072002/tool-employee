import { Avatar, Row, Col, Tag } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';

const Item = ({ label, value, span = 12 }) => (
    <Col span={span}>
        <div style={{ fontSize: 12, color: '#8c8c8c' }}>{label}</div>
        <div style={{ fontWeight: 500 }}>{value || '—'}</div>
    </Col>
);

const EmployeeInfo = ({ employee }) => {
    if (!employee) return null;

    return (
        <Row gutter={[24, 16]}>
            {/* Avatar */}
            <Col span={24} md={6} style={{ textAlign: 'center' }}>
                <Avatar
                    size={120}
                    icon={<UserOutlined />}
                    style={{
                        backgroundColor: '#1677ff',
                        marginBottom: 12,
                    }}
                />
                <div style={{ marginTop: 8, fontWeight: 600 }}>
                    {employee.fullName}
                </div>

                <div style={{ marginTop: 6 }}>
                    <Tag color="blue" style={{ marginTop: 8 }}>
                        {employee?.position || 'Chưa có chức vụ'} - {employee.department || 'Chưa có phòng ban'}
                    </Tag>
                </div>
            </Col>

            {/* Info */}
            <Col span={24} md={18}>
                <Row gutter={[16, 16]}>
                    <Item label="Mã NV" value={employee.employeesCode} />
                    <Item label="Username" value={employee.username} />
                    <Item label="Ngày sinh" value={dayjs(employee.birthday).format('DD/MM/YYYY')} />
                    <Item label="Giới tính" value={employee.gender === 1 ? 'Nam' : 'Nữ'} />
                    <Item label="SĐT" value={employee.phone} />
                    <Item label="Email" value={employee.email} span={24} />
                    <Item label="Quản lý" value={employee.manages} />

                    <Item
                        label="Thời gian công tác"
                        span={24}
                        value={
                        employee.startDate
                            ? `${dayjs(employee.startDate).format('DD/MM/YYYY')} → ${
                                employee.endDate
                                ? dayjs(employee.endDate).format('DD/MM/YYYY')
                                : 'Hiện tại'
                            }`
                            : '—'
                        }
                    />

                    <Item
                        label="Địa chỉ"
                        span={24}
                        value={`${employee.address}, ${employee.district}, ${employee.province}`}
                    />

                    <Item
                        label="Trạng thái"
                        value={
                            <Tag color={employee.status === 1 ? 'green' : 'red'}>
                                {employee.status === 1 ? 'Đang làm việc' : 'Ngừng làm việc'}
                            </Tag>
                        }
                    />
                </Row>
            </Col>
        </Row>
    );
};

export default EmployeeInfo;

