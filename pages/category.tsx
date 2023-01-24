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
          {/* <a>
              <DeleteOutlined />
            </a> */}
        </Space>
      ),
    },
  ];

  const handleOk = async () => {
    if (name) {
      const category = { id, name };
      const method = id ? "PUT" : "POST";
      const response = await fetch(`api/category`, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(category),
      });
      toast.success(!id ? "Categoria Cadastrada!" : "Categoria Alterada!");
      handleCancel();
      await getCategories(0);
    } else {
      toast.error("Digite o nome!");
    }
  };

  const handleCancel = () => {
    setName("");
    setId("");
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
      <Modal
        title="Categoria"
        open={openModal}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Row gutter={16}>
          <Col className="gutter-row">Nome</Col>
          <Col className="gutter-row">
            <Input
              placeholder="Digite o nome"
              value={name}
              onChange={(input) => setName(input.target.value)}
            />
          </Col>
        </Row>
      </Modal>
    </Layout>
  );
};

export default Category;
