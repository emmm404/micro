import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Center from '@center/index';

function App() {
  return (
    <Switch>
      <Route exact path="/center" component={Center} />
    </Switch>
  );
}

export default App;
