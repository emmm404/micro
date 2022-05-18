import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import AfterDetail from '../../pages/after/afterPage/afterDetail';

function App() {
  return <Route exact path="/after/detail" component={AfterDetail} />;
}

export default App;
