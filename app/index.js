const React = require('react');
const ReactDOM = require('react-dom');

import './styles/welcome-page.styl';

if(DEVELOPMENT) {
    require('./mock.js');
}

const App = require('./components/app.jsx');

ReactDOM.render(<App />, document.getElementById('root'));