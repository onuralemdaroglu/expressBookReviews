const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;
 
  if (username && password) {
    if (!isValid(username)) {
      users.push({"username":username,"password":password});
      return res.status(200).json({message: "User successfully registered. Now you can move on!"});
    } else {
      return res.status(404).json({message: "You know what, user already exist!"});
    }
  }
  return res.status(404).json({message: "You are not belong here...Please go away!"});
});


// Get the book list available in the shop
  public_users.get('/',function (req, res) {
    const bookList = req.params.books;
    res.send(JSON.stringify(books,null,4));
  })

// Task 10 Promise-Get the book list available in the shop
public_users.get('/books', function (req,res) {
  const bookList = new Promise((resolve,reject)=>{
    resolve(res.send(JSON.stringify(books,null,4)));
  }).then(() => resolve("Book List has been updated!"));
})

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  res.send(books[isbn])
 });

 // Task 11 Promise -Get book details based on ISBN
 public_users.get('/isbn/:isbn',function (req,res) {
  const book = new Promise((resolve,reject)=> {
    const isbn = req.params.isbn;
    resolve(res.send(JSON.stringify(books[isbn],null,4)));
  }).then(()=> resolve("You have been reached the book details with ISBN"))
 })
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  const author = req.params.author;
  let filtered = Object.values(books).filter((books) => books.author === author);
  res.send(filtered);
})

// Task 12 Promises-Get book details based on author
public_users.get('/author/:author',function (req,res) {
  const authors = new Promise((resolve,reject)=>{
    const author = req.params.author;
    let filtered = Object.values(books).filter((books) => books.author === author);
    resolve(res.send(JSON.stringify(filtered)))
  })
})

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  const title = req.params.title;
  let getTitle = Object.values(books).filter((book) => book.title === title);
  res.send(getTitle);
});

// Task 13 Promises-Get all books based on title
public_users.get('/title/:title',function (req, res) {
  const title = new Promise((resolve,reject)=>{
    const title = req.params.title;
    let getTitle = Object.values(books).filter((book) => book.title === title);
    resolve(res.send(JSON.stringify(getTitle)))
  });
})

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  res.send(books[isbn].reviews);
});

module.exports.general = public_users;
