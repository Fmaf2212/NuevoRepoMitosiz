import React, { FC, useEffect, useState } from "react";
import imageRightPng from "images/hero-right.png";
import imageRightPng2 from "images/hero-right-2.png";
import imageRightPng3 from "images/hero-right-3.png";

import backgroundLineSvg from "images/Moon.svg";
import ButtonPrimary from "shared/Button/ButtonPrimary";
import Next from "shared/NextPrev/Next";
import Prev from "shared/NextPrev/Prev";
import useInterval from "react-use/lib/useInterval";
import useBoolean from "react-use/lib/useBoolean";

import { BEARER_TOKEN } from '../../../src/store/config';
import axios from "axios";

interface Hero2DataType {
  image: string;
  heading: string;
  subHeading: string;
  btnText: string;
  btnLink: string;
  bgImage: string
}
export interface SectionHero2Props {
  className?: string;
}

const DATA: Hero2DataType[] = [
  {
    image: imageRightPng2,
    heading: "Exclusive collection for everyone",
    subHeading: "In this season, find the best 🔥",
    btnText: "Explore now",
    btnLink: "/",
    bgImage: 'https://tienda.mundosantanatura.com/banners/Banner-min-NoFaltes.png',
  },
  {
    image: imageRightPng3,
    heading: "Exclusive collection for everyone",
    subHeading: "In this season, find the best 🔥",
    btnText: "Explore now",
    btnLink: "/",
    bgImage: 'https://tienda.mundosantanatura.com/banners/Banner_Premio_Aceite%20de%20Magnesio.png',
  },
];
let TIME_OUT: NodeJS.Timeout | null = null;

const SectionHero2: FC<SectionHero2Props> = ({ className = "" }) => {
  // =================
  const [indexActive, setIndexActive] = useState(0);
  const [isRunning, toggleIsRunning] = useBoolean(true);
  const [slidersPresentation, setSliderPresentation] = useState([]);

  useEffect(() => {

    const fetchPaymentMethods = async () => {
      try {
        const response = await axios.get(
          "https://api.yosoymitosis.com/v1/IndexPresentation/GetSlidersPresentation",
          {
            headers: {
              Authorization: `Bearer ${BEARER_TOKEN}`,
            },
          }
        );
        console.log(response.data.data)
        setSliderPresentation(response.data.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchPaymentMethods();
  }, []);

  useInterval(
    () => {
      handleAutoNext();
    },
    isRunning ? 5500 : null
  );
  //

  const handleAutoNext = () => {
    setIndexActive((state) => {
      if (state >= slidersPresentation.length - 1) {
        return 0;
      }
      return state + 1;
    });
  };

  const handleClickNext = () => {
    setIndexActive((state) => {
      if (state >= slidersPresentation.length - 1) {
        return 0;
      }
      return state + 1;
    });
    handleAfterClick();
  };

  const handleClickPrev = () => {
    setIndexActive((state) => {
      if (state === 0) {
        return slidersPresentation.length - 1;
      }
      return state - 1;
    });
    handleAfterClick();
  };

  const handleAfterClick = () => {
    toggleIsRunning(false);
    if (TIME_OUT) {
      clearTimeout(TIME_OUT);
    }
    TIME_OUT = setTimeout(() => {
      toggleIsRunning(true);
    }, 1000);
  };
  // =================

  const renderItem = (item: any,index: number) => {
    const isActive = indexActive === index;
    // const item = DATA[index];
    if (!isActive) {
      return null;
    }
    return (
      <div
        className={`nc-SectionHero2Item p-1.5 nc-SectionHero2Item--animation flex flex-col-reverse lg:flex-col relative overflow-hidden ${className} h-[150px] 2xl:h-[570px] xl:h-[400px] lg:h-[300px] md:h-[250px] sm:h-[200px]`}
        key={index}
      >
        <div className="absolute bottom-1 lg:bottom-4 left-1/2 -translate-x-1/2 z-20 flex justify-center">
          {DATA.map((_, index) => {
            const isActive = indexActive === index;
            return (
              <div
                key={index}
                onClick={() => {
                  setIndexActive(index);
                  handleAfterClick();
                }}
                className={`relative px-1 py-1.5 cursor-pointer`}
              >
                <div
                  className={`relative w-10 lg:w-20 h-0.5 lg:h-1 shadow-sm rounded-md bg-white`}
                >
                  {isActive && (
                    <div
                      className={`nc-SectionHero2Item__dot absolute inset-0 bg-slate-900 rounded-md ${
                        isActive ? " " : " "
                      }`}
                    ></div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <Prev
          className="absolute left-1 sm:left-5 top-1/3 sm:top-1/2 sm:-translate-y-1/2 z-10 !text-slate-700"
          btnClassName="w-12 h-12 hover:border-slate-400 dark:hover:border-slate-400"
          svgSize="w-6 h-6"
          onClickPrev={handleClickPrev}
        />
        <Next
          className="absolute right-1 sm:right-5 top-1/3 sm:top-1/2 sm:-translate-y-1/2 z-10 !text-slate-700"
          btnClassName="w-12 h-12 hover:border-slate-400 dark:hover:border-slate-400"
          svgSize="w-6 h-6"
          onClickNext={handleClickNext}
        />

        {/* BG */}
        <div className="absolute inset-0 bg-no-repeat bg-center bg-cover h-[150px] 2xl:h-[570px] xl:h-[400px] lg:h-[300px] md:h-[250px] sm:h-[200px] nc-SectionHero2Item__image " style={{backgroundImage: `url(https://api.yosoymitosis.com/StaticFiles/SlidersImg/${item.imageName})`}}>
        </div>
      </div>
    );
  };

  return <>{slidersPresentation.map((item, index) => renderItem(item,index))}</>;
};

export default SectionHero2;
