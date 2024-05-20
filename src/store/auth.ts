import { create } from "zustand";
interface CounterState {
  count: number;
  isLoggedIn: boolean;
  dataIsLoggedIn: USER_AUTH;
  userDataForAvatarDropdown: UserDataForAvatarDropdown;
  setUserDataForAvatarDropdown: (userData: UserDataForAvatarDropdown) => void;
  clearUserDataForAvatarDropdown: () => void;
  increment: () => void;
  decrement: () => void;
  handleLogin: () => void;
  handleLogout: () => void;
  purchaseData: PurchaseData;
  setPurchaseData: (data: PurchaseData) => void;
  purchaseSuccess: () => void;
  updateNamesAndLastName: (data1: string, data2: string) => void;
  updateNamesAndLastNameAndImg: (data1: string, data2: string, data3: string) => void;
}
interface PurchaseData {
  userId: number;
  grossAmount: number;
  netAmount: number;
  realPoints: number;
  promotionPoints: number;
  quantity: number;
  storeId: number;
  statusPurchase: string;
  typePurchase: string;
  receipt: string;
  documentReceipt: string;
  typeDocumentReceipt: string;
  typePayment: string;
  purchaseDetail: any[]; // Ajusta el tipo según la estructura real de purchaseDetail
}
interface USER_AUTH {
  document: string;
  lastName: string;
  names: string;
  typeClient: string;
  userId: number;
}
interface UserDataForAvatarDropdown {
  imageUrl: string;
  lastName: string;
  names: string;
}

export const useCounterStore = create<CounterState>((set) => {
  const getPurchaseDataFromLocalStorage = (): PurchaseData => {
    const purchaseData = localStorage.getItem('purchaseData');
    
    return purchaseData!! ? JSON.parse(purchaseData) : null;
  };
  // Función para obtener los datos del usuario para el avatar dropdown desde el localStorage
  const getUserDataForAvatarDropdownFromLocalStorage = (): UserDataForAvatarDropdown => {
    const userDataForAvatarDropdownString = localStorage.getItem('userDataForAvatarDropdown');
    return userDataForAvatarDropdownString ? JSON.parse(userDataForAvatarDropdownString) : { imageUrl: '', lastName: '', names: '' };
  };
  // Nueva función para actualizar names y lastName de UserDataForAvatarDropdown
  const updateUserDataForAvatarDropdown = (names: string, lastName: string) => {
    set((state) => ({
      ...state,
      userDataForAvatarDropdown: { ...state.userDataForAvatarDropdown, names, lastName },
    }));
    // Actualiza los datos en localStorage
    const userDataString = localStorage.getItem("userDataForAvatarDropdown");
    if (userDataString) {
      const userData = JSON.parse(userDataString);
      localStorage.setItem(
        "userDataForAvatarDropdown",
        JSON.stringify({ ...userData, names, lastName })
      );
    }
  };
  // Nueva función para actualizar names y lastName de UserDataForAvatarDropdown
  const updateUserDataForAvatarDropdownWithImg = (names: string, lastName: string, imageUrl: string) => {
    set((state) => ({
      ...state,
      userDataForAvatarDropdown: { ...state.userDataForAvatarDropdown, names, lastName, imageUrl },
    }));
    // Actualiza los datos en localStorage
    const userDataString = localStorage.getItem("userDataForAvatarDropdown");
    if (userDataString) {
      const userData = JSON.parse(userDataString);
      localStorage.setItem(
        "userDataForAvatarDropdown",
        JSON.stringify({ ...userData, names, lastName, imageUrl })
      );
    }
  };
  return {
    count: 0,

    isLoggedIn: localStorage.getItem('USER_AUTH') ? true : false,

    dataIsLoggedIn: localStorage.getItem('USER_AUTH')!! ? JSON.parse(localStorage.getItem('USER_AUTH')!) : {},

    userDataForAvatarDropdown: getUserDataForAvatarDropdownFromLocalStorage(),

    // Modificador de estado para establecer los datos del usuario para el avatar dropdown
    setUserDataForAvatarDropdown: (userData: UserDataForAvatarDropdown) => {
      set((state) => ({ ...state, userDataForAvatarDropdown: userData }));
      localStorage.setItem('userDataForAvatarDropdown', JSON.stringify(userData)); // Guardar en localStorage
    },

    // Modificador de estado para borrar los datos del usuario para el avatar dropdown
    clearUserDataForAvatarDropdown: () => {
      set((state) => ({ ...state, userDataForAvatarDropdown: { imageUrl: '', lastName: '', names: '' } }));
      localStorage.removeItem('userDataForAvatarDropdown'); // Eliminar del localStorage
    },

    updateNamesAndLastName: (names: string, lastName: string) => {
      updateUserDataForAvatarDropdown(names, lastName);
    },

    updateNamesAndLastNameAndImg: (names: string, lastName: string, nameImageUrl: string) => {
      const imageUrl = `https://api.yosoymitosis.com/StaticFiles/ProfileImg/${nameImageUrl}`
      updateUserDataForAvatarDropdownWithImg(names, lastName, imageUrl);
    },

    increment: () => {
      set((state) => ({ ...state, count: state.count + 1 }));
    },

    decrement: () => {
      set((state) => ({ ...state, count: state.count - 1 }));
    },

    handleLogin: () => {
      set((state) => ({ ...state, isLoggedIn: true }));
    },

    handleLogout: () => {
      const initialPurchaseData = {
        userId: 0,
        grossAmount: 0,
        netAmount: 0,
        realPoints: 0,
        promotionPoints: 0,
        quantity: 0,
        storeId: 0,
        statusPurchase: "",
        typePurchase: "",
        receipt: "",
        documentReceipt: "",
        typeDocumentReceipt: "",
        typePayment: "",
        purchaseDetail: [],
      };
      // Elimina los elementos del localStorage
      localStorage.removeItem('StoresForShopping');
      localStorage.removeItem('TypePurchase');
      localStorage.removeItem('carritoLength');

      // Establecer el nuevo purchaseData en el localStorage
      localStorage.setItem('purchaseData', JSON.stringify(initialPurchaseData))

      // Actualiza el estado isLoggedIn
      set((state) => ({ ...state, isLoggedIn: false }));

      // Elimina el item del localStorage
      localStorage.removeItem('userDataForAvatarDropdown');
      localStorage.removeItem('USER_AUTH');

      window.location.href = "/login";
    },

    purchaseData: getPurchaseDataFromLocalStorage(),
    setPurchaseData: (data) => { // Define la función para actualizar purchaseData
      set((state) => ({ ...state, purchaseData: data }));
      localStorage.setItem("purchaseData", JSON.stringify(data)); // Actualiza purchaseData en el localStorage
    },

    purchaseSuccess: () => {    // Obtiene el purchaseData actual del localStorage
      const purchaseDataString = localStorage.getItem('purchaseData');
      const USER_AUTH_String = localStorage.getItem('USER_AUTH');
      if (purchaseDataString && USER_AUTH_String) {
        const USER_AUTH = JSON.parse(USER_AUTH_String);
        // Extrae el userId actual
        const userId = USER_AUTH.userId;
        const initialPurchaseData = {
          userId: userId,
          grossAmount: 0,
          netAmount: 0,
          realPoints: 0,
          promotionPoints: 0,
          quantity: 0,
          storeId: 0,
          statusPurchase: "",
          typePurchase: "",
          receipt: "",
          documentReceipt: "",
          typeDocumentReceipt: "",
          typePayment: "",
          purchaseDetail: [],
        };
        // Establece el nuevo purchaseData en el localStorage
        localStorage.setItem('purchaseData', JSON.stringify(initialPurchaseData));
      }
      // Elimina los elementos del localStorage
      localStorage.removeItem('StoresForShopping');
      localStorage.removeItem('TypePurchase');
      localStorage.removeItem('carritoLength');
    },
  };
});