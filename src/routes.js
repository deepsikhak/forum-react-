import React, {Component} from 'react'
import {Route, Router} from 'react-router'
import history from './history'
import Home from './Component/Home'
import Post from './Component/Post'
import Trash from './Component/Trash'

class Routes extends Component {
    render() {
        return (
            <div>
                <Router history={history}>
                    <Route exact path='/' component={Home} />
                    <Route exact path='/post' component={Post} />
                    <Route exact path='/trash' component={Trash} />
                </Router>
            </div>
        )
    }
}

export default Routes;
