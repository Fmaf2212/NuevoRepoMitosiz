import Label from "components/Label/Label";
import NcInputNumber from "components/NcInputNumber";
import Prices from "components/Prices";
import { Product, PRODUCTS } from "data/data";
import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import ButtonPrimary from "shared/Button/ButtonPrimary";
import Input from "shared/Input/Input";
import ContactInfo from "../PageCheckout/ContactInfo";
import PaymentMethod from "../PageCheckout/PaymentMethod";
import ShippingAddress from "../PageCheckout/ShippingAddress";
import CustomerForm from "./CustomerForm";
import Swal from "sweetalert2";

const CustomerRegistration = () => {
  const [tabActive, setTabActive] = useState<
    "ContactInfo" | "ShippingAddress" | "PaymentMethod"
  >("ShippingAddress");

  const [generatedUrl, setGeneratedUrl] = useState('');

  const handleScrollToEl = (id: string) => {
    const element = document.getElementById(id);
    setTimeout(() => {
      element?.scrollIntoView({ behavior: "smooth" });
    }, 80);
  };

  const handleGenerateClick = () =>{
    const origin = window.location.origin;
    let generatedUrl = '';
    if (origin.includes('localhost')) {
      // Hacer algo si la URL contiene "localhost"
      const userAuthString = localStorage.getItem("USER_AUTH");
      if (userAuthString) {
        const userAuth = JSON.parse(userAuthString);
        const userId = userAuth.userId;
        // const baseUrl = 'http://localhost:3000/customer-registration';
        const baseUrl = `${origin}/customer-registration`;
        generatedUrl = `${baseUrl}?patrocinador=${userId}`;
        // setGeneratedUrl(generatedUrl);
      } else {
        console.error('No se encontraron datos de usuario en localStorage.');
        return;
      }
    } else {
      const userAuthString = localStorage.getItem("USER_AUTH");
      if (userAuthString) {
        const userAuth = JSON.parse(userAuthString);
        const userId = userAuth.userId;
        const baseUrl = `${origin}/customer-registration`;
        generatedUrl = `${baseUrl}?patrocinador=${userId}`;
        //setGeneratedUrl(generatedUrl);
      } else {
        console.error('No se encontraron datos de usuario en localStorage.');
        return;
      }
    }
    // Intentar copiar el valor al portapapeles utilizando la API navigator.clipboard.writeText
    navigator.clipboard.writeText(generatedUrl)
    .then(() => {
      // console.log('URL copiada al portapapeles:', generatedUrl);
      Swal.fire({
        icon: "success",
        title: "URL Copiada!"
      })
    })
    .catch((error) => {
      // console.error('Error al copiar la URL al portapapeles:', error);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: `Error al copiar la URL al portapapeles: ${error}.`,
      });
    });
  }
  const cantidad = 1;

  const renderProduct = (item: Product, index: number) => {
    const { image, price, name } = item;

    return (
      <div key={index} className="relative flex py-7 first:pt-0 last:pb-0">
        <div className="relative h-36 w-24 sm:w-28 flex-shrink-0 overflow-hidden rounded-xl bg-slate-100">
          <img
            src={image}
            alt={name}
            className="h-full w-full object-contain object-center"
          />
          <Link to="/product-detail" className="absolute inset-0"></Link>
        </div>

        <div className="ml-3 sm:ml-6 flex flex-1 flex-col">
          <div>
            <div className="flex justify-between ">
              <div className="flex-[1.5] ">
                <h3 className="text-base font-semibold">
                  <Link to="/product-detail">{name}</Link>
                </h3>
                <div className="mt-1.5 sm:mt-2.5 flex text-sm text-slate-600 dark:text-slate-300">
                  <div className="flex items-center space-x-1.5">
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
                      <path
                        d="M7.01 18.0001L3 13.9901C1.66 12.6501 1.66 11.32 3 9.98004L9.68 3.30005L17.03 10.6501C17.4 11.0201 17.4 11.6201 17.03 11.9901L11.01 18.0101C9.69 19.3301 8.35 19.3301 7.01 18.0001Z"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeMiterlimit="10"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M8.35 1.94995L9.69 3.28992"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeMiterlimit="10"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M2.07 11.92L17.19 11.26"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeMiterlimit="10"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M3 22H16"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeMiterlimit="10"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M18.85 15C18.85 15 17 17.01 17 18.24C17 19.26 17.83 20.09 18.85 20.09C19.87 20.09 20.7 19.26 20.7 18.24C20.7 17.01 18.85 15 18.85 15Z"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>

                    <span>{`Black`}</span>
                  </div>
                  <span className="mx-4 border-l border-slate-200 dark:border-slate-700 "></span>
                  <div className="flex items-center space-x-1.5">
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
                      <path
                        d="M21 9V3H15"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M3 15V21H9"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M21 3L13.5 10.5"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M10.5 13.5L3 21"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>

                    <span>{`2XL`}</span>
                  </div>
                </div>

                <div className="mt-3 flex justify-between w-full sm:hidden relative">
                  <select
                    name="qty"
                    id="qty"
                    className="form-select text-sm rounded-md py-1 border-slate-200 dark:border-slate-700 relative z-10 dark:bg-slate-800 "
                  >
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5</option>
                    <option value="6">6</option>
                    <option value="7">7</option>
                  </select>
                  <Prices
                    contentClass="py-1 px-2 md:py-1.5 md:px-2.5 text-sm font-medium h-full"
                    price={price}
                  />
                </div>
              </div>

              <div className="hidden flex-1 sm:flex justify-end">
                <Prices price={price} className="mt-0.5" />
              </div>
            </div>
          </div>

          <div className="flex mt-auto pt-4 items-end justify-between text-sm">
            <div className="hidden sm:block text-center relative">
              {/* <NcInputNumber productId={2} cant={cantidad} className="relative z-10" /> */}
            </div>

            <a
              href="##"
              className="relative z-10 flex items-center mt-3 font-medium text-primary-6000 hover:text-primary-500 text-sm "
            >
              <span>Remove</span>
            </a>
          </div>
        </div>
      </div>
    );
  };
  const renderLeft = () => {
    return (
      <div className="space-y-8">
        <div id="ShippingAddress" className="scroll-mt-24">
          <CustomerForm />
        </div>
      </div>
    );
  };

  return (
    <div className="nc-CheckoutPage">
      <Helmet>
        <title>Registro de Cliente</title>
      </Helmet>

      <main className="container py-16 lg:pb-28 lg:pt-20 ">
        <div className="mb-12 flex justify-between items-center">
          <h2 className="block text-2xl sm:text-3xl lg:text-4xl font-semibold ">
            Registro de Cliente
          </h2>
          <div className="flex flex-col items-center">
            <ButtonPrimary
              disabled={false}
              className=" h-[40px] rounded-md whitespace-nowrap mb-4"
              onClick={handleGenerateClick}
              from="carritoCompras"
            >
              Generar url compartido
            </ButtonPrimary>
            {/* {generatedUrl && (
              <a href={generatedUrl} target="_blank" rel="noopener noreferrer" className="hover:text-purple-600 transition-colors">
                {generatedUrl}
              </a>
            )} */}
          </div>
        </div>

        <div className="flex flex-col lg:flex-row">
          <div className="flex-1">{renderLeft()}</div>
        </div>
      </main>
    </div>
  );
};

export default CustomerRegistration;
