const jwt = require('jwt-simple');
const Swagger = require('swagger-client');

// for Docker on mac tests
const apiEndpoint = process.env.DEV ? 'http://host.docker.internal:8084' :
    process.env.API_ENDPOINT;

function getToken() {
    return jwt.encode({ role: 'intern' }, 'secret');
}

function getClient() {
    console.log('apiEndpoint!!!', apiEndpoint);
    return Swagger(`${apiEndpoint}/swagger.json`, {
        authorizations: {
            'intern-api': getToken(),
        },
    }).then(client => {
        return client.apis.intern;
    }).catch(err => {
    });
}

module.exports = {
    // findById: id => users[id],
    findById: id => {
        // return users[id]
        return getClient().then(client => {
            return client.getUsersId({ id });
        });
    },
    save: user => {
        // users[user.id] = user;
        console.log('SAVE!!! user:', user);
        return getClient().then(client => {
            console.log('SAVE client!!!', client);
            return client.saveUser({ user });
        });
    },
};
