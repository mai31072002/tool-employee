import React, { useState } from 'react';
import { Modal, Tabs, Button, Space, Popconfirm } from 'antd';
import {
  EditOutlined,
  DeleteOutlined,
} from '@ant-design/icons';

import EmployeeInfo from './EmployeeInfo';
import AttendanceCalendar from './AttendanceCalendar';
import OtTable from './OtTable';
import SalaryInfo from './SalaryInfo';
import RewardPenalty from './RewardPenalty';

const EmployeeConfigModal = ({ open, onClose, employee, onEdit, onDelete }) => {
    const [activeKey, setActiveKey] = useState('info');

    return (
        <Modal
            open={open}
            onCancel={onClose}
            footer={null}
            width="90%"
            centered
            destroyOnHidden
            title={`Chi tiết nhân viên - ${employee?.fullName || ''}`}
        >
            <Tabs
                className="model-from"
                activeKey={activeKey}
                onChange={setActiveKey}
                tabBarExtraContent={
                    <Space>
                        <Button
                            icon={<EditOutlined />}
                            onClick={onEdit}
                            className="btn-edit-employee"
                            disabled={activeKey != 'info'}
                        >
                            Chỉnh sửa
                        </Button>

                        <Popconfirm
                            title="Xóa nhân viên?"
                            description={
                                <>
                                    Bạn có chắc chắn muốn xoá <b>{employee?.fullName || ''}</b> và toàn bộ dữ liệu liên quan?
                                </>
                            }
                            onConfirm={onDelete}
                            okText="Xóa"
                            okType="danger"
                            cancelText="Hủy"
                        >
                            <Button 
                                size="small"
                                danger 
                                icon={<DeleteOutlined />}
                                className="btn-delete-employee"
                                disabled={activeKey != 'info'}
                            >
                                Xóa
                            </Button>
                        </Popconfirm>
                    </Space>
                }
                items={[
                    {
                        key: 'info',
                        label: 'Thông tin cơ bản',
                        children: <EmployeeInfo employee={employee} />,
                    },
                    {
                        key: 'attendance',
                        label: 'Chấm công',
                        children: (
                        <AttendanceCalendar employeeId={employee?.employeeId} />
                        ),
                    },
                    {
                        key: 'rewardPenalty',
                        label: 'Thưởng / Phạt',
                        children: (
                        <RewardPenalty employee={employee} />
                        ),
                    },
                    {
                        key: 'ot',
                        label: 'OT',
                        children: <OtTable employee={employee} />,
                    },
                    {
                        key: 'salary',
                        label: 'Tính lương',
                        children: <SalaryInfo employeeId={employee?.employeeId} />,
                    },
                ]}
            />
            
        </Modal>
    );
};

export default EmployeeConfigModal;
