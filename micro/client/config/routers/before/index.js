import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Before from '@before/index';

function App() {
  return (
    <Switch>
      <Route exact path="/before" component={Before} />
    </Switch>
  );
}

export default App;
