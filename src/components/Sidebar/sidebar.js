import React from "react";
import {
  FileOutlined,
  TeamOutlined,
  UserOutlined,
  LogoutOutlined,
  SettingOutlined,
  BranchesOutlined,
  ApartmentOutlined,
  SolutionOutlined,
  RiseOutlined,
  FieldTimeOutlined
} from "@ant-design/icons";
import { Menu, Layout, Modal } from "antd";
import history from "@history"; // đúng path của bạn
import "./index.scss";
import jwtService from "app/service/jwt";

const { Sider } = Layout;

function getItem(label, key, icon, children) {
  return { key, icon, children, label };
}

const items = [
  getItem("Quản lý nhân viên", "/home", <TeamOutlined />),
  getItem("Quản lý phòng ban", "/department", <ApartmentOutlined />),
  getItem("Quản lý chức vụ", "/position", <SolutionOutlined />),
  getItem("Quản lý cấp bặc", "/lever", <RiseOutlined />),
  getItem("OT", "/ot-date", <FieldTimeOutlined />),
  getItem("Cài đặt", "sub1", <SettingOutlined />, [
    getItem("Tài khoản", "/account", <UserOutlined />),
    getItem("Phân quyền", "/user-role", <BranchesOutlined />),
    getItem("Đăng xuất", "logout", <LogoutOutlined />),
  ]),
  getItem("Files", "/files", <FileOutlined />),
];

const Sidebar = ({ collapsed, onCollapse }) => {
    const handleMenuClick = ({ key }) => {
        if (key === "logout") {
            Modal.confirm({
                title: "Đăng xuất",
                content: "Bạn có chắc chắn muốn đăng xuất?",
                okText: "Đăng xuất",
                cancelText: "Hủy",
                onOk: () => jwtService.logout(),
            });
            return;
        }

        history.push(key);
    };

    return (
        <Sider collapsible collapsed={collapsed} onCollapse={onCollapse}>
            <div className="demo-logo-vertical" />

            <Menu
                theme="dark"
                mode="inline"
                items={items}
                selectedKeys={[history.location.pathname]}
                onClick={handleMenuClick}
            />
        </Sider>
    );
};

export default Sidebar;
