import React from 'react';
import { motion } from 'framer-motion';
import PropTypes from 'prop-types';

const RotatingLogos = ({ children, duration }) => {
  return (
    <div className="rotating-container overflow-hidden">
      <motion.div
        className="scrolling-content flex"
        animate={{ x: '-100%' }}
        transition={{ repeat: Infinity, duration, ease: 'linear' }}
      >
        {children}
        {children} 
        {children}
        {children}
        {children} 
        {children}
        {children}
        {children} 
        {children}
        {children}
        {children} 
        {children} {/* Duplicating children for seamless scrolling */}
      </motion.div>
    </div>
  );
};

RotatingLogos.propTypes = {
  children: PropTypes.node.isRequired,
  duration: PropTypes.number,
};

RotatingLogos.defaultProps = {
  duration: 10,
};

export default RotatingLogos;
