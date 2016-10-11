function initNavigation() {
	var mainNav, mainNavItems, mainNavLinks, submenu
	mainNav = jQuery('.main-nav');
	mainNavItems = mainNav.children();
	mainNavLinks = mainNavItems.children('p');
	submenu = jQuery('.sub-menu');
	customSubmenu = jQuery('.custom-post-type-submenu');

	function fadeInNavigation() {
		if(isMd){
			jQuery('.main-navigations').fadeIn('slow');
		}
	} 
	//fadeInNavigation(); 

	// Reposition Custom Post Types inside menu items w/ corresponding data-attr & link, 
	// assign sub-menu class

	// Drop Misc items in Places to Go inside Nav List for Conservation Areas
	var customListMisc = jQuery('.custom-post-misc-areas');
	var customConservationList = jQuery('.custom-post-conservation-areas');

	customListMisc.children().addClass('custom-misc');
	customConservationList.prepend( customListMisc.children() );
	customListMisc.remove();

	// When on desktop, hover for submenus
	function setUpSubMenuHover () {

		// SubMenu for Utility Nav
		jQuery('.utility-nav').children('.menu-item-has-children').hover(function(){
			jQuery(this).addClass('open');
			jQuery(this).siblings().removeClass('open');
			var subMenu = jQuery(this).children('.sub-menu');
		    if(!subMenu.hasClass('open')) {
		    	jQuery(this).addClass('open');
		    	subMenu.addClass('open');
		     	jQuery(this).siblings().children('.sub-menu').removeClass('open');
		    } else {
		    	return;
		    }
		});

		jQuery('.utility-nav').children('.menu-item-has-children').mouseleave(function(){
			var subMenu = jQuery(this).children('.sub-menu');
			if(subMenu.hasClass('open')) {
		    	subMenu.removeClass('open');
		    	jQuery(this).removeClass('open');
		    } 
		});

		// SubMenu for Main Nav
		mainNavItems.hover(function(){
			jQuery(this).addClass('open');
			jQuery(this).siblings().removeClass('open');
		var subMenu = jQuery(this).children('.sub-menu');
	    if(!subMenu.hasClass('open')) {
	    	subMenu.addClass('open');
	     	jQuery(this).siblings().children('.sub-menu').removeClass('open');
	    } else {
	    	return;
	    }
    });

		/*jQuery('.sub-menu').mouseleave(function() {
			var thisSubMenu = jQuery(this); 
			if(jQuery('.sub-menu').hasClass('open')) {
				setTimeout(function() {
		        jQuery('.sub-menu').addClass('close');
		        thisSubMenu.parent().removeClass('open');
		      }, 5);
		      setTimeout(function() {
		          jQuery('.sub-menu').removeClass('close');
		          jQuery('.sub-menu').removeClass('open');
		        }, 10);
		      mainNavItems.removeClass('open');
			}
		});*/
    
    // Close sub-menus when mouseenters site-content
    jQuery( ".site-content" ).mouseenter(function() {
      setTimeout(function() {
        jQuery('.sub-menu').addClass('close');
      }, 500);
      setTimeout(function() {
          jQuery('.sub-menu').removeClass('close');
          jQuery('.sub-menu').removeClass('open');
        }, 800);
      mainNavItems.removeClass('open');
    });

	
	}

	// When on mobile, click for submenus
	function setUpSubMenuClick () {
		 mainNavItems.click(function(event){
	      var subMenu = jQuery(this).children('.sub-menu');
	      if(subMenu.length > 0 &&!subMenu.hasClass('open')) {
	        //event.preventDefault();
	        subMenu.addClass('open');
	        jQuery(this).addClass('open');
	        jQuery(this).siblings().removeClass('open');
	       	jQuery(this).siblings().children('.sub-menu').removeClass('open');
	      } else if (subMenu.length > 0 && subMenu.hasClass('open')){
	      	//event.preventDefault();
	        subMenu.removeClass('open');
	        jQuery(this).removeClass('open');
	      }
	    });

		 jQuery('.utility-nav').children('.menu-item-has-children').children('a').click(function(e){
		 	if(!jQuery(this).parent().hasClass('open')) {
		 		e.preventDefault();
		 		jQuery(this).parent().addClass('open');
				jQuery(this).parent().siblings().removeClass('open');
				var subMenu = jQuery(this).parent().children('.sub-menu');
				if(!subMenu.hasClass('open')) {
			    	jQuery(this).addClass('open');
			    	subMenu.addClass('open');
			     	jQuery(this).siblings().children('.sub-menu').removeClass('open');
			    }
		 	}
			/*jQuery(this).addClass('open');
			jQuery(this).siblings().removeClass('open');
			var subMenu = jQuery(this).children('.sub-menu');
		    if(!subMenu.hasClass('open')) {
		    	jQuery(this).addClass('open');
		    	subMenu.addClass('open');
		     	jQuery(this).siblings().children('.sub-menu').removeClass('open');
		    } else {
		    	return;
		    }*/
		});
	}

	if(isMd) {
		setUpSubMenuHover();
	} else {
		setUpSubMenuClick();
	}

	// Mobile Navigation
	function setUpMobileNav() {
		var menuButton = jQuery('.header-mobile-menu-button');

		menuButton.click(function(){
			if(!jQuery(this).hasClass('menu-open')) {
				jQuery(this).addClass('menu-open');
				jQuery('.main-mobile-navigations').addClass('menu-open');
				jQuery('body').css('position', 'fixed');
				jQuery('body').css('top', '0');
				jQuery('body').css('right', '0');
				jQuery('body').css('left', '0');
				jQuery('body').css('width', '100%'); 
			} else {
				jQuery(this).removeClass('menu-open');
				jQuery('.main-mobile-navigations').removeClass('menu-open');
				jQuery('body').css('position', 'relative');
			}
		});

		jQuery('.header-utility-nav-button').click(function(){
			if(!jQuery(this).hasClass('open')) {
				jQuery(this).addClass('open');
				jQuery('.header-utility-navigation').addClass('open');
			} else {
				jQuery(this).removeClass('open');
				jQuery('.header-utility-navigation').removeClass('open');
			}
		});
	}
	setUpMobileNav();

	// Animate Navigation
	var header = jQuery('header');

	function setUpStickyNav () {
	    jQuery(window).scroll(function() {
	    if (jQuery(this).scrollTop() > 50){  
	        jQuery('header').addClass("sticky");
	      }
	      else{
	        jQuery('header').removeClass("sticky");
	      }
	    });
	  }
	  setUpStickyNav();

	  var utilityNav = jQuery('.header-utility-navigation');

	  function hoverUtilityMenu() {
	  	utilityNav.mouseenter(function(){
	  		if(header.hasClass('sticky') && !utilityNav.hasClass('expanded')) {
	  			utilityNav.addClass('expanded');
	  			header.addClass('utility-expanded');
		  	}
	  	});

	  	utilityNav.mouseleave(function(){ 
	  		if(header.hasClass('sticky') && utilityNav.hasClass('expanded')) {
	  			utilityNav.removeClass('expanded');
	  			header.removeClass('utility-expanded');
	  		}
	  	});
	  }
	  hoverUtilityMenu();

	  function showCurrentPage() {
	  	if (window.location.href.indexOf("places-to-go") > -1) {
		    jQuery('.places-to-go').parent().addClass('current');
		}
		if (window.location.href.indexOf("things-to-do") > -1) {
		    jQuery('.things-to-do').parent().addClass('current');
		}
	  	if (window.location.href.indexOf("make-a-difference") > -1) {
		    jQuery('.make-a-difference').parent().addClass('current');
		}
	  	if (window.location.href.indexOf("rentals-permits") > -1) {
		    jQuery('.rentals-permits').parent().addClass('current');
		}
		if (window.location.href.indexOf("what-we-do") > -1) {
		    jQuery('.what-we-do').parent().addClass('current');
		}

		var pageSlug = jQuery('.site-content').attr('data-page-slug'); 
		if(pageSlug.length > 0) {
			jQuery('.sub-menu li a').each(function(){
				if(jQuery(this).attr('data-slug') === pageSlug){
					jQuery(this).addClass('current');
				}
			});

			if(isMobile) {
				jQuery('.submenu-category-list > li[data-id]').each(function(){
					var postID = jQuery(this).attr('data-id');
					var link = jQuery(this).children('a');
					if(!jQuery('body').hasClass(postID)) {
						link.removeClass('current');
					}
				});
			} else {
				jQuery('.submenu-category-list > li[data-page-id]').each(function(){
					var postID = jQuery(this).attr('data-page-id');
					var link = jQuery(this).children('a');
					if(!jQuery('body').hasClass(postID)) {
						link.removeClass('current');
					}
				});
			}
		}
	  }
	  showCurrentPage() ;
}

