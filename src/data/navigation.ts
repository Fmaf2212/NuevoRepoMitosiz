import { NavItemType } from "shared/Navigation/NavigationItem";
import ncNanoId from "utils/ncNanoId";

export const MEGAMENU_TEMPLATES: NavItemType[] = [
  {
    id: ncNanoId(),
    href: "/",
    name: "Home Page",
    children: [
      { id: ncNanoId(), href: "/", name: "Home  1" },
      { id: ncNanoId(), href: "/home2", name: "Home  2", isNew: true },
      { id: ncNanoId(), href: "/", name: "Header  1" },
      { id: ncNanoId(), href: "/home2", name: "Header  2", isNew: true },
      { id: ncNanoId(), href: "/", name: "Coming Soon" },
    ],
  },
  {
    id: ncNanoId(),
    href: "/",
    name: "Shop Pages",
    children: [
      { id: ncNanoId(), href: "/page-collection", name: "Category Page 1" },
      { id: ncNanoId(), href: "/page-collection-2", name: "Category Page 2" },
      { id: ncNanoId(), href: "/product-detail", name: "Product Page 1" },
      { id: ncNanoId(), href: "/product-detail-2", name: "Product Page 2" },
      { id: ncNanoId(), href: "/cart", name: "Cart Page" },
      { id: ncNanoId(), href: "/checkout", name: "Checkout Page" },
    ],
  },
  {
    id: ncNanoId(),
    href: "/",
    name: "Other Pages",
    children: [
      { id: ncNanoId(), href: "/checkout", name: "Checkout Page" },
      { id: ncNanoId(), href: "/page-search", name: "Search Page" },
      { id: ncNanoId(), href: "/cart", name: "Cart Page" },
      { id: ncNanoId(), href: "/account", name: "Accout Page" },
      { id: ncNanoId(), href: "/account-my-order", name: "Order Page" },
      { id: ncNanoId(), href: "/subscription", name: "Subscription" },
    ],
  },
  {
    id: ncNanoId(),
    href: "/",
    name: "Blog Page",
    children: [
      { id: ncNanoId(), href: "/blog", name: "Blog Page" },
      { id: ncNanoId(), href: "/blog-single", name: "Blog Single" },
      { id: ncNanoId(), href: "/about", name: "About Page" },
      { id: ncNanoId(), href: "/contact", name: "Contact Page" },
      { id: ncNanoId(), href: "/login", name: "Login" },
      { id: ncNanoId(), href: "/signup", name: "Signup" },
    ],
  },
];

const OTHER_PAGE_CHILD: NavItemType[] = [
  {
    id: ncNanoId(),
    href: "/page-collection",
    name: "Tienda",
  },
  {
    id: ncNanoId(),
    href: "/account-my-order",
    name: "Mis compras",
  }
];

export const NAVIGATION_DEMO_2: NavItemType[] = [
  {
    id: ncNanoId(),
    href: "/",
    name: "Inicio",
  },
  // {
  //   id: ncNanoId(),
  //   href: "/page-collection",
  //   name: "Tienda",
  // },
  // {
  //   id: ncNanoId(),
  //   href: "/about",
  //   name: "Quiénes Somos",
  // },
  {
    id: ncNanoId(),
    href: "/contact",
    name: "Contáctenos",
  },
];

export const NAVIGATION_DEMO_3: NavItemType[] = [
  {
    id: ncNanoId(),
    href: "/page-virtualOffice",
    name: "Inicio",
  },
  {
    id: ncNanoId(),
    href: "/network-map",
    name: "Red",
  },
  {
    id: ncNanoId(),
    href: "/commissions",
    name: "Comisiones",
  },
  {
    id: ncNanoId(),
    href: "/",
    name: "Compras",
    type: "dropdown",
    children: OTHER_PAGE_CHILD,
  },
  // {
  //   id: ncNanoId(),
  //   href: "/page-information",
  //   name: "Información",
  // }
];
