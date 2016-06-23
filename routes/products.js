var express = require('express');
var router = express.Router();
var format = require('date-format');
var squel = require("squel");

const ENTRIES_PER_PAGE = 100;

router.get('/', function (req, res, next) {
  var query = "SELECT *, pris/volum literspris,((alkohol/100*volum)/pris*1000000) epk FROM product";
  if (req.query.query) {
    query = "SELECT *, pris/volum literspris,((alkohol/100*volum)/pris*1000000) epk FROM product WHERE varenavn LIKE ?";
  }

  console.log(squel.select().from("product").where("varenummer = ?", "0'; DELETE FROM products;-- ").toString());

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

  // Get products from db
  pool.getConnection(function (err, connection) {
    if (err) throw err;
    getPageCount(connection, query, req.query.query, function (pageCount) {
      query += " LIMIT " + ENTRIES_PER_PAGE;
      connection.query(query, req.query.query, function (err, rows, productFields) {
        connection.release();
        res.render('products', { title: '123', pageCount: pageCount, products: rows, format: format });
      });
    });
  });
});

function getPageCount(connection, query, params, cb) {
  query = query.replace("SELECT *", "SELECT COUNT(1) as count");
  connection.query(query, params, function (err, rows, fields) {
    if (err) throw err;
    cb(Math.ceil(rows[0].count / ENTRIES_PER_PAGE));
  });
}

module.exports = router;
