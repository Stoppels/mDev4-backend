// configure database
var config = {
    userName: 'Nick',
    password: 'Kinderenvoorkinderen!12',
    server: 'lvsdb.database.windows.net',
    // If you are on Microsoft Azure, you need this:
    options: {encrypt: true, database: 'LVSDB'}
};

module.exports = config;