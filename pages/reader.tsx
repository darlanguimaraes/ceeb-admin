import { EditOutlined } from "@ant-design/icons";
import {
  Button,
  Col,
  Divider,
  Input,
  Modal,
  Pagination,
  PaginationProps,
  Row,
  Space,
  Table,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import Layout from "../components/Layout";
import "react-toastify/dist/ReactToastify.css";
import { validateCookie } from "../util/cookieUtil";

interface ReaderType {
  id: string;
  name: string;
  phone?: string;
  address?: string;
  city?: string;
}

const Reader = () => {

  useEffect(() => {
    getReaders(0);
  }, []);

  const { Search } = Input;
  const [openModal, setOpenModal] = useState(false);

  const [readers, setReaders] = useState([]);
  const [total, setTotal] = useState(0);
  const [filterName, setFilterName] = useState("");

  const [id, setId] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");

  const columns: ColumnsType<ReaderType> = [
    {
      title: "Nome",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Telefone",
      dataIndex: "phone",
      key: "phone",
    },

    {
      title: "Ações",
      key: "action",
      width: 150,
      render: (_, record) => (
        <Space size="middle">
          <a>
            <Button type="link" onClick={() => {}}>
              <EditOutlined />
            </Button>
          </a>
        </Space>
      ),
    },
  ];

  const handleCancel = () => {
    setId(undefined);
    setName("");
    setPhone("");
    setAddress("");
    setCity("");
    setOpenModal(false);
  };

  const handleOk = async () => {
    if (!name) {
      toast.error('Digite o nome');
    } else {
      const method = id ? "PUT" : "POST";
      const reader = {
        id: id ?id : undefined,
        name,
        address,
        phone,
        city,
      }

      const response = await fetch(`api/reader`, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(reader),
      });
      if (response.status === 200) {
        toast.success(!id ? "Leitor Cadastrado!" : "Leitor Alterado!");
        handleCancel();
      } else {
        const message = await response.json();
        toast.error(message.message);
      }
    }
  };

  const getReaders = async (page: number) => {
    const url = `api/reader?page=${page}&name=${filterName}`;
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();
    setReaders(data.readers);
    setTotal(data.total);
  };

  const onChange: PaginationProps["onChange"] = async (pageNumber) => {
    await getReaders(pageNumber);
  };

  return (
    <Layout title="Leitor">
      <ToastContainer />
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "5px",
        }}
      >
          <Search
            placeholder="Digite o nome"
            enterButton="Pesquisar"
            value={filterName}
            style={{ width: 400 }}
            onChange={(input) => setFilterName(input.target.value)}
            onSearch={async () => await getReaders(0)}
          />
        <Button type="primary" onClick={() => setOpenModal(true)}>
          Novo
        </Button>
      </div>
      <Divider />
      <Table columns={columns} dataSource={readers} pagination={false} />
      <Pagination defaultCurrent={1} total={total} onChange={onChange} />
      <Modal
        title="Leitor"
        open={openModal}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Row gutter={[16, 16]}>
          <Col
            className="gutter-row"
            span={6}
            style={{ display: "flex", justifyContent: "flex-end" }}
          >
            Nome
          </Col>
          <Col className="gutter-row" span={18}>
            <Input
              placeholder="Digite o nome"
              value={name}
              onChange={(input) => setName(input.target.value)}
            />
          </Col>
          <Col
            className="gutter-row"
            span={6}
            style={{ display: "flex", justifyContent: "flex-end" }}
          >
            Telefone
          </Col>
          <Col className="gutter-row" span={18}>
            <Input
              placeholder="Digite o telefone"
              value={phone}
              onChange={(input) => setPhone(input.target.value)}
            />
          </Col>
          <Col
            className="gutter-row"
            span={6}
            style={{ display: "flex", justifyContent: "flex-end" }}
          >
            Endereço
          </Col>
          <Col className="gutter-row" span={18}>
            <Input
              placeholder="Digite o Endereço"
              value={address}
              onChange={(input) => setAddress(input.target.value)}
            />
          </Col>
          <Col
            className="gutter-row"
            span={6}
            style={{ display: "flex", justifyContent: "flex-end" }}
          >
            Cidade
          </Col>
          <Col className="gutter-row" span={18}>
            <Input
              placeholder="Digite a cidade"
              value={city}
              onChange={(input) => setCity(input.target.value)}
            />
          </Col>
        </Row>
      </Modal>
    </Layout>
  );
};

export default Reader;

Reader.getInitialProps = async ({ req, res }) => {
  const isAuth = validateCookie(req);
  if (res && !isAuth) {
    res.writeHead(301, { Location: "/unauthenticated" });
    res.end();
  }
  return {};
};