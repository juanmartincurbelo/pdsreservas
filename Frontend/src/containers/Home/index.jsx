import React, { useState } from 'react';

import images from "@constants/images"

import './style.scss';

const Home = () => {
  

  return (
    <div className="home">
      <div className="home__top">
        <img src={images.Logo} />
      </div>
      <div className="home__container">
        hola
      </div>
    </div>
  )
};

export default Home;

