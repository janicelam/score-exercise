var Carousel = function () {

  $('.js-slick-slider').slick({
    prevArrow:"<div class=\"slick-prev\"></div>",
    nextArrow:"<div class=\"slick-next\"></div>",
    fade: true
  });

};

module.exports = Carousel;

Carousel();
