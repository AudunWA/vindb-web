var express = require('express');
var router = express.Router();
var format = require('date-format');
var squel = require("squel");

router.get('/', function(req, res, next) {
  var squelQuery = squel.select({autoQuoteAliasNames: false}).field("pc.product_id").field("p.varenavn").field("field.display_name").field("pc.old_value").field("pc.new_value").field("cl.time").from("product_change pc").join("field", null, "field.field_id = pc.field_id").join("change_log", "cl", "cl.change_id = pc.change_id").join("product", "p", "p.varenummer = pc.product_id").order("time", false);
  console.log("Testa!");
  // Date range
  if (req.query.start_date) {
    if (req.query.end_date) {
      squelQuery.where("DATE(cl.time) BETWEEN ? AND ?", req.query.start_date, req.query.end_date).limit(1000); // Workaround for really big page
    }
  } else {
    squelQuery.limit(200);
  }

  if (req.query.field_type) {
    squelQuery.where("pc.field_id = ?", req.query.field_type);
  }

  //console.log(squelQuery.toString());

  // Get history from db
  pool.getConnection(function(err, connection) {
    if (err)
      throw err;
    var query = squelQuery.toParam();
    connection.query(query.text, query.values, function(err, rows, fields) {
      connection.release();

      //getPageCount(connection, function(pageCount) {
      res.render('history', {
        title: 'Produktendringer',
        /*pages: pageCount,*/
        changes: rows,
        format: format
      });

      //});
    });
  });
});

module.exports = router;
