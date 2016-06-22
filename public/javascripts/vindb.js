jQuery(document).ready(function ($) {
    // Clickable table rows
    // http://stackoverflow.com/questions/17147821/how-to-make-a-whole-row-in-a-table-clickable-as-a-link
    $(".clickable-row").click(function () {
        window.document.location = $(this).data("href");
    });

    // Override form submit to edit query
    //http://stackoverflow.com/questions/4517366/change-form-values-after-submit-button-pressed
    $('#searchForm').submit(function (e) {
        var txt = $('#searchQuery');
        txt.val('%' + txt.val() + '%');
    });
    
    // Activate the side menu 
   $(".button-collapse").sideNav();
});