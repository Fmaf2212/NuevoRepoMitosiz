import React, { FC, useEffect, useState } from "react";
import { MinusIcon, PlusIcon } from "@heroicons/react/24/solid";

interface Product {
  productId: number;
  Nombre: string;
  quantity: number;
  subtotalGrossAmount: number;
  subtotalNetAmount: number;
  img: string;
}

interface NcInputNumberProps {
  productId: number;
  className?: string;
  defaultValue?: number;
  min?: number;
  max?: number;
  onChange?: (productId: number, newValue: number, price: number) => void;
  label?: string;
  desc?: string;
  cant: number;
  price: number;
  onChange2: (productId: number, newValue: number, price: number) => void;
}

const NcInputNumber: FC<NcInputNumberProps> = ({
  productId,
  className = "w-full",
  cant,
  min = 1,
  max = 300,
  onChange,
  onChange2,
  label,
  desc,
  price,
}) => {
  const [value, setValue] = useState(cant);

  useEffect(() => {
    setValue(cant);
  }, [cant]);

  const handleClickDecrement = () => {
    if (value <= min) return;
    const newValue = value - 1; // Cambiado a value - 1
    setValue(newValue);
    // updateLocalStorage(newValue);
    onChange && onChange(productId, newValue, price);
  };

  const handleClickIncrement = () => {
    if (max && max <= value) return;
    const newValue = value + 1;
    setValue(newValue);
    // updateLocalStorage(newValue);
    onChange2 && onChange2(productId, newValue, price);
  };

  // const updateLocalStorage = (newValue: number) => {
  //   const updatedPurchaseData = {
  //     ...localStorage.getItem("purchaseData"),
  //     quantity: newValue,
  //     purchaseDetail: localStorage
  //       .getItem("purchaseData")
  //       .purchaseDetail.map((item: Product) =>
  //         item.productId === product.productId
  //           ? { ...item, quantity: newValue }
  //           : item
  //       ),
  //   };

  //   localStorage.setItem("purchaseData", JSON.stringify(updatedPurchaseData));
  // };


  return (
    <div className={`nc-NcInputNumber flex items-center justify-between space-x-5 ${className}`}>

      <div className={`nc-NcInputNumber__content flex items-center justify-between w-[104px] sm:w-28`}>
        <button
          className="w-8 h-8 rounded-full flex items-center justify-center border border-neutral-400 dark:border-neutral-500 bg-white dark:bg-neutral-900 focus:outline-none hover:border-neutral-700 dark:hover:border-neutral-400 disabled:hover:border-neutral-400 dark:disabled:hover:border-neutral-500 disabled:opacity-50 disabled:cursor-default"
          type="button"
          onClick={handleClickDecrement}
          disabled={min >= value}
        >
          <MinusIcon className="w-4 h-4" />
        </button>
        <span className="select-none block flex-1 text-center leading-none">
          {value}
        </span>
        <button
          className="w-8 h-8 rounded-full flex items-center justify-center border border-neutral-400 dark:border-neutral-500 bg-white dark:bg-neutral-900 focus:outline-none hover:border-neutral-700 dark:hover:border-neutral-400 disabled:hover:border-neutral-400 dark:disabled:hover:border-neutral-500 disabled:opacity-50 disabled:cursor-default"
          type="button"
          onClick={handleClickIncrement}
          disabled={max ? max <= value : false}
        >
          <PlusIcon className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default NcInputNumber;
