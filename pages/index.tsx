import Layout from "../components/Layout";
import { parseCookies, validateCookie } from "../util/cookieUtil";

const IndexPage = () => {
  return (
    <Layout title="Casa Espírita Eurípedes Barsanulpho">
      <div style={{ display: "flex", justifyContent: "center" }}>
        <span style={{ fontSize: "2rem", fontWeight: "bold" }}>
          Seja Bem Vindo!
        </span>
      </div>
    </Layout>
  );
};

export default IndexPage;

IndexPage.getInitialProps = async ({ req, res }) => {
  const isAuth = validateCookie(req);
  if (res && !isAuth) {
    res.writeHead(301, { Location: "/unauthenticated" });
    res.end();
  }
  return {};
};
