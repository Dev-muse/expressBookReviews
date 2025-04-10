const express = require('express');
let books = require("./booksdb.js");
const { authenticated } = require('./auth_users.js');
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


const userExists = (username,password)=>{
  const userList = users.filter(user=>{
    return (user.username==username&&user.password==password)
  })
  console.log(userList)
  return userList.length>0? true:false
}


public_users.post("/register", (req,res) => {
  //Write your code here
const {username,password} = req.body
if(!username||!password){
  return res.status(300).json({message: "No username or password"});
}else{
  if(!userExists(username,password)){
    users.push({username,password})
    return res.status(200).json({message: "User successfully registered. Now you can login"});
  }else{
    return res.status(409).json({message: "User already exists!"});
  }
}

});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  return res.send(JSON.stringify({books},null,4))
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  const bookDetails = books[isbn]
  if(bookDetails){

    return res.send(JSON.stringify({bookDetails}, null, 4));
  }else{
    return res.status(404).json({message:'Book not found'})
  }
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  const author = req.params.author;
  const bookValues = Object.values(books);
  const filteredBooks = bookValues.filter(book=>{
    return book.author==author
  })

  const bookDetail= filteredBooks[0]

 console.log(bookDetail)

  if(bookDetail){
    return res.status(200).send(JSON.stringify({bookDetail},null,4));
  }else{
    //Write your code here
    return res.status(404).json({message: "Book not found"});
  }
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
const bookTitle = req.params.title;

const bookValues = Object.values(books);
  const filteredBooks = bookValues.filter(book=>{
    return book.title==bookTitle
  })

  const bookDetail= filteredBooks[0]


  if(bookDetail){
    return res.status(200).send(JSON.stringify({bookDetail},null,4));
  }else{
    //Write your code here
    return res.status(404).json({message: "Book not found"});
  }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  const book = books[isbn];
  if(!book){
    return res.status(404).json({message: "Book not found"});
  }
  const bookReview = book["reviews"];
  console.log(bookReview)

  if(!bookReview){
    return res.status(201).json({message: "Book has no reviews"});
  }else {
    return res.status(200).send(JSON.stringify({bookReview},null,4))
  }
});

module.exports.general = public_users;
