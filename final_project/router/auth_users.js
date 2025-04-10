const express = require("express");
const jwt = require("jsonwebtoken");
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => {
  //returns boolean
  //write code to check is the username is valid
  const usersList = users.filter((user) => user.username == username);
  if (usersList.length > 0) {
    return true;
  } else {
    return false;
  }
};

const authenticatedUser = (username, password) => {
  //returns boolean
  //write code to check if username and password match the one we have in records.
  const usersList = users.filter(
    (user) => user.password == password && user.username == username
  );
  if (usersList.length > 0) {
    return true;
  } else {
    return false;
  }
};

//only registered users can login
regd_users.post("/login", (req, res) => {
  const { username, password } = req.body;

  // Check if username or password is missing
  if (!username || !password) {
    return res.status(404).json({ message: "Error logging in" });
  }

  if (authenticatedUser(username, password)) {
    let accessToken = jwt.sign({data:password},'access',{expiresIn:'24h'})
    // store token in session 
    req.session.authorization = {accessToken,username}

    res.status(200).send('Success! user logged in')
  }else {

    return res.status(208).json({ message: "Invalid Login. Check username and password" });
  }

});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here  
  const {username} = req.session.authorization
  const review = req.query;
  const isbn = req.params.isbn

  // If the same user posts a different review on the same ISBN, it should modify the existing review. 
  // If another user logs in and posts a review on the same ISBN, it will get added as a different review under the same ISBN.
   // Validate ISBN
  if (!books[isbn]) {
    return res.status(404).json({ message: "Book not found" });
  }

  // Update the review
  books[isbn].reviews[username] = review;

  return res.status(200).json({ message: "Review updated successfully", reviews: books[isbn].reviews });
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
  const { username } = req.session.authorization;
  const isbn = req.params.isbn;

  // Check if the book exists
  if (!books[isbn]) {
    return res.status(404).json({ message: "Book not found" });
  }

  // Check if the user has a review for this book
  if (!books[isbn].reviews[username]) {
    return res.status(404).json({ message: "No review found for this user" });
  }

  // Delete the user's review
  delete books[isbn].reviews[username];

  return res.status(200).json({ message: "Review deleted successfully", reviews: books[isbn].reviews });
});


module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
