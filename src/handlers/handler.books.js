// const {db} = require('../../index');

// function getBooks(req, res){
//     let books = [];
//     db.collection('books').find().sort({author: 1})
//         .forEach((book) => books.push(book)).then(() => res.status(200).json(books))
//         .catch((error) => {
//             res.status(500).json(error)
//         }); //Gets a max of 100 documents
// };

// module.exports = {
//     getBooks
// };