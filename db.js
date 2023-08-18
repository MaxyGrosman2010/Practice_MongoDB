const {MongoClient} = require('mongodb');

let dbConnection;

const connect = (cb) => {
    MongoClient.connect('mongodb://localhost:27017/bookstore')
    .then((client) =>  {
        dbConnection = client.db();
        return cb();
    }).catch((error) => {
        console.log(error);
        return cb();
    });// For local database.
};

const getDb = () => dbConnection;

module.exports = {connect, getDb};