import { Button, Layout as Theme } from "antd";
import { Content, Footer, Header } from "antd/lib/layout/layout";
import { LoginOutlined } from "@ant-design/icons";
import Router from "next/router";

export default function Custom404() {
  return (
    <Theme>
      <Header>
        <div style={{ display: "flex", justifyContent: "center" }}>
          <span style={{ fontSize: "2rem", color: "#fff" }}>
            Não foi possível acessar a página!
          </span>
        </div>
      </Header>
      <Content>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            height: "200px",
            paddingTop: "70px",
          }}
        >
          <span style={{ fontSize: "1.2rem", fontWeight: "bold" }}>
            Clique no botão abaixo para voltar ao login do sistema
          </span>
        </div>
        <div style={{ display: "flex", justifyContent: "center" }}>
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
}
