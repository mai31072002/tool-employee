import React, { useEffect, useMemo, useState } from 'react';
import { Table, DatePicker, Tag, Select, Button, Space, Tooltip, Modal } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import dayjs from 'dayjs';
import { notificationPopup } from 'app/helpers/common';
import AddEditRewardPenalty from './AddEditRewardPenalty'; 
import { PlusOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons';
import * as Actions from "../store/actions";
import "../index.scss";

const RewardPenalty = ({ employee }) => {
    const { RangePicker } = DatePicker;
    const dispatch = useDispatch();
    const [fromDate, setFromDate] = useState(dayjs().startOf('month'));
    const [toDate, setToDate] = useState(dayjs().endOf('month'));
    const [rewardPenaltyModal, setRewardPenaltyModal] = useState(false);
    const [checkDataList, setCheckDataList] = useState(false);
    const [dataAddAndEdit, setDataAddAndEdit] = useState([]);
    const [type, setType] = useState("");

    const { rewardPenaltyEmployeeId, createUpdateDeleteRewardPenalty } = useSelector(
        state => state.dashboard.rewardPenalty
    );

    // console.log("createUpdateDeleteRewardPenalty: ", createUpdateDeleteRewardPenalty);

    // ---------------------------------
    // COLUMNS
    // ---------------------------------

    const columns = useMemo(() => [
        {
            width: 150,
            key: 'employeeName',
            title: 'Họ tên',
            dataIndex: 'employeeName',
        },
        {
            width: 150,
            align: "center",
            key: 'month',
            title: 'Tháng',
            dataIndex: 'month',
        },
        {
            width: 150,
            align: "center",
            key: 'amount',
            title: 'Số tiền',
            dataIndex: 'amount',
            render: (amount) =>
                amount?.toLocaleString('vi-VN') + ' ₫',
        },
        {
            width: 250,
            key: 'reason',
            title: 'Lý do',
            dataIndex: 'reason',
        },
        {
            width: 120,
            align: "center",
            key: 'type',
            title: 'Loại',
            dataIndex: 'type',
            render: (type) => (
                <Tag color={type === 0 ? "green" : "red"}>
                    {type === 0 ? "Thưởng" : "Phạt"}
                </Tag>
            ),
        },
        {
        title: "Thao tác",
        key: "actions",
        align: "center",
        fixed: "right",
        width: 120,
        render: (record) => {
            return (
                <Space>
                    <Tooltip title="Cập nhật">
                        <Button
                            type="text"
                            icon={<EditOutlined style={{ color: "#1677ff" }} />}
                            onClick={() => handleOpenExit(record)}
                        />
                    </Tooltip>
                    <Tooltip title="Xóa">
                        <Button
                            type="text"
                            icon={<DeleteOutlined style={{ color: "red" }} />}
                            onClick={() => handleDelete(record)}
                        />
                    </Tooltip>
                </Space>
            );
        },
    }
    ], []);

    // ---------------------------------
    // EFFECT
    // ---------------------------------

    useEffect(() => {
        if (!employee?.employeeId) return;

        dispatch(
            Actions.fetchRewardPenaltyByEmployee(
                employee.employeeId,
                fromDate?.format("YYYY-MM-DD"),
                toDate?.format("YYYY-MM-DD"),
                type
            )
        );
    }, [dispatch, employee?.employeeId, fromDate, toDate, type]);

    useEffect(() => {
        if (checkDataList) {
            dispatch(
                Actions.fetchRewardPenaltyByEmployee(
                    employee.employeeId,
                    fromDate.format("YYYY-MM-DD"),
                    toDate.format("YYYY-MM-DD"),
                    type
                )
            );
        }
    }, [dispatch, employee?.employeeId, checkDataList, fromDate, toDate, type]);

    // useEffect(() => {
    //     if(rewardPenaltyEmployeeId?.status != null) {
    //         notificationPopup(
    //             rewardPenaltyEmployeeId.status,
    //             rewardPenaltyEmployeeId.message
    //         );
    //     }
    // }, [rewardPenaltyEmployeeId]);

    useEffect(() => {
        if (createUpdateDeleteRewardPenalty?.status != null) {
            notificationPopup(
                createUpdateDeleteRewardPenalty.status,
                createUpdateDeleteRewardPenalty.message
            )
        }
    }, [createUpdateDeleteRewardPenalty]);

    // ---------------------------------
    // RENDER
    // ---------------------------------

    const handleChangeDate = (dates) => {
        if (dates) {
            setFromDate(dates[0]);
            setToDate(dates[1]);
        } else {
            setFromDate(null);
            setToDate(null);
        }
    }

    const handleChange = newType => {
        // dispatch(Actions.fetchRewardPenaltyByEmployee(
        //     employee.employeeId,
        //     fromDate.format("YYYY-MM-DD"),
        //     toDate.format("YYYY-MM-DD"),
        //     newType
        // ));
        setType(newType);
    };

    const handleOpenAdd = () => {
        setRewardPenaltyModal(true);
        setDataAddAndEdit(null);
    }

    const handleOpenExit = (values) => {
        setRewardPenaltyModal(true);
        setDataAddAndEdit(values);
    }

    const handleSubmit = (value) => {
        if (dataAddAndEdit) {
            dispatch(Actions.UpdateRewardPenalty(dataAddAndEdit.id, value));

        } else {
            dispatch(Actions.createRewardPenalty(value));
        }
        setRewardPenaltyModal(false);
        setCheckDataList(true);
    }

    const handleOnCancel = () => {
        setRewardPenaltyModal(false);
    }

    const handleDelete = (values) => {
        Modal.confirm({
            title: "Xác nhận xóa",
            content: (
                <>
                    Bạn có chắc chắn muốn xóa{" "}
                    <b>{values.reason} - {values.month}</b>{" "}
                    này không?
                </>
            ),
            okText: "Xóa",
            cancelText: "Hủy",
            okType: "danger",
            onOk() {
                dispatch(Actions.DeleteRewardPenalty(values.id));
                setCheckDataList(true);
            },
        });
    };

    return (
        <>
            <div className="reward-penalty">
                <RangePicker
                    value={fromDate && toDate ? [fromDate, toDate] : []}
                    format="YYYY-MM-DD"
                    className="reward-penalty-picker"
                    onChange={(dates) => {handleChangeDate(dates)}}
                />

                <Select
                    defaultValue={type}
                    style={{ width: 120 }}
                    className="reward-penalty-select"
                    onChange={handleChange}
                    options={[
                        { value: '', label: 'Tât cả' },
                        { value: '0', label: 'Thưởng' },
                        { value: '1', label: 'Phạt' }
                    ]}
                />

                <Button type="primary" icon={<PlusOutlined/>} onClick={handleOpenAdd}>  
                    Thêm Thưởng/Phạt
                </Button>
            </div>

            <Table
                rowKey="id"
                columns={columns}
                dataSource={rewardPenaltyEmployeeId?.data || []}
                pagination={false}
                tableLayout="fixed"
                scroll={{
                    x: 1300,
                    y: "calc(100vh - 200px)",
                }}
            />
            
            <AddEditRewardPenalty 
                open={rewardPenaltyModal}
                onCancel={handleOnCancel}
                onSubmit={handleSubmit}
                employee={employee}
                dataAddAndEdit={dataAddAndEdit}
            />
        </>
    );
};

export default RewardPenalty;
