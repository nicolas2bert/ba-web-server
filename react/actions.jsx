import Swagger from 'swagger-client';

export const CREATE_NEW_CLIENT = 'CREATE_NEW_CLIENT';
export const CREATE_NEW_USER = 'CREATE_NEW_USER';
export const PHOTO_SHOWN = 'PHOTO_SHOWN';

// Reload data every <RELOAD_TIME> ms
const FETCH_TIME = 60 * 1000;

export const createNewClient = client => ({
    type: CREATE_NEW_CLIENT,
    client,
});

export const createNewUser = user => ({
    type: CREATE_NEW_USER,
    user,
});

export const photoShown = photo => ({
    type: PHOTO_SHOWN,
    photoShown: photo,
});

let listPhotoInterval;
let showPhotoIdInterval;

function getPhotosAndSelectOne(client, user, dispatch) {
    return client.getPhotos({ id: user.id })
        .then(result => {
            console.log('result!!!', result)
            let i = 0;
            const nbrOfPhotos = result.body.length;
            const newPhotoTime = FETCH_TIME / nbrOfPhotos;
            console.log('newPhotoTime!!!', newPhotoTime);
            clearInterval(showPhotoIdInterval);
            dispatch(photoShown(result.body[i]));
            showPhotoIdInterval = setInterval(() => {
                i += 1;
                if (!result.body[i]) {
                    i = 0;
                }
                dispatch(photoShown(result.body[i]));
            }, newPhotoTime);
        })
        .catch(err => {
            console.log('getPhotosAndSelectOne => err!!', err)
        });
}

export function showPhoto() {
    return (dispatch, getState) => {
        const { client, user } = getState().auth;
        console.log('user123!!!', user);
        getPhotosAndSelectOne(client, user, dispatch);
        clearInterval(listPhotoInterval);
        listPhotoInterval = setInterval(() => {
            getPhotosAndSelectOne(client, user, dispatch);
        }, FETCH_TIME);
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
            const appElement = document.getElementById('app');
            const apiEndpoint = appElement.getAttribute('api_endpoint');
            dispatch(createNewUser({ id: infos.user.id }));
            return Swagger(`${apiEndpoint}/swagger.json`, {
                authorizations: {
                    'ui-api': infos.token,
                },
            }).then(client => {
                dispatch(createNewClient(client.apis.ui));
                // Promise.resolve();
            }).catch(err => {
                console.log('LOGIN err!!!', err);
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
