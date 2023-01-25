import { useState } from "react";
import { useRouter } from "next/router";
import { Form, Input, Button } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { toast, ToastContainer } from "react-toastify";
import { useCookies } from "react-cookie";
import "react-toastify/dist/ReactToastify.css";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [cookie, setCookie] = useCookies(["token"])
  const router = useRouter();

  const onFinish = async (values) => {
    const payload = {
      username,
      password
    };

    const response = await fetch("/api/user", {
      method: "POST",
      body: JSON.stringify(payload),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();
    if (data.user && data.token) {
      setCookie("token", data.token, {
        path: "/",
        maxAge: 60*60*24*300, 
        sameSite: true,
      })
      router.push('/');
    } else {
      toast.error('Credenciais inválidas!');
    }

  };
  return (
    <div
      style={{
        paddingTop: "150px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column"
     }}
    >
      <ToastContainer />
      <span style={{fontFamily:"roboto", fontSize:"1.3rem", paddingBottom: "50px"}}>Casa Espirita Eurípedes Barsanulpho</span>
      <Form
        name="normal_login"
        className="login-form"
        initialValues={{
          remember: true,
        }}
        onFinish={onFinish}
      >
        <Form.Item
          name="username"
          rules={[
            {
              required: true,
              message: "Digite seu nome de usuário!",
            },
          ]}
        >
          <Input
            prefix={<UserOutlined className="site-form-item-icon" />}
            placeholder="Login"
            value={username}
            onChange={(input) => setUsername(input.target.value)}
          />
        </Form.Item>
        <Form.Item
          name="password"
          rules={[
            {
              required: true,
              message: "Digite sua senha!",
            },
          ]}
        >
          <Input
            prefix={<LockOutlined className="site-form-item-icon" />}
            type="password"
            placeholder="Senha"
            value={password}
            onChange={(input) => setPassword(input.target.value)}
          />
        </Form.Item>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            className="login-form-button"
          >
            Entrar
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default Login;