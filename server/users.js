const jwt = require('jwt-simple');
const Swagger = require('swagger-client');

const users = {};

function getToken() {
    return jwt.encode({ role: 'intern' }, 'secret');
}

function getClient() {
    return Swagger('http://127.0.0.1:8383/swagger.json', {
        authorizations: {
            'intern-api': getToken(),
        },
    }).then(client => {
        console.log('client.apis!!!', client.apis);
        return client.apis.intern;
    }).catch(err => {
        console.log('LOGIN err!!!', err);
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
