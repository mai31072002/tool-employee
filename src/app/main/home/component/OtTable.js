import React, { useEffect, useMemo, useState } from 'react';
import { Table, Button, DatePicker, Tag } from 'antd';
import { PlusOutlined } from '@ant-design/icons'
import { useDispatch, useSelector } from 'react-redux';
import dayjs from 'dayjs';
import AddEditOT from './AddEditOT';
import { notificationPopup } from 'app/helpers/common';
import * as Actions from "../store/actions";

const OtTable = ({ employee }) => {
    const dispatch = useDispatch();
    const [addEditOtModal, setAddEditOtModal] = useState(false);
    const [selectOtDay, setSelectOtDay] = useState([]);
    const [checkDataList, setCheckDataList] = useState(false);
    const [month, setMonth] = useState(dayjs());

    const { otDateEmployeeId, createOrUpdateOt} = useSelector(
        state => state.dashboard.otDate.otDateEmployeeId ?? []
    );

    const columns = useMemo(
        () => [
            { 
                width: 200,
                key: 'jobTitle',
                title: 'Tên công việc', 
                dataIndex: 'jobTitle' 
            },
            { 
                width: 150,
                align: "center",
                key: 'workDate',
                title: 'Ngày', 
                dataIndex: 'workDate' 
            },
            { 
                width: 100,
                align: "center",
                key: 'otMinutes',
                title: 'Số giờ OT', 
                dataIndex: 'otMinutes' 
            },
            { 
                width: 150,
                align: "center",
                key: 'startTime',
                title: 'Giờ bắt đầu', 
                dataIndex: 'startTime' 
            },
            { 
                width: 150,
                align: "center",
                key: 'endTime',
                title: 'Giờ kết thúc', 
                dataIndex: 'endTime' 
            },
            { 
                width: 150,
                align: "center",
                key: 'approvedBy',
                title: 'Người duyệt', 
                dataIndex: 'approvedBy' 
            },
            { 
                width: 150,
                align: "center",
                key: 'approvedAt',
                title: 'Thời gian duyệt', 
                dataIndex: 'approvedAt' 
            },
            { 
                width: 70,
                align: "center",
                key: 'otRate',
                title: 'Hệ số', 
                dataIndex: 'otRate' 
            },
            { 
                width: 100,
                align: "center",
                key: 'status',
                title: 'Tình trạng', 
                dataIndex: 'status',
                render: (status) => (
                    <Tag color={status === 1 ? "green" : status === 2 ? "red" : "default"}>
                        {status === 1 ? "Đã duyệt" : status === 2 ? "Không duyệt" : "Chưa duyệt"}
                    </Tag>
                ),
            },
            { 
                width: 100,
                align: "center",
                key: 'otType',
                title: 'Loại OT', 
                dataIndex: 'otType',
                render: (otType) => (
                    <Tag>
                        {otType === 1 ? "Đêm" : otType === 2 ? "Lễ" : otType === 0 ? "thường" : ''}
                    </Tag>
                ),
            },
        ], []
    );

    // ---------------------------------
    // USEEFFECT
    // ---------------------------------

    useEffect(() => {
        if (employee?.employeeId && month) {
            dispatch(Actions.fetchListOtDateEmployeeId(
                employee.employeeId, 
                month.format("YYYY-MM")
            ));
        }
    }, [dispatch, employee?.employeeId, month]);

    useEffect(() => {
        if (checkDataList) {
            dispatch(Actions.fetchListOtDateEmployeeId(
                employee?.employeeId, 
                month.format("YYYY-MM")
            )).finally(() =>
                setCheckDataList(false)
            );
        }
    }, [checkDataList, dispatch, employee, month]);

    useEffect(() => {
        if (createOrUpdateOt) {
        notificationPopup(
            createOrUpdateOt.status,
            createOrUpdateOt.message
        );
        }
    }, [createOrUpdateOt]);

    // ---------------------------------
    // HANDLE
    // ---------------------------------

    const handleOpenAdd = () => {
        setSelectOtDay(null);
        setAddEditOtModal(true);
    }

    const handleEdit = (record) => {
        setSelectOtDay(record);
        setAddEditOtModal(true);
    }

    const AddEditOtSubmit = async (value) => {
        if (selectOtDay?.id) {
            await dispatch(Actions.UpdateOtDate(selectOtDay.id, value));
        } else {
            await dispatch(Actions.CreateOtDay(value));
        }
        setAddEditOtModal(false);
        setCheckDataList(true);
    }

    const handleClose = () => {
        setAddEditOtModal(false);
    }

    return (
        <>
            <div className="otTop">
                <DatePicker 
                    defaultValue={dayjs()} 
                    format={'YYYY/MM'} 
                    picker="month" 
                    className="ot-data-picker" 
                    onChange={(value) => {
                        setMonth(value);
                    }}
                />

                <Button type="primary" shape="round" icon={<PlusOutlined/>} onClick={handleOpenAdd}>  
                    Thêm Ot
                </Button>
            </div>
            <Table
                rowKey={"id"}
                columns={columns}
                dataSource={otDateEmployeeId}
                pagination={false}
                tableLayout="fixed"
                scroll={{
                    x: 1300,
                    y: "calc(100vh - 200px)",
                }}
                onRow={(record) => ({
                    onClick: () => handleEdit(record),
                })}
            />

            <AddEditOT
                open={addEditOtModal}
                onCancel={handleClose}
                otDay={selectOtDay}
                employee={employee}
                AddEditOtSubmit={AddEditOtSubmit}
            />
        </>
    );
};

export default OtTable;
