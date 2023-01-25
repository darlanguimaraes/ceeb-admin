import {
  Button,
  Col,
  Modal,
  Pagination,
  PaginationProps,
  Row,
  Space,
  Switch,
  Table,
} from "antd";
import { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import type { ColumnsType } from "antd/es/table";
import "react-toastify/dist/ReactToastify.css";
import Layout from "../components/Layout";
import { CheckCircleTwoTone, EditOutlined } from "@ant-design/icons";
import Link from "next/link";
import dayjs from "dayjs";
import { Lending } from "@prisma/client";
import { validateCookie } from "../util/cookieUtil";

interface DataType {
  id: string;
  reader: string;
  book: string;
  expectedDate: Date;
  deliveryDate: Date;
  code: string;
  returned: boolean;
}

const LendingPage = () => {
  const [openModal, setOpenModal] = useState(false);

  const [isOpen, setIsOpen] = useState(false);
  const [lendings, setLendings] = useState([]);
  const [total, setTotal] = useState(0);

  const [lending, setLending] = useState(null);

  useEffect(() => {
    getLendings(0);
  }, []);

  useEffect(() => {
    getLendings(0);
  }, [isOpen]);

  const columns: ColumnsType<DataType> = [
    {
      title: "Leitor",
      dataIndex: "reader",
      key: "reader",
      render: (value) => value.name,
    },
    {
      title: "Livro",
      dataIndex: "book",
      key: "book",
      render: (value) => value.name,
    },
    {
      title: "Código",
      dataIndex: "reader",
      key: "code",
      render: (value) => value.code,
    },
    {
      title: "Data",
      dataIndex: "date",
      key: "date",
      render: (text) => dayjs(text).format("DD/MM/YYYY"),
    },
    {
      title: "Data prevista",
      dataIndex: "expectedDate",
      key: "expectedDate",
      render: (text) => dayjs(text).format("DD/MM/YYYY"),
    },
    {
      title: "Data de entrega",
      dataIndex: "deliveryDate",
      key: "deliveryDate",
      render: (text) => (text ? dayjs(text).format("DD/MM/YYYY") : ""),
    },
    {
      title: "Ações",
      key: "action",
      width: 150,
      render: (_, record) => (
        !record.returned ? 
        <Space size="middle">
          <a>
            <Button
              type="link"
              onClick={() => {
                setLending(record);
                setOpenModal(true);
              }}
            >
              <CheckCircleTwoTone />
            </Button>
          </a>
        </Space> : 
        <Space size='middle'></Space>
      ),
    },
  ];

  const getLendings = async (page: number) => {
    const response = await fetch(`api/lending?page=${page}&open=${isOpen}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();
    setLendings(data.lendings);
    setTotal(data.total);
  };

  const onChange: PaginationProps["onChange"] = async (pageNumber) => {
    await getLendings(pageNumber);
  };

  const handleOk = async () => {
    if (lending) {
      const response = await fetch(`api/lending`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(lending),
      });
      if (response.status === 200) {
        toast.success("Devolução realizada!");
        setOpenModal(false);
        setLending(null);
        await getLendings(0);
      } else {
        const message = await response.json();
        toast.error(message.message);
      }
    }
  };

  const handleCancel = () => {
    setLending(null);
    setOpenModal(false);
  };

  const hasFine = (lending: Lending): number => {
    if (!lending) return 0;
    const actualDate = dayjs();
    const expectedDate = dayjs(lending.expectedDate);

    if (actualDate < expectedDate) {
      return 0;
    }
    const diff = actualDate.diff(expectedDate, 'days');
    return diff;

  }

  return (
    <Layout title="Empréstimos e Devoluções">
      <ToastContainer />
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "5px",
        }}
      >
        <div>
          <span style={{ paddingRight: "10px" }}>Em aberto</span>
          <Switch
            checked={isOpen}
            onChange={(value) => setIsOpen(value)}
          ></Switch>
        </div>
        <Link href="/newLending">
          <Button type="primary">Novo empréstimo</Button>
        </Link>
      </div>
      <Table columns={columns} dataSource={lendings} pagination={false} />
      <Pagination defaultCurrent={1} total={total} onChange={onChange} />
      <Modal
        title="Devolução"
        open={openModal}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Row gutter={[16, 24]}>
          <Col span={12}>
            <span
              style={{ textAlign: "end", display: "block", fontWeight: "bold" }}
            >
              Leitor
            </span>
          </Col>
          <Col span={12}>{lending?.reader.name}</Col>
          <Col span={12}>
            <span
              style={{ textAlign: "end", display: "block", fontWeight: "bold" }}
            >
              Livro
            </span>
          </Col>
          <Col span={12}>{lending?.book.name}</Col>
          <Col span={12}>
            <span
              style={{ textAlign: "end", display: "block", fontWeight: "bold" }}
            >
              Código
            </span>
          </Col>
          <Col span={12}>{lending?.book.code}</Col>
          <Col span={12}>
            <span
              style={{ textAlign: "end", display: "block", fontWeight: "bold" }}
            >
              Data de empréstimo
            </span>
          </Col>
          <Col span={12}>
            {lending?.date ? dayjs(lending.date).format("DD/MM/YYYY") : ""}
          </Col>
          <Col span={12}>
            <span
              style={{ textAlign: "end", display: "block", fontWeight: "bold" }}
            >
              Data de entrega prevista
            </span>
          </Col>
          <Col span={12}>
            {lending?.expectedDate
              ? dayjs(lending.expectedDate).format("DD/MM/YYYY")
              : ""}
          </Col>
          {hasFine(lending) > 0 && (
            <>
              <Col span={12}>
                <span
                  style={{
                    textAlign: "end",
                    display: "block",
                    fontWeight: "bold",
                    color: 'red',
                  }}
                >
                  Multa
                </span>
              </Col>
              <Col span={12}>
                {hasFine(lending)} dias
              </Col>
            </>
          )}
        </Row>
      </Modal>
    </Layout>
  );
};

export default LendingPage;
LendingPage.getInitialProps = async ({ req, res }) => {
  const isAuth = validateCookie(req);
  if (res && !isAuth) {
    res.writeHead(301, { Location: "/unauthenticated" });
    res.end();
  }
  return {};
};