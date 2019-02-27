import { Container } from 'reactstrap';
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import thunkMiddleware from 'redux-thunk';
import reducers from './reducers';
import Routes from './Routes';

// import { editWebsite, generateWebsite } from './actions';

const store = createStore(
    reducers,
    applyMiddleware(
        thunkMiddleware, // lets us dispatch() functions
    ),
);

// console.log('getState!!!', store.getState());

// store.dispatch(generateWebsite({ title: 'My first website' }));

// console.log('getState2!!!', store.getState());

// const unsubscribe = store.subscribe(() => console.log('store.getState() ===>>> ', store.getState()));

const node = document.getElementById('app');

console.log("node!!!", node)

const app = () => {
    console.log("RENDER!!!!")
    ReactDOM.render(
        <Provider store={store}>
            <Container fluid="true">
                <Routes />
            </Container>
        </Provider>
        , node,
    );
};

app();
