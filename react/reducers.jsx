import { combineReducers } from 'redux';
import { CREATE_NEW_CLIENT, PHOTO_SHOWN } from './actions';

const auth = (state = { client: {} }, action) => {
    switch (action.type) {
    case CREATE_NEW_CLIENT: {
        return { ...state, client: action.client };
    }
    default:
        return state;
    }
};

const photo = (state = {}, action) => {
    switch (action.type) {
    case PHOTO_SHOWN: {
        return { ...state, photoShown: action.photoShown };
    }
    default:
        return state;
    }
};

export default combineReducers({
    auth,
    photo,
});
