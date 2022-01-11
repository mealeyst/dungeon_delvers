import React, { FunctionComponent, ButtonHTMLAttributes, ReactNode, useEffect } from 'react';
import styled from 'styled-components';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement>{
  children?: ReactNode;
}

export const ButtonView: FunctionComponent<ButtonProps> = ({
  children,
  ...props
}) => {
  useEffect(() => {
    const images = [
      './public/Fantasy_Button.png',
      './public/Fantasy_Button_Hover.png',
      './public/Fantasy_Button_Click.png',
    ];
    images.forEach((image: string) => {
      const newImage = new Image();
      newImage.src = image;
    });
  }, []);
  return (
    <button
      type="button"
      {...props}
    >
      {children}
    </button>
  );
};

const Button = styled(ButtonView)`
  width: 200px;
  height: 70px;
  background-color: transparent;
  border: none;
  background-image: url('./public/Fantasy_Button.png');
  background-size: contain;
  background-repeat: no-repeat;
  color: white;
  margin: 0 auto;
  font-family: "Bellefair", serif;
  text-transform: uppercase;
  letter-spacing: 0.2rem;
  font-size: 1rem;
  transition: background-image 0.2s ease-in-out, color 0.2s ease-in-out;
  &:hover {
    cursor: pointer;
    background-image: url('./public/Fantasy_Button_Hover.png');
    color: #d1d1d1;
  }
  &:active {
    background-image: url('./public/Fantasy_Button_Click.png');
    color:
  }
`;

export default Button;
