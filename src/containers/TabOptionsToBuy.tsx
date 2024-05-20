import React, { Fragment, useEffect, useState } from "react";
import { Dialog, Popover, Transition } from "@headlessui/react";
import ButtonPrimary from "shared/Button/ButtonPrimary";
import ButtonThird from "shared/Button/ButtonThird";
import ButtonClose from "shared/ButtonClose/ButtonClose";
import Checkbox from "shared/Checkbox/Checkbox";
import Slider from "rc-slider";
import Radio from "shared/Radio/Radio";
import { ChevronDownIcon } from "@heroicons/react/24/outline";
import MySwitch from "components/MySwitch";
import axios from "axios";
import { useStore } from "../store/cart";

import { BEARER_TOKEN } from "../../src/store/config";

import Swal from "sweetalert2";

// DEMO DATA
const DATA_categories = [
  {
    name: "New Arrivals",
  },
  {
    name: "Sale",
  },
  {
    name: "Backpacks",
  },
  {
    name: "Travel Bags",
  },
  {
    name: "Laptop Sleeves",
  },
  {
    name: "Organization",
  },
  {
    name: "Accessories",
  },
];

const DATA_colors = [
  { name: "White" },
  { name: "Beige" },
  { name: "Blue" },
  { name: "Black" },
  { name: "Brown" },
  { name: "Green" },
  { name: "Navy" },
];

const DATA_sizes = [
  { name: "XXS" },
  { name: "XS" },
  { name: "S" },
  { name: "M" },
  { name: "L" },
  { name: "XL" },
  { name: "2XL" },
];

const DATA_sortOrderRadios = [
  { name: "Most Popular", id: "Most-Popular" },
  { name: "Best Rating", id: "Best-Rating" },
  { name: "Newest", id: "Newest" },
  { name: "Price Low - Hight", id: "Price-low-hight" },
  { name: "Price Hight - Low", id: "Price-hight-low" },
];

interface PurchaseData {
  typePurchaseId: number;
  nameTypePurchase: string;
  pointsToPurchase: number;
  priceToPurchase: number;
  discount: number;
  creationTime: string;
  lastModifyTime: string;
}

interface StoresForShoppingData {
  storeId: number;
  storeName: string;
}

const PRICE_RANGE = [1, 500];
//

const TabOptionsToBuy = () => {
  // const [isOpenMoreFilter1, setisOpenMoreFilter1] = useState(false);
  // const [isOpenMoreFilter, setisOpenMoreFilter] = useState(false);
  //
  // const [isOnSale, setIsIsOnSale] = useState(true);
  // const [rangePrices, setRangePrices] = useState([100, 500]);

  const [sortStoresForShopping, setSortStoresForShopping] =
    useState<string>("");
  const [storesForShopping, setStoresForShopping] = useState<
    StoresForShoppingData[]
  >([]);
  const [sortTypePurchases, setSortTypePurchases] = useState<string>("");
  const [typePurchases, setTypePurchases] = useState<PurchaseData[]>([]);
  const [valueStoreForShopping, setValueStoreForShopping] = useState(
    localStorage.getItem("StoresForShopping")
  );
  const storeForShopping = localStorage.getItem("StoresForShopping");
  const storedTypePurchase = localStorage.getItem("TypePurchase");
  const [valueTypePurchases, setValueTypePurchases] =
    useState(storedTypePurchase);

  const { updateIsChangeStoresForShopping, updateIsChangeTypePurchases } =
    useStore();
  //
  // const closeModalMoreFilter1 = () => setisOpenMoreFilter1(false);
  // const closeModalMoreFilter = () => setisOpenMoreFilter(false);
  // const openModalMoreFilter1 = () => setisOpenMoreFilter1(true);
  // const openModalMoreFilter = () => setisOpenMoreFilter(true);

  const storeForShoppingParsed = storeForShopping
    ? JSON.parse(storeForShopping)
    : null;
  const storedTypePurchaseParsed = storedTypePurchase
    ? JSON.parse(storedTypePurchase)
    : null;


  // const [valueInputSearch, setValueInputSearch] = useState("");
  
  const getTypePurchases = async () => {
    const url = "https://api.yosoymitosis.com/v1/TypePurchase/GetTypePurchases";
    let userId = 0; // Valor por defecto
    // Verificar si existe la clave USER_AUTH en localStorage
    const infoUserLogued = localStorage.getItem("USER_AUTH");
    if (infoUserLogued) {
      const userData = JSON.parse(infoUserLogued);
      userId = userData.userId;
    }
    if (userId!==0){
      try {
        const respuesta = await axios.post(
          url,
          {
            userId: userId,
          },
          {
            headers: {
              Authorization: `Bearer ${BEARER_TOKEN}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (respuesta.data.message === "Success") {
          const data = respuesta.data.data;
          //   const names = data.map((item: PurchaseData) => item.nameTypePurchase);
          //   console.log(names)
          setTypePurchases(data);
        } else {
          // setError(true)
          Swal.fire({
            title: "Oops...",
            text: "Salió error en el consumo del servicio.",
            icon: "error",
          });
        }
      } catch (error) {
        console.log(error);
      }
    }
  };
  const getStoresForShopping = async () => {
    const url = "https://api.yosoymitosis.com/v1/Store/GetStoresForShopping";
    try {
      const respuesta = await axios.get(url, {
        headers: {
          Authorization:
            "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjoibWl0b3NpekFwaSIsInBhc3N3b3JkIjoiQG1pdG9zaXo5NiIsImF1ZCI6IkZyb250TWl0b3NpeiJ9.PjRxNwguwkC6I_Qtlo6XLy1686QFyU5L2QroleKQAX0",
        },
      });

      if (respuesta.data.message === "Success") {
        const data = respuesta.data.data;
        //   const names = data.map((item: PurchaseData) => item.nameTypePurchase);
        //   console.log(names)
        setStoresForShopping(data);
      } else {
        // setError(true)
        Swal.fire({
          title: "Oops...",
          text: "Salió error en el consumo del servicio.",
          icon: "error",
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getTypePurchases();

    getStoresForShopping();
  }, []);

  useEffect(() => {
  }, []);

  // OK
  const renderXClear = () => {
    return (
      <span className="flex-shrink-0 w-4 h-4 rounded-full bg-primary-500 text-white flex items-center justify-center ml-3 cursor-pointer">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-3 w-3"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
            clipRule="evenodd"
          />
        </svg>
      </span>
    );
  };

  const handleSortStoresForShopping = (storeId: Number, nameStore: String) => {
    const storeData = {
      storeId: storeId,
      nameStore: nameStore,
    };
    const jsonString = JSON.stringify(storeData);
    localStorage.setItem("StoresForShopping", jsonString);
    setSortStoresForShopping(storeId.toString());
    updateIsChangeStoresForShopping(true);
    setValueStoreForShopping(jsonString);
    const existingPurchaseData = localStorage.getItem("purchaseData");
    if (existingPurchaseData) {
      // Parsear el objeto purchaseData
      const parsedPurchaseData = JSON.parse(existingPurchaseData);

      // Actualizar el valor de typePurchase con nameTypePurchase
      parsedPurchaseData.storeId = storeId;

      // Guardar el objeto actualizado en localStorage
      localStorage.setItem("purchaseData", JSON.stringify(parsedPurchaseData));
    }
  };

  const handleSortTypePurchases = async (
    typePurchaseId: Number,
    nameTypePurchase: String,
    pointsToPurchase: Number,
    priceToPurchase: Number
  ) => {
    const typePurchaseData = {
      typePurchaseId: typePurchaseId,
      nameTypePurchase: nameTypePurchase,
      pointsToPurchase: pointsToPurchase,
      priceToPurchase: priceToPurchase,
    };
    const jsonString = JSON.stringify(typePurchaseData);
    localStorage.setItem("TypePurchase", jsonString);
    setSortTypePurchases(typePurchaseId.toString());
    updateIsChangeTypePurchases(true);
    setValueTypePurchases(jsonString);
    const existingPurchaseData = localStorage.getItem("purchaseData");
    if (existingPurchaseData) {
      // Parsear el objeto purchaseData
      const parsedPurchaseData = JSON.parse(existingPurchaseData);

      // Actualizar el valor de typePurchase con nameTypePurchase
      parsedPurchaseData.typePurchaseId = typePurchaseId;

      // Guardar el objeto actualizado en localStorage
      localStorage.setItem("purchaseData", JSON.stringify(parsedPurchaseData));
    }
    /* ------------ ACTUALIZACIÓN DEL PRODUCTO ----------------- */
    let sumNetAmounts = 0;
    const carritoLength = localStorage.getItem("carritoLength")!!;
    if (carritoLength && parseInt(carritoLength) > 0) {
      const existingCart = localStorage.getItem("purchaseData")!!;
      const storedStoresForShopping = localStorage.getItem("StoresForShopping");
      const storeId = storedStoresForShopping
        ? JSON.parse(storedStoresForShopping).storeId
        : null;
      const typePurchaseId = JSON.parse(
        localStorage.getItem("TypePurchase")!!
      ).typePurchaseId;
      const userId = JSON.parse(localStorage.getItem("USER_AUTH")!!).userId;
      if (existingCart) {
        const productList = JSON.parse(existingCart).purchaseDetail;
        for (const element of productList) {
          element.subtotalNetAmount = 0;
          const requestData = {
            productId: element.productId,
            storeId: storeId===null?0:storeId,
            userId: userId,
            typePurchaseId: typePurchaseId,
            quantity: productList.quantity,
          };
          console.log(requestData)
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
            const responseData = await response.json();
            if (responseData.data.message === "Ok") {
              element.subtotalNetAmount +=
                element.quantity *
                element.price *
                (1 - responseData.data.discountClient);
              sumNetAmounts +=
                element.quantity *
                element.price *
                (1 - responseData.data.discountClient);
            } else {
              console.error(
                "La respuesta de la API no fue exitosa:",
                responseData
              );
            }
          } catch (error) {
            console.error("Error al realizar la solicitud:", error);
          }
        }
        const updatedCart = JSON.parse(existingCart);
        updatedCart.purchaseDetail = productList;
        updatedCart.netAmount = sumNetAmounts;
        localStorage.setItem("purchaseData", JSON.stringify(updatedCart));
      }
    }
  };

  // OK
  const renderTabsStoresForShopping = () => {
    return (
      <Popover className="relative">
        {({ open, close }) => (
          <>
            <Popover.Button
              className={`flex items-center justify-center px-4 py-2 text-sm border rounded-full focus:outline-none select-none
              ${open ? "!border-primary-500 " : ""}
                ${
                  valueStoreForShopping
                    ? "!border-primary-500 bg-primary-50 text-primary-900"
                    : !!sortStoresForShopping.length
                    ? "!border-primary-500 bg-primary-50 text-primary-900"
                    : "border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 hover:border-neutral-400 dark:hover:border-neutral-500"
                }
                `}
            >
              <span className="ml-2">
                {valueStoreForShopping
                  ? JSON.parse(valueStoreForShopping).nameStore
                  : sortStoresForShopping
                  ? storesForShopping.find(
                      (item) =>
                        item.storeId.toString() === sortStoresForShopping
                    )?.storeName || "Seleccione Mayorista:"
                  : "Seleccione Mayorista:"}
              </span>
              {valueStoreForShopping ? (
                <span
                  onClick={() => {
                    const existingPurchaseData =
                      localStorage.getItem("purchaseData");
                    if (existingPurchaseData) {
                      // Parsear el objeto purchaseData
                      const parsedPurchaseData =
                        JSON.parse(existingPurchaseData);

                      // Eliminar la propiedad typePurchase del objeto
                      parsedPurchaseData.storeId = 0;

                      // Guardar el objeto actualizado en localStorage
                      localStorage.setItem(
                        "purchaseData",
                        JSON.stringify(parsedPurchaseData)
                      );
                    }
                    setSortStoresForShopping("");
                    setValueStoreForShopping("");
                    localStorage.removeItem("StoresForShopping");
                    updateIsChangeStoresForShopping(false);
                    close();
                  }}
                >
                  {renderXClear()}
                </span>
              ) : !sortStoresForShopping ? (
                <ChevronDownIcon className="w-4 h-4 ml-3" />
              ) : (
                // <span
                //   onClick={() => {
                //     const existingPurchaseData =
                //       localStorage.getItem("purchaseData");
                //     if (existingPurchaseData) {
                //       // Parsear el objeto purchaseData
                //       const parsedPurchaseData =
                //         JSON.parse(existingPurchaseData);

                //       // Eliminar la propiedad typePurchase del objeto
                //       parsedPurchaseData.storeId = 0;

                //       // Guardar el objeto actualizado en localStorage
                //       localStorage.setItem(
                //         "purchaseData",
                //         JSON.stringify(parsedPurchaseData)
                //       );
                //     }
                //     setSortStoresForShopping("");
                //     setValueStoreForShopping("");
                //     localStorage.removeItem("StoresForShopping");
                //     updateIsChangeStoresForShopping(false);
                //     close();
                //   }}
                // >
                //   {renderXClear()}
                // </span>
                null
              )}
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
              <Popover.Panel className="absolute z-40 w-screen max-w-sm px-4 mt-3 left-0 sm:px-0 lg:max-w-max">
                <div className="overflow-hidden rounded-2xl shadow-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700">
                  <div className="relative flex flex-col px-5 py-6 space-y-5">
                    {storesForShopping.map((item) => (
                      <Radio
                        id={item.storeId.toString()}
                        key={item.storeId}
                        name="radioNameSort"
                        label={item.storeName}
                        onClick={close}
                        checked={
                          sortStoresForShopping === ""
                            ? storeForShoppingParsed?.storeId === item.storeId
                            : sortStoresForShopping === item.storeId.toString()
                        }
                        onChange={() =>
                          handleSortStoresForShopping(
                            item.storeId,
                            item.storeName
                          )
                        }
                      />
                    ))}
                  </div>
                </div>
              </Popover.Panel>
            </Transition>
          </>
        )}
      </Popover>
    );
  };

  // OK
  const renderTabsTypePurchases = () => {
    return (
      <Popover className="relative">
        {({ open, close }) => (
          <>
            <Popover.Button
              className={`flex items-center justify-center px-4 py-2 text-sm border rounded-full focus:outline-none select-none
              ${open ? "!border-primary-500 " : ""}
                ${
                  valueTypePurchases
                    ? "!border-primary-500 bg-primary-50 text-primary-900"
                    : !!sortTypePurchases.length
                    ? "!border-primary-500 bg-primary-50 text-primary-900"
                    : "border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 hover:border-neutral-400 dark:hover:border-neutral-500"
                }
                `}
            >
              <span className="ml-2">
                {valueTypePurchases
                  ? JSON.parse(valueTypePurchases).nameTypePurchase
                  : sortTypePurchases
                  ? typePurchases.find(
                      (item) =>
                        item.typePurchaseId.toString() === sortTypePurchases
                    )?.nameTypePurchase || "Seleccione Tipo de Compra:"
                  : "Seleccione Tipo de Compra:"}
              </span>
              {valueTypePurchases ? (
                <span
                  onClick={() => {
                    const existingPurchaseData =
                      localStorage.getItem("purchaseData");
                    if (existingPurchaseData) {
                      // Parsear el objeto purchaseData
                      const parsedPurchaseData =
                        JSON.parse(existingPurchaseData);

                      // Eliminar la propiedad typePurchase del objeto
                      parsedPurchaseData.typePurchaseId = 0;

                      // Guardar el objeto actualizado en localStorage
                      localStorage.setItem(
                        "purchaseData",
                        JSON.stringify(parsedPurchaseData)
                      );
                    }
                    setSortTypePurchases("");
                    setValueTypePurchases("");
                    localStorage.removeItem("TypePurchase");
                    updateIsChangeTypePurchases(false);
                    close();
                  }}
                >
                  {renderXClear()}
                </span>
              ) : !sortTypePurchases.length ? (
                <ChevronDownIcon className="w-4 h-4 ml-3" />
              ) : (
                // <span
                //   onClick={() => {
                //     const existingPurchaseData =
                //       localStorage.getItem("purchaseData");
                //     if (existingPurchaseData) {
                //       // Parsear el objeto purchaseData
                //       const parsedPurchaseData =
                //         JSON.parse(existingPurchaseData);

                //       // Eliminar la propiedad typePurchase del objeto
                //       parsedPurchaseData.typePurchaseId = 0;

                //       // Guardar el objeto actualizado en localStorage
                //       localStorage.setItem(
                //         "purchaseData",
                //         JSON.stringify(parsedPurchaseData)
                //       );
                //     }
                //     setSortTypePurchases("");
                //     setValueTypePurchases("");
                //     localStorage.removeItem("TypePurchase");
                //     updateIsChangeTypePurchases(false);
                //     close();
                //   }}
                // >
                //   {renderXClear()}
                // </span>
                null
              )}
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
              <Popover.Panel className="absolute z-40 w-screen max-w-sm px-4 mt-3 left-0 sm:px-0 lg:max-w-max">
                <div className="overflow-hidden rounded-2xl shadow-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700">
                  <div className="relative flex flex-col px-5 py-6 space-y-5">
                    {typePurchases.map((item) => (
                      <Radio
                        key={item.typePurchaseId} // Usar typePurchaseId como clave
                        id={item.typePurchaseId.toString()} // Convertir typePurchaseId a cadena para el id
                        name="radioNameSort"
                        label={item.nameTypePurchase} // Utilizar nameTypePurchase como label
                        checked={
                          sortTypePurchases === ""
                            ? storedTypePurchaseParsed?.typePurchaseId ===
                              item.typePurchaseId
                            : sortTypePurchases ===
                              item.typePurchaseId.toString()
                        }
                        onChange={() =>
                          handleSortTypePurchases(
                            item.typePurchaseId,
                            item.nameTypePurchase,
                            item.pointsToPurchase,
                            item.priceToPurchase
                          )
                        }
                        onClick={close}
                      />
                    ))}
                  </div>
                </div>
              </Popover.Panel>
            </Transition>
          </>
        )}
      </Popover>
    );
  };

  // OK
  const renderMoreFilterItem = (
    data: {
      name: string;
      description?: string;
      defaultChecked?: boolean;
    }[]
  ) => {
    const list1 = data.filter((_, i) => i < data.length / 2);
    const list2 = data.filter((_, i) => i >= data.length / 2);
    return (
      <div className="grid grid-cols-2 gap-x-4 sm:gap-x-8 gap-8">
        <div className="flex flex-col space-y-5">
          {list1.map((item) => (
            <Checkbox
              key={item.name}
              name={item.name}
              subLabel={item.description}
              label={item.name}
              defaultChecked={!!item.defaultChecked}
              sizeClassName="w-5 h-5 sm:w-6 sm:h-6"
            />
          ))}
        </div>
        <div className="flex flex-col space-y-5">
          {list2.map((item) => (
            <Checkbox
              key={item.name}
              name={item.name}
              subLabel={item.description}
              label={item.name}
              defaultChecked={!!item.defaultChecked}
              sizeClassName="w-5 h-5 sm:w-6 sm:h-6"
            />
          ))}
        </div>
      </div>
    );
  };
  // FOR RESPONSIVE MOBILE
  const renderTabMobileMayorista = () => {
    return (
      <div className="relative">
        <select
          className={`block w-32 px-4 py-2 text-sm rounded-full border focus:outline-none focus:shadow-none focus:border-none focus:ring-1 focus:ring-[#0ea5e9] cursor-pointer ${
            (valueStoreForShopping || !!sortStoresForShopping.length) && sortStoresForShopping !== "0"
              ? "border-primary-500 bg-primary-50 text-primary-900"
              : "border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 hover:border-neutral-400 dark:hover:border-neutral-500"
          }`}
          value={sortStoresForShopping || ""}
          onChange={(e) => {
            const selectedValue = parseInt(e.target.value);
            handleSortStoresForShopping(
              selectedValue,
              storesForShopping.find(
                (item) => item.storeId.toString() === e.target.value
              )?.storeName || ""
            );

            // Eliminar del localStorage si se selecciona el primer valor
            if (selectedValue === 0) {
              setSortStoresForShopping("");
              setValueStoreForShopping("");
              localStorage.removeItem("StoresForShopping");
              updateIsChangeStoresForShopping(false);
            }
          }}
        >
          <option value="0">Mayorista:</option>
          {storesForShopping.map((item) => (
            <option key={item.storeId} value={item.storeId}>
              {item.storeName}
            </option>
          ))}
        </select>
      </div>
    );
  };

  // FOR RESPONSIVE MOBILE
  const renderTabMobileTipoCompra = () => {
    return (
      <div className="relative">
        <select
          className={`block w-56 max-w-[224px] truncate px-4 py-2 text-sm rounded-full border focus:outline-none focus:shadow-none focus:border-none focus:ring-1 focus:ring-[#0ea5e9] cursor-pointer ${
            (valueTypePurchases || !!sortTypePurchases.length) && sortTypePurchases !== "0"
              ? "border-primary-500 bg-primary-50 text-primary-900"
              : "border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 hover:border-neutral-400 dark:hover:border-neutral-500"
          }`}
          value={sortTypePurchases || ""}
          onChange={(e) => {
            const selectedValue = parseInt(e.target.value);
            const selectedItem = typePurchases.find(
              (item) => item.typePurchaseId === selectedValue
            );
            if (selectedItem) {
              handleSortTypePurchases(
                selectedItem.typePurchaseId,
                selectedItem.nameTypePurchase,
                selectedItem.pointsToPurchase,
                selectedItem.priceToPurchase
              );
            }
            // Eliminar del localStorage si se selecciona el primer valor
            if (selectedValue === 0) {
              const existingPurchaseData =
                localStorage.getItem("purchaseData");
              if (existingPurchaseData) {
                // Parsear el objeto purchaseData
                const parsedPurchaseData =
                  JSON.parse(existingPurchaseData);

                // Eliminar la propiedad typePurchase del objeto
                parsedPurchaseData.typePurchaseId = 0;

                // Guardar el objeto actualizado en localStorage
                localStorage.setItem(
                  "purchaseData",
                  JSON.stringify(parsedPurchaseData)
                );
              }
              setSortTypePurchases("");
              setValueTypePurchases("");
              localStorage.removeItem("TypePurchase");
              updateIsChangeTypePurchases(false);
            }
          }}
        >
          <option value="0">Tipo de Compra:</option>
          {typePurchases.map((item) => (
            <option key={item.typePurchaseId} value={item.typePurchaseId}>
              {item.nameTypePurchase}
            </option>
          ))}
        </select>
      </div>
    );
  };

  return (
    <div className="flex lg:space-x-4 flex-col items-center xl:flex-row xl:justify-between">
      {/* FOR DESKTOP */}
      <div className="hidden lg:flex flex-1 space-x-4">
        {renderTabsStoresForShopping()}
        {localStorage.getItem("USER_AUTH")!! ? renderTabsTypePurchases() : null}
      </div>

      {/* FOR RESPONSIVE MOBILE */}
      <div className="flex flex-col xl:flex-row justify-center w-full sm:w-fit m-0 sm:m-auto items-center gap-2 overflow-x-auto ">
        <div className="flex gap-4 p-[1px] lg:hidden w-full justify-between">
        {renderTabMobileMayorista()}
        {renderTabMobileTipoCompra()}
        </div>
      </div>
    </div>
  );
};

export default TabOptionsToBuy;
