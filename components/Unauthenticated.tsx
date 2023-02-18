import { Button, Image, Layout as Theme, Space } from "antd";
import { Content, Footer, Header } from "antd/lib/layout/layout";
import { LoginOutlined } from "@ant-design/icons";
import Router from "next/router";

const Unauthenticated = () => {
  return (
    <Theme>
      <Header>
        <title>CEEB</title>
        <div style={{ display: "flex", justifyContent: "center" }}>
          <span style={{ fontSize: "2rem", color: "#fff" }}>
            Seja Bem Vindo!
          </span>
        </div>
      </Header>
      <Content>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignContent: "center",
            alignItems: "center",
            paddingTop: "70px",
          }}
        >
          <Space>
            <Image
              src={"/images/euripedes.png"}
              width="100px"
              height="100px"
              alt="logo"
            />
          </Space>
          <span style={{ fontSize: "1.2rem", fontWeight: "bold", padding: "20px" }}>
            Clique no botão abaixo para entrar no sistema
          </span>
          <Button
            type="primary"
            icon={<LoginOutlined />}
            onClick={() => Router.push("/login")}
            style={{ width: "200px" }}
          >
            Entrar
          </Button>
        </div>
      </Content>
      <Footer>
        <div style={{ display: "flex", justifyContent: "center" }}>
          Casa Espírita Eurípedes Barsanulpho - {new Date().getFullYear()}
        </div>
      </Footer>
    </Theme>
  );
};

export default Unauthenticated;
