import React from "react";
import ReactDOM from "react-dom/client";
//
import "./styles/index.scss";
import "./index.css";
import "./fonts/line-awesome-1.3.0/css/line-awesome.css";
import "rc-slider/assets/index.css";

import PageCollection from "containers/PageCollection";
//
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import PageLogin from "containers/PageLogin/PageLogin";
import CustomerRegistration from "containers/PageLogin/CustomerRegistration";
// import { createBrowserRouter } from "react-router-dom";

const router = createBrowserRouter([
  {
    path: "/",
    element: <PageLogin />
  },
  {
    path: "/page-collection",
    element: <PageCollection />
  },
  {
    path:"/customer-registration/:patrocinador/:empresario",
    element:<CustomerRegistration />
  },
])

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
if (process.env.NODE_ENV === 'development'){
  root.render(
    <App />
  );
}
else{
  root.render(
    <React.StrictMode>
      {/* <RouterProvider router={router} /> */}
      <App />
    </React.StrictMode>
  );
}


// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
