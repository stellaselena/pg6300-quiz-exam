const express = require('express');
const Categories = require('../db/categories');

const router = express.Router();

router.get('/categories', function(req, res){
  const categories = Categories.getAllCategories();


  res.status(200).json({categories: categories});

});

module.exports = router;
