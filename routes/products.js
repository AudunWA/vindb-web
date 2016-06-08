var express = require('express');
var router = express.Router();
var format = require('date-format');

router.get('/*', function (req, res, next) {
  // Get products from db
  pool.getConnection(function (err, connection) {
    if (err) throw err;
    connection.query("SELECT *, pris/volum literspris FROM product WHERE alkohol > 1 ORDER BY literspris DESC LIMIT 200", req.params.product_id, function (err, rows, productFields) {
      connection.release();

      res.render('products', { title: '123', products: rows, format: format });

    });
  });
});

module.exports = router;
