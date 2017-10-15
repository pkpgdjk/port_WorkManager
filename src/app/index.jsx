import React from 'react'
import {render} from 'react-dom'
import Main from './page/Main.jsx'
import '../css/bootstrap.min.css';
import '../css/myCss.css';
import {BrowserRouter, Route, Switch, Link, Router, IndexRoute} from 'react-router-dom'
import Manager from './page/manager.jsx'
import {createBrowserHistory} from 'history';

import Root from './page/root.jsx';


// import Router from 'react-hash-router';
// import {Path} from 'react-hash-router';

const browserHistory = createBrowserHistory();
class App extends React.Component {
    constructor(props) {
        super(props)


    }

    render() {


        return (

                <BrowserRouter>
                    <div className="container">
                           <Route exact path='/' component={Main}/>
                          <Route path='/manager/:user' component={Manager}/>
                    </div>
                </BrowserRouter>


        );
    };
}


render(<App/>, document.getElementById("root-app"));
