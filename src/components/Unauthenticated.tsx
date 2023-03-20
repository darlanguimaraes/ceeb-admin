import { Button, Image, Layout as Theme } from "antd";
import { Content, Footer, Header } from "antd/lib/layout/layout";
import { LoginOutlined } from "@ant-design/icons";
import Router from "next/router";

const Unauthenticated = () => {
  return (
    <Theme style={{ display: "flex", height: "100vh" }}>
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
            justifyContent: "space-evenly",
            alignItems: "center",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <span
              style={{
                fontFamily: "roboto",
                fontSize: "1.3rem",
                paddingBottom: "10px",
              }}
            >
              Casa Espírita Eurípedes Barsanulpho
            </span>
            <Image
              src={"/images/euripedes.png"}
              width="100px"
              height="100px"
              alt="logo"
            />
            <span style={{
          fontFamily: "roboto",
          fontSize: "1rem",
          paddingBottom: "10px",
        }}>Amor e Caridade</span>
          </div>
          <span
            style={{ fontSize: "1.2rem", fontWeight: "bold", padding: "20px" }}
          >
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
