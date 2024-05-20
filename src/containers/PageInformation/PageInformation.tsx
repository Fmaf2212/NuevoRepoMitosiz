import ReactPaginate from "react-paginate";
import downloadImg from "../../images/downloadImg.png";
import FileIcon from "components/FileIcon";
import { useEffect, useState } from "react";

import { BEARER_TOKEN } from "../../../src/store/config";
import styles from "../AccountPage/style.module.css";
import { Helmet } from "react-helmet-async";

const data = [
  {
    fileName: "Rótulo de cajas - Datos del despacho.jpg",
    date: "21/03/2024",
    filePath: "/ruta/al/archivo1",
  },
  {
    fileName: "Rótulo de cajas - Datos del despacho.pdf",
    date: "21/03/2024",
    filePath: "/ruta/al/archivo2",
  },
  {
    fileName: "Rótulo de cajas - Datos del despacho.png",
    date: "21/03/2024",
    filePath: "/ruta/al/archivo2",
  },
  {
    fileName: "Rótulo de cajas - Datos del despacho.docx",
    date: "21/03/2024",
    filePath: "/ruta/al/archivo2",
  },
  {
    fileName: "Rótulo de cajas - Datos del despacho.ppt",
    date: "21/03/2024",
    filePath: "/ruta/al/archivo2",
  },
  {
    fileName: "Rótulo de cajas - Datos del despacho.mp4",
    date: "21/03/2024",
    filePath: "/ruta/al/archivo2",
  },
  {
    fileName: "Rótulo de cajas - Datos del despacho.jpg",
    date: "21/03/2024",
    filePath: "/ruta/al/archivo1",
  },
  {
    fileName: "Rótulo de cajas - Datos del despacho.pdf",
    date: "21/03/2024",
    filePath: "/ruta/al/archivo2",
  },
  {
    fileName: "Rótulo de cajas - Datos del despacho.png",
    date: "21/03/2024",
    filePath: "/ruta/al/archivo2",
  },
  {
    fileName: "Rótulo de cajas - Datos del despacho.docx",
    date: "21/03/2024",
    filePath: "/ruta/al/archivo2",
  },
  {
    fileName: "Rótulo de cajas - Datos del despacho.ppt",
    date: "21/03/2024",
    filePath: "/ruta/al/archivo2",
  },
  {
    fileName: "Rótulo de cajas - Datos del despacho.mp4",
    date: "21/03/2024",
    filePath: "/ruta/al/archivo2",
  },
  {
    fileName: "Rótulo de cajas - Datos del despacho.jpg",
    date: "21/03/2024",
    filePath: "/ruta/al/archivo1",
  },
  {
    fileName: "Rótulo de cajas - Datos del despacho.pdf",
    date: "21/03/2024",
    filePath: "/ruta/al/archivo2",
  },
  {
    fileName: "Rótulo de cajas - Datos del despacho.png",
    date: "21/03/2024",
    filePath: "/ruta/al/archivo2",
  },
  {
    fileName: "Rótulo de cajas - Datos del despacho.docx",
    date: "21/03/2024",
    filePath: "/ruta/al/archivo2",
  },
  {
    fileName: "Rótulo de cajas - Datos del despacho.ppt",
    date: "21/03/2024",
    filePath: "/ruta/al/archivo2",
  },
  {
    fileName: "Rótulo de cajas - Datos del despacho.mp4",
    date: "21/03/2024",
    filePath: "/ruta/al/archivo2",
  },
  {
    fileName: "Rótulo de cajas - Datos del despacho.jpg",
    date: "21/03/2024",
    filePath: "/ruta/al/archivo1",
  },
  {
    fileName: "Rótulo de cajas - Datos del despacho.pdf",
    date: "21/03/2024",
    filePath: "/ruta/al/archivo2",
  },
  {
    fileName: "Rótulo de cajas - Datos del despacho.png",
    date: "21/03/2024",
    filePath: "/ruta/al/archivo2",
  },
  {
    fileName: "Rótulo de cajas - Datos del despacho.docx",
    date: "21/03/2024",
    filePath: "/ruta/al/archivo2",
  },
  {
    fileName: "Rótulo de cajas - Datos del despacho.ppt",
    date: "21/03/2024",
    filePath: "/ruta/al/archivo2",
  },
  {
    fileName: "Rótulo de cajas - Datos del despacho.mp4",
    date: "21/03/2024",
    filePath: "/ruta/al/archivo2",
  },
];

const PageInformation = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [totalPages, setTotalPages] = useState(1); // Estado para almacenar el número total de páginas
  const [currentPage, setCurrentPage] = useState(1);

  const ordersPerPage = 3

  const division = data.length / ordersPerPage;

  const firstEightElements = data.slice(0, division);

  const [activeTab, setActiveTab] = useState('Documentos'); // Inicialmente seleccionado

  const handleTabClick = (tabName: any) => {
    setActiveTab(tabName);
  };

  const fetchDetailPurchase = async () => {
    try {
      // const response = await fetch("https://api.yosoymitosis.com/v1/Purchase/DetailPurchasesByPurchase", {
      //   method: "POST",
      //   headers: {
      //     "Content-Type": "application/json",
      //     "Authorization": `Bearer ${BEARER_TOKEN}`
      //   },
      //   body: JSON.stringify({
      //     number: pageNumber, // Usa el número de página proporcionado
      //     size: productsPerPage,
      //     purchaseId: selectedOrderId // Puedes obtener el purchaseId de algún otro lugar
      //   })
      // });

      // if (response.ok) {
      //   const data = await response.json();
      setOrders(firstEightElements);
      setTotalPages(division);
      console.log(currentPage);
      //   //setCurrentPageProducts(data.data.page); // Actualiza la página actual
      // } else {
      //   console.error("Error fetching orders:", response.statusText);
      // }
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };
  useEffect(() => {
    fetchDetailPurchase();
  }, [currentPage, ordersPerPage]);

  const paginateNew = (data: any) => {
    setCurrentPage(data.selected + 1);
  };
  const showNextButton = currentPage !== totalPages - 1;
  const showPrevButton = currentPage - 1 !== 0;

  return (
    <div className="flex flex-col">
      <Helmet>
        <title>Información</title>
      </Helmet>
      <div className="flex flex-col justify-center border-b border-[#d1d5db] pt-6">
        <h2 className="text-2xl sm:text-3xl text-center font-semibold">
          Información
        </h2>
        <div className="container flex justify-center items-center h-20">
          ACA VAN FILTROS COMO POR FECHAS
        </div>
      </div>
      <div className="flex flex-col sm:flex-row">
        <div className="flex justify-center sm:justify-start flex-grow-0 flex-shrink-0 flex-[260px] overflow-auto h-[500px] pt-2 pr-4 pb-8 pl-4 border-r border-gray-300 bg-white">
          <section className="text-start w-full">
            <header className="py-2 px-0 mb-2">
              <i className="las la-folder mr-2"></i>
              <b className="font-medium">Espacio de trabajo</b>
            </header>
            <ul className="space-y-3">
              <li className="cursor-pointer"  onClick={() => handleTabClick('Documentos')}>
                <header
                  className={`flex items-center justify-between px-6 py-2 ${
                    activeTab === 'Documentos' ? 'bg-[#cfb9e3]' : ''
                  }`}
                >
                  <label className="cursor-pointer">
                    <div></div>
                    <b className="text-blue-900 font-medium w-full inline-block max-w-full whitespace-nowrap overflow-hidden overflow-ellipsis align-top">
                      Documentos
                    </b>
                  </label>
                </header>
              </li>
              <li className="cursor-pointer"  onClick={() => handleTabClick('Promociones')}>
                <header
                  className={`flex items-center justify-between px-6 py-2 ${
                    activeTab === 'Promociones' ? 'bg-[#cfb9e3]' : ''
                  }`}
                >
                  <label className="cursor-pointer">
                    <div></div>
                    <b className="text-blue-900 font-medium w-full inline-block max-w-full whitespace-nowrap overflow-hidden overflow-ellipsis align-top">
                      Promociones
                    </b>
                  </label>
                </header>
              </li>
              <li className="cursor-pointer"  onClick={() => handleTabClick('Premios')}>
                <header
                  className={`flex items-center justify-between px-6 py-2 ${
                    activeTab === 'Premios' ? 'bg-[#cfb9e3]' : ''
                  }`}
                >
                  <label className="cursor-pointer">
                    <div></div>
                    <b className="text-blue-900 font-medium w-full inline-block max-w-full whitespace-nowrap overflow-hidden overflow-ellipsis align-top">
                      Premios
                    </b>
                  </label>
                </header>
              </li>
              <li className="cursor-pointer" onClick={() => handleTabClick('Materiales')}>
                <header
                  className={`flex items-center justify-between px-6 py-2 ${
                    activeTab === 'Materiales' ? 'bg-[#cfb9e3]' : ''
                  }`}
                >
                  <label className="cursor-pointer">
                    <div></div>
                    <b className="text-blue-900 font-medium w-full inline-block max-w-full whitespace-nowrap overflow-hidden overflow-ellipsis align-top">
                      Materiales
                    </b>
                  </label>
                </header>
              </li>
            </ul>
          </section>
        </div>
        <div className="bg-[#f6f7fa] overflow-auto flex-row flex-wrap justify-start items-start p-2 flex-shrink-[1] flex-grow-[1] basis-full flex relative h-auto">
          <div className="w-fit h-auto sm:px-8 pt-6 pb-4 sm:pb-0 flex flex-col mx-auto sm:inline-block">
            {orders.map((item, index) => (
              <div
                key={index}
                className="flex-auto max-w-[360px] h-auto px-0 py-0 mx-2 my-1 border border-gray-300 bg-white cursor-pointer select-none relative inline-block w-[340px] transition-all duration-300 ease-in-out transform hover:shadow-lg hover:-translate-y-1 mb-2"
                style={{ direction: "ltr" }}
              >
                <div className="flex text-[#9DA1AA] absolute top-auto left-auto bottom-1.5 right-1.5 text-base">
                  {/* <img
                    src={downloadImg}
                    alt=""
                    width={30}
                    className="transition-transform duration-300 ease-in-out transform hover:scale-110"
                  /> */}
                  <i className="las la-file-download transition-transform duration-300 ease-in-out transform hover:scale-110 text-3xl invert-[50%] hover:invert"></i>
                </div>
                <div className="w-20 float-left">
                  <div className="bg-[#9333ea] border-b border-[#9DA1AA] h-full min-h-[80px] flex justify-center items-center">
                    <FileIcon
                      fileType={item.fileName.split(".").pop()}
                      width={48}
                    />
                  </div>
                </div>
                <div className="pl-[88px]">
                  <div className="p-2 flex flex-col min-h-[80px] h-full justify-between">
                    <div className="w-full mb-0 text-ellipsis whitespace-nowrap overflow-hidden text-[#091124] text-[13px] font-medium break-words leading-[1.2]">
                      <span>{item.fileName}</span>
                    </div>
                    <div className="flex flex-wrap">
                      <div className="flex flex-auto items-center min-h-[20px]">
                        <span className="mr-1.5 leading-none">{item.date}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-center w-full">
            <ReactPaginate
              previousLabel={
                showPrevButton ? (
                  <span className="w-10 h-10 flex items-center justify-center transition-colors bg-[#a59dac] hover:bg-[#625c67] rounded-md text-white">
                    <i className="las la-angle-left"></i>
                  </span>
                ) : null
              }
              nextLabel={
                showNextButton ? (
                  <span className="w-10 h-10 flex items-center justify-center transition-colors bg-[#a59dac] hover:bg-[#625c67] rounded-md text-white">
                    <i className="las la-angle-right"></i>
                  </span>
                ) : null
              }
              breakLabel={"..."}
              pageCount={Math.ceil(totalPages) - 1}
              marginPagesDisplayed={0.5} // Mostrará 1 página antes y 1 página después de la página activa
              pageRangeDisplayed={3} // Mostrará un total de 3 números de página a la vez
              onPageChange={paginateNew}
              containerClassName="flex items-center justify-center mb-4 gap-2 mt-4 sm:mt-0"
              pageClassName={`custom-link block border border-none hover:bg-[#a764e0] hover:${styles.shadowInner} hover:text-white transition-colors w-10 h-10 flex items-center justify-center rounded-md`}
              activeClassName={`bg-[#a764e0] text-white transition-colors transition duration-300 ${styles.shadowInner}`}
            ></ReactPaginate>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PageInformation;
