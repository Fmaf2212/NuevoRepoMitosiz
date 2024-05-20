import React from "react";

interface TableRow {
  userId: number;
  patronId: number;
  pp: number;
  vp: number;
  vpa: number;
  elite: number;
  vr: number;
  vg: number;
  vq: number;
  phone: string;
  names: string;
  range: string;
  maximumRange: string;
  networkQuantity: number;
  // Otros campos según la estructura de datos
}

interface Props {
  data: TableRow[];
}

const TuComponente: React.FC<Props> = ({ data }) => {
  console.log(data);
  const RenderRows = () => {
    return data.map((item) => {
      const displayStyle = item.userId === 0 ? { display: "none" } : {};
      const colorStyle = item.pp < 30 ? { color: "red" } : {};

      return (
        <tr key={item.patronId} style={{ ...colorStyle }}>
          <td style={{ textAlign: "left", ...displayStyle }}>
            <button
              style={{
                outline: "none",
                boxShadow: "none",
                display: item.networkQuantity === 0 ? "none" : "inline-block",
              }}
              id={`btn${item.patronId}`}
              value="red"
              type="button"
              title="red"
              className="btn style-button-red btn-redU cursor-pointer"
            >
              <label style={{ cursor: "pointer" }} id={`sig${item.patronId}`} />
            </button>
            <label id={`lbl${item.patronId}`}>0</label>
          </td>
          <td>{item.userId}</td>
          <td>{item.names}</td>
          <td>{item.pp}</td>
          <td>{item.elite}</td>
          <td>{item.vp}</td>
          <td>{item.vpa}</td>
          <td>{item.vg}</td>
          <td>{item.vq}</td>
          <td>{item.range}</td>
          <td>{item.maximumRange}</td>
          <td>{item.phone}</td>
        </tr>
      );
    });
  };

  return (
    <table
      id="tbl_red"
      className="tbl_red tree content-table table-bordered table-hover text-center table">
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
      <tbody>{RenderRows()}</tbody>
    </table>
  );
};

export default TuComponente;
