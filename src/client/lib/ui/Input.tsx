import React, { FunctionComponent } from 'react';
import styled from 'styled-components';

export type InputProps = {
  className?: string;
  label: string;
  name: string;
  type: 'text' | 'password';
};

export const InputView: FunctionComponent<InputProps> = ({
  className,
  label,
  type,
  name,
}) => (
  <label className={className}>
    <input type={type} name={name} placeholder=" " />
    <span>{label}</span>
  </label>
);

const Input = styled(InputView)`
  position: relative;
  height: 60px;
  width: 400px;
  display: flex;
  margin-left: auto;
  margin-right: auto;
  margin-bottom: 20px;
  span {
    color: #cc9a3d;
    text-transform: uppercase;
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    display: flex;
    box-size: border-box;
    justify-content: center;
    align-items: center;
    transition: opacity 0.25s ease-in-out;
  }
  input {
    background: linear-gradient(
      90deg,
      rgba(29, 41, 41, 1) 0%,
      rgba(28, 29, 31, 1) 15%,
      rgba(28, 29, 31, 1) 85%,
      rgba(29, 41, 41, 1) 100%
    );
    box-shadow: inset 0px 0px 1px 1px rgba(0, 0, 0, 0.75),
      0px 0px 1px 1px rgba(0, 0, 0, 0.75);
    color: #cc9a3d;
    border-style: ridge;
    border-color: #8a7349;
    border-width: 2px;
    height: 50px;
    width: 400px;
    outline: none;
    padding: 0px 10px;
    font-family: "Bellefair", serif;
    font-size: 1rem;
  }
  input:focus ~ span,
  input:not(:placeholder-shown) ~ span {
    opacity: 0;
  }
`;

export default Input;
