// useProductsData.js
import { useEffect, useState } from 'react';
import axios from 'axios';

export interface Product {
  productId: number;
  productName: string;
  imageName: string;
  price: number;
  activationPoints: number;
  networkPoints: number;
  discount: number;
}

const useProductsData = (pageNumber: number = 1, pageSize: number = 1000) => {
  const [dataProducts, setDataProducts] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.post(
          "https://api.yosoymitosis.com/v1/Product/GetProductsStore",
          {
            number: pageNumber,
            size: pageSize
          },
          {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjoibWl0b3NpekFwaSIsInBhc3N3b3JkIjoiQG1pdG9zaXo5NiIsImF1ZCI6IkZyb250TWl0b3NpeiJ9.PjRxNwguwkC6I_Qtlo6XLy1686QFyU5L2QroleKQAX0'
            },
          }
        );
        if (response.data.message === "Success") {
          setDataProducts(response.data.data.productStore);
        } else {
          console.error("Error al consumir el servicio GetProductsStore");
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, [pageNumber, pageSize]);

  const newArrayFormat: Product[] = dataProducts.map((product) => ({
    productId: product.productId,
    productName: product.productName,
    imageName: product.imageName,
    price: product.price,
    activationPoints: product.activationPoints,
    networkPoints: product.networkPoints,
    discount: product.discount
  }));

  return newArrayFormat;
};

export default useProductsData;