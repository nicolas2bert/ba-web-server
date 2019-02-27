import React from 'react';
import { BrowserRouter, Route } from 'react-router-dom';
import Home from './Home';

const Routes = props => {
    return (
        <BrowserRouter>
            <div>
                <Route exact path="/" render={() => <Home props={props} />} />
            </div>
        </BrowserRouter>
    );
};

export default Routes;
