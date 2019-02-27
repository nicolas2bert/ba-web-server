import Swagger from 'swagger-client';

export const CREATE_NEW_CLIENT = 'CREATE_NEW_CLIENT';
export const PHOTO_SHOWN = 'PHOTO_SHOWN';

export const createNewClient = client => ({
    type: CREATE_NEW_CLIENT,
    client,
});

export const photoShown = photo => ({
    type: PHOTO_SHOWN,
    photoShown: photo,
});

let listPhotoInterval;
let showPhotoIdInterval;

function getPhotosAndSelectOne(client, dispatch) {
    return client.getPhotos({ id: '147032531@N08' }).then(result => {
        clearInterval(showPhotoIdInterval);
        let i = 0;
        dispatch(photoShown(result.body[i]));
        showPhotoIdInterval = setInterval(() => {
            i += 1;
            if (!result.body[i]) {
                i = 0;
            }
            dispatch(photoShown(result.body[i]));
        }, 10 * 1000);
    });
}

export function showPhoto() {
    return (dispatch, getState) => {
        const { client } = getState().auth;
        getPhotosAndSelectOne(client, dispatch);
        clearInterval(listPhotoInterval);
        listPhotoInterval = setInterval(() => {
            getPhotosAndSelectOne(client, dispatch);
        }, 60 * 1000);
    };
}

export function clearIntervals() {
    return () => {
        clearInterval(listPhotoInterval);
        clearInterval(showPhotoIdInterval);
    };
}

export function getAuth() {
    return fetch('/auth/refresh', { credentials: 'same-origin' })
        .then(response => response.json())
        .then(respJ => {
            console.log('getAuth() respJ!!', respJ);
            return {
                user: respJ.user,
                token: respJ.token,
            };
        }).catch(err => {
            console.log('getAuth() err!!!', err);
        });
}

export function login() {
    return dispatch =>
        getAuth().then(infos => {
            console.log('getAuth() infos!!!', infos);
            return Swagger('http://127.0.0.1:8383/swagger.json').then(client => {
                dispatch(createNewClient(client.apis.default));
                Promise.resolve();
            });
        });
}

// export function login() {
//     const SFId = '5391959';
//     return dispatch => {
//         dispatch(currentWeatherRequesting());
//         client.getCurrentWeatherById(SFId)
//             .then(response => {
//                 dispatch(currentWeatherRequestSuccess(response));
//             })
//             .catch(e => dispatch(currentWeatherRequestFailure(e)));
//     };
// }

// https://api.openweathermap.org/data/2.5/weather?id=5391959&appid=79c7d98d79e9741603d37b74a82f8f9b
