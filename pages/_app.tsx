import { AppProps } from "next/app";
import { CookiesProvider } from "react-cookie";

import "../style/login.css";

const App = ({ Component, pageProps }: AppProps) => {
  return (
    <CookiesProvider>
      <Component {...pageProps} />
    </CookiesProvider>
  );
};

export default App;
