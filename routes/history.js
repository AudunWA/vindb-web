var express = require('express');
var router = express.Router();
var format = require('date-format');
var squel = require("squel");

router.get('/', function (req, res, next) {
  var query = "SELECT pc.product_id, p.varenavn, field.display_name, pc.old_value, pc.new_value, cl.time FROM product_change pc INNER JOIN field USING(field_id) INNER JOIN change_log cl USING(change_id) INNER JOIN product p ON (p.varenummer = pc.product_id) ORDER BY time DESC";
  if (req.query.query) {
    query = "SELECT *, pris/volum literspris FROM product WHERE varenavn LIKE ?";
  }

  // Custom order
  if (req.query.order_by) {
    var allowedValues = ['literspris', 'varenummer', 'first_seen', 'last_seen', 'varenavn', 'volum', 'pris', 'varetype', 'produktutvalg', 'butikkategori', 'alkohol', 'land'];
    if (allowedValues.indexOf(req.query.order_by) != -1) {
      query += " ORDER BY " + req.query.order_by;

      // Order descending
      if (req.query.desc) {
        query += " DESC";
      }
    }
  }

  query += " LIMIT 1000";

  // Get history from db
  pool.getConnection(function (err, connection) {
    if (err) throw err;
    connection.query(query, req.query.query, function (err, rows, fields) {
      connection.release();

      res.render('history', { title: '123', changes: rows, format: format });

    });
  });
});

module.exports = router;
