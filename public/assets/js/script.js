/**
 * Created by soroush on 4/4/17.
 */


$(document).ready(function () {
    $('.graphWindow').width = $(window).width() ;
    $( window ).resize(function() {
        $('.graphWindow').width = $(window).width() ;
    });
});