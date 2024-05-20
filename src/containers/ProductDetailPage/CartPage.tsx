import NcInputNumber from "components/NcInputNumber";
import Prices from "components/Prices";
// import { Product, PRODUCTS } from "data/data";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import ButtonPrimary from "shared/Button/ButtonPrimary";
import { useStore } from "../../store/cart";
import { useEffect, useState } from "react";

import Select from "shared/Select/Select";
import Input from "shared/Input/Input";
import axios from "axios";

import { BEARER_TOKEN } from "../../../src/store/config";

import Swal from "sweetalert2";

import { useCounterStore } from "store/auth";

interface Product {
  productId: number;
  Nombre: string;
  quantity: number;
  price: number;
  subtotalGrossAmount: number;
  img: string;
  subtotalNetAmount: number;
  subtotalPoints: number;
  subtotalPointsNetwork: number;
}
interface Purchase {
  grossAmount: number;
  netAmount: number;
  promotionPoints: number;
  realPoints: number;
  subtotalGrossAmount: number;
  quantityTot: number;
}

interface PaymentMethod {
  typePaymentId: number;
  description: string;
  // Otros campos si los hay
}

const CartPage = () => {
  const { purchaseData, setPurchaseData, purchaseSuccess } = useCounterStore();
  // const carritoString = localStorage.getItem("purchaseData");
  // const carrito = purchaseData;
  const [purchaseDetailState, setPurchaseDetailState] = useState(purchaseData!==null ? purchaseData.purchaseDetail : []);
  const { updateCartItemCount } = useStore();

  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);

  // const montoBruto = carrito.grossAmount || "0.00";
  const pntosRealesTotal = purchaseData.realPoints || "0";
  const pntosRedTotal = purchaseData.promotionPoints || "0";
  const montoNeto = purchaseData.netAmount;

  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("");
  const [selectedDocumentType, setSelectedDocumentType] = useState("");
  const [tipoComprobante, setTipoComprobante] = useState("");
  const [numeroDNI, setNumeroDNI] = useState("");
  const [numeroRUC, setNumeroRUC] = useState("");
  const [botonDesactivado, setBotonDesactivado] = useState(false);

  const updateCart = (updatedCart: Product[]) => {
    const nuevoMontoTotal = updatedCart.reduce(
      (total, producto) => total + producto.subtotalGrossAmount,
      0
    );
    const nuevoPntsRealesTotal = updatedCart.reduce(
      (pnts, producto) => pnts + producto.subtotalNetAmount,
      0
    );
    const nuevoPntsRedTotal = updatedCart.reduce(
      (pnts, producto) => pnts + producto.subtotalPointsNetwork,
      0
    );
    const quantity = updatedCart.reduce(
      (quantity, producto) => quantity + producto.quantity,
      0
    );
    const realPoints = updatedCart.reduce(
      (pnts, producto) => pnts + producto.subtotalPoints,
      0
    );

    const valueTypeDocumentReceipt = JSON.parse(localStorage.getItem("purchaseData")!).typeDocumentReceipt;
    const valueTypePayment = JSON.parse(localStorage.getItem("purchaseData")!).typePayment;
    const valueReceipt = JSON.parse(localStorage.getItem("purchaseData")!).receipt;
    const valueDocumentReceipt = JSON.parse(localStorage.getItem("purchaseData")!).documentReceipt;
    const nameTypePurchase = JSON.parse(localStorage.getItem("TypePurchase")!).nameTypePurchase;
    const valueStoreId = JSON.parse(localStorage.getItem("StoresForShopping")!).storeId;

    updateCartItemCount(updatedCart.length);

    // Actualiza el objeto carrito con los cambios
    const nuevoCarrito = {
      ...purchaseData,
      grossAmount: nuevoMontoTotal,
      netAmount: parseFloat(nuevoPntsRealesTotal.toFixed(2)),
      promotionPoints: nuevoPntsRedTotal,
      purchaseDetail: updatedCart,
      quantity: quantity,
      realPoints: realPoints,
      typeDocumentReceipt: valueTypeDocumentReceipt,
      typePayment: valueTypePayment,
      receipt: valueReceipt,
      documentReceipt: valueDocumentReceipt,
      typePurchase: nameTypePurchase,
      storeId: valueStoreId
    };

    localStorage.setItem("purchaseData", JSON.stringify(nuevoCarrito));
    setPurchaseDetailState(updatedCart);
    setPurchaseData({ ...purchaseData, ...nuevoCarrito });
  };

  const removeFromCart = (index: number) => {
    // Obtén el carrito actual del localStorage
    //const carritoExistenteRaw = localStorage.getItem("purchaseData");
    const carritoExistente = purchaseData

    // Copia la lista de productos del carrito actual
    const updatedCart = [...carritoExistente.purchaseDetail];

    // Elimina el producto en la posición 'index'
    updatedCart.splice(index, 1);

    // Calcula los nuevos totales
    const nuevoMontoTotal = updatedCart.reduce(
      (total, producto) => total + producto.subtotalGrossAmount,
      0
    );
    const nuevoPntsRealesTotal = updatedCart.reduce(
      (pnts, producto) => pnts + producto.subtotalNetAmount,
      0
    );

    // Actualiza el estado global y el localStorage con el nuevo carrito y los nuevos totales
    updateCartItemCount(updatedCart.length);

    // Actualiza el objeto carritoExistente con los cambios
    carritoExistente.purchaseDetail = updatedCart;
    carritoExistente.grossAmount = nuevoMontoTotal;
    carritoExistente.netAmount = nuevoPntsRealesTotal;

    // Actualiza los otros campos según tus necesidades
    carritoExistente.promotionPoints = updatedCart.reduce(
      (points, producto) => points + producto.subtotalPointsNetwork,
      0
    );
    carritoExistente.quantity = updatedCart.reduce(
      (quantity, producto) => quantity + producto.quantity,
      0
    );
    carritoExistente.realPoints = updatedCart.reduce(
      (points, producto) => points + producto.subtotalPoints,
      0
    );

    // Actualiza el carritoLength
    const cantidadProductosEnCarrito = updatedCart.length;
    localStorage.setItem(
      "carritoLength",
      cantidadProductosEnCarrito.toString()
    );

    // Actualiza el localStorage con el carrito modificado
    localStorage.setItem("purchaseData", JSON.stringify(carritoExistente));
    setPurchaseData({ ...purchaseData, ...carritoExistente });
    setPurchaseDetailState(updatedCart);
  };

  const typePurchase = localStorage.getItem("TypePurchase");
  const USER_AUTH = localStorage.getItem("USER_AUTH");
  const StoresForShopping = localStorage.getItem("StoresForShopping");

  const actualizarCarritoIncrement = async (
    productId: number,
    newValue: number,
    price: number
  ) => {
    const typePurchaseId = typePurchase
      ? JSON.parse(typePurchase).typePurchaseId
      : 0;
    const userId = USER_AUTH ? JSON.parse(USER_AUTH).userId : 0;
    const storeId = StoresForShopping && JSON.parse(StoresForShopping).storeId;
    const requestData = {
      productId: productId,
      storeId: storeId,
      userId: userId,
      typePurchaseId: typePurchaseId,
      quantity: newValue,
    };
    const bearerToken =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjoibWl0b3NpekFwaSIsInBhc3N3b3JkIjoiQG1pdG9zaXo5NiIsImF1ZCI6IkZyb250TWl0b3NpeiJ9.PjRxNwguwkC6I_Qtlo6XLy1686QFyU5L2QroleKQAX0";
    try {
      const response = await fetch(
        "https://api.yosoymitosis.com/v1/StoreInventory/GetStockForProductAndStore",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${bearerToken}`,
          },
          body: JSON.stringify(requestData),
        }
      );
      if (!response.ok) {
        throw new Error("No se pudo completar la solicitud.");
      }
      const responseData = await response.json();
      const discountClient = responseData.data.discountClient;
      const productStore = responseData.data.productStore;

      setPurchaseDetailState((prevCarrito: Product[]) => {
        const encontradoIndex = prevCarrito.findIndex(
          (item) => item.productId === productId
        );
        if (encontradoIndex !== -1) {
          const productoEncontrado = prevCarrito[encontradoIndex];
          productoEncontrado.quantity = newValue;
          productoEncontrado.subtotalGrossAmount = newValue * productStore.price;
          productoEncontrado.subtotalNetAmount =
            newValue * productStore.price * (1 - discountClient);
          productoEncontrado.subtotalPoints =
            newValue * productStore.activationPoints;
          productoEncontrado.subtotalPointsNetwork =
            newValue * productStore.networkPoints;
          updateCart(prevCarrito);
        }
        return prevCarrito;
      });
      return responseData;
    } catch (error) {
      console.error("Error al realizar la solicitud:", error);
      throw error;
    }
  };

  const actualizarCarritoDecrement = async (
    productId: number,
    newValue: number,
    price: number
  ) => {
    const typePurchaseId = typePurchase
      ? JSON.parse(typePurchase).typePurchaseId
      : 0;
    const userId = USER_AUTH ? JSON.parse(USER_AUTH).userId : 0;
    const storeId = StoresForShopping && JSON.parse(StoresForShopping).storeId;

    const requestData = {
      productId: productId,
      storeId: storeId,
      userId: userId,
      typePurchaseId: typePurchaseId,
      quantity: newValue,
    };
    try {
      const response = await fetch(
        "https://api.yosoymitosis.com/v1/StoreInventory/GetStockForProductAndStore",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${BEARER_TOKEN}`,
          },
          body: JSON.stringify(requestData),
        }
      );
      if (!response.ok) {
        throw new Error("No se pudo completar la solicitud.");
      }
      const responseData = await response.json();
      const discountClient = responseData.data.discountClient;
      const productStore = responseData.data.productStore;
      setPurchaseDetailState((prevCarrito: Product[]) => {
        const encontradoIndex = prevCarrito.findIndex(
          (item) => item.productId === productId
        );
        if (encontradoIndex !== -1) {
          const productoEncontrado = prevCarrito[encontradoIndex];
          productoEncontrado.quantity = newValue;
          productoEncontrado.subtotalGrossAmount = newValue * productStore.price;
          productoEncontrado.subtotalNetAmount =
            newValue * productStore.price * (1 - discountClient);
          productoEncontrado.subtotalPoints =
            newValue * productStore.activationPoints;
          productoEncontrado.subtotalPointsNetwork =
            newValue * productStore.networkPoints;
          updateCart(prevCarrito);
        }
        return prevCarrito;
      });
      return responseData;
    } catch (error) {
      console.error("Error al realizar la solicitud:", error);
      throw error;
    }
  };

  useEffect(() => {
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
    const existingPurchaseData = localStorage.getItem("purchaseData");
    if (existingPurchaseData) {
      const parsedPurchaseData = JSON.parse(existingPurchaseData);
      setSelectedPaymentMethod(parsedPurchaseData.typePayment || "");
      setSelectedDocumentType(parsedPurchaseData.typeDocumentReceipt || "");
      setTipoComprobante(
        parsedPurchaseData.typeDocumentReceipt === "Boleta"
          ? "1"
          : parsedPurchaseData.typeDocumentReceipt === "Factura"
          ? "2"
          : ""
      );
      // Verifica si hay un valor en "receipt"
      if (parsedPurchaseData.receipt) {
        // Si hay un valor, asigna el valor al estado o variable correspondiente
        setNumeroDNI(parsedPurchaseData.receipt);
        setNumeroRUC(parsedPurchaseData.receipt);
      }
    }
  }, []);

  const handlePaymentMethodChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const selectedOption = e.target.selectedOptions[0];
    const selectedText = selectedOption ? selectedOption.textContent : null;

    let updatedSelectedText =
      selectedText !== "Seleccione:" && selectedText !== null
        ? selectedText
        : "";

    setSelectedPaymentMethod((prevState) =>
      updatedSelectedText !== null ? updatedSelectedText : prevState
    );

    // Obtener el objeto purchaseData del localStorage
    const existingPurchaseData = localStorage.getItem("purchaseData");
    if (existingPurchaseData) {
      // Parsear el objeto purchaseData
      const parsedPurchaseData = JSON.parse(existingPurchaseData);

      // Actualizar el valor de typePayment con el texto seleccionado del Select
      parsedPurchaseData.typePayment = updatedSelectedText;

      // Guardar el objeto actualizado en localStorage
      localStorage.setItem("purchaseData", JSON.stringify(parsedPurchaseData));
    }
  };

  const handleDocumentTypeChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const selectedOption = e.target.selectedOptions[0];
    const selectedText = selectedOption ? selectedOption.textContent : null;
    const updatedSelectedText =
      selectedText !== "Seleccione:" && selectedText !== null
        ? selectedText
        : "";

    setSelectedDocumentType((prevState) =>
      updatedSelectedText !== null ? updatedSelectedText : prevState
    );

    // Actualizar el tipo de comprobante
    setTipoComprobante(
      updatedSelectedText === "Boleta"
        ? "1"
        : updatedSelectedText === "Factura"
        ? "2"
        : ""
    );

    setNumeroDNI(""); // Limpiar el valor de número de DNI
    setNumeroRUC(""); // Limpiar el valor de número de RUC

    // Obtener el objeto purchaseData del localStorage
    const existingPurchaseData = localStorage.getItem("purchaseData");
    if (existingPurchaseData) {
      // Parsear el objeto purchaseData
      const parsedPurchaseData = JSON.parse(existingPurchaseData);

      // Actualizar el valor de typeDocumentReceipt con el texto seleccionado del Select
      parsedPurchaseData.typeDocumentReceipt = updatedSelectedText;

      parsedPurchaseData.receipt = ""; // Limpiar el valor de receipt

      // Actualizar el valor de documentReceipt según la opción seleccionada
      parsedPurchaseData.documentReceipt =
        updatedSelectedText === "Boleta"
          ? "DNI"
          : updatedSelectedText === "Factura"
          ? "RUC"
          : "";

      // Guardar el objeto actualizado en localStorage
      localStorage.setItem("purchaseData", JSON.stringify(parsedPurchaseData));
    }
  };

  const handleNumeroDNIChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setNumeroDNI(value);

    // Actualizar el valor de receipt en purchaseData si el tipo de comprobante es Boleta
    const existingPurchaseData = localStorage.getItem("purchaseData");
    if (existingPurchaseData) {
      const parsedPurchaseData = JSON.parse(existingPurchaseData);
      if (parsedPurchaseData.typeDocumentReceipt === "Boleta") {
        parsedPurchaseData.receipt = value;
        localStorage.setItem(
          "purchaseData",
          JSON.stringify(parsedPurchaseData)
        );
      }
    }
  };

  const handleNumeroRUCChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setNumeroRUC(value);

    // Actualizar el valor de receipt en purchaseData si el tipo de comprobante es Factura
    const existingPurchaseData = localStorage.getItem("purchaseData");
    if (existingPurchaseData) {
      const parsedPurchaseData = JSON.parse(existingPurchaseData);
      if (parsedPurchaseData.typeDocumentReceipt === "Factura") {
        parsedPurchaseData.receipt = value;
        localStorage.setItem(
          "purchaseData",
          JSON.stringify(parsedPurchaseData)
        );
      }
    }
  };

  const handleComprarClick = async () => {
    // Obtener la información de purchaseData del localStorage
    const existingPurchaseData = localStorage.getItem("purchaseData");
    const existingUSER_AUTH = !!localStorage.getItem("USER_AUTH");
    if (existingPurchaseData) {
      try {
        const parsedPurchaseData = JSON.parse(existingPurchaseData);

        if (existingUSER_AUTH === false) {
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Debe loguearse.",
          });
          return;
        }
        if (parsedPurchaseData.typePayment === "") {
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Debe seleccionar un Medio de pago.",
          });
          return;
        }

        if (parsedPurchaseData.typeDocumentReceipt === "") {
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Debe seleccionar el tipo de comprobante.",
          });
          return;
        }

        if (parsedPurchaseData.typeDocumentReceipt === "Boleta" &&
          parsedPurchaseData.receipt === "") {
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Ingrese su número de DNI.",
          });
          return;
        } else if(parsedPurchaseData.typeDocumentReceipt === "Boleta" &&
        parsedPurchaseData.receipt.length<8){
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Debe ingresar 8 carácteres en su DNI.",
          });
          return;
        }

        if (parsedPurchaseData.typeDocumentReceipt === "Factura" &&
          parsedPurchaseData.receipt === "") {
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Ingrese su número de RUC.",
          });
          return;
        } else if(parsedPurchaseData.typeDocumentReceipt === "Factura" &&
        parsedPurchaseData.receipt.length<8){
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Debe ingresar mínimo 8 carácteres en su RUC.",
          });
          return;
        }

        const handlePurchaseValidation = async () => {
          // Desactiva el botón después del primer clic
          setBotonDesactivado(true);
          const url =
            "https://api.yosoymitosis.com/v1/TypePurchase/GetTypePurchases";
          // Realizar la solicitud al servicio para obtener los tipos de compra
          const response = await axios.post(
            url,
            { userId: parsedPurchaseData.userId },
            {
              headers: {
                Authorization: `Bearer ${BEARER_TOKEN}`,
                "Content-Type": "application/json",
              },
            }
          );
          // Obtener los datos de la respuesta
          const { data } = response;
          console.log("GetTypePurchases");
          console.log(data);
          const localStorageTypePurchaseString =
            localStorage.getItem("TypePurchase");
          if (localStorageTypePurchaseString !== null) {
            const localStorageTypePurchase = JSON.parse(
              localStorageTypePurchaseString
            );
            if (localStorageTypePurchase) {
              const matchingTypePurchase = data.data.find(
                (item: any) =>
                  item.typePurchaseId ===
                  localStorageTypePurchase.typePurchaseId
              );
              if (data.data && data.data.length > 0) {
                if (typePurchase !== null) {
                  const { promotionPoints, netAmount } = parsedPurchaseData;
                  console.log(promotionPoints)
                  console.log(matchingTypePurchase.pointsToPurchase)
                  console.log("------------------------------------")
                  const isInsufficientPromotionPoints = (promotionPoints < matchingTypePurchase.pointsToPurchase) ? true : false;
                  const pointsToPurchase =
                    JSON.parse(typePurchase).pointsToPurchase;
                  if (isInsufficientPromotionPoints) {
                    Swal.fire({
                      icon: "error",
                      title: "Oops...",
                      text: `Necesita ${pointsToPurchase} puntos para realizar la compra.`,
                    });
                  } else {
                    console.log(netAmount)
                    console.log(matchingTypePurchase.priceToPurchase)
                    console.log("------------------------------------")
                    const isInsufficientNetAmount = (netAmount < matchingTypePurchase.priceToPurchase) ? true : false;
                    if (isInsufficientNetAmount) {
                      Swal.fire({
                        icon: "error",
                        title: "Oops...",
                        text: "Necesita más monto para realizar la compra.",
                      });
                    } else {
                      // Si se pasa todas las validaciones, se procede a realizar la solicitud POST
                      const modifiedPurchaseData = { ...parsedPurchaseData };
                      modifiedPurchaseData.purchaseDetail.forEach(
                        (item: any) => {
                          delete item.Nombre;
                          delete item.price;
                          delete item.img;
                        }
                      );
                      console.log(modifiedPurchaseData)
                      try {
                        const url =
                          "https://api.yosoymitosis.com/v1/Purchase/SavePurchase";
                        const response = await axios.post(
                          url,
                          modifiedPurchaseData,
                          {
                            headers: {
                              "Content-Type": "application/json",
                              Authorization: `Bearer ${BEARER_TOKEN}`,
                            },
                          }
                        );
                        console.log("SavePurchase");
                        console.log(response);
                        if (response.data.data.message === "Successful purchase") {
                          Swal.fire({
                            icon: "success",
                            title: "GRACIAS POR SU COMPRA",
                            text: "Su compra ha sido procesada exitosamente.",
                            didClose: () => {
                                purchaseSuccess();
                                window.location.href = "/page-collection";
                            }
                          });
                        }else{
                          Swal.fire({
                            icon: "error",
                            title: "Oops...",
                            text: response.data.data.message,
                          });
                          setBotonDesactivado(false);
                        }
                      } catch (error) {
                        console.error(error);
                      }
                    }
                  }
                }
              } else {
                console.error("No se encontraron tipos de compra.");
              }
            } else {
              console.log(
                "No hay ningún tipo de compra almacenado en el localStorage."
              );
            }
          } else {
            console.log(
              "No hay ningún tipo de compra almacenado en el localStorage."
            );
          }
        };

        // Llama a la función para realizar la validación al cargar la página, o en el momento adecuado
        handlePurchaseValidation();

      } catch (error) {
        console.error(error);
        // Puedes mostrar un mensaje de error al usuario si la solicitud falla
      }
    } else {
      console.error(
        "No se encontró la información de compra en el localStorage"
      );
    }
  };

  const renderProduct = (item: Product, index: number) => {
    const {
      productId,
      Nombre,
      quantity,
      img,
      subtotalPoints,
      subtotalPointsNetwork,
      subtotalNetAmount,
      price,
    } = item;

    return (
      <div
        key={index}
        className="relative flex py-8 sm:py-10 xl:py-12 first:pt-0 last:pb-0 items-center"
      >
        <div className="relative h-36 w-24 sm:w-32 flex-shrink-0 overflow-hidden rounded-xl bg-slate-100">
          <img
            src={`https://yosoymitosis.com/products/${img}`}
            alt={Nombre}
            className="h-full w-full object-contain object-center"
          />
          {/* <Link to="/product-detail" className="absolute inset-0"></Link> */}
        </div>

        <div className="ml-3 sm:ml-6 flex flex-1 flex-col py-4 justify-between">
          <div>
            <div className="flex justify-between flex-col gap-2 items-start md:flex-row">
              <div className="flex-[.95] ">
                <h3 className="text-base font-semibold">
                  <Link to="/product-detail">{Nombre}</Link>
                </h3>
                {/* <div className="mt-1.5 sm:mt-2.5 flex text-sm text-slate-600 dark:text-slate-300">
                  <h5 className="text-base font-semibold">
                    Precio: S/ {precio}
                  </h5>
                </div> */}
              </div>

              <div className="flex flex-1 justify-between items-start gap-2 w-full text-center relative">
                <NcInputNumber
                  productId={productId}
                  cant={quantity}
                  price={price}
                  className="relative z-10"
                  onChange={actualizarCarritoDecrement}
                  onChange2={actualizarCarritoIncrement}
                />

              <div className="flex sm:flex justify-end flex-col items-end gap-2 w-fit">
                <Prices price={subtotalNetAmount} className="mt-0.5" />
                <div className="flex items-center border-2 border-green-500 rounded-lg py-1 px-2 md:py-1.5 md:px-2.5 text-sm font-medium">
                  <span className="text-green-500 !leading-none">
                    {subtotalPoints} pts.
                  </span>
                </div>
              </div>
              </div>
            </div>
          </div>

          <div className="flex mt-0 pt-2 items-end justify-between text-sm">
            <div className="mt-1.5 sm:mt-4 flex text-sm text-slate-600 dark:text-slate-300">
              <div className="flex items-center space-x-1.5">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M12 2l2.32 7.098H22l-5.987 4.36L17.66 22 12 17.04 6.34 22l1.646-8.542L2 9.098h7.68L12 2z"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <span className="whitespace-nowrap">
                  Pts. Reales: {subtotalPoints}
                </span>
              </div>
              <span className="hidden mx-4 border-l border-slate-200 dark:border-slate-700 "></span>
              <div className="hidden flex items-center space-x-1.5">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  version="1.1"
                  id="Layer_1"
                  width="14px"
                  height="14px"
                  viewBox="0 0 512 512"
                  enableBackground="new 0 0 512 512"
                >
                  <path d="M127.162,398.814c-29.537,0-53.566-24.03-53.566-53.567s24.029-53.567,53.566-53.567s53.566,24.03,53.566,53.567  S156.699,398.814,127.162,398.814z M127.162,316.68c-15.752,0-28.566,12.815-28.566,28.567s12.814,28.567,28.566,28.567  s28.566-12.815,28.566-28.567S142.914,316.68,127.162,316.68z M185.34,498.5H68.98c-16.719,0-30.32-13.602-30.32-30.32v-14.24  c0-23.18,13.511-44.792,34.42-55.06c4.227-2.075,9.259-1.6,13.021,1.229c11.922,8.963,26.119,13.701,41.059,13.701  c14.936,0,29.139-4.739,41.072-13.704c3.763-2.826,8.796-3.3,13.021-1.225c20.901,10.271,34.407,31.882,34.407,55.059v14.24  C215.66,484.898,202.059,498.5,185.34,498.5z M78.199,424.958C69.2,431.771,63.66,442.539,63.66,453.94v14.24  c0,2.934,2.387,5.32,5.32,5.32H185.34c2.934,0,5.32-2.387,5.32-5.32v-14.24c0-11.399-5.539-22.168-14.534-28.982  c-14.702,9.087-31.466,13.853-48.966,13.853C109.656,438.81,92.895,434.045,78.199,424.958z M384.838,398.814  c-29.537,0-53.566-24.03-53.566-53.567s24.029-53.567,53.566-53.567s53.566,24.03,53.566,53.567S414.375,398.814,384.838,398.814z   M384.838,316.68c-15.752,0-28.566,12.815-28.566,28.567s12.814,28.567,28.566,28.567s28.566-12.815,28.566-28.567  S400.59,316.68,384.838,316.68z M443.02,498.5H326.66c-16.719,0-30.32-13.602-30.32-30.32v-14.24  c0-23.176,13.506-44.788,34.407-55.059c4.227-2.076,9.259-1.601,13.021,1.225c11.934,8.965,26.137,13.704,41.072,13.704  c14.939,0,29.137-4.738,41.059-13.701c3.762-2.829,8.795-3.304,13.021-1.229c20.909,10.268,34.42,31.88,34.42,55.06v14.24  C473.34,484.898,459.738,498.5,443.02,498.5z M335.874,424.958c-8.995,6.814-14.534,17.583-14.534,28.982v14.24  c0,2.934,2.387,5.32,5.32,5.32H443.02c2.934,0,5.32-2.387,5.32-5.32v-14.24c0-11.401-5.54-22.169-14.539-28.982  c-14.695,9.087-31.457,13.853-48.961,13.853C367.34,438.81,350.576,434.045,335.874,424.958z M256,120.633  c-29.537,0-53.566-24.03-53.566-53.566C202.434,37.53,226.463,13.5,256,13.5s53.566,24.03,53.566,53.567  C309.566,96.604,285.537,120.633,256,120.633z M256,38.5c-15.752,0-28.566,12.815-28.566,28.567  c0,15.751,12.814,28.566,28.566,28.566s28.566-12.815,28.566-28.566C284.566,51.315,271.752,38.5,256,38.5z M314.18,220.32H197.82  c-16.719,0-30.32-13.602-30.32-30.32v-14.24c0-23.177,13.506-44.789,34.407-55.059c4.227-2.076,9.258-1.602,13.021,1.225  c11.932,8.965,26.135,13.704,41.071,13.704s29.14-4.739,41.071-13.704c3.764-2.827,8.795-3.302,13.021-1.225  c20.901,10.27,34.407,31.882,34.407,55.059V190C344.5,206.719,330.898,220.32,314.18,220.32z M207.033,146.777  c-8.994,6.814-14.533,17.583-14.533,28.982V190c0,2.934,2.387,5.32,5.32,5.32H314.18c2.934,0,5.32-2.387,5.32-5.32v-14.24  c0-11.399-5.539-22.168-14.533-28.982c-14.702,9.087-31.466,13.853-48.967,13.853S221.735,155.865,207.033,146.777z M163.6,276.758  l21.884-28.678c4.188-5.488,3.134-13.333-2.354-17.521c-5.487-4.187-13.332-3.134-17.521,2.354l-21.884,28.678  c-4.188,5.488-3.134,13.333,2.354,17.52c2.265,1.728,4.93,2.563,7.574,2.563C157.417,281.676,161.14,279.982,163.6,276.758z   M365.921,279.112c5.488-4.188,6.542-12.032,2.354-17.52l-21.884-28.678c-4.19-5.489-12.034-6.542-17.521-2.354  c-5.488,4.188-6.542,12.032-2.354,17.521l21.884,28.678c2.461,3.224,6.182,4.917,9.946,4.917  C360.991,281.676,363.656,280.84,365.921,279.112z M317.527,345.247c0-6.903-5.597-12.5-12.5-12.5h-98.055  c-6.903,0-12.5,5.597-12.5,12.5s5.597,12.5,12.5,12.5h98.055C311.931,357.747,317.527,352.15,317.527,345.247z" />
                </svg>

                <span className="whitespace-nowrap">
                  Pts. Red: {subtotalPointsNetwork}
                </span>
              </div>
            </div>

            <div className="flex">
              <button
                type="button"
                className="font-medium text-primary-6000 dark:text-primary-500 "
                onClick={() => removeFromCart(index)}
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const hasProductsInCart =
    !!localStorage.getItem("purchaseData") &&
    JSON.parse(localStorage.getItem("purchaseData")!).purchaseDetail.length > 0;
  return (
    <div className="nc-CartPage">
      <Helmet>
        <title>Carrito de Compras</title>
      </Helmet>

      <main className="container py-16 lg:pb-28 lg:pt-20 ">
        <div className="mb-12 sm:mb-16">
          <h2 className="block text-2xl sm:text-3xl lg:text-4xl font-semibold ">
            Carrito de Compras
          </h2>
          <div className="block mt-3 sm:mt-5 text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-400">
            <Link to={"/#"} className="">
              Inicio
            </Link>
            <span className="text-xs mx-1 sm:mx-1.5">/</span>
            <Link to={"/page-collection"} className="">
              Tienda
            </Link>
            <span className="text-xs mx-1 sm:mx-1.5">/</span>
            <span className="underline">Carrito de Compras</span>
          </div>
        </div>

        <hr className="border-slate-200 dark:border-slate-700 my-10 xl:my-12" />

        <div className="flex flex-col lg:flex-row">
          <div className="w-full lg:w-[60%] xl:w-[55%] divide-y divide-slate-200 dark:divide-slate-700 ">
            {purchaseData.purchaseDetail.map((item: Product, index: number) =>
              renderProduct(item, index)
            )}
          </div>
          <div className="border-t lg:border-t-0 lg:border-l border-slate-200 dark:border-slate-700 my-10 lg:my-0 lg:mx-10 xl:mx-16 2xl:mx-20 flex-shrink-0"></div>
          <div className="flex-1">
            <div className="sticky top-28">
              <h3 className="text-lg font-semibold ">Resumen del Pedido</h3>
              <div className="mt-7 text-sm text-slate-500 dark:text-slate-400">
                <div className="flex justify-between py-4">
                  <span>Puntos Reales</span>
                  <span className="font-semibold text-slate-900 dark:text-slate-200">
                    {pntosRealesTotal} puntos
                  </span>
                </div>
                <div className="flex justify-between py-4">
                  <span>Puntos de Red</span>
                  <span className="font-semibold text-slate-900 dark:text-slate-200">
                    {pntosRedTotal} puntos
                  </span>
                </div>
                <div className="flex justify-between font-semibold text-slate-900 dark:text-slate-200 text-base pt-4">
                  <span>Total del Pedido</span>
                  <span>S/. {montoNeto ? Number(montoNeto).toFixed(2) : "0.00"}</span>
                </div>
              </div>
              <h3 className="text-lg font-semibold mt-12">Detalles de Pago</h3>
              <div className="mt-7 text-sm text-slate-500 dark:text-slate-400 ">
                <div className="flex justify-between py-1 items-center">
                  <span>Medio de pago</span>
                  <Select
                    className="mt-1.5 w-fit max-h-[37.5px]"
                    value={selectedPaymentMethod}
                    onChange={handlePaymentMethodChange}
                  >
                    <option value="0">Seleccione:</option>
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
                <div className="flex justify-between py-1 items-center">
                  <span>Tipo de Comprobante</span>
                  <Select
                    className="mt-1.5 w-fit max-h-[37.5px]"
                    value={selectedDocumentType}
                    onChange={handleDocumentTypeChange}
                  >
                    <option value="">Seleccione:</option>
                    {/* Aquí puedes mapear los tipos de documento disponibles */}
                    <option value="Boleta">Boleta</option>
                    <option value="Factura">Factura</option>
                    {/* Otras opciones de tipo de documento */}
                  </Select>
                </div>

                {tipoComprobante === "1" && (
                  <div className="flex justify-between py-1 items-center">
                    <span>Numero de DNI</span>
                    <div className="w-fit">
                      <Input
                        className="mt-1.5 max-w-[110px]"
                        type="text"
                        value={numeroDNI}
                        onChange={handleNumeroDNIChange}
                        maxLength={8} // Establecer el máximo número de caracteres permitidos
                        minLength={8} // Establecer el mínimo número de caracteres permitidos
                        error={numeroDNI.length !== 8}
                        errorMessage="El número de DNI debe tener 8 caracteres"
                      />
                    </div>
                  </div>
                )}

                {tipoComprobante === "2" && (
                  <div className="flex justify-between py-1 items-center">
                    <span>Numero de RUC</span>
                    <div className="w-fit">
                      <Input
                        className="mt-1.5 max-w-[135px]"
                        type="text"
                        value={numeroRUC}
                        onChange={handleNumeroRUCChange}
                        minLength={8}
                        error={numeroRUC.length < 8}
                        errorMessage="El RUC debe tener al menos 8 caracteres"
                      />
                    </div>
                  </div>
                )}
              </div>
              {hasProductsInCart ? (
                // <ButtonPrimary
                //   disabled={false}
                //   className="mt-8 w-full"
                //   onClick={handleComprarClick}
                //   from="carritoCompras"
                // >
                //   Comprar
                // </ButtonPrimary>
                <button
                  className="mt-8 w-full ttnc-ButtonPrimary disabled:bg-opacity-90 bg-purple-600 dark:bg-slate-100 hover:bg-purple-700 text-slate-50 dark:text-slate-800 shadow-xl disabled:cursor-not-allowed py-3 px-4 sm:py-3.5 sm:px-6 text-sm sm:text-base font-medium nc-Button relative h-auto inline-flex items-center justify-center rounded-full transition-colors"
                  disabled={botonDesactivado}
                  onClick={handleComprarClick}
                >
                  Comprar
                </button>
              ) : (
                <ButtonPrimary
                  disabled={true}
                  className="mt-8 w-full"
                  from="carritoCompras"
                >
                  Comprar
                </ButtonPrimary>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CartPage;
