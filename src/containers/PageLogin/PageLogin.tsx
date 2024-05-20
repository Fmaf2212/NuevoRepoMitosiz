import axios from "axios";
import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import Input from "shared/Input/Input";
import ButtonPrimary from "shared/Button/ButtonPrimary";
import { useNavigate } from "react-router-dom";

import { useCounterStore } from "store/auth";

import { BEARER_TOKEN } from "../../../src/store/config";

import Swal from "sweetalert2";

import iconEyeVisible from "../../images/iconEye-visible.png"
import iconEyeInvisible from "../../images/iconEye-invisible.png"

export interface PageLoginProps {
  //onLogin?: () => void;
  className?: string;
}

const PageLogin: React.FC<PageLoginProps> = ({ className = "" }) => {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  // const handleLogin = useCounterStore((state)=>state.handleLogin);
  const {
    purchaseData,
    setPurchaseData,
    handleLogin,
    userDataForAvatarDropdown,
    setUserDataForAvatarDropdown,
  } = useCounterStore();

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    console.log("setIsModalOpen(false)");
  };

  // const handleLoginClick = () => {
  //   // Verifica si onLogin está definido antes de invocarlo
  //   if (onLogin) {
  //     // Lógica de inicio de sesión
  //     onLogin();
  //   }
  // };

  const validarLogin = async (event: React.FormEvent) => {
    event.preventDefault();
    let url = "https://api.yosoymitosis.com/v1/Access/ValidateLogin";
    try {
      const respuesta = await axios.post(
        url,
        {
          userName: email,
          password: password,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${BEARER_TOKEN}`,
          },
        }
      );
      if (respuesta.data.message === "Success") {
        setEmail("");
        setPassword("");
        localStorage.setItem("USER_AUTH", JSON.stringify(respuesta.data.data));
        handleLogin();
        // Obtener el userId de la respuesta
        const userId = respuesta.data.data.userId;

        // Obtener el objeto purchaseData del localStorage
        const existingPurchaseData = purchaseData;
        if (existingPurchaseData !== null) {
          // Actualizar el valor de userId en purchaseData
          existingPurchaseData.userId = userId;

          // Guardar el objeto actualizado en localStorage
          localStorage.setItem(
            "purchaseData",
            JSON.stringify(existingPurchaseData.toString())
          );
          setPurchaseData({ ...purchaseData, ...existingPurchaseData });
        }
        // Redirigir al usuario después del inicio de sesión y si es typeClient User
        if (respuesta.data.data.typeClient === "User") {
          navigate("/page-virtualOffice");
        } else {
          window.location.href = "https://www.google.com";
        }
        const getData = async () => {
          let url = "https://api.yosoymitosis.com/v1/User/GetUserProfile";
          try {
            const response = await axios.post(
              url,
              {
                userId: userId,
              },
              {
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${BEARER_TOKEN}`,
                },
              }
            );
            // Actualizar los datos del usuario para el avatar dropdown
            const userData = {
              imageUrl: `https://api.yosoymitosis.com/StaticFiles/ProfileImg/${response.data.data.profilePicture}`,
              names: response.data.data.names,
              lastName: response.data.data.lastName,
            };
            setUserDataForAvatarDropdown(userData);
            //localStorage.setItem('userDataForAvatarDropdown', JSON.stringify(userData));
          } catch (error) {}
        };
        getData();
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Contraseña incorrecta. Por favor, inténtelo de nuevo.",
      });
    }
  };

  // Ocultar la barra de desplazamiento cuando el modal está abierto
  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "visible";
    }

    // Limpiar al desmontar el componente
    return () => {
      document.body.style.overflow = "visible";
    };
  }, [isModalOpen]);

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const enviarCorreo = async () => {
    try {
      const response = await axios.post("URL_DEL_SERVICIO", {
        // Datos a enviar al servicio, si los hay
      });
      // Manejar la respuesta del servicio
    } catch (error) {
      // Manejar errores de la solicitud
    }
  };

  return (
    <div className={`nc-PageLogin ${className} h-full flex items-center py-28 px-4 sm:px-0 border-t-2 border-white`} data-nc-id="PageLogin" style={{background: "linear-gradient(to left, #3A0C7F, #6800D1, #653EFF)"}}>
      <Helmet>
        <title>Inicio de sesión</title>
      </Helmet>
      <div className="container bg-white w-full sm:w-fit rounded-[10%] py-10 px-2 sm:px-20">
        <h2 className="flex flex-col items-center text-3xl leading-[115%] md:text-5xl md:leading-[115%] font-bold text-[#6800D1] font-montserrat dark:text-neutral-100 justify-center">
          Bienvenid@
          <span className="text-[#6B6B6B] text-xl">a tu oficina virtual</span>
        </h2>
        <div className="max-w-md mx-auto space-y-6 mt-6">
          {/* FORM */}
          <form onSubmit={validarLogin} className="grid grid-cols-1 gap-6">
            <label className="flex flex-col items-center">
              <span className="font-[montserrat] text-[#6800D1] dark:text-neutral-200 font-bold text-center">
                ID
              </span>
              <div className="w-[80%]">
                <Input
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                  }}
                  type="text"
                  placeholder="Ingrese su ID"
                  className="mt-1 border-2 border-[#6800D1]"
                />
              </div>
            </label>
            <label className="flex flex-col items-center">
              <span className="flex justify-between items-center font-[montserrat] text-[#6800D1] dark:text-neutral-200 font-bold text-center">
                CONTRASEÑA
              </span>
              <div className="relative w-[80%]">
                <Input
                  onChange={(e) => {
                    setPassword(e.target.value);
                  }}
                  value={password}
                  type={showPassword ? "text" : "password"} // Cambia el tipo de entrada según el estado de 'showPassword'
                  placeholder="Ingrese su Contraseña"
                  className="mt-1 border-2 border-[#6800D1]"
                />
                <button
                  onClick={toggleShowPassword}
                  type="button"
                  className="focus:outline-none absolute top-1/2 right-5 -translate-y-1/2"
                >
                  {showPassword ? (
                    <img src={iconEyeVisible} alt="" width={24}/>
                  ) : (
                    <img src={iconEyeInvisible} alt="" width={24}/>
                  )}
                </button>
              </div>
            </label>
            <div className="w-full flex justify-center">
              <button
                type="button"
                onClick={openModal}
                className="text-md text-primaryMitosiz font-[montserrat] focus:outline-none -mt-2 focus:underline hover:underline pt-3 -mb-2"
              >
                Recuperar mi contraseña
              </button>
            </div>
            <input
              className="relative h-auto w-fit m-auto inline-flex items-center justify-center rounded-full transition-colors text-sm sm:text-base font-medium py-3 px-4 sm:py-3.5 sm:px-6 ttnc-ButtonPrimary disabled:bg-opacity-90 bg-purple-600 dark:bg-slate-100 hover:bg-purple-500 text-slate-50 dark:text-slate-800 shadow-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-6000 dark:focus:ring-offset-0 cursor-pointer"
              type="submit"
              value="INICIAR SESIÓN"
            />
            {/* <ButtonPrimary type="submit">Continuar</ButtonPrimary> */}
          </form>
        </div>
      </div>
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="fixed inset-0 bg-black opacity-50"></div>
          <div className="bg-white p-8 rounded-md shadow-md relative z-10 max-w-md w-full">
            <h3 className="text-2xl font-semibold mb-4 text-center">
              Recuperar Contraseña
            </h3>
            <p className="text-gray-600 mb-6 text-center">
              Ingresa tu dirección de correo electrónico para recuperar tu
              contraseña.
            </p>
            <label className="block mb-4">
              <span className="text-neutral-800 dark:text-neutral-200">
                Usuario
              </span>
              <Input
                type="text"
                className="mt-1"
              />
            </label>
            <label className="block mb-4">
              <span className="text-neutral-800 dark:text-neutral-200">
                Correo Electrónico
              </span>
              <Input
                type="email"
                placeholder="ejemplo@ejemplo.com"
                className="mt-1"
              />
            </label>
            <div className="flex justify-center mt-6">
              <ButtonPrimary type="button" onClick={closeModal}>
                Cancelar
              </ButtonPrimary>
              <ButtonPrimary type="button" className="ml-2" onClick={enviarCorreo}>
                Enviar Correo
              </ButtonPrimary>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PageLogin;
