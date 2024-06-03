import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Page } from "./types";
import ScrollToTop from "./ScrollToTop";
import Footer from "shared/Footer/Footer";
import PageHome from "containers/PageHome/PageHome";
import Page404 from "containers/Page404/Page404";
import AccountPage from "containers/AccountPage/AccountPage";
import EditProfile from "containers/AccountPage/EditProfile";
import PageContact from "containers/PageContact/PageContact";
import PageAbout from "containers/PageAbout/PageAbout";
import PageSignUp from "containers/PageSignUp/PageSignUp";
import PageLogin from "containers/PageLogin/PageLogin";
import CustomerRegistration from "containers/PageLogin/CustomerRegistration";
import PageInformation from "containers/PageInformation/PageInformation";
// import PageSubcription from "containers/PageSubcription/PageSubcription";
// import BlogPage from "containers/BlogPage/BlogPage";
// import BlogSingle from "containers/BlogPage/BlogSingle";
import SiteHeader from "containers/SiteHeader";
import PageCollection from "containers/PageCollection";
// import PageSearch from "containers/PageSearch";
// import PageHome2 from "containers/PageHome/PageHome2";
// import PageHome3 from "containers/PageHome/PageHome3";
// import ProductDetailPage from "containers/ProductDetailPage/ProductDetailPage";
// import ProductDetailPage2 from "containers/ProductDetailPage/ProductDetailPage2";
// import AccountSavelists from "containers/AccountPage/AccountSavelists";
// import AccountPass from "containers/AccountPage/AccountPass";
// import AccountBilling from "containers/AccountPage/AccountBilling";
import AccountOrder from "containers/AccountPage/AccountOrder";
import CartPage from "containers/ProductDetailPage/CartPage";
// import CheckoutPage from "containers/PageCheckout/CheckoutPage";
// import PageCollection2 from "containers/PageCollection2";
import PageVirtualOffice from "containers/PageVirtualOffice/PageVirtualOffice";
import { Toaster } from "react-hot-toast";
import MyPurchases from "containers/AccountPage/MyPurchases";
// import ProtectedRoute from "./ProtectedRoute";

import { useCounterStore } from "store/auth";
import NetworkMap from "containers/NetworkMap/NetworkMap";
import Commissions from "containers/PageCommissions/Commissions";

import SessionTimeout from "SessionTimeout";

interface DynamicRoute {
  path: string; // Este sería el patrón para las rutas dinámicas
  component: React.ComponentType<any>;
}

export const pages: Page[] = [
  { path: "/", component: PageHome },
  { path: "/page-collection", component: PageCollection },
  { path: "/page-virtualOffice", component: PageVirtualOffice },
  { path: "/account", component: AccountPage },
  { path: "/editProfile", component: EditProfile },
  { path: "/account-my-order", component: AccountOrder },
  { path: "/mypurchases", component: MyPurchases },
  { path: "/cart", component: CartPage },
  { path: "/contact", component: PageContact },
  { path: "/about", component: PageAbout },
  { path: "/signup", component: PageSignUp },
  { path: "/login", component: PageLogin },
  // { path: "/customer-registration/:patrocinador/:empresario", component: CustomerRegistration },
  { path: "/network-map", component: NetworkMap },
  { path: "/commissions", component: Commissions },
  { path: "/page-information", component: PageInformation },
];

const dynamicRoutes: DynamicRoute[] = [
  { path: "/Registro/:namePatron?/:patronId?", component: CustomerRegistration },
];

const MyRoutes = () => {
  const { isLoggedIn } = useCounterStore();
  const userId = isLoggedIn
    ? JSON.parse(localStorage.getItem("USER_AUTH")!).userId
    : 0;

  const purchaseData = {
    userId: userId,
    grossAmount: 0,
    netAmount: 0,
    realPoints: 0,
    promotionPoints: 0,
    quantity: 0,
    storeId: 0,
    statusPurchase: "Pendiente",
    typePurchaseId: 0,
    receipt: "",
    documentReceipt: "",
    typeDocumentReceipt: "",
    typePayment: "",
    purchaseDetail: [],
  };
  const purchaseDataString = JSON.stringify(purchaseData);
  const carritoLength = localStorage.getItem("carritoLength");
  if (!carritoLength) {
    localStorage.setItem("purchaseData", purchaseDataString);
  }

  // const [isLoggedIn, setIsLoggedIn] = useState(false);
  // const handleLogin = () => {
  //   setIsLoggedIn(true);
  // };

  // const handleLogout = () => {
  //   setIsLoggedIn(false);
  // };

  // const additionalProps = {
  //   onLogin: handleLogin,
  //   onLogout: handleLogout
  // };

  const sessionTimeoutDuration = 5 * 60 * 1000; // 5 minutos
  return (
    <BrowserRouter>
    
      <SessionTimeout timeoutDuration={sessionTimeoutDuration} />
      <Toaster />
      <ScrollToTop />
      <SiteHeader />
      <Routes>
        {pages.map(({ component: Component, path }, index ) => {
          return <Route key={index} element={<Component />} path={path} />;
        })}
        {dynamicRoutes.map(({ component: Component, path }, index) => {
        return <Route key={index} element={<Component />} path={path} />;
        })}
        <Route path="*" element={<Page404 />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
};

export default MyRoutes;
