import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import routes from '@constants/routes';

import Button from '@mui/joy/Button';
import Input from '@mui/joy/Input';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';

import './style.scss';
import Logo from '@components/Logo';

const Login = () => {
  const navigateTo = useNavigate();

  return (
    <div className="login">
      <div className="login__top">
        <Logo />
      </div>
      <div className="login__container">
        <Input 
          placeholder="Usuario"
          variant="soft"
          color="neutral"
          sx={{ width: '16rem', borderRadius: '2rem', padding: '1rem'}}/>
        <Input 
          placeholder="Contraseña"
          variant="soft"
          color="neutral"
          sx={{ width: '16rem', borderRadius: '2rem', padding: '1rem' }}/>
        <Button onClick={() => navigateTo(routes.HOME)} type="submit" className='submit-button'>Iniciar sesión</Button>
        <p className="login__container__text">
        ¿Olvidaste tu contraseña? Click aquí</p>  
        <p className="login__container__wpp">
        <WhatsAppIcon /> ¿Precisas ayuda? Click aquí</p>  
      </div>
    </div>
  )
};

export default Login;

