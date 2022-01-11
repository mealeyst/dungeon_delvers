import React, { FunctionComponent, InputHTMLAttributes, ReactNode } from 'react';
import styled from 'styled-components';

export interface CheckboxProps extends InputHTMLAttributes<HTMLInputElement> {
  children?: ReactNode;
}

export const CheckboxView: FunctionComponent<CheckboxProps> = ({
  className,
  children,
  ...props
}) => (
  <label className={className}>
    <input type="checkbox" {...props} />
    <span>{children}</span>
  </label>
);

const Checkbox = styled(CheckboxView)`
  position: relative;
  height: 60px;
  width: 400px;;
  display: flex;
  margin-left: auto;
  margin-right: auto;
  margin-bottom: 20px;
  background: linear-gradient(to right, hsla(0,0%,0%,.0), hsla(0,0%,0%,0.2), hsla(0,0%,0%,0));
  display: flex;
  justify-content: center;
  input[type='checkbox'] {
    position: absolute !important;
    height: 1px;
    width: 1px;
    overflow: hidden;
    clip: rect(1px 1px 1px 1px); /* IE6, IE7 */
    clip: rect(1px, 1px, 1px, 1px);
  }
  span {
    color: #cc9a3d;
    text-transform: uppercase;
    display: flex;
    box-size: border-box;
    justify-content: center;
    align-items: center;
    transition: opacity 0.25s ease-in-out;
  }
  span:before {
    display: block;
    content: '';
    background-color: red;
    height: 20px;
    width: 20px;
    background-image: url('./public/checkmark_unchecked.png');
    transition: background-image 0.2s ease-in-out;
    background-size: contain;
    margin-right: 10px;
  }
  input:checked + span:before {
    background-image: url('./public/checkmark_checked.png');
  }
`;

export default Checkbox;
