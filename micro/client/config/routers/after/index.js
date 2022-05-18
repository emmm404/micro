import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import After from '@after/index';
// import AfterDetail from './afterDetail';
// import Detail from '../../pages/after/afterPage/afterDetail';

function App() {
  return (
    <Switch>
      <Route exact path="/after" component={After} />
      {/* <Route path="/after/detail" component={Detail} />; */}
    </Switch>
  );
}

export default App;
