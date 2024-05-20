import React from "react";
import NavigationItem from "./NavigationItem";
import { NAVIGATION_DEMO_2, NAVIGATION_DEMO_3 } from "data/navigation";

import { useCounterStore } from "store/auth";

const Navigation= () => {

  const isLoggedIn = useCounterStore((state)=>state.isLoggedIn);
  const token = localStorage.getItem("USER_AUTH");
  return (
    <>
      {isLoggedIn||token ? (
        // Si está logueado y USER_AUTH existe en localStorage
        <ul className="nc-Navigation flex items-center">
          {NAVIGATION_DEMO_3.map((item) => (
            <NavigationItem key={item.id} menuItem={item} />
          ))}
        </ul>
      ) : (
        // Si no está logueado
        <ul className="nc-Navigation flex items-center">
          {NAVIGATION_DEMO_2.map((item) => (
            <NavigationItem key={item.id} menuItem={item} />
          ))}
        </ul>
      )}
    </>
  );
};

export default Navigation;
