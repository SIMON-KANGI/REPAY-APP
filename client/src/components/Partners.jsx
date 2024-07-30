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
      <RotatingLogos duration={90}>
        {logos.map((logo, index) => (
          <div className="p-8 bg-stone-300 m-2 rounded-md items-center justify-center" key={index}>
            <img  src={logo} alt={`Partner ${index + 1}`} className="logo p-3 rounded-full" />
          </div>
        ))}
      </RotatingLogos>
    </div>
  );
};

export default Partners;
