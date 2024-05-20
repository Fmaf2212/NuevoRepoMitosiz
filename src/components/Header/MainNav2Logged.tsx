import React from "react";
import Logo from "shared/Logo/Logo";
import MenuBar from "shared/MenuBar/MenuBar";
import AvatarDropdown from "./AvatarDropdown";
import Navigation from "shared/Navigation/Navigation";
import CartDropdown from "./CartDropdown";
import { Link } from "react-router-dom";

import { useCounterStore } from "store/auth";

const MainNav2Logged = () => {
  const isLoggedIn = useCounterStore((state)=>state.isLoggedIn);

  const renderContent = () => {
    return (
      <div className="h-20 flex justify-between">
        <div className="flex items-center lg:hidden flex-1">
          {" "}
          {/* EL SANGUCHE CUANDO SE ESTÁ EN MOVIL*/}
          <MenuBar />
        </div>

        <div className="lg:flex-1 flex items-center">
          {" "}
          {/* LOGO */}
          <Logo className="flex-shrink-0" />
        </div>

        <div className="flex-[2] hidden lg:flex justify-center mx-4">
          {" "}
          {/* MENUS */}
          <Navigation />
          {/* Si le he dado clic al buscador, que me salga el componente del buscador, caso contrario que me salgan los menus. */}
        </div>

        <div className="flex-1 flex items-center justify-end text-slate-700 dark:text-slate-100">
          {" "}
          {/* ES LA LUPA, ICONO USUARIO Y CARRITO */}
          {isLoggedIn
          ?
          <Link to={"/customer-registration"}>
            <div className="w-7 mx-3">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40">
                <path d="M37.1,5.22h-2v-2c0-0.5-0.4-0.9-0.9-0.9c-0.5,0-0.9,0.4-0.9,0.9v2h-2c-0.5,0-0.9,0.4-0.9,0.9c0,0.5,0.4,0.9,0.9,0.9h2v2c0,0.5,0.4,0.9,0.9,0.9c0.5,0,0.9-0.4,0.9-0.9V7h2C37.6,7,38,6.6,38,6.1s-0.4-0.9-0.9-0.9l0,0V5.22z" fill="white" />
                <path d="M28.76,20c2.92-2.28,3.44-6.5,1.16-9.42c-1.24-1.6-3.14-2.54-5.16-2.58c-1.64,0-3.22,0.62-4.42,1.74C18.22,5.8,13.32,4.33,9.38,6.45S3.97,13.47,6.09,17.4c0.65,1.2,1.59,2.23,2.74,2.97C4.87,21.53,2,24.85,2,28.77v8c0,0.5,0.4,0.9,0.9,0.9h20.88c0.5,0,0.9-0.4,0.9-0.9v-1.62h8.54c0.5,0,0.9-0.4,0.9-0.9v0V27.3C34.08,23.97,31.92,21.04,28.76,20z M24.76,9.75c2.71-0.05,4.94,2.09,5,4.8c0.05,2.71-2.09,4.94-4.8,5c-1.79,0.04-3.46-0.91-4.35-2.46l0.05-0.14c0.08-0.17,0.15-0.34,0.22-0.51s0.13-0.4,0.19-0.6s0.05-0.16,0.07-0.25c0.17-0.64,0.26-1.29,0.26-1.95c0-0.43,0-0.84-0.06-1.26c-0.04-0.26-0.09-0.52-0.16-0.77c0,0,0-0.08,0-0.11c0.89-1.1,2.22-1.74,3.63-1.75H24.76z M19.41,21c-0.52-0.24-1.05-0.44-1.6-0.59c0.68-0.45,1.29-1,1.8-1.64c0.39,0.51,0.86,0.95,1.39,1.32c-0.54,0.24-1.04,0.56-1.49,0.93L19.41,21z M7,13.64c-0.01-3.47,2.81-6.29,6.28-6.3c2.69,0,5.09,1.7,5.96,4.25c0.24,0.66,0.36,1.35,0.36,2.05c-0.01,0.68-0.12,1.36-0.34,2c-0.79,2.34-3.06,4.28-5.62,4.28c0,0-0.74,0-0.74,0C9.59,19.71,7,16.96,7,13.64z M22.88,35.91H3.8c0,0,0-7.14,0-7.14c0-1.46,0.54-2.88,1.46-4.01c0.97-1.19,2.31-2.05,3.77-2.53c0.89-0.29,1.83-0.41,2.76-0.45c0.96-0.04,1.95-0.1,2.91-0.02c0.5,0.04,1,0.14,1.49,0.24c0.52,0.11,1.03,0.24,1.53,0.39c0.25,0.07,0.49,0.16,0.74,0.24c0.72,0.25,1.36,0.62,1.97,1.08c0.38,0.29,0.66,0.63,0.99,0.96c0.27,0.27,0.48,0.67,0.64,1.01c0.26,0.53,0.38,1.11,0.51,1.68c0.22,0.99,0.32,1.99,0.32,3.01c0,0.68,0,1.36,0,2.04c0,1.15,0,2.29,0,3.44c0,0.03,0,0.07,0,0.1L22.88,35.91z M32.32,33.35h-7.64v-4.58c0,0,0-0.06,0-0.09s0-0.18,0-0.28c-0.1-1.57-0.61-3.09-1.47-4.4c-0.05-0.07-0.11-0.14-0.16-0.22c-0.18-0.24-0.37-0.48-0.57-0.7l-0.05-0.06c-0.35-0.38-0.75-0.73-1.18-1.02c0.79-0.47,1.69-0.7,2.61-0.65h2.22c3.36-0.07,6.15,2.59,6.24,5.95V33.35z" fill="white" />
              </svg>
            </div>
          </Link>
          :
          null
          }
          <AvatarDropdown />
          <CartDropdown />
        </div>
      </div>
    );
  };

  return (
    <div className="nc-MainNav2Logged relative z-10 bg-gradient-to-r from-[#653EFF] via-[#6800D1] to-[#3A0C7F] dark:from-gray-800 dark:via-gray-600 dark:to-gray-400 dark:border-slate-700">
      <div className="container ">{renderContent()}</div>
    </div>
  );
};

export default MainNav2Logged;
