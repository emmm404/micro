import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Home from '@page/home';

//微前端加载器
import MicroFrontend from '@c/MicroFrontend.js';

const createHistory = require('history').createBrowserHistory
const history = createHistory()

const Before = (props) => <MicroFrontend props={props} module="beforeManage" />;
const Center = (props) => <MicroFrontend props={props} module="centerManage" />;
const After = (props) => <MicroFrontend props={props} module="afterManage" />;

const PrivateRoute = ({ component: Component, ...rest }) => <Route {...rest} render={props => <Component {...props} />} />

function App() {
  return (
    <Router history={history}>
      <Switch>
        <PrivateRoute path="/after" component={After} />
        <PrivateRoute path="/before" component={Before} />
        <PrivateRoute path="/center" component={Center} />
        <PrivateRoute path="/" component={Home} />
      </Switch>
    </Router>
  );
}

ReactDOM.render(<App />, document.getElementById("root"))
