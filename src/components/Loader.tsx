import React from 'react';
import ClipLoader from 'react-spinners/ClipLoader';

interface IProps {}

const Loader = (props: IProps) => {
  return (
    <div className='screen-overlay'>
      <ClipLoader
        speedMultiplier={0.5}
        size={60}
        color='#0088cc'
      />
    </div>
  );
};

export default Loader;
