import { Popover, Transition } from "@headlessui/react";
import Prices from "components/Prices";
// import { Product, PRODUCTS } from "data/data";
import { Fragment } from "react";
import { Link } from "react-router-dom";
import ButtonPrimary from "shared/Button/ButtonPrimary";
import ButtonSecondary from "shared/Button/ButtonSecondary";
import { useStore } from '../../store/cart';

import { useCounterStore } from "store/auth";

interface Products {
  productId: number;
  Nombre: string;
  quantity: number;
  precio: number;
  img: string;
  pntsReals: number;
  subtotalNetAmount: number;
  subtotalPoints: number;
}

export default function CartDropdown() {
  const { cartItemCount, updateCartItemCount, isChangeStoresForShopping,isChangeTypePurchases} = useStore();

  // const carritoString = localStorage.getItem('purchaseData');
  const { purchaseData, setPurchaseData } = useCounterStore();
  const carrito = purchaseData;

  const netAmount = carrito ? carrito.netAmount : 0.00;

  const listPurchaseDetail = carrito ? carrito.purchaseDetail : [];
  // Función para renderizar un producto del carrito

  const removeFromCart = (index: number) => {
    // Obtén el carrito actual del localStorage
    const carritoExistente = carrito;

    // Copia la lista de productos del carrito actual
    const updatedCart = [...carritoExistente.purchaseDetail];//updatedCart es purchaseDetail basado de una copia

    // Elimina el producto en la posición 'index'
    updatedCart.splice(index, 1);

    // Calcula los nuevos totales
    const nuevoMontoTotal = updatedCart.reduce((total, producto) => total + producto.subtotalGrossAmount, 0);
    const nuevoPntsRealesTotal = updatedCart.reduce((pnts, producto) => pnts + producto.subtotalNetAmount, 0);

    // Actualiza el estado global y el localStorage con el nuevo carrito y los nuevos totales
    updateCartItemCount(updatedCart.length);

    // Actualiza el objeto carritoExistente con los cambios
    carritoExistente.purchaseDetail = updatedCart;
    carritoExistente.grossAmount = nuevoMontoTotal;
    carritoExistente.netAmount = nuevoPntsRealesTotal;

    // Actualiza los otros campos según tus necesidades
    carritoExistente.promotionPoints = updatedCart.reduce((points, producto) => points + producto.subtotalPointsNetwork, 0);
    carritoExistente.quantity = updatedCart.reduce((quantity, producto) => quantity + producto.quantity, 0);
    carritoExistente.realPoints = updatedCart.reduce((points, producto) => points + producto.subtotalPoints, 0);

    // Actualiza el carritoLength
    const cantidadProductosEnCarrito = updatedCart.length;
    localStorage.setItem('carritoLength', cantidadProductosEnCarrito.toString());

    // Actualiza el localStorage con el carrito modificado
    localStorage.setItem('purchaseData', JSON.stringify(carritoExistente));
    setPurchaseData({ ...purchaseData, ...carritoExistente });
  };


  const renderProduct = (item: Products, index: number, close: () => void) => {
    const { Nombre, quantity, img, subtotalNetAmount, subtotalPoints } = item;

    return (
      <div key={index} className="flex py-5 last:pb-0">
        <div className="relative h-24 w-20 flex-shrink-0 overflow-hidden rounded-xl bg-slate-100">
          <img
            src={`https://yosoymitosis.com/products/${img}`}
            alt={Nombre}
            className="h-full w-full object-contain object-center"
          />
          <Link onClick={close} className="absolute inset-0" to={"/product-detail"} />
        </div>

        <div className="ml-4 flex flex-1 flex-col">
          <div>
            <div className="flex justify-between ">
              <div>
                <h3 className="text-base font-medium max-w-[170px] ">
                  <Link onClick={close} to={"/product-detail"}>
                    {Nombre}
                  </Link>
                </h3>
                {/* <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  <span>Precio: S/ {precio}</span>
                  <span className="mx-2 border-l border-slate-200 dark:border-slate-700 h-4"></span>
                  <span>Puntos: {pntsReals}</span>
                </p> */}
              </div>
              <div className="flex flex-col">
                <Prices price={subtotalNetAmount} className="mt-0.5" />
                <div className='mt-0.5 w-fit ml-auto'>
                  <div
                    className={`flex items-center border-2 border-green-500 rounded-lg py-1 px-2 md:py-1.5 md:px-2.5 text-sm font-medium`}
                  >
                    <span className="text-green-500 !leading-none">
                      {subtotalPoints} pnts.
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-1 items-end justify-between text-sm">
            {/* Utiliza la cantidad de item en lugar de 'Qty 1' */}
            <p className="text-gray-500 dark:text-slate-400">{`Cant. ${quantity}`}</p>

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


  return (
    <Popover className="relative">
      {({ open, close }) => (
        <>
          <Popover.Button
            className={`
                ${open ? "" : "text-opacity-90"}
                 group w-10 h-10 sm:w-12 sm:h-12 text-white hover:text-slate-800 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full inline-flex items-center justify-center focus:outline-none relative`}
          >
            <div className="w-3.5 h-3.5 flex items-center justify-center bg-[#FFCE00] absolute top-1.5 right-1.5 rounded-full text-[10px] leading-none text-[#653EFF] font-medium">
              <span className="mt-[1px]">{cartItemCount}</span>
            </div>
            <svg
              className="w-6 h-6"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M2 2H3.74001C4.82001 2 5.67 2.93 5.58 4L4.75 13.96C4.61 15.59 5.89999 16.99 7.53999 16.99H18.19C19.63 16.99 20.89 15.81 21 14.38L21.54 6.88C21.66 5.22 20.4 3.87 18.73 3.87H5.82001"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeMiterlimit="10"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M16.25 22C16.9404 22 17.5 21.4404 17.5 20.75C17.5 20.0596 16.9404 19.5 16.25 19.5C15.5596 19.5 15 20.0596 15 20.75C15 21.4404 15.5596 22 16.25 22Z"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeMiterlimit="10"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M8.25 22C8.94036 22 9.5 21.4404 9.5 20.75C9.5 20.0596 8.94036 19.5 8.25 19.5C7.55964 19.5 7 20.0596 7 20.75C7 21.4404 7.55964 22 8.25 22Z"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeMiterlimit="10"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M9 8H21"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeMiterlimit="10"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>

            {/* <Link className="block md:hidden absolute inset-0" to={"/cart"} /> */}
          </Popover.Button>
          <Transition
            as={Fragment}
            enter="transition ease-out duration-200"
            enterFrom="opacity-0 translate-y-1"
            enterTo="opacity-100 translate-y-0"
            leave="transition ease-in duration-150"
            leaveFrom="opacity-100 translate-y-0"
            leaveTo="opacity-0 translate-y-1"
          >
            <Popover.Panel className="block absolute z-10 w-screen max-w-lg sm:max-w-md px-4 mt-3.5 -right-4 sm:right-0 sm:px-0">
              <div className="overflow-hidden rounded-2xl shadow-lg ring-1 ring-black/5 dark:ring-white/10">
                <div className="relative bg-white dark:bg-neutral-800">
                  <div className="max-h-[60vh] p-5 overflow-y-auto hiddenScrollbar">
                    <h3 className="text-xl font-semibold">
                      Carrito de compras
                    </h3>
                    <div className="divide-y divide-slate-100 dark:divide-slate-700">
                      {/* Utiliza la función renderProduct para mapear sobre los elementos del carrito */}
                      {listPurchaseDetail.map((item: Products, index: number) =>
                        renderProduct(item, index, () => {})
                      )}
                    </div>
                  </div>
                  <div className="bg-neutral-50 dark:bg-slate-900 p-5">
                    <p className="flex justify-between font-semibold text-slate-900 dark:text-slate-100">
                      <span>
                        <span>Total</span>
                        <span className="hidden block text-[11px] text-slate-500 dark:text-slate-400 font-normal max-w-[300px]">
                          Envío e impuestos calculados al finalizar la compra.
                        </span>
                      </span>
                      <span className="">S/. {netAmount}</span>
                    </p>
                    <div className="flex space-x-2 mt-5">
                      {
                        localStorage.getItem("USER_AUTH")!!
                          ?
                            <>
                              <ButtonSecondary
                                href="/cart"
                                className="flex-1 border border-slate-200 dark:border-slate-700"
                                onClick={close}
                              >
                                Ver carrito
                              </ButtonSecondary>
                            </>
                          :
                          <>
                            <ButtonSecondary
                              href="/cart"
                              className="flex-1 border border-slate-200 dark:border-slate-700"
                              onClick={close}
                            >
                              Ver carrito
                            </ButtonSecondary>
                          </>
                      }
                    </div>
                  </div>
                </div>
              </div>
            </Popover.Panel>
          </Transition>
        </>
      )}
    </Popover>
  );
}
