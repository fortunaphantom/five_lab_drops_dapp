import React, { useEffect, useState } from 'react';

interface IProps {}

const ImageFlipper = (props: IProps) => {
  const [imageIndex, setImageIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setImageIndex(Math.round(Math.random() * 100000) % 50);
    }, 500);
    return () => clearInterval(id);
  }, []);

  return (
    <div className='image-flipper'>
      <img src={`./assets/${imageIndex}.png`} alt="art" />
    </div>
  );
};

export default ImageFlipper;
