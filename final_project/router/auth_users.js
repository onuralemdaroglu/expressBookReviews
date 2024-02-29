const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
  let userswithsamename = users.filter((user)=>{
    return user.username === username
  });
  if(userswithsamename.length > 0) {
    return true;
  } else {
    return false;
  }
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
let validusers = users.filter((user)=> {
  return (user.username === username && user.password === password)
});
if(validusers.length > 0) {
  return true;
} else {
  return false;
}
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  
  const username = req.body.username;
  const password = req.body.password;

  if(!username || !password) {
    return res.status(404).json({message: "Error logging in"});
  }

  if(authenticatedUser(username,password)) {
    let accessToken = jwt.sign({
      data: password
    }, 'access', { expiresIn: 60 * 60 });

    req.session.authorization = {
      accessToken,username
    }
    return res.status(200).send("User succesfully login");
  } else {
    return res.status(208).json({message: "Invalid Login. Check username and password" });
  }
});

// Add a book review
regd_users.put("/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const review = req.body.review;
  const username = req.session.authorization.username;

  if (books[isbn]) {
    if (books[isbn].reviews[username]) {
      books[isbn].reviews[username] = review;
      return res.status(200).json({message: "Reviews has been modified!"});
    } else {
      books[isbn].reviews[username] = review;
      return res.status(200).json({message: "Review has been added!"});
      
    }
  } else {
    return res.status(404).json({message: "No match!"});
  }
});

//Delete a book review
regd_users.delete("/review/:isbn", (req,res) => {
  const isbn = req.params.isbn;
  const username = req.session.authorization.username;

  if (!isbn || !username) {
    return res.status(400).json({ message: "Invalid request." });
  }

  if(books[isbn]) {
    if (books[isbn].reviews[username]) {
      delete books[isbn].reviews[username];
      return res.status(200).json({message: "Review deleted successfully" })
    } else {
      return res.status(404).json({message: "Not found"});
    }
    
  } else {
    return res.status(404).json({message: "Book not found"})
  }
})

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;


