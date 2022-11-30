import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { BrowserRouter } from "react-router-dom";
import "./global.css";
import { Auth0Provider } from "@auth0/auth0-react";
//import { AuthContextProvider } from "./context/AuthContext";

const container = document.getElementById("root");
const root = createRoot(container);

root.render(
  <BrowserRouter>
    {/* <AuthContextProvider>
      <App />
    </AuthContextProvider> */}
  <Auth0Provider
    domain="dev-a3rk4vtyuf1paxcf.us.auth0.com"
    clientId="DMfKSCf7WgSmfy5yDeLJ6yH7kO2m5nSx"
    redirectUri="http://localhost:3000/"
  >
    <App />
  </Auth0Provider>
  </BrowserRouter>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
