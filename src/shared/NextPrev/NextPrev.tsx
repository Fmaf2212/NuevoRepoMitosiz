import React, { FC, useEffect, useState } from "react";
import Glide from "@glidejs/glide";
export interface NextPrevProps {
  className?: string;
  currentPage?: number;
  totalPage?: number;
  btnClassName?: string;
  onClickNext?: () => void;
  onClickPrev?: () => void;
  onlyNext?: boolean;
  onlyPrev?: boolean;
}

const NextPrev: FC<NextPrevProps> = ({
  className = "",
  onClickNext = () => {},
  onClickPrev = () => {},
  btnClassName = "w-10 h-10",
  onlyNext = false,
  onlyPrev = false,
}) => {
  const [focus, setFocus] = React.useState<"left" | "right">("right");
  const [autoClicked, setAutoClicked] = useState(false);

  useEffect(() => {
    const autoClickTimer = setTimeout(() => {
      // Obtener todos los elementos con la clase "btnNext"
      let elementsBtnNext = document.querySelectorAll(".btnNext");
      // Iterar sobre cada botón y simular un clic
      elementsBtnNext.forEach(function(boton) {
        // Hacer un casting explícito al tipo HTMLButtonElement para evitar error de typescript si es que se coloca de frente .clic()
        var botonClickeable = boton as HTMLButtonElement;
        // Simular un clic en el botón
        botonClickeable.click();
      });
      // Llamamos a la función onClickNext después de 3 segundos, solo si no se ha hecho clic automáticamente antes
      if (!autoClicked) {
        onClickNext();
        setAutoClicked(true);
      }
    }, 4000);

        // Crear una instancia de Glide y montarla al componente
        const slider = new Glide(".nc-NextPrev", {
          // Configuración de Glide según tus necesidades
          // ...
          perView: 2.8,
          gap: 32,
          bound: true,
          breakpoints: {
            1280: {
              gap: 28,
              perView: 2.5,
            },
            1279: {
              gap: 20,
              perView: 2.15,
            },
            1023: {
              gap: 20,
              perView: 1.6,
            },
            768: {
              gap: 20,
              perView: 1.2,
            },
            500: {
              gap: 20,
              perView: 1,
            }
          }
        });

    // Limpiamos el temporizador y reiniciamos el estado cuando el componente se desmonta
    return () => {
      clearTimeout(autoClickTimer);
      setAutoClicked(false);
      slider.destroy();
    };
  }, [autoClicked, onClickNext]);

  return (
    <div
      className={`nc-NextPrev relative flex items-center text-slate-500 dark:text-slate-400 ${className}`}
      data-nc-id="NextPrev"
      data-glide-el="controls"
    >
      {!onlyNext && (
        <button
          className={`${btnClassName} ${
            !onlyPrev ? "mr-2" : ""
          } border-slate-200 dark:border-slate-600 rounded-full flex items-center justify-center ${
            focus === "left" ? "border-2" : ""
          }`}
          onClick={(e) => {
            e.preventDefault();
            onClickPrev();
          }}
          title="Prev"
          data-glide-dir="<"
          onMouseEnter={() => setFocus("left")}
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
            <path
              d="M9.57 5.92993L3.5 11.9999L9.57 18.0699"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeMiterlimit="10"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M20.5 12H3.67004"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeMiterlimit="10"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      )}
      {!onlyPrev && (
        <button
          className={`btnNext ${btnClassName}  border-slate-200 dark:border-slate-600 rounded-full flex items-center justify-center ${
            focus === "right" ? "border-2" : ""
          }`}
          onClick={(e) => {
            e.preventDefault();
            onClickNext();
          }}
          title="Next"
          data-glide-dir=">"
          onMouseEnter={() => setFocus("right")}
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
            <path
              d="M14.4301 5.92993L20.5001 11.9999L14.4301 18.0699"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeMiterlimit="10"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M3.5 12H20.33"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeMiterlimit="10"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      )}
    </div>
  );
};

export default NextPrev;
