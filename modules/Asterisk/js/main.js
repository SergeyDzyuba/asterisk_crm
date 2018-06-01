var D = $(document),
    W = $(window),
    B = $("body"),
    active = "active",
    speed = 300;

D.ready(function() {
    Accordeon();
    ScrollPane();
});

W.scroll(function() {

});

W.resize(function() {
       
});

W.load(function() {

});

function Accordeon() {
    //$(".js-count").live('click', function (event) {
    $("body").on('click', '.js-count', function (event) {
        event.preventDefault();
        if ($(this).parent().hasClass(active)) {
            $(this).parent().removeClass(active);
            $(this).next().slideUp(speed);
        } else {
            $(this).parent().addClass(active);
           $(this).next().slideDown(speed);
        }
    });
}

function ScrollPane() {
    $('.js-scrollpane').jScrollPane({
        showArrows: false,
        autoReinitialise: true,
        animateScroll: true
    });
}