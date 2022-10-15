import React from "react";
import "./Indicator.css";

function Indicator({ children, title }) {
  return (
    <div className="indicator">
      <h3 className="indicator__title">{title}</h3>
      <p className="indicator__content">{children}</p>
    </div>
  );
}

export default Indicator;
