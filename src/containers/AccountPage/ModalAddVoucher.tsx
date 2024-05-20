import React, { useEffect, useState } from "react";
import ButtonSecondary from "shared/Button/ButtonSecondary";
import Select from "shared/Select/Select";
import Input from "shared/Input/Input";
import iconoSubirArchivo from "../../images/imgSubirArchivoWhite.png"

import { BEARER_TOKEN } from '../../../src/store/config';
import Swal from "sweetalert2";
import axios from "axios";
import { formatISO } from 'date-fns'; // Importa la función formatISO de date-fns

import tippy from 'tippy.js'; // Importa la librería Tippy.js
import 'tippy.js/dist/tippy.css'; // Importa los estilos base de Tippy.js

interface ModalContentProps {
  handleCloseModalAddVoucher: () => void; // Define el tipo de la función para cerrar el modal
  fetchOrders: () => void; // Define el tipo de la función para cerrar el modal
  selectedPurchaseId: number | null;
}

const ModalContent: React.FC<ModalContentProps> = ({handleCloseModalAddVoucher, selectedPurchaseId, fetchOrders}) => {
  const [imageUrl, setImageUrl] = useState(""); // Agrega más estados según sea necesario
  const [img, setImg] = useState({});
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedFileName, setSelectedFileName] = useState<string>('');
  // const [selectPaymentType, setSelectPaymentType] = useState("0")
  const [selectBank, setSelectBank] = useState("0")
  const [operatingNumber, setOperatingNumber] = useState("");
  const [paymentDate, setPaymentDate] = useState("");
  const [parsedPaymentDate, setParsedPaymentDate] = useState<string>("");
  const [botonDesactivado, setBotonDesactivado] = useState(false);

  const handleOperatingNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setOperatingNumber(e.target.value);
  };

  const handlePaymentDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const nuevaFecha = e.target.value; // Obtener la nueva fecha del input
    setPaymentDate(nuevaFecha); // Actualizar el estado con la nueva fecha
    // Crear un objeto Date a partir de la nueva fecha
    const fecha = new Date(nuevaFecha);
    if (isNaN(fecha.getTime())) {
      // La fecha ingresada no es válida
      // Manejar el error o mostrar un mensaje al usuario
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "La fecha ingresada no es válida.",
        });
      return;
    }
    // Formatear la fecha en el formato deseado
    const formattedFecha = fecha.toISOString();
    // Actualizar el estado con la fecha formateada
    setParsedPaymentDate(formattedFecha);
  };

  const handleImageChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const formData = new FormData();
      formData.append("imageFile", file);
      setImg(formData);
      setSelectedImage(URL.createObjectURL(file)); // Muestra la imagen cargada en el componente
      setSelectedFileName(file.name);
    } else {
      // Notify the user that only image files are allowed
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Seleccione un archivo de imagen (jpg, jpeg, png, gif).",
      });
      event.target.value = ''; // Clear the input value to allow selecting a new file
    }
  };

    // Función para enviar la solicitud POST
    const handleSaveClick = async () => {

      // Verificar que los campos estén completos en el orden deseado
      if (!selectedImage) {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Por favor, seleccione un voucher antes de guardar.",
        });
        return; // Detener la ejecución de la función si falta el campo de seleccionar voucher
      }

      if (selectBank === "0") {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Por favor, seleccione un banco antes de guardar.",
        });
        return; // Detener la ejecución de la función si falta el campo de tipo de pago
      }

      if (!operatingNumber) {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Por favor, ingrese el número de operación antes de guardar.",
        });
        return; // Detener la ejecución de la función si falta el campo de número de operación
      }

      if (!parsedPaymentDate) {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Por favor, seleccione la fecha del voucher antes de guardar.",
        });
        return; // Detener la ejecución de la función si falta el campo de fecha del voucher
      }

      // Desactiva el botón después del primer clic
      setBotonDesactivado(true);

      // Si todos los campos están completos, continuar con el proceso de guardar
      // console.log(selectedPurchaseId);
      // console.log(selectPaymentType);
      // console.log(operatingNumber);
      // console.log(parsedPaymentDate);
      const responseSavePaymentImage = await axios.post(
        "https://api.yosoymitosis.com/v1/Purchase/SavePaymentImage",
        img,
        {
          headers: {
            Authorization: `Bearer ${BEARER_TOKEN}`, // Importa el token de autenticación adecuadamente
          },
        }
      );
      // console.log(responseSavePaymentImage.data.data);
      // const databody={
      //   "purchaseId": selectedPurchaseId,
      //   "imageUrl": responseSavePaymentImage.data.data,
      //   "bank": selectBank,
      //   "operatingNumber": operatingNumber,
      //   "paymentDate": parsedPaymentDate
      // }
      // console.log(databody)
      try {
        const response = await fetch("https://api.yosoymitosis.com/v1/Purchase/SavePaymentDeposit", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${BEARER_TOKEN}`
          },
          body: JSON.stringify({
            purchaseId: selectedPurchaseId,
            imageUrl: responseSavePaymentImage.data.data,
            // typePayment: selectPaymentType,
            bank: selectBank,
            operatingNumber: operatingNumber,
            paymentDate: parsedPaymentDate
          })
        });
        if (response.ok) {
          // Procesar la respuesta si es necesario
          handleCloseModalAddVoucher(); // Cerrar el modal después de guardar
          Swal.fire({
            icon: "success",
            title: "¡Operación exitosa!",
            text: "Los datos se han guardado correctamente.",
          });
          fetchOrders();
        } else {
          console.error("Error al guardar el voucher:", response.statusText);
        }
      } catch (error) {
        console.error('Error al guardar el voucher:', error);
      }
    };
  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
        <div className="bg-white pb-5 m-4 md:m-0 rounded-lg shadow-xl max-w-xl w-full">
          <div className="bg-[#F4F4F4] leading-[.8] h-50px px-[30px] py-[18px] rounded-t-lg flex items-center justify-between border-b border-gray-300">
            <h5 className="text-[#5c35d7] text-lg leading-none font-bold mb-0">
              EDITAR VOUCHER
            </h5>
            <button
              type="button"
              className="close"
              data-dismiss="modal"
              aria-label="Close"
            >
              <span
                className="text-4xl text-[#7A7A7A] transition-colors hover:text-[#2b2b2b]"
                onClick={handleCloseModalAddVoucher}
                aria-hidden="true"
              >
                ×
              </span>
            </button>
          </div>
          <div className="w-[95%] md:w-[70%] m-auto flex flex-col items-center gap-5 px-5 pb-5 pt-8">
            <div className="w-full flex items-center justify-between space-x-4">
              <p>Seleccionar voucher:</p>
              <label
                htmlFor="fileInput"
                className="max-w-[150px] rounded-2xl w-full text-sm cursor-pointer bg-purple-700 text-white text-left flex items-center transition duration-300 ease-in-out border border-purple-700 py-2 px-3 mb-0 font-normal relative overflow-hidden whitespace-nowrap align-middle justify-evenly tooltip-label"
              >
                <img src={iconoSubirArchivo} alt="iconoSubirArchivo" />
                &nbsp;
                &nbsp;
                <span className="w-22 truncate">{selectedImage ? selectedFileName : 'Subir archivo'}</span>
              </label>
              <input
                id="fileInput"
                type="file"
                accept=".png, .jpg, .jpeg"
                name=""
                className="hidden"
                onChange={handleImageChange}
              />
              <p className="sr-only">Ningún archivo seleccionado</p>
            </div>
            <div className="w-full flex items-center justify-between">
              <p className="whitespace-nowrap">Banco:</p>
              <Select
                className="max-w-[150px] h-[44px] border-neutral-400"
                value={selectBank}
                onChange={(e) => setSelectBank(e.target.value)}
              >
                <option value="0">Seleccionar...</option>
                <option value="BBVA">BBVA</option>
                <option value="BCP">BCP</option>
              </Select>
            </div>
            <div className="w-full flex items-center justify-between">
              <p>N° Operación: </p>
              <input type="text" name="" id=""  className="max-w-[150px] rounded-2xl border-neutral-400 focus:outline-none focus:ring-0" onChange={handleOperatingNumberChange}/>
            </div>
            <div className="w-full flex items-center justify-between">
              <p>Fecha voucher: </p>
              <div className="max-w-[150px]">
                <Input
                  className="border-neutral-400 rounded-2xl "
                  type="date"
                  value={paymentDate}
                  onChange={handlePaymentDateChange}
                />
              </div>
            </div>
          </div>
          <div className="w-full flex justify-center gap-4 pt-4">
            <ButtonSecondary
              sizeClass="py-2.5 px-4 sm:px-6 hover:border-none"
              fontSize="text-sm font-medium"
              onClick={handleCloseModalAddVoucher}
            >
              CANCELAR
            </ButtonSecondary>
            {/* <ButtonSecondary
              sizeClass="py-2.5 px-4 sm:px-6 hover:bg-green-400 hover:text-white hover:border-none"
              fontSize="text-sm font-medium"
              onClick={handleSaveClick} // Llamar a la función para guardar
              disabled
            >
              GUARDAR
            </ButtonSecondary> */}
            <button className="border border-slate-300 dark:border-slate-700 py-2.5 px-4 sm:px-6 hover:bg-green-400 hover:text-white hover:border-none text-sm font-medium text-neutral-700 dark:text-neutral-200 disabled:cursor-not-allowed nc-Button relative h-auto inline-flex items-center justify-center rounded-full transition-colors" disabled={botonDesactivado} onClick={handleSaveClick}>GUARDAR</button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ModalContent;
