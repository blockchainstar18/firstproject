import React, { useState } from 'react';

const Accordion = ({ title, content }) => {
  const [isActive, setIsActive] = useState(false);

  return (
    // <div class="accordion-item">
    //   <div className="accordion-title" onClick={() => setIsActive(!isActive)}>
    //     <div id = "row">
    //       <div id = "left">{title}</div>
    //       <div id = "right">{isActive ? '-' : '+'}</div>
    //     </div>
    //   </div>
    //   {isActive && <div className="accordion-content">{content}</div>}
    // </div>

    <div class="accordion">
    <div class="accordion__intro">
      <h4>{title}</h4>
    </div>
    <div class="accordion__content">
      <p>{content}</p>
    </div>
    </div>
  );
};

export default Accordion;