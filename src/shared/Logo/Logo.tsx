import React from "react";
import { Link } from "react-router-dom";
import logoImg from "images/logo.svg";
import logoLightImg from "images/logo-light.svg";
import logoLightV2Img from "images/logo-light-v2.png";

import {useCounterStore} from '../../store/auth'

export interface LogoProps {
  img?: string;
  imgLight?: string;
  imgLightv2?: string;
  className?: string;
}

const Logo: React.FC<LogoProps> = ({
  // img = logoLightImg,
  imgLight = logoImg,
  imgLightv2= logoLightV2Img,
  className = "flex-shrink-0",
}) => {
  const isLogued = localStorage.getItem("USER_AUTH")!!;
  return (
    <Link
      to={isLogued?'/page-virtualOffice':'/'}
      className={`ttnc-logo inline-block text-slate-600 ${className}`}
    >
      {/* THIS USE FOR MY CLIENT */}
      {/* PLEASE UN COMMENT BELLOW CODE AND USE IT */}
      {imgLightv2 ? (
        <img
          className={`block max-h-8 sm:max-h-10 ${
            imgLight ? "dark:hidden" : ""
          }`}
          src={imgLightv2}
          alt="Logo"
        />
      ) : (
        "Logo Here"
      )}
      {imgLight && (
        <img
          className="hidden max-h-8 sm:max-h-10 dark:block"
          src={imgLight}
          alt="Logo-Light"
        />
      )}
    </Link>
  );
};

export default Logo;
