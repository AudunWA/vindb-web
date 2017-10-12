$(document).ready(function() {
  productId = $.urlParam('id');
  loadProductData();
  loadPriceHistory();

  // Set tabs to swipeable
  $('ul.tabs').tabs({'swipeable': true});
});

function loadProductData() {
  $.get("/rest/product/" + productId).done(onProductData).fail(function(data) {
    console.log("fail", data);
  });
}

function loadPriceHistory() {
  $.get("/rest/pricehistory/" + productId).done(onPriceHistory).fail(function(data) {
    console.log("fail", data);
  });
}

function onProductData(data) {
  // Set product name
  $("title").text(data.product.varenavn);
  $("#product_name_breadcrumb").text(data.product.varenavn);
  $("#product_name").text(data.product.varenavn);

  $("#basic_info").append(`
    <p><b>Varenummer: </b>${data.product.varenummer}</p>
    <p><b>Alkoholprosent: </b>${data.product.alkohol}%</p>
    <p><b>Volum: </b>${data.product.volum} liter</p>
    <b>Pris: </b>${data.product.pris.toFixed(2)},-</p>
    <p><b>Literspris: </b>${ (data.product.pris / data.product.volum).toFixed(2)},-</p>
    <p><b>Etanol per krone (EPK): </b>${ ((data.product.alkohol / 100 * data.product.volum) / data.product.pris * 1000000).toFixed(3)} mikroliter</p>
    <p><b>Først sett: </b>${moment(data.product.first_seen).format('D. MMMM YYYY')}</p>
    <p><b>Sist sett: </b>${moment(data.product.last_seen).format('D. MMMM YYYY')}</p>
    `);

  $("#vinmonopol_link").append(`
      <a href="http://www.vinmonopolet.no/vareutvalg/varedetaljer/sku-${data.product.varenummer}">Finn på Vinmonopolet</a>
      `)

  $("#taste_info").append(`
    <b>Fylde: </b>${data.product.fylde}/10<br>
    <b>Friskhet: </b>${data.product.friskhet}/10<br>
    <b>Garvestoffer: </b>${data.product.garvestoffer}/10<br>
    <b>Bitterhet: </b>${data.product.bitterhet}/10<br>
    <b>Sødme: </b>${data.product.sodme}/10<br>
    <b>Farge: </b>${data.product.farge}<br>
    <b>Lukt: </b>${data.product.lukt}<br>
    <b>Smak: </b>${data.product.smak}<br>
      `);
  renderHistory(data.changes);
}

function onPriceHistory(data) {
  if (data.length === 0) {
    $("#price_tab").html(`<span class="white-text">Ingen prisendringer registrert...</span>`);
    return;
  }

  var proceededData = doData(data);
  //var formattedData = fixPriceHistoryData(data);
  var ctx = $("#priceChart");
  var config = {
    type: 'line',
    data: {
      datasets: [
        {
          label: "Pris",
          fill: true,
          steppedLine: true,
          spanGaps: true,
          backgroundColor: "#90caf9",
          borderColor: "#5d99c6",
          pointBackgroundColor: "#c3fdff",
          data: proceededData.data
        }
      ]
    },
    options: {
      responsive: true,
      title: {
        display: false,
        text: 'Prisutvikling'
      },
      layout: {
        padding: {
          left: 0,
          right: 50,
          top: 0,
          bottom: 50
        }
      },
      scales: {
        xAxes: [
          {
            type: "time",
            scaleLabel: {
              display: true,
              labelString: 'Dato'
            },
            time: {
              max: proceededData.maxX,
              round: "day",
              unit: "day",
              unitStepSize: proceededData.units
            }
          }
        ],
        yAxes: [
          {
            scaleLabel: {
              display: true,
              labelString: 'Pris'
            },
            ticks: {
              beginAtZero: false,
              max: proceededData.maxY
            }
          }
        ]
      },
      elements: {
        line: {
          tension: 0, // disables bezier curves
        }
      }
    }
  };

  myLineChart = new Chart(ctx, config);
}

function renderHistory(history) {
  history.forEach(function(row) {
    $("#history_table").append(`<tr><td>${row.name}</td><td>${row.old_value || "<i>Ingen verdi</i>"}</td><td>${row.new_value || "<i>Ingen verdi</i>"}</td><td>${moment(row.time).format('D. MMMM YYYY')}</td></tr>`)
  })
}

function doData(data) {
  if (data.length === 0) {
    return {data: [], maxY: 0};
  }

  var result = [];
  var maxY = 0;
  var startDate = new Date(data[0].time);
  var maxDate = new Date(data[0].time);

  data.forEach(function(val) {
    var date = new Date(val.time);
    var yVal = parseFloat(val.new_value.replace(",", "."));
    if (yVal > maxY) {
      maxY = yVal;
    }

    if (date > maxDate) {
      maxDate = date;
    }

    result.push({x: date, y: yVal});
  });

  // Add today to data
  var today = new Date();
  result.push({
    x: today,
    y: result[result.length - 1].y
  });

  // Add "past" to data
  var deltaT = today - maxDate;
  var pastDate = new Date(startDate.getTime() - deltaT);
  result.unshift({
    x: pastDate,
    y: parseFloat(data[0].old_value.replace(",", "."))
  });

  // Calculate amount of labels to show
  var oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
  var dayAmount = Math.round(Math.abs((pastDate.getTime() - today.getTime()) / (oneDay)));
  var units = Math.round(dayAmount / 8);

  // Hack to fix overlapping labels on end of x-axis
  var momentMaxDate = moment(maxDate);
  var maxX = today;

  return {
    data: result,
    maxX: maxX,
    maxY: Math.round(maxY + maxY * 0.1),
    units: units
  };
}
