import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import routes from '@constants/routes';

import Button from '@mui/joy/Button';

import './style.scss';
import Logo from '@components/Logo';

const Home = () => {
  const navigateTo = useNavigate();

  return (
    <div className='home'>
      <div className='home__top'>
        <Logo />
      </div>
      <div className='home__container'>
        <div className='home__container__building'>
          <p className='home__container__building__subtitle'>Edificio</p>
          <p className='home__container__building__title'>Puerta del Sol</p>
        </div>
        <Button onClick={() => navigateTo(routes.HISTORY)} className='common-button'>Ver historial de reservas</Button>
        <Button onClick={() => navigateTo(routes.LOGIN)} className='submit-button'>Realizar una reserva</Button>
        <Button onClick={() => navigateTo(routes.LOGIN)} className='logout-button'>Cerrar sesión</Button>
      </div>
    </div>
  )
};

export default Home;

