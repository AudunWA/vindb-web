var express = require('express');
var router = express.Router();
var format = require('date-format');
var squel = require("squel");

router.get('/', function (req, res, next) {
  var query = "SELECT pc.product_id, p.varenavn, field.display_name, pc.old_value, pc.new_value, cl.time FROM product_change pc INNER JOIN field USING(field_id) INNER JOIN change_log cl USING(change_id) INNER JOIN product p ON (p.varenummer = pc.product_id)";
  var parameters = [];

  // Date range
  if (req.query.start_date) {
    if (req.query.end_date) {
      query += " WHERE DATE(cl.time) BETWEEN ? AND ? ORDER BY time DESC";
      parameters.push(req.query.start_date);
      parameters.push(req.query.end_date);
    }
  }
  else {
    query += " ORDER BY time DESC LIMIT 200";
  }

  // Get history from db
  pool.getConnection(function (err, connection) {
    if (err) throw err;
    connection.query(query, parameters, function (err, rows, fields) {
      connection.release();

      //getPageCount(connection, function(pageCount) {
      res.render('history', { title: 'Produktendringer', /*pages: pageCount,*/ changes: rows, format: format });

      //});
    });
  });
});

module.exports = router;
