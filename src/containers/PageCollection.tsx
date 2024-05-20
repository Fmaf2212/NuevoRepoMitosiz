import React, { FC, useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
// import Pagination from "shared/Pagination/Pagination";
// import SectionSliderCollections from "components/SectionSliderLargeProduct";
// import SectionPromo1 from "components/SectionPromo1";
// import useProductsData, { Product } from "data/useProductsData";
import ProductCardService from "components/ProductCardService";
import TabOptionsToBuy from "./TabOptionsToBuy";

import loadingGif from  "../images/loading.gif"
// import PageSearch from "./PageSearch";
// import Input from "shared/Input/Input";
// import ButtonCircle from "shared/Button/ButtonCircle";
import ReactPaginate from "react-paginate";

import styles from '../containers/AccountPage/style.module.css'; // Importa los estilos CSS como un objeto

import useProductStore from 'store/products';
import axios from "axios";

import { useCounterStore } from "store/auth";

import { BEARER_TOKEN } from "../../src/store/config";

export interface PageCollectionProps {
  className?: string;
}

const PageCollection: FC<PageCollectionProps> = ({ className = "" }) => {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(true); // Estado de carga
  const productsPerPage: number = 9;

  // const newArrayFormat = useProductsData();
  const { products, searchTerm, setProducts, setSearchTerm } = useProductStore();
  const totalProducts: number = products.length;
  // const totalProducts: number = 32;
  const totalPages: number = Math.ceil(totalProducts / productsPerPage);
  // const handlePageChange = (newPage: number) => {
  //   setCurrentPage(newPage);
  // };
  // const handlePaginationChange = (newPage: number) => {
  //   setCurrentPage(newPage);
  // };

  const paginatedProducts = products.slice(
    (currentPage - 1) * productsPerPage,
    currentPage * productsPerPage
  );

  //Para nueva paginación
  const paginateNew = (data: any) => { setCurrentPage(data.selected + 1) }
  const showNextButton = currentPage !== totalPages;
  const showPrevButton = currentPage-1 !== 0;

  const { purchaseData } = useCounterStore();
  // const montoBruto = carrito.grossAmount || "0.00";
  const pntosRealesTotal = purchaseData.realPoints || "0";
  const pntosRedTotal = purchaseData.promotionPoints || "0";
  const montoNeto = purchaseData.netAmount;

  const dataIsLoggedIn = useCounterStore((state) => state.dataIsLoggedIn);
  const valor = localStorage.getItem('USER_AUTH') ?? 'valor_por_defecto';
  useEffect(() => {
    // Verificar si el usuario está autenticado, de lo contrario, redirigir al Login
    if (valor==="valor_por_defecto") {
      window.location.href = '/login';
    }
  }, [dataIsLoggedIn]);

  useEffect(() => {
    const fetchData = async () => {
      const pageNumber = 1;
      const pageSize = 1000;
      try {
        let userId = 0; // Valor por defecto
  
        // Verificar si existe la clave USER_AUTH en localStorage
        const infoUserLogued = localStorage.getItem("USER_AUTH");
        if (infoUserLogued) {
          const userData = JSON.parse(infoUserLogued);
          userId = userData.userId;
        }
        const response = await axios.post(
          "https://api.yosoymitosis.com/v1/Product/GetProductsStore",
          {
            number: pageNumber,
            size: pageSize,
            userId: userId,
          },
          {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjoibWl0b3NpekFwaSIsInBhc3N3b3JkIjoiQG1pdG9zaXo5NiIsImF1ZCI6IkZyb250TWl0b3NpeiJ9.PjRxNwguwkC6I_Qtlo6XLy1686QFyU5L2QroleKQAX0'
            },
          }
        );
        if (response.data.message === "Success") {
          // setDataProducts(response.data.data.productStore);
          // console.log(response.data.data.productStore)
          setProducts(response.data.data.productStore);
        } else {
          console.error("Error al consumir el servicio GetProductsStore");
        }
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
    // Simula una carga ficticia
    setTimeout(() => {
      setLoading(false);
    }, 500);

    
  }, [currentPage, productsPerPage, searchTerm, setProducts]); // Dependencias que pueden cambiar la carga de productos

  
  const GetProductsByName = async (valueInputSearch: any) => {
    const url = "https://api.yosoymitosis.com/v1/Product/GetProductsByName";
    try {
      let userId = 0; // Valor por defecto

      // Verificar si existe la clave USER_AUTH en localStorage
      const infoUserLogued = localStorage.getItem("USER_AUTH");
      if (infoUserLogued) {
        const userData = JSON.parse(infoUserLogued);
        userId = userData.userId;
      }
      const respuesta = await axios.post(
        url,
        {
          number: 1,
          size: 1000,
          name: valueInputSearch,
          userId: userId,
        },
        {
          headers: {
            Authorization: `Bearer ${BEARER_TOKEN}`,
            "Content-Type": "application/json",
          },
        }
      );
      const data = respuesta.data.data;
      console.log(data.productStore)
      setProducts(data.productStore);
    } catch (error) {
      console.log(error);
    }
  };

  const handleChange = (e:any) =>{
    GetProductsByName(e.target.value);
  }

  return (
    <div
      className={`nc-PageCollection ${className}`}
      data-nc-id="PageCollection"
    >
      {loading ? (
      <div className="flex justify-center items-center h-screen">
        <img src={loadingGif} alt="Cargando..." className="w-32 h-16" />
      </div>
    ) : (
      <>
      <Helmet>
        <title>Tienda</title>
      </Helmet>

      <div className="container py-16 lg:pb-28 lg:pt-20 space-y-16 sm:space-y-20 lg:space-y-28">
        <div className="space-y-10 lg:space-y-14">
          <div className="max-w-full">
            <h2 className="block text-2xl sm:text-3xl lg:text-4xl font-semibold text-center">
            Productos Mitosiz
            </h2>
          </div>
          {/* <hr className="border-slate-200 dark:border-slate-700" /> */}
          <main>
            {/* TABS FILTER */}
            <div className="flex justify-between flex-col xl:flex-row">
              <TabOptionsToBuy />
              <div className="flex gap-2 items-center flex-col xl:flex-row">
                <div className="w-full sm:w-1/2 xl:w-full mt-3 xl:mt-0">
                  <div className="row align-items-center">
                    <div className="col-md-10">
                      <div className="row">
                        <div className="col-12 col-md-6 my-3 mb-lg-0">
                          <fieldset className="block pr-0 py-1 pb-1/5 min-w-min border border-solid border-color-verde-claro rounded-3xl relative xl:h-[40px] xl:p-0">
                            <legend className="clear-float w-auto px-2 py-0 mb-0 ml-4 text-base xl:hidden">
                              <label htmlFor="inpBuscar" className="text-primaryMitosiz font-bold mb-0">Busqueda</label>
                            </legend>
                            <div className="relative top-0 flex h-full">
                              <input type="text" id="inpBuscar" onChange={handleChange}name="inpBuscar" className="w-[94%] m-auto border-none focus:ring-0 focus:border-none placeholder:text-sm pl-[38px] pt-0 xl:pb-0 xl:m-auto" placeholder="¿Qué estás buscando?" />
                              <span className="absolute left-[6%] top-1/2 transform -translate-y-1/2 text-2xl">
                                <svg
                                  className="h-5 w-5"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    d="M11.5 21C16.7467 21 21 16.7467 21 11.5C21 6.25329 16.7467 2 11.5 2C6.25329 2 2 6.25329 2 11.5C2 16.7467 6.25329 21 11.5 21Z"
                                    stroke="#6b7280"
                                    strokeWidth="1.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  />
                                  <path
                                    d="M22 22L20 20"
                                    stroke="#6b7280"
                                    strokeWidth="1.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  />
                                </svg>
                              </span>
                            </div>
                          </fieldset>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="w-full sm:w-fit xl:w-full bg-primaryMitosiz px-4 py-2 my-3 rounded-3xl text-white text-sm">
                  <div className="col-lg-4 text-center xl:text-end">
                    <span className="whitespace-nowrap mr-4">S/. {montoNeto ? montoNeto : "0.00"}</span>
                    <span className="whitespace-nowrap mr-4">P. Reales: {pntosRealesTotal} pts.</span>
                    <span className="whitespace-nowrap ">P. Red: {pntosRedTotal} pts.</span>
                  </div>
                </div>
              </div>
            </div>

            {loading ? ( // Mostrar indicador de carga si está cargando
              <div className="text-center mt-8 flex justify-center">
                <img src={loadingGif} alt="Cargando productos..." />
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-x-8 gap-y-10 mt-8 lg:mt-10">
                {paginatedProducts.map((item: any, index: any) => (
                  <ProductCardService data={item} key={index} />
                ))}
              </div>
            )}

            {/* PAGINATION */}
            <div className="flex flex-row mt-12 lg:mt-16 space-y-5 sm:space-y-0 sm:space-x-3 sm:flex-row justify-center sm:items-center">
              {/* <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
                onPaginationChange={handlePaginationChange}
              /> */}
              <ReactPaginate
              previousLabel={showPrevButton ? (<span className="w-10 h-10 flex items-center justify-center transition-colors bg-[#a59dac] hover:bg-[#625c67] rounded-md text-white"><i className="las la-angle-left"></i></span>) : null}
              nextLabel={showNextButton ? (<span className="w-10 h-10 flex items-center justify-center transition-colors bg-[#a59dac] hover:bg-[#625c67] rounded-md text-white"><i className="las la-angle-right"></i></span>) : null}
              breakLabel={'...'}
              pageCount={totalPages}
              marginPagesDisplayed={1} // Mostrará 1 página antes y 1 página después de la página activa
              pageRangeDisplayed={3} // Mostrará un total de 3 números de página a la vez
              onPageChange={paginateNew}
              containerClassName="flex items-center justify-center mt-8 mb-4 gap-2"
              pageClassName={`custom-link block border border-none hover:bg-[#a764e0] hover:${styles.shadowInner} hover:text-white transition-colors w-10 h-10 flex items-center justify-center rounded-md`}
              activeClassName={`bg-[#a764e0] text-white transition-colors transition duration-300 ${styles.shadowInner}`}></ReactPaginate>
              {/* <ButtonPrimary loading>Show me more</ButtonPrimary> */}
            </div>
          </main>
        </div>

        {/* === SECTION 5 === */}
        {/* <hr className="border-slate-200 dark:border-slate-700" /> */}
        {/*
        <SectionSliderCollections />
        <hr className="border-slate-200 dark:border-slate-700" /> */}

        {/* SUBCRIBES */}
        {/* <SectionPromo1 /> */}
      </div>
      </>
    )}
    </div>
  );
};

export default PageCollection;
