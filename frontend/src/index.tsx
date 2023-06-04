import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import store from "./redux/store";
import { Provider as StoreProvider } from "react-redux";
import { CookiesProvider } from "react-cookie";
import { SocketContextProvider } from "./context/socket";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <React.StrictMode>
    <CookiesProvider>
      <StoreProvider store={store}>
        <SocketContextProvider>
          <App />
        </SocketContextProvider>
      </StoreProvider>
    </CookiesProvider>
  </React.StrictMode>
);
