import { CheckCircleOutlined } from "@ant-design/icons";
import { Button, Col, Input, Modal, Row, Space, Table } from "antd";
import { ColumnsType } from "antd/es/table";
import dayjs from "dayjs";
import Router from "next/router";
import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Layout from "../components/Layout";

interface DataType {
  id: string;
  name: string;
  openLoan: boolean;
}
interface BookType {
  id: string;
  name: string;
  borrow: boolean;
}

const NewLending = () => {
  const { Search } = Input;

  const [readerId, setReaderId] = useState("");
  const [readerName, setReaderName] = useState("");
  const [bookId, setBookId] = useState("");
  const [bookName, setBookName] = useState("");
  const [expectedDate, setExpectedDate] = useState("");

  const [errorReader, setErrorReader] = useState("");
  const [errorBook, setErrorBook] = useState("");

  const [message, setMessage] = useState("");

  const [openModalBook, setOpenModalBook] = useState(false);
  const [filterBook, setFilterBook] = useState("");
  const [books, setBooks] = useState([]);

  const [openModalReader, setOpenModalReader] = useState(false);
  const [filterReader, setFilterReader] = useState("");
  const [readers, setReaders] = useState([]);

  const searchReader = async () => {
    if (!filterReader) {
      toast.error("Digite o nome para realizar a pesquisa!");
      return;
    }

    const response = await fetch(`api/reader/search?name=${filterReader}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (response.status !== 200) {
      toast.error("Não foi possível realizar a pesquisa");
      return;
    }
    const data = await response.json();
    if (data.readers.length === 0) {
      toast.warning("Não foi encontrado resultados!");
      setReaders([]);
    } else {
      setReaders(data.readers);
    }
  };
  const cancelReader = () => {
    setFilterReader("");
    setOpenModalReader(false);
  };
  const searchBook = async () => {
    if (!filterBook) {
      toast.error("Digite o nome para realizar a pesquisa!");
      return;
    }

    const response = await fetch(`api/book/search?name=${filterBook}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (response.status !== 200) {
      toast.error("Não foi possível realizar a pesquisa");
      return;
    }
    const data = await response.json();
    if (data.books.length === 0) {
      toast.warning("Não foi encontrado resultados!");
      setBooks([]);
    } else {
      setBooks(data.books);
    }
  };
  const cancelBook = () => {
    setFilterBook("");
    setOpenModalBook(false);
  };

  const save = async () => {
    const lending = {
      bookId,
      readerId,
      date: new Date(),
      expectedDate: dayjs().add(30, "days").toDate(),
    };

    const response = await fetch(`api/lending`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(lending),
    });
    if (response.status === 200) {
      toast.success("Operação realizada!");
      setTimeout(() => {
        Router.push("/lending");
      }, 500);
    } else {
      const message = await response.json();
      toast.error(message.message);
    }
  };

  const columns: ColumnsType<DataType> = [
    {
      title: "Nome",
      dataIndex: "name",
      key: "name",
    },

    {
      title: "Ações",
      key: "action",
      width: 150,
      render: (_, record) =>
        record.openLoan ? (
          <span>Possui registro em aberto</span>
        ) : (
          <Space size="middle">
            <a>
              <Button
                type="link"
                onClick={() => {
                  setReaderId(record.id);
                  setReaderName(record.name);
                  setOpenModalReader(false);
                }}
              >
                <CheckCircleOutlined />
              </Button>
            </a>
          </Space>
        ),
    },
  ];
  const columnsBook: ColumnsType<BookType> = [
    {
      title: "Nome",
      dataIndex: "name",
      key: "name",
    },

    {
      title: "Ações",
      key: "action",
      width: 150,
      render: (_, record) =>
        record.borrow ? (
          <span>Emprestado</span>
        ) : (
          <Space size="middle">
            <a>
              <Button
                type="link"
                onClick={() => {
                  setBookId(record.id);
                  setBookName(record.name);
                  setOpenModalBook(false);
                }}
              >
                <CheckCircleOutlined />
              </Button>
            </a>
          </Space>
        ),
    },
  ];

  return (
    <Layout title="Novo Empréstimo">
      <ToastContainer />
      <Row gutter={[16, 24]}>
        <Col span={12}>
          <span style={{ textAlign: "center" }}>
            {readerName ? readerName : "Pesquise o leitor no botão ao lado"}
          </span>
        </Col>
        <Col span={12}>
          <Button type="primary" onClick={() => setOpenModalReader(true)}>
            Pesquisar Leitor
          </Button>
        </Col>
        <Col span={12}>
          {bookName ? bookName : "Pesquise o livro no botão ao lado"}
        </Col>
        <Col span={12}>
          <Button type="primary" onClick={() => setOpenModalBook(true)}>
            Pesquisar Livro
          </Button>
        </Col>
        <Col span={24}>
          <div
            style={{ display: "flex", width: "100%", justifyContent: "center" }}
          >
            {readerId && bookId && (
              <Button
                type="primary"
                onClick={() => save()}
                style={{ width: "300px" }}
              >
                Salvar
              </Button>
            )}
          </div>
        </Col>
      </Row>

      <Modal
        title="Leitor"
        open={openModalReader}
        onOk={searchReader}
        onCancel={cancelReader}
      >
        <Search
          placeholder="Digite o nome"
          enterButton="Pesquisar"
          value={filterReader}
          style={{ width: 400 }}
          onChange={(input) => setFilterReader(input.target.value)}
          onSearch={async () => await searchReader()}
        />
        {readers.length > 0 && (
          <Table columns={columns} dataSource={readers} pagination={false} />
        )}
      </Modal>
      <Modal
        title="Livro"
        open={openModalBook}
        onOk={searchBook}
        onCancel={cancelBook}
      >
        <Search
          placeholder="Digite o nome"
          enterButton="Pesquisar"
          value={filterBook}
          style={{ width: 400 }}
          onChange={(input) => setFilterBook(input.target.value)}
          onSearch={async () => await searchBook()}
        />
        {books.length > 0 && (
          <Table columns={columnsBook} dataSource={books} pagination={false} />
        )}
      </Modal>
    </Layout>
  );
};

export default NewLending;
