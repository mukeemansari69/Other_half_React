import React from "react";
import "/public/Home/css/marque.css";
export default function Marque() {
  const items = [
    "NON GMO",
    "HUMAN GRADE INGREDIENTS",
    "CLINICALLY TESTED",
    "NO ARTIFICIAL FLAVORS",
    "VETERINARIAN RECOMMENDED",
    "MANUFACTURED IN THE USA",
  ];

  return (
    <div className="w-full bg-[#E8744A]">
      <div className="max-w-[1920px] mx-auto overflow-hidden py-[23px] px-[50px]">
        
        <div className="marquee-track">

          {[...items, ...items].map((text, index) => (
            <div key={index} className="marquee-item">
              
              <span className="marquee-text">
                {text}
              </span>

              <img
                src="/Home/images/paw.svg"
                alt="paw"
                className="paw-icon"
              />

            </div>
          ))}

        </div>

      </div>
    </div>
  );
}

