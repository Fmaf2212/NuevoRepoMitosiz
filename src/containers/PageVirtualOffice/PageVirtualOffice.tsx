import React, { useEffect, useState } from "react";
import SectionHero2 from "components/SectionHero/SectionHero2";
import ourFeatures from "../../images/our-features.png";
import CountUp from "react-countup";
import { motion } from "framer-motion";

import { useCounterStore } from "store/auth";
import { BEARER_TOKEN } from "../../../src/store/config";
import axios from "axios";

const Loader = () => (
  <div className="flex justify-center items-center bg-[#9333ea] p-4 rounded-lg shadow-md text-white text-xl h-24">
    Loading...
  </div>
);

const PageVirtualOffice = () => {
  const [showNumber, setShowNumber] = useState(true);
  const [loading, setLoading] = useState(true);

  const dataIsLoggedIn = useCounterStore((state) => state.dataIsLoggedIn);
  const valor = localStorage.getItem("USER_AUTH") ?? "valor_por_defecto";
  const USER_AUTH = JSON.parse(localStorage.getItem("USER_AUTH")!);

  const [historicalCommission, setHistoricalCommission] = useState(0);
  const [totalCommission, setTotalCommission] = useState(0);
  const [pp, setPp] = useState(0);
  const [vp, setVp] = useState(0);
  const [vg, setVg] = useState(0);
  const [currentRange, setCurrentRange] = useState(0);
  const [nextRange, setNextRange] = useState(0);
  const [currentPeriod, setCurrentPeriod] = useState(0);
  const [nextPeriod, setNextPeriod] = useState(0);
  const [startDateNextPeriod, setStartDateNextPeriod] = useState(0);

  const [countdown, setCountdown] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  // Obtener la fecha actual
  const currentDate = new Date();

  // Obtener la fecha de inicio del próximo período (ejemplo)
  const startDateNextPeriodConvert = new Date(startDateNextPeriod);

  // Calcular la diferencia de tiempo en milisegundos
  const timeDifference =
    startDateNextPeriodConvert.getTime() - currentDate.getTime();

  // Calcular los días, horas, minutos y segundos restantes
  const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
  const hours = Math.floor(
    (timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
  );
  const minutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((timeDifference % (1000 * 60)) / 1000);

  useEffect(() => {
    // Verificar si el usuario está autenticado, de lo contrario, redirigir al Login
    if (valor === "valor_por_defecto") {
      window.location.href = "/login";
    }
    const fetchData = async () => {
      try {
        const response = await axios.post(
          "https://api.yosoymitosis.com/v1/IndexData/GetIndexData",
          {
            userId: USER_AUTH.userId,
          },
          {
            headers: {
              Authorization: `Bearer ${BEARER_TOKEN}`,
            },
          }
        );
        setHistoricalCommission(response.data.data.historicalCommission);
        setTotalCommission(response.data.data.totalCommission);
        setPp(response.data.data.pp);
        setVp(response.data.data.vp);
        setVg(response.data.data.vg);
        setCurrentRange(response.data.data.currentRange);
        setNextRange(response.data.data.nextRange);
        setCurrentPeriod(response.data.data.currentPeriod);
        setNextPeriod(response.data.data.nextPeriod);
        setStartDateNextPeriod(response.data.data.startDateNextPeriod);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [dataIsLoggedIn]);

  useEffect(() => {
    // Actualizar el estado de la cuenta regresiva cada segundo
    const interval = setInterval(() => {
      setCountdown({
        days: days,
        hours: hours,
        minutes: minutes,
        seconds: seconds,
      });
      setLoading(false); // Marcar como finalizada la carga
    }, 1000);

    // Limpiar el intervalo cuando el componente se desmonta
    return () => clearInterval(interval);
  }, [days, hours, minutes, seconds]);

  const handleCountUpEnd = () => {
    setTimeout(() => {
      setShowNumber(false);
      setTimeout(() => {
        setShowNumber(true);
        setTimeout(() => {
          setShowNumber(false);
          setTimeout(() => {
            setShowNumber(true);
          }, 300);
        }, 300);
      }, 300);
    }, 100);
  };

  const tiempo = `${countdown.days
    .toString()
    .padStart(2, "0")} : ${countdown.hours
    .toString()
    .padStart(2, "0")} : ${countdown.minutes
    .toString()
    .padStart(2, "0")} : ${countdown.seconds.toString().padStart(2, "0")}`;
  const partes = tiempo.split(" : ");

  return (
    <div className="nc-PageHome relative overflow-hidden">
      <SectionHero2 />
      <div>
        <section className="container flex flex-col gap-4 py-10 md:flex-row md:justify-between md:mt-10">
          <div className="flex flex-col justify-center items-center md:items-start gap-4 mt-10 md:mt-0 mb-10 md:mb-0 w-full md:w-1/3 order-3 md:order-1">
            <div className="bg-gray-100 rounded-lg p-4 flex flex-col items-center space-y-2 w-full max-w-[240px] md:w-full">
              <span className="text-4xl font-bold text-[#6200bb]">{pp}</span>
              <p className="text-sm text-gray-500">Puntos Personales</p>
            </div>
            <div className="bg-gray-100 rounded-lg p-4 flex flex-col items-center space-y-2 w-full max-w-[240px] md:w-full">
              <span className="text-4xl font-bold text-[#6200bb]">{vp}</span>
              <p className="text-sm text-gray-500">Volumen Personal</p>
            </div>
            <div className="bg-gray-100 rounded-lg p-4 flex flex-col items-center space-y-2 w-full max-w-[240px] md:w-full">
              <span className="text-4xl font-bold text-[#6200bb]">{vg}</span>
              <p className="text-sm text-gray-500">Volumen Grupal</p>
            </div>
          </div>
          <div className="flex flex-col items-center w-full mt-4 md:mt-0 md:w-auto order-1 md:order-2">
            <div className="flex flex-col items-center">
              <h2 className="flex flex-col items-center text-2xl font-[600] font-[montserrat]">
                COMISIÓN <br />
                HISTÓRICA
              </h2>
              <span
                className="text-6xl mt-2 text-[#6200bb] font-[800] font-[montserrat]"
                style={{ position: "relative" }}
              >
                S/.&nbsp;
                <motion.span
                  initial={{ opacity: 1, scale: 1 }}
                  animate={
                    showNumber
                      ? { opacity: 1, scale: [1, 1.2, 1] }
                      : { opacity: 0 }
                  }
                  transition={{ duration: 0.3 }}
                  style={{ display: "inline-block", position: "relative" }}
                >
                  <CountUp
                    start={0}
                    end={historicalCommission}
                    duration={2}
                    separator=","
                    onEnd={handleCountUpEnd}
                  />
                </motion.span>
              </span>
              <p className="pt-6 pb-6">
                Comisión Actual: <span>{totalCommission}</span>
              </p>
            </div>
            <img
              src={ourFeatures}
              alt="ourFeatures"
              className="w-full md:w-96"
            />
          </div>
          <div className="md:w-1/3 order-2 md:order-3 flex justify-center md:justify-end">
            <div className="md:bg-gray-100 w-fit h-full flex flex-col items-center justify-center gap-4 py-4 mt-10 md:rounded-lg md:px-8 md:pl-10 md:mt-0 d:mt-0 m-0">
              <motion.div
                className="p-4 border-4 border-solid rounded-lg shadow-md bg-[#9333ea] text-white border-[#f7d909]"
                initial={{ scale: 1 }}
                animate={{
                  scale: [1, 1.1, 1],
                  boxShadow: [
                    "0px 0px 2px 1px #F7D909, inset 0px 0px 14px 6px #6200bb",
                    "0px 0px 6px 2px #F7D909, inset 0px 0px 16px 7px #6200bb",
                    "0px 0px 2px 1px #F7D909, inset 0px 0px 14px 6px #6200bb",
                  ],
                  transition: { duration: 1.5, repeat: Infinity },
                }}
              >
                <h4 className="text-lg font-semibold text-center">
                  {nextRange}
                </h4>
              </motion.div>
              <div className="flex flex-col justify-center items-center pt-4">
                <img
                  src="https://www.gifss.com/flechas/8.gif"
                  alt="flechas"
                  className="h-10 w-fit md:w-auto mt-4"
                  style={{ filter: "brightness(0%)" }}
                />
                <img
                  src="https://www.gifss.com/flechas/8.gif"
                  alt="flechas"
                  className="h-10 w-fit md:w-auto mt-4"
                  style={{ filter: "brightness(300%)" }}
                />
                <img
                  src="https://www.gifss.com/flechas/8.gif"
                  alt="flechas"
                  className="h-10 w-fit md:w-auto mt-4"
                  style={{ filter: "brightness(300%)" }}
                />
                <img
                  src="https://www.gifss.com/flechas/8.gif"
                  alt="flechas"
                  className="h-10 w-fit md:w-auto mt-4"
                  style={{ filter: "brightness(300%)" }}
                />
              </div>
              <section className="p-4 border border-solid rounded-lg w-[240px] shadow-md bg-white mt-8">
                <h4 className="text-lg font-semibold text-center">
                  {currentRange}
                </h4>
              </section>
            </div>
          </div>
        </section>
        <section className="container flex flex-col md:flex-row justify-center md:justify-around items-center md:items-end px-4 pt-20 md:pt-10 pb-20 gap-10 md:gap-4 w-full bg-gray-100 md:bg-white md:mt-10">
          <div className="bg-[#F7D909] p-4 rounded-lg shadow-md max-w-max md:w-full">
            <h4 className="text-md font-semibold">Periodo Actual:</h4>
            <span className="text-white text-2xl whitespace-nowrap">{currentPeriod}</span>
          </div>
          <div className="flex flex-col justify-center gap-5 w-full md:w-auto">
            <h4 className="text-lg font-semibold md:text-center -mb-4">
              Restan:
            </h4>
            {loading ? ( // Mostrar el loader si aún se está cargando la información
              <Loader />
            ) : (
              <div className="bg-[#9333ea] p-4 rounded-lg shadow-md text-white grid grid-cols-4 grid-rows-2 gap-y-2">
                {partes.map((parte, index) => (
                  <p
                    key={index}
                    className="text-center"
                    style={{ fontFamily: "DS-DIGIB", fontSize: "26px" }}
                  >
                    &nbsp;&nbsp;{parte}
                    &nbsp;&nbsp;&nbsp;&nbsp;{index !== partes.length - 1 && ":"}
                  </p>
                ))}
                <p className="text-center flex justify-around">
                  &nbsp;días<span></span>
                </p>
                <p className="text-center flex justify-around -ml-1">
                  &nbsp;horas<span></span>
                </p>
                <p className="text-center flex justify-around -ml-3">
                  &nbsp;minutos<span></span>
                </p>
                <p className="text-center flex justify-around -ml-0.5">
                  &nbsp;segundos<span></span>
                </p>
              </div>
            )}
          </div>
          <div className="bg-[#9333ea] p-4 rounded-lg shadow-md max-w-max md:w-full">
            <h4 className="text-md font-semibold">Periodo Siguiente:</h4>
            <span className="text-white text-2xl whitespace-nowrap">{nextPeriod}</span>
          </div>
        </section>
      </div>
    </div>
  );
};

export default PageVirtualOffice;
