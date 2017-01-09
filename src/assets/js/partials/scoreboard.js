var Scoreboard = function (view) {

  var $expand = view.find('.js-open-stats'),
      see_more = "See More",
      see_less = "See Less",
      $carousel = view.find('.js-slick-slider'),
      $loading = view.find('.loading-screen');

  $expand.on('click', function() {

    if ($(this).parent().hasClass('isExpanded')){
      $(this).parent().removeClass('isExpanded');
    } else {
      $(this).parent().addClass('isExpanded');
    }

  });

  setTimeout(function() {
    $loading.fadeOut();
  }, 1000);

  $carousel.on('beforeChange', function(event, slick, currentSlide, nextSlide){
    $carousel.find('.slide-content .team-home').eq(nextSlide).find('.team-logo').addClass('bounceInRight animated');
    $carousel.find('.slide-content .team-away').eq(nextSlide).find('.team-logo').addClass('bounceInLeft animated');

    $carousel.find('.slide-content').eq(nextSlide).find('.team-stats .scheduled').addClass('bounceIn animated');
  });


};

module.exports = Scoreboard;
