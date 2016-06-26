var express = require('express');
var router = express.Router();
var format = require('date-format');
var squel = require("squel");

const ALLOWED_ORDER_VALUES = ['epk', 'literspris', 'varenummer', 'first_seen', 'last_seen', 'varenavn', 'volum', 'pris', 'varetype', 'produktutvalg', 'butikkategori', 'alkohol', 'land'];
const ALLOWED_QUERY_FIELDS = ['literspris', 'varenummer', 'first_seen', 'last_seen', 'varenavn', 'volum', 'pris', 'varetype', 'produktutvalg', 'butikkategori', 'alkohol', 'land'];
const ENTRIES_PER_PAGE = 100;

router.get('/', function (req, res, next) {
  var squelQuery = squel.select({ autoQuoteAliasNames: false })
    .field("*")
    .field("pris/volum", "literspris")
    .field("((alkohol/100*volum)/pris*1000000)", "epk")
    .from("product");

  // Search parameter
  if (req.query.query) {
    var queryField = "varenavn";
    if(req.query.query_type && ALLOWED_QUERY_FIELDS.indexOf(req.query.query_type) != -1) {
      queryField = req.query.query_type;
    }

    squelQuery.where(queryField + " LIKE ?", "%" + req.query.query+ "%");
  }

  // Custom order
  if (req.query.order_by && ALLOWED_ORDER_VALUES.indexOf(req.query.order_by) != -1) {
    squelQuery.order(req.query.order_by, !req.query.desc);
  }

  // No alcohol free beverages
  if (req.query.above_zero) {
    squelQuery.where("alkohol > 0");
  }

  // Get products from db
  pool.getConnection(function (err, connection) {
    if (err) {
      return next(err);
    }

    var query = squelQuery.toParam();
    getPageCount(connection, query.text, query.values, function (err, pageCount) {
      if (err) {
        return next(err);
      }

      var page = 1;

      // Check if last page requested,
      if(req.query.page == 'last') {
        page = pageCount;
      } else if (isInt(req.query.page) && parseInt(req.query.page, 10) >= 1) {
        page = parseInt(req.query.page, 10);
      }

      // Set limit to the items of the current page
      setLimit(squelQuery, page - 1);

      query = squelQuery.toParam();
      connection.query(query.text, query.values, function (err, rows, productFields) {
        connection.release();
        res.render('products', { title: 'Produkter', currentPage: page, pageCount: pageCount, products: rows, format: format });
      });
    });
  });
});

// Zero-based page
function setLimit(query, page) {
  query.offset(page * ENTRIES_PER_PAGE);
  query.limit((page + 1) * ENTRIES_PER_PAGE - 1);
}

function isInt(value) {
  return !isNaN(value) &&
    parseInt(Number(value)) == value &&
    !isNaN(parseInt(value, 10));
}

function getPageCount(connection, query, params, callback) {
  query = query.replace("SELECT *", "SELECT COUNT(1) as count");
  connection.query(query, params, function (err, rows, fields) {
    if (err) {
      callback(err);
      return;
    }

    callback(null, Math.ceil(rows[0].count / ENTRIES_PER_PAGE));
  });
}

module.exports = router;
