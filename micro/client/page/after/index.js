import React, { useEffect } from 'react';

const After = () => {
  useEffect(() => {
    console.log(window);
  }, []);
  return <div>我是投后首页页</div>;
};

export default After;
