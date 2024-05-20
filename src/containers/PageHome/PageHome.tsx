// import React from "react";
// import SectionHowItWork from "components/SectionHowItWork/SectionHowItWork";
// import BackgroundSection from "components/BackgroundSection/BackgroundSection";
// import SectionPromo1 from "components/SectionPromo1";
import SectionHero2 from "components/SectionHero/SectionHero2";
// import SectionSliderLargeProduct from "components/SectionSliderLargeProduct";
import SectionSliderProductCard from "components/SectionSliderProductCard";
import DiscoverMoreSlider from "components/DiscoverMoreSlider";
// import SectionGridMoreExplore from "components/SectionGridMoreExplore/SectionGridMoreExplore";
// import SectionPromo2 from "components/SectionPromo2";
// import SectionSliderCategories from "components/SectionSliderCategories/SectionSliderCategories";
// import SectionGridFeatureItems from "./SectionGridFeatureItems";
// import SectionPromo3 from "components/SectionPromo3";
// import SectionClientSay from "components/SectionClientSay/SectionClientSay";
// import SectionMagazine5 from "containers/BlogPage/SectionMagazine5";
// import Heading from "components/Heading/Heading";
// import ButtonSecondary from "shared/Button/ButtonSecondary";
import { DYNAMIC_PRODUCTS } from "data/data";

import backgroundImage from '../../../src/images/bgECommerce.jpg';
import CompanyInformation from "components/CompanyInformation";
import { useEffect, useState } from "react";

import { useCounterStore } from "store/auth";

function PageHome() {
  const dataIsLoggedIn = useCounterStore((state) => state.dataIsLoggedIn);
  const valor = localStorage.getItem('USER_AUTH') ?? 'valor_por_defecto';

  useEffect(() => {
    // Verificar si el usuario está autenticado, de lo contrario, redirigir al Login
    if (valor !== "valor_por_defecto") {
      window.location.href = "/page-virtualOffice";
    }
  }, [dataIsLoggedIn]);
  const style = {
    backgroundImage: `url(${backgroundImage})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundAttachment: 'fixed'
    // Otras propiedades de estilo según sea necesario
  };
  return (
    <div className="nc-PageHome relative overflow-hidden">
      {/* SECTION HERO */}
      <SectionHero2 />
      <div className="bg-cover bg-center h-screen sticky top-0 hidden" style={style}></div>
      <div className="container hidden">
        <div>
          <img src="" alt="" />
          <div>
            <h2>COMISIÓN HISTÓRICA</h2>
            <div>4464646</div>
            <h6>Comisión actual:<span>646464</span></h6>
          </div>
          <img src="" alt="" />
        </div>
        <div>
          <img src="" alt="" />

          <img src="" alt="" />
        </div>
        <div>
        </div>
      </div>
      <div className="mt-24 lg:mt-32">
        <DiscoverMoreSlider />
      </div>

      <div className="container relative space-y-24 my-24 lg:space-y-32 lg:my-32">
        {/* Productos */}
        <SectionSliderProductCard
        />
        {/*
        <div className="py-24 lg:py-32 border-t border-b border-slate-200 dark:border-slate-700">
          <SectionHowItWork />
        </div>
        <SectionPromo1 />
        <div className="relative py-24 lg:py-32">
          <BackgroundSection />
          <SectionGridMoreExplore />
        </div>
        <SectionGridFeatureItems />
        <SectionPromo2 />
        <SectionSliderLargeProduct cardStyle="style2" />
        <SectionSliderCategories />
        <SectionPromo3 />
        <SectionSliderProductCard
          heading="Best Sellers"
          subHeading="Best selling of the month"
        />
        <div className="relative py-24 lg:py-32">
          <BackgroundSection />
          <div>
            <Heading rightDescText="From the Ciseco blog">
              The latest news
            </Heading>
            <SectionMagazine5 />
            <div className="flex mt-16 justify-center">
              <ButtonSecondary>Show all blog articles</ButtonSecondary>
            </div>
          </div>
        </div>
        <SectionClientSay />
        */}
      </div>
      <div className="mt-24 mb-24 lg:mt-32">
        <CompanyInformation />
      </div>
    </div>
  );
}

export default PageHome;
