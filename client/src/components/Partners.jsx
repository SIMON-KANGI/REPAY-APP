import React from 'react';
import RotatingLogos from './RotatingLogos';
import images from '../../constants/images';

const Partners = () => {
  const logos = [
    images.equity,
    images.safaricom,
    images.jumia,
    images.jiji,
    images.kili,
    images.carre,
    images.arse,
    images.bale,
    images.bidco,
    images.imax,
    images.nike,
    images.absa,
    images.coop,
    images.family,
    images.im,
    images.kcb,
    images.absa
  ];

  return (
    <div className="partners flex">
      <RotatingLogos duration={60}>
        {logos.map((logo, index) => (
          
          <img src={logo} key={index} width="90px" height="90px" alt={`Partner ${index + 1}`} className="rounded-full bg-stone-200 mx-3" />
        ))}
      </RotatingLogos>
    </div>
  );
};

export default Partners;
