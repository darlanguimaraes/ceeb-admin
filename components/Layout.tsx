import React, { ReactNode } from "react";
import { Divider, Layout as Theme, Menu } from "antd";
import { Content, Footer, Header } from "antd/lib/layout/layout";
import {
  HomeOutlined,
  DollarCircleOutlined,
  UnorderedListOutlined,
  FileExcelOutlined,
  FileZipOutlined,
  BookFilled,
  ReadFilled,
  UserOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import Link from "next/link";

import Router from "next/router";
import { useCookies } from "react-cookie";

type Props = {
  children: ReactNode;
  title?: string;
};

const Layout = ({ children, title = "This is the default title" }: Props) => {
  const [cookies, setCookie, removeCookie] = useCookies(["token"]);
  const signOut = () => {
    removeCookie("token");
    Router.push("/login");
  };

  return (
    <Theme>
      <Header>
        <div className="logo" />
        <title>CEEB</title>
        <Menu theme="dark" mode="horizontal" defaultSelectedKeys={["2"]}>
          <Link href="/">
            <a>
              <Menu.Item key="index" title="Home">
                <HomeOutlined /> Home
              </Menu.Item>
            </a>
          </Link>
          <Menu.Item key="emprestimo" title="Empréstimo - Livros">
            <Link href="/lending">
              <a>
                <ReadFilled /> Empréstimo de Livros
              </a>
            </Link>
          </Menu.Item>
          <Menu.Item key="cadastro" title="Cadastro - Livros">
            <Link href="/book">
              <a>
                <BookFilled /> Cadastro de Livros
              </a>
            </Link>
          </Menu.Item>
          <Menu.Item key="leitor" title="Leitor">
            <Link href="/reader">
              <a>
                <UserOutlined /> Leitor
              </a>
            </Link>
          </Menu.Item>
          <Menu.Item key="contas" title="Contas">
            <Link href="/invoice">
              <a>
                <DollarCircleOutlined /> Contas
              </a>
            </Link>
          </Menu.Item>
          <Menu.Item key="categorias" title="Categoris">
            <Link href="/category">
              <a>
                <UnorderedListOutlined /> Categorias
              </a>
            </Link>
          </Menu.Item>
          <Menu.Item key="report" title="Relatório">
            <Link href="/report">
              <a>
                <FileExcelOutlined /> Relatório
              </a>
            </Link>
          </Menu.Item>
          <Menu.Item key="backup" title="Gerar backup">
            <Link href="/backup">
              <a>
                <FileZipOutlined /> Gerar Backup
              </a>
            </Link>
          </Menu.Item>
          <Menu.Item key="sair" title="Sair">
            <div onClick={() => signOut()}>
              <LogoutOutlined /> Sair
            </div>
          </Menu.Item>
        </Menu>
      </Header>
      <Content style={{ padding: "0 50px", minHeight: "500px" }}>
        <Divider orientation="left">{title}</Divider>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            flexDirection: "column",
          }}
        >
          {children}
        </div>
      </Content>
      <Footer style={{ textAlign: "center" }}>
        Casa Espírita Eurípedes Barsanulpho - {new Date().getFullYear()}
      </Footer>
    </Theme>
  );
};

export default Layout;
