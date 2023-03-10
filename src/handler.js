const { nanoid } = require('nanoid');
const notes = require('./notes');
const { books, listBooks } = require('./books');

const addBooks = (request, h) => {
    const { 
        name, 
        year,
        author,
        summary,
        publisher,
        pageCount,
        readPage,
        reading  
    } = request.payload;

    const id = nanoid(16);
    const insertedAt = new Date().toISOString();
    const updatedAt = insertedAt;

    if ( name == undefined || name == '' ) {
        const failResponse = h.response({
            status: 'fail',
            message: 'Gagal menambahkan buku. Mohon isi nama buku'
        })

        failResponse.code(400);
        return failResponse;
    } else {
        const finished = "finished";

        if ( pageCount === readPage ) {
            const newBook = {
                id,
                name, 
                year,
                author,
                summary,
                publisher,
                pageCount,
                readPage,
                [finished] : true,
                reading,
                insertedAt,
                updatedAt
            }

            const listBook = {
                id,
                name,
                publisher
            }

            books.push(listBook);
            listBooks.push(newBook);
            const addListBook = listBooks.filter((list_book) => list_book.id === id).length > 0;
            const addSuccessBook = books.filter((book) => book.id === id).length > 0;

            if ( addSuccessBook && addListBook ) {
                const successResponse = h.response({
                    status: 'success',
                    message: 'Buku berhasil ditambahkan',
                    data: {
                        bookId: id
                    }
                });

                successResponse.code(201);
                return successResponse;
            }

            const failResponse = h.response({
                status: 'error',
                message: 'Buku gagal ditambahkan'
            })

            failResponse.code(500);
            return failResponse;

        } else if ( pageCount > readPage ) {
            const newBook = {
                id,
                name, 
                year,
                author,
                summary,
                publisher,
                pageCount,
                readPage,
                [finished] : false,
                reading,
                insertedAt,
                updatedAt
            }

            const listBook = {
                id,
                name,
                publisher
            }

            books.push(listBook);
            listBooks.push(newBook);
            const addListBook = listBooks.filter((list_book) => list_book.id === id).length > 0;
            const addSuccessBook = books.filter((book) => book.id === id).length > 0;

            if ( addSuccessBook && addListBook ) {
                const successResponse = h.response({
                    status: 'success',
                    message: 'Buku berhasil ditambahkan',
                    data: {
                        bookId: id
                    }
                });

                successResponse.code(201);
                return successResponse;
            }

            const failResponse = h.response({
                status: 'error',
                message: 'Buku gagal ditambahkan'
            })

            failResponse.code(500);
            return failResponse;
        } else if ( pageCount < readPage ) {
            const failResponse = h.response({
                status: 'fail',
                message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount'
            })

            failResponse.code(400);
            return failResponse;
        } else {
            const failResponse = h.response({
                status: 'error',
                message: 'Buku gagal ditambahkan'
            })

            failResponse.code(500);
            return failResponse;
        }
    }

}

const getAllBooks = (request, h) => {
    
  const tampungBuku = [];
  let ini_response = null;
  let {name = '', reading = '', finished = ''} = request.query;
  let hasil = -1;
  if (listBooks.size === 0) {
    ini_response = h.response({status: 'success', data: {books: []}});
  } else {
    for (let i = 0; i < listBooks.length; i++) {
      hasil = -1;

      // Jika request query tidak di isikan name
      if (name !== '' || reading !== '' || finished !== '') {
        if ( reading === 0 ) {
            reading = false;
        } else if ( reading === 1 ) {
            reading = true;
        }

        if (name === listBooks[i].name && reading == listBooks[i].reading &&
            finished == listBooks[i].finished && finished !== '' &&
            reading !== '') {
          hasil = 1;
        } else if ( name === listBooks[i].name && reading == listBooks[i].reading &&
            reading !== '' ) {
            hasil = 3;
        } else if ( name === listBooks[i].name && finished == listBooks[i].finished &&
            finished !== '' ) {
            hasil = 4;
        } else if ( reading == listBooks[i].reading &&
            finished == listBooks[i].finished && finished !== '' &&
            reading !== '' ) {
            hasil = 5;
        } else if (listBooks[i].name.toLowerCase().includes(
            name.toLowerCase()) && name !== '') {
          hasil = 2;
        } else if ( reading == listBooks[i].reading && reading !== '' ) {
            hasil = 6
        } else if ( finished == listBooks[i].finished && finished !== '' ) {
            hasil = 7;
        }

      } else {
        hasil = 0;
      }

      if (hasil >= 0) {
        tampungBuku.push({
            id: listBooks[i].id, 
            name: listBooks[i].name,
            publisher: listBooks[i].publisher
        });
      }
    }

    ini_response = h.response({status: 'success', data: {books: tampungBuku}});
  }
  return ini_response.code(200);

}

const getBookById = (request, h) => {
    const { bookId } = request.params;

    const book = listBooks.filter((b) => b.id === bookId)[0]; 
    // const bookName = listBooks.filter((bN) => bN.id === bookId)[0]

    if ( book !== undefined) {
        return {
            status: 'success',
            data: {
                book,
            }
        } 
    }

    const response = h.response({
        status: 'fail',
        message: 'Buku tidak ditemukan'
    })

    response.code(404);
    return response;
}

const editBookById = (request, h) => {
    const { bookId } = request.params;
    const book = listBooks.filter((lb) => lb.id === bookId)[0];

    if ( book === undefined ) {

        const response = h.response({
            status: 'fail',
            message: 'Gagal memperbarui buku. Id tidak ditemukan',
        });

        response.code(404);
        return response;

    }

    const { 
        name, 
        year,
        author,
        summary,
        publisher,
        pageCount,
        readPage,
        reading  
    } = request.payload;

    if ( name == undefined || name == '' ) {
        const failResponse = h.response({
            status: 'fail',
            message: 'Gagal memperbarui buku. Mohon isi nama buku'
        })

        failResponse.code(400);
        return failResponse;
    }

    const finished = "finished";
    const updatedAt = new Date().toISOString();

    if ( pageCount === readPage ) {

        const index = listBooks.findIndex((ls_book) => ls_book.id === bookId);
        if ( index !== -1 ) {
            listBooks[index] = {
                ...listBooks[index],
                name, 
                year,
                author,
                summary,
                publisher,
                pageCount,
                readPage,
                [finished] : true,
                reading,
                updatedAt
            }

            const response = h.response({
              status: 'success',
              message: 'Buku berhasil diperbarui',
            });
    
            response.code(200);

            return response;
        }

    } else if ( pageCount > readPage ) {

        const index = listBooks.findIndex((ls_book) => ls_book.id === bookId);
        if ( index !== -1 ) {
            listBooks[index] = {
                ...listBooks[index],
                name, 
                year,
                author,
                summary,
                publisher,
                pageCount,
                readPage,
                [finished] : false,
                reading,
                updatedAt
            }

            const response = h.response({
              status: 'success',
              message: 'Buku berhasil diperbarui',
            });
    
            response.code(200);

            return response;
        }

    } else if ( pageCount < readPage ) {

        const failResponse = h.response({
            status: 'fail',
            message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount'
        })

        failResponse.code(400);
        return failResponse;

    }    

}

const deleteBookById = (request, h) => {
    const { bookId } = request.params;
    const book = listBooks.filter((lb) => lb.id === bookId)[0];

    if ( book === undefined ) {

        const response = h.response({
            status: 'fail',
            message: 'Buku gagal dihapus. Id tidak ditemukan',
        });

        response.code(404);
        return response;

    }    

    const index = listBooks.findIndex((lsBook) => lsBook.id === bookId);

    if ( index !== -1 ) {

        listBooks.splice(index, 1);

        const response = h.response({
            status: 'success',
            message: 'Buku berhasil dihapus'
        })

        response.code(200);
        return response;

    }

}

module.exports = { 
    addBooks, 
    getAllBooks, 
    getBookById, 
    editBookById,
    deleteBookById
}










