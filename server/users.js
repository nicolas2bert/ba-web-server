const users = {};

module.exports = {
    findById: id => users[id],
    save(user) {
        users[user.id] = user;
    },
};
