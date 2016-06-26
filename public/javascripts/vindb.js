jQuery(document).ready(function ($) {
    // Clickable table rows
    // http://stackoverflow.com/questions/17147821/how-to-make-a-whole-row-in-a-table-clickable-as-a-link
    $(".clickable-row").click(function () {
        window.document.location = $(this).data("href");
    });

    // Clickable table header
    $('th.clickable').click(function () {
        var newValue = $(this).data('field');
        if ($.query.get('order_by') == newValue) {
            if ($.query.get('desc')) {
                window.location.search = $.query.remove('desc');
            } else {
                window.location.search = $.query.set('desc', 1);
            }
        } else {
            window.location.search = $.query.set('order_by', newValue).remove('desc');
        }
    });

    // Add sort arrow to table header
    var orderByValue = $.query.get('order_by');
    if (orderByValue) {
        var icon = $.query.get('desc') ? 'arrow_drop_up' : 'arrow_drop_down';
        $("th.clickable[data-field='" + orderByValue + "']").append("<i class='material-icons right'>"+ icon + "</i>");
    }

    // Override form submit to edit query
    //http://stackoverflow.com/questions/4517366/change-form-values-after-submit-button-pressed
    //$('#searchForm').submit(function (e) {
    //    var txt = $('#searchQuery');
    //    txt.val('%' + txt.val() + '%');
    //});

    // Activate the side menu 
    $(".button-collapse").sideNav();

    $('.datepicker').pickadate({
        closeOnSelect: true,
        closeOnClear: true,
        selectMonths: true,
        selectYears: 1,
        monthsFull: ['Januar', 'Februar', 'Mars', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Desember'],
        monthsShort: ['Jan', 'Feb', 'Mar', 'Apr', 'Mai', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Des'],
        weekdaysFull: ['Søndag', 'Mandag', 'Tirsdag', 'Onsdag', 'Torsdag', 'Fredag', 'Lørdag'],
        weekdaysShort: ['Søn', 'Man', 'Tir', 'Ons', 'Tor', 'Fre', 'Lør'],
        today: 'I dag',
        clear: 'Tøm',
        close: 'Lukk',
        firstDay: 1,
        format: 'dd. mmmm, yyyy',
        formatSubmit: 'yyyy-mm-dd',
        hiddenName: true,

        // Fix for closeOnSelect not working
        onSet: function (context) {
            this.close();
        }
    });

    $('#update_date_button').click(function () {
        var startDate = $('#start_date').parent().find("[type='hidden']").attr('value');
        var endDate = $('#end_date').parent().find("[type='hidden']").attr('value');

        if (startDate && endDate) {
            window.location = "?start_date=" + startDate + "&end_date=" + endDate;
        }
    });

    // Set dates in input boxes
    var startPicker = $('#start_date').pickadate('picker');
    var endPicker = $('#end_date').pickadate('picker');

    var startDate = $.urlParam('start_date');
    var endDate = $.urlParam('end_date');
    if (startDate) {
        startPicker.set('select', startDate, { format: 'yyyy-mm-dd' });
    }

    if (endDate) {
        endPicker.set('select', endDate, { format: 'yyyy-mm-dd' });
    }

    // Page buttons
    $('.page-button').click(function (event) {
        window.location.search = $.query.set('page', $(event.target).text());
    });

    $('.page-first').click(function (event) {
        window.location.search = $.query.set('page', 1);
    });

    $('.page-previous').click(function (event) {
        window.location.search = $.query.set('page', parseInt($('.active').children().first().text()) - 1);
    });

    $('.page-next').click(function (event) {
        window.location.search = $.query.set('page', parseInt($('.active').children().first().text()) + 1);
    });

    $('.page-last').click(function (event) {
        window.location.search = $.query.set('page', 'last');
    });
});

// http://stackoverflow.com/questions/19491336/get-url-parameter-jquery-or-how-to-get-query-string-values-in-js
$.urlParam = function (name) {
    var results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(window.location.href);
    if (results == null) {
        return null;
    }
    else {
        return results[1] || 0;
    }
}