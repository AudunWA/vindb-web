/**
 * Created by Audun on 29.12.2016.
 */
var express = require('express');
var router = express.Router();
var squel = require("squel");

router.get('/:product_id', function(req, res, next) {
  var productId = req.params.product_id;
  pool.getConnection(function(err, connection) {
    if (err) {
      return next(err);
    }

    connection.query("SELECT old_value, new_value, time FROM product_change NATURAL JOIN change_log WHERE field_id = 4 AND product_id = ? ORDER BY time LIMIT 200", [productId], function(err, rows, fields) {
      if (err) {
        return next(err);
      }
      res.json(rows);
    });
  });
});

module.exports = router;
