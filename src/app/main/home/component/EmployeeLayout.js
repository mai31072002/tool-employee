import React, { useMemo } from 'react';
import { Table, Tag, Spin, Row, Col, Button, Input, AutoComplete, Tooltip, Pagination } from 'antd';
import { CalendarOutlined, PlusOutlined, SearchOutlined, EyeOutlined} from '@ant-design/icons';
import dayjs from 'dayjs';
import AddEditEmployee from './AddEditEmployee';

const EmployeeLayout = ({
    loading,
    page,
    limit,
    totalElement,
    handleOpenAdd,
    handlePageChange,
    onCloseModal,
    handleSubmitModal,
    onRowClick,
    editingRecord,
    dataList,
    positionList,
    isModalVisible,
    searchTerm,
    onSearch,
    onSearchTermChange
}) => {

    const columns = useMemo ( 
        () => [
            { title: 'MNV', dataIndex: 'employeesCode', key: 'employeesCode' },
            { title: 'Họ tên', dataIndex: 'fullName', key: 'fullName' },
            { title: 'username', dataIndex: 'username', key: 'username' },
            {
                title: "Giới tính",
                dataIndex: "gender",
                render: (gender) =>
                gender === 1 ? "Nam" : gender === 0 ? "Nữ" : "—",
            },
            {
                title: "Ngày sinh",
                dataIndex: "birthday",
                render: (value) =>
                    value ? (
                        <span style={{ display: "flex", alignItems: "center" }}>
                            <CalendarOutlined style={{ marginRight: 4, color: "#888" }} />
                            {dayjs(value).format("DD/MM/YYYY")}
                        </span>
                ) : (
                    "—"
                ),
            },
            { 
                title: 'Thời gian công tác',
                key: 'time',
                render: (_, record) => {
                    const start = record.startDate ? dayjs(record.startDate).format('DD/MM/YYYY') : '';
                    const end = record.endDate ? dayjs(record.endDate).format('DD/MM/YYYY') : '';
                    return start && end ? `${start} - ${end}` : start || end || '-';
                }
            },
            {
                title: "Chức vụ",
                dataIndex: "positionName",
                key: "positionName",
            },
            {
                title: "Phòng ban",
                dataIndex: "departmentName",
                key: "departmentName",
            },
            {
                title: "Trạng thái",
                dataIndex: "status",
                align: "center",
                render: (status) => {
                    switch (status) {
                        case 1:
                            return <Tag color="green">Đang làm việc</Tag>;
                        case 2:
                            return <Tag color="green">Nghỉ việc</Tag>;
                        case 3:
                            return <Tag>Thử việc</Tag>;
                        default:
                            return "—";
                    }
                },
            },
            {
                title: "Thao tác",
                key: "action",
                align: "center",
                render: (_, record) => (
                    <Tooltip title="Xem chi tiết">
                        <EyeOutlined
                            style={{ cursor: "pointer", color: "#1677ff" }}
                            onClick={() => onRowClick && onRowClick(record)}
                        />
                    </Tooltip>
                ),
            }
        ], []
    );

    const autoCompleteOptions =
        dataList?.length > 0
            ? dataList.map((item) => ({
                key: item.employeeId,
                value: `${item.firstName || ""}${item.lastName || ""}`.trim(),
                label: (
                    <div style={{ display: "flex", flexDirection: "column" }}>
                        <span style={{ color: "#000" }}>
                            <b>
                                {item.firstName} {item.lastName}
                            </b>
                        </span>
                    </div>
                ),
            }))
        : [];

    return (
        <Row className="dashboard-page page-base">
            <Col span={24}>
                <div className='dashboard-title'>
                    <h2>Danh sách nhân viên</h2>
                    <Button type="primary" shape="round" icon={<PlusOutlined/>} onClick={handleOpenAdd}>
                        Thêm mới
                    </Button>
                </div>
            </Col>
            <Col span={24} className="header-candidate">
                <Row>
                    <Col span={24} className="search-filter">
                        <AutoComplete
                            value={searchTerm}
                            onChange={onSearchTermChange}
                            onSearch={onSearch}
                            className="dropdown-search"
                            options={autoCompleteOptions}
                        >
                            <Input
                                placeholder="Tìm kiếm theo tên, mã công nhân, công ty..."
                                value={searchTerm}
                                onChange={(e) => onSearchTermChange(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                        onSearch(searchTerm);
                                    }
                                }}
                                suffix={
                                    <Button
                                        type="default"
                                        icon={<SearchOutlined />}
                                        onClick={() => onSearch(searchTerm)}
                                        style={{
                                            color: "#999",
                                            background: "#f5f5f7",
                                            border: "none",
                                        }}
                                    />
                                }
                                allowClear
                                className="candidate-search"
                            />
                        </AutoComplete>
                    </Col>
                </Row>
            </Col>
            <Col span={24}>
                {loading ? (
                    <div className="candidate-table-loading">
                        <Spin size="large" />
                    </div>
                ) : !dataList || dataList.length === 0 ? (
                    <div className="dashboard-table-not-found">
                        Không có dữ liệu nhân viên nào.
                    </div>
                ) : (
                    <div>
                        <Table
                            size="small"
                            columns={columns}
                            dataSource={dataList}
                            rowKey="employeeId"
                            pagination = {false}
                            // pagination = {{
                            //     current: page,
                            //     pageSize: limit,
                            //     total: totalElement,
                            //     showSizeChanger: true,
                            //     showTotal: () => `Tổng ${totalElement} nhân viên`,
                            //     onChange: handlePageChange,
                            //     onShowSizeChange: handlePageChange,
                            // }}
                            scroll={{
                                x: 1300,
                                y: "calc(100vh - 200px)",
                            }}
                            onRow={(record) => ({
                                onClick: () => onRowClick && onRowClick(record),
                            })}
                        />
                        <div
                            style={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                marginTop: 16,
                            }}
                        >
                            {/* BÊN TRÁI */}
                            <div>
                                Tổng nhân viên : {totalElement}
                            </div>

                            {/* BÊN PHẢI */}
                            <Pagination
                                size='small'
                                current={page}
                                pageSize={limit}
                                total={totalElement}
                                showSizeChanger
                                onChange={handlePageChange}
                                onShowSizeChange={handlePageChange}
                            />
                        </div>
                    </div>
                )}
            </Col>

            <AddEditEmployee
                open={isModalVisible}
                onCancel={onCloseModal}
                onSubmit={handleSubmitModal}
                editingRecord={editingRecord}
                position={positionList.position}
            />
        </Row>
    );
}
export default EmployeeLayout;
