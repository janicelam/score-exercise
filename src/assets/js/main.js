
$ = window.jQuery = require('jquery');
Slick = require('./libs/slick');
Carousel = require('./utils/carousel');

if ($('.partial-scoreboard')[0]) {
    $('.partial-scoreboard').each(function() {
        Scoreboard = require('./partials/scoreboard')($(this));
    });
}
