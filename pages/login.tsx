import { useState } from "react";
import { useRouter } from "next/router";
import { Form, Input, Button } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { getCsrfToken, signIn } from "next-auth/react";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const router = useRouter();

  const onFinish = async (values) => {
    const res = await signIn("credentials", {
      redirect: false,
      username,
      password,
      callbackUrl: `${window.location.origin}`,
    });
    if (res?.error) {
      setError(res.error);
    } else {
      setError(null);
    }
    if (res.url) router.push(res.url);
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

export async function getServerSideProps(context) {
  return {
    props: {
      csrfToken: await getCsrfToken(context),
    },
  };
}
