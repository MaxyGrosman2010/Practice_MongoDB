const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const cors = require('cors');
const server = express();
const {connect, getDb} = require('./db');
const { ObjectId } = require('mongodb');
const port = 3000;
let db;

server.use(express.json());
server.use(express.urlencoded({extended: true}));
server.use(bodyParser.json({limit: '50mb'}));
server.use(cookieParser());
server.use(morgan('dev'));
server.use(cors({credentials: true}));
server.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.header('Access-Control-Allow-Credentials', true);
    res.header('Access-Control-Allow-Headers', 
    'Origin, X-Requested-With, Content-Type, Accept');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    next();
});

connect((error) => {
    if(!error){
        server.listen(port, () => {
            console.log('Server listening to', port);
        });
        db = getDb();
    };
});

server.get('/books/', (req, res) => {
    const {page} = req.query;
    const booksPerPage = 3;
    let books = [];
    db.collection('books').find().sort({author: 1}).skip(page * booksPerPage).limit(booksPerPage)
        .forEach((book) => books.push(book)).then(() => res.status(200).json(books))
        .catch((error) => res.status(500).json(error)); //Gets a max of 100 documents
});
server.get('/book/:id', (req, res) => {
    const {id} = req.params || 0;
    let mongoId = new ObjectId(id);
    if(ObjectId.isValid(id)){//Suppose to stop from accessing with bad ids... It doesn't work 
        db.collection('books').findOne({_id: mongoId}).then((response) => res.status(200).json(response))
        .catch((error) => res.status(500).json(error));
    }else return res.status(404).json({message: "The id isn't valid"});
});
server.post('/book/update', (req, res) => {
    const {book} = req.body;
    db.collection('books').insertOne(book).then((result) => res.status(200).json(result))
    .catch((error) => res.status(500).json(error));
});
server.delete('/book/delete/:id', (req, res) => {
    const {id} = req.params;
    let mongoId = new ObjectId(id);
    if(ObjectId.isValid(id)){//Suppose to stop from accessing with bad ids... It doesn't work 
        db.collection('books').deleteOne({_id: mongoId}).then((response) => res.status(200).json(response))
        .catch((error) => res.status(500).json(error));
    }else return res.status(404).json({message: "The id isn't valid"});
});

server.patch('/book/update/:id', (req, res) => {
    const {update} = req.body;
    const {id} = req.params;
    let mongoId = new ObjectId(id);
    if(ObjectId.isValid(id)){//Suppose to stop from accessing with bad ids... It doesn't work 
        db.collection('books').updateOne({_id: mongoId}, {$set: update})
        .then((response) => res.status(200).json(response)).catch((error) => res.status(500).json(error));
    }else return res.status(404).json({message: "The id isn't valid"});
});

module.exports = {db};