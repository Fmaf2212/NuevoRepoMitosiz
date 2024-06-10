import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import Select from "shared/Select/Select";
import { BEARER_TOKEN } from "../../../src/store/config";
import axios from "axios";
import { useCounterStore } from "store/auth";
import Table from "./Table";
import "./networkMap.css"; // Importa el archivo CSS

interface UserNetworkData {
  line: number;
  userId: number;
  patronId: number;
  names: string;
  pp: number;
  vp: number;
  vpa: number;
  elite: number;
  vg: number;
  vq: number;
  range: string;
  maximumRange: string;
  networkQuantity: number;
  phone: string;
}

interface NetworkFeed {
  totalEntrepreneurs: number;
  activeEntrepreneurs: number;
  newEntrepreneurs: number;
  inactiveEntrepreneurs: number;
}

interface TableRow {
  IDSOCIO: number;
  IDUPLINE: number;
  RED: string;
  PP: string;
  // Otros campos según la estructura de datos
}
interface Props {
  data: TableRow[];
}

let numeral = 0;
let numeral2 = 0;
let intoNetworkAugmentation = 0;
let userIdEvaluation = 0;

const NetworkMap = () => {
  const [options, setOptions] = useState([]);
  // const [valueMaxPeriod, setValueMaxPeriod] = useState(0);
  const [selectedPeriod, setSelectedPeriod] = useState("0");
  const [linea, setLinea] = useState(0);
  const [userNetworkData, setUserNetworkData] = useState<UserNetworkData[]>([]);
  // const [patronNetworkData, setPatronNetworkData] = useState<UserNetworkData[]>([]);
  const dataIsLoggedIn = useCounterStore((state) => state.dataIsLoggedIn);
  const [totalEntrepreneurs, setTotalEntrepreneurs] = useState(0);
  const [activeEntrepreneurs, setActiveEntrepreneurs] = useState(0);
  const [newEntrepreneurs, setnewEntrepreneurs] = useState(0);
  const [inactiveEntrepreneurs, setInactiveEntrepreneurs] = useState(0);
  const valor = localStorage.getItem("USER_AUTH") ?? "valor_por_defecto";
  // const [clicked, setClicked] = useState(false);
  //----------------------------------------------------------------------------------
  // Declaración de estados con useState
  const [data, setData] = useState(null);
  // const [index, setIndex] = useState(0);
  const [tabla, setTabla] = useState(null);
  const [combo, setCombo] = useState("0");
  // const [uplines, setUplines] = useState([]);
  const [periodos, setPeriodos] = useState([]);
  let index = 0;
  let uplines: any = [];
  let minimisado = "";

  const sendDataAjax = async (period: any) => {
    console.log(period)
    try {
      const urlGetNetworkPeriodForMLM =
        "https://api.yosoymitosis.com/v1/NetworkPeriod/GetNetworkPeriodForMLM";
      const response = await axios.get(urlGetNetworkPeriodForMLM, {
        headers: {
          Authorization: `Bearer ${BEARER_TOKEN}`,
        },
      });
      setPeriodos(response.data.data);
      const networkPeriodIds = response.data.data.map(
        (period: any) => period.networkPeriodId
      );
      const maxNetworkPeriodId = (period!==null && period>0) ? selectedPeriod : Math.max(...networkPeriodIds);
      // numeral = numeral + 1;
      try {
        const cboPeriodo = document.getElementById(
          "cboPeriodo"
        ) as HTMLSelectElement | null;
        if (!cboPeriodo) {
          throw new Error("Elemento cboPeriodo no encontrado.");
        }
        const idperiodo = cboPeriodo.value || "0";
        const obj = {
          userId: JSON.parse(valor).userId,
          networkPeriodId: maxNetworkPeriodId.toString(),
        };
        // console.log(obj)
        const response = await axios.post(
          "https://api.yosoymitosis.com/v1/UserNetwork/GetUserNetwork",
          obj,
          {
            headers: {
              Authorization: `Bearer ${BEARER_TOKEN}`,
            },
          }
        );
        // console.log(response.data.data.networkFeed.totalEntrepreneurs)
        // Actualizar estado con los datos recibidos
        setData(response.data.data.userNetwork);
        setTotalEntrepreneurs(
          response.data.data.networkFeed.totalEntrepreneurs
        );
        setActiveEntrepreneurs(
          response.data.data.networkFeed.activeEntrepreneurs
        );
        setnewEntrepreneurs(response.data.data.networkFeed.newEntrepreneurs);
        setInactiveEntrepreneurs(
          response.data.data.networkFeed.inactiveEntrepreneurs
        );

        // Obtén la referencia a tu tabla
        const table = document.getElementById("tbl_red");
        // Verifica si la tabla existe

        const tableBody =
          document.querySelector<HTMLTableSectionElement>("#tbl_red tbody");
        // if (tableBody && numeral === 1)
        if (tableBody)
        {
          while (tableBody.firstChild) {
            tableBody.removeChild(tableBody.firstChild);
          }
        }
        var tbody_red = document.getElementById("tbody_red");
        // if (table && numeral === 1)
        if (table)
        {
          var tr = document.createElement("tr");
          // Itera sobre los datos y construye las filas
          // console.log("proceso");
          [response.data.data.userNetwork].forEach((item: any) => {
            tr.id = "tr" + item.userId;
            userIdEvaluation = item.userId;
            const displayStyle = item.userId === 0 ? "none" : "";
            // const colorStyle = item.pp < 30 ? "red" : "inherit";
            // Determina el color y el estilo de la fila basado en item.pp
            if (item.pp < 30) {
              tr.style.color = "red";
            } else if (item.pp > 150) {
              tr.style.color = "#6800d1";
              tr.style.fontWeight = "bold";
            } else {
              tr.style.color = "inherit";
              tr.style.fontWeight = "normal";
            }
            // Crea la fila y sus celdas
            // const row = document.createElement("tr");
            // tr.style.color = colorStyle;

            const cell1 = document.createElement("td");
            cell1.style.display = displayStyle;

            const button = document.createElement("button");
            button.id = `btn${item.patronId}`;
            button.value = "red";
            button.type = "button";
            button.title = "red";
            button.className = "btn style-button-red btn-redU cursor-pointer";
            button.style.outline = "none";
            button.style.boxShadow = "none";
            button.style.display =
              item.networkQuantity === 0 ? "none" : "inline-block";

            const label1 = document.createElement("label");
            label1.style.cursor = "pointer";
            label1.id = `sig${item.userId}`;
            label1.textContent = "▼";
            button.appendChild(label1);

            const label2 = document.createElement("label");
            label2.id = `lbl${item.userId}`;
            label2.textContent = "0";

            tr.innerHTML =
              "<td>" +
              (item.networkQuantity > 0
                ? '<button style="outline: none; box-shadow: none" id="btn' +
                  item.userId +
                  '" value="red" type="button" title="red" class="btn style-button-red btn-redU"><label style="cursor: pointer;" id="sig' +
                  item.userId +
                  '"/></button>': "")+'&nbsp;<label id="lbl' +
                  item.userId +
                  '">0</label>'
                 +
              "</td>" +
              "<td>" +
              item.userId +
              "</td>" +
              "<td>" +
              item.names +
              "</td>" +
              "<td>" +
              item.pp +
              "</td>" +
              "<td>" +
              item.elite +
              "</td>" +
              "<td>" +
              item.vp +
              "</td>" +
              "<td>" +
              item.vpa +
              "</td>" +
              "<td>" +
              item.vg +
              "</td>" +
              "<td>" +
              item.vq +
              "</td>" +
              "<td>" +
              item.range +
              "</td>" +
              "<td>" +
              item.maximumRange +
              "</td>" +
              //'<td>' + obj[i].Fecha + '</td>' +
              "<td>" +
              item.phone +
              "</td>" +
              '<td style ="display:none;">' +
              item.userId +
              "</td>";
          });
          // Agrega la fila a la tabla
          tbody_red!.appendChild(tr);
          const sigLabel = document.getElementById("sig" + response.data.data.userNetwork.userId);
          if (sigLabel) {
            sigLabel.textContent = "▼";
          }
        }
        // Obtener todos los elementos con la clase "btn-redU"
        const buttons = document.querySelectorAll(".btn-redU");
        const handleClick = (e: any) => {
          e.preventDefault();
          console.log("antes de obtener")
            const target = e.target;
            const row = target.closest("tr");
            if (row) {
              const table = row.closest("table");
              if (table) {
                index = row.rowIndex - 1;
              }
            }
            let idSocio = row.cells[1].innerHTML;
            let sigLabel = document.getElementById("sig" + idSocio);
            let lblLabel = document.getElementById("lbl" + idSocio);
            // if (sigLabel && lblLabel&& numeral2===0)
            if (sigLabel && lblLabel)
            {
              // numeral2 = numeral2+1;
              const BtnTexto = sigLabel.textContent;
              if (BtnTexto === "▼") {
                if (minimisado !== idSocio) {
                  sigLabel.textContent = "▲";
                  IncrementaRed(idSocio, index); // Define IncrementaRed según tu lógica
                } else {
                  sigLabel.textContent = "▲";
                  const showArray = ObtenerArrayUpline(idSocio); // Define ObtenerArrayUpline según tu lógica
                  showArray.forEach((item: any) => {
                    const trElement = document.getElementById(
                      "tr" + item.idSocio
                    );
                    if (trElement) trElement.style.display = "table-row";
                    const sigElement = document.getElementById(
                      "sig" + item.idSocio
                    );
                    if (sigElement){
                      sigElement.textContent = "▼";
                    }
                  });
                  // if(intoNetworkAugmentation >= 2 && userIdEvaluation != idSocio){
                  //   numeral2 = 0;
                  // }
                }
              } else {
                sigLabel.textContent = "▼";
                const elementsToHide = document.querySelectorAll(".c"+idSocio);
                elementsToHide.forEach((element) => {
                  if (element instanceof HTMLElement) {
                    element.style.display = "none";
                  }
                });
                minimisado= idSocio;
                // if(intoNetworkAugmentation >= 2 && userIdEvaluation != idSocio){
                //   numeral2 = 0;
                // }
                // Set minimisado according to your logic
              }
            }
            // else if(numeral2===1 || intoNetworkAugmentation < 2){
            //   numeral2 = 0;
            // }
        };
        // Agregar un event listener a cada botón para escuchar el clic y ejecutar la función handleButtonClick
        buttons.forEach((button) => {
          button.addEventListener("click", handleClick);
        });
        // Otros cambios en el estado según la respuesta
        const IncrementaRed = async (idSocio: any, index: any) =>{
          try {
            const response = await axios.post(
              "https://api.yosoymitosis.com/v1/UserNetwork/GetPatronNetwork",
              {
                patronId: idSocio,
                networkPeriodId: maxNetworkPeriodId.toString(),
              },
              {
                headers: {
                  Authorization: `Bearer ${BEARER_TOKEN}`,
                },
              }
            );
            // intoNetworkAugmentation++;
            // if(intoNetworkAugmentation >= 2){
            //   numeral2 = 0;
            // }
            const table = document.getElementById('tbl_red');
            const tbody = table!.querySelector('tbody');
            let linea = 0;
            let myArray:any = [];
            response.data.data.forEach((element:any) => {
              let tr = document.createElement("tr");
              const rows = tbody?.querySelectorAll('tr');
              let display = "";
              let style = "";
              let color = "";
              const lblPatron = document.getElementById("lbl" + element.patronId);
              if(lblPatron){
                let lblPatronText = lblPatron.textContent;
                linea = parseInt(lblPatronText!)+1
              }
              
              if(element.networkQuantity===0){
                display="display: none;";
                style = " margin-left:12.84px;";
              }else{
                display = "margin-left: -9px;outline: none;box-shadow: none;";
              }
              // const colorStyle = element.pp < 30 ? "red" : "inherit";
              // Determina el color y el estilo de la fila basado en item.pp
              if (element.pp < 30) {
                tr.style.color = "red";
              } else if (element.pp > 150) {
                tr.style.color = "#6800d1";
                tr.style.fontWeight = "bold";
              } else {
                tr.style.color = "inherit";
                tr.style.fontWeight = "normal";
              }

              tr.id = "tr" + element.userId;
              tr.innerHTML = '<td>' + '<button id="btn' + element.userId + '" style="' + display + '" value="red" type="button" title="red" class="btn btn-ft style-button-red btn-redU"><label style="cursor: pointer" id="sig' + element.userId + '"/></button>&nbsp;<label style="' + style + '" id="lbl' + element.userId + '">' + linea + '</label>' + '</td>' +
              '<td>' + element.userId + '</td>' +
              '<td>' + element.names + '</td>' +
              '<td>' + element.pp + '</td>' +
              '<td>' + element.elite + '</td>' +
              '<td>' + element.vp + '</td>' +
              '<td>' + element.vpa + '</td>' +
              '<td>' + element.vg + '</td>' +
              '<td>' + element.vq + '</td>' +
              '<td>' + element.range + '</td>' +
              '<td>' + element.maximumRange + '</td>' +
              '<td>' + element.phone + '</td>' +
              '<td style ="display:none;">' + element.patronId + '</td>';
              myArray.push({ idSocio: element.userId, idUpline: element.patronId });
              uplines.push({ idSocio: element.userId, idUpline: element.patronId });
              rows![index].insertAdjacentElement('afterend', tr);
              index++;
            });

            let upline = response.data.data[0].patronId;
            const bucle = [];

            while (upline !== "") {
              var Datos: any = {};
              Datos['id'] = upline;
              bucle.push(Datos);
              upline = ObtenerUpline(upline);
            }
            for (let i = 0; i < myArray.length; i++) {
              const idSocio = myArray[i].idSocio;
              const idUpline = myArray[i].idUpline;
            
              // $('#sig' + idSocio).text("▼");
              
              const lblSig = document.getElementById("sig" + idSocio);
              if(lblSig){
                lblSig.textContent = "▼";
              }
              const element = document.getElementById("tr" + idSocio);
              if (element) {
                const claseDinamica = "c" + idUpline;
                element.classList.add(claseDinamica);
                for (let d = 0; d < bucle.length; d++) {
                  element.classList.add("c" +bucle[d].id);
                }
              }
            }
            const buttonsRed = document.querySelectorAll(".btn-redU");
            buttonsRed.forEach((button) => {
              button.addEventListener("click", handleClick);
            });
          } catch (error) {
            console.error("Error fetching user network data:", error);
          }
        }
        // Expresiones de función
        var ObtenerUpline = function(dato: any) {
          var upline = uplines.filter(function (e: any) {
              return e.idSocio === dato;
          });
          if (upline.length === 0) { return ""; }
          return upline[0].idUpline;
        };

        var ObtenerArrayUpline = function(dato: any) {
          var upline = uplines.filter(function (e: any) {
              return e.idUpline == dato;
          });
          return upline;
        };
      } catch (error) {
        console.error("Error:", error);
      }
    } catch (error) {
      console.error("Error al obtener periodos:", error);
    }
  };

  // El resto de tu componente y lógica aquí
  useEffect(() => {
    sendDataAjax(null);
  }, []);
  



  // const obtenerPeriodos = async () => {
  //   try {
  //     const urlGetNetworkPeriodForMLM =
  //       "https://api.yosoymitosis.com/v1/NetworkPeriod/GetNetworkPeriodForMLM";
  //     const response = await axios.get<Periodo[]>(
  //       urlGetNetworkPeriodForMLM,
  //       {
  //         headers: {
  //           Authorization: `Bearer ${BEARER_TOKEN}`,
  //         }
  //       }
  //     );
  //     setPeriodos(response.data);
  //   } catch (error) {
  //     console.error("Error al obtener periodos:", error);
  //   }
  // };

  // const renderRows = (data: UserNetwork[]) => {
  //   return data.map((item) => {
  //     const displayStyle = item.userId === 0 ? { display: "none" } : {};
  //     const colorStyle = item.pp < 30 ? { color: "red" } : {};

  //     return (
  //       <tr key={item.patronId} style={{ ...colorStyle }}>
  //         <td style={{ textAlign: "left", ...displayStyle }}>
  //           <button
  //             style={{ outline: "none", boxShadow: "none" }}
  //             id={`btn${item.patronId}`}
  //             value="red"
  //             type="button"
  //             title="red"
  //             className="btn style-button-red btn-redU"
  //           >
  //             <label style={{ cursor: "pointer" }} id={`sig${item.patronId}`} />
  //           </button>
  //           <label id={`lbl${item.patronId}`}>0</label>
  //         </td>
  //         <td>{item.userId}</td>
  //         <td>{item.names}</td>
  //         <td>{item.pp}</td>
  //         <td>{item.elite}</td>
  //         <td>{item.vp}</td>
  //         <td>{item.vpa}</td>
  //         <td>{item.vg}</td>
  //         <td>{item.vq}</td>
  //         <td>{item.range}</td>
  //         <td>{item.maximumRange}</td>
  //         <td>{item.phone}</td>
  //       </tr>
  //     );
  //   });
  // };
  //----------------------------------------------------------------------
  useEffect(() => {
    // Verificar si el usuario está autenticado, de lo contrario, redirigir al Login
    if (valor === "valor_por_defecto") {
      window.location.href = "/login";
    }
  }, [dataIsLoggedIn]);

  // const handleFilterClick = async (maxNetworkPeriodId: any) => {
  //   try {
  //     const urlService="https://api.yosoymitosis.com/v1/NetworkPeriod/GetNetworkPeriodForMLM";
  //     const response = await axios.get(
  //     urlService,
  //     {
  //       headers: {
  //         Authorization: `Bearer ${BEARER_TOKEN}`,
  //       }
  //     });
  //     setPeriodos(response.data.data);
  //   } catch (error) {
  //     console.error('Error fetching user network data:', error);
  //   }
  // };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "https://api.yosoymitosis.com/v1/NetworkPeriod/GetNetworkPeriodForMLM",
          {
            headers: {
              Authorization: `Bearer ${BEARER_TOKEN}`,
            },
          }
        );
        const networkPeriodIds = response.data.data.map(
          (period: any) => period.networkPeriodId
        );
        const maxNetworkPeriodId = Math.max(...networkPeriodIds);
        setSelectedPeriod(maxNetworkPeriodId.toString());
        setOptions(response.data.data);
        // handleFilterClick(maxNetworkPeriodId.toString());
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const handleConsultButtonClick = () => {
    sendDataAjax(selectedPeriod);
  };

  const handleArrowClick = async (idPatron: any) => {
    setLinea(linea + 1);
    console.log(idPatron);
    let BtnTexto = document.getElementById(`btn${idPatron}`) as HTMLElement;
    const elementsToRemove = document.querySelectorAll(
      `[class*="AB${idPatron}"]`
    );
    console.log(elementsToRemove);
    if (BtnTexto && BtnTexto.textContent === "▼") {
      BtnTexto.textContent = "▲";
      try {
        const response = await axios.post(
          "https://api.yosoymitosis.com/v1/UserNetwork/GetPatronNetwork",
          {
            patronId: idPatron,
            networkPeriodId: selectedPeriod,
          },
          {
            headers: {
              Authorization: `Bearer ${BEARER_TOKEN}`,
            },
          }
        );
        const newArray = response.data.data;
        let BtnTexto = document.getElementById(`lbl${idPatron}`) as HTMLElement;
        console.log(BtnTexto);
        let texto = 0;
        if (BtnTexto) {
          texto = parseInt(BtnTexto.innerText) + 1;
        }
        const rowLine = { line: texto };
        newArray.forEach((element: any) => {
          Object.assign(element, rowLine);
        });
        setUserNetworkData((prevState: any) => [...prevState, ...newArray]);
      } catch (error) {
        console.error("Error fetching user network data:", error);
      }
    } else {
      elementsToRemove.forEach((element) => {
        if (element instanceof HTMLElement) {
          element.remove();
        }
      });
      BtnTexto.textContent = "▼";
    }
  };

  return (
    <div className="container lg:pb-28 lg:pt-20 pt-8 ">
      <Helmet>
        <title>Mapa de Red</title>
      </Helmet>
      <div>
        <h2 className="flex items-center text-2xl sm:text-3xl lg:text-4xl mb-12 font-semibold ">
          Mapa de Red
        </h2>
      </div>
      <div className="flex flex-col md:flex-row border border-solid border-slate-200 justify-between pr-[34px] lg:pr-[88px] py-4 pl-[34px] rounded-3xl shadow-lg">
        <div className="flex flex-col w-full md:w-auto space-y-2 md:space-y-3">
          <p className="flex justify-between text-sm md:text-base">
            <span style={{ minWidth: "150px" }}>Total Empresarios:</span>
            <span
              id="TS"
              className="font-bold"
              style={{ width: "30px", textAlign: "right" }}
            >
              {totalEntrepreneurs}
            </span>
          </p>
          <p className="flex justify-between text-sm md:text-base">
            <span style={{ minWidth: "150px" }}>Empresarios Activos:</span>
            <span
              id="AS"
              className="font-bold"
              style={{ width: "30px", textAlign: "right" }}
            >
              {activeEntrepreneurs}
            </span>
          </p>
          <p className="flex justify-between text-sm md:text-base">
            <span style={{ minWidth: "150px" }}>Nuevos Empresarios:</span>
            <span
              id="NS"
              className="font-bold"
              style={{ width: "30px", textAlign: "right" }}
            >
              {newEntrepreneurs}
            </span>
          </p>
          <p className="flex justify-between text-sm md:text-base">
            <span style={{ minWidth: "150px" }}>Empresarios Inactivos:</span>
            <span
              id="IS"
              className="font-bold"
              style={{ width: "30px", textAlign: "right" }}
            >
              {inactiveEntrepreneurs}
            </span>
          </p>
        </div>
        <div id="Div1" className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-5">
          <div className="relative flex items-center w-64 h-16 mt-4 sm:mt-0 rounded overflow-hidden">
            <Select
              id="cboPeriodo"
              className="overflow-hidden text-ellipsis whitespace-nowrap"
              value={selectedPeriod}
              required
              onChange={(e) => setSelectedPeriod(e.target.value)}
            >
              <option value="0">Seleccione periodo</option>
              {options.map((option: any) => (
                <option
                  key={option.networkPeriodId}
                  value={option.networkPeriodId}
                >
                  {option.periodName}
                </option>
              ))}
            </Select>
          </div>
          <div style={{ display: "flex", alignItems: "center" }}>
            <button
              className={`rounded-2xl h-11 w-32 text-white text-sm font-medium ${
                selectedPeriod === "0"
                  ? "bg-purple-400 cursor-not-allowed"
                  : "bg-purple-600 hover:bg-purple-700 focus:outline-none"
              }`}
              type="button"
              id="btnFiltro"
              onClick={selectedPeriod !== "0" ? handleConsultButtonClick : undefined}
              disabled={selectedPeriod === "0"}
            >
              FILTRAR
            </button>
          </div>
        </div>
      </div>

      <div>
        <br />
        <br />
        <div className="box-body">
          {/* <div className="row" style={{ width: "100%", margin: "0", display: "none" }}>
            <div className="col-md-12 centerTable">
              <div
                className="box box-success table-responsive"
                style={{ border: "none" }}
              >
                <div
                  className="box box-header"
                  style={{ border: "none" }}
                ></div>
                <div className="overflow-x-auto">
                  <table id="tbl_red1">
                    <thead>
                      <tr>
                        <th className="py-[5px] px-[15px]">Nivel</th>
                        <th className="py-[5px] px-[15px]">Usuario</th>
                        <th className="min-w-[150px]">Nombres y Apellidos</th>
                        <th className="py-[5px] px-[15px]">PP</th>
                        <th className="py-[5px] px-[15px]">Elite</th>
                        <th className="py-[5px] px-[15px]">VP</th>
                        <th className="py-[5px] px-[15px]">VPA</th>
                        <th className="py-[5px] px-[15px]">VG</th>
                        <th className="py-[5px] px-[15px]">VQ</th>
                        <th className="py-[5px] px-[15px]">Status Actual</th>
                        <th className="py-[5px] px-[15px]">Status Máximo</th>
                        <th className="py-[5px] px-[15px]">Celular</th>
                      </tr>
                    </thead>
                    <tbody>
                      {userNetworkData.map((rowData, index) => (
                        <tr
                          id={`${rowData.userId}`}
                          key={index}
                          className={
                            index !== 0
                              ? `AB${dataIsLoggedIn.userId} AB${rowData.patronId}`
                              : ""
                          }
                        >
                          <td id="">
                            <button
                              style={{
                                outline: "none",
                                boxShadow: "none",
                                display:
                                  rowData.networkQuantity === 0
                                    ? "none"
                                    : "inline-block",
                              }}
                              id={`btn${rowData.userId}`}
                              type="button"
                              title="red"
                              onClick={() => handleArrowClick(rowData.userId)}
                            >
                              <label
                                style={{ cursor: "pointer" }}
                                id={`sig${rowData.userId}`}
                              >
                                ▼
                              </label>
                            </button>
                            &nbsp;&nbsp;
                            <label id={`lbl${rowData.userId}`}>
                              {rowData.line}
                            </label>
                          </td>
                          <td>{rowData.userId}</td>
                          <td>{rowData.names}</td>
                          <td>{rowData.pp}</td>
                          <td>{rowData.elite}</td>
                          <td>{rowData.vp}</td>
                          <td>{rowData.vpa}</td>
                          <td>{rowData.vg}</td>
                          <td>{rowData.vq}</td>
                          <td>{rowData.range}</td>
                          <td>{rowData.maximumRange}</td>
                          <td>{rowData.phone}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div> */}
          <div className="row" style={{ width: "100%", margin: "0" }}>
            <div className="col-md-12 centerTable">
              <div
                className="box box-success table-responsive"
                style={{ border: "none" }}
              >
                <div
                  className="box box-header"
                  style={{ border: "none" }}
                ></div>
                <div className="overflow-x-auto">
                  <table
                    id="tbl_red"
                    className="tbl_red tree content-table table-bordered table-hover text-center table"
                  >
                    <thead>
                      <tr>
                        <th className="py-[5px] px-[15px]">Nivel</th>
                        <th className="py-[5px] px-[15px]">Usuario</th>
                        <th className="min-w-[150px]">Nombres y Apellidos</th>
                        <th className="py-[5px] px-[15px]">PP</th>
                        <th className="py-[5px] px-[15px]">Elite</th>
                        <th className="py-[5px] px-[15px]">VP</th>
                        <th className="py-[5px] px-[15px]">VPA</th>
                        <th className="py-[5px] px-[15px]">VG</th>
                        <th className="py-[5px] px-[15px]">VQ</th>
                        <th className="py-[5px] px-[15px]">Status Actual</th>
                        <th className="py-[5px] px-[15px]">Status Máximo</th>
                        <th className="py-[5px] px-[15px]">Celular</th>
                      </tr>
                    </thead>
                    <tbody id="tbody_red"></tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
      </div>
    </div>
  );
};

export default NetworkMap;
