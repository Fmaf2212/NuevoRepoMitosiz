import React, { FC, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import NcImage from "shared/NcImage/NcImage";
import Prices from "./Prices";
import ButtonPrimary from "shared/Button/ButtonPrimary";
import BagIcon from "./BagIcon";
import toast from "react-hot-toast";
import { Transition } from "@headlessui/react";
import useProductsData, { Product } from "data/useProductsData";
import ModalQuickView from "./ModalQuickView";
import { useStore } from '../store/cart';

import { BEARER_TOKEN } from '../../src/store/config';

import Swal from 'sweetalert2'

import { useCounterStore } from "store/auth";

import loadingGif from  "../images/loading.gif"

export interface ProductCardProps {
  className?: string;
  data?: Product;
}

interface Producto {
  montoSubTotal: number;
  productId: number;
  pntsRealesSubTotal: number;
  pntsRedSubTotal: number;
  // Otros campos relevantes
}

const ProductCardService: FC<ProductCardProps> = ({className = "",data}) => {
  const [showModalQuickView, setShowModalQuickView] = useState(false);
  const [loading, setLoading] = useState(true);
  const { addToCart, updateCartItemCount } = useStore();

  const newArrayFormat = useProductsData();

  const { purchaseData, setPurchaseData } = useCounterStore();

  useEffect(() => {
    if (newArrayFormat.length > 0) {
      setLoading(false);
    }
  }, [newArrayFormat]);

  if (loading) {
    return <div className="text-center mt-8 flex justify-center">
      <img src={loadingGif} alt="Cargando productos..." />
    </div>; // Puedes mostrar un spinner o un mensaje de carga mientras se obtienen los datos
  }
  const { productId, productName, price, imageName, activationPoints, networkPoints } = data || newArrayFormat[0];

  const isLogued = localStorage.getItem('USER_AUTH')!!;

  const handleAddToCart = async () => {
    let typePurchaseId = 0;
    const storeId = JSON.parse(
      localStorage.getItem("StoresForShopping")!
    ).storeId;
    let userId = 0;
    if(isLogued){
      userId = JSON.parse(localStorage.getItem("USER_AUTH")!).userId;
      typePurchaseId = JSON.parse(localStorage.getItem("TypePurchase")!).typePurchaseId;
    }else{
      userId = 0
    }
    async function getStockForProductAndStore() {
      let quantity = 1; // Inicializar quantity en 1
      // Verificar si el producto ya está en el carrito
      const carritoExistenteRaw = purchaseData;
      if (carritoExistenteRaw) {
        const carritoExistente = purchaseData;
        const listProducts = carritoExistente!==null ? carritoExistente.purchaseDetail : [];
        const productoExistente = listProducts.find(
          (producto: Producto) => producto.productId === productId
        );
        if (productoExistente) {
          quantity = productoExistente.quantity + 1; // Si el producto existe, incrementar la cantidad en 1
        }
      }
        // Datos a enviar en el body de la solicitud
      const requestData = {
        productId: productId,
        storeId: storeId,
        userId: userId,
        typePurchaseId: typePurchaseId,
        quantity: quantity,
      };

      try {
        const response = await fetch(
          "https://api.yosoymitosis.com/v1/StoreInventory/GetStockForProductAndStore",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              'Authorization': `Bearer ${BEARER_TOKEN}`,
            },
            body: JSON.stringify(requestData),
          }
        );

        if (!response.ok) {
          throw new Error("No se pudo completar la solicitud.");
        }

        const responseData = await response.json();
        if (responseData.data.message === "Ok") { //Si hay stock
          const carritoExistenteRaw = localStorage.getItem("purchaseData");
          const carritoExistente = carritoExistenteRaw!==null ? JSON.parse(carritoExistenteRaw) : [];
          console.log(purchaseData)
          console.log(carritoExistente)
          const listProducts = carritoExistente!==null ? carritoExistente.purchaseDetail : [];
          const productoExistente = listProducts.find(
            (producto: Producto) => producto.productId === productId
          );
          const quantity = 1;
          //EN CASO EXISTA
          if (productoExistente) {
            productoExistente.quantity += 1;
            productoExistente.subtotalPoints += responseData.data.productStore.activationPoints;
            productoExistente.subtotalPointsNetwork += responseData.data.productStore.networkPoints;
            productoExistente.subtotalGrossAmount += responseData.data.productStore.price;
            productoExistente.subtotalNetAmount +=
              (quantity * responseData.data.productStore.price) * (1 - responseData.data.discountClient);
              carritoExistente.grossAmount += responseData.data.productStore.price;
              carritoExistente.netAmount += quantity * responseData.data.productStore.price * (1 - responseData.data.discountClient);
              carritoExistente.realPoints += responseData.data.productStore.activationPoints;
              carritoExistente.promotionPoints += responseData.data.productStore.networkPoints;
              carritoExistente.quantity += 1;
              carritoExistente.netAmount= parseFloat(carritoExistente.netAmount.toFixed(2))
          } else {
            //EN CASO NO EXISTA
            const newProduct = {
              Nombre: productName,
              img: imageName,
              productId: productId,
              quantity: 1,
              price: responseData.data.productStore.price,
              subtotalPoints: responseData.data.productStore.activationPoints,
              subtotalPointsNetwork: responseData.data.productStore.networkPoints,
              subtotalGrossAmount: responseData.data.productStore.price,
              subtotalNetAmount: responseData.data.productStore.price * (1 - responseData.data.discountClient),
            };
            listProducts.push(newProduct);
            carritoExistente.quantity += 1;
            carritoExistente.realPoints += responseData.data.productStore.activationPoints;
            carritoExistente.promotionPoints += responseData.data.productStore.networkPoints;
            carritoExistente.grossAmount += responseData.data.productStore.price;
            carritoExistente.netAmount += responseData.data.productStore.price * (1 - responseData.data.discountClient);
            
            carritoExistente.netAmount= parseFloat(carritoExistente.netAmount.toFixed(2))
            const cantidadProductosEnCarrito = listProducts.length;
            localStorage.setItem(
              "carritoLength",
              cantidadProductosEnCarrito.toString()
            );
            updateCartItemCount(cantidadProductosEnCarrito);
          }
          localStorage.setItem(
            "purchaseData",
            JSON.stringify(carritoExistente)
          );
          setPurchaseData({ ...purchaseData, ...carritoExistente });
          toast.custom(
            (t) => (
              <Transition
                appear
                show={t.visible}
                className="p-4 max-w-md w-full bg-white dark:bg-slate-800 shadow-lg rounded-2xl pointer-events-auto ring-1 ring-black/5 dark:ring-white/10 text-slate-900 dark:text-slate-200"
                enter="transition-all duration-150"
                enterFrom="opacity-0 translate-x-20"
                enterTo="opacity-100 translate-x-0"
                leave="transition-all duration-150"
                leaveFrom="opacity-100 translate-x-0"
                leaveTo="opacity-0 translate-x-20"
              >
                <p className="block text-base font-semibold leading-none">
                  Añadido al carrito!
                </p>
                <div className="border-t border-slate-200 dark:border-slate-700 my-4" />
                {renderProductCartOnNotify(responseData.data.discountClient)}
              </Transition>
            ),
            { position: "top-right", id: "nc-product-notify", duration: 3000 }
          );
        } else {
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: responseData.data.message,
          });
        }
        return responseData;
      } catch (error) {
        console.error("Error al realizar la solicitud:", error);
        throw error;
      }
    }
    // Llamada a la función para obtener el stock
    getStockForProductAndStore();
  };

  const notifyAddTocart = () => {
    if(isLogued){
      if(!localStorage.getItem('StoresForShopping') && !localStorage.getItem('TypePurchase')){
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Debe seleccionar un Mayorista y un Tipo de Compra",
        });
      }
      else if (!localStorage.getItem('StoresForShopping')) {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Debe seleccionar un Mayorista",
        });
      } else if (!localStorage.getItem('TypePurchase')) {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Debe seleccionar un Tipo de Compra",
        });
      } else{
        // addToCart();
        handleAddToCart();
      }
    }else{
      if (!localStorage.getItem('StoresForShopping')) {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Debe seleccionar un Mayorista",
        });
      } else{
        // addToCart();
        handleAddToCart();
      }
    }
  };
  const renderProductCartOnNotify = (desc:any) => {
    return (
      <div className="flex ">
        <div className="h-24 w-20 flex-shrink-0 overflow-hidden rounded-xl bg-slate-100">
          <img
            src={`https://api.yosoymitosis.com/StaticFiles/ProductsImg/${imageName}?t=${new Date().getTime()}`}
            alt={imageName}
            className="h-full w-full object-cover object-center"
          />
        </div>

        <div className="ml-4 flex flex-1 flex-col">
          <div>
            <div className="flex justify-between ">
              <div className="max-w-[220px]">
                <h3 className="text-base font-medium ">{productName}</h3>
                {/* <p className="text-sm text-gray-500">Desc: {desc}%</p> */}
              </div>
              <Prices price={price *(1 - desc)} className="mt-0.5" />
            </div>
          </div>
          <div className="flex flex-1 items-end justify-between text-sm">
            <p className="text-gray-500 dark:text-slate-400">{activationPoints} puntos</p>

            <div className="flex">
              <Link
                to={"/cart"}
                className="font-medium text-primary-6000 dark:text-primary-500 "
              >
                Ver carrito
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderGroupButtons = () => {
    return (
      <div className="absolute bottom-0 group-hover:bottom-4 inset-x-1 flex justify-center opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
        <ButtonPrimary
          className="drop-shadow-[0_0_15px_rgba(0,0,0,0.25)]"
          fontSize="text-xs"
          sizeClass="py-2 px-4"
          onClick={() => notifyAddTocart()}
        >
          <BagIcon className="w-3.5 h-3.5 mb-0.5" />
          <span className="ml-1">Añadir al carrito</span>
        </ButtonPrimary>
      </div>
    );
  };

  return (
    <>
      <div
        className={`nc-ProductCard relative flex flex-col bg-transparent ${className}`}
        data-nc-id="ProductCard"
      >
        {/* <Link to={"/product-detail"} className="absolute inset-0"></Link> */}

        <div className="relative flex-shrink-0 bg-slate-50 dark:bg-slate-300 rounded-3xl overflow-hidden z-1 group">
          {/* <NcImage
            containerClassName="flex aspect-w-11 aspect-h-12 w-full h-0"
            src={`https://api.yosoymitosis.com/StaticFiles/ProductsImg/${imageName}`}
            className="object-scale-down w-full h-full drop-shadow-xl"
          /> */}
          <div className="flex aspect-w-11 aspect-h-12 w-full h-0">
            <img className="object-scale-down w-full drop-shadow-xl h-full" src={`https://api.yosoymitosis.com/StaticFiles/ProductsImg/${imageName}`} alt={'image'} />
          </div>
          {renderGroupButtons()}
        </div>

        <div className="space-y-4 px-2.5 pt-5 pb-2.5">
          {/* {renderVariants()} */}

          <div>
            <h2
              className={`nc-ProductCard__title text-base font-semibold transition-colors`}
            >
              {productName}
            </h2>
          </div>

          <div className="flex justify-between items-end ">
            <Prices price={price} />
            {/* <div className="flex items-center mb-0.5">
              <StarIcon className="w-5 h-5 pb-[1px] text-amber-400" />
              <span className="text-sm ml-1 text-slate-500 dark:text-slate-400">
                {(Math.random() * 1 + 4).toFixed(1)} (
                {Math.floor(Math.random() * 70 + 20)} reseñas)
              </span>
            </div> */}
            {/* Nuevo elemento para mostrar los puntos */}
            <div className="flex items-center mb-0.5">
              <span className="text-sm ml-1 text-green-500">
                {activationPoints} Puntos
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* QUICKVIEW */}
      <ModalQuickView
        show={showModalQuickView}
        onCloseModalQuickView={() => setShowModalQuickView(false)}
      />
    </>
  );
};

export default ProductCardService;
