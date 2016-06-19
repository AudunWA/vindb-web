var express = require('express');
var router = express.Router();
var format = require('date-format');
var squel = require("squel");

router.get('/', function (req, res, next) {
  var query = "SELECT *, pris/volum literspris,((alkohol/100*volum)/pris*1000000) epk FROM product";
  if (req.query.query) {
    query =   "SELECT *, pris/volum literspris,((alkohol/100*volum)/pris*1000000) epk FROM product WHERE varenavn LIKE ?";
  }

  console.log(squel.select().from("product").where("varenummer = ?","0'; DELETE FROM products;-- ").toString());

  // Custom order
  if (req.query.order_by) {
    var allowedValues = ['epk', 'literspris', 'varenummer', 'first_seen', 'last_seen', 'varenavn', 'volum', 'pris', 'varetype', 'produktutvalg', 'butikkategori', 'alkohol', 'land'];
    if (allowedValues.indexOf(req.query.order_by) != -1) {
      query += " ORDER BY " + req.query.order_by;

      // Order descending
      if (req.query.desc) {
        query += " DESC";
      }
    }
  }

  query += " LIMIT 200";

  // Get products from db
  pool.getConnection(function (err, connection) {
    if (err) throw err;
    connection.query(query, req.query.query, function (err, rows, productFields) {
      connection.release();

      res.render('products', { title: '123', products: rows, format: format });

    });
  });
});

module.exports = router;
