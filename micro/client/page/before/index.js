import React, { useEffect } from 'react';
import './index.less';

const Before = (porps) => {
  useEffect(() => {
    window.before = 'bbbbb';
    console.log(window);
  }, []);
  return <div className="before">我是投前页</div>;
};

export default Before;
