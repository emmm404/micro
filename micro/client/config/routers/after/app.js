import React from 'react';
import ReactDOM from 'react-dom';
import { Router } from 'react-router-dom';
import Root from './index';

const App = ({ props }) => (
  <Router history={props.history}>
    <Root {...props} />
  </Router>
);

window.renderAfterManage = (domId, props) => {
  ReactDOM.render(<App props={props} />, document.getElementById(domId));
};

window.unmountAfterManage = (domId) => {
  ReactDOM.unmountComponentAtNode(document.getElementById(domId));
};
