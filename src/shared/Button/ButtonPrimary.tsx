import Button, { ButtonProps } from "shared/Button/Button";
import React from "react";

export interface ButtonPrimaryProps extends ButtonProps {}

const ButtonPrimary: React.FC<ButtonPrimaryProps> = ({
  className = "",
  disabled,
  ...args
}) => {
  return (
    <Button
      disabled={disabled}
      className={`ttnc-ButtonPrimary disabled:bg-opacity-90 bg-purple-600 dark:bg-slate-100 hover:bg-purple-700 text-slate-50 dark:text-slate-800 shadow-xl ${className}`}
      {...args}
    />
  );
};

export default ButtonPrimary;
