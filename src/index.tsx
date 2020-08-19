import React from 'react';
import ReactDOM from 'react-dom';
import './index.less';
import Router from './router/router';
import './api/index'
import {disableReactDevTools} from "./utils/utils";

if (process.env.NODE_ENV == 'production') {
    disableReactDevTools();
}
ReactDOM.render(<Router/>, document.getElementById('root'));
