import { Button, Col, DatePicker, DatePickerProps, Divider, Row } from "antd";
import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import donwloadjs from "downloadjs";

import Layout from "../components/Layout";
import dayjs from "dayjs";
import { validateCookie } from "../util/cookieUtil";

const Report = () => {
  const [initialDate, setInitialDate] = useState(new Date());
  const [finalDate, setFinalDate] = useState(new Date());

  const generate = async () => {
    if (!initialDate || !finalDate) {
      toast.error("Selecione o período");
      return;
    }
    if (initialDate > finalDate) {
      toast.error("Período inválido");
      return;
    }

    const response = await fetch(
      `api/invoice/report?initialDate=${initialDate.toISOString()}&finalDate=${finalDate.toISOString()}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    const data = await response.json();
    donwloadjs(data.report, `relatorio-${new Date().toISOString()}.csv`, "text/plain");
  };

  const selectInitialDate: DatePickerProps["onChange"] = (date, dateString) => {
    setInitialDate(date.toDate());
  };
  const selectFinalDate: DatePickerProps["onChange"] = (date, dateString) => {
    setFinalDate(date.toDate());
  };

  return (
    <Layout title="Relatório">
      <ToastContainer />
      <Row gutter={[16, 16]}>
        <Col span={6} className="gutter-row" style={{ display: "flex", justifyContent: "flex-end" }}>
          Data Inicial
        </Col>
        <Col span={6} className="gutter-row">
          <DatePicker
            placeholder="Selecione a data"
            format="DD/MM/YYYY"
            value={dayjs(initialDate)}
            onChange={selectInitialDate}
          />
        </Col>
        <Col span={6} className="gutter-row" style={{ display: "flex", justifyContent: "flex-end" }}>
          Data Final
        </Col>
        <Col span={6} className="gutter-row">
          <DatePicker
            placeholder="Selecione a data"
            format="DD/MM/YYYY"
            value={dayjs(finalDate)}
            onChange={selectFinalDate}
          />
        </Col>
      </Row>
      <Divider />
      <Row>
        <Col style={{display: "flex", justifyContent: "center"}} span={24}>
          <Button type="primary" onClick={() => generate()}>Exportar</Button>
        </Col>
      </Row>
    </Layout>
  );
};

export default Report;
Report.getInitialProps = async ({ req, res }) => {
  const isAuth = validateCookie(req);
  if (res && !isAuth) {
    res.writeHead(301, { Location: "/unauthenticated" });
    res.end();
  }
  return {};
};