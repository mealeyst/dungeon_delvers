import React, { FunctionComponent } from 'react';
import styled from 'styled-components';

import Overlay from './Overlay';
import Input from './Input';

type LoginProps = {
  className?: string;
};

const LoginView: FunctionComponent<LoginProps> = ({ className }) => (
  <Overlay className={className}>
    <header>
      <span>Dungeon Delver</span>
    </header>
    <form>
      <Input type="text" name="login_username" label="Username" />
      <Input type="password" name="login_password" label="Password" />
      <button type="button">Login</button>
    </form>
    <footer>
      <a href="#forgot">Forgot Your Password?</a>
      <a href="#create">Create Account</a>
    </footer>
  </Overlay>
);

const Login = styled(LoginView)`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  form {
    flex-direction: column;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }
  header {
    align-self: flex-start;
    width: 100%;
    display: flex;
    justify-content: center;
    span {
      font-size: 40px;
      color: #8a7349;
      padding-top: 60px;
    }
  }
  footer {
    background-color: #131b1e;
    align-self: flex-end;
    width: 100%;
    height: 60px;
    display: flex;
    justify-content: center;
    align-items: center;
    border-top-style: ridge;
    border-top-color: #8a7349;
    a {
      color: #cc9a3d;
      text-decoration: none;
      text-transform: uppercase;
      margin: 0 15px;
      transition: color 0.25s ease-in-out;
      &:hover {
        color: #34badd;
      }
    }
  }
`;

export default Login;
