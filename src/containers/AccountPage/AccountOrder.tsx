import Prices from "components/Prices";
import { PRODUCTS } from "data/data";
import ButtonSecondary from "shared/Button/ButtonSecondary";
import { Link } from "react-router-dom";
import ButtonPrimary from "shared/Button/ButtonPrimary";
import Select from "shared/Select/Select";
import { useEffect, useState } from "react";
import ModalProducts from './ModalProducts';
import ModalAddVoucher from './ModalAddVoucher';

import { BEARER_TOKEN } from '../../../src/store/config';

import { format } from 'date-fns';
import { CheckBadgeIcon } from "@heroicons/react/24/solid";

import loadingGif from "../../images/loading.gif"

import axios from 'axios'

import Swal from "sweetalert2";
import ReactPaginate from "react-paginate";

import { useCounterStore } from "store/auth";

import './style-paginate.css'
import styles from './style.module.css'; // Importa los estilos CSS como un objeto
import { Helmet } from "react-helmet-async";
interface StoreForShopping {
  storeId: number;
  storeName: string;
  // Otros campos si los hay
}

interface PaymentMethod {
  typePaymentId: number;
  description: string;
  // Otros campos si los hay
}

const AccountOrder = () => {
  const [loading, setLoading] = useState<boolean>(true); // Estado de carga
  const [orders, setOrders] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [totalPages, setTotalPages] = useState(1); // Estado para almacenar el número total de páginas
  const [totalPagesProducts, setTotalPagesProducts] = useState(1); // Estado para almacenar el número total de páginas
  const [currentPage, setCurrentPage] = useState(1);
  const [currentPageProducts, setCurrentPageProducts] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalAddVoucherOpen, setIsModalAddVoucherOpen] = useState(false);
  const ordersPerPage = 5;
  const productsPerPage = 3;
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [purchaseId, setPurchaseId] = useState(1);
  const [selectPaymentType, setSelectPaymentType] = useState("")
  const [storeForShopping, setStoreForShopping] = useState<StoreForShopping[]>([]);
  const [selectedStoreForShopping, setSelectedStoreForShopping] = useState("0");
  const [selectPurchaseStatus, setSelectPurchaseStatus] = useState("")
  const [isAddPaymentVoucher, setIsAddPaymentVoucher] = useState(false)
  const [isLoading, setIsLoading] = useState(false);
  const [selectedPurchaseId, setSelectedPurchaseId] = useState<number | null>(null);

  const userIdValue = localStorage.getItem("USER_AUTH") ? JSON.parse(localStorage.getItem("USER_AUTH")!).userId : 0;

  const dataIsLoggedIn = useCounterStore((state) => state.dataIsLoggedIn);
  const valor = localStorage.getItem('USER_AUTH') ?? 'valor_por_defecto';
  useEffect(() => {
    // Verificar si el usuario está autenticado, de lo contrario, redirigir al Login
    if (valor === "valor_por_defecto") {
      window.location.href = '/login';
    }
  }, [dataIsLoggedIn]);

  const fetchOrders = async () => {
    setIsLoading(true); // Mostrar estado de carga al iniciar la solicitud
    try {
      const numberStoreId = parseInt(selectedStoreForShopping);
      let url = 'https://api.yosoymitosis.com/v1/Purchase/PurchasesByUser'
      const response = await axios.post(
        url,
        {
          "number": currentPage,
          "size": ordersPerPage,
          "userId": userIdValue,
          "typePayment": selectPaymentType,
          "storeId": numberStoreId,
          "statusPurchase": selectPurchaseStatus
        },
        {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${BEARER_TOKEN}`
          }
        });
      if (response.data.message === "Success") {
        const data = response.data.data;
        setOrders(data.purchasesByUsers);
        setTotalPages(data.totalPages);
        setCurrentPage(data.page);
      } else {
        console.error("Error fetching orders:", response.statusText);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setIsLoading(false); // Ocultar estado de carga al finalizar la solicitud
    }
  };

  useEffect(() => {
    // Simula una carga ficticia
    setTimeout(() => {
      setLoading(false);
    }, 500);

    fetchOrders();

    const fetchPaymentMethods = async () => {
      try {
        const response = await fetch(
          "https://api.yosoymitosis.com/v1/TypePayment/GetTypePayments",
          {
            headers: {
              Authorization: `Bearer ${BEARER_TOKEN}`,
            },
          }
        );
        if (!response.ok) {
          throw new Error("Error al obtener los métodos de pago.");
        }
        const data = await response.json();
        if (!Array.isArray(data.data)) {
          throw new Error("Los datos recibidos no son un array.");
        }
        const formattedData: PaymentMethod[] = data.data.map(
          (method: PaymentMethod) => ({
            typePaymentId: method.typePaymentId,
            description: method.description,
          })
        );
        setPaymentMethods(formattedData);
      } catch (error) {
        console.error(error);
      }
    };

    fetchPaymentMethods();

    const fetchStoreForShopping = async () => {
      try {
        const response = await fetch(
          "https://api.yosoymitosis.com/v1/Store/GetStoresForShopping",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${BEARER_TOKEN}`,
            },
          }
        );
        if (!response.ok) {
          throw new Error("Error al obtener los métodos de pago.");
        }
        const data = await response.json();
        if (!Array.isArray(data.data)) {
          throw new Error("Los datos recibidos no son un array.");
        }
        const formattedData: StoreForShopping[] = data.data.map(
          (method: StoreForShopping) => ({
            storeId: method.storeId,
            storeName: method.storeName,
          })
        );
        setStoreForShopping(formattedData);
      } catch (error) {
        console.error(error);
      }
    };
    fetchStoreForShopping();
  }, [currentPage, ordersPerPage, userIdValue]);

  const fetchDetailPurchase = async (pageNumber: number, selectedOrderId: number) => {
    try {
      const response = await fetch("https://api.yosoymitosis.com/v1/Purchase/DetailPurchasesByPurchase", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${BEARER_TOKEN}`
        },
        body: JSON.stringify({
          number: pageNumber, // Usa el número de página proporcionado
          size: productsPerPage,
          purchaseId: selectedOrderId // Puedes obtener el purchaseId de algún otro lugar
        })
      });

      if (response.ok) {
        const data = await response.json();
        setProducts(data.data.detailPurchaseByPurchases);
        setTotalPagesProducts(data.data.totalPages); // Actualiza el número total de páginas
        setCurrentPageProducts(data.data.page); // Actualiza la página actual
      } else {
        console.error("Error fetching orders:", response.statusText);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  // Función para abrir el modal Ver Productos y establecer la orden seleccionada
  const handleOpenModal = async (id: any) => {
    setIsModalOpen(true);
    fetchDetailPurchase(1, id);
  };

  //Función para eliminar Compra
  const handleDeletePurchase = async (id: any) => {
    Swal.fire({
      title: "¿Estás seguro?",
      text: "¡No podrás revertir esto!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, eliminarlo"
    }).then(async (result) => { // Aquí agregamos async para permitir el uso de await dentro de la función
      if (result.isConfirmed) {
        try {
          let url = 'https://api.yosoymitosis.com/v1/Purchase/DeletePurchase'
          const response = await axios.post(
            url,
            {
              "purchaseId": id,
            },
            {
              headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${BEARER_TOKEN}`
              }
            }
          );
          if (response.data.data === "Ok") {
            fetchOrders();
            Swal.fire({
              title: "¡Eliminado!",
              text: `La compra ${id} ha sido eliminada.`,
              icon: "success"
            });
          } else {
            console.error("Error fetching orders:", response.statusText);
          }
        } catch (error) {
          console.error('Error fetching orders:', error);
        }
      }
    });
  };
  // Función para abrir el modal Añadir Voucher de Pago y establecer la orden seleccionada
  const handleOpenModalAddVoucher = (purchaseId: number) => {
    setSelectedPurchaseId(purchaseId);
    setIsModalAddVoucherOpen(true);
  };

  // Función para cerrar el modal Ver Productos
  const handleCloseModal = () => {
    setIsModalOpen(false);
  };
  // Función para cerrar el modal Añadir Voucher de Pago
  const handleCloseModalAddVoucher = () => {
    setIsModalAddVoucherOpen(false);
  };

  // const paginate = (pageNumber: number) => { console.log("Changing page to:", pageNumber); setCurrentPage(pageNumber); }
  const paginateNew = (datas: any) => { setCurrentPage(datas.selected + 1) }
  const showNextButton = currentPage !== totalPages - 1;
  const showPrevButton = currentPage - 1 !== 0;
  //----------------------------------------------------
  const paginateProducts = (pageNumber: number) => {
    setCurrentPageProducts(pageNumber);
    fetchDetailPurchase(pageNumber, purchaseId);
  };

  // Generar los botones de paginación
  // const renderPaginationButtons = () => {
  //   const buttons = [];
  //   for (let i = 1; i <= totalPages; i++) {
  //     buttons.push(
  //       <button
  //         key={i}
  //         className={`px-4 py-2 rounded-md ${currentPage === i ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'
  //           }`}
  //         onClick={() => paginate(i)}
  //       >
  //         {i}
  //       </button>
  //     );
  //   }
  //   return buttons;
  // };
  const renderPaginationButtonsProducts = () => {
    const buttons = [];
    for (let i = 1; i <= totalPagesProducts; i++) {
      buttons.push(
        <button
          key={i}
          className={`px-4 py-2 rounded-md ${currentPageProducts === i ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'
            }`}
          onClick={() => paginateProducts(i)}
        >
          {i}
        </button>
      );
    }
    return buttons;
  };
  const handleFiltrarClick = () => {
    setCurrentPage(1); // Establecer la página actual a 1 al filtrar
    fetchOrders();
  };
  const handleDownloadImage = async (fileUrl: any, fileName: any) => {
    const link = document.createElement('a');
    link.href = fileUrl;
    link.target = '_blank'; // Abre el enlace en una nueva pestaña
    // Si deseas que se descargue automáticamente en lugar de abrirse en una nueva pestaña,
    // puedes omitir la siguiente línea de código que establece el atributo 'download'
    link.download = fileName || 'file';
  
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const renderOrder = (order: any) => {
    const formatDate = (dateString: any) => {
      const date = new Date(dateString);
      return format(date, 'MMM dd, yyyy');
    };
    return (
      <div key={order.orderId} className="border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden z-0 mb-8">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center p-4 sm:p-8 bg-slate-50 dark:bg-slate-500/5">
          <div className="flex flex-col items-center sm:block sm:w-7/12">
            {/* <p className="text-lg font-semibold">{order.orderId}</p> */}
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-1.5 sm:mt-2">
              <span><strong>Numero de órden:</strong> {order.purchaseId} - {order.statusPurchase}</span>
            </p>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-1.5 sm:mt-2">
              <span><strong>Fecha de compra:</strong> {formatDate(order.creationTime)}</span>
            </p>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-1.5 sm:mt-2">
              <span><strong>Mayorista:</strong> {order.storeName}</span>
            </p>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-1.5 sm:mt-2">
              <span><strong>Tipo de Compra:</strong> {order.typePurchase}</span>
            </p>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-1.5 sm:mt-2">
              <span><strong>Medio de Pago:</strong> {order.typePayment}</span>
            </p>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-1.5 sm:mt-2">
              <span><strong>Comprobante:</strong> {order.typeDocumentReceipt}</span>
            </p>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-1.5 sm:mt-2">
              <span><strong>Documento:</strong> {order.receipt}</span>
            </p>
          </div>
          <div className="mt-3 sm:mt-0 flex flex-col gap-5 items-center sm:items-end">
            <div className="flex gap-4 items-center">
              <span className="text-green-500"><strong>Monto Total Neto:</strong> </span>
              <Prices price={order.netAmount} className="mt-0.5 ml-2" />
            </div>
            <div className="flex">
              <span className="font-medium text-indigo-600 dark:text-primary-500 ">
                <strong>Puntos Reales:</strong> {order.realPoints} pts.
              </span>
            </div>
            <div className="flex">
              <span className="font-medium text-indigo-600 dark:text-primary-500 ">
                <strong>Puntos de Red:</strong> {order.promotionPoints} pts.
              </span>
            </div>
            <div className="flex gap-4">
              {
                order.typePayment === "Depósito" ?
                  (
                    order.statusPurchase.toLowerCase() !== "pendiente" ?
                      <ButtonSecondary
                        sizeClass="py-2.5 px-4 sm:px-6"
                        fontSize="text-sm font-medium whitespace-nowrap"
                        onClick={()=>handleDownloadImage(`https://api.yosoymitosis.com/StaticFiles/PaymentImg/${order.imageUrl}`,order.imageUrl)}
                      >
                        Descargar Voucher
                      </ButtonSecondary>
                      :
                      <ButtonSecondary
                        sizeClass="py-2.5 px-4 sm:px-6"
                        fontSize="text-sm font-medium whitespace-nowrap"
                        onClick={() => handleOpenModalAddVoucher(order.purchaseId)}
                      >
                        Adjuntar Pago
                      </ButtonSecondary>
                  )
                  : null
              }
              <ButtonSecondary
                sizeClass="py-2.5 px-4 sm:px-6 w-full"
                fontSize="text-sm font-medium whitespace-nowrap"
                onClick={() => { handleOpenModal(order.purchaseId); setPurchaseId(order.purchaseId) }}
              >
                Ver Productos
              </ButtonSecondary>

            </div>
          </div>
        </div>
        {
          order.statusPurchase === "Evaluación" || order.statusPurchase === "Realizada"
            ?
            null
            :
            <div className="flex justify-center w-full bg-slate-50 py-4">
              <ButtonSecondary
                sizeClass="py-2.5 px-4 sm:px-6 border border-none bg-red-200 text-red-600 hover:bg-red-400 hover:text-white"
                fontSize="text-sm font-medium"
                onClick={() => { handleDeletePurchase(order.purchaseId) }}
              >
                Eliminar Compra
              </ButtonSecondary>
            </div>
        }
      </div>
    );
  };
  return (
    <div>
      {loading ? (
        <div className="flex justify-center items-center h-screen">
          <img src={loadingGif} alt="Cargando..." className="w-32 h-16" />
        </div>
      ) : (
        <div className="max-w-4xl mx-auto pt-14 sm:pt-26 pb-24 lg:pb-32">
        <Helmet>
          <title>Mis Compras</title>
        </Helmet>
          <div className="px-4 space-y-10 sm:space-y-12">
            <h2 className="text-2xl sm:text-3xl text-center font-semibold">
              Mis Compras
            </h2>
            <div className="w-full flex flex-col md:flex-row items-center md:justify-center md:items-end gap-4 gap-x-16">
              <div className="max-w-[180px]">
                <h6 className="mb-2">Medio de pago:</h6>
                <Select
                  className="h-[44px] border-neutral-400"
                  value={selectPaymentType}
                  onChange={(e) => setSelectPaymentType(e.target.value)}
                >
                  <option value="">Seleccione:</option>
                  {paymentMethods &&
                    paymentMethods.map((method) => (
                      <option
                        key={method.typePaymentId}
                        value={method.description} // Utilizar el texto como valor
                      >
                        {method.description}
                      </option>
                    ))}
                </Select>
              </div>
              <div className="max-w-[180px] hidden">
                <h6 className="mb-2">Mayorista:</h6>
                <Select
                  className="h-[44px] border-neutral-400"
                  value={selectedStoreForShopping}
                  onChange={(e) => setSelectedStoreForShopping(e.target.value)}
                >paymentMethods
                  <option value="0">Seleccione:</option>
                  {storeForShopping &&
                    storeForShopping.map((method) => (
                      <option
                        key={method.storeId}
                        value={method.storeId} // Utilizar el texto como valor
                      >
                        {method.storeName}
                      </option>
                    ))}
                </Select>
              </div>
              <div className="max-w-[180px]">
                <h6 className="mb-2">Estado de compra:</h6>
                <Select
                  className="w-full h-[44px] border-neutral-400"
                  value={selectPurchaseStatus}
                  onChange={(e) => setSelectPurchaseStatus(e.target.value)}
                >
                  <option value="">Seleccionar:</option>
                  <option value="Pendiente">Pendiente</option>
                  <option value="Realizada">Realizada</option>
                  <option value="Evaluación">Evaluación</option>
                </Select>
              </div>
              <div className="mt-4">
                <ButtonPrimary
                  disabled={false}
                  className="w-[140px] h-[42px] rounded-lg"
                  onClick={handleFiltrarClick}
                  from="carritoCompras"
                >
                  Filtrar
                </ButtonPrimary>
              </div>
            </div>
            <div>
              {isLoading ? (
                <div className="text-center text-xl font-bold h-20 flex items-end justify-center">
                  <img src={loadingGif} alt="Cargando productos..." />
                </div>
              ) : (
                orders.length === 0 ?
                  <div className="text-center text-xl font-bold text-red-500 h-20 flex items-end justify-center">
                    ¡Oops! No se encontraron compras.
                  </div>
                  :
                  <div>
                    {orders.map((order, index) => (
                      <div key={index} className="my-8">
                        {renderOrder(order)}
                      </div>
                    ))}
                  </div>
              )}
            </div>
            {/* PAGINATION */}
            {/* {totalPages > 1 && (
              <div className="flex justify-center mt-8 gap-2 flex-wrap">
                {renderPaginationButtons()}
              </div>
            )} */}
            <ReactPaginate
              previousLabel={showPrevButton ? (<span className="w-10 h-10 flex items-center justify-center transition-colors bg-[#a59dac] hover:bg-[#625c67] rounded-md text-white"><i className="las la-angle-left"></i></span>) : null}
              nextLabel={showNextButton&&totalPages!==1 ? (<span className="w-10 h-10 flex items-center justify-center transition-colors bg-[#a59dac] hover:bg-[#625c67] rounded-md text-white"><i className="las la-angle-right"></i></span>) : null}
              breakLabel={'...'}
              pageCount={totalPages - 1}
              marginPagesDisplayed={1} // Mostrará 1 página antes y 1 página después de la página activa
              pageRangeDisplayed={3} // Mostrará un total de 3 números de página a la vez
              onPageChange={paginateNew}
              containerClassName="flex items-center justify-center mt-8 mb-4 gap-2"
              pageClassName={`custom-link block border border-none hover:bg-[#a764e0] hover:${styles.shadowInner} hover:text-white transition-colors w-10 h-10 flex items-center justify-center rounded-md`}
              activeClassName={`bg-[#a764e0] text-white transition-colors transition duration-300 ${styles.shadowInner}`}></ReactPaginate>
          </div>
          {isModalOpen && (
            <ModalProducts
              selectedOrder={products}
              handleCloseModal={handleCloseModal}
              totalPagesProducts={totalPagesProducts}
              renderPaginationButtonsProducts={renderPaginationButtonsProducts}
            />
          )}
          {isModalAddVoucherOpen && (
            <ModalAddVoucher
              handleCloseModalAddVoucher={handleCloseModalAddVoucher}
              selectedPurchaseId={selectedPurchaseId}
              fetchOrders={fetchOrders}
            />
          )}
        </div>
      )
      }
    </div>
  );
};

export default AccountOrder;
