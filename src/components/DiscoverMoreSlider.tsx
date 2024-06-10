import React, { useEffect, useId, useState } from "react";
import Heading from "./Heading/Heading";
import img1 from "images/collections/1.png";
import img2 from "images/collections/5.png";
import img3 from "images/collections/4.png";
import img4 from "images/collections/3.png";
import CardCategory3, {
  CardCategory3Props,
} from "./CardCategories/CardCategory3";
import Glide from "@glidejs/glide";

import { BEARER_TOKEN } from '../../src/store/config';
import axios from "axios";

export const CATS_DISCOVER: CardCategory3Props[] = [
  {
    name: "Explore new arrivals",
    desc: "Shop the latest <br /> from top brands",
    featuredImage: img1,
    color: "bg-yellow-50",
  },
  {
    name: "Digital gift cards",
    desc: "Give the gift <br /> of choice",
    featuredImage: img2,
    color: "bg-red-50",
  },
  {
    name: "Sale collection",
    desc: "Up to <br /> 80% off retail",
    featuredImage: img3,
    color: "bg-blue-50",
  },
  {
    name: "Sale collection",
    desc: "Up to <br /> 80% off retail",
    featuredImage: img4,
    color: "bg-green-50",
  },
];

const DiscoverMoreSlider = () => {
  const id = useId();
  const UNIQUE_CLASS = "glidejs" + id.replace(/:/g, "_");

  const [advertisingsPresentation, setAdvertisingsPresentation] = useState([]);

  useEffect(() => {
    // @ts-ignore
    const OPTIONS: Glide.Options = {
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
        },
      },
    };

    const fetchPaymentMethods = async () => {
      try {
        const response = await axios.get(
          "https://api.yosoymitosis.com/v1/IndexPresentation/GetAdvertisingsPresentation",
          {
            headers: {
              Authorization: `Bearer ${BEARER_TOKEN}`,
            },
          }
        );
        // console.log(response.data.data)
        setAdvertisingsPresentation(response.data.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchPaymentMethods();

    let slider = new Glide(`.${UNIQUE_CLASS}`, OPTIONS);
    slider.mount();
    return () => {
      slider.destroy();
    };
  }, [UNIQUE_CLASS, advertisingsPresentation]);

  return (
    <div className={`nc-DiscoverMoreSlider nc-p-l-container ${UNIQUE_CLASS} `}>
      <Heading
        className="mb-12 lg:mb-14 text-neutral-900 dark:text-neutral-50 nc-p-r-container "
        desc=""
        rightDescText=""
        hasNextPrev
      >
        <p></p>
      </Heading>
      <div className="" data-glide-el="track">
        {
          advertisingsPresentation
          ?
          <ul className="glide__slides">
            {advertisingsPresentation.map((item: any, index) => (
              <div key={index} className={`glide__slide w-[546px] h-[248px] bg-contain bg-no-repeat`} style={{backgroundImage: `url(https://api.yosoymitosis.com/StaticFiles/AdvertisingImg/${item.imageName})`}}>
              </div>
            ))}
          </ul>
          : (
            <p>Cargando datos...</p>
          )
        }
      </div>
    </div>
  );
};

export default DiscoverMoreSlider;
