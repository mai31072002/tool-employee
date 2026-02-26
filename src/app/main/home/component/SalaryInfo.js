import React, { useEffect } from 'react';
import { Descriptions } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import * as Actions from "../store/actions";

const SalaryInfo = ({ employeeId }) => {
    const dispatch = useDispatch();
    const month = "2025-12";

    const salaryDatail = useSelector(
            state => state.dashboard.dashboard.salaryDatail?.salaryDatail ?? []
        );

    useEffect(() => {
        dispatch(Actions.fetchListSalary(employeeId, month));
    },[dispatch, employeeId, month]);

    return (
        <Descriptions column={1}>
            <Descriptions.Item label="Ngày tháng">
                {salaryDatail.month || ''}
            </Descriptions.Item>

            <Descriptions.Item label="Lương cơ bản">
                {salaryDatail.baseSalary || ''}
            </Descriptions.Item>

            <Descriptions.Item label="Tổng ngày làm trong tháng">
                {salaryDatail.totalWorkDays || ''}
            </Descriptions.Item>

            <Descriptions.Item label="Tổng tiền lương OT">
                {salaryDatail.otAmount || ''}
            </Descriptions.Item>

            <Descriptions.Item label="Phụ cấp">
                {salaryDatail.allowance || ''}
            </Descriptions.Item>

            <Descriptions.Item label="Khấu trừ">
                {salaryDatail.deductions || ''}
            </Descriptions.Item>

            <Descriptions.Item label="Lương thực nhận">
                {salaryDatail.netSalary || ''}
            </Descriptions.Item>
        </Descriptions>
    );
};

export default SalaryInfo;
