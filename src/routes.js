const { 
  addBooks, 
  getAllBooks, 
  getBookById,
  editBookById,
  deleteBookById
} = require('./handler');

const routes = [
  {
    method: 'POST',
    path: '/books',
    handler: addBooks,
    options: {
      cors: {
        origin: ['*'],
      },
    },
  },
  {
    method: 'GET',
    path: '/books',
    handler: getAllBooks
  },
  {
    method: 'GET',
    path: '/books/{bookId}',
    handler: getBookById,
  },
  {
    method: 'PUT',
    path: '/books/{bookId}',
    handler: editBookById
  },
  {
    method: 'DELETE',
    path: '/books/{bookId}',
    handler: deleteBookById
  }
];
 
module.exports = routes;