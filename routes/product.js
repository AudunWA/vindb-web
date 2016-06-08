var express = require('express');
var router = express.Router();
var format = require('date-format');

router.get('/:product_id', function (req, res, next) {
  // Get product from db
  pool.getConnection(function (err, connection) {
    if (err) throw err;
    connection.query("SELECT * FROM product WHERE varenummer = ?", req.params.product_id, function (err, productRows, productFields) {
      if (err) throw err;
      connection.query("SELECT field.display_name name, pc.old_value, pc.new_value, cl.time FROM product_change pc INNER JOIN field USING(field_id) INNER JOIN change_log cl USING(change_id) WHERE product_id = ? ORDER BY time DESC", req.params.product_id, function (err, historyRows, historyFields) {
        if (err) throw err;
        connection.release();

        res.render('product', { title: '123', product: productRows[0], changes: historyRows, format: format});

      });
    });
  });
});

module.exports = router;
