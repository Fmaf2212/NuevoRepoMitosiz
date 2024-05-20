import axios from "axios";
import React, { useEffect, useState } from "react";
import ButtonPrimary from "shared/Button/ButtonPrimary";
import Select from "shared/Select/Select";
import { BEARER_TOKEN } from "../../../src/store/config";
import CountUp from "react-countup";
import { motion } from "framer-motion";
import { useCounterStore } from "store/auth";
import Swal from "sweetalert2";
import { Helmet } from "react-helmet-async";

const Commissions = () => {
  const [totalCommission, setTotalCommission] = useState(0);
  const [historicalCommission, setHistoricalCommission] = useState(0);
  const [patronBonus, setPatronBonus] = useState(0);
  const [retirementBonus, setRetirementBonus] = useState(0);
  const [rtiBonus, setRtiBonuss] = useState(0);
  const [detailPatronBonus, setDetailPatronBonus] = useState(null);
  const [detailRetirementBonus, setDetailRetirementBonus] = useState(null);
  //---------------------------------------------------------------
  const [options, setOptions] = useState([]);
  const [selectedPeriod, setSelectedPeriod] = useState("0");
  const [showNumberComisiónHistórica, setShowNumberComisiónHistórica] =
    useState(true);
  const [showNumberComisiónActual, setShowNumberComisiónActual] =
    useState(true);
    const [user, setUser] = useState({}); // Usuario obtenido de localStorage
  //---------------------------------------------------------------
    const dataIsLoggedIn = useCounterStore((state) => state.dataIsLoggedIn);
    const valor = localStorage.getItem('USER_AUTH') ?? 'valor_por_defecto';
  useEffect(() => {
    // Verificar si el usuario está autenticado, de lo contrario, redirigir al Login
    if (valor==="valor_por_defecto") {
      window.location.href = '/login';
    }
  }, [dataIsLoggedIn]);

  const handleCountComisiónHistóricaUpEnd = () => {
    setTimeout(() => {
      setShowNumberComisiónHistórica(false);
      setTimeout(() => {
        setShowNumberComisiónHistórica(true);
        setTimeout(() => {
          setShowNumberComisiónHistórica(false);
          setTimeout(() => {
            setShowNumberComisiónHistórica(true);
          }, 300);
        }, 300);
      }, 300);
    }, 100);
  };
  const handleCountComisiónActualUpEnd = () => {
    setTimeout(() => {
      setShowNumberComisiónActual(false);
      setTimeout(() => {
        setShowNumberComisiónActual(true);
        setTimeout(() => {
          setShowNumberComisiónActual(false);
          setTimeout(() => {
            setShowNumberComisiónActual(true);
          }, 300);
        }, 300);
      }, 300);
    }, 100);
  };

  const userData = JSON.parse(localStorage.getItem("USER_AUTH") || "{}");
  useEffect(() => {
    const fetchDataNetworkPeriodForMLM = async () => {
      try {
        const response = await axios.get(
          "https://api.yosoymitosis.com/v1/ComissionPeriod/GetComissionPeriodForComission",
          {
            headers: {
              Authorization: `Bearer ${BEARER_TOKEN}`,
            },
          }
        );
        const options = response.data.data;
        // Encontrar el periodo mayor
        const maxPeriod = Math.max(...options.map((option:any) => option.commissionPeriodId));
        setSelectedPeriod(maxPeriod.toString()); // Seleccionar el periodo mayor
        //options.sort((a: any, b: any) => a.commissionPeriodId - b.commissionPeriodId);
        setOptions(options);
        // Ejecutar GetCommissionByUser con el periodo mayor
        fetchDataCommissionByUser(maxPeriod.toString());
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchDataNetworkPeriodForMLM();

    const fetchDataCommissionByUser = async (maxPeriod: any) => {
      console.log(userData.userId)
      console.log(maxPeriod)
      try {
        const response = await axios.post(
          'https://api.yosoymitosis.com/v1/UserCommission/GetCommissionByUser',
          {
            userId: userData.userId,
            commissionPeriodId: maxPeriod,
          },
          {
            headers: {
              Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjoibWl0b3NpekFwaSIsInBhc3N3b3JkIjoiQG1pdG9zaXo5NiIsImF1ZCI6IkZyb250TWl0b3NpeiJ9.PjRxNwguwkC6I_Qtlo6XLy1686QFyU5L2QroleKQAX0',
            },
          }
        );
        setTotalCommission(response.data.data.totalCommission);
        setHistoricalCommission(response.data.data.historicalCommission);
        setPatronBonus(response.data.data.patronBonus);
        setRetirementBonus(response.data.data.retirementBonus);
        setRtiBonuss(response.data.data.rtiBonus);
        setDetailPatronBonus(response.data.data.detailPatronBonus);
        setDetailRetirementBonus(response.data.data.detailRetirementBonus);
      } catch (error) {
        console.error('Error al obtener el bono de patrocinio:', error);
      }
    };
  }, []);

  const fetchDataCommissionByUser = async (commissionPeriodId: any) => {
    if(selectedPeriod==="0"){
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: 'Debe seleccionar un periodo.',
      });
    }else{
      try {
        const response = await axios.post(
          'https://api.yosoymitosis.com/v1/UserCommission/GetCommissionByUser',
          {
            userId: userData.userId, // Obtener el userId del localStorage
            commissionPeriodId: commissionPeriodId,
          },
          {
            headers: {
              Authorization: `Bearer ${BEARER_TOKEN}`,
            },
          }
        );
        // Aquí actualizas tus estados con la información obtenida
        setTotalCommission(response.data.data.totalCommission);
        setHistoricalCommission(response.data.data.historicalCommission);
        setPatronBonus(response.data.data.patronBonus);
        setRetirementBonus(response.data.data.retirementBonus);
        setRtiBonuss(response.data.data.rtiBonus);
        setDetailPatronBonus(response.data.data.detailPatronBonus);
        setDetailRetirementBonus(response.data.data.detailRetirementBonus);
      } catch (error) {
        console.error('Error al obtener el bono de patrocinio:', error);
      }
    }
  };

  const handleUpdateButtonClick = () => {
    fetchDataCommissionByUser(selectedPeriod);
  };
  return (
    <div className="">
      <Helmet>
        <title>Comisiones</title>
      </Helmet>
      <div className="container w-fit sm:w-full border border-slate-200 dark:border-slate-700 sm:border-none rounded-2xl justify-center flex flex-col sm:flex-row items-center gap-6 sm:gap-8 p-6 mt-7">
        <div className="flex items-center gap-8">
          <span>Comisión:</span>
          <Select
            className="max-w-[265px] h-[44px]"
            value={selectedPeriod}
            required
            onChange={(e) => setSelectedPeriod(e.target.value)}
          >
            <option value="0">Seleccionar...</option>
            {options.map((option: any) => (
              <option
                key={option.commissionPeriodId}
                value={option.commissionPeriodId}
              >
                {option.periodName}
              </option>
            ))}
          </Select>
        </div>
        <div>
          <ButtonPrimary
            className="sm:pt-2 sm:pb-2"
            onClick={handleUpdateButtonClick}
          >
            Filtrar
          </ButtonPrimary>
        </div>
      </div>
      <div className="container flex flex-col sm:flex-row justify-around mt-14 gap-6 sm:gap-0">
        <div className="flex flex-col lg:flex-row items-center gap-4 lg:gap-8">
          <h2 className="flex flex-col items-center text-2xl">
            Comisión Histórica
          </h2>
          <span
            className="text-4xl mt-0 text-[#6200bb]"
            style={{ position: "relative" }}
          >
            S/.&nbsp;
            <motion.span
              initial={{ opacity: 1, scale: 1 }}
              animate={
                showNumberComisiónHistórica
                  ? { opacity: 1, scale: [1, 1.2, 1] }
                  : { opacity: 0 }
              }
              transition={{ duration: 0.3 }}
              style={{ display: "inline-block", position: "relative" }}
            >
              <CountUp
                start={0.5}
                end={historicalCommission}
                duration={2}
                separator=","
                onEnd={handleCountComisiónHistóricaUpEnd}
                decimals={1}
                decimal="."
              />
            </motion.span>
          </span>
        </div>
        <div className="flex flex-col lg:flex-row items-center gap-4 lg:gap-8">
          <h2 className="flex flex-col items-center text-2xl">
            Comisión Actual
          </h2>
          <span
            className="text-4xl mt-0 text-[#6200bb]"
            style={{ position: "relative" }}
          >
            S/.&nbsp;
            <motion.span
              initial={{ opacity: 1, scale: 1 }}
              animate={
                showNumberComisiónActual
                  ? { opacity: 1, scale: [1, 1.2, 1] }
                  : { opacity: 0 }
              }
              transition={{ duration: 0.3 }}
              style={{ display: "inline-block", position: "relative" }}
            >
              <CountUp
                start={0}
                end={totalCommission}
                duration={2}
                separator=","
                onEnd={handleCountComisiónActualUpEnd}
                decimals={1}
                decimal="."
              />
            </motion.span>
          </span>
        </div>
      </div>
      <div className="container flex flex-col sm:flex-row justify-evenly items-center mt-14 gap-4">
        <div className="h-16 w-64 border-2 border-primaryMitosiz bg-white flex justify-center items-center text-center">
          <h4>
            Bono Patrocinio <br />
            <span>S/. {patronBonus.toFixed(2)}</span>
          </h4>
        </div>
        <div className="h-16 w-64 border-2 border-primaryMitosiz bg-white flex justify-center items-center text-center">
          <h4>
            Bono Jubilación <br />
            <span>S/. {retirementBonus.toFixed(2)}</span>
          </h4>
        </div>
        <div className="h-16 w-64 border-2 border-primaryMitosiz bg-white flex justify-center items-center text-center">
          <h4>
            Bono RTI <br />
            <span>S/. {rtiBonus.toFixed(2)}</span>
          </h4>
        </div>
      </div>
      <div className="container mt-14 flex flex-col lg:flex-row justify-evenly gap-4">
        <div className="min-w-full sm:min-w-[500px]">
          <div
            className="inline-block relative w-full border border-slate-300 dark:border-slate-700 rounded-md text-black bg-white"
            style={{ margin: "37px 0" }}
          >
            <div
              className="float-left p-4 text-white shadow-xl mx-[15px] mt-[-20px] mb-0 rounded-md bg-primaryMitosiz relative z-10 border border-b-[1px] border-[rgba(0,0,0,.125)]"
              data-background-color="cadetblue"
            >
              <i className="las la-address-book text-[40px]"></i>
            </div>
            <h3 className="mt-4 mb-[5px] text-[1.6em]">Bono Patrocinio</h3>
            <div className="py-[15px] px-5 relative mt-6">
              <div className="border-none block w-full md:overflow-x-auto overflow-y-hidden">
                <table className="mb-0 w-auto sm:w-full max-w-full bg-transparent">
                  <thead>
                    <tr>
                      <th className="text-center">Nivel</th>
                      <th className="text-center">Monto </th>
                      <th className="text-center">Porcentaje %</th>
                    </tr>
                  </thead>
                  <tbody>
                    {detailPatronBonus &&
                      Object.keys(detailPatronBonus)
                      .filter((key) => key !== 'detailPatronBonusId' && key !== 'commissionId' && key !== 'level6')//para que no me liste detailPatronBonusId y commissionId
                      .map((key: any) => (//me mapea o recorre lo restante para rellenarlo en cada tr
                        <tr key={key} className={key % 2 === 0 ? 'bg-[#f9f9f9]' : 'bg-white'}>
                          <td className="text-center py-3 px-2">{key}</td>
                          <td className="text-center py-3 px-2">
                            <span id={`txtNivel${key}`}>{detailPatronBonus[key]}</span>
                          </td>
                          <td className="text-center py-3 px-2">%<span id={`txtPORAFI${key}`}></span></td>
                        </tr>
                      ))}
                    <tr className="">
                      <td colSpan={1}></td>
                      <td className="font-semibold text-lg pt-3 text-right">Monto Total:</td>
                      <td className="td-price">
                        <small></small>
                        <span id="txtSumaAfiliacion"></span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
        <div className="min-w-full sm:min-w-[500px]">
          <div
            className="inline-block relative w-full border border-slate-300 dark:border-slate-700 rounded-md text-black bg-white"
            style={{ margin: "37px 0" }}
          >
            <div
              className="float-left p-4 text-white shadow-xl mx-[15px] mt-[-20px] mb-0 rounded-md bg-primaryMitosiz relative z-10 border border-b-[1px] border-[rgba(0,0,0,.125)]"
              data-background-color="cadetblue"
            >
              <i className="las la-donate text-[40px]"></i>
            </div>
            <h3 className="mt-4 mb-[5px] text-[1.6em]">Bono Jubilación</h3>
            <div className="py-[15px] px-5 relative mt-6">
              <div className="border-none block w-full md:overflow-x-auto overflow-y-hidden">
                <table className="mb- w-auto sm:w-full max-w-full bg-transparent">
                  <thead>
                    <tr>
                      <th className="text-center">Nivel</th>
                      <th className="text-center">Monto </th>
                      <th className="text-center">Porcentaje %</th>
                    </tr>
                  </thead>
                  <tbody>
                  {detailRetirementBonus &&
                      Object.keys(detailRetirementBonus)
                      .filter((key) => key !== 'detailRetirementBonusId' && key !== 'commissionId' && key !== 'level10')//para que no me liste detailRetirementBonusId y commissionId
                      .map((key: any) => (//me mapea o recorre lo restante para rellenarlo en cada tr
                        <tr key={key} className={key % 2 === 0 ? 'bg-[#f9f9f9]' : 'bg-white'}>
                          <td className="text-center py-3 px-2">{key}</td>
                          <td className="text-center py-3 px-2">
                            <span id={`txtNivel${key}`}>{detailRetirementBonus[key]}</span>
                          </td>
                          <td className="text-center py-3 px-2">%<span id={`txtPORAFI${key}`}></span></td>
                        </tr>
                      ))}
                    <tr className="">
                      <td colSpan={1}></td>
                      <td className="font-semibold text-lg pt-3 text-right">Monto Total:</td>
                      <td className="td-price">
                        <small></small>
                        <span id="txtSumaAfiliacion"></span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Commissions;
