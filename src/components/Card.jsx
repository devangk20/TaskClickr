// src/components/ui/Card.jsx
import React from "react";

const Card = ({ children, className }) => {
  return (
    <div className={`card shadow-sm p-3 ${className}`}>
      {children}
    </div>
  );
};

export default Card;
