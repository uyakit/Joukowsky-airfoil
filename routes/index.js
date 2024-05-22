const express = require("express");
const router = express.Router();
const fs = require('fs');
const subproc = require('child_process');

// https://zenn.dev/wkb/books/node-tutorial/viewer/todo_03

router.get("/", (req, res) => {
    res.render("./index.ejs",{ fs, subproc } );
});

// router.post("/", (req, res) => {
    // res.redirect('./index.ejs');
	// console.log('##############################');
// });

module.exports = router;
