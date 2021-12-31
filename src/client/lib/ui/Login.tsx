import React, { FunctionComponent } from 'react';
import styled from 'styled-components'

import Overlay from './Overlay'
import Input from './Input'

type LoginProps = {
  className?: string
}

const LoginView:FunctionComponent<LoginProps> = ({className}) => {
  return (
    <Overlay className={className}>
      <header>
        <h1>Dungeon Delver</h1>
      </header>
      <form>
        <Input type='text' name='login_username' label="Username" />
        <Input type='password' name='login_password' label="Password" />
        <button>Login</button>
        <footer>
          <a href="#">I forgot my password</a>
          <button>Create Account</button>
        </footer>
      </form>
    </Overlay>
  )
}

const Login = styled(LoginView)`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  form {
    flex-direction: column;
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }
  label {
    position: relative;
    height: 60px;
    width: 400px;
    display: flex;
    margin-left: auto;
    margin-right: auto;
    margin-bottom: 20px;
    span {
      color: #9e9085;
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
  }
  input {
    background: linear-gradient(90deg, rgba(29,41,41,1) 0%, rgba(28,29,31,1) 15%, rgba(28,29,31,1) 85%, rgba(29,41,41,1) 100%);
    box-shadow: inset 0px 0px 1px 1px rgba(0,0,0,0.75), 0px 0px 1px 1px rgba(0,0,0,0.75);;
    color: #9e9085;
    border-style: ridge;
    border-color: #8a7349;
    border-width: 2px;
    height: 50px;
    width: 400px;
    outline: none;
    padding: 0px 10px;
    font-family: 'Bellefair', serif;
    font-size: 1rem;
  }
  input:focus ~ span, input:not(:placeholder-shown) ~ span {
    opacity: 0;
  }
  footer {

  }

`

export default Login