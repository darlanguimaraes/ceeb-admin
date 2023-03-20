import {
  Button,
  Col,
  Input,
  Modal,
  Pagination,
  PaginationProps,
  Row,
  Space,
  Table,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import { EditOutlined } from "@ant-design/icons";

import Layout from "../components/Layout";
import { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { validateCookie } from "../util/cookieUtil";
import ModalCategory from "../components/ModalCategory";

interface DataType {
  id: string;
  name: string;
}

const Category = () => {
  useEffect(() => {
    getCategories(0);
  }, []);

  const [openModal, setOpenModal] = useState(false);

  const [categories, setCategories] = useState([]);
  const [total, setTotal] = useState(1);
  const [name, setName] = useState("");
  const [id, setId] = useState("");

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
      render: (_, record) => (
        <Space size="middle">
          <a>
            <Button
              type="link"
              onClick={() => {
                setId(record.id);
                setName(record.name);
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

  const showErrorToast = (message: string) => toast.error(message);

  const handleCancel = async (toastMessage: string) => {
    setName("");
    setId("");
    if (toastMessage) {
      toast.success(toastMessage);
    }
    await getCategories(0);
    setOpenModal(false);
  };

  const getCategories = async (page: number) => {
    const response = await fetch(`api/category?page=${page}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();
    setCategories(data.categories);
    setTotal(data.total);
  };

  const onChange: PaginationProps["onChange"] = async (pageNumber) => {
    await getCategories(pageNumber);
  };

  return (
    <Layout title="Categorias">
      <ToastContainer />
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          marginBottom: "5px",
        }}
      >
        <Button type="primary" onClick={() => setOpenModal(true)}>
          Novo
        </Button>
      </div>
      <Table columns={columns} dataSource={categories} pagination={false} />
      <Pagination defaultCurrent={1} total={total} onChange={onChange} />

      <ModalCategory
        id={id}
        openModal={openModal}
        showErrorToast={showErrorToast}
        handleCancel={handleCancel}
      />
    </Layout>
  );
};

export default Category;
Category.getInitialProps = async ({ req, res }) => {
  const isAuth = validateCookie(req);
  if (res && !isAuth) {
    res.writeHead(301, { Location: "/unauthenticated" });
    res.end();
  }
  return {};
};
