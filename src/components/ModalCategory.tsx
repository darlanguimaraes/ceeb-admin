import { Col, Input, Modal, Row } from "antd";
import { useEffect, useState } from "react";

const ModalCategory = ({ id, openModal, handleCancel, showErrorToast }) => {
  const [name, setName] = useState("");

  useEffect(() => {
    if (openModal) {
      if (id) {
        getCategory(id);
      } else {
        setName('');
      }
    }
  }, [openModal]);

  const getCategory = async (id: string) => {
    const response = await fetch(`api/category/get?id=${id}`, {
      method: 'GET',
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (response.status === 200) {
      const category = await response.json();
      setName(category.name);
    }
  }

  const handleOk = async () => {
    if (name) {
      const category = { id, name, sync: false };
      const method = id ? "PUT" : "POST";
      const response = await fetch(`api/category`, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(category),
      });
      handleCancel(!id ? "Categoria Cadastrada!" : "Categoria Alterada!");
    } else {
      showErrorToast("Digite o nome!");
    }
  };

  return (
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
  );
};

export default ModalCategory;
