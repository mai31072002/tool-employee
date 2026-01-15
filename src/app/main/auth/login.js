import React, {useState, useEffect } from "react";
import { Form, Input, Button, Card, Checkbox, Typography, notification } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import axios from "axios";
import * as Actions from 'app/auth/store/actions';
import withReducer from "../../store/with_reducer";
import reducer from "../../auth/store/reducers/auth.reducer";
import './index.scss';

const { Title } = Typography;

const Login = () => {

    const dispatch = useDispatch();
    const history = useHistory();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const { login } = useSelector(state => state.login);

    useEffect(() => {
        if (login?.data != null) {
            if (login?.status === 200) {
                openNotificationWithIcon("success");
                axios.defaults.headers.common.Authorization = `Bearer ${login?.data?.accessToken}`
                history.push("/home");
            } else {
                openNotificationWithIcon("error");
            }
        }
    }, [dispatch, login, history]);

    const onFinish = (values) => {
        delete axios.defaults.headers.common.Authorization;
        dispatch(Actions.submitLogin(values));
    };

    const openNotificationWithIcon = (type) => {
        switch (type) {
            case "success":
                return notification[type]({
                    message: "Đăng nhập thành công !!!",
                });
            case "error":
                return notification[type]({
                    message: "Đăng nhập không thành công !!!",
                    description:
                        "Vui lòng kiểm tra lại thông tin của tài khoản mà bạn vừa nhập .",
                });
            default:
                return type;
        }
    };

    return (
        <div className="login-page">
            <Card className="login-card">
                <Title level={3} className="login-title">
                    Hệ thống nhân viên
                </Title>

                <Form
                    name="login_form"
                    initialValues={{ remember: true }}
                    onFinish={onFinish}
                    layout="vertical"
                >
                    <Form.Item
                        name="username"
                        label="Username"
                        rules={[
                            { required: true, message: "Please input your username!" },
                            { max: 128, message: "Không vượt quá 100 ký tự" }
                        ]}
                    >
                        <Input 
                            prefix={<UserOutlined />} 
                            placeholder="Username" 
                            value={username}
                            onChange={e => setUsername(e)}
                        />
                    </Form.Item>

                    <Form.Item
                        name="password"
                        label="Password"
                        rules={[
                            { required: true, message: "Please input your password!" },
                            { max: 128, message: "password không được vượt quá 100 ký tự"}
                        ]}
                    >
                        <Input.Password 
                            prefix={<LockOutlined />} 
                            placeholder="Password"
                            value={password}
                            onChange={e => setPassword(e)} 
                        />
                    </Form.Item>

                    <Form.Item>
                        <Form.Item name="remember" valuePropName="checked" noStyle>
                            <Checkbox>Remember me</Checkbox>
                        </Form.Item>

                        <a style={{ float: "right" }} href="/">
                            Forgot password?
                        </a>
                    </Form.Item>

                    <Form.Item>
                        <Button
                            type="primary"
                            htmlType="submit"
                            block
                            className="login-submit"
                        >
                            Log in
                        </Button>
                    </Form.Item>
                </Form>
            </Card>
        </div>
    );
};

export default withReducer("login", reducer)(Login);
