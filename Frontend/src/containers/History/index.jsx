import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import routes from '@constants/routes';

import Button from '@mui/joy/Button';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
import WatchLaterIcon from '@mui/icons-material/WatchLater';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';

import './style.scss';

const History = () => {
  const navigateTo = useNavigate();

  return (
    <div className='history'>
      <div className='history__container'>
        <p className='history__container__title'>Historial de reservas</p>
        <div className='history__container__card'>
          <p className='history__container__card__subtitle'>Reserva de Barbacoa</p>
          <p className='history__container__card__title'>Sábado 14 de Marzo de 2024</p>
          <div className='history__container__card__extras'>
            <p className='history__container__card__extras__text'><LocalFireDepartmentIcon /> Leña incluida</p>
            <p className='history__container__card__extras__text'><WatchLaterIcon /> Noche</p>
          </div>
          {/* <div className='history__container__card__icon__delete'><DeleteIcon /></div>
          <div className='history__container__card__icon__edit'><EditIcon /></div> */}
        </div>
        <div className='history__container__card'>
          <p className='history__container__card__subtitle'>Reserva de Barbacoa</p>
          <p className='history__container__card__title'>Sábado 14 de Marzo de 2024</p>
          <div className='history__container__card__extras'>
            <p className='history__container__card__extras__text'><LocalFireDepartmentIcon /> Leña incluida</p>
            <p className='history__container__card__extras__text'><WatchLaterIcon /> Noche</p>
          </div>
          {/* <div className='history__container__card__icon__delete'><DeleteIcon /></div>
          <div className='history__container__card__icon__edit'><EditIcon /></div> */}
        </div>
        <div className='history__container__footer'>
          <Button onClick={() => navigateTo(routes.HOME)} className='return-button'><ChevronLeftIcon /> Atrás</Button>
        </div>
      </div>
    </div>
  )
};

export default History;

