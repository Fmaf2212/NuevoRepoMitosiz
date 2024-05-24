import { ComponentType } from "react";

interface StaticLocationStates {
  "/"?: {};
  "null"?: {};
  "/home2"?: {};
  "/home3"?: {};
  "/protected"?: {};
  "/dashboard"?: {};
  "/product-detail"?: {};
  "/product-detail-2"?: {};
  "/page-collection"?: {};
  "/page-collection-2"?: {};
  "/page-search"?: {};
  "/home-header-2"?: {};
  "/page-virtualOffice"?: {};
  "/account"?: {};
  "/editProfile"?: {};
  "/account-savelists"?: {};
  "/account-change-password"?: {};
  "/account-billing"?: {};
  "/account-my-order"?: {};
  "/mypurchases"?: {};
  "/cart"?: {};
  "/checkout"?: {};
  "/blog"?: {};
  "/blog-single"?: {};
  "/about"?: {};
  "/contact"?: {};
  "/login"?: {};
  "/signup"?: {};
  "/forgot-pass"?: {};
  "/page404"?: {};
  "/subscription"?: {};
  "/network-map"?: {};
  "/commissions"?: {};
  "/page-information"?: {};
}

// Definir una interfaz para las rutas dinámicas
interface DynamicLocationStates {
  "/Registro"?: {namePatron?: string; patronId?: string};
}

// Combinar las interfaces de rutas estáticas y dinámicas
export interface LocationStates extends StaticLocationStates, DynamicLocationStates {}
let locationKey: null | keyof LocationStates;
locationKey = null;
export type PathName = keyof LocationStates;

export interface Page {
  path: PathName;
  component: ComponentType<Object>;
  children?: Page[];
}
