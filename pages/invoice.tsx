import {
  Button,
  Col,
  DatePicker,
  DatePickerProps,
  InputNumber,
  Modal,
  Pagination,
  Radio,
  Row,
  Select,
  Space,
  Table,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import { EditOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Layout from "../components/Layout";
import { PaginationProps } from "antd/es/pagination";
import { PaymentType } from "../util/payments";
import dayjs from "dayjs";
import { validateCookie } from "../util/cookieUtil";

interface DataType {
  id: string;
  date: Date;
  value: number;
  quantity: number;
  credit: boolean;
  category: string;
  categoryId: string,
  paymentType: number,
}

const Invoice = () => {
  const { Option } = Select;

  const [openModal, setOpenModal] = useState(false);

  const [invoices, setInvoices] = useState([]);
  const [total, setTotal] = useState(0);

  const [id, setId] = useState<string>(null);
  const [date, setDate] = useState(new Date());
  const [category, setCategory] = useState("0");
  const [quantity, setQuantity] = useState(1);
  const [value, setValue] = useState(0);
  const [type, setType] = useState(true);
  const [paymentType, setPaymentType] = useState(1);

  const [categories, setCategories] = useState([]);

  const formatter = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  
    // These options are needed to round to whole numbers if that's what you want.
    minimumFractionDigits: 2, // (this suffices for whole numbers, but will print 2500.10 as $2,500.1)
    maximumFractionDigits: 2, // (causes 2500.99 to be printed as $2,501)
  });

  useEffect(() => {
    try {
      
      getCategories();
      getInvoices(0);
    } catch (error) {
      console.log(error)  
    }
  }, []);

  const columns: ColumnsType<DataType> = [
    {
      title: "Data",
      dataIndex: "date",
      key: "date",
      render: (text) => dayjs(text).format("DD/MM/YYYY"),
      width: 150,
    },
    {
      title: "Categoria",
      dataIndex: "category",
      render: (category) => category.name,
      width: 200,
    },
    {
      title: "Quantidade",
      dataIndex: "quantity",
      width: 100,
    },
    {
      title: "Valor",
      dataIndex: "value",
      width: 120,
      render: value => formatter.format(value)
    },
    {
      title: "Total",
      dataIndex: "total",
      width: 120,
      render: value => formatter.format(value)
    },
    {
      title: "Tipo",
      dataIndex: "credit",
      width: 120,
      render: (value) =>
        value ? (
          <span style={{ color: "green", fontWeight: "bold" }}>Entrada</span>
        ) : (
          <span style={{ color: "red", fontWeight: "bold" }}>Saída</span>
        ),
    },
    {
      title: "Tipo de Pagamento",
      dataIndex: "paymentType",
      width: 120,
      render: (value) => PaymentType[value]
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
                setDate(new Date());
                setCategory(record.categoryId);
                setQuantity(record.quantity);
                setValue(record.value);
                setType(record.credit);
                setPaymentType(record.paymentType);
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

  const getInvoices = async (page: number) => {
    const response = await fetch(`api/invoice?page=${page}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();
    setInvoices(data.invoices.map(invoice => {
      const total = invoice.quantity * invoice.value;
      return {...invoice, total}
    }));
    setTotal(data.total);
  };

  const getCategories = async () => {
    const response = await fetch(`api/category/list`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();
    setCategories(data);
  };


  const handleOk = async () => {
    if (!validateFields()) {
      toast.error("Preencha os campos corretamente");
    } else {
      const invoice = {
        id: undefined,
        date,
        categoryId: category,
        quantity,
        value,
        credit: type,
        paymentType: paymentType,
      };
      const method = id ? "PUT" : "POST";
      if (id) {
        invoice.id = id
      }
      const response = await fetch(`api/invoice`, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(invoice),
      });
      if (response.status === 200) {
        toast.success(!id ? "Conta Cadastrada!" : "Conta Alterada!");
      } else {
        toast.error("Não foi possível cadastrar");
      }
      getInvoices(0);
      handleCancel();
    }
  };

  const handleCancel = () => {
    setOpenModal(false);
    clearFields();
  };

  const validateFields = () => {
    if (!date || !category || !quantity || !value) return false;
    return true;
  };

  const clearFields = () => {
    setId(null);
    setDate(new Date());
    setCategory(null);
    setQuantity(1);
    setValue(0);
    setType(true);
    setPaymentType(1);
  };

  const selectDate: DatePickerProps["onChange"] = (date, dateString) => {
    setDate(date.toDate());
  };

  const onChange: PaginationProps["onChange"] = async (pageNumber) => {
    await getInvoices(pageNumber);
  };

  return (
    <Layout title="Registro de Contas">
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

      <Table columns={columns} dataSource={invoices} pagination={false} />
      <Pagination defaultCurrent={1} total={total} onChange={onChange} />

      <Modal
        title="Cadastro"
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
            Data
          </Col>
          <Col className="gutter-row" span={18}>
            <DatePicker
              placeholder="Selecione a data"
              format="DD/MM/YYYY"
              value={dayjs(date)}
              onChange={selectDate}
              allowClear={false}
            />
          </Col>

          <Col
            className="gutter-row"
            span={6}
            style={{ display: "flex", justifyContent: "flex-end" }}
          >
            Categoria
          </Col>
          <Col className="gutter-row" span={18}>
            <Select
              style={{ width: "100%" }}
              value={category}
              onChange={(value) => {
                setCategory(value);
              }}
            >
              <Option value={"0"}>Selecione</Option>
              {categories.map((category) => (
                <Option key={category.id} value={category.id}>{category.name}</Option>
              ))}
            </Select>
          </Col>
          
          <Col
            className="gutter-row"
            span={6}
            style={{ display: "flex", justifyContent: "flex-end" }}
          >
            Quantidade
          </Col>
          <Col className="gutter-row" span={18}>
            <InputNumber
              value={quantity}
              onChange={(value) => setQuantity(value)}
            />
          </Col>

          <Col
            className="gutter-row"
            span={6}
            style={{ display: "flex", justifyContent: "flex-end" }}
          >
            Valor
          </Col>
          <Col className="gutter-row" span={18}>
            <InputNumber value={value} onChange={(value) => setValue(value)} style={{ width: '80%' }} />
          </Col>

          <Col
            className="gutter-row"
            span={6}
            style={{ display: "flex", justifyContent: "flex-end" }}
          >
            Total
          </Col>
          <Col className="gutter-row" span={18}>
            <InputNumber value={ formatter.format(value && quantity ? value * quantity : 0)} disabled style={{ width: '80%' }}/>
          </Col>

          <Col
            className="gutter-row"
            span={6}
            style={{ display: "flex", justifyContent: "flex-end" }}
          >
            Tipo de Pagamento
          </Col>
          <Col className="gutter-row" span={18}>
            <Select
              style={{ width: "100%" }}
              value={paymentType}
              onChange={(value) => {
                setPaymentType(+value);
              }}
            >
              <Option value={1}>Dinheiro</Option>
              <Option value={2}>PIX</Option>
            </Select>
          </Col>

          <Col
            className="gutter-row"
            span={6}
            style={{ display: "flex", justifyContent: "flex-end" }}
          >
            Tipo
          </Col>
          <Col className="gutter-row" span={18}>
            <Radio.Group
              value={type}
              onChange={(value) => setType(value.target.value)}
            >
              <Radio value={true}>Entrada</Radio>
              <Radio value={false}>Saída</Radio>
            </Radio.Group>
          </Col>
        </Row>
      </Modal>
    </Layout>
  );
};

export default Invoice;
Invoice.getInitialProps = async ({ req, res }) => {
  const isAuth = validateCookie(req);
  if (res && !isAuth) {
    res.writeHead(301, { Location: "/unauthenticated" });
    res.end();
  }
  return {};
};