import React, { useEffect, useMemo, useState } from 'react';
import { Table, DatePicker, Tag, Select } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import dayjs from 'dayjs';
import withReducer from 'app/store/with_reducer';
import reduce from "../home/store/reducers";
import * as Actions from "../home/store/actions";
import "./index.scss";

const OtTable = () => {
    const { RangePicker } = DatePicker;

    const dispatch = useDispatch();
    const [page, setPage] = useState(1);
    const [status, setStatus] = useState("");
    const [checkDataList, setCheckDataList] = useState(false);
    const [fromDate, setFromDate] = useState(dayjs().startOf('month'));
    const [toDate, setToDate] = useState(dayjs().endOf('month'));

    const { otDate } = useSelector(
        state => state.otDate.otDate ?? []
    );

    const columns = useMemo(
        () => [
            { 
                width: 200,
                key: 'fullName',
                title: 'Họ tên', 
                dataIndex: 'fullName' 
            },
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
        if (fromDate || toDate) {
            const from = fromDate ? fromDate.format("YYYY-MM-DD") : null;
            const to = toDate ? toDate.format("YYYY-MM-DD") : null;
            dispatch(Actions.fetchListOtDate(0, 10, from, to, status));
        }
    }, [dispatch, fromDate, toDate]);

    useEffect(() => {
        if (checkDataList) {
            const from = fromDate ? fromDate.format("YYYY-MM-DD") : null;
            const to = toDate ? toDate.format("YYYY-MM-DD") : null;

            dispatch(Actions.fetchListOtDate(from, to)).finally(() =>
                setCheckDataList(false)
            );
        }
    }, [checkDataList, dispatch, fromDate, toDate]);

    // ---------------------------------
    // HANDLE
    // ---------------------------------

    const refreshList = (pageNumber = 1, pageSize = otDate?.limit || 10) => {
        const from = fromDate ? fromDate.format("YYYY-MM-DD") : null;
        const to = toDate ? toDate.format("YYYY-MM-DD") : null;
        dispatch(Actions.fetchListEmployee(pageNumber - 1, pageSize, from, to));
    };

    const handlePageChange = (pageNumber, pageSize) => {
        setPage(pageNumber);
        refreshList(pageNumber, pageSize);
    };

    const handleChange = e => {
        const from = fromDate ? fromDate.format("YYYY-MM-DD") : null;
        const to = toDate ? toDate.format("YYYY-MM-DD") : null;
        dispatch(Actions.fetchListOtDate(page - 1, otDate?.limit || 10, from, to, e));
        setStatus(e);
    };

    return (
        <div className="ot-date-page page-base">
            <div className="otTop">
                <RangePicker
                    value={fromDate && toDate ? [fromDate, toDate] : []}
                    format="YYYY-MM-DD"
                    className="ot-data-picker"
                    onChange={(dates) => {
                        if (dates) {
                            setFromDate(dates[0]);
                            setToDate(dates[1]);
                        } else {
                            setFromDate(null);
                            setToDate(null);
                        }
                    }}
                />

                <Select
                    defaultValue={status}
                    style={{ width: 120 }}
                    onChange={handleChange}
                    options={[
                        { value: '', label: 'Tât cả' },
                        { value: '0', label: 'Chưa duyệt' },
                        { value: '1', label: 'Đã duyệt' },
                        { value: '2', label: 'Không được duyệt' },
                    ]}
                />
            </div>
            <Table
                rowKey={"id"}
                columns={columns}
                dataSource={otDate?.otDate}
                tableLayout="fixed"
                pagination = {{
                    current: page,
                    pageSize: otDate?.limit,
                    total: otDate?.totalElement,
                    showSizeChanger: true,
                    showTotal: () => `Tổng ${otDate?.totalElement} nhân viên`,
                    onChange: handlePageChange,
                    onShowSizeChange: handlePageChange,
                }}
                scroll={{
                    x: 1300,
                    y: "calc(100vh - 200px)",
                }}
            />
        </div>
    );
};

export default withReducer('otDate', reduce)(OtTable);
