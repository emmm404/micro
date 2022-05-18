import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => (
  <div>
    <h1>我是首页</h1>
    <ul>
      <li>
        <Link to="/before">投前</Link>
      </li>
      <li>
        <Link to="/center">投中</Link>
      </li>
      <li>
        <Link to="/after">投后</Link>
      </li>
    </ul>
  </div>
);

export default Home;
