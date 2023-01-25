import { CheckOutlined, CloseOutlined, EditOutlined } from "@ant-design/icons";
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
  Switch,
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
  author?: string;
  writer: string;
  code: string;
  edition: string;
  borrow: boolean;
}

const Book = () => {
  useEffect(() => {
    getBooks(0);
  }, []);

  const { Search } = Input;
  const [openModal, setOpenModal] = useState(false);

  const [books, setBooks] = useState([]);
  const [total, setTotal] = useState(0);
  const [filterName, setFilterName] = useState("");

  const [id, setId] = useState("");
  const [name, setName] = useState("");
  const [author, setAuthor] = useState("");
  const [writer, setWriter] = useState("");
  const [code, setCode] = useState("");
  const [borrow, setBorrow] = useState(false);

  const columns: ColumnsType<ReaderType> = [
    {
      title: "Nome",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Autor",
      dataIndex: "author",
      key: "author",
    },
    {
      title: "Código",
      dataIndex: "code",
      key: "code",
      width: 180,
    },
    {
      title: "Edição",
      dataIndex: "edition",
      key: "edition",
      width: 180,
    },
    {
      title: "Disponível",
      dataIndex: "borrow",
      key: "borrow",
      width: 100,
      render: (value) =>
        value ? (
          <CloseOutlined style={{ color: "red" }} />
        ) : (
          <CheckOutlined style={{ color: "green" }} />
        ),
    },

    {
      title: "Ações",
      key: "action",
      width: 150,
      render: (_, record) => (
        <Space size="middle">
          <a>
            <Button
              type="link"
              onClick={() => {
                setId(record.id);
                setName(record.name);
                setAuthor(record.author);
                setWriter(record.writer);
                setCode(record.code);
                setBorrow(record.borrow);
                setOpenModal(true);
              }}
            >
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
    setAuthor("");
    setWriter("");
    setCode("");
    setBorrow(false);
    setOpenModal(false);
  };

  const handleOk = async () => {
    if (!name) {
      toast.error("Digite o nome");
    } else {
      const method = id ? "PUT" : "POST";
      const reader = {
        id: id ? id : undefined,
        name,
        author,
        writer,
        code,
      };

      const response = await fetch(`api/book`, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(reader),
      });
      if (response.status === 200) {
        toast.success(!id ? "Livro Cadastrado!" : "Livro Alterado!");
        await getBooks(0);
        handleCancel();
      } else {
        const message = await response.json();
        toast.error(message.message);
      }
    }
  };

  const getBooks = async (page: number) => {
    const url = `api/book?page=${page}&name=${filterName}`;
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();
    setBooks(data.books);
    setTotal(data.total);
  };

  const onChange: PaginationProps["onChange"] = async (pageNumber) => {
    await getBooks(pageNumber);
  };

  return (
    <Layout title="Livros">
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
          onChange={(input) => setFilterName(input.target.value)}
          onSearch={async () => await getBooks(0)}
          style={{width: 400}}
        />
        <Button type="primary" onClick={() => setOpenModal(true)}>
          Novo
        </Button>
      </div>
      <Divider />
      <Table columns={columns} dataSource={books} pagination={false} />
      <Pagination defaultCurrent={1} total={total} onChange={onChange} />
      <Modal
        title="Livros"
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
            Autor
          </Col>
          <Col className="gutter-row" span={18}>
            <Input
              placeholder="Digite o nome do autor"
              value={author}
              onChange={(input) => setAuthor(input.target.value)}
            />
          </Col>
          <Col
            className="gutter-row"
            span={6}
            style={{ display: "flex", justifyContent: "flex-end" }}
          >
            Escritor
          </Col>
          <Col className="gutter-row" span={18}>
            <Input
              placeholder="Digite o nome do escritor"
              value={writer}
              onChange={(input) => setWriter(input.target.value)}
            />
          </Col>
          <Col
            className="gutter-row"
            span={6}
            style={{ display: "flex", justifyContent: "flex-end" }}
          >
            Disponível
          </Col>
          <Col className="gutter-row" span={18}>
            <Switch disabled={true} defaultChecked checked={!borrow} />
          </Col>
        </Row>
      </Modal>
    </Layout>
  );
};

export default Book;
Book.getInitialProps = async ({ req, res }) => {
  const isAuth = validateCookie(req);
  if (res && !isAuth) {
    res.writeHead(301, { Location: "/unauthenticated" });
    res.end();
  }
  return {};
};
