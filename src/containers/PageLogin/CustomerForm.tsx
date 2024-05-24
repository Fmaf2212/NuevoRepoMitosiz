import Label from "components/Label/Label";
import React, { FC, useState, ChangeEvent, useEffect } from "react";
import ButtonPrimary from "shared/Button/ButtonPrimary";
import ButtonSecondary from "shared/Button/ButtonSecondary";
import Input from "shared/Input/Input";
import Radio from "shared/Radio/Radio";
import Select from "shared/Select/Select";
import { avatarImgs } from "contains/fakeData";
import { useNavigate } from 'react-router-dom'

import Swal from "sweetalert2";
import axios from "axios";

import { BEARER_TOKEN } from '../../../src/store/config';

import VerifyIcon from "components/VerifyIcon";

import { useCounterStore } from "store/auth";

import iconEyeVisible from "../../images/iconEye-visible.png"
import iconEyeInvisible from "../../images/iconEye-invisible.png"

interface Props { 
  patronId?: string;
}

type OptionsMap = {
  [key: string]: string;
};

interface StoresForShoppingData {
  storeId: number;
  storeName: string;
}

const CustomerForm: FC<Props> = ({patronId}) => {
  const navigate = useNavigate();
  const [fechaNacimiento, setFechaNacimiento] = useState('');
  const [img, setImg] = useState({});
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedFileName, setSelectedFileName] = useState<string>('');
  const [selectedDocumentType, setSelectedDocumentType] = useState('');
  const optionsMap: OptionsMap = {
    '0': '',
    '1': 'DNI',
    '2': 'Pasaporte',
  };
  const [documentValue, setDocumentValue] = useState<string>('');
  const [nombres, setNombres] = useState<string>('');
  const [apellidos, setApellidos] = useState<string>('');
  const [mail, setMail] = useState('');


  const [nameRecognition, setNameRecognition] = useState('');
  const [storesForShopping, setStoresForShopping] = useState<StoresForShoppingData[]>([]);
  const [storeForShoppingValue, setStoreForShoppingValue] = useState(0);

  const [address, setAddress] = useState<string>('');
  const [idPaisSeleccionado, setidPaisSeleccionado] = useState(1);
  const [departaments, setDepartaments] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState(0);
  const [provinces, setProvinces] = useState([]);
  const [selectedProvince, setSelectedProvince] = useState(0);
  const [districts, setDistricts] = useState([]);
  const [selectedDistrict, setSelectedDistrict] = useState(0);
  // const [loading, setLoading] = useState(true);
  const [phone, setPhone] = useState<string>('');
  const [ubigeo, setUbigeo] = useState<string>('');
  const [showPassword, setShowPassword] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);
  const [inputPasswordValue, setInputPasswordValue] = useState('');
  const [inputPassword2Value, setInputPassword2Value] = useState('');
  const [passwordError, setPasswordError] = useState<string>('');
  const [parsedFechaNacimiento, setParsedFechaNacimiento] = useState<string>("");
  const [botonDesactivado, setBotonDesactivado] = useState(false);

  const dataIsLoggedIn = useCounterStore((state) => state.dataIsLoggedIn);
  const valor = localStorage.getItem('USER_AUTH') ?? 'valor_por_defecto';
  const queryParams = new URLSearchParams(window.location.search);
  // const patrocinador = queryParams.get('patrocinador');
  const patrocinador = patronId;
  useEffect(() => {
    // Verificar si el usuario está autenticado y si existe el parámetro 'patrocinador' con un valor válido
  if (valor === 'valor_por_defecto') {
    const urlParams = new URLSearchParams(window.location.search);
    // const patrocinador = urlParams.get('patrocinador');
    const patrocinador = patronId;
    
    if (!patrocinador || !patrocinador.trim()||isNaN(Number(patrocinador))) {
      // Si el parámetro 'patrocinador' no existe o su valor es null o vacío, redirigir al Login
      window.location.href = '/login';
    }
  }
  }, [valor]);

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
    getStoresForShopping();
    const fetchDataDepartments = async () => {
      try {
        const response = await axios.post(
          'https://api.yosoymitosis.com/v1/Location/GetDepartments',
          {},
          {
            headers: {
              Authorization: `Bearer ${BEARER_TOKEN}`,
            },
          }
        );
        setDepartaments(response.data.data);
        // setLoading(false);
      } catch (error) {
        console.error('Error al obtener los departamentos:', error);
      }
    };
    fetchDataDepartments();
  }, []);

  const fetchProvinces = async (departmentId: any) => {
    try {
      const response = await axios.post(
        'https://api.yosoymitosis.com/v1/Location/GetProvince',
        {
          locationId: departmentId,
        },
        {
          headers: {
            Authorization: `Bearer ${BEARER_TOKEN}`,
          },
        }
      );
      setProvinces(response.data.data);
    } catch (error) {
      console.error('Error al obtener las provincias:', error);
    }
  };

  const fetchDistricts = async (provinceId: any) => {
    try {
      const response = await axios.post(
        'https://api.yosoymitosis.com/v1/Location/GetDistrict',
        {
          locationId: provinceId,
        },
        {
          headers: {
            Authorization: `Bearer ${BEARER_TOKEN}`,
          },
        }
      );
      setDistricts(response.data.data);
    } catch (error) {
      console.error('Error al obtener los distritos:', error);
    }
  };

  const handleImageChange = async (event: ChangeEvent<HTMLInputElement>) => {
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
  const handleNombresChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNombres(event.target.value);
  };

  const handleApellidosChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setApellidos(event.target.value);
  };

  const handleFechaNacimientoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const nuevaFecha = event.target.value; // Obtener la nueva fecha del input
    setFechaNacimiento(nuevaFecha); // Actualizar el estado con la nueva fecha
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
    setParsedFechaNacimiento(formattedFecha);
  };

  const handleDocumentTypeChange = (event: any) => {
    setSelectedDocumentType(optionsMap[event.target.value]);
    setDocumentValue("");
  };

  const handleNameRecognition = (e: any) => {
    setNameRecognition(e.target.value);
  };
  const handleStoresForShopping = (e: any) => {
    setStoreForShoppingValue(e.target.value);
  };

  const handlePasswordChange = (e: any) => {
    setInputPasswordValue(e.target.value);
  };
  const handlePassword2Change = (e: any) => {
    setInputPassword2Value(e.target.value);
  };

  const handleValidation = () => {
    if(inputPasswordValue!=="" && inputPassword2Value!==""){
      if (inputPasswordValue !== inputPassword2Value) {
        setPasswordError('Las contraseñas no coinciden');
      } else {
        setPasswordError('');
      }
    }else{
      setPasswordError('');
    }
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };


  const toggleShowPassword2 = () => {
    setShowPassword2(!showPassword2);
  };

  const handleSeleccionPais = (event: any) => {
    const nuevoPaisSeleccionado = event.target.value;
    setidPaisSeleccionado(nuevoPaisSeleccionado);
  };

  const handleDepartmentChange = (event: any) => {
    const departmentId = Number(event.target.value);
    setSelectedDepartment(departmentId);
    setProvinces([]); // Resetear la lista de provincias
    setDistricts([]); // Resetear la lista de distritos
    fetchProvinces(departmentId);
  };

  const handleProvinceChange = (event: any) => {
    const provinceId = Number(event.target.value);
    setSelectedProvince(provinceId);
    setDistricts([]); // Resetear la lista de distritos
    fetchDistricts(provinceId);
  };
  const handleDistrictChange = (event: any) => {
    const districtId = Number(event.target.value);
    setSelectedDistrict(districtId);
  };

  const fieldsToValidate = [
    { value: selectedDocumentType, errorMessage: 'Debe seleccionar un tipo de documento.' },
    { value: documentValue, errorMessage: 'Debe ingresar un número de documento.' },
    { value: nombres, errorMessage: 'Debe ingresar un nombre.' },
    { value: apellidos, errorMessage: 'Debe ingresar un apellido.' },
    { value: parsedFechaNacimiento, errorMessage: 'Debe ingresar su fecha de nacimiento.' },
    { value: phone, errorMessage: 'Debe ingresar su número de celular.' },
    { value: inputPasswordValue, errorMessage: 'Debe ingresar una contraseña.' },
    { value: inputPassword2Value, errorMessage: 'Debe ingresar su contraseña en el campo de "Confirmar Contraseña".' },
  ];
  function validateUserData(fields: any) {
    for (const field of fields) {
      if (field.value === "") {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: field.errorMessage,
        });
        return false;
      }
    }
    return true;
  }

  const handleRegister = async () => {
    console.log(patronId);
    if (selectedFileName === "") {//si NO se ingresa una imagen
      if (!validateUserData(fieldsToValidate)) {//Validaciones
        return;
      }
      // Validar contraseñas antes de enviar la solicitud
      handleValidation();
      if(passwordError==='Las contraseñas no coinciden'){
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: 'Las contraseñas no coinciden',
        });
      }
      // Si hay un error en las contraseñas, no continuar con el registro
      if (passwordError) {
        return;
      }
      // Desactiva el botón después del primer clic
      setBotonDesactivado(true);
      const userIdLogued = JSON.parse(localStorage.getItem("USER_AUTH")!)!! ? JSON.parse(localStorage.getItem("USER_AUTH")!).userId : null;
      
      // Preparar el objeto de datos para enviar al backend
      const userData = {
        typeDocument: selectedDocumentType,
        document: documentValue,
        names: nombres,
        lastName: apellidos,
        password: inputPasswordValue,
        recognitionName: nameRecognition,
        storeId: storeForShoppingValue,
        mail: mail,
        address: address,
        countryId: idPaisSeleccionado,
        departmentId: selectedDepartment,
        provinceId: selectedProvince,
        districtId: selectedDistrict,
        phone: phone,
        ubigeo: ubigeo,
        birthDate: parsedFechaNacimiento,
        profilePicture: "",
        patron: valor==="valor_por_defecto" ? patrocinador : userIdLogued,
      };
      console.log(userData);
      let url = "https://api.yosoymitosis.com/v1/User/RegisterUser";
      try {
        const response = await axios.post(url, userData, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${BEARER_TOKEN}`,
          },
        });
        console.log(response);
        Swal.fire({
          icon: "success",
          title: "Usuario Registrado!",
          text: `IdUsuario: ${response.data.data}`,
        }).then((result) => {
          if (result.isConfirmed) {
            // Redirigir al usuario al index ("/") después de hacer clic en "OK"
            navigate("/page-virtualOffice");
          }
        });
        setFechaNacimiento('1990-07-22');
        setImg({});
        setSelectedImage(null);
        setSelectedFileName('');
        setSelectedDocumentType('');
        setDocumentValue('');
        setNombres('');
        setApellidos('');
        setNameRecognition('');
        setStoreForShoppingValue(0);
        setMail('');
        setAddress('');
        setidPaisSeleccionado(1);
        setDepartaments([]);
        setSelectedDepartment(0);
        setProvinces([]);
        setSelectedProvince(0);
        setDistricts([]);
        setSelectedDistrict(0);
        setPhone('');
        setUbigeo('');
        setInputPasswordValue('');
        setInputPassword2Value('');
        setPasswordError('');
        setParsedFechaNacimiento('');
      } catch (error: any) {
        if(!!error?.response?.data?.error){//operador de encadenamiento opcional (?.) para verificar si cada propiedad existe antes de intentar acceder a ella
          Swal.fire({
            icon: "error",
            title: "Error",
            text: error.response.data.message,
          });
          setBotonDesactivado(false);
        }else{
          Swal.fire({
            icon: "error",
            title: "Error",
            text: "Hubo un problema al registrar su cuenta. Por favor, inténtelo de nuevo más tarde.",
          });
          setBotonDesactivado(false);
        }
      }
    }else{//si se ingresa una imagen
      if (!validateUserData(fieldsToValidate)) {//Validaciones
        return;
      }
      // Validar contraseñas antes de enviar la solicitud
      handleValidation();
      if(passwordError==='Las contraseñas no coinciden'){
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: 'Las contraseñas no coinciden',
        });
      }
      // Si hay un error en las contraseñas, no continuar con el registro
      if (passwordError) {
        return;
      }
      // Desactiva el botón después del primer clic
      setBotonDesactivado(true);
      const userIdLogued = JSON.parse(localStorage.getItem("USER_AUTH")!).userId;
      try {
        const responseSaveProfileImage = await axios.post(
          "https://api.yosoymitosis.com/v1/User/SaveProfileImage",
          img,
          {
            headers: {
              Authorization: `Bearer ${BEARER_TOKEN}`, // Importa el token de autenticación adecuadamente
            },
          }
        );
        // Preparar el objeto de datos para enviar al backend
        const userData = {
          typeDocument: selectedDocumentType,
          document: documentValue,
          names: nombres,
          lastName: apellidos,
          password: inputPasswordValue,
          recognitionName: nameRecognition,
          storeId: storeForShoppingValue,
          mail: mail,
          address: address,
          countryId: idPaisSeleccionado,
          departmentId: selectedDepartment,
          provinceId: selectedProvince,
          districtId: selectedDistrict,
          phone: phone,
          ubigeo: ubigeo,
          birthDate: parsedFechaNacimiento,
          profilePicture: responseSaveProfileImage.data.data,
          patron: userIdLogued,
        };
        let url = "https://api.yosoymitosis.com/v1/User/RegisterUser";
        try {
          const response = await axios.post(url, userData, {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${BEARER_TOKEN}`,
            },
          });
          console.log(response);
          Swal.fire({
            icon: "success",
            title: "Usuario Registrado!",
            text: `IdUsuario: ${response.data.data}`,
          });
          setFechaNacimiento('1990-07-22');
          setImg({});
          setSelectedImage(null);
          setSelectedFileName('');
          setSelectedDocumentType('');
          setDocumentValue('');
          setNombres('');
          setApellidos('');
          setMail('');
          setNameRecognition('');
          setStoreForShoppingValue(0);
          setAddress('');
          setidPaisSeleccionado(1);
          setDepartaments([]);
          setSelectedDepartment(0);
          setProvinces([]);
          setSelectedProvince(0);
          setDistricts([]);
          setSelectedDistrict(0);
          setPhone('');
          setUbigeo('');
          setInputPasswordValue('');
          setInputPassword2Value('');
          setPasswordError('');
          setParsedFechaNacimiento('');
        } catch (error) {
          // Si hay un error en la solicitud, mostrar mensaje de error
          Swal.fire({
            icon: "error",
            title: "Error",
            text: "Hubo un problema al registrar su cuenta. Por favor, inténtelo de nuevo más tarde.",
          });
          setBotonDesactivado(false);
        }
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Debe subir correctamente su foto.",
        });
      }
    }
  };

  return (
    <div className="border border-slate-300 dark:border-slate-700 rounded-xl ">
      <div className="border-slate-300 dark:border-slate-700 px-6 py-7 space-y-4 sm:space-y-6 block">
        {/* ============ */}
        <div className="w-full flex justify-center">
          <div className="flex-shrink-0 flex flex-col items-center">
            {/* AVATAR */}
            <div className="relative rounded-full overflow-hidden flex">
              <img
                src={selectedImage || avatarImgs[1]} // Utilice la imagen seleccionada si está disponible; de ​​lo contrario, recurra al valor predeterminadoimage
                alt=""
                className="w-32 h-32 rounded-full object-cover z-0"
              />
              <div className="absolute inset-0 bg-black bg-opacity-60  flex flex-col items-center justify-center text-neutral-50 cursor-pointer">
                <label
                  htmlFor="imageInput"
                  className="flex flex-col items-center"
                >
                  <svg
                    width="30"
                    height="30"
                    viewBox="0 0 30 30"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M17.5 5H7.5C6.83696 5 6.20107 5.26339 5.73223 5.73223C5.26339 6.20107 5 6.83696 5 7.5V20M5 20V22.5C5 23.163 5.26339 23.7989 5.73223 24.2678C6.20107 24.7366 6.83696 25 7.5 25H22.5C23.163 25 23.7989 24.7366 24.2678 24.2678C24.7366 23.7989 25 23.163 25 22.5V17.5M5 20L10.7325 14.2675C11.2013 13.7988 11.8371 13.5355 12.5 13.5355C13.1629 13.5355 13.7987 13.7988 14.2675 14.2675L17.5 17.5M25 12.5V17.5M25 17.5L23.0175 15.5175C22.5487 15.0488 21.9129 14.7855 21.25 14.7855C20.5871 14.7855 19.9513 15.0488 19.4825 15.5175L17.5 17.5M17.5 17.5L20 20M22.5 5H27.5M25 2.5V7.5M17.5 10H17.5125"
                      stroke="currentColor"
                      strokeWidth={1.5}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <span className="mt-1 text-xs">Change Image</span>
                </label>
                <input
                  id="imageInput"
                  type="file"
                  accept=".png, .jpg, .jpeg"
                  className="absolute inset-0 opacity-0 cursor-pointer"
                  onChange={handleImageChange}
                />
              </div>
            </div>
            {selectedFileName && (
              <span className="text-xs mt-1">{selectedFileName}</span>
            )}
          </div>
        </div>

        <div className="border border-slate-300 dark:border-neutral-700 rounded-xl p-4">
          <h2 className="text-lg font-semibold mb-4">Datos Personales</h2>
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-3">
              <div>
                <Label className="text-sm">Tipo de Documento</Label>
                <Select
                  className="mt-1.5 border-neutral-400"
                  required
                  onChange={handleDocumentTypeChange}
                  defaultValue={selectedDocumentType}
                >
                  <option value="0">Seleccionar...</option>
                  <option value="1">DNI</option>
                  <option value="2">Pasaporte</option>
                </Select>
              </div>
              <div>
                <Label className="text-sm">Documento</Label>
                <Input
                  className="mt-1.5 border-neutral-400"
                  maxLength={50}
                  required
                  type="text"
                  autoComplete="false"
                  value={documentValue}
                  onChange={(e) => setDocumentValue(e.target.value)}
                  disabled={selectedDocumentType === ""}
                />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-3">
              <div>
                <Label className="text-sm">Nombres</Label>
                <Input
                  className="mt-1.5 border-neutral-400"
                  maxLength={150}
                  required
                  type="text"
                  autoComplete="false"
                  value={nombres}
                  onChange={handleNombresChange}
                />
              </div>
              <div>
                <Label className="text-sm">Apellidos</Label>
                <Input
                  className="mt-1.5 border-neutral-400"
                  maxLength={200}
                  required
                  type="text"
                  autoComplete="false"
                  value={apellidos}
                  onChange={handleApellidosChange}
                />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-3">
              <div>
                <Label className="text-sm">Fecha de Nacimiento</Label>
                <div className="mt-1.5 flex">
                  <span className="inline-flex items-center px-2.5 rounded-l-2xl border border-r-0 border-neutral-400 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400 text-sm">
                    <i className="text-2xl las la-calendar"></i>
                  </span>
                  <Input
                    className="!rounded-l-none border-neutral-400"
                    type="date"
                    value={fechaNacimiento}
                    onChange={handleFechaNacimientoChange}
                  />
                </div>
              </div>
              {/* <div>
                <label className="text-sm">Fecha de Nacimiento (Parsed)</label>
                <pre>{JSON.stringify(parsedFechaNacimiento, null, 2)}</pre>
              </div> */}
              <div>
                <Label className="text-sm">Correo</Label>
                <Input
                  className="mt-1.5 border-neutral-400"
                  maxLength={120}
                  type="email"
                  autoComplete="new-email"
                  value={mail}
                  onChange={(e) => setMail(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>
        <div className="border border-slate-300 dark:border-neutral-700 rounded-xl p-4">
          <h2 className="text-lg font-semibold mb-4">Datos Mitosiz</h2>
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-3">
              <div>
                <Label className="text-sm">Nombre de Reconocimiento</Label>
                <div className="relative w-[95%]">
                  <Input
                    className="mt-1.5 border-neutral-400"
                    maxLength={100}
                    required
                    type="text"
                    value={nameRecognition}
                    onChange={handleNameRecognition}
                    placeholder="Mateo Casas"
                  />
                </div>
              </div>
              <div>
                <Label className="text-sm">Mayorista Preferente</Label>
                <Select
                  className="mt-1.5 border-neutral-400"
                  defaultValue={storeForShoppingValue}
                  onChange={handleStoresForShopping}
                  required
                >
                  <option value="0">Seleccionar...</option>
                  {storesForShopping.map((item: any) => (
                    <option key={item.storeId} value={item.storeId}>
                      {item.storeName}
                    </option>
                  ))}
                </Select>
              </div>
            </div>
          </div>
        </div>
        <div className="border border-slate-300 dark:border-neutral-700 rounded-xl p-4">
          <h2 className="text-lg font-semibold mb-4">Seguridad</h2>
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-3">
              <div>
                <Label className="text-sm">Contraseña</Label>
                <div className="relative w-[95%]">
                  <Input
                    className={`mt-1.5 border-neutral-400 ${
                      passwordError ? "border-red-500" : ""
                    }`}
                    maxLength={100}
                    required
                    type={showPassword ? "text" : "password"}
                    autoComplete="new-password"
                    value={inputPasswordValue}
                    onChange={handlePasswordChange}
                    onBlur={handleValidation}
                  />
                  {inputPasswordValue && (
                    <button
                      onClick={toggleShowPassword}
                      type="button"
                      className="focus:outline-none absolute top-1/2 right-5 -translate-y-1/2"
                    >
                      {showPassword ? (
                        <img src={iconEyeVisible} alt="" width={24} />
                      ) : (
                        <img src={iconEyeInvisible} alt="" width={24} />
                      )}
                    </button>
                  )}
                  {inputPasswordValue !== "" &&
                  inputPassword2Value !== "" &&
                  inputPasswordValue === inputPassword2Value ? (
                    <VerifyIcon className="absolute top-3 -right-[25px]" />
                  ) : null}
                </div>
                {passwordError && (
                  <span className="text-red-500 text-sm">{passwordError}</span>
                )}
              </div>
              <div>
                <Label className="text-sm">Confirmar Contraseña</Label>
                <div className="relative w-[95%]">
                  <Input
                    className={`mt-1.5 border-neutral-400 ${
                      passwordError ? "border-red-500" : ""
                    }`}
                    maxLength={100}
                    required
                    type={showPassword2 ? "text" : "password"}
                    autoComplete="new-password"
                    onChange={handlePassword2Change}
                    value={inputPassword2Value}
                    onBlur={handleValidation}
                  />
                  {inputPassword2Value && (
                    <button
                      onClick={toggleShowPassword2}
                      type="button"
                      className="focus:outline-none absolute top-1/2 right-5 -translate-y-1/2"
                    >
                      {showPassword2 ? (
                        <img src={iconEyeVisible} alt="" width={24} />
                      ) : (
                        <img src={iconEyeInvisible} alt="" width={24} />
                      )}
                    </button>
                  )}
                  {inputPasswordValue !== "" &&
                  inputPassword2Value !== "" &&
                  inputPasswordValue === inputPassword2Value ? (
                    <VerifyIcon className="absolute top-3 -right-[25px]" />
                  ) : null}
                </div>
                {passwordError && (
                  <span className="text-red-500 text-sm">{passwordError}</span>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="border border-slate-300 dark:border-neutral-700 rounded-xl p-4">
          <h2 className="text-lg font-semibold mb-4">Ubicación</h2>
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-3">
              <div>
                <Label className="text-sm">País</Label>
                <Select
                  className="mt-1.5"
                  defaultValue={idPaisSeleccionado}
                  onChange={handleSeleccionPais}
                  required
                >
                  <option value="1">Perú</option>
                </Select>
              </div>
              <div>
                <Label className="text-sm">Departamento</Label>
                <Select
                  className="mt-1.5"
                  required
                  onChange={handleDepartmentChange}
                  value={selectedDepartment}
                >
                  <option value="">Seleccionar...</option>
                  {departaments.map((departamento: any) => (
                    <option
                      key={departamento.departmentId}
                      value={departamento.departmentId}
                    >
                      {departamento.description}
                    </option>
                  ))}
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-3">
              <div>
                <Label className="text-sm">Provincia</Label>
                <Select
                  className="mt-1.5"
                  required
                  onChange={handleProvinceChange}
                  value={selectedProvince}
                >
                  <option value="">Seleccionar...</option>
                  {provinces.map((province: any) => (
                    <option
                      key={province.provinceId}
                      value={province.provinceId}
                    >
                      {province.description}
                    </option>
                  ))}
                </Select>
              </div>
              <div>
                <Label className="text-sm">Distrito</Label>
                <Select
                  className="mt-1.5"
                  required
                  onChange={handleDistrictChange}
                  value={selectedDistrict}
                >
                  <option value="">Seleccionar...</option>
                  {districts.map((district: any) => (
                    <option
                      key={district.districtId}
                      value={district.districtId}
                    >
                      {district.description}
                    </option>
                  ))}
                </Select>
              </div>
            </div>
            <div className="grid">
              <div>
                <div>
                  <Label className="text-sm">Dirección</Label>
                  <Input
                    className="mt-1.5"
                    maxLength={255}
                    type="text"
                    autoComplete="false"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="border border-slate-300 dark:border-neutral-700 rounded-xl p-4">
          <h2 className="text-lg font-semibold mb-4">Contacto</h2>
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-3">
              <div>
                <Label className="text-sm">Celular</Label>
                <Input
                  className="mt-1.5 border-neutral-400"
                  maxLength={20}
                  type="tel"
                  autoComplete="false"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
              <div>
                <Label className="text-sm">Ubigeo</Label>
                <Input
                  className="mt-1.5"
                  maxLength={10}
                  type="text"
                  autoComplete="false"
                  value={ubigeo}
                  onChange={(e) => setUbigeo(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>
        {/* ============ */}
        {/* <div>
          <Label className="text-sm">Patrocinador</Label>
          <Input className="mt-1.5" maxLength={50} required type="text" />
        </div> */}
        {/* ============ */}
        <div className="flex flex-col justify-center sm:flex-row pt-6">
          {/* <ButtonPrimary
            className="sm:!px-7 shadow-none"
            onClick={handleRegister}
          >
            Registrar
          </ButtonPrimary> */}
          <button
            className="sm:!px-7 shadow-none ttnc-ButtonPrimary disabled:bg-opacity-90 bg-purple-600 dark:bg-slate-100 hover:bg-purple-700 text-slate-50 dark:text-slate-800  disabled:cursor-not-allowed py-3 px-4 sm:py-3.5 text-sm sm:text-base font-medium nc-Button relative h-auto inline-flex items-center justify-center rounded-full transition-colors"
            disabled={botonDesactivado}
            onClick={handleRegister}
          >
            Registrar
          </button>
          <ButtonSecondary className="mt-3 sm:mt-0 sm:ml-3">
            Cancelar
          </ButtonSecondary>
        </div>
      </div>
    </div>
  );
};

export default CustomerForm;
