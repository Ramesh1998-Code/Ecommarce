import React from 'react'
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
function Crousel({
     data = [],
  settings = {},
  renderItem,
  title

}) {

 
    var Defaultsettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    ...settings
    
  };
  return (
    <div>
        <h3>{title}</h3>
        <Slider {...Defaultsettings}>
        {
            data.map((item,index)=> (
                <div>
                    {renderItem ? renderItem(item, index) : <h3 key={index}>{item}</h3>}
                </div>
            ))
        }
    </Slider>
    </div>
  )
}

export default Crousel