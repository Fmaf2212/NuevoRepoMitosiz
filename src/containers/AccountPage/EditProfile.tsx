import Label from "components/Label/Label";
import { ChangeEvent, FC, useEffect, useState } from "react";
import ButtonPrimary from "shared/Button/ButtonPrimary";
import Input from "shared/Input/Input";
import Select from "shared/Select/Select";
import { Helmet } from "react-helmet-async";
import axios from "axios";
import { BEARER_TOKEN } from '../../../src/store/config';
import { useCounterStore } from "store/auth";
import Swal from "sweetalert2";
import ButtonSecondary from "shared/Button/ButtonSecondary";
//import Tooltip from "./Tooltip";
import iconEyeVisible from "../../images/iconEye-visible.png"
import iconEyeInvisible from "../../images/iconEye-invisible.png"
export interface AccountPageProps {
  className?: string;
}

interface UserProfileData {
  // Define properties here
  typeDocument: String
}
interface StoresForShoppingData {
  storeId: number;
  storeName: string;
}

const AccountPage: FC<AccountPageProps> = ({ className = "" }) => {
  const [urlProfilePictureUser, setUrlProfilePictureUser] = useState("");
  const [profilePictureUser, setProfilePictureUser] = useState("");
  const [img, setImg] = useState({});
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedFileName, setSelectedFileName] = useState<string>('');
  const [selectedDocumentType, setSelectedDocumentType] = useState("");
  const [numberDocumentType, setNumberDocumentType] = useState("");
  const [namesUser, setNamesUser] = useState("");
  const [lastNameUser, setLastNameUser] = useState("");
  const [birthDateUser, setBirthDateUser] = useState("");
  const [emailUser, setEmailUser] = useState("");
  const [nameRecognition, setNameRecognition] = useState('');
  const [storesForShopping, setStoresForShopping] = useState<StoresForShoppingData[]>([]);
  const [storeForShoppingValue, setStoreForShoppingValue] = useState(0);
  const [countryUser, setCountryUser] = useState("");
  const [departaments, setDepartaments] = useState([]);
  const [departamentUser, setDepartmentUser] = useState(0);
  const [provinces, setProvinces] = useState([]);
  const [provinceUser, setProvinceUser] = useState(0);
  const [districts, setDistricts] = useState([]);
  const [districtUser, setDistrictUser] = useState(0);
  const [addressUser, setAddressUser] = useState("");
  const [phoneUser, setPhoneUser] = useState("");
  const [ubigeoUser, setUbigeoUser] = useState("");
  const dataIsLoggedIn = useCounterStore((state) => state.dataIsLoggedIn);
  const [isUpdateUser, setIsUpdateUser] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showNewPassword2, setShowNewPassword2] = useState(false);
  const [inputCurrentPasswordValue, setInputCurrentPasswordValue] = useState('');
  const [inputNewPasswordValue, setInputNewPasswordValue] = useState('');
  const [inputNewPassword2Value, setInputNewPassword2Value] = useState('');
  //const [showTooltip, setShowTooltip] = useState(false);
  
  const { updateNamesAndLastName, updateNamesAndLastNameAndImg } = useCounterStore();

  const USER_AUTH = JSON.parse(localStorage.getItem("USER_AUTH")!);

  const valor = localStorage.getItem('USER_AUTH') ?? 'valor_por_defecto';
  useEffect(() => {
    // Verificar si el usuario está autenticado, de lo contrario, redirigir al Login
    if (valor==="valor_por_defecto") {
      window.location.href = '/login';
    }
  }, [dataIsLoggedIn]);

  useEffect(() => {
    getStoresForShopping();
    const fetchDataUser = async () => {
      try {
        const response = await axios.post(
          "https://api.yosoymitosis.com/v1/User/GetUserProfile",
          {
            userId: USER_AUTH.userId,
          },
          {
            headers: {
              'Authorization': `Bearer ${BEARER_TOKEN}`,
            },
          }
        );
        console.log(response.data.data);
        setUrlProfilePictureUser(`https://api.yosoymitosis.com/StaticFiles/ProfileImg/${response.data.data.profilePicture}`);
        setProfilePictureUser(response.data.data.profilePicture);
        setSelectedDocumentType(response.data.data.typeDocument);
        setNumberDocumentType(response.data.data.document);
        setNamesUser(response.data.data.names);
        setLastNameUser(response.data.data.lastName);
        const formattedDate = response.data.data.birthDate ? response.data.data.birthDate.slice(0, 10) : "";
        setBirthDateUser(formattedDate);
        setEmailUser(response.data.data.mail);
        setNameRecognition(response.data.data.recognitionName);
        setStoreForShoppingValue(response.data.data.storeId);
        setCountryUser(response.data.data.countryId);
        setDepartmentUser(response.data.data.departmentId);
        setProvinceUser(response.data.data.provinceId);
        setDistrictUser(response.data.data.districtId);
        setAddressUser(response.data.data.address);
        setPhoneUser(response.data.data.phone);
        setUbigeoUser(response.data.data.ubigeo);
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
        fetchProvinces(response.data.data.departmentId);
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
        fetchDistricts(response.data.data.provinceId);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchDataUser();
    const fetchDataDepartments = async () => {
      try {
        const response = await axios.post(
          'https://api.yosoymitosis.com/v1/Location/GetDepartments',
          {},
          {
            headers: {
              Authorization: `Bearer ${BEARER_TOKEN}`, // Reemplaza BEARER_TOKEN con tu token de autenticación
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

  }, [isUpdateUser]);

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

  const handleStoresForShopping = (event: any) => {
    setStoreForShoppingValue(event.target.value);
  };

  const handleDateChange = (e: any) => {
    console.log(e.target.value);
    setBirthDateUser(e.target.value);
  };

  const handleDepartmentChange = (event: any) => {
    const departmentId = Number(event.target.value);
    setDepartmentUser(departmentId);
    setProvinces([]); // Resetear la lista de provincias
    setDistricts([]); // Resetear la lista de distritos
    fetchProvinces(departmentId);
  };

  const handleProvinceChange = (event: any) => {
    const provinceId = Number(event.target.value);
    setProvinceUser(provinceId);
    setDistricts([]); // Resetear la lista de distritos
    fetchDistricts(provinceId);
  };

  const handleImageChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const formData = new FormData();
      formData.append("imageFile", file);
      formData.append("deleteFile", profilePictureUser); // Adjunta la variable deleteFile con el valor "true"
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

  const fieldsToValidate = [
    { value: selectedDocumentType, errorMessage: 'Debe seleccionar un tipo de documento.' },
    { value: numberDocumentType, errorMessage: 'Debe ingresar un número de documento.' },
    { value: namesUser, errorMessage: 'Debe ingresar un nombre.' },
    { value: lastNameUser, errorMessage: 'Debe ingresar un apellido.' },
    { value: birthDateUser, errorMessage: 'Debe ingresar su fecha de nacimiento.' },
    { value: phoneUser, errorMessage: 'Debe ingresar su número de celular.' },
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

  const handleUpdateProfile = async () => {
    //Obtener del local userDataForAvatarDropdown para la actualización en el zustand
    const currentUserDataForAvatarDropdowString = localStorage.getItem("userDataForAvatarDropdown");
    const currentUserDataForAvatarDropdow = currentUserDataForAvatarDropdowString ? JSON.parse(currentUserDataForAvatarDropdowString) : null;
    if (!currentUserDataForAvatarDropdow) {
      // Manejar el caso en que no haya datos en el localStorage
      console.error("No se encontraron datos de usuario en el localStorage");
      return;
    }
    //Creamos una copia para actualizar solo algunos campos y mandarlo
    const updatedUserData = { ...currentUserDataForAvatarDropdow };
    //Si no ha seleccionado una imagen
    if (selectedFileName === "") {
      const formattedBirthDate = birthDateUser ? birthDateUser + "T00:00:00.778Z" : "";
      if (!validateUserData(fieldsToValidate)) {//Validaciones
        return;
      }
      try {
        const response = await axios.post(
          "https://api.yosoymitosis.com/v1/User/UpdateUser",
          {
            userId: USER_AUTH.userId,
            typeDocument: selectedDocumentType,
            document: numberDocumentType,
            names: namesUser,
            lastName: lastNameUser,
            mail: emailUser,
            recognitionName: nameRecognition,
            storeId: storeForShoppingValue,
            address: addressUser,
            countryId: countryUser,
            departmentId: departamentUser,
            provinceId: provinceUser,
            districtId: districtUser,
            phone: phoneUser,
            ubigeo: ubigeoUser,
            birthDate: formattedBirthDate,
            profilePicture: profilePictureUser,
          },
          {
            headers: {
              Authorization: `Bearer ${BEARER_TOKEN}`,
              "Content-Type": "application/json",
            },
          }
        );
        if (response.data.message === "Success") {
          // Actualizar el perfil en localStorage
          const local_USER_AUTH = {
            userId: USER_AUTH.userId,
            document: numberDocumentType,
            names: namesUser,
            lastName: lastNameUser,
            typeClient: "User"
          };
          localStorage.setItem("USER_AUTH", JSON.stringify(local_USER_AUTH));
          //Obtenemos solo los valores de apellidos y nombres para mi userDataForAvatarDropdown de mi LocalStorage
          updatedUserData.lastName= lastNameUser;
          updatedUserData.names= namesUser;
          localStorage.setItem("userDataForAvatarDropdown", JSON.stringify(updatedUserData));
          //Para actualizar en el zustand
          updateNamesAndLastName(namesUser, lastNameUser);
          // Mostrar mensaje de éxito
          Swal.fire({
            icon: "success",
            title: "Perfil actualizado correctamente.",
          });
          setIsUpdateUser(true);
        }
      } catch (error) {
        // Si hay un error en la solicitud, mostrar mensaje de error
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Hubo un problema al actualizar sus datos. Por favor, inténtelo de nuevo.",
        });
      }
    } else {//Si HA seleccionado una imagen
      if (!validateUserData(fieldsToValidate)) {//Validaciones
        return;
      }
      const responseProfileImage = await axios.post(
        "https://api.yosoymitosis.com/v1/User/UpdateProfileImage",
        img,
        {
          headers: {
            Authorization: `Bearer ${BEARER_TOKEN}`, // Importa el token de autenticación adecuadamente
          },
        }
      );
      console.log(responseProfileImage.data.data);
      const formattedBirthDate = birthDateUser
        ? birthDateUser + "T00:00:00.778Z"
        : "";
      console.log(formattedBirthDate);
      try {
        const response = await axios.post(
          "https://api.yosoymitosis.com/v1/User/UpdateUser",
          {
            userId: USER_AUTH.userId,
            typeDocument: selectedDocumentType,
            document: numberDocumentType,
            names: namesUser,
            lastName: lastNameUser,
            mail: emailUser,
            recognitionName: nameRecognition,
            storeId: storeForShoppingValue,
            address: addressUser,
            countryId: countryUser,
            departmentId: departamentUser,
            provinceId: provinceUser,
            districtId: districtUser,
            phone: phoneUser,
            ubigeo: ubigeoUser,
            birthDate: formattedBirthDate,
            profilePicture: responseProfileImage.data.data,
          },
          {
            headers: {
              Authorization: `Bearer ${BEARER_TOKEN}`,
              "Content-Type": "application/json",
            },
          }
        );
        if (response.data.message === "Success") {
          // Actualizar el perfil en localStorage
          const local_USER_AUTH = {
            userId: USER_AUTH.userId,
            document: numberDocumentType,
            names: namesUser,
            lastName: lastNameUser,
            typeClient: "User"
          };
          localStorage.setItem("USER_AUTH", JSON.stringify(local_USER_AUTH));
          //Obtenemos solo los valores de apellidos y nombres para mi userDataForAvatarDropdown de mi LocalStorage
          updatedUserData.imageUrl= `https://api.yosoymitosis.com/StaticFiles/ProfileImg/${responseProfileImage.data.data}`;
          updatedUserData.lastName= lastNameUser;
          updatedUserData.names= namesUser;
          localStorage.setItem("userDataForAvatarDropdown", JSON.stringify(updatedUserData));
          //Para actualizar en el zustand
          updateNamesAndLastNameAndImg(namesUser, lastNameUser, responseProfileImage.data.data);
          // Mostrar mensaje de éxito
          Swal.fire({
            icon: "success",
            title: "Perfil actualizado correctamente.",
          });
          setIsUpdateUser(true);
        } else {
          throw new Error("Hubo un error al actualizar el perfil."); //si el mensaje de éxito no se recibe correctamente, se lanzará un error que será capturado por el bloque catch.
        }
      } catch (error) {
        // Si hay un error en la solicitud, mostrar mensaje de error
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Hubo un problema al actualizar sus datos. Por favor, inténtelo de nuevo.",
        });
      }
    }
  };

  const handleUpdateButtonClick = () => {
    // Aquí puedes agregar validaciones antes de llamar a handleUpdateProfile
    handleUpdateProfile();
  };
  const handleUpdatePasswordButtonClick = async () => {
    // Verificar que el campo de contraseña actual no esté vacío
    if (!inputCurrentPasswordValue) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: 'Por favor ingrese la contraseña actual.',
      });
      return;
    }

    // Verificar que el campo de nueva contraseña no esté vacío
    if (!inputNewPasswordValue) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: 'Por favor ingrese la nueva contraseña.',
      });
      return;
    }

    // Verificar que el campo de confirmación de nueva contraseña no esté vacío
    if (!inputNewPassword2Value) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: 'Por favor ingrese la confirmación de la nueva contraseña.',
      });
      return;
    }
    // Verificar que las contraseñas coincidan
    if (inputNewPasswordValue !== inputNewPassword2Value) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: 'Las contraseñas no coinciden.',
      });
      return;
    }
    try {
      const response = await axios.post(
        "https://api.yosoymitosis.com/v1/User/UpdatePassword",
        {
          userId: USER_AUTH.userId,
          password: inputNewPasswordValue
        },
        {
          headers: {
            Authorization: `Bearer ${BEARER_TOKEN}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (response.data.message === "Success") {
        Swal.fire({
          icon: "success",
          title: "Su contraseña ha sido actualizada correctamente.",
        });
        setInputNewPasswordValue('');
        setInputNewPassword2Value('');
      }
    } catch (error) {
      // Si hay un error en la solicitud, mostrar mensaje de error
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Hubo un problema al actualizar sus datos. Por favor, inténtelo de nuevo.",
      });
    }
  };

  const toggleShowCurrentPassword = () => {
    setShowCurrentPassword(!showCurrentPassword);
  };
  const toggleShowNewPassword = () => {
    setShowNewPassword(!showNewPassword);
  };
  const toggleShowNewPassword2 = () => {
    setShowNewPassword2(!showNewPassword2);
  };
  const handleInputCurrentPassword = (e: any) =>{
    setInputCurrentPasswordValue(e.target.value);
  }
  const handleInputNewPasswordValue = (e: any) =>{
    setInputNewPasswordValue(e.target.value);
  }
  const handleInputNewPassword2Value = (e: any) =>{
    setInputNewPassword2Value(e.target.value);
  }
  return (
    <div className={`nc-AccountPage ${className}`} data-nc-id="AccountPage">
      <Helmet>
        <title>Editar Perfil</title>
      </Helmet>
      <div className="max-w-4xl mx-auto pt-14 sm:pt-26 pb-24 lg:pb-32">
        <div className="space-y-10 sm:space-y-12">
          {/* HEADING */}
          <div className="flex flex-col md:flex-row">
            <div className="flex-shrink-0 flex justify-center sm:justify-start items-start">
              {/* AVATAR */}
              <div className="relative rounded-full overflow-hidden flex">
                <img
                  src={selectedImage||urlProfilePictureUser}
                  alt=""
                  className="w-32 h-32 rounded-full object-cover z-0"
                />
                <label htmlFor="imageInput" className="absolute inset-0 bg-black bg-opacity-60 flex flex-col items-center justify-center text-neutral-50 cursor-pointer">
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
                  className="absolute inset-0 opacity-0 cursor-pointer"
                  accept=".png, .jpg, .jpeg"
                  onChange={handleImageChange}
                />
              </div>
            </div>
            <div className="flex-grow mt-10 md:mt-0 md:pl-16 px-5 sm:px-0 max-w-3xl space-y-6">
              <div className="flex flex-col border border-slate-300 px-6 pb-6 pt-4 rounded-lg">
                <h1 className="block text-lg sm:text-xl lg:text-2xl font-semibold text-start pt-2">Cambiar contraseña</h1>
                <div className="flex flex-col gap-6 mt-4 items-start">
                  <div className="w-full">
                    <label htmlFor="current-password">Contraseña actual</label>
                    <div className="mt-1.5 flex items-center">
                      <span className="inline-flex h-[44px] items-center px-2.5 rounded-l-2xl border border-r-0 border-neutral-400 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400 text-sm">
                        <i className="text-2xl las la-lock"></i>
                      </span>
                      <div className="relative w-full">
                        <Input
                          id="current-password"
                          type={showCurrentPassword ? 'text' : 'password'}
                          className="!rounded-l-none h-[44px] border-neutral-400 pl-4 pr-12"
                          value={inputCurrentPasswordValue}
                          onChange={handleInputCurrentPassword}
                        />
                        {inputCurrentPasswordValue && (
                          <button
                            onClick={toggleShowCurrentPassword}
                            type="button"
                            aria-label={showCurrentPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                            className="focus:outline-none absolute top-1/2 right-5 -translate-y-1/2"
                          >
                            {showCurrentPassword ? (
                              <img src={iconEyeVisible} alt="Ocultar contraseña" width={24}/>
                            ) : (
                              <img src={iconEyeInvisible} alt="Mostrar contraseña" width={24}/>
                            )}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="w-full">
                    <label htmlFor="new-password">Contraseña nueva</label>
                    <div className="mt-1.5 flex items-center">
                      <span className="inline-flex h-[44px] items-center px-2.5 rounded-l-2xl border border-r-0 border-neutral-400 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400 text-sm">
                        <i className="text-2xl las la-lock"></i>
                      </span>
                      <div className="relative w-full">
                        <Input
                          id="new-password"
                          type={showNewPassword ? 'text' : 'password'}
                          className="!rounded-l-none h-[44px] border-neutral-400 pl-4 pr-12"
                          value={inputNewPasswordValue}
                          onChange={handleInputNewPasswordValue}
                        />
                        {inputNewPasswordValue && (
                          <button
                            onClick={toggleShowNewPassword}
                            type="button"
                            aria-label={showCurrentPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                            className="focus:outline-none absolute top-1/2 right-5 -translate-y-1/2"
                          >
                            {showNewPassword ? (
                              <img src={iconEyeVisible} alt="Ocultar contraseña" width={24}/>
                            ) : (
                              <img src={iconEyeInvisible} alt="Mostrar contraseña" width={24}/>
                            )}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="w-full">
                    <label htmlFor="new-password2">Repetir contraseña nueva</label>
                    <div className="mt-1.5 flex items-center">
                      <span className="inline-flex h-[44px] items-center px-2.5 rounded-l-2xl border border-r-0 border-neutral-400 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400 text-sm">
                        <i className="text-2xl las la-lock"></i>
                      </span>
                      <div className="relative w-full">
                        <Input
                          id="new-password2"
                          type={showNewPassword2 ? 'text' : 'password'}
                          className="!rounded-l-none h-[44px] border-neutral-400 pl-4 pr-12"
                          value={inputNewPassword2Value}
                          onChange={handleInputNewPassword2Value}
                        />
                        {inputNewPassword2Value && (
                          <button
                            onClick={toggleShowNewPassword2}
                            type="button"
                            aria-label={showCurrentPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                            className="focus:outline-none absolute top-1/2 right-5 -translate-y-1/2"
                          >
                            {showNewPassword2 ? (
                              <img src={iconEyeVisible} alt="Ocultar contraseña" width={24}/>
                            ) : (
                              <img src={iconEyeInvisible} alt="Mostrar contraseña" width={24}/>
                            )}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-center w-full">
                    <ButtonSecondary className="border border-slate-300 sm:h-[44px]"><p className="whitespace-nowrap" onClick={handleUpdatePasswordButtonClick}>Cambiar contraseña</p></ButtonSecondary>
                  </div>
                </div>
              </div>
              <div className=" border border-slate-300 dark:border-neutral-700 px-6 pb-10 pt-4 rounded-lg space-y-6">
                <h1 className="block text-lg sm:text-xl lg:text-2xl font-semibold text-start pt-2">Editar datos de usuarios</h1>
                <div>
                  <Label>Tipo de documento</Label>
                  <div className="mt-1.5 flex items-center">
                    <span className="inline-flex h-[44px] items-center px-2.5 rounded-l-2xl border border-r-0 border-neutral-400 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400 text-sm">
                      <i className="text-2xl las la-address-card"></i>
                    </span>
                    <Select className="max-w-[265px] !rounded-l-none h-[44px] border-neutral-400" value={selectedDocumentType} onChange={(e) => setSelectedDocumentType(e.target.value)}>
                      <option value="">Seleccionar...</option>
                      <option value="DNI">DNI</option>
                      <option value="Pasaporte">Pasaporte</option>
                    </Select>
                  </div>
                </div>
                <div>
                  <Label>Documento</Label>
                  <div className="mt-1.5 flex items-center">
                    <span className="inline-flex h-[44px] items-center px-2.5 rounded-l-2xl border border-r-0 border-neutral-400 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400 text-sm">
                      <i className="text-2xl las la-id-card"></i>
                    </span>
                    <Input type="text" className="!rounded-l-none h-[44px] border-neutral-400" value={numberDocumentType} onChange={(e) => setNumberDocumentType(e.target.value)} />
                  </div>
                </div>
                <div>
                  <Label>Nombres</Label>
                  <div className="mt-1.5 flex items-center">
                    <span className="inline-flex h-[44px] items-center px-2.5 rounded-l-2xl border border-r-0 border-neutral-400 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400 text-sm">
                      <i className="text-2xl las la-user"></i>
                    </span>
                    <Input type="text" className="!rounded-l-none h-[44px] border-neutral-400" value={namesUser} onChange={(e) => setNamesUser(e.target.value)}/>
                  </div>
                </div>
                <div>
                  <Label>Apellidos</Label>
                  <div className="mt-1.5 flex items-center">
                    <span className="inline-flex h-[44px] items-center px-2.5 rounded-l-2xl border border-r-0 border-neutral-400 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400 text-sm">
                      <i className="text-2xl las la-user"></i>
                    </span>
                    <Input type="text" className="!rounded-l-none h-[44px] border-neutral-400" value={lastNameUser} onChange={(e) => setLastNameUser(e.target.value)}/>
                  </div>
                </div>
                <div className="max-w-lg">
                  <Label>Fecha de Nacimiento</Label>
                  <div className="mt-1.5 flex w-full max-w-[308px]">
                    <span className="inline-flex items-center px-2.5 rounded-l-2xl border border-r-0 border-neutral-400 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400 text-sm">
                      <i className="text-2xl las la-calendar"></i>
                    </span>
                    <Input
                      className="!rounded-l-none border-neutral-400"
                      type="date"
                      value={birthDateUser}
                      onChange={handleDateChange}
                    />
                  </div>
                </div>
                <div>
                  <Label>Correo</Label>
                  <div className="mt-1.5 flex">
                    <span className="inline-flex items-center px-2.5 rounded-l-2xl border border-r-0 border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400 text-sm">
                      <i className="text-2xl las la-envelope"></i>
                    </span>
                    <Input
                      type="email"
                      className="!rounded-l-none"
                      placeholder="example@email.com"
                      defaultValue={emailUser}
                      onChange={(e) => setEmailUser(e.target.value)}
                    />
                  </div>
                </div>
                {/* ---- */}
                <div>
                  <Label>Nombre de Reconocimiento</Label>
                  <div className="mt-1.5 flex">
                    <span className="inline-flex items-center px-2.5 rounded-l-2xl border border-r-0 border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400 text-sm">
                      <i className="text-2xl las la-envelope"></i>
                    </span>
                    <Input
                      type="text"
                      className="!rounded-l-none"
                      defaultValue={nameRecognition}
                      onChange={(e) => setNameRecognition(e.target.value)}
                    />
                  </div>
                </div>
                <div>
                  <Label>Mayorista Preferente</Label>
                  <div className="mt-1.5 flex">
                    <span className="inline-flex items-center px-2.5 rounded-l-2xl border border-r-0 border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400 text-sm">
                      <i className="text-2xl las la-envelope"></i>
                    </span>
                    <Select className="max-w-[265px] !rounded-l-none h-[44px]" value={storeForShoppingValue} onChange={handleStoresForShopping}>
                      <option value="0">Seleccionar...</option>
                      {storesForShopping.map((item: any) => (
                        <option key={item.storeId} value={item.storeId}>
                          {item.storeName}
                        </option>
                      ))}
                    </Select>
                  </div>
                </div>
                {/* ---- */}
                <div>
                  <Label>País</Label>
                  <div className="mt-1.5 flex items-center">
                    <span className="inline-flex h-[44px] items-center px-2.5 rounded-l-2xl border border-r-0 border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400 text-sm">
                      <i className="text-2xl las la-globe"></i>
                    </span>
                    <Select className="max-w-[265px] !rounded-l-none h-[44px]" defaultValue={countryUser} onChange={(e) => setCountryUser(e.target.value)}>
                      <option value="1">Perú</option>
                    </Select>
                  </div>
                </div>
                <div>
                  <Label>Departamento</Label>
                  <div className="mt-1.5 flex items-center">
                    <span className="inline-flex h-[44px] items-center px-2.5 rounded-l-2xl border border-r-0 border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400 text-sm">
                      <i className="text-2xl las la-city"></i>
                    </span>
                    <Select className="max-w-[265px] !rounded-l-none h-[44px]" value={departamentUser} onChange={handleDepartmentChange}>
                      <option value="0">Seleccionar...</option>
                      {departaments.map((departamento: any) => (
                        <option key={departamento.departmentId} value={departamento.departmentId}>
                          {departamento.description}
                        </option>
                      ))}
                    </Select>
                  </div>
                </div>
                <div>
                  <Label>Provincia</Label>
                  <div className="mt-1.5 flex items-center">
                    <span className="inline-flex h-[44px] items-center px-2.5 rounded-l-2xl border border-r-0 border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400 text-sm">
                      <i className="text-2xl las la-building"></i>
                    </span>
                    <Select className="max-w-[265px] !rounded-l-none h-[44px]" value={provinceUser} onChange={handleProvinceChange}>
                      <option value="0">Seleccionar...</option>
                      {
                        provinces.map((province: any) => (
                          <option key={province.provinceId} value={province.provinceId}>
                            {province.description}
                          </option>
                        ))
                      }
                    </Select>
                  </div>
                </div>
                <div>
                  <Label>Distrito</Label>
                  <div className="mt-1.5 flex items-center">
                    <span className="inline-flex h-[44px] items-center px-2.5 rounded-l-2xl border border-r-0 border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400 text-sm">
                      <i className="text-2xl las la-home"></i>
                    </span>
                    <Select className="max-w-[265px] !rounded-l-none h-[44px]" value={districtUser} onChange={(e) => setDistrictUser(parseInt(e.target.value, 10))}>
                      <option value="0">Seleccionar...</option>
                      {
                        districts.map((district: any) => (
                          <option key={district.districtId} value={district.districtId}>
                            {district.description}
                          </option>
                        ))
                      }
                    </Select>
                  </div>
                </div>
                <div>
                  <Label>Dirección</Label>
                  <div className="mt-1.5 flex">
                    <span className="inline-flex items-center px-2.5 rounded-l-2xl border border-r-0 border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400 text-sm">
                      <i className="text-2xl las la-map-signs"></i>
                    </span>
                    <Input
                      type="text"
                      className="!rounded-l-none"
                      defaultValue={addressUser}
                      onChange={(e) => setAddressUser(e.target.value)}
                    />
                  </div>
                </div>

                {/* ---- */}

                <div>
                  <Label>Celular</Label>
                  <div className="mt-1.5 flex">
                    <span className="inline-flex items-center px-2.5 rounded-l-2xl border border-r-0 border-neutral-400 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400 text-sm">
                      <i className="text-2xl las la-phone-volume"></i>
                    </span>
                    <Input
                      type="text"
                      className="!rounded-l-none border-neutral-400"
                      value={phoneUser}
                      onChange={(e) => setPhoneUser(e.target.value)}
                    />
                  </div>
                </div>
                <div>
                  <Label>Ubigeo</Label>
                  <div className="mt-1.5 flex">
                    <span className="inline-flex items-center px-2.5 rounded-l-2xl border border-r-0 border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400 text-sm">
                      <i className="text-2xl las la-map"></i>
                    </span>
                    <Input
                      type="text"
                      className="!rounded-l-none"
                      defaultValue={ubigeoUser}
                      onChange={(e) => setUbigeoUser(e.target.value)}
                    />
                  </div>
                </div>
              </div>
              {/* ---- */}
              <div className="pt-10 flex justify-center">
                <ButtonPrimary onClick={handleUpdateButtonClick}>Actualizar</ButtonPrimary>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountPage;
