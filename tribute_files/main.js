/**jQuery.browser.mobile (http://detectmobilebrowser.com/)**/
(function(a){(jQuery.browser=jQuery.browser||{}).mobile=/(android|bb\d+|meego).+mobile|avantgo|android|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od|ad)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))})(navigator.userAgent||navigator.vendor||window.opera);

var isXs = (jQuery(window).width() <= 480);
var isSm = (jQuery(window).width() < 480);
var isMd = (jQuery(window).width() > 990);
var isLg = (jQuery(window).width() > 1200);

var isMobile = (jQuery(window).width() <= 550);

jQuery(document).ready(function($) {
  initGoogleFonts();
  initNavigation();
  initFooter();
  initHomePage();
  initParkPage();
  initActivityPage();
  initRentalPage();
  initActivityFinderPage();
  initAlertsPage();
  initBlog();
  initTrailsPage();
  initPermitPage();
  initDefaultPage();
  initInteractiveMap();
  initProgramsAndEvents();
  initBikeMonth(); 
  Retina.init();

  convertSVGToInline(); 
  customFeatureAd();
  alerts();
});


jQuery(window).load(function($) {
  //squareSectionAreas();
  //iOSLinkFix();
  jQuery('header').addClass('loaded');
  squareSectionAreas();
});


jQuery(window).on('resize', function($){
 //squareSectionAreas();
});

function initHomePage() {
  // Set up Swiper for homepage
  function homeSwiper() {
    var swiperSpeed = jQuery('.swiper-container').attr('data-slideshow-speed');
    var mySwiper = new Swiper('.swiper-container', {
        slidesPerView:'auto',
        centeredSlides: true,
        loop:true,
        loopedSlides:20,  
        spaceBetween: 10, 
        autoplay: swiperSpeed,
        speed: 1000,
        pagination: '.swiper-pagination',
        paginationClickable: true,
        nextButton: '.swiper-button-next',
        prevButton: '.swiper-button-prev',
    });  

    var ww = jQuery(window).width();
    jQuery(window).resize(function(){
        if (ww<=740) mySwiper.params.slidesPerView = 1;
        //parkFeatureswiper.reInit();
      });
      jQuery(window).trigger('resize');

    function swiperHover() {
      jQuery('.swiper-container').hover(function(){
        jQuery('.swiper-button-next').addClass('hover');
        jQuery('.swiper-button-prev').addClass('hover');
        mySwiper.stopAutoplay();
      });
      jQuery('.swiper-container').mouseleave(function(){
        jQuery('.swiper-button-next').removeClass('hover');
        jQuery('.swiper-button-prev').removeClass('hover');
        //mySwiper.params.autoplay = swiperSpeed;
        //mySwiper.startAutoplay();
      });
    }
    swiperHover(); 
  }
    
  if(jQuery('body').hasClass('page-template-page-home')) {
    homeSwiper();
  }
}

function initFooter() {
  jQuery('#feedback_popup').popup({
    /*outline: true, // optional
    focusdelay: 400, // optional
    vertical: 'top' //optional*/
  });

  jQuery('.footer-contact-button').click(function(){
    //if( !jQuery('.newsletter-email-input').val() ) {
       var queryString = '?footer-feedback-popup'; 

      //window.location.href = queryString;
      //location.search += queryString;

      var newurl = window.location.protocol + "//" + window.location.host + window.location.pathname + queryString;
      window.history.pushState({path:newurl},'',newurl);
    //}

  });

  if (window.location.href.indexOf("?footer-feedback-popup") > -1) {
    jQuery("html, body").animate({ scrollTop: jQuery(document).height() }, "slow");
    jQuery(".footer-contact-button").trigger("click");
  }

  jQuery('#newsletter_popup').popup({
    /*outline: true, // optional
    focusdelay: 400, // optional
    vertical: 'top' //optional*/
    onopen: function() {
      var inputVal = jQuery('.newsletter-email-input').val();
      if( inputVal.length > 0 ) {
        jQuery('.ginput_container_email').children('input').val(inputVal);
      }
    }
  });

  if (window.location.href.indexOf("?newsletter-email") > -1) {
    jQuery("html, body").animate({ scrollTop: jQuery(document).height() }, "slow");
    jQuery(".newsletter-submit-button").trigger("click");
  }

  jQuery('.newsletter-submit-button').click(function(){
    var inputVal = jQuery('.newsletter-email-input').val();
    //if( !jQuery('.newsletter-email-input').val() ) {
       var queryString = '?newsletter-email=' + inputVal; 

      //window.location.href = queryString;
      //location.search += queryString;

      var newurl = window.location.protocol + "//" + window.location.host + window.location.pathname + queryString;
      window.history.pushState({path:newurl},'',newurl);
    //}

  });
}

// Init Park & Park Area Pages
function initParkPage() {
  function expandParkDescription() {
      jQuery('.park-banner-description-button').click(function() {
        if(!jQuery(this).hasClass('open')) {
          jQuery(this).addClass('open');
          jQuery('.park-banner-description-expand').addClass('open');
        } else {
          jQuery(this).removeClass('open');
          jQuery('.park-banner-description-expand').removeClass('open');
        }
      });
  }

  function  parkFeatureSwiper() {
    var ww = jQuery(window).width();
    var slidesview = 3;
    if (ww<=740) {
      slidesview = 1; 
    }

    var slideNumber = jQuery('.park-feature-swiper-slide').length; 

    /*jQuery('.park-feature-swiper-slide').each(function(){
      console.log("yes");
      jQuery('.park-feature-swiper-pagination').append('<span class="swiper-pagination-bullet"></span>');
    });*/

    if(slideNumber  > 3) {
      var parkFeatureswiper = new Swiper('.park-features-swiper-container', {
         slidesPerView: slidesview,
          spaceBetween: 15,
          autoHeight: true,
          pagination: '.park-feature-swiper-pagination',
          paginationClickable: true,
          nextButton: '.park-feature-swiper-button-next',
          prevButton: '.park-feature-swiper-button-prev',
          //autoplay: 6000,
          speed: 400,
          simulateTouch: false, 
          //freeMode: true,
         /* breakpoints: {
          640: {
            slidesPerView: 1,
            spaceBetweenSlides: 
          }
        }*/
      });

      jQuery(window).resize(function(){
        if (ww<=740) parkFeatureswiper.params.slidesPerView = 1;
        //parkFeatureswiper.reInit();
      });
      jQuery(window).trigger('resize');
    } else {
      jQuery('.park-features-swiper-container').addClass('static');
      jQuery('.park-features-swiper-container').removeClass('swiper-container');
      jQuery('.park-features-swiper-wrapper').removeClass('swiper-wrapper');
      jQuery('.park-feature-swiper-pagination').css('display', 'none');
      jQuery('.park-feature-swiper-button-prev').css('display', 'none');
      jQuery('.park-feature-swiper-button-next').css('display', 'none');
    }

    var handler = onVisibilityChange(jQuery('.park-features-swiper-container'), function() {
          parkFeatureswiper.params.autoplay = 10000;
          parkFeatureswiper.startAutoplay();
      });

      jQuery(window).on('DOMContentLoaded load resize scroll', handler); 
  }

  function hoverParkMapInfo() {
    var amenityBtn = jQuery('.park-amenities-button');
    var amenityInfoBoxes = jQuery('.park-amenity-info-box');
    var closeButton = jQuery('.close-info-box-button');
    amenityBtn.click(function(){
      activityBtn.removeClass('open');
      amenityBtn.removeClass('open');
      btn = jQuery(this);
      btnData = jQuery(this).attr("data-info-button");
      findCorrespondingBox('Amenity', btn, btnData);
    });

    var activityBtn = jQuery('.park-activities-button');
    var activityInfoBoxes = jQuery('.park-activity-info-box');
    activityBtn.click(function(){
      activityBtn.removeClass('open');
      amenityBtn.removeClass('open');
      btn = jQuery(this);
      btnData = jQuery(this).attr("data-info-button");
      findCorrespondingBox('Activity', btn, btnData);
    });

    closeButton.click(function(){
      jQuery(this).siblings().removeClass('open');
      jQuery(this).removeClass('open');
      activityBtn.removeClass('open');
      amenityBtn.removeClass('open');
    });


    function findCorrespondingBox(typeOfBox, button, buttonData) {
      if(typeOfBox == "Amenity") {

        amenityInfoBoxes.each(function(){
        box = jQuery(this);
        boxData = jQuery(this).attr("data-info-box");
        if(buttonData == boxData && !button.hasClass('open')) {
          button.addClass('open');
          box.addClass('open');
          box.siblings().removeClass('open');
          closeButton.addClass('open');

          box.parent().siblings('.park-activities-info-boxes').children().removeClass('open');
          //if(isMobile) {
            
            jQuery('html,body').animate({
               scrollTop: jQuery(".park-amenities-section").offset().top - 150
            });
          //}
        } else if(buttonData == boxData && button.hasClass('open')){
          button.removeClass('open');
          box.removeClass('open');
          closeButton.removeClass('open');
        }
      });

    } else if (typeOfBox == "Activity") {
        activityInfoBoxes.each(function(){
        box = jQuery(this);
        boxData = jQuery(this).attr("data-info-box");

        if(buttonData == boxData && !button.hasClass('open')) {
          button.addClass('open');
          box.addClass('open');
          box.siblings().removeClass('open');
          closeButton.addClass('open');

          box.parent().siblings('.park-amenities-info-boxes').children().removeClass('open');
          //if(isMobile) {
            jQuery('html,body').animate({
               scrollTop: jQuery(".park-amenities-section").offset().top - 150
            });
         // }
        } else if (buttonData == boxData && button.hasClass('open')) {
          button.removeClass('open');
          box.removeClass('open');
          closeButton.removeClass('open');
        }
      });
      }
    }

  }

  function panMapImage() {
    var parkContentBox = jQuery('.park-amenities-section-row > div').last();
    var boxHeight = parkContentBox.height() - 50;
    var boxWidth = parkContentBox.width(); 

    var mapContainer = jQuery('.park-amenities-map-area').children('.pan-zoom').children('a').children('img');

    mapContainer.width(boxWidth);
    mapContainer.height(boxHeight);

    jQuery.panzoom('.pan-zoom a');

    var triggeredOnce = false;

    jQuery('.park-amenities-thumbnail-map').click(function(){
      if(!jQuery(this).hasClass('hidden') && jQuery(window).width() > 780 ) {
        jQuery('.pan-zoom').addClass('visible');
        jQuery('.pan-zoom a').trigger( "click" );
        jQuery(this).addClass('hidden');
        triggeredOnce = true;
      } else {
        jQuery('.pan-zoom').removeClass('visible');
        jQuery(this).removeClass('hidden');
      }
    });

    jQuery('.pan-zoom').click(function(){
      if(jQuery('.pan-zoom').hasClass('visible') && triggeredOnce === true) {
        jQuery('.pan-zoom').removeClass('visible');
        jQuery('.park-amenities-thumbnail-map').removeClass('hidden');
        triggeredOnce = false;
      }
    });
  }

  function parkAccordion() {
    var mainTitle = jQuery('.park-accordion-area > .main-title');

    mainTitle.click(function() {
      var content = jQuery(this).siblings('.park-accordion-content'); 
      if(!content.hasClass('open')) {
        content.addClass('open');
        jQuery(this).addClass('open');
      } else {
        content.removeClass('open');
        jQuery(this).removeClass('open');
      }
    });

    var subaccordion = jQuery('.park-accordion-wrap > h5');
    subaccordion.click(function(){
      var content = jQuery(this).siblings('.general-content');
      if(!content.hasClass('open')) {
        content.addClass('open');
        jQuery(this).addClass('open');
      } else {
        content.removeClass('open');
        jQuery(this).removeClass('open');
      }

      var expandbtn = jQuery('.expand-all-button');
      expandbtn.click(function(){
        if(!jQuery(this).hasClass('open')) {
          jQuery(this).addClass('open'); 
          subaccordion.siblings('.general-content').addClass('open');
          mainTitle.siblings('.park-accordion-content').addClass('open');
          mainTitle.addClass('open');
          subaccordion.addClass('open');
        } else {
          jQuery(this).removeClass('open'); 
          subaccordion.siblings('.general-content').removeClass('open');
          mainTitle.siblings('.park-accordion-content').removeClass('open');
          mainTitle.removeClass('open');
          subaccordion.removeClass('open');
        }
      });
    });
  }

  if(jQuery('body').hasClass('single-park_areas')) {
    expandParkDescription();
    hoverSocialShare();
    parkFeatureSwiper();
    hoverParkMapInfo();
    panMapImage();
    parkAccordion();

    if(jQuery('.subpage-banner-slide-background-image').length > 1) {
      subpageSwiper();
    } else {
      jQuery('.subpage-banner-swiper-slide').addClass('static-background');
      jQuery('.subpage-swiper-button-next').css('display', 'none');
      jQuery('.subpage-swiper-button-prev').css('display', 'none');
    }
  }
}

function initDefaultPage () {
  function setUpDefaultAccordion() {
    var accordArea = jQuery('.rental-collapse-area');
    if(window.location.hash) {
      var hash = window.location.hash.substr(1);
      jQuery('.rental-collapse-area').each(function() {
        if(jQuery(this).attr('id') === hash) {
          jQuery(this).addClass('open');
          jQuery('html, body').animate({
            scrollTop: jQuery(this).offset().top - 150
          }, 1000);
        }
      });

      jQuery('.inner-collapse').each(function(){
        if(jQuery(this).attr('id') === hash) {
          jQuery(this).addClass('open');
          jQuery('html, body').animate({
            scrollTop: jQuery(this).offset().top - 150
          }, 1000);
        }
      });
    }

    accordArea.children('h4').click(function(){
      if(!jQuery(this).parent().hasClass('open')) {
        jQuery(this).parent().addClass('open');
        jQuery(this).parent().siblings().removeClass('open');
        var id = jQuery(this).parent().attr('id');
        window.location.hash=id;

        jQuery('html, body').animate({
            scrollTop: jQuery(this).parent().offset().top - 150
          }, 1000);
      } else {
        jQuery(this).parent().removeClass('open');
        window.location.href.replace( /#.*/, ""); 
        return false; 
      }
    });

    jQuery('.inner-collapse').children('h5').click(function(){
      if(!jQuery(this).parent().hasClass('open')) {
        jQuery(this).parent().addClass('open');
        console.log(jQuery(this));
        jQuery(this).parent().siblings().removeClass('open');
        var id = jQuery(this).parent().attr('id');
        window.location.hash=id;

        jQuery('html, body').animate({
            scrollTop: jQuery(this).parent().offset().top - 150
          }, 1000);
      } else {
        jQuery(this).parent().removeClass('open');
      }
    });
  }
  if(jQuery('body').hasClass('page-template-default')){
    setUpDefaultAccordion();
  }
}

function initActivityPage () {
  function  activityFeatureSwiper() {
    var ww = jQuery(window).width();
    var slidesview = 3;
    if (ww<=740) {
      slidesview = 1; 
    }
    if(jQuery('.access-points-swiper-slide').length > 3) {
      var accessPointsswiper = new Swiper('.access-points-swiper-container', {
          slidesPerView: slidesview,
          spaceBetween: 15,
          autoHeight: true,
          pagination: '.access-points-swiper-pagination',
          paginationClickable: true,
          nextButton: '.access-points-swiper-button-next',
          prevButton: '.access-points-swiper-button-prev',
          //autoplay: 6000,
          speed: 400,
         /* breakpoints: {
          640: {
            slidesPerView: 1,
            spaceBetweenSlides: 
          }
        }*/
      });

      jQuery(window).resize(function(){
        if (ww<=740) accessPointsswiper.params.slidesPerView = 1;
        //parkFeatureswiper.reInit();
      })
      jQuery(window).trigger('resize');
    } else {
      jQuery('.access-points-swiper-container').addClass('static');
      jQuery('.access-points-swiper-container').removeClass('swiper-container');
      jQuery('.access-points-swiper-wrapper').removeClass('swiper-wrapper');
      jQuery('.access-points-swiper-pagination').css('display', 'none');
      jQuery('.access-points-swiper-button-prev').css('display', 'none');
      jQuery('.access-points-swiper-button-next').css('display', 'none');
    }

      var handler = onVisibilityChange(jQuery('.access-points-swiper-container'), function() {
          accessPointsswiper.params.autoplay = 10000;
          accessPointsswiper.startAutoplay();
      });

      jQuery(window).on('DOMContentLoaded load resize scroll', handler); 
  }

  function  programSwiper() {
    var ww = jQuery(window).width();
    var slidesview = 2;
    if (ww<=740) {
      slidesview = 1; 
    }
    if(jQuery('.programs-swiper-slide').length > 2) {
      var programsSwiper = new Swiper('.programs-swiper-container', {
          slidesPerView: slidesview,
          spaceBetween: 15,
          autoHeight: true,
          pagination: '.programs-swiper-pagination',
          paginationClickable: true,
          nextButton: '.programs-swiper-button-next',
          prevButton: '.programs-swiper-button-prev',
         /* breakpoints: {
          640: {
            slidesPerView: 1,
            spaceBetweenSlides: 
          }
        }*/
      });

      jQuery(window).resize(function(){
        if (ww<=740) programsSwiper.params.slidesPerView = 1;
        //parkFeatureswiper.reInit();
      })
      jQuery(window).trigger('resize');
    } else {
      jQuery('.programs-swiper-pagination').css('display', 'none');
      jQuery('.programs-swiper-button-prev').css('display', 'none');
      jQuery('.programs-swiper-button-next').css('display', 'none');
    }
  }

  function locationGallery() {
    var galleryBtn = jQuery('.has-gallery');

   galleryBtn.click(function(event){
      //event.preventDefault();
      if(jQuery(this).siblings('.access-points-content').children('.lightbox-gallery').length > 0) {
        var gallery = jQuery(this).siblings('.access-points-content').children('.lightbox-gallery'); 
        gallery.children('a:first-child').click();
      } else {
        return;
      }
    });

     jQuery('.lightbox-gallery').lightGallery(); 
  }

  if(jQuery('body').hasClass('single-activities')) {
    hoverSocialShare();
    activityFeatureSwiper();
    programSwiper();
    locationGallery();

     jQuery('.venue-light-gallery').lightGallery({
        youtubePlayerParams: {
          modestbranding: 1,
          showinfo: 0,
          rel: 0,
          controls: 0
        }
    });

    if(jQuery('.subpage-banner-slide-background-image').length > 1) {
      subpageSwiper();
    } else {
      jQuery('.subpage-banner-swiper-slide').addClass('static-background');
    }
  }
}

function initRentalPage() {
  function galleryRentalVenues() {
    var galleryBtn = jQuery('.venue-rental-gallery-button');

   galleryBtn.click(function(event){
      event.preventDefault();
      if(jQuery(this).siblings('.venue-light-gallery').length > 0) {
        var outdoorGallery = jQuery(this).siblings('.venue-light-gallery'); 
        outdoorGallery.children('a:first-child').click();
      } else {
        return;
      }
    });

     jQuery('.venue-light-gallery').lightGallery(); 
  }

  function rentalAccordianArea () {
    var accordArea = jQuery('.rental-collapse-area');

    if(window.location.hash) {
      var hash = window.location.hash.substr(1);
      jQuery('.rental-collapse-area').each(function() {
        if(jQuery(this).attr('id') === hash) {
          jQuery(this).addClass('open');
          jQuery('html, body').animate({
            scrollTop: jQuery(this).offset().top - 150
          }, 1000);
        }
      });
    }

    accordArea.children('h4').click(function(){
      if(!jQuery(this).parent().hasClass('open')) {
        jQuery(this).parent().addClass('open');
        jQuery(this).parent().siblings().removeClass('open');
        var id = jQuery(this).parent().attr('id');
        window.location.hash=id;

        jQuery('html, body').animate({
            scrollTop: jQuery(this).parent().offset().top - 150
          }, 1000);
      } else {
        jQuery(this).parent().removeClass('open');
        window.location.href.replace( /#.*/, ""); 
        return false; 
      }
    });   

   /* accordArea.children('h4').click(function(){
      if(!jQuery(this).parent().hasClass('open')) {
        jQuery(this).parent().addClass('open');
        jQuery(this).parent().siblings().removeClass('open');
      } else {
        jQuery(this).parent().removeClass('open');
      }
    });*/
  }

  if(jQuery('body').hasClass('page-template-page-rental')) {
    galleryRentalVenues();
    rentalAccordianArea();
  }
}

function subpageSwiper() {
  // Set up Swiper for homepage
  var swiperSpeed = jQuery('.subpage-swiper-container').attr('data-slideshow-speed');
  var mySwiper = new Swiper('.subpage-swiper-container', {
      slidesPerView:'auto',
      centeredSlides: true,
      loop:true,
      loopedSlides:20, 
      spaceBetween: 5, 
      //effect: "fade",
      autoplay: swiperSpeed,
      pagination: '.subpage-swiper-pagination',
      paginationClickable: true,
      nextButton: '.subpage-swiper-button-next',
      prevButton: '.subpage-swiper-button-prev',
  });  

  function swiperHover() {
    jQuery('.swiper-container').hover(function(){
      jQuery('.swiper-button-next').addClass('hover');
      jQuery('.swiper-button-prev').addClass('hover');
      mySwiper.stopAutoplay();
    });
    jQuery('.swiper-container').mouseleave(function(){
      jQuery('.swiper-button-next').removeClass('hover');
      jQuery('.swiper-button-prev').removeClass('hover');
      //mySwiper.params.autoplay = swiperSpeed;
      //mySwiper.startAutoplay();
    });
  }
  swiperHover(); 
}

function initActivityFinderPage () {
  function setUpGridListView() {
    var gridViewBtn = jQuery('.finder-grid-view');
    var listViewBtn = jQuery('.finder-list-view');
    var listingArea = jQuery('.finder-activities-listing-area');

    gridViewBtn.click(function() {
      if(!listingArea.hasClass('grid-view')) {
        listingArea.addClass('grid-view');
        listingArea.removeClass('list-view');
      }
    });

    listViewBtn.click(function() {
      if(!listingArea.hasClass('list-view')) {
        listingArea.addClass('list-view');
        listingArea.removeClass('grid-view');
      }
    });

    if(isMobile) {
      listingArea.addClass('list-view');
      listingArea.removeClass('grid-view');
    }
  }

  /*function findActivity() {
    post_ajax('.finder-activities-listing-area ul', 'activities', '', '', 'type_of_activity', 'activity', '', '', '-1');
    //$projects_q = custom_query($post_type = array( 'activities' ), $post_status = '', $category_name = '', $taxonomy = 'type_of_activity', $term = 'activity', $order = '', $orderby = '', $posts_per_page = -1);


    jQuery('.finder-dropdown-btn').click(function() {
        //e.preventDefault();

        //vars
        var post_type = jQuery(this).attr('data-post-type'),
        post_status = jQuery(this).attr('data-post-status'),
        category_name = jQuery(this).attr('data-category-name'),
        taxonomy = jQuery(this).attr('data-taxonomy'),
        term = jQuery(this).attr('data-term'),
        order = jQuery(this).attr('data-order'),
        orderby = jQuery(this).attr('data-orderby'),
        posts_per_page = jQuery(this).attr('data-posts-per-page'),
        target_elm = '.finder-activities-listing-area ul', 
        key = jQuery(this).attr('data-key'),
        value = jQuery('.finder-dropdown').val();
        
        if(category_name&&!taxonomy) {
          jQuery(this).attr('data-active', 'yes');
        }
        
        if(taxonomy) {
          jQuery.each(jQuery('.filter-link'), function() {
            var active = jQuery(this).attr('data-active');
            
            if(active == 'yes') {
              category_name = jQuery(this).attr('data-category-name');
            }
            
          });
        } */
        
        //post_ajax(target_elm, post_type, post_status, category_name, taxonomy, term, order, orderby, posts_per_page, key, value );
        
        /*$.each($('.page-template-page-landing .project'), function() {
          $(this).outerHeight( $(this).outerWidth() );
        });*/
                
      //});
  //}

  function findActivity() {

    jQuery(".finder-activities-listing-area ul > li").each(function(i) {
      jQuery(this).delay((i++) * 300).fadeTo(1000, 1);
    });

    if(window.location.search.length) {
      function getParameterByName(name, url) {
          if (!url) url = window.location.href;
          name = name.replace(/[\[\]]/g, "\\$&");
          var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
              results = regex.exec(url);
          if (!results) return null;
          if (!results[2]) return '';
          return decodeURIComponent(results[2].replace(/\+/g, " "));
      }

      var parkID = getParameterByName('park'); 
      jQuery('.finder-dropdown').val(parkID);

      jQuery('html, body').animate({
          scrollTop: jQuery('#activity-finder').offset().top + -100
      }, 'slow');

    } else {
        return;
    }
  }

  if(jQuery('body').hasClass('page-template-page-activity-finder')){
    hoverSocialShare();
    setUpGridListView();
    findActivity();
  }
}

function initAlertsPage() {
  function setUpExpandLinks() {
    jQuery('.alerts-page-alert-expand-btn').click(function() {
      if(!jQuery(this).hasClass('expanded')) {
        jQuery(this).addClass('expanded');
        jQuery(this).parent().siblings('.alerts-page-expand-info').addClass('expanded');
      } else {
        jQuery(this).removeClass('expanded');
        jQuery(this).parent().siblings('.alerts-page-expand-info').removeClass('expanded');
      }
    })
  }
  if(jQuery('body').hasClass('page-template-page-alerts')){
    setUpExpandLinks();
  }
}

function initBlog() {
  function setUpBlogSorting () {
    var sortList = jQuery('.blog-sorting-options');
    var sortListData = sortList.attr('data-sort');

    jQuery('.blog-sorting-options li').each(function(){
      if(jQuery(this).children().html() == sortListData) {
        jQuery(this).addClass('current');
      }
    })
  }

  function setUpPressSorting() {
    var url = window.location.search;
    if (window.location.href.indexOf("press-release") > -1) {
      jQuery("button[value='press-release']").addClass('current');
    } else if (window.location.href.indexOf("staff-article") > -1) {
       jQuery("button[value='staff-article']").addClass('current');
    } else if (window.location.href.indexOf("press-coverage") > -1) {
      jQuery("button[value='press-coverage']").addClass('current');
    } else {
      jQuery(".press-sorting-options .view-all").addClass('current');
    }
  }

  if(jQuery('body').hasClass('archive') || jQuery('body').hasClass('blog')){
    setUpBlogSorting();
  }
  if(jQuery('body').hasClass('page-template-page-press')) {
    setUpPressSorting();
  }
}

function initTrailsPage () {
  function trailsAccordianArea() {
    var accordArea = jQuery('.rental-collapse-area');

    if(window.location.hash) {
      var hash = window.location.hash.substr(1);
      jQuery('.rental-collapse-area').each(function() {
        if(jQuery(this).attr('id') === hash) {
          jQuery(this).addClass('open');
          jQuery('html, body').animate({
            scrollTop: jQuery(this).offset().top - 150
          }, 1000);
        }
      });
    }

    accordArea.children('h4').click(function(){
      if(!jQuery(this).parent().hasClass('open')) {
        jQuery(this).parent().addClass('open');
        jQuery(this).parent().siblings().removeClass('open');
        var id = jQuery(this).parent().attr('id');
        window.location.hash=id;

        jQuery('html, body').animate({
            scrollTop: jQuery(this).parent().offset().top - 150
          }, 1000);
      } else {
        jQuery(this).parent().removeClass('open');
        window.location.href.replace( /#.*/, ""); 
        return false; 
      }
    });

    jQuery('.inner-collapse').children('h5').click(function(){
      if(!jQuery(this).parent().hasClass('open')) {
        jQuery(this).parent().addClass('open');
        /*jQuery(this).parent().siblings().removeClass('open');
        var id = jQuery(this).parent().attr('id');*/
      } else {
        jQuery(this).parent().removeClass('open');
      }
    });
  }

  if(jQuery('.trails-section').length > 0) {
    trailsAccordianArea();
  }
}

function initPermitPage() {
  if(jQuery('body').hasClass('page-template-page-permit')) {
    //squareSectionAreas();
  }
}

function initInteractiveMap() {
  function interactiveMapFormErrors() {
    /*jQuery('.sort-two-form input').keypress(function() {
      var value = jQuery(this).val();
      if (value.length != 5) {
        jQuery(this).parent().siblings('.error').addClass('visible');
      }
    });

    if (jQuery('.sort-two-form input').val().length === 5)  {
      alert("correct");
      jQuery(this).parent().siblings('.error').removeClass('visible');
    }*/

    jQuery('.sort-two-submit').click(function(event){
      var locatorInput = jQuery('#wpsl-search-input');
      event.preventDefault();
      jQuery('.interactive-park-map-area').remove();
  
      if (jQuery('.sort-two-form input').val().length === 5) {
        jQuery('.sort-two-form .error').removeClass('visible');
        var zipcodeValue = jQuery('.sort-two-form input').val(); 
        locatorInput.val(zipcodeValue);
        jQuery('#wpsl-search-btn').trigger('click');

        var resultList = jQuery('#wpsl-result-list'); 
        var resultMap = jQuery('#wpsl-gmap');
        var regularMap = jQuery('.interactive-park-map-area');
        var resultRow = jQuery('.interactive-map-park-listing-area');

        // Show result Wp Locator map
        resultMap.css('opacity', '1');
        resultMap.css('position','relative');
        resultMap.addClass('wp-locator-map-open');

        // Hide regular map that loads on default
        regularMap.remove();
        /*regularMap.css('opacity', '0');
        regularMap.css('position','absolute');
        regularMap.addClass('map-hidden');*/

        /*resultMap.css('display','block');
        regularMap.css('display','none');
        resultRow.addClass('original-row');
        resultList.append('resultList');
        resultRow.css('display', 'none');
        //resultList.addClass('interactive-map-park-listing-area');
        resultList.addClass('row');
        //jQuery('.sort-two-form').submit();*/
      } else {
        event.preventDefault();
        jQuery('.sort-two-form .error').addClass('visible');
        setInterval(function(){ 
          jQuery('.sort-two-form .error').removeClass('visible');
        }, 3000);
      }
    });
  }
  if(jQuery('body').hasClass('page-template-page-parks-map')) {
    interactiveParkMap();
    hoverSocialShare();
    //interactiveMapFormErrors();
  }
}

function initProgramsAndEvents() {
  function addListViewButtons() {
    jQuery('.subpage-headline').after('<div class="events-list-buttons-area"><button class="events-list-view-btn open" type="button"></button><button class="events-calendar-view-btn" type="button"></button></div>');
  } 

  function toggleListCalendarView() {
    jQuery('#insivia-frmp-calendar-listview').addClass('open');
    showSidebar();

    if(isMobile) {
      jQuery('#insivia-frmp-calendar-listview').addClass('open');
      showSidebar();
    }

     jQuery('.events-list-view-btn').click(function(){
      if(!jQuery(this).hasClass('open')) {
        jQuery(this).addClass('open');
        jQuery(this).siblings().removeClass('open');
        jQuery('#insivia-frmp-calendar').removeClass('open');
        jQuery('#insivia-frmp-calendar-listview').addClass('open');
        showSidebar();
      } 
    });

    jQuery('.events-calendar-view-btn').click(function(){
      if(!jQuery(this).hasClass('open')) {
        jQuery(this).addClass('open');
        jQuery(this).siblings().removeClass('open');
        jQuery('#insivia-frmp-calendar').addClass('open');
        jQuery('#insivia-frmp-calendar-listview').removeClass('open');
        hideSidebar();
      } 
    });

    function showSidebar() {
      jQuery('.col-m-12').addClass('col-m-9');
      jQuery('.col-m-12').removeClass('col-m-12');
      jQuery('.subpage-sidebar-area').css('display','block');
    }

    function hideSidebar() {
      jQuery('.col-m-9').addClass('col-m-12');
      jQuery('.col-m-9').removeClass('col-m-9');
      jQuery('.subpage-sidebar-area').css('display','none');
    }
  }
  if(jQuery('#insivia-frmp-calendar').length) {
    jQuery('body').addClass('programs-and-events');
    addListViewButtons();
    toggleListCalendarView();
  }
}

function initBikeMonth() {
  function bikeMonthNavigation() {
    var pageSlug = jQuery('.site-content').attr('data-page-slug'); 

    jQuery('.bike-site-menu li').each(function() {
      if(jQuery(this).hasClass(pageSlug)) {
        jQuery(this).children('a').addClass('current');
      }
    });

    jQuery('.bike-sidebar-expand-btn').click(function(){
      if(!jQuery(this).hasClass('open')) {
        jQuery(this).addClass('open');
        jQuery('.menu-bike-month-site-menu-container').addClass('open');
      }else {
        jQuery(this).removeClass('open');
        jQuery('.menu-bike-month-site-menu-container').removeClass('open');
      }
    });
  }
  if(jQuery('body').hasClass('single-bike_site')) {
    bikeMonthNavigation();
  }
}

function iOSLinkFix() {
 /*if(jQuery(window).width() <= 500){
    jQuery('a').on('click touchend', function(e) {
        if(jQuery(this).hasClass('disabled')) {
          return;
        }
        var el = jQuery(this);
        var link = el.attr('href');
        window.location = link;
    });
  }*/
}

function initGoogleFonts() { 
   WebFontConfig = {
   google: { families: [ 'Roboto:400,100,100italic,300,300italic,400italic,500,500italic,700,700italic,900,900italic:latin' ] }
  };
  (function() {
    var wf = document.createElement('script');
    wf.src = ('https:' == document.location.protocol ? 'https' : 'http') +
      '://ajax.googleapis.com/ajax/libs/webfont/1/webfont.js';
    wf.type = 'text/javascript';
    wf.async = 'true';
    var s = document.getElementsByTagName('script')[0];
    s.parentNode.insertBefore(wf, s);
  })();
}

function squareSectionAreas() {
  function equalHeights(group) {
    tallest = 0;
    group.each(function() {
        thisHeight = jQuery(this).height();
        if(thisHeight > tallest) {
            tallest = thisHeight;
        }
    });
    group.height(tallest);
  }

  if(jQuery('.home-box-description-content').length > 0 && !isMobile){
    equalHeights(jQuery('.home-box-description-content'));
  }

  if(jQuery('.park-banner-row').length > 0 && !isMobile) {
    equalHeights(jQuery('.park-banner-row').children('div'));
  }

  if(jQuery('.park-feature-content').length > 0 && !isMobile) {
    equalHeights(jQuery('.park-feature-content'));
  }

  if(jQuery('.park-amenities-section-row').length > 0 && jQuery(window).width() > 770){
    equalHeights(jQuery('.park-amenities-section-row > div'));
  }

  if(jQuery('.access-points-content').length > 0 && !isMobile) {
    equalHeights(jQuery('.access-points-content'));
  }

  if(jQuery('.activity-map-section').length > 0 && !isMobile){
    equalHeights(jQuery('.activity-map-section .row > div > div'));
  }

  if(jQuery('.programs-swiper-slide').length > 0 && !isMobile) {
    equalHeights(jQuery('.programs-swiper-slide'));
  }
  if(jQuery('.programs-description-row').length > 0 && !isMobile) {
    equalHeights(jQuery('.programs-description-row > div'));
  }
  if(jQuery('.activity-ad-resource-section').length > 0 && jQuery(window).width() > 850) {
    equalHeights(jQuery('.activity-ad-resource-section .activity-content-div'));
  }
  if(jQuery('.activity-ad-headline-area').length > 0 && !isMobile) {
   // equalHeights(jQuery('.activity-ad-headline-area'));
  }

}

function hoverSocialShare(){
  if(jQuery(window).width() < 780) { 
    jQuery('.share-hover-button').click(function(){
        jQuery('.share-hover-list').addClass('visible');
        jQuery(this).addClass('hidden');
      });
    } else {
      jQuery('.share-hover-button').hover(function(){
        jQuery('.share-hover-list').addClass('visible');
        jQuery(this).addClass('hidden');
      });

      jQuery('.share-hover-area').mouseleave(function(){
        if(jQuery('.share-hover-list').hasClass('visible')){
          jQuery('.share-hover-list').removeClass('visible');
          jQuery('.share-hover-button').removeClass('hidden');
        }
      });
    }
  }

jQuery.fn.extend({

  addTemporaryClass: function(className, duration) {
      var elements = this;
      setTimeout(function() {
          elements.removeClass(className);
      }, duration);

      return this.each(function() {
          jQuery(this).addClass(className);
      });
  }
});

// Turn off default ad if a custom ad exists
function customFeatureAd() {
  if(jQuery('.activity-ad-area').length > 0) {
    if(jQuery('.custom-feature').length > 0) {
      jQuery('.custom-feature').addClass('visible');
    } else {
      jQuery('.default-feature').addClass('visible');
    }
  }
}

// Set up alerts if alerts exist
function alerts() {
    if(jQuery('.alert').length > 0) {
      var alert = jQuery('.alert');
      var alertCloseBtn = jQuery('.alert-close-button');

      // If more than one alert, show only the first
      // Add number of extra alerts to the first alert
      // Add Read More after H2
      if(alert.length > 1) {
        alert.addClass('hidden');
        alert.first().removeClass('hidden');
        alert.first().children().append('<div class="alert-number">' + alert.length + '</div>');
        alert.children().children('h2').append('<a href="#" class="read-more">more</a>');
      }

      // Add Read More and ... to long alerts
      alert.first().children().children('h2').dotdotdot({
        after: "a.read-more"
      });

      // If number of alerts clicked, open all alerts
      jQuery('.alert-number').click(function(){
        alert.removeClass('hidden');
        jQuery(this).remove();

        alert.first().siblings().children().children('h2').dotdotdot({
          after: "a.read-more"
        });
      });

      // If Read More link clicked, expand alert
      jQuery('.read-more').click(function(e){
        e.preventDefault();
        var wrapper = jQuery(this).parent();
        wrapper.trigger("destroy");
        wrapper.addClass('expanded');
        wrapper.css('height','auto');
      });

      // If close button clicked, close out alerts
      alertCloseBtn.click(function(){
        var alert = jQuery(this).parent().parent();

        alert.addClass('close');

        alert.siblings().each(function(){
          if(jQuery(this).hasClass('hidden')) {
            jQuery(this).removeClass('hidden');

            jQuery(this).children().children('h2').dotdotdot({
              after: "a.read-more"
            });
          }
        });
      });
    }
}

function convertSVGToInline() {
  convertSVG();

  setTimeout(convertSVG, 900);
  function convertSVG () {
     jQuery('img.inline-svg').each(function(){
            var $img = jQuery(this);
            var imgID = $img.attr('id');
            var imgClass = $img.attr('class');
            var imgURL = $img.attr('src');

            jQuery.get(imgURL, function(data) {
                // Get the SVG tag, ignore the rest
                var $svg = jQuery(data).find('svg');

                // Add replaced image's ID to the new SVG
                if(typeof imgID !== 'undefined') {
                    //$svg = $svg.attr('id', imgID);
                }
                // Add replaced image's classes to the new SVG
                if(typeof imgClass !== 'undefined') {
                    $svg = $svg.attr('class', imgClass+' replaced-svg');
                }

                // Remove any invalid XML tags as per http://validator.w3.org
                $svg = $svg.removeAttr('xmlns:a');

                // Replace image with new SVG
                $img.replaceWith($svg);
                $svg.removeAttr('id');

            }, 'xml');
        });
  }
}


  //Assign to a variable so that we can use it anytime
  var post_ajax = function(target_elm, post_type, post_status, category_name, taxonomy, term, order, orderby, posts_per_page, key, value) {
    
    //Check if vars are empty and assign a default value if it is
    if(!post_type) { post_type = 'activity'; } 
    if(!post_status) { post_status = 'publish'; }
    if(!category_name) { category_name = ''; }
    if(!taxonomy) { taxonomy = ''; }
    if(!term) { term = ''; }
    if(!order) { order = 'ASC'; }
    if(!orderby) { orderby = 'date'; }
    if(!posts_per_page) { posts_per_page = -1; }
    if(!key) { key = ''; }
    if(!value) { value = ''; }


    //jQuery ajax call                
    jQuery.ajax({
      dataType:"html", //Return HTML
      type:"GET",
      url:"/wp-admin/admin-ajax.php", //WP Ajax core, target function MUST be registered and this page MUST be localized in the function file
      data: {
        'action' : 'ajax_post_load', //Name of target function
        'post_type' : post_type, //Assign var values to data array
        'post_status' : post_status,
        'category_name' : category_name,
        'order' : order,
        'orderby' : orderby,
        'posts_per_page' : posts_per_page,
        'taxonomy' : taxonomy,
        'term' : term,
        'key' : key,
        'value' : value
      },
      success : function(data) {
        //If it works
        console.log('successful');

        jQuery(target_elm).html(data);
        
        /*
         * data is what will be returned from your target php function
         * you would utilize jQuery to append the data to what ever container you would like
         * I'm in the proccess of making the target a variable so I am just printing everything
         * to the console
         **************************************************************************************/
         
        console.log(data);
      },
      error : function(xhr, textStatus, errorThrown) {
        //If it doesn't work
        console.error('error');
        //XMLHttpRequest
        console.log(xhr+ ' :: ' +textStatus+' :: '+errorThrown);
      }
    });
  };

  function onVisibilityChange(el, callback) {
      var old_visible;
      return function () {
          var visible = isElementInViewport(el);
          if (visible != old_visible) {
              old_visible = visible;
              if (typeof callback == 'function') {
                  callback();
              }
          }
      }
    }

  function isElementInViewport (el) {

    //special bonus for those using jQuery
    if (typeof jQuery === "function" && el instanceof jQuery) {
        el = el[0];
    }

    var rect = el.getBoundingClientRect();

    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) && /*or $(window).height() */
        rect.right <= (window.innerWidth || document.documentElement.clientWidth) /*or $(window).width() */
    );
}
  
  //Call the function from any where
  //post_ajax('portfolio', 'publish', 'branding-category', 'project-type', 'annual-reports' );
  


/*
function isScrolledIntoView(elem)
{
    var $elem = jQuery(elem);
    var $window = jQuery(window);

    var docViewTop = $window.scrollTop();
    var docViewBottom = docViewTop + $window.height();

    var elemTop = $elem.offset().top;
    var elemBottom = elemTop + $elem.height();

    return ((elemBottom <= docViewBottom) && (elemTop >= docViewTop));
}*/
