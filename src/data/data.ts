import { productImgs } from "contains/fakeData";
// import productVariantImg2 from "images/products/v2.jpg";
// import productVariantImg3 from "images/products/v3.jpg";
// import productVariantImg4 from "images/products/v4.jpg";
// import productVariantImg5 from "images/products/v5.jpg";
// import productVariantImg6 from "images/products/v6.jpg";
//
// import productSport1 from "images/products/sport-1.png";
// import productSport2 from "images/products/sport-2.png";
// import productSport3 from "images/products/sport-3.png";
// import productSport4 from "images/products/sport-4.png";
// import productSport5 from "images/products/sport-5.png";
// import productSport6 from "images/products/sport-6.png";
// import productSport7 from "images/products/sport-7.png";
// import productSport8 from "images/products/sport-8.png";

import productsData from './productsJSON.json';
//

export interface ProductVariant {
  id: number;
  name: string;
  thumbnail?: string;
  color?: string;
  featuredimage: string;
}
type ProductStatus = "Novedades" | "50% de descuento" | "Agotado" | "Edición Limitada" | undefined;
export interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  imageName: string;
  description: string;
  points: number,
  status?: ProductStatus;
}
export interface Product2 {
    productId: number;
    productName: string;
    imageName: string;
    price: number;
    activationPoints: number;
    networkPoints: number,
    discount: number;
}

// console.log(productsData)
const arrayOfProducts = productsData.products;
// console.log(arrayOfProducts);
// Suponiendo que `arrayOfProducts` contiene el array de productos obtenido anteriormente
const newArrayFormat: Product[] = arrayOfProducts.map(product => {
  return {
    id: product.ProductId,
    name: product.Name,
    price: product.Price,
    image: product.Image,
    imageName: product.Image,
    description: '',
    points: product.Points,
    status: product.Status as ProductStatus
  };
});

// Ahora, `newArrayFormat` contiene el nuevo array con el formato deseado
// console.log(newArrayFormat);

export const DYNAMIC_PRODUCTS: Product[] = newArrayFormat;

export const PRODUCTS: Product[] = [
  {
    id: 1,
    name: "Mochila de Nylon Rey",
    description: "Alas de cucaracha marrones",
    price: 74,
    image: productImgs[16],
    imageName: productImgs[16],
    points: 7,
    status: "Novedades",
},
{
    id: 2,
    name: 'Cinturón con Hebilla Redonda de 1"',
    description: "Verde clásico",
    price: 68,
    image: productImgs[1],
    imageName: productImgs[1],
    points: 7,
    status: "50% de descuento",
},
{
    id: 3,
    name: "Gorro de Punto Waffle",
    description: "Nuevo azul aqua",
    price: 132,
    image: productImgs[15],
    imageName: productImgs[15],
    points: 7,
},
{
    id: 4,
    name: "Transportín para Mascotas",
    description: "Rosa oscuro 2023",
    price: 28,
    image: productImgs[3],
    imageName: productImgs[3],
    points: 7,
    status: "Agotado",
},
{
    id: 5,
    name: "Guantes de Cuero",
    description: "Menta verde perfecta",
    price: 42,
    image: productImgs[4],
    imageName: productImgs[4],
    points: 7,
},
{
    id: 6,
    name: "Sudadera con Capucha",
    description: "Nuevo diseño 2023",
    price: 30,
    image: productImgs[5],
    imageName: productImgs[5],
    points: 7,
},
{
    id: 7,
    name: "Chaqueta de Lana y Cachemira",
    description: "Negro mate",
    price: 12,
    image: productImgs[8],
    imageName: productImgs[8],
    points: 7,
    status: "Novedades",
},
{
    id: 8,
    name: "Bolso de Cuero Ella",
    description: "Rosa crema",
    price: 145,
    image: productImgs[7],
    imageName: productImgs[7],
    points: 7,
    status: "Edición Limitada",
},
];

export const SPORT_PRODUCTS: Product[] = [
  {
    id: 1,
    name: "Mochila de Nylon Rey",
    description: "Alas de cucaracha marrones",
    price: 74,
    image: productImgs[16],
    imageName: productImgs[16],
    points: 7,
    status: "Novedades",
},
{
    id: 2,
    name: 'Cinturón con Hebilla Redonda de 1"',
    description: "Verde clásico",
    price: 68,
    image: productImgs[1],
    imageName: productImgs[1],
    points: 7,
    status: "50% de descuento",
},
{
    id: 3,
    name: "Gorro de Punto Waffle",
    description: "Nuevo azul aqua",
    price: 132,
    image: productImgs[15],
    imageName: productImgs[15],
    points: 7,
},
{
    id: 4,
    name: "Transportín para Mascotas",
    description: "Rosa oscuro 2023",
    price: 28,
    image: productImgs[3],
    imageName: productImgs[3],
    points: 7,
    status: "Agotado",
},
{
    id: 5,
    name: "Guantes de Cuero",
    description: "Menta verde perfecta",
    price: 42,
    image: productImgs[4],
    imageName: productImgs[4],
    points: 7,
},
{
    id: 6,
    name: "Sudadera con Capucha",
    description: "Nuevo diseño 2023",
    price: 30,
    image: productImgs[5],
    imageName: productImgs[5],
    points: 7,
},
{
    id: 7,
    name: "Chaqueta de Lana y Cachemira",
    description: "Negro mate",
    price: 12,
    image: productImgs[8],
    imageName: productImgs[8],
    points: 7,
    status: "Novedades",
},
{
    id: 8,
    name: "Bolso de Cuero Ella",
    description: "Rosa crema",
    price: 145,
    image: productImgs[7],
    imageName: productImgs[7],
    points: 7,
    status: "Edición Limitada",
},
];
