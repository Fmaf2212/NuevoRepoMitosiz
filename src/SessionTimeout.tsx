import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

import { useCounterStore } from "store/auth";
import Swal from "sweetalert2";

interface SessionTimeoutProps {
    timeoutDuration: number;
  }
  
  const SessionTimeout: React.FC<SessionTimeoutProps> = ({ timeoutDuration }) => {
    const [isActive, setIsActive] = useState(true);
    const timeoutRef = useRef<number | null>(null);
    const navigate = useNavigate();
  
    const handleLogout = useCounterStore((state) => state.handleLogout);
    const isLoggedIn = useCounterStore((state) => state.isLoggedIn);

    const handleUserActivity = () => {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
        timeoutRef.current = window.setTimeout(() => {
          setIsActive(false);
        }, timeoutDuration);
      };
  
    useEffect(() => {
        //si no está logueado, que retorne y no prosiga con el codigo
        if (!isLoggedIn) return;

        const events: string[] = ["mousemove", "mousedown", "click", "scroll", "keypress"];
      events.forEach(event => window.addEventListener(event, handleUserActivity));
      
      // Set initial timeout
      timeoutRef.current = window.setTimeout(() => {
        setIsActive(false);
      }, timeoutDuration);
  
      return () => {
        events.forEach(event => window.removeEventListener(event, handleUserActivity));
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
          }
      };
    }, [timeoutDuration, isLoggedIn]);
  
    useEffect(() => {
    if (!isActive && isLoggedIn) {
        Swal.fire({
          icon: "warning",
          title: "Sesión expirada.",
          text: "Serás redirigido a la página de inicio de sesión.",
        }).then(() => {
          handleLogout();
        });
      }
    }, [isActive, isLoggedIn, navigate, handleLogout]);
  
    return null;
}

export default SessionTimeout