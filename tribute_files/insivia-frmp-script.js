var $ = jQuery.noConflict();
(function($, root, undefined) {
  $(function() {
    'use strict';

    //Global Vars
    var accessToken = 'CAACWBEfnRNUBAK40oSLLB6ZBek7ZA7O9ZBpWbFeVIvhZCTRIcYKKA1cAEaESZAYIDH9hKnEWQ9EFx8RFCbKZASZBDFhsKgR5tqtmQjZCAXg1BQ6kZCGcAGgsZBWvZANZBxXjfN8qvajFjzu7DvKwZBZAsNvphESv5yHqpZBNRVL2cLmBxHwhowWZBrOoLSfnlnXcZBevRz7UWTyZCuhmzxRFq6DbgLdj4d',
        currentDate = new Date(),
        currentYear = currentDate.getFullYear(),
        currentMonth = currentDate.getMonth(),
        today = currentDate.getDate(),
        monthsArray = [
          "January",
          "February",
          "March",
          "April",
          "May",
          "June",
          "July",
          "August",
          "September",
          "October",
          "November",
          "December"
        ],
        dotwArray = [
          "Sunday",
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday"
        ],
        baseUrl = 'https://reservations.metroparks.org/api/v1/',
        programAPI = 'programs',
        facilitiesAPI = 'facilities',
        resultsNone = '<h1 class="subpage-headline">Oops! No matches were found.</h1><p style="padding-bottom:50px;">Search for something new, or head back to our homepage.</p><a href="http://www.metroparks.org/" class="orange-btn btn" style="color:white;">Back To Home</a>';
        
    //functions
    function slugify(theString) {
      return theString.toLowerCase().replace(/[^\w ]+/g, '').replace(/ +/g, '-');
    }
    function check_event_number() {
      $.each($('.insivia-frmp-calendar-day-events'), function() {
        var lists = $(this).children(),
            moreThanFour;

        if (lists.length > 3) {
          moreThanFour = lists;
          //add a button to make them larger
          if ($('a[href="#pop-up-' + $(this).parent().parent().attr('id') + '"]').length === 0) {
            $(this).after('<span class="insivia-frmp-calendar-more-than-four"><a href="#pop-up-' + $(this).parent().parent().attr('id') + '">View all ' + lists.length + '</a></span>');
          }
        }
      });

      //Make the button clickable
      $('.insivia-frmp-calendar-more-than-four a').click(function(e) {
        e.preventDefault();
        $(this).parents('.insivia-frmp-calendar-day-content').toggleClass('full');
      });
    } //Check the number of events
    function trim_string(theString, maxLength, delimiter) {
      (delimiter) ? delimiter = delimiter: delimiter = ' ';
      (maxLength) ? maxLength = maxLength: maxLength = 40;

      var tokens = theString.split(delimiter).slice(0, maxLength),
          trimmed = tokens.join(delimiter);

      return trimmed + '&hellip;';
    }
    function days_in_month(theMonth, theYear) {
      var date = new Date(theYear, theMonth, 1),
          days = [];

      while (date.getMonth() === theMonth) {
        days.push(new Date(date));
        date.setDate(date.getDate() + 1);
      }
      return days;
    }
    function date_from_day(theDay, theYear) {
      var date = new Date(theYear, 0);
      return new Date(date.setDate(theDay));
    }
    function day_of_the_year(theYear, theMonth, theDay) {
      var now;
      if(theYear && theMonth && theDay) {
        now = new Date(theYear, theMonth, theDay);
      } else {
        now = new Date();
      }
      var start = new Date(now.getFullYear(), 0, 0),
          diff = now - start,
          oneDay = 1000 * 60 * 60 * 24,
          day = Math.ceil(diff / oneDay);

      return day;
    }
    function to_am_pm(time) {

      time = time.slice(0, -3);
      var timeArray = time.split(':'),
          displayTime;
      
      if(timeArray[0] > 12) {
        timeArray[0] = timeArray[0] - 12;
        displayTime = timeArray[0] + ':' + timeArray[1]+ 'pm';
      } else {
        if(timeArray[0] < 12) {
          if(timeArray[0].split('')[0]===0 || timeArray[0].split('')[0].indexOf('0')>-1) {
            timeArray[0] = timeArray[0].slice(1);
          }
          displayTime = timeArray[0] + ':' + timeArray[1]+ 'am';
        } else {
          displayTime = timeArray[0] + ':' + timeArray[1]+ 'pm';
        }
      }

      return displayTime;
    }
    function no_results(target, type) {
      
      (type) ? type = type : type = 'event';
      
      var message = '';
      
      switch(type) {
        case 'home':
        case 'upcoming':
          message = 'date';
          break;
        case 'event':
          message = 'activity';
          //http://www.metroparks.org/things-to-do/boating/
          break;
        case 'location':
          message = 'location';
          break;
        case 'tag':
          message = 'experience';
          break;
        case 'facility':
          message = 'facility';
          break;
      }
      
      
      if(type != 'popup') {
        var noEvents = '<div class="insivia-frmp-event-slide insivia-frmp-row no-program">' +
            '<div class="insivia-frmp-event-slider-content-left insivia-col-43">' +
            '<h3 class="insivia-frmp-event-slider-content-title">No programs are currently scheduled for this '+message+'.</h3>' +
            '<span class="insivia-frmp-event-slider-content">' +
            '<span class="insivia-frmp-event-slider-content-date">' +
            '<span class="insivia-frmp-event-slider-content-day"> </span>' +
            '<span class="insivia-frmp-event-slider-content-month"> </span> ' +
            '</span> ' +
            '<span class="insivia-frmp-event-slider-location"> </span>' +
            '</span>' +
            '</div>' +
            '<div class="insivia-frmp-event-slider-content-right insivia-col-4">' +
            '<a class="insivia-frmp-event-slider-content-arrow" href="/programs-events-finder/">&#8594;</a>' +
            '</div>' +
            '</div>' +
            '</div>';
        
        target.html(noEvents);
      } else {
        console.error('No pop up information available');
      }
    }
    function form_functionality(source, target) {
      if(!source && !target) return;
      
      var inputArray = source.find('input'),
          selectArray = source.find('select'),
          queryBuild = '';

      for(var i = 0; i <= selectArray.length; ++i) {
        if(selectArray[i]) {
          selectArray[i] = selectArray[i].id.split('-');
          queryBuild += '&'+selectArray[i][(selectArray[i].length-1)]+'='+source.find('select[id*='+selectArray[i][(selectArray[i].length-1)]+']').val();
        }
      }
      for(var i = 0; i <= inputArray.length; ++i) {
        if(inputArray[i]) {
          if(inputArray[i].id) {
            if(inputArray[i].id.indexOf('submit') == -1) {         
              inputArray[i] = inputArray[i].id.split('-');
              
              (inputArray[i][(inputArray[i].length-1)] == 'date') ?
                 queryBuild += '&'+inputArray[i][(inputArray[i].length-2)]+'_'+inputArray[i][(inputArray[i].length-1)]+'='+source.find('input[id*='+inputArray[i][(inputArray[i].length-2)]+']').val() : queryBuild += '&'+inputArray[i][(inputArray[i].length-1)]+'='+source.find('input[id*='+inputArray[i][(inputArray[i].length-1)]+']').val();

              if(queryBuild.indexOf('type') == -1) queryBuild += '&type='+inputArray[i][0];
              
              if( inputArray[i][(inputArray[i].length-1)] == 'search' && source.find('input[id*='+inputArray[i][(inputArray[i].length-1)]+']').val() ) {
                queryBuild = '?s='+source.find('input[id*='+inputArray[i][(inputArray[i].length-1)]+']').val();
              }
            }
          }
        }
      }
      
      if(queryBuild.indexOf('?s=')>-1) {
        window.open( 'http://'+window.location.hostname+queryBuild+'&type=program', '_self');
      } else {
        (window.location.href.indexOf('?') == -1) ? window.open( window.location.href+'?'+queryBuild.substring(1), '_self') : window.open( window.location.href.split('?')[0]+'?'+queryBuild.substring(1), '_self');
      }
      
    }
    function put_to_slide(api, target, type, id, tag, maxNum) {
      if (!api || !target) return;
      
      //Types: home, upcoming, event, location, tag, facility
      
      (type) ? type = type : type = 'upcoming';

      var errorMessage = '',
          viewAllEvents;
      
      switch(type) {
        case 'home':
          errorMessage = 'No programs are scheduled for this date';
          break;
        case 'upcoming':
          errorMessage = 'No programs are scheduled for this date';
          break;
        case 'event':
          errorMessage = 'No programs are scheduled for this event';
          break;
        case 'location':
          errorMessage = 'No programs are scheduled for this location';
          break;
        case 'tag':
          errorMessage = 'No programs are scheduled for this activity';
          break;
        case 'facility':
          errorMessage = 'No programs are scheduled for this facility';
          break;
      }

      var slides = '',
          url = baseUrl,
          c = 0,
          noEvents = '<div class="insivia-frmp-event-slider-content-bottom insivia-frmp-row no-program">' +
          '<div class="insivia-frmp-event-slider-content-left insivia-col-43">' +
          '<h3 class="insivia-frmp-event-slider-content-title">'+errorMessage+'</h3>' +
          '<span class="insivia-frmp-event-slider-content">' +
          '<span class="insivia-frmp-event-slider-content-date">' +
          '<span class="insivia-frmp-event-slider-content-month"> </span> ' +
          '<span class="insivia-frmp-event-slider-content-day"> </span>' +
          '</span> ' +
          '<span class="insivia-frmp-event-slider-location"> </span>' +
          '</span>' +
          '</div>' +
          '<div class="insivia-frmp-event-slider-content-right insivia-col-4">' +
          '<a class="insivia-frmp-event-slider-content-arrow" href="/programs-events-finder/">&#8594;</a>' +
          '</div>' +
          '</div>';
      (maxNum) ? maxNum = maxNum: maxNum = '14';

      switch (type) {
        case 'home':
          var now = new Date(),
              thisYear = now.getFullYear(),
              startOn = new Date(now.getFullYear(), 0, 0),
              diff = now - startOn,
              oneDay = 1000 * 60 * 60 * 24,
              day = Math.floor(diff / oneDay),
              queryEndYear = thisYear, queryEndMonth, queryEndDay;
              
              viewAllEvents = '<a href="/programs-events-finder/" class="view_all_events">View All</a>';
              
              (now.getMonth() < 10) ? queryEndMonth = '0' + (now.getMonth()+1): queryEndMonth = (now.getMonth()+1);
              (now.getDate() < 10) ? queryEndDay = '0' + now.getDate(): queryEndDay = now.getDate();
              
              ++queryEndMonth;
              
              if((queryEndMonth+1) > 12) {
                ++queryEndYear;
              }

          url += api + '?access_token=' + accessToken;

          var eventSlides = '';
          slides += '<div id="three-day-rundown" class="insivia-frmp-event-slide">' +
            '<div class="insivia-frmp-end-date">' +
            '<span class="insivia-frmp-dow">Upcoming</span>' +
            '<span class="insivia-frmp-day">3</span>' +
            '<span class="insivia-frmp-month">&nbsp;</span>' +
            '</div>' +
            '</div>';
          eventSlides = '<div id="event-three-day-rundown" class="insivia-frmp-event-slide">' +
            '<div class="insivia-frmp-end-date"></div>' +
            '</div>';

          //create date slider
          for (var i = 0; i <= maxNum; ++i) {
            var currentDotw = date_from_day(day, thisYear),
                currentMonth = currentDotw.getMonth(),
                currentDay = currentDotw.getDay(),
                currentYear = currentDotw.getFullYear(),
                currentDate = currentDotw.getDate(),
                displayMonth = monthsArray[currentMonth],
                displayDay = dotwArray[currentDay],
                slideID = 'slide-' + currentYear;

            ++currentMonth;

            (currentMonth < 10) ? slideID += '-0' + currentMonth: slideID += '-' + currentMonth;
            (currentDate < 10) ? slideID += '-0' + currentDate: slideID += '-' + currentDate;

            slides += '<div id="' + slideID + '" class="insivia-frmp-event-slide">' +
              '<div class="insivia-frmp-end-date">' +
              '<span class="insivia-frmp-dow">' + displayDay + '</span>' +
              '<span class="insivia-frmp-day">' + currentDate + '</span>' +
              '<span class="insivia-frmp-month">' + displayMonth + '</span>' +
              '</div>' +
              '</div>';

            eventSlides += '<div id="event-' + slideID + '" class="insivia-frmp-event-slide event-num-' + i + '" data-event-count="0"></div>';

            ++day;

            if (i == maxNum) {
              if ($('#insivia-frmp-homepage-slider-dates ').length !== 0 && $('#insivia-frmp-homepage-slider-events ').length !== 0) {
                $('#insivia-frmp-homepage-slider-dates').append(slides);
                $('#insivia-frmp-homepage-slider-events').append(eventSlides);
              }
              
              $('#insivia-frmp-homepage-slider-dates').slick({
                infinite: false,
                slidesToShow: 7,
                slidesToScroll: 1,
                dots: false,
                asNavFor: '#insivia-frmp-homepage-slider-events',
                responsive: [{
                  breakpoint: 768,
                  settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1
                  }
                }]
              });
              $('#insivia-frmp-homepage-slider-events').slick({
                infinite: false,
                slidesToShow: 1,
                slidesToScroll: 1,
                dots: false,
                arrows: false,
                asNavFor: '#insivia-frmp-homepage-slider-dates',
                responsive: [{
                  breakpoint: 768,
                  settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1
                  }
                }]
              });

              //Lead Events
              var rundown = [];
              break;
            } //if max days
          }

          break;
        case 'upcoming':
        default:
          url += api + '?access_token=' + accessToken;
          viewAllEvents = '<a href="/programs-events-finder/" class="view_all_events">View All</a>';
          break;
        case 'event':
          (id) ? id=id : console.error('No '+type+' ID assigned');
          url += api + '?topic_id=' + id + '&access_token=' + accessToken;
          viewAllEvents = '<a href="/programs-events-finder/?parks=&topics='+id+'&experiences=&series=&start_date=&type=insivia&end_date=&search=" class="view_all_events">View All</a>';
          break;
        case 'location':
          (id) ? id=id : console.error('No '+type+' ID assigned');
          url += api + '?park_id=' + id + '&access_token=' + accessToken;
          viewAllEvents = '<a href="/programs-events-finder/?parks='+id+'&topics=&experiences=&series=&start_date=&type=insivia&end_date=&search=" class="view_all_events">View All</a>';
          break;
        case 'tag':
          (tag) ? tag=tag : console.error('No '+type+' value assigned');
          
          if( parseInt(tag) == 145) {
            url += api + '?tags=family&tags=Preschool&access_token=' + accessToken;
            viewAllEvents = '<a href="/programs-events-finder/?parks=&topics=&experiences=145&series=&start_date=&type=insivia&end_date=&search=" class="view_all_events"" class="view_all_events">View All</a>';
          } else {
            url += api + '/experiences/' + tag + '?access_token=' + accessToken;
            viewAllEvents = '<a href="/programs-events-finder/" class="view_all_events">View All</a>';
          }
          break;
        case 'facility':
          (id) ? id=id : console.error('No '+type+' ID assigned');
          url += api + '/' + id + '/?access_token=' + accessToken;
          viewAllEvents = '<a href="/programs-events-finder/" class="view_all_events">View All</a>';
          console.log(url);
          break;
      }
            
      if( type == 'home' ) {
        var pagesCount;
        $.getJSON(url, function(json){
         pagesCount = json.total_pages;
        }).done(function() {
          
            var promises = [];
            for(var i = 1; i <= pagesCount; ++i) {
              var jsonRequest = $.getJSON(url+'&page='+i);
              promises.push( jsonRequest );
            }

            $.when.apply(null, promises).done(function() {
              var programs = [];              
              for( var i = 0; i <= promises.length; ++i) {
                if(promises[i]) {
                  for( var j = 0; j <= promises[i].responseJSON.programs.length; ++j) {
                    if( promises[i].responseJSON.programs[j] ) {
                      programs.push(promises[i].responseJSON.programs[j]);
                    }
                  }
                }
              }
              if(api == 'programs') {
                if (programs.length === 0)
                  no_results(target, type);
              }
               c = 0;       
              for(var k = 0; k <= programs.length; ++k) {
                if(programs[k]) {
                  var programID = programs[k].program_id,
                      programNumber = programs[k].program_number,
                      locationName = programs[k].location_name,
                      title = programs[k].title,
                      beginDate = programs[k].begin_date,
                      endDate = programs[k].end_date,
                      beginDateArray = beginDate.split('-'),
                      endDateArray = endDate.split('-');
  
                  //strip the 0's
                  if (beginDateArray[1] < 10) beginDateArray[1] = beginDateArray[1].slice(1);
                  if (beginDateArray[2] < 10) beginDateArray[2] = beginDateArray[2].slice(1);
                  if (endDateArray[1] < 10) endDateArray[1] = endDateArray[1].slice(1);
                  if (endDateArray[2] < 10) endDateArray[2] = endDateArray[2].slice(1);
  
                  //Make a new date object
                  var slideDay = new Date(beginDateArray[1] + '/' + beginDateArray[2] + '/' + beginDateArray[0]),
                      slideDotw = day[slideDay.getDay()],
                      slideMonth = monthsArray[slideDay.getMonth()],
                      slideDayEnd = new Date(endDateArray[1] + '/' + endDateArray[2] + '/' + endDateArray[0]),
                      slideDayEndDotw = day[slideDayEnd.getDay()],
                      slideDayEndMonth = monthsArray[slideDayEnd.getMonth()];

                  var homeEvent = '<div class="insivia-frmp-content-bottom insivia-frmp-row">' +
                      '<a href="/programs-events-finder/?program_number='+programNumber+'&api='+programAPI+'&type=program"><div class="insivia-frmp-content-left insivia-col-43">' +
                      '<h3 class="insivia-frmp-content-title">' + title + '</h3>' +
                      '<span class="insivia-frmp-content">' +
                      '<span class="insivia-frmp-content-date">' +
                      '<span class="insivia-frmp-content-month">' + slideMonth + '</span> ' +
                      '<span class="insivia-frmp-content-day">' + slideDay.getDate() + '</span>' +
                      '</span> | ' +
                      '<span class="insivia-frmp-location">' + locationName + '</span>' +
                      '</span>' +
                      '</div>' +
                      '<div class="insivia-frmp-content-right insivia-col-4">' +
                      '<a class="insivia-frmp-content-arrow" href="/programs-events-finder/?program_number='+programNumber+'&api='+programAPI+'&type=program">&#8594;</a>' +
                      '</div></a>' +
                      '</div>';
  
                  if ($('#event-slide-' + beginDate).length !== 0) {
                    var count = $('#event-slide-' + beginDate).attr('data-event-count');
                    ++count;
                    if (count <= 3) {
                      $('#event-slide-' + beginDate).append(homeEvent);
                      $('#event-slide-' + beginDate).attr('data-event-count', count);
                    }
                  }
  
                  ++c;
                  rundown.push(homeEvent);
                  if (c == 3) {
                    var firstThree = rundown[0] + rundown[1] + rundown[2];
                    $('#event-three-day-rundown').html(firstThree);
                    $('#event-three-day-rundown').append(viewAllEvents);
                    
                }
              }
            }

              //Home Slider
              if($('#insivia-frmp-homepage-slider').length) {
                $.each($('[data-event-count]'), function() {
                  var eventCount = $(this).attr('data-event-count');
                  if (eventCount == '0') {
                    $(this).html(noEvents);
                    $(this).append(viewAllEvents);
                  } else {
                    $(this).append(viewAllEvents);
                  }
                });
                $('#insivia-frmp-homepage-slider-dates .insivia-frmp-event-slide').click(function() {
                  $('#insivia-frmp-homepage-slider-dates').slick('slickGoTo', $(this).attr('data-slick-index'));
                });
                //Hide and seek previous button
                $('#insivia-frmp-homepage-slider .slick-next').click(function() {
                  $('#insivia-frmp-homepage-slider .slick-prev').css({
                    visibility: 'visible'
                  });
                });
                $('#insivia-frmp-homepage-slider .slick-prev').click(function() {
  
                  var elem = $('#insivia-frmp-homepage-slider .slick-current').attr('id');
  
                  elem = elem.replace('slide-', '');
  
                  var today = new Date(),
                      todaysMonth = today.getMonth(),
                      todaysDate = today.getDate(),
                      todaysYear = today.getFullYear(),
                      todaysID;
  
                  ++todaysMonth;
  
                  (todaysMonth < 10) ? todaysMonth = '0' + todaysMonth: todaysMonth = todaysMonth;
                  (todaysDate < 10) ? todaysDate = '0' + todaysDate: todaysDate = todaysDate;
  
                  todaysID = todaysYear + '-' + todaysMonth + '-' + todaysDate;
  
                  if (elem == todaysID) {
                    $(this).css({
                      visibility: 'hidden'
                    });
                  }
  
                });
              }

              });
        });
        
      }
      

      $.getJSON(url, function(json) {

        if(api == 'programs') {
          if (json.programs.length === 0)
            no_results(target, type);
        } else {
          if (json.facility.length === 0)
            no_results(target, type);
        }

        switch(type) {
          case 'upcoming':
          case 'event':
          case 'location':
          case 'tag':
            c = 0;

            for (var i = 0; i <= json.programs.length; ++i) {
              if(json.programs[i]) {
                var programID = json.programs[i].program_id,
                    programNumber = json.programs[i].program_number,
                    locationName = json.programs[i].location_name,
                    parkName = json.programs[i].park_name,
                    title = json.programs[i].title,
                    beginDate = json.programs[i].begin_date,
                    endDate = json.programs[i].end_date,
                    beginDateArray = beginDate.split('-'),
                    endDateArray = endDate.split('-');

                ++c;

                //strip the 0's
                if (beginDateArray[1] < 10) beginDateArray[1] = beginDateArray[1].slice(1);
                if (beginDateArray[2] < 10) beginDateArray[2] = beginDateArray[2].slice(1);
                if (endDateArray[1] < 10) endDateArray[1] = endDateArray[1].slice(1);
                if (endDateArray[2] < 10) endDateArray[2] = endDateArray[2].slice(1);

                //Make a new date object
                var slideDay = new Date(beginDateArray[1] + '/' + beginDateArray[2] + '/' + beginDateArray[0]),
                    slideDotw = dotwArray[slideDay.getDay()],
                    slideMonth = monthsArray[slideDay.getMonth()];

                slides += '<div class="insivia-frmp-event-slide insivia-frmp-row">' +
                  '<div class="insivia-frmp-content-left">' +
                  '<a href="/programs-events-finder/?program_number='+programNumber+'&api='+programAPI+'&type=program"><div class="insivia-frmp-sub-content-left">' +
                  '<div class="insivia-frmp-content-end-date">' +
                  '<span class="insivia-frmp-content-dow">' + slideDotw + '</span>' +
                  '<span class="insivia-frmp-content-day">' + slideDay.getDate() + '</span>' +
                  '<span class="insivia-frmp-content-month">' + slideMonth + '</span>' +
                  '</div>' +
                  '</div>' +
                  '<div class="insivia-frmp-sub-content-right">' +
                  '<h3 class="insivia-frmp-content-title">' + title + '</h3>' +
                  '<span class="insivia-frmp-location">' + parkName + '</span>' +
                  '</div>' +
                  '</div>' +
                  '<div class="insivia-frmp-content-right insivia-col-4">' +
                  '<a class="insivia-frmp-content-arrow" href="/programs-events-finder/?program_number='+programNumber+'&api='+programAPI+'&type=program">&#8594;</a>' +
                  '</div></a>' +
                  '</div>';
              }
            }
            
            slides += '<div id="slide-event-view-all" class="insivia-frmp-event-slide insivia-frmp-row">' + viewAllEvents + '</div>';
            
            break;
          case 'facility':

            var photoArray = [];

            $('.insivia-frmp-lighbox').html('');

            slides += '<div class="gallery-slide-show">';

            if(json.facility.photos.length) {
              for(var i = 0; i<= json.facility.photos.length; ++i) {
                if(json.facility.photos[i]) {
                  slides += '<div class="gallery-slide insivia-frmp-gallery" style="background: url(' + json.facility.photos[i].photo + ') center center no-repeat; background-size: cover;"></div>';
                }
              }
            }

            slides += '</div>';
            break;
        }

      }).done(function() {
        switch (type) {
          case 'home':

            break;
          case 'upcoming':
          case 'event':
          case 'location':
          case 'tag':
            //Sub Page Slider
            if ($('.sub-slider').length !== 0) {
              $('.sub-slider').on('init', function(event, slick) {
                $('.sub-slider .slick-next').click(function() {
                  $('.sub-slider .slick-prev').css({
                    visibility: 'visible'
                  });
                });
                $('.sub-slider .slick-prev').click(function() {  
                  var elem = $('.sub-slider .slick-current').attr('data-slick-index');
                  if (elem == '0') {
                    $(this).css({
                      visibility: 'hidden'
                    });
                  }
                });
              });

              $('.sub-slider').append(slides).after('<div class="view-all-button">'+viewAllEvents+'</div>');
              $('.sub-slider').slick({
                infinite: false,
                slidesToShow: 3,
                slidesToScroll: 1,
                dots: false,
                responsive: [{
                  breakpoint: 768,
                  settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1
                  }
                }]
              });
            }
            $('.sub-slider .insivia-frmp-event-slide').click(function() {
              $('.sub-slider').slick('slickGoTo', $(this).attr('data-slick-index'));
            });
            break;
          case 'facility':
            if ($('.insivia-frmp-lighbox').length !== 0) {
              $('.insivia-frmp-lighbox').html(slides);
              $('.insivia-frmp-lighbox, .insivia-frmp-gallery').show();

              if ($('.gallery-slide-show').length) {
                $('.gallery-slide-show').on('init', function(event, slick) {
                  $(this).append('<div class="insivia-frmp-lighbox-popup-close">X</div>');
                });
                $('.gallery-slide-show').slick({
                  dots: true,
                  arrows: false,
                  infinite: true,
                  speed: 300,
                  slidesToShow: 1,
                });        
              }

              
              $.each($('.insivia-frmp-lighbox-popup-close'),function() {
                $(this).click(function() {
                  var previous = document.referrer;
                  ( previous.indexOf('?parks')>-1) ? window.open(previous, '_self') : $('.insivia-frmp-lighbox').stop().fadeOut();
                });
              });
            }
            break;
        }
      });
    }
    function get_options(target, field, type) {
      var options = '',
          url = '',
          seriesIDArray = [],
          seriesIDsArray = [];
      
      switch(field) {
        case 'parks':
          if(type == "facilities") {
            url = 'https://reservations.metroparks.org/api/v1/'+facilitiesAPI+'/parks?access_token=' + accessToken;
          } else {
            url = 'https://reservations.metroparks.org/api/v1/'+programAPI+'/parks?access_token=' + accessToken;
          }
          break;
        case 'topics':
          url = 'https://reservations.metroparks.org/api/v1/'+programAPI+'/topics?access_token=' + accessToken;
          break;
        case 'series':
          url = 'https://reservations.metroparks.org/api/v1/'+programAPI+'/series?access_token=' + accessToken;
          break;
        case 'experiences':
          url = 'https://reservations.metroparks.org/api/v1/'+programAPI+'/experiences?access_token=' + accessToken;
          break;
        case 'permits':
          url = 'https://reservations.metroparks.org/api/v1/'+facilitiesAPI+'/permitss?access_token=' + accessToken;
          break;
      }
      
      $.getJSON(url, function(json) {  
        
        options += '<option value="">All</option>'
                    
        switch(field) {
          case 'parks':
            for (var i = 0; i < json.parks.length; ++i) {
              if( json.parks[i].id != '286822') options += '<option value="' + json.parks[i].id + '">' + json.parks[i].name + '</option>';
            }
            break;
          case 'topics': //Activities
              for (var i = 0; i < json.topics.length; ++i) {
                options += '<option value="' + slugify(json.topics[i].id) + '">' + json.topics[i].name + '</option>';
              }
            break;
          case 'series':
              options += '<option value="0000">All Conservation Kids Series</option>';
              for (var i = 0; i < json.series.length; ++i) {
                options += '<option value="' + json.series[i].id + '">' + json.series[i].name + '</option>';
              }
            break;
          case 'experiences':
            for (var i = 0; i < json.experiences.length; ++i) {
              options += '<option value="' + json.experiences[i].id + '">' + json.experiences[i].name + '</option>';
            }
            break;
          case 'permits':
            if(type) {              
              switch(type) {
                case 'ice_rink':
                  options += '<option value="' + json.permit_types.ice_rink.id + '">' + json.permit_types.ice_rink.name + '</option>';
                  break;
                case 'camping':
                  for (var i = 0; i <= json.permit_types.camping.length; ++i) {
                    if (json.permit_types.camping[i]) {
                      options += '<option value="' + json.permit_types.camping[i].id + '">' + json.permit_types.camping[i].name + '</option>';
                    }
                  }
                  break;
                case 'facilities':
                  for (var i = 0; i <= json.permit_types.facilities.length; ++i) {
                    if (json.permit_types.facilities[i]) {
                      options += '<option value="' + json.permit_types.facilities[i].id + '">' + json.permit_types.facilities[i].name + '</option>';
                    }
                  }
                  break;
              }
            }
            break;
        }
      }).done(function() {
        
        var singleSeriesUrl = '';
        target.html(options);
      });
    }
    function append_new_month(theMonth, theYear, url) {      
      var daysArray = days_in_month(theMonth, theYear),
          w = 0,
          d = 0,
          m = theMonth,
          y = theYear,
          nm,
          listViewBuild = '',
          displayMonth = '',
          displayDay,
          todayCSS = '',
          listDay = '';
            
      for(var i = 0; i <= daysArray.length; ++i) {
        ++d;
        if( w > (dotwArray.length - 1) ) w = 0;
        
        nm = theMonth;
        if(!url) {
          ++nm;
        }
        
        (nm < 10) ? displayMonth = '0' + nm: displayMonth = nm;
        (d < 10) ? displayDay = '0' + d: displayDay = d;
        (d == today && m == theMonth) ? todayCSS = " today": todayCSS = "";
        
        listDay = new Date(displayMonth+'/'+displayDay+'/'+theYear);
        
        listViewBuild += '<li id="list-date-' + theYear + '-' + displayMonth + '-' + displayDay + '" class="insivia-frmp-list-view-' + dotwArray[w].toLowerCase() + ' insivia-frmp-list-view-day insivia-frmp-event-day active' + todayCSS + '"><span class="insivia-frmp-list-view-date"><span class="insivia-frmp-list-view-display-date">' + monthsArray[listDay.getMonth()] + ' ' + displayDay + ', ' + theYear + '</span> <span class="insivia-frmp-list-view-dotw">' + dotwArray[listDay.getDay()] + '</span></span><ul class="insivia-frmp-list-view-event-list"></ul></li>';
        ++w;
      }
      
      $('.insivia-frmp-list-view-days').append( listViewBuild );

      var start = new Date(y, m),
          end = new Date(y, m, 0),
          url2 = baseUrl,
          pageCount;
      
      (url) ? url2 = url : url2 += programAPI+'?begin_date='+start.getFullYear()+'-'+(start.getMonth()+1)+'-'+start.getDate()+'&end_date='+start.getFullYear()+'-'+(start.getMonth()+1)+'-'+end.getDate()+'&access_token='+accessToken;
      
      console.log(url2);
      $.getJSON(url2, function(json) {
        pageCount = json.total_pages;        
        if(!pageCount) {
          $('.more-container a').text('All Programs are loaded').click(function(e){e.preventDefault();});
        }        
      }).done(function() {
        
        var promises = [];
        for(var i = 1; i <= pageCount; ++i) {
          var jsonRequest = $.getJSON(url2+'&page='+i);
          promises.push( jsonRequest );
        }

        $.when.apply(null, promises).done(function() {
          var programs = [];              
          for( var i = 0; i <= promises.length; ++i) {
            if(promises[i]) {
              for( var j = 0; j <= promises[i].responseJSON.programs.length; ++j) {
                if( promises[i].responseJSON.programs[j] ) {
                  programs.push(promises[i].responseJSON.programs[j]);
                }
              }
            }
          }

          for(var k = 0; k <= programs.length; ++k) {
            if(programs[k]) {                  
              var beginDate = programs[k].begin_date,
                  start = to_am_pm(programs[k].start_time),
                  end = to_am_pm(programs[k].end_time),
                  displayAges = (programs[k].age_range.match(/^[0-9]+$/)) ? 'All ages' : programs[k].age_range,
                  displayPrice = (programs[k].prices[0].price == '0.00') ? programs[k].prices[0].description : '$' + programs[k].prices[0].price,
                  series = '',
                  series_color = '',
                  cancellation = '';
            
              if(programs[k].tags) {
                for(var l = 0; l <= programs[k].tags.length; ++l) {
                  if(programs[k].tags[l]) {
                    if(programs[k].tags[l].marketing_color) {
                      series_color += ' series-'+programs[k].tags[l].marketing_color;
                    }
                  }
                }
              }
              if (programs[k].series_name) series= '<a href="/programs-events-finder/?parks=&topics=&experiences=&series='+programs[k].series_id+'&start_date=&type=insivia&end_date=" class="insivia-frmp-event-series'+series_color+'">Part of ' + programs[k].series_name + ' series</a>';
            
              $.each( $('.insivia-frmp-event-day'), function() {
                                    
                if( $(this).attr('id') ) {
                  if( $(this).attr('id').indexOf( programs[k].begin_date )>-1 ) {
                    
                    if (!$(this).hasClass('hasEvent')) $(this).addClass('hasEvent');
                    var listTarget = 'insivia-frmp-list-view-day';
                    
                     if( $(this).hasClass(listTarget) ) {
                      if(!programs[k].is_cancelled) cancellation = '<span class="red">'+programs[k].cancellation_reason+'</span>';
                      
                      $(this).find('ul.insivia-frmp-list-view-event-list').append('<li id="list-item-' + slugify(programs[k].title) + '-'+programs[k].begin_date+'" class="insivia-frmp-event">'+series+'<span class="insivia-frmp-event-title blue">' + '<a href="#' + slugify(programs[k].title) + '" class="popup-btn blue" data-api="'+programAPI+'" data-id="'+programs[k].program_number+'" data-type="program">' + programs[k].title + '</a>' + '</span>' + '<div class="insivia-frmp-list-view-event-bottom insivia-frmp-row">' + '<div class="insivia-frmp-list-view-event-left insivia-col-2">' + '<ul class="insivia-frmp-list-view-event-info-list">' + '<li class="insivia-frmp-list-view-event-info-item">' + '<span class="insivia-frmp-list-view-location-name">' + '<strong>' + programs[k].location_name + '</strong>' + '</span> | ' + '<span class="insivia-frmp-list-view-event-time">' + '<span class="insivia-frmp-list-view-event-start-time">' + start + '</span>' + ' - <span class="insivia-frmp-list-view-event-end-time">' + end + '</span>' + '</span>' + '</li>' + '<li class="insivia-frmp-list-view-event-info-item">' + '<strong><span class="insivia-frmp-list-view-ages">AGE: ' + displayAges + '</span> | ' + '<span class="insivia-frmp-list-view-price">' + displayPrice + '</span></strong>' + '</li>' + '</ul>' + '</div>' + '<div class="insivia-frmp-list-view-event-right insivia-col-2">' + '<div class="insivia-frmp-list-view-content">' + cancellation +trim_string(programs[k].description, 25) + '</div>' + '</div>' + '</div>' + '</li>');
                    }
                  }
                }
              });
            }
          }
          $('.popup-btn').click(function(e) {
            e.preventDefault();
            generate_faux_page( $(this) );
          });
          $('.insivia-frmp-list-view-event-bottom').click(function() {
            var near = $(this).prev('span').children('a');
            generate_faux_page( $(near) );
          });
          check_event_number(); 
        });
      });
    }
    function build_calendar_and_list_view(theMonth, theYear) {
      var calendarBuild = '',
          listViewBuild = '<div id="insivia-frmp-list-view"><div class="insivia-frmp-list-view-filters insivia-frmp-filter"></div><div class="insivia-frmp-list-view-wrapper"><!--<div class="insivia-frmp-list-nav-wrapper insivia-frmp-row"><span class="insivia-frmp-list-nav list-prev"><a href="#">&lt;</a></span><span class="insivia-frmp-list-nav list-next"><a href="#">&gt;</a></span></div>--><ul class="insivia-frmp-list-view-days">',
          formBuild = '',
          daysArray = days_in_month(theMonth, theYear),
          d = 0,
          w = 0,
          m = theMonth,
          nm = theMonth,
          displayMonth = '',
          displayDay,
          todayCSS = '',
          listDay = '';
          
      //Header & Navigation
      calendarBuild += '<div class="insivia-frmp-calendar-header">' +
                        '<div class="insivia-frmp-calendar-nav-wrapper insivia-frmp-row">' +
                        '<span class="insivia-frmp-calendar-nav calendar-prev insivia-col-4"><a href="#"><</a></span>' +
                        '<span class="insivia-frmp-calendar-month insivia-col-2">' + monthsArray[theMonth] + '</span>' +
                        '<span class="insivia-frmp-calendar-nav calendar-next insivia-col-4"><a href="#">></a></span>' +
                        '</div>' +
                        '</header>';
      
      //Days of the week
      calendarBuild += '<div class="insivia-frmp-calendar-days-of-the-week insivia-frmp-row">' +
                        '<div class="insivia-frmp-calendar-' + dotwArray[0].toLowerCase() + ' insivia-frmp-calendar-day-of-the-week insivia-col-7">' + dotwArray[0] + '</div>' +
                        '<div class="insivia-frmp-calendar-' + dotwArray[1].toLowerCase() + ' insivia-frmp-calendar-day-of-the-week insivia-col-7">' + dotwArray[1] + '</div>' +
                        '<div class="insivia-frmp-calendar-' + dotwArray[2].toLowerCase() + ' insivia-frmp-calendar-day-of-the-week insivia-col-7">' + dotwArray[2] + '</div>' +
                        '<div class="insivia-frmp-calendar-' + dotwArray[3].toLowerCase() + ' insivia-frmp-calendar-day-of-the-week insivia-col-7">' + dotwArray[3] + '</div>' +
                        '<div class="insivia-frmp-calendar-' + dotwArray[4].toLowerCase() + ' insivia-frmp-calendar-day-of-the-week insivia-col-7">' + dotwArray[4] + '</div>' +
                        '<div class="insivia-frmp-calendar-' + dotwArray[5].toLowerCase() + ' insivia-frmp-calendar-day-of-the-week insivia-col-7">' + dotwArray[5] + '</div>' +
                        '<div class="insivia-frmp-calendar-' + dotwArray[6].toLowerCase() + ' insivia-frmp-calendar-day-of-the-week insivia-col-7">' + dotwArray[6] + '</div>' +
                        '</div>';
      
      //Rows of days
      calendarBuild += '<div class="insivia-frmp-calendar-days insivia-frmp-row">';
      
      //Start of the week until the first day of the month
      for (var i = 0; i < daysArray[0].getDay(); ++i) {
        calendarBuild += '<div class="insivia-frmp-calendar-' + dotwArray[w].toLowerCase() + ' insivia-frmp-calendar-week-' + i + ' insivia-frmp-calendar-day insivia-frmp-event-day insivia-col-7 inactive"></div>';
        ++w;
      }

      if (w === 0)  w = 0;
      
      //Days of the week in the actual month
      for(var i = 0; i <= daysArray.length; ++i) {
        ++d;
        if( w > (dotwArray.length - 1) ) w = 0;

        //Finish up the week
        if(i == daysArray.length) {
          for(var n = w; n <= (dotwArray.length - 1); ++n) {
            if(n == dotwArray.length || n === 0) break;
            
            calendarBuild += '<div class="insivia-frmp-calendar-' + dotwArray[w].toLowerCase() + ' insivia-frmp-calendar-week-' + i + ' insivia-frmp-calendar-day insivia-frmp-event-day insivia-col-7 inactive"></div>';
          }
          break;
        }
        
        nm = theMonth;
        ++nm;
        
        (nm < 10) ? displayMonth = '0' + nm: displayMonth = nm;
        (d < 10) ? displayDay = '0' + d: displayDay = d;
        (d == today && m == theMonth) ? todayCSS = " today": todayCSS = "";
        
        listDay = new Date(displayMonth+'/'+displayDay+'/'+theYear);
        
        calendarBuild += '<div id="date-' + theYear + '-' + displayMonth + '-' + displayDay + '" class="insivia-frmp-calendar-' + dotwArray[w].toLowerCase() + ' insivia-frmp-calendar-week-' + i + ' insivia-frmp-calendar-day insivia-frmp-event-day insivia-col-7 active' + todayCSS + '"><div class="insivia-frmp-calendar-day-content"><span class="insivia-frmp-row"><span class="insivia-frmp-calendar-date">' + d + '</span></span><ul class="insivia-frmp-calendar-day-events"></ul></div></div>';
        
        listViewBuild += '<li id="list-date-' + theYear + '-' + displayMonth + '-' + displayDay + '" class="insivia-frmp-list-view-' + dotwArray[w].toLowerCase() + ' insivia-frmp-list-view-day insivia-frmp-event-day active' + todayCSS + '"><span class="insivia-frmp-list-view-date"><span class="insivia-frmp-list-view-display-date">' + monthsArray[listDay.getMonth()] + ' ' + displayDay + ', ' + theYear + '</span> <span class="insivia-frmp-list-view-dotw">' + dotwArray[listDay.getDay()] + '</span></span><ul class="insivia-frmp-list-view-event-list"></ul></li>';
        ++w;
      }
      
      listViewBuild += '</ul></div></div>';
      
      formBuild += '<form id="insivia-frmp-calendar-list-view-form" name="insivia-frmp-calendar-list-view-form">' +
                    '<ul class="insivia-frmp-list-view-form-elements insivia-frmp-row">' +
                    '<li class="insivia-frmp-list-view-form-element insivia-col-3">' +
                    '<label class="blue" for="insivia-frmp-list-view-form-element-parks">Parks</label>' +
                    '<select id="insivia-frmp-list-view-form-element-parks" name="insivia-frmp-list-view-form-element-parks" class="insivia-frmp-list-view-form-element-select"><option value="">All</option>';
                    
                    
      formBuild += '</select>' +
                    '</li>' +
                    '<li class="insivia-frmp-list-view-form-element insivia-col-3">' +
                    '<label class="blue" for="insivia-frmp-list-view-form-element-topics">Activities</label>' +
                    '<select id="insivia-frmp-list-view-form-element-topics" name="insivia-frmp-list-view-form-element-topics" class="insivia-frmp-list-view-form-element-select"><option value="">All</option>';


      formBuild += '</select>' +
                    '</li>' +
                    '<li class="insivia-frmp-list-view-form-element insivia-col-3">' +
                    '<label class="blue" for="insivia-frmp-list-view-form-element-experiences">Experiences</label>' +
                    '<select id="insivia-frmp-list-view-form-element-experiences" name="insivia-frmp-list-view-form-element-experiences" class="insivia-frmp-list-view-form-element-select"><option value="">All</option>';
                    
                    
      formBuild += '</select>' +
                    '</li>' +
                    '<li class="insivia-frmp-list-view-form-element insivia-col-3">' +
                    '<label class="blue" for="insivia-frmp-list-view-form-element-series">Series</label>' +
                    '<select id="insivia-frmp-list-view-form-element-series" name="insivia-frmp-list-view-form-element-series" class="insivia-frmp-list-view-form-element-select"><option value="">All</option>';
                                          
      formBuild += '</select>' +
                    '</li>' +
                    '<li class="insivia-frmp-list-view-form-element insivia-col-3">' +
                    '<label class="blue" for="insivia-frmp-list-view-form-element-start-date">Start Date</label>' +
                    '<input id="insivia-frmp-list-view-form-element-start-date" type="text" class="js-datepicker">' +
                    '</li>' +
                    '<li class="insivia-frmp-list-view-form-element insivia-col-3">' +
                    '<label class="blue" for="insivia-frmp-list-view-form-element-end-date">End Date</label>' +
                    '<input id="insivia-frmp-list-view-form-element-end-date" type="text" class="js-datepicker">' +
                    '</li>' +
                    '<li class="insivia-frmp-list-view-form-element insivia-col-3">' +
                    '<label class="blue" for="insivia-frmp-list-view-form-element-search">Search</label>' +
                    '<input id="insivia-frmp-list-view-form-element-search" type="text">' +
                    '</li>' +
                    '<li class="insivia-frmp-list-view-form-element insivia-col-1">' +
                    '<input id="insivia-frmp-list-view-form-element-submit" type="button" value="Submit">' +
                    '<li>' +
                    '</ul>' +
                    '</form>';
      
      //Add it
      $('#insivia-frmp-calendar').html(calendarBuild);
      $('#insivia-frmp-calendar-listview').html(listViewBuild);
      
      if(!$('.more-container').length) {
        $('#insivia-frmp-calendar-listview').append('<div class="more-container"><a>Load more</a></div>');
      }
      
      $('.more-container a').click(function() {   
        
        var url = window.location.href,
            lastDate = $('.insivia-frmp-list-view-days > li'),
            theStartDay;            
            lastDate = $(lastDate[(lastDate.length-1)]).attr('id').replace('list-date-', '');
                        
        if(url.indexOf('?')>-1) {
          url = url.split('?')[1];
          
          if(url.indexOf('parks')>-1) {
            url = url.split('&');
            
            if( (days_in_month( parseInt(lastDate.split('-')[1]), parseInt(lastDate.split('-')[0]) ).length+1) != parseInt(lastDate.split('-')[2]) ) {
              theMonth = parseInt(lastDate.split('-')[1]);
              theStartDay = parseInt(lastDate.split('-')[2])+1;
            } else {
              theMonth = parseInt(lastDate.split('-')[1])+1;
              theStartDay = 1;
              if(theMonth == 12) {
                theMonth = 0;
                ++theYear;
              }
            }
            
            url[4] = 'begin_date='+theYear+'-'+theMonth+'-'+theStartDay;
            url[6] = url[6].split('=')[0]+'='+theYear+'-'+theMonth+'-'+days_in_month( theMonth, theYear ).length;
            url = url.join('&').replace('parks', 'park_id').replace('topics','topic_id').replace('experiences', 'tag_id').replace('series','series_id');
            url = url.replace('undefined', '');
            url = baseUrl+programAPI+'?'+url+'&access_token='+accessToken;
  
            append_new_month(theMonth, theYear, url);
          } else {
            append_new_month(theMonth, theYear);
          }
        } else {
          ++theMonth;
          if(theMonth == 12) {
            theMonth = 0;
            ++theYear;
          }
          append_new_month(theMonth, theYear);
        }
      });
      
      $('#insivia-frmp-calendar-listview .insivia-frmp-list-view-filters').html(formBuild);
      get_options( $('#insivia-frmp-list-view-form-element-parks') , 'parks');
      get_options( $('#insivia-frmp-list-view-form-element-topics') , 'topics');
      get_options( $('#insivia-frmp-list-view-form-element-experiences') , 'experiences');
      get_options( $('#insivia-frmp-list-view-form-element-series') , 'series');
                  
      $.each($('.js-datepicker'), function() {
        $(this).datepicker({
          minDate: 0,
          dateFormat: 'yy-mm-dd'
        });
      });

      $('input[type="button"]').click( function(e) {
        e.preventDefault();
        form_functionality($(this).closest('form'));
      });
    }
    function is_openeings(openings, jsonString, formTitle, title, hasWaitingList) {
      
      if(!openings || !jsonString) return;
            
      var registration_max;
      var popUp2 = '';
      
      console.log(openings);
      
      // Check for openings, assign numerical values to the drop down and build the registration form
      if( typeof openings == 'number' || openings == 'Unlimited' || openings == 'FULL' || openings == 'Waitlist available') {
        if(typeof openings == 'number') {
          registration_max = (openings <= 10) ? openings : 10;
        } else {
          if( openings == 'FULL' ) {
            console.log('FULL');
            if(hasWaitingList) {
              registration_max = 10;
            } else {
              popUp2 += '<div class="registration registration-not-available">' +
                          '<p>Online registration is currently unavailable.</p>' +
                        '</div>';
                        
              return popUp2;
            }
            
          } else {
            //If openings == Unlimited
            registration_max = 10;
          }
        }
        
        // create registration form here
        popUp2 += '<div class="registration">' +
          '<form id="'+slugify(title)+'-registration" method="POST" name="registration-form">';

          if(formTitle) {
            popUp2 += formTitle;
          }

         popUp2 += '<p class="reg-text">Number of Registrants</p>' +
          '<textarea name="access_token" style="display:none;">'+accessToken+'</textarea>'+
          '<input type="hidden" name="session_id" value="'+Cookies.get('program-session-id')+'"/>' +
          '<select class="number_registering">';

          for(var i = 1; i<=registration_max; ++i) {
            popUp2 += '<option value="'+i+'">'+i+'</option>';
          }

        popUp2 += '</select>' +
          '<textarea name="register" style="display:none;">'+jsonString+'</textarea>'+
          '<p class="insivia-frmp-message"><p>'+
          '<p><input type="submit" class="register" value="Register"></input></p>' +
          '</form></div>';
        
      } else {
        switch(openings) {
          case 'Registration closed':
          case 'N/A':
          case 'Program Cancelled':
          case 'Registration not available':
            popUp2 += '<div class="registration registration-not available">' +
                        '<p>Online registration is currently unavailable.</p>' +
                      '</div>';
          break;
        }
      }
      //End Openings
      
      return popUp2;
    }
    function api_call(url, typeOfCall, m, y) {
      var results = '',
          calendarEvents = '',
          calendarListEvents = '',
          pageCount;
          (m || m ==0 ) ? m = m : m = currentMonth;
          (y) ? y = y : y = currentYear;

      //typeOfCall: calendar, facilities, camps
      
      (url) ? url = url : url = baseUrl;
      switch(typeOfCall) { 
        case 'calendar':

          var thisID = '',
              calTarget = '',
              listTarget = '',
              formBuild = '',
              calendarEndDate = new Date(),
              calendarEndDay,
              calendarEndMonth,
              url2 = url;
                            
              if(new Date(y, m) <= new Date() ) {
                if(new Date(y, m).getMonth() == new Date().getMonth()) {
                  var queryYear = new Date().getFullYear();
                  var queryMonth = new Date().getMonth()+1;
                  var queryDate = new Date().getDate();
                  var queryLastDate = new Date(queryYear, queryMonth, 0).getDate()
                  
                  url2 += programAPI+'?begin_date='+queryYear+'-'+queryMonth+'-'+queryDate+'&end_date='+queryYear+'-'+queryMonth+'-'+queryLastDate+'&access_token='+accessToken;
                } else {
                  var start = new Date(y, m);
                  var end = new Date(y, m, 0);
                  url2 += programAPI+'/?access_token='+accessToken;
                }
                // current month
              } else {
                var start = new Date(y, m);
                var end = new Date(y, m, 0);
                url2 += programAPI+'?begin_date='+start.getFullYear()+'-'+(start.getMonth()+1)+'-'+start.getDate()+'&end_date='+start.getFullYear()+'-'+(start.getMonth()+1)+'-'+end.getDate()+'&access_token='+accessToken;
                // any other month
              }

              calendarEndDate = new Date(calendarEndDate.getFullYear() + '/' + (calendarEndDate.getMonth()+4) + '/' + calendarEndDate.getDate());
              calendarEndMonth = ( (calendarEndDate.getMonth()+1) < 10 ) ? '0'+(calendarEndDate.getMonth()+1) : calendarEndDate.getMonth()+1;
              calendarEndDay = ( calendarEndDate.getDate() < 10 ) ? '0'+calendarEndDate.getDate() : calendarEndDate.getDate();
                        
          url = url2;
          build_calendar_and_list_view(m, y);          
          $('.insivia-frmp-calendar-nav, .insivia-frmp-list-nav').click(function(e) {
            e.preventDefault();
            var t_class = $(this).attr('class');
    
            if (t_class.indexOf('next') > -1) {
              ++m;
              if(m == 12) {
                ++y;
                m = 0;
              }

              api_call('', 'calendar', m, y);
            } else {
              --m;
              if (m == -1) {
                --y;
                m = 11;
              }
                            
              api_call('', 'calendar', m, y);
            }
          }); //end click

          $.getJSON(url, function(json) {
            pageCount = json.total_pages;
          }).done(function() {
            
            var promises = [];
            for(var i = 1; i <= pageCount; ++i) {
              var jsonRequest = $.getJSON(url+'&page='+i);
              promises.push( jsonRequest );
            }

            $.when.apply(null, promises).done(function() {
              var programs = [];              
              for( var i = 0; i <= promises.length; ++i) {
                if(promises[i]) {
                  for( var j = 0; j <= promises[i].responseJSON.programs.length; ++j) {
                    if( promises[i].responseJSON.programs[j] ) {
                      programs.push(promises[i].responseJSON.programs[j]);
                    }
                  }
                }
              }
              
              //var browserUrl = window.location.href;
              //console.log(browserUrl);
              
              if( $('.results-for').length ) {
                return;
              }
              
              for(var k = 0; k <= programs.length; ++k) {
                if(programs[k]) {                  
                  var beginDate = programs[k].begin_date,
                      start = to_am_pm(programs[k].start_time),
                      end = to_am_pm(programs[k].end_time),
                      displayAges = (programs[k].age_range.match(/^[0-9]+$/)) ? 'All ages' : programs[k].age_range,
                      displayPrice = (programs[k].prices[0].price == '0.00') ? programs[k].prices[0].description : '$' + programs[k].prices[0].price,
                      series = '',
                      series_color = '',
                      cancellation = '';
                
                  if(programs[k].tags) {
                    for(var l = 0; l <= programs[k].tags.length; ++l) {
                      if(programs[k].tags[l]) {
                        if(programs[k].tags[l].marketing_color) {
                          series_color += ' series-'+programs[k].tags[l].marketing_color;
                        }
                      }
                    }
                  }
                  if (programs[k].series_name) series= '<a href="/programs-events-finder/?parks=&topics=&experiences=&series='+programs[k].series_id+'&start_date=&type=insivia&end_date=" class="insivia-frmp-event-series'+series_color+'">Part of ' + programs[k].series_name + ' series</a>';
                
                  $.each( $('.insivia-frmp-event-day'), function() {
                                        
                    if( $(this).attr('id') ) {
                      if( $(this).attr('id').indexOf( programs[k].begin_date )>-1 ) {
                        
                        if (!$(this).hasClass('hasEvent')) $(this).addClass('hasEvent');
                        var calTarget = 'insivia-frmp-calendar-day';
                        listTarget = 'insivia-frmp-list-view-day';
                        
                        if(programs[k].is_cancelled == 1) {
                          cancellation = '<span class="red">Program Cancelled</span>';
                        }
                        
                        if( $(this).hasClass(calTarget) ) {
                          $(this).find('ul').append('<li id="list-item-' + slugify(programs[k].title) + '" class="insivia-frmp-event"><span class="insivia-frmp-event-title"><a href="#' + slugify(programs[k].title) + '" class="popup-btn" data-api="'+programAPI+'" data-id="'+programs[k].program_number+'" data-type="program">' +cancellation+' '+ programs[k].title + ' </a></span><br/><span class="insivia-frmp-calendar-event-time"><span class="insivia-frmp-calendar-event-start-time">' + start + '</span> - <span class="insivia-frmp-calendar-event-end-time">' + end + '</span></span></li>');
                        } else {
                          $(this).find('ul.insivia-frmp-list-view-event-list').append('<li id="list-item-' + slugify(programs[k].title) + '-'+programs[k].begin_date+'" class="insivia-frmp-event">'+series+'<span class="insivia-frmp-event-title blue">' + '<a href="#' + slugify(programs[k].title) + '" class="popup-btn blue" data-api="'+programAPI+'" data-id="'+programs[k].program_number+'" data-type="program">' + programs[k].title + '</a>' + '</span>' + '<div class="insivia-frmp-list-view-event-bottom insivia-frmp-row">' + '<div class="insivia-frmp-list-view-event-left insivia-col-2">' + '<ul class="insivia-frmp-list-view-event-info-list">' + '<li class="insivia-frmp-list-view-event-info-item">' + '<span class="insivia-frmp-list-view-location-name">' + '<strong>' + programs[k].location_name + '</strong>' + '</span> | ' + '<span class="insivia-frmp-list-view-event-time">' + '<span class="insivia-frmp-list-view-event-start-time">' + start + '</span>' + ' - <span class="insivia-frmp-list-view-event-end-time">' + end + '</span>' + '</span>' + '</li>' + '<li class="insivia-frmp-list-view-event-info-item">' + '<strong><span class="insivia-frmp-list-view-ages">AGE: ' + displayAges + '</span> | ' + '<span class="insivia-frmp-list-view-price">' + displayPrice + '</span></strong>' + '</li>' + '</ul>' + '</div>' + '<div class="insivia-frmp-list-view-event-right insivia-col-2">' + '<div class="insivia-frmp-list-view-content">' + cancellation+' '+trim_string(programs[k].description, 25) + '</div>' + '</div>' + '</div>' + '</li>');
                        }
                      }
                    }
                  });
                }
              }
              $('.popup-btn').click(function(e) {
                e.preventDefault();
                generate_faux_page( $(this) );
              });
              $('.insivia-frmp-list-view-event-bottom').click(function() {
                var near = $(this).prev('span').children('a');
                generate_faux_page( $(near) );
              });
              check_event_number(); 
            });
          });
          break;
        case 'facilities':
          url += facilitiesAPI+'/?access_token='+accessToken;
          google_map(facilitiesAPI, '', 'landing', document.getElementById('insivia-frmp-shelter-map')); //popup-map
          formBuild = '<div class="insivia-frmp-shelter-list-filter insivia-frmp-filter">'+
                        '<form id="insivia-frmp-shelter-filter" name="insivia-frmp-shelter-filter" action="/">'+
                          '<ul class="insivia-frmp-shelter-filter-inputs insivia-frmp-row">'+
                            '<li class="insivia-frmp-shelter-filter-input">'+
                              '<label for="shelter-filter-parks" class="blue">Park</label>'+
                              '<select name="shelter-filter-parks" id="shelter-filter-parks">'+
                              '</select>'+
                            '</li>'+
                            '<li class="insivia-frmp-shelter-filter-input">'+
                              '<label for="shelter-start-date" class="blue">Date</label>'+
                              '<input id="shelter-start-date" type="text" class="js-datepicker"/>'+
                            '</li>'+
                            '<li class="insivia-frmp-shelter-filter-input">'+
                              '<label for="shelter-filter-capacity" class="blue">Capacity</label>'+
                              '<input type="number" id="shelter-filter-capacity" min="0"/>'+
                            '</li>'+
                            '<li class="insivia-frmp-shelter-filter-input form-seperator">- or -</li>'+
                            '<li class="insivia-frmp-shelter-filter-input">'+
                              '<label for="shelter-filter-permits" class="blue">Permit Type</label>'+
                              '<select name="shelter-filter-permits" id="shelter-filter-permits">'+
                              '</select>'+
                            '</li>'+
                          '</ul>'+
                          '<div class="insivia-frmp-shelter-filter-submit">'+
                            '<input type="button" class="btn blue-btn" value="SEARCH"/>'+
                          '</div>'+
                        '</form>'+
                      '</div>';
                      
          $.getJSON(url, function(json) {
            for(var i = 0; i<= json.facilities.length; ++i) {
              if(json.facilities[i]) {
                
                results += '<li id="' + slugify(json.facilities[i].name) + '-shelter-list-item" class="insivia-frmp-list-item">'+
                           '<span class="insivia-frmp-list-item-content insivia-frmp-row">'+                            
                              '<span class="insivia-frmp-list-item-content-left">'+
                                '<p class="insivia-frmp-list-item-name">'+json.facilities[i].name+' at <span class="insivia-frmp-list-item-location">'+json.facilities[i].park_name+'</span></p>';
                    
                    if(json.facilities[i].address.address) {            
                      results += '<p class="insivia-frmp-list-item-address-wrapper">'+
                                  '<span class="insivia-frmp-list-item-address">'+json.facilities[i].address.address+' ';
                                  if(json.facilities[i].address.address2) {
                                    results += '<span class="insivia-frmp-list-item-address-2">'+json.facilities[i].address.address2+'</span> ';
                                  }
                      results += '</span>'+
                                  '<span class="insivia-frmp-list-item-city">'+json.facilities[i].address.city+'</span>, '+
                                  '<span class="insivia-frmp-list-item-state">'+json.facilities[i].address.state+'</span> '+
                                  '<span class="insivia-frmp-list-item-zip">'+json.facilities[i].address.zip+'</span>'+
                                '</p>';
                    } else {
                      results += '<p class="insivia-frmp-list-item-address-wrapper no-children"></p>';
                    }
                                
                      results += '<span class="insivia-frmp-gallery-link"><a href="/gallery'+json.facilities[i].facility_id+'" data-api="'+facilitiesAPI+'" data-id="'+json.facilities[i].facility_id+'" data-type="facility">View gallery</a></span>'+
                              '</span>'+
                              '<span class="insivia-frmp-list-item-content-middle">'+
                                '<span class="insivia-frmp-list-item-list-content-top">'+
                                  '<p class="insivia-frmp-list-item-capacity"><strong>Capacity:</strong> <span class="insivia-frmp-list-item-capacity-value">'+json.facilities[i].capacity+'</span></p>'+
                                '</span>'+
                                '<span class="insivia-frmp-list-item-amenities">'+
                                  '<p><strong>Amenities</strong></p>'+
                                  '<ul class="insivia-frmp-list-item-amenities-list insivia-frmp-row">';
                                    if(json.facilities[i].amenities.length) {
                                      for(var k = 0; k<=json.facilities[i].amenities.length; ++k) {
                                        if(json.facilities[i].amenities[k]) {
                                          
                                          results += '<li class="insivia-frmp-list-item-amenity '+slugify(json.facilities[i].amenities[k].name)+'" data-name="'+json.facilities[i].amenities[k].name+'" title="'+json.facilities[i].amenities[k].name+'"></li>';
                                        }
                                      }
                                    }
                      results += '</ul>'+
                                '</span>'+
                              '</span>'+
                              '<span class="insivia-frmp-list-item-content-right">'+
                                '<p class="insivia-frmp-list-item-view-details-wrapper"><a href="'+json.facilities[i].facility_id+'" class="blue-btn btn interactive-map-listing-btn view-details popup-btn" data-api="'+facilitiesAPI+'" data-id="'+json.facilities[i].facility_id+'" data-type="facility">View details</a></p>'+
                                '<p class="insivia-frmp-list-item-reserve-now-wrapper"><a class="blue-btn btn reserve-now" data-id="'+json.facilities[i].facility_id+'">Reserve now</a></p>'+
                              '</span>'+
                            '</span>'+
                          '</li>';
              }
            }

            $.each($('.reserve-now'), function() {
              $(this).click(function(e) {
                e.preventDefault();
                registration_calendar(currentDate, $(this).attr('data-id'));
              });
            });

          }).done(function() {
            if(window.location.href.indexOf('&type=shelter') == -1) $('#shelter-list-view').html(results);

            $('#insivia-frmp-reserve-shelter .results-for').before(formBuild);
            get_options( $('#shelter-filter-parks') , 'parks', 'facilities');
            get_options( $('#shelter-filter-permits') , 'permits', 'facilities');
            
            $.each($('.js-datepicker'), function() {
              $(this).datepicker({
                minDate: 0,
                dateFormat: 'yy-mm-dd'
              });
            });
                        
            $('.insivia-frmp-gallery-link').click(function(e) {
              e.preventDefault();
              put_to_slide($(this).children('a').attr('data-api'), $(this), $(this).children('a').attr('data-type'), $(this).children('a').attr('data-id'));
            });
            
            $('input[type="button"]').click( function(e) {
              e.preventDefault();
              form_functionality($(this).closest('form'));
            });
            
            $.each($('.reserve-now'), function() {
              $(this).click(function(e) {
                e.preventDefault();
                registration_calendar(currentDate, $(this).attr('data-id'));
              });
            });
            
            $('.view-details').click(function(e) {
              e.preventDefault();
              generate_faux_page( $(this) );
            });
            
          });

          break;
        case 'camps':
          url += facilitiesAPI+'/camping/?access_token='+accessToken;
          google_map(facilitiesAPI, 'camping', 'landing', document.getElementById('insivia-frmp-camping-map')); //popup-map
          formBuild = '<div class="insivia-frmp-camp-list-filter insivia-frmp-filter">'+
                        '<form id="insivia-frmp-camp-filter" name="insivia-frmp-camp-filter" action="/">'+
                          '<ul class="insivia-frmp-camp-filter-inputs insivia-frmp-row">'+
                            '<li class="insivia-frmp-camp-filter-input">'+
                              '<label for="camp-filter-parks" class="blue">Park</label>'+
                              '<select name="camp-filter-parks" id="camp-filter-parks">'+
                                '<option value="">All</option>'+
                                '<option value="286641">Englewood MetroPark</option>'+
                                '<option value="286617">Germantown MetroPark</option>'+
                                '<option value="286674">Possum Creek MetroPark</option>'+
                                '<option value="286591">Twin Creek MetroPark</option>'+
                              '</select>'+
                            '</li>'+
                            '<li class="insivia-frmp-camp-filter-input">'+
                              '<label for="camp-start-date" class="blue">Date</label>'+
                              '<input id="camp-start-date" type="text" class="js-datepicker"/>'+
                            '</li>'+
                            '<li class="insivia-frmp-camp-filter-input">'+
                              '<label for="camp-filter-capacity" class="blue">Capacity</label>'+
                              '<input type="number" id="camp-filter-capacity" min="0"/>'+
                            '</li>'+
                            '<li class="insivia-frmp-camp-filter-input form-seperator">- or -</li>'+
                            '<li class="insivia-frmp-camp-filter-input">'+
                              '<label for="camp-filter-permits" class="blue">Permit Type</label>'+
                              '<select name="camp-filter-permits" id="camp-filter-permits">'+
                              '</select>'+
                            '</li>'+
                          '</ul>'+
                          '<div class="insivia-frmp-camp-filter-submit">'+
                            '<input type="button" class="btn blue-btn" value="SEARCH"/>'+
                          '</div>'+
                        '</form>'+
                      '</div>';
          $.getJSON(url, function(json) {

            for(var i = 0; i<= json.facilities.length; ++i) {
              if(json.facilities[i]) {
                
                results += '<li id="' + slugify(json.facilities[i].name) + '-shelter-list-item" class="insivia-frmp-list-item-item">'+
                           '<span class="insivia-frmp-list-item-content insivia-frmp-row">'+                            
                              '<span class="insivia-frmp-list-item-content-left">'+
                                '<p class="insivia-frmp-list-item-name">'+json.facilities[i].name+' at <span class="insivia-frmp-list-item-location">'+json.facilities[i].park_name+'</span></p>';
                    
                    if(json.facilities[i].address.address) {            
                      results += '<p class="insivia-frmp-list-item-address-wrapper">'+
                                  '<span class="insivia-frmp-list-item-address">'+json.facilities[i].address.address+' ';
                                  if(json.facilities[i].address.address2) {
                                    results += '<span class="insivia-frmp-list-item-address-2">'+json.facilities[i].address.address2+'</span> ';
                                  }
                      results += '</span>'+
                                  '<span class="insivia-frmp-list-item-city">'+json.facilities[i].address.city+'</span>, '+
                                  '<span class="insivia-frmp-list-item-state">'+json.facilities[i].address.state+'</span> '+
                                  '<span class="insivia-frmp-list-item-zip">'+json.facilities[i].address.zip+'</span>'+
                                '</p>';
                    } else {
                      results += '<p class="insivia-frmp-list-item-address-wrapper no-children"></p>';
                    }
                                
                      results += '<span class="insivia-frmp-gallery-link"><a href="/gallery'+json.facilities[i].facility_id+'" data-api="'+facilitiesAPI+'" data-id="'+json.facilities[i].facility_id+'" data-type="facility">View gallery</a></span>'+
                              '</span>'+
                              '<span class="insivia-frmp-list-item-content-middle">'+
                                '<span class="insivia-frmp-list-item-list-content-top">'+
                                  '<p class="insivia-frmp-list-item-capacity"><strong>Capacity:</strong> <span class="insivia-frmp-list-item-capacity-value">'+json.facilities[i].capacity+'</span></p>'+
                                '</span>'+
                                '<span class="insivia-frmp-list-item-amenities">'+
                                  '<p><strong>Amenities</strong></p>'+
                                  '<ul class="insivia-frmp-list-item-amenities-list insivia-frmp-row">';
                                    if(json.facilities[i].amenities.length) {
                                      for(var k = 0; k<=json.facilities[i].amenities.length; ++k) {
                                        if(json.facilities[i].amenities[k]) {
                                          
                                          results += '<li class="insivia-frmp-list-item-amenity '+slugify(json.facilities[i].amenities[k].name)+'" data-name="'+json.facilities[i].amenities[k].name+'" title="'+json.facilities[i].amenities[k].name+'"></li>';
                                        }
                                      }
                                    }
                      results += '</ul>'+
                                '</span>'+
                              '</span>'+
                              '<span class="insivia-frmp-list-item-content-right">'+
                                '<p class="insivia-frmp-list-item-view-details-wrapper"><a href="'+json.facilities[i].facility_id+'" class="blue-btn btn interactive-map-listing-btn view-details popup-btn" data-api="'+facilitiesAPI+'" data-id="'+json.facilities[i].facility_id+'" data-type="camp">View details</a></p>'+
                                '<p class="insivia-frmp-list-item-reserve-now-wrapper"><a class="blue-btn btn reserve-now" data-id="'+json.facilities[i].facility_id+'">Reserve now</a></p>'+
                              '</span>'+
                            '</span>'+
                          '</li>';
              }
            }
            
          }).done(function() {
            if(window.location.href.indexOf('&type=camp') == -1) {
              $('#camping-list-view').html(results);
            }
            $('#insivia-frmp-camping .results-for').before(formBuild);
            get_options( $('#camp-filter-permits') , 'permits', 'camping');

            $.each($('.reserve-now'), function() {
              $(this).click(function(e) {
                e.preventDefault();
                registration_calendar(currentDate, $(this).attr('data-id'));
              });
            });

            $('input[type="button"]').click( function(e) {
              e.preventDefault();
              form_functionality($(this).closest('form'));
            });

            $.each($('.js-datepicker'), function() {
              $(this).datepicker({
                minDate: 0,
                dateFormat: 'yy-mm-dd'                
              });
            });

            $('.insivia-frmp-gallery-link').click(function(e) {
              e.preventDefault();
              put_to_slide($(this).children('a').attr('data-api'), $(this), $(this).children('a').attr('data-type'), $(this).children('a').attr('data-id'));
            });
                
            $('.view-details').click(function(e) {
              e.preventDefault();
              generate_faux_page( $(this) );
            });
            $.each($('.number_registering'), function() {
    
              $(this).on('change', function() {
                var registering = $(this).val();
                
                var targetID = $(this).closest('form').attr('id');
                
                var textArea = $('#'+targetID).children('textarea')[1];
                var jsnString = $(textArea).text();
                var jsnObj = JSON.parse(jsnString);
                jsnObj.register[0].number_registering = registering;
                jsnString = JSON.stringify(jsnObj);
                $(textArea).text(jsnString);
                
              });
            });              
          });
          break;
      }      
    }
    function google_map(api, type, typeOfMap, target, url) {
      
      if(!target) return;
      
      (url) ? url = url : url = '';
      
      if(url == '') { 
        (type == 'camping') ? url = baseUrl + api + '/camping/?access_token=' + accessToken : url = baseUrl + api + '?access_token=' + accessToken;
      }
      
      //typeOfMap = landing, popup
      
      switch(typeOfMap) {
        case 'landing':
          var map = new google.maps.Map(target, {
            center: { lat: 39.715654, lng: -84.191239 },
            zoom: 10,
            scrollwheel: false
          });
          
          
          $.getJSON(url, function(json) {

            for(var i = 0; i <= json.facilities.length; ++i) {
              if(json.facilities[i]) {
                if( json.facilities[i].latitude && json.facilities[i].longitude ) {
                  
                  var img;
                  
                  (type == 'camping') ? img = '/wp-content/plugins/insivia-frmp/_assets/images/camping-marker.png' : img = '/wp-content/plugins/insivia-frmp/_assets/images/shelter-marker.png';
                  
                  var facilityID = json.facilities[i].id;
                  var marker = new google.maps.Marker({
                    position: new google.maps.LatLng(json.facilities[i].latitude, json.facilities[i].longitude),
                    map: map,
                    icon: img,
                    title: json.facilities[i].name,
                    id: facilityID,
                  });
                  marker.addListener('click', function() {
                    
                    if( $('#marker-ghost') ) {
                      
                      (type == 'camping') ? $('body').append('<span id="marker-ghost" data-id="'+$(this)[0].id+'" data-api="facilities" data-type="camp"></span>') : $('body').append('<span id="marker-ghost" data-id="'+$(this)[0].id+'" data-api="facilities" data-type="facility"></span>');

                      generate_faux_page( $('#marker-ghost') );
                    }
                  });
                } else {
                  console.error( json.facilities[i].name + 'is missing: lat: '+json.facilities[i].latitude + ' long:' + json.facilities[i].longitude );
                }
              }
            }
          });

          break;
        case 'popup':
          var address = (target.getAttribute('data-address')) ? target.getAttribute('data-address') : '2581 S Patterson Blvd, Dayton, OH 45409',
              mapOptions = {
                zoom: 14,
                disableDefaultUI: true,
                scrollwheel: false,
                navigationControl: false,
                mapTypeControl: false,
                scaleControl: false,
                draggable: false,
                panCOntrol: false,
                disableDoubleClickZoom: true,
                mapTypeControlOptions: {
                  mapTypeIds: [google.maps.MapTypeId.ROADMAP, 'map_style']
                }
              },
              geocoder = new google.maps.Geocoder();
          geocoder.geocode({
            'address': address
          }, function(results, status) {
            if (status == google.maps.GeocoderStatus.OK) {

              mapOptions.center = results[0].geometry.location;
              var map = new google.maps.Map(target, mapOptions);

              var marker = new google.maps.Marker({
                position: results[0].geometry.location,
                map: map
              });

            } else {
              console.error('The address could not be found for the following reason: ' + status);
            }
          });

          break;
      }

    }
    function generate_pop_up(api, id, type) {
      var popUp = '',
          url = baseUrl,
          previous = document.referrer;
      if(!api||!id) return;
      
      //types = facility, program, camping, results

      switch (type) {
        case 'facility':
        case 'camp':
          (id) ? id=id : console.error('No '+type+' ID assigned');
          url += api + '/' + id + '?access_token=' + accessToken;
          break;
        case 'program':
          (id) ? id=id : console.error('No '+type+' ID assigned');
          
          if(id.match(/[a-zA-Z]/)) {
            url += api + '?program_number=' + id + '&access_token=' + accessToken;
          } else {
            url += api + '/' + id + '?access_token=' + accessToken;
          }
          break;
      }
      console.log(url);
      $.getJSON(url, function(json) {
        if(api == 'programs') {
          if(json.program) {
            if (json.program.length === 0)
              no_results(target, 'popup');
          }
        } else {
          if (json.facility.length === 0)
            no_results(target, 'popup');
        }
        
        switch (type) {
          case 'facility':
          case 'camp':
            var campClass='';
            if(type=='camp') { campClass = ' camp-popup'; }
            
            popUp += '<div class="insivia-frmp-lighbox-popup shelter-popup'+campClass+'" id="'+slugify(json.facility.name)+'" style="display: block;">'+
              '<div class="insivia-frmp-row insivia-frmp-lighbox-popup-top-content">'+
              '<div class="insivia-frmp-lighbox-popup-right-content">'+
              '<div class="insivia-popup-maps-static" style="background: url('+json.facility.maps.map+') center center no-repeat; background-size: cover;"></div>'+
              '</div>'+
              '<div class="insivia-frmp-lighbox-popup-close">X</div>'+
              '</div>'+
              '<div class="insivia-frmp-row insivia-frmp-lighbox-popup-bottom-content">'+
              '<div class="insivia-frmp-lighbox-popup-left-content insivia-col-4">'+
              '<ul>'+
              '<li><span class="insivia-frmp-lighbox-popup-title">'+json.facility.name+'</span><span class="insivia-frmp-lighbox-popup-address">'+json.facility.address.address+'</span>'+json.facility.address.city+', '+json.facility.address.state+' '+json.facility.address.zip+'</li>'+
              '<li><span class="insivia-frmp-lighbox-popup-capacity blue">Capacity</span>'+json.facility.capacity+'</li>'+
              '<li><span class="insivia-frmp-lighbox-popup-parking-spots blue">Parking Spots</span>'+json.facility.parking_spots+'</li>'+
              '<li><span class="insivia-frmp-lighbox-popup-available-permits blue">Available Permits</span>'+
              '<ul class="insivia-frmp-lightbox-popup-permits-list">';

            if(json.facility.permits_available.length) {
              for(var j = 0; j<=json.facility.permits_available.length; ++j) {
                if(json.facility.permits_available[j]) {
                  popUp += '<li id="permit='+json.facility.permits_available[j].id+'" class="insivia-frmp-permit">'+json.facility.permits_available[j].name.split('-')[0]+'</li>';
                }
              }
            }

            popUp += '</ul>'+
              '</li>'+
              '<li><span class="insivia-frmp-lighbox-popup-rental-rates blue">Rental Rates</span>'+
              '<ul class="insivia-frmp-lightbox-popup-rate-list">';

            if(json.facility.rental_rates.rental_rates.length) {
              for(var j = 0; j<=json.facility.rental_rates.rental_rates.length; ++j) {
                if(json.facility.rental_rates.rental_rates[j]) {
                  popUp += '<li><span class="rental-rate-title">'+json.facility.rental_rates.rental_rates[j].name;+'</span></li>';

                  if(json.facility.rental_rates.rental_rates[j].weekday_cost == 'closed') {
                    popUp += '<li><span class="rental-rate">'+json.facility.rental_rates.rental_rates[j].weekday_cost+'</span></li>';
                  } else {
                    popUp += '<li><span class="rental-rate">$'+json.facility.rental_rates.rental_rates[j].weekday_cost.split('.')[0]+' weekdays</span></li>';
                    popUp += '<li><span class="rental-rate">$'+json.facility.rental_rates.rental_rates[j].weekend_cost.split('.')[0]+' weekends</span></li>';
                  }
                }
              }
            }
            if(json.facility.rental_rates.extra_prices) {
              if( type == 'facility' ) {
                popUp += '<li><span class="rental-rate-title"></span>Shelter base fee includes '+json.facility.rental_rates.extra_prices.additional_hours_after+' hours. '+json.facility.rental_rates.extra_prices.description+'</li>';
              }
            }

            popUp += '</ul>'+
              '</li>'+
              '</ul>'+
              '</div>'+
              '<div class="insivia-frmp-lighbox-popup-right-content insivia-col-43">'+
              '<div class="insivia-frmp-lighbox-popup-content-wrapper">'+
              '<h3 class="insivia-frmp-lighbox-popup-title blue">'+json.facility.name+'</h3>'+
              '<div class="insivia-frmp-lighbox-popup-content"><p>'+json.facility.description.replace(/(<([^>]+)>)/ig,"")+'</p></div>'+
              '<div class="insivia-frmp-lightbox-popup-slider">';

            if(json.facility.photos.length) {                
              for(var j = 0; j<= json.facility.photos.length; ++j) {
                if(json.facility.photos[j]) {
                  popUp += '<div class="popup-slider" style="background:url('+json.facility.photos[j].thumbnail+') center center no-repeat; background-size: cover;"></div>';
                }
              }

            }

            popUp += '</div>';
            
            if(json.facility.additional_services && json.facility.additional_services != 'null') {
              popUp += '<div class="insivia-frmp-calendar-lightbox-popup-additional-services"><h3>Additional Services</h3><p>'+json.facility.additional_services+'</p></div>';
            }
            
            popUp += '<p class="insivia-frmp-list-item-reserve-now-wrapper"><a class="btn reserve-now" data-id="'+json.facility.facility_id+'">Reserve now</a></p>' +
              '</div>'+
              '</div>'+
              '</div>'+
              '</div>';

            break;
          case 'program':                    
            var beginDate = (json.program) ? json.program.begin_date : json.programs[0].begin_date,
                title = (json.program) ? json.program.title : json.programs[0].title,
                dotw,
                popDay,
                popMonth,
                locationAddress = (json.program) ? json.program.location_address : json.programs[0].location_address,
                locationName = (json.program) ? json.program.location_name : json.programs[0].location_name,
                parkName = (json.program) ? json.program.park_name : json.programs[0].park_name,
                displayLocation = (locationAddress) ? locationAddress : locationName,
                programNumber = (json.program) ? json.program.program_number : json.programs[0].program_number,
                openings = (json.program) ? json.program.openings : json.programs[0].openings,
                displayOpenings = (openings) ? openings : "Unlimited",
                registerBy = (json.program) ? json.program.register_by : json.programs.register_by,
                contactName = (json.program) ? json.program.contact.name : json.programs[0].contact.name,
                contactPhone = (json.program) ? json.program.contact.phone : json.programs[0].contact.phone,
                contactEmail = (json.program) ? json.program.contact.email : json.programs[0].contact.email,
                seriesName = (json.program) ? json.program.series_name : json.programs[0].series_name,
                seriesID = (json.program) ? json.program.series_id : json.programs[0].series_id,
                price = (json.program) ? json.program.prices[0].price : json.programs[0].prices[0].price;
            var prices;
                if(json.program) {
                  prices = ( json.program.prices.length == 1 ) ? json.program.prices[0].id : json.program.prices;
                } else {
                  prices = ( json.programs[0].prices.length == 1 ) ? json.programs[0].prices[0].id : json.programs[0].prices;
                }
            var priceID = (json.program) ? json.program.prices[0].id : json.programs[0].prices[0].id,
                priceDescription = (json.program) ? json.program.prices[0].description : json.programs[0].prices[0].description,
                startTime = (json.program) ? json.program.start_time : json.programs[0].start_time,
                endTime = (json.program) ? json.program.end_time : json.programs[0].end_time,
                hasWaitingList = (json.program) ? json.program.has_waiting_list : json.programs[0].has_waiting_list,
                ageRange = (json.program) ? json.program.age_range : json.programs[0].age_range,
                displayAges = (ageRange.match(/^[0-9]+$/)) ? 'All ages' : ageRange,
                displayPrice = (price == '0.00') ? priceDescription : '$' + price,
                description = (json.program) ? json.program.description : json.programs[0].description,
                isRegistrationAvailable = (json.program) ? json.program.is_registration_available : json.programs[0].is_registration_available,
                registrationOption = (json.program) ? json.program.registration_option : json.programs[0].registration_option,
                registering,
                jsonString,
                sessionID,
                start = to_am_pm(startTime),
                end = to_am_pm(endTime),
                beginDateArray = beginDate.split('-'),
                series_color = '';
            var cancellation;
                if(json.program) {
                  cancellation = (!json.program.is_cancelled) ? '<span class="red">Cancelled: '+json.program.cancellation_reason+'</span><br/>' : '';
                } else {
                  cancellation = (!json.programs[0].is_cancelled) ? '<span class="red">Cancelled: '+json.programs[0].cancellation_reason+'</span><br/>' : '';
                }
            var weatherDependent;
                if(json.program) {
                  weatherDependent = (json.program.is_weather_dependent !== '0') ? ' Weather Dependent.' : '';
                  //console.log( json.program.is_weather_dependent );
                } else {
                  weatherDependent = (json.programs[0].is_weather_dependent !== '0') ? ' Weather Dependent.' : '';
                  //console.log( json.programs[0].is_weather_dependent !== '0' );
                }
            var urgentMessage;
                if(json.program) {
                  urgentMessage = (json.program.urgent_note_critical) ? '<span class="red">'+json.program.urgent_note+' </span>' : '';
                } else {
                  urgentMessage = (json.programs[0].urgent_note_critical) ? '<span class="red">'+json.programs[0].urgent_note+' </span>' : '';
                }
                                                
            if(beginDateArray[1] < 10) beginDateArray[1] = beginDateArray[1].slice(1);
            if(beginDateArray[2] < 10) beginDateArray[2] = beginDateArray[2].slice(1);
            (displayOpenings == "N/A") ? displayOpenings = "Unlimited": displayOpenings = displayOpenings;
            popDay = new Date(beginDateArray[1]+'/'+beginDateArray[2]+'/'+beginDateArray[0]);
            dotw = dotwArray[popDay.getDay()];
            popMonth = monthsArray[popDay.getMonth()];
            
            popUp += '<div id="' + slugify(title) + '" class="insivia-frmp-lighbox-popup program-popup">' +
              '<div class="insivia-frmp-row insivia-frmp-lighbox-popup-top-content">' +
              '<div class="insivia-frmp-lighbox-popup-left-content insivia-col-4"><div class="insivia-frmp-lighbox-popup-date-wrapper">' +
              '<div class="insivia-frmp-lighbox-popup-dotw">' + dotw + '</div>' +
              '<div class="insivia-frmp-lighbox-popup-date">' + popDay.getDate() + '</div>' +
              '<div class="insivia-frmp-lighbox-popup-month">' + popMonth + '</div>' +
              '</div></div>' +
              '<div class="insivia-frmp-lighbox-popup-right-content insivia-col-43"><div id="popup-map" data-address="' + locationAddress + '"></div></div>' +
              '<div class="insivia-frmp-lighbox-popup-close">X</div>' +
              '</div>' +
              '<div class="insivia-frmp-row insivia-frmp-lighbox-popup-bottom-content">' +
              '<div class="insivia-frmp-lighbox-popup-left-content insivia-col-4">' +
              '<ul>' +
              '<li><span class="insivia-frmp-lighbox-popup-title">' + parkName + '</span><span class="insivia-frmp-lighbox-popup-address">' + displayLocation + '</span></li>' +
              '<li><span class="insivia-frmp-lighbox-popup-program-num blue">Program #</span>' + programNumber + '</li>';
              
            if(hasWaitingList) {  
              popUp += '<li><span class="insivia-frmp-lighbox-popup-openings blue">Openings</span>Waitlist</li>';
            } else {
              popUp += '<li><span class="insivia-frmp-lighbox-popup-openings blue">Openings</span>' + displayOpenings + '</li>';
            }
            
            popUp += '<li><span class="insivia-frmp-lighbox-popup-registration-option blue">Registration Options:</span> '+registrationOption+'</li>';

            if (registerBy) {
              popUp += '<li><span class="insivia-frmp-lighbox-popup-reg-deadline blue">Registration Deadline</span>' + registerBy + '</li>';
            } else {
              popUp += '<li><span class="insivia-frmp-lighbox-popup-reg-deadline blue">Registration Deadline</span>' + beginDate + '</li>';
            }

            if (contactName || contactPhone || contactEmail) {
              popUp += '<li><span class="insivia-frmp-lighbox-popup-contact blue">Contact</span>';
            }

            if (contactName && contactPhone || contactName && contactEmail) {
              popUp += '<span class="insivia-frmp-lighbox-popup-contact-name">' + contactName + '</span>';
            }
            if (contactPhone) {
              popUp += '<span class="insivia-frmp-lighbox-popup-contact-number"><a href="tel:' + contactPhone + '">' + contactPhone + '</a></span>';
            }
            if (contactEmail) {
              popUp += '<span class="insivia-frmp-lighbox-popup-contact-email"><a href="mailto:' + contactEmail + '">' + contactEmail + '</a></span>';
            }
            popUp += '</li>' +
              '</ul>' +
              '</div>' +
              '<div class="insivia-frmp-lighbox-popup-right-content insivia-col-43">' +
              '<div class="insivia-frmp-lighbox-popup-content-wrapper">';
            
            if(json.program) {    
              if(json.program.tags) {
                for(var l = 0; l <= json.program.tags.length; ++l) {
                  if(json.program.tags[l]) {
                    if(json.program.tags[l].marketing_color) {
                      series_color += ' series-'+json.program.tags[l].marketing_color;
                    }
                  }
                }
              }
            } else {
              if(json.programs[0].tags) {
                for(var l = 0; l <= json.programs[0].tags.length; ++l) {
                  if(json.programs[0].tags[l]) {
                    if(json.programs[0].tags[l].marketing_color) {
                      series_color += ' series-'+json.programs[0].tags[l].marketing_color;
                    }
                  }
                }
              }

            }

            if (seriesName) {
              if(json.program) {
                popUp += '<a href="programs-events-finder/?parks=&topics=&experiences=&series='+json.program.series_id+'&start_date=&type=insivia&end_date=" class="insivia-frmp-lighbox-popup-series'+series_color+'">Part of ' + seriesName + ' series</a>';
              } else {
                popUp += '<a href="programs-events-finder/?parks=&topics=&experiences=&series='+json.programs[0].series_id+'&start_date=&type=insivia&end_date=" class="insivia-frmp-lighbox-popup-series'+series_color+'">Part of ' + seriesName + ' series</a>';
              }
            }
                        
            popUp += '<h3 class="insivia-frmp-lighbox-popup-title blue">' + title + '</h3>' +
              '<p><span class="insivia-frmp-lighbox-popup-time"><span class="insivia-frmp-lighbox-popup-start-time">' + start + '</span> - <span class="insivia-frmp-lighbox-popup-end-time">' + end + '</span></span></p>' +
              '<div class="insivia-frmp-lighbox-popup-ages-price"><strong><span class="insivia-frmp-lighbox-popup-ages">AGE: ' + displayAges + '</span> | <span class="insivia-frmp-lighbox-popup-price">' + displayPrice + '</span></strong></div>' +
              '<div class="insivia-frmp-lighbox-popup-content">' + cancellation + urgentMessage + description + weatherDependent+'</div>';

            /*
              
              
              OLD LOGIC
              
              
              */          

            
            /*if(isNaN(isRegistrationAvailable)) {

              if( isRegistrationAvailable.indexOf('0') == -1 ) {
  
                $.each($('.number_registering'), function() {
                  registering = $(this).val();
  
                  if(!registering) {
                    registering = 1;
                  }
  
                });
                
                if( isNaN(prices) ) {                  
                  if( prices.length ) {
                    $.each( prices, function(i, val) {
                      if(prices[i]) {
                        var formTitle = '<h3>'+ prices[i].description +' $'+ prices[i].price +'</h3>';
                        
                        //Multiple Prices         
                        jsonString = '{"register" : [{"price_id" : "'+prices[i].id+'", "number_registering" : "1", "waiting_list":"'+hasWaitingList+'"}]}';
  
                        if(openings) {
                          switch(openings) {
          
                            case 'Unlimited':
          
                              popUp += '<div class="registration registration-unlimited">' +
                                '<form id="'+slugify(title)+'-registration" method="POST" name="registration-form">'+
                                formTitle +
                                '<p class="reg-text">Number of Registrants</p>' +
                                '<textarea name="access_token" style="display:none;">'+accessToken+'</textarea>'+
                                '<input type="hidden" name="session_id" value="'+Cookies.get('program-session-id')+'"/>' +
                                '<select class="number_registering">' +
                                '<option value="1">1</option>' +
                                '<option value="2">2</option>' +
                                '<option value="3">3</option>' +
                                '<option value="4">4</option>' +
                                '<option value="5">5</option>' +
                                '<option value="6">6</option>' +
                                '<option value="7">7</option>' +
                                '<option value="8">8</option>' +
                                '<option value="9">9</option>' +
                                '<option value="10">10</option>' +
                                '</select>' +
                                '<textarea name="register" style="display:none;">'+jsonString+'</textarea>'+
                                '<p class="insivia-frmp-message"><p>'+
                                '<p><input type="submit" class="register" value="Register"></input></p>' +
                                '</form></div>';
          
                              break;
          
                              case 'FULL':
                                
                                if(hasWaitingList) {
                                  var mx = 25;
                                  popUp += '<div class="registration registration-limited">'+
                                    '<form id="'+slugify(title)+'-registration" method="POST" name="registration-form">'+
                                    '<p class="reg-text">Number of Registrants</p>' +
                                    '<textarea name="access_token" style="display:none;">'+accessToken+'</textarea>'+
                                    '<input type="hidden" name="session_id" value="'+Cookies.get('program-session-id')+'"/>' +
                                    '<select class="number_registering" name="number_registering">';
              
                                  for(var i = 1; i<=mx; ++i) {
                                    popUp += '<option value="'+i+'">'+i+'</option>';
                                  }
              
                                  popUp += '</select>' +
                                    '<textarea name="register" style="display:none;">'+jsonString+'</textarea>'+
                                    '<p class="insivia-frmp-message"><p>'+
                                    '<p><input type="submit" class="register" value="Register"></input></p>' +
                                    '</form></div>';
                                    
                                } else {
                                  popUp += '<div class="registration registration-full">' +
                                    '<p>Registration is currently full</p>' +
                                    '</div>';
                                }
                              break;
          
                            default:
                              var mx = parseInt(openings);
                              
                              if( isNaN(mx) ) {
                                mx = 25;
                              }
                              popUp += '<div class="registration registration-limited">'+
                                '<form id="'+slugify(title)+'-registration" method="POST" name="registration-form">'+
                                formTitle +
                                '<p class="reg-text">Number of Registrants</p>' +
                                '<textarea name="access_token" style="display:none;">'+accessToken+'</textarea>'+
                                '<input type="hidden" name="session_id" value="'+Cookies.get('program-session-id')+'"/>' +
                                '<select class="number_registering" name="number_registering">';
          
                              for(var i = 1; i<=mx; ++i) {
                                popUp += '<option value="'+i+'">'+i+'</option>';
                              }
          
                              popUp += '</select>' +
                                '<textarea name="register" style="display:none;">'+jsonString+'</textarea>'+
                                '<p class="insivia-frmp-message"><p>'+
                                '<p><input type="submit" class="register" value="Register"></input></p>' +
                                '</form></div>';
                              break;
                          }
          
                        } else {
          
                          popUp += '<div class="registration registration-unlimited">' +
                            '<form id="'+slugify(title)+'-registration" method="POST" name="registration-form">'+
                            formTitle +
                            '<p class="reg-text">Number of Registrants</p>' +
                            '<textarea name="access_token" style="display:none;">'+accessToken+'</textarea>'+
                            '<input type="hidden" name="session_id" value="'+Cookies.get('program-session-id')+'"/>' +
                            '<select class="number_registering">' +
                            '<option value="1">1</option>' +
                            '<option value="2">2</option>' +
                            '<option value="3">3</option>' +
                            '<option value="4">4</option>' +
                            '<option value="5">5</option>' +
                            '<option value="6">6</option>' +
                            '<option value="7">7</option>' +
                            '<option value="8">8</option>' +
                            '<option value="9">9</option>' +
                            '<option value="10">10</option>' +
                            '</select>' +
                            '<textarea name="register" style="display:none;">'+jsonString+'</textarea>'+
                            '<p class="insivia-frmp-message"><p>'+
                            '<p><input type="submit" class="register" value="Register"></input></p>' +
                            '</form></div>';
                        }
                      }
                    });
                    
                  }
                  
                } else {

                  //One Price
                  jsonString = '{"register" : [{"price_id" : "'+priceID+'", "number_registering" : "1", "waiting_list":"'+hasWaitingList+'"}]}';
    
                  if(openings) {
                    switch(openings) {
    
                      case 'Unlimited':
    
                        popUp += '<div class="registration registration-unlimited">' +
                          '<form id="'+slugify(title)+'-registration" method="POST" name="registration-form">'+
                          '<p class="reg-text">Number of Registrants</p>' +
                          '<textarea name="access_token" style="display:none;">'+accessToken+'</textarea>'+
                          '<input type="hidden" name="session_id" value="'+Cookies.get('program-session-id')+'"/>' +
                          '<select class="number_registering">' +
                          '<option value="1">1</option>' +
                          '<option value="2">2</option>' +
                          '<option value="3">3</option>' +
                          '<option value="4">4</option>' +
                          '<option value="5">5</option>' +
                          '<option value="6">6</option>' +
                          '<option value="7">7</option>' +
                          '<option value="8">8</option>' +
                          '<option value="9">9</option>' +
                          '<option value="10">10</option>' +
                          '</select>' +
                          '<textarea name="register" style="display:none;">'+jsonString+'</textarea>'+
                          '<p class="insivia-frmp-message"><p>'+
                          '<p><input type="submit" class="register" value="Register"></input></p>' +
                          '</form></div>';
    
                        break;
    
                        case 'FULL':
                          
                          if(hasWaitingList) {
                            var mx = 25;
                            popUp += '<div class="registration registration-limited">'+
                              '<form id="'+slugify(title)+'-registration" method="POST" name="registration-form">'+
                              '<p class="reg-text">Number of Registrants</p>' +
                              '<textarea name="access_token" style="display:none;">'+accessToken+'</textarea>'+
                              '<input type="hidden" name="session_id" value="'+Cookies.get('program-session-id')+'"/>' +
                              '<select class="number_registering" name="number_registering">';
        
                            for(var i = 1; i<=mx; ++i) {
                              popUp += '<option value="'+i+'">'+i+'</option>';
                            }
        
                            popUp += '</select>' +
                              '<textarea name="register" style="display:none;">'+jsonString+'</textarea>'+
                              '<p class="insivia-frmp-message"><p>'+
                              '<p><input type="submit" class="register" value="Register"></input></p>' +
                              '</form></div>';
                              
                          } else {
                            popUp += '<div class="registration registration-full">' +
                              '<p>Registration is currently full</p>' +
                              '</div>';
                          }

                        break;
    
                      default:
                        var mx = parseInt(openings);
                        
                        if( isNaN(mx) ) {
                          mx = 25;
                        }
                        popUp += '<div class="registration registration-limited">'+
                          '<form id="'+slugify(title)+'-registration" method="POST" name="registration-form">'+
                          '<p class="reg-text">Number of Registrants</p>' +
                          '<textarea name="access_token" style="display:none;">'+accessToken+'</textarea>'+
                          '<input type="hidden" name="session_id" value="'+Cookies.get('program-session-id')+'"/>' +
                          '<select class="number_registering" name="number_registering">';
    
                        for(var i = 1; i<=mx; ++i) {
                          popUp += '<option value="'+i+'">'+i+'</option>';
                        }
    
                        popUp += '</select>' +
                          '<textarea name="register" style="display:none;">'+jsonString+'</textarea>'+
                          '<p class="insivia-frmp-message"><p>'+
                          '<p><input type="submit" class="register" value="Register"></input></p>' +
                          '</form></div>';
                        break;
                    }
    
                  } else {
    
                    popUp += '<div class="registration registration-unlimited">' +
                      '<form id="'+slugify(title)+'-registration" method="POST" name="registration-form">'+
                      '<p class="reg-text">Number of Registrants</p>' +
                      '<textarea name="access_token" style="display:none;">'+accessToken+'</textarea>'+
                      '<input type="hidden" name="session_id" value="'+Cookies.get('program-session-id')+'"/>' +
                      '<select class="number_registering">' +
                      '<option value="1">1</option>' +
                      '<option value="2">2</option>' +
                      '<option value="3">3</option>' +
                      '<option value="4">4</option>' +
                      '<option value="5">5</option>' +
                      '<option value="6">6</option>' +
                      '<option value="7">7</option>' +
                      '<option value="8">8</option>' +
                      '<option value="9">9</option>' +
                      '<option value="10">10</option>' +
                      '</select>' +
                      '<textarea name="register" style="display:none;">'+jsonString+'</textarea>'+
                      '<p class="insivia-frmp-message"><p>'+
                      '<p><input type="submit" class="register" value="Register"></input></p>' +
                      '</form></div>';
                  }
                }
              }

            } else {
              
              if( isRegistrationAvailable !== 0 ) {
  
                $.each($('.number_registering'), function() {
                  registering = $(this).val();
  
                  if(!registering) {
                    registering = 1;
                  }
  
                });
                
                if( isNaN(prices) ) {                  
                  if( prices.length ) {
                    $.each( prices, function(i, val) {
                      if(prices[i]) {
                        var formTitle = '<h3>'+ prices[i].description +' $'+ prices[i].price +'</h3>';
                        
                        //Multiple Prices         
                        jsonString = '{"register" : [{"price_id" : "'+prices[i].id+'", "number_registering" : "1", "waiting_list":"'+hasWaitingList+'"}]}';
  
                        if(openings) {
                          switch(openings) {
          
                            case 'Unlimited':
          
                              popUp += '<div class="registration registration-unlimited">' +
                                '<form id="'+slugify(title)+'-registration" method="POST" name="registration-form">'+
                                formTitle +
                                '<p class="reg-text">Number of Registrants</p>' +
                                '<textarea name="access_token" style="display:none;">'+accessToken+'</textarea>'+
                                '<input type="hidden" name="session_id" value="'+Cookies.get('program-session-id')+'"/>' +
                                '<select class="number_registering">' +
                                '<option value="1">1</option>' +
                                '<option value="2">2</option>' +
                                '<option value="3">3</option>' +
                                '<option value="4">4</option>' +
                                '<option value="5">5</option>' +
                                '<option value="6">6</option>' +
                                '<option value="7">7</option>' +
                                '<option value="8">8</option>' +
                                '<option value="9">9</option>' +
                                '<option value="10">10</option>' +
                                '</select>' +
                                '<textarea name="register" style="display:none;">'+jsonString+'</textarea>'+
                                '<p class="insivia-frmp-message"><p>'+
                                '<p><input type="submit" class="register" value="Register"></input></p>' +
                                '</form></div>';
          
                              break;
          
                              case 'FULL':
                                
                                if(hasWaitingList) {
                                  var mx = 25;
                                  popUp += '<div class="registration registration-limited">'+
                                    '<form id="'+slugify(title)+'-registration" method="POST" name="registration-form">'+
                                    '<p class="reg-text">Number of Registrants</p>' +
                                    '<textarea name="access_token" style="display:none;">'+accessToken+'</textarea>'+
                                    '<input type="hidden" name="session_id" value="'+Cookies.get('program-session-id')+'"/>' +
                                    '<select class="number_registering" name="number_registering">';
              
                                  for(var i = 1; i<=mx; ++i) {
                                    popUp += '<option value="'+i+'">'+i+'</option>';
                                  }
              
                                  popUp += '</select>' +
                                    '<textarea name="register" style="display:none;">'+jsonString+'</textarea>'+
                                    '<p class="insivia-frmp-message"><p>'+
                                    '<p><input type="submit" class="register" value="Register"></input></p>' +
                                    '</form></div>';
                                    
                                } else {
                                  popUp += '<div class="registration registration-full">' +
                                    '<p>Registration is currently full</p>' +
                                    '</div>';
                                }
          
                              break;
          
                            default:
                              var mx = parseInt(openings);
                              
                              if( isNaN(mx) ) {
                                mx = 25;
                              }
                              
                              
                              popUp += '<div class="registration registration-limited">'+
                                '<form id="'+slugify(title)+'-registration" method="POST" name="registration-form">'+
                                formTitle +
                                '<p class="reg-text">Number of Registrants</p>' +
                                '<textarea name="access_token" style="display:none;">'+accessToken+'</textarea>'+
                                '<input type="hidden" name="session_id" value="'+Cookies.get('program-session-id')+'"/>' +
                                '<select class="number_registering" name="number_registering">';
          
                              for(var i = 1; i<=mx; ++i) {
                                popUp += '<option value="'+i+'">'+i+'</option>';
                              }
          
                              popUp += '</select>' +
                                '<textarea name="register" style="display:none;">'+jsonString+'</textarea>'+
                                '<p class="insivia-frmp-message"><p>'+
                                '<p><input type="submit" class="register" value="Register"></input></p>' +
                                '</form></div>';
                              break;
                          }
          
                        } else {
          
                          popUp += '<div class="registration registration-unlimited">' +
                            '<form id="'+slugify(title)+'-registration" method="POST" name="registration-form">'+
                            formTitle +
                            '<p class="reg-text">Number of Registrants</p>' +
                            '<textarea name="access_token" style="display:none;">'+accessToken+'</textarea>'+
                            '<input type="hidden" name="session_id" value="'+Cookies.get('program-session-id')+'"/>' +
                            '<select class="number_registering">' +
                            '<option value="1">1</option>' +
                            '<option value="2">2</option>' +
                            '<option value="3">3</option>' +
                            '<option value="4">4</option>' +
                            '<option value="5">5</option>' +
                            '<option value="6">6</option>' +
                            '<option value="7">7</option>' +
                            '<option value="8">8</option>' +
                            '<option value="9">9</option>' +
                            '<option value="10">10</option>' +
                            '</select>' +
                            '<textarea name="register" style="display:none;">'+jsonString+'</textarea>'+
                            '<p class="insivia-frmp-message"><p>'+
                            '<p><input type="submit" class="register" value="Register"></input></p>' +
                            '</form></div>';
                        }
                      }
                    });
                    
                  }
                  
                } else {
                  
                  //One Price
                  jsonString = '{"register" : [{"price_id" : "'+priceID+'", "number_registering" : "1", "waiting_list":"'+hasWaitingList+'"}]}';
    
                  if(openings) {
                    switch(openings) {
    
                      case 'Unlimited':
    
                        popUp += '<div class="registration registration-unlimited">' +
                          '<form id="'+slugify(title)+'-registration" method="POST" name="registration-form">'+
                          '<p class="reg-text">Number of Registrants</p>' +
                          '<textarea name="access_token" style="display:none;">'+accessToken+'</textarea>'+
                          '<input type="hidden" name="session_id" value="'+Cookies.get('program-session-id')+'"/>' +
                          '<select class="number_registering">' +
                          '<option value="1">1</option>' +
                          '<option value="2">2</option>' +
                          '<option value="3">3</option>' +
                          '<option value="4">4</option>' +
                          '<option value="5">5</option>' +
                          '<option value="6">6</option>' +
                          '<option value="7">7</option>' +
                          '<option value="8">8</option>' +
                          '<option value="9">9</option>' +
                          '<option value="10">10</option>' +
                          '</select>' +
                          '<textarea name="register" style="display:none;">'+jsonString+'</textarea>'+
                          '<p class="insivia-frmp-message"><p>'+
                          '<p><input type="submit" class="register" value="Register"></input></p>' +
                          '</form></div>';
    
                        break;
    
                      case 'FULL':
                        
                        if(hasWaitingList) {
                          var mx = 25;
                          popUp += '<div class="registration registration-limited">'+
                            '<form id="'+slugify(title)+'-registration" method="POST" name="registration-form">'+
                            '<p class="reg-text">Number of Registrants</p>' +
                            '<textarea name="access_token" style="display:none;">'+accessToken+'</textarea>'+
                            '<input type="hidden" name="session_id" value="'+Cookies.get('program-session-id')+'"/>' +
                            '<select class="number_registering" name="number_registering">';
      
                          for(var i = 1; i<=mx; ++i) {
                            popUp += '<option value="'+i+'">'+i+'</option>';
                          }
      
                          popUp += '</select>' +
                            '<textarea name="register" style="display:none;">'+jsonString+'</textarea>'+
                            '<p class="insivia-frmp-message"><p>'+
                            '<p><input type="submit" class="register" value="Register"></input></p>' +
                            '</form></div>';
                            
                        } else {
                          popUp += '<div class="registration registration-full">' +
                            '<p>Registration is currently full</p>' +
                            '</div>';
                        }
    
                        break;
    
                      default:
                        var mx = parseInt(openings);
                        
                        if( isNaN(mx) ) {
                          mx = 25;
                        }
                        popUp += '<div class="registration registration-limited">'+
                          '<form id="'+slugify(title)+'-registration" method="POST" name="registration-form">'+
                          '<p class="reg-text">Number of Registrants</p>' +
                          '<textarea name="access_token" style="display:none;">'+accessToken+'</textarea>'+
                          '<input type="hidden" name="session_id" value="'+Cookies.get('program-session-id')+'"/>' +
                          '<select class="number_registering" name="number_registering">';
    
                        for(var i = 1; i<=mx; ++i) {
                          popUp += '<option value="'+i+'">'+i+'</option>';
                        }
    
                        popUp += '</select>' +
                          '<textarea name="register" style="display:none;">'+jsonString+'</textarea>'+
                          '<p class="insivia-frmp-message"><p>'+
                          '<p><input type="submit" class="register" value="Register"></input></p>' +
                          '</form></div>';
                        break;
                    }
    
                  } else {
    
                    popUp += '<div class="registration registration-unlimited">' +
                      '<form id="'+slugify(title)+'-registration" method="POST" name="registration-form">'+
                      '<p class="reg-text">Number of Registrants</p>' +
                      '<textarea name="access_token" style="display:none;">'+accessToken+'</textarea>'+
                      '<input type="hidden" name="session_id" value="'+Cookies.get('program-session-id')+'"/>' +
                      '<select class="number_registering">' +
                      '<option value="1">1</option>' +
                      '<option value="2">2</option>' +
                      '<option value="3">3</option>' +
                      '<option value="4">4</option>' +
                      '<option value="5">5</option>' +
                      '<option value="6">6</option>' +
                      '<option value="7">7</option>' +
                      '<option value="8">8</option>' +
                      '<option value="9">9</option>' +
                      '<option value="10">10</option>' +
                      '</select>' +
                      '<textarea name="register" style="display:none;">'+jsonString+'</textarea>'+
                      '<p class="insivia-frmp-message"><p>'+
                      '<p><input type="submit" class="register" value="Register"></input></p>' +
                      '</form></div>';
                  }
                }
              }
              
              
            }*/
            
            
            /*
              
              
              NEW LOGIC
              
              
              */          

            isRegistrationAvailable = parseInt(isRegistrationAvailable, 10);
            var formTitle;
                        
            if(isRegistrationAvailable) {
              console.log('Registration is available');
                            
              if($('.number_registering').length) {
                //Drop down for number of registrants
                
                $.each($('.number_registering'), function() {
                  registering = $(this).val();
  
                  if(!registering) {
                    registering = 1;
                  }
                });
              }
              
              //set up price information
              if(typeof prices == 'object') {
                if( prices.length ) {
                  $.each( prices, function(i, val){
                    if(prices[i]) {
                      formTitle = '<h3>'+ prices[i].description +' $'+ prices[i].price +'</h3>';
                      jsonString = '{"register" : [{"price_id" : "'+prices[i].id+'", "number_registering" : "1", "waiting_list":"'+hasWaitingList+'"}]}';
                      
                      popUp += is_openeings(openings, jsonString, formTitle, title, hasWaitingList);
                    }
                    
                  });
                }
              } else {
                jsonString = '{"register" : [{"price_id" : "'+priceID+'", "number_registering" : "1", "waiting_list":"'+hasWaitingList+'"}]}';
                popUp += is_openeings(openings, jsonString, formTitle, title, hasWaitingList);
              }
              
            } else {
              console.log('No registration available');

              if(typeof prices == 'object') {
                if( prices.length ) {
                  $.each( prices, function(i, val){
                    if(prices[i]) {
                      formTitle = '<h3>'+ prices[i].description +' $'+ prices[i].price +'</h3>';
                      jsonString = '{"register" : [{"price_id" : "'+prices[i].id+'", "number_registering" : "1", "waiting_list":"'+hasWaitingList+'"}]}';
                      
                      popUp += is_openeings(openings, jsonString, formTitle, title, hasWaitingList);
                    }
                    
                  });
                }
              } else {
                jsonString = '{"register" : [{"price_id" : "'+priceID+'", "number_registering" : "1", "waiting_list":"'+hasWaitingList+'"}]}';
                popUp += is_openeings(openings, jsonString, formTitle, title, hasWaitingList);
              }
            }


            popUp += '</div>' +
              '</div>' +
              '</div>' +
              '</div>';

            break;
          default:
            break;
        }
      $.each($('.reserve-now'), function() {
        $(this).click(function(e) {
          e.preventDefault();
          registration_calendar(currentDate, $(this).attr('data-id'));
        });
      });

      }).done(function() {
        var previous = document.referrer;
        
        $('.insivia-frmp-lighbox').html('');
        $('.insivia-frmp-lighbox').html(popUp).fadeIn(800).queue(function() {
          $.each($('.reserve-now'), function() {
            $(this).click(function(e) {
              e.preventDefault();
              registration_calendar(currentDate, $(this).attr('data-id'));
            });
          });
          $.each($('.insivia-frmp-lighbox-popup-close'),function() {
            $(this).click(function() {
              ( previous.indexOf('?parks')>-1) ? window.open(previous, '_self') : $('.insivia-frmp-lighbox').stop().fadeOut();
            });
          });

            $.each($('.registration form .register'), function() {
              
              $(this).click(function(e){
                e.preventDefault();

                var formID = $(this).closest('form');
                eventRegister(formID);
              });
                            
            });

        });

        $.each($('.number_registering'), function() {
          $(this).on('change', function() {
            var registering = $(this).val();
            var targetID = $(this).closest('form').attr('id');            
            var textArea = $('#'+targetID).children('textarea')[1];
            var jsnString = $(textArea).text();
            var jsnObj = JSON.parse(jsnString);
            jsnObj.register[0].number_registering = registering;
            jsnString = JSON.stringify(jsnObj);
            $(textArea).text(jsnString);
          });
        });              

        if( $('.insivia-frmp-lightbox-popup-slider').length !== 0 ) {
          $('.insivia-frmp-lightbox-popup-slider').slick({
            dots: true,
            autoplay: true
          });
        }
        
        if(type == 'program') google_map(api, type, 'popup', document.getElementById('popup-map')); //popup-map
      });     
    }
    function eventRegister(trgt) {
      
      if(!trgt) return;
      
      var url = 'https://reservations.metroparks.org/api/v1/programs/register';
            
      $.ajax({
        type: 'POST',
        url: url,
        crossDomain: true,
        processData: false,
        dataType: false,
        data: trgt.serialize(),
        success: function(data) {
          if(data.result == 'success') {
            Cookies.set('program-cart-count', data.cart.length);
            Cookies.set('checkout', data.Checkout);
            Cookies.set('view-cart', data.View_Cart);
            Cookies.set('clear-cart', data.Clear_Cart);
            Cookies.set('program-session-id', data.queryParameters.session_id);
            Cookies.set('cart-type', 'program');
            
            var cookiep = (Cookies.get('program-cart-count') == 'undefined') ? Cookies.get('program-cart-count') : 0;
            var cookier = (Cookies.get('reservation-cart-count') == 'undefined') ? Cookies.get('reservation-cart-count') : 0;
            var previous = document.referrer;
            
            var cart_count = parseInt(cookiep) + parseInt(cookier);
            $('.header-cart-area').addClass('show').attr('data-cart', '/cart/');
            $('.shopping-cart-number').html(data.cart.length);
            
            $('.insivia-frmp-message').html('<p>Item has been added to your cart. <a class="insivia-frmp-lighbox-popup-close">Continue browsing</a> <a href="/cart/">View Cart</a></p>').addClass('green'); 
            $('.register, .number_registering, .reg-text').hide();
            $.each($('.insivia-frmp-lighbox-popup-close'),function() {
              $(this).click(function() {
                ( previous.indexOf('?parks')>-1) ? window.open(previous, '_self') : $('.insivia-frmp-lighbox').stop().fadeOut(800);
              });
            });
          }
        },
        error: function( jqXHR, textStatus, errorThrown ) {
          if(errorThrown ==  'Conflict') $('.insivia-frmp-message').html('This event is currently full.').addClass('red');
        }
      });
      
    }
    function generate_faux_page(target, query) {
      var pageUrl = window.location.href,
          urlQuery = '',
          thisApi = '',
          thisType = '',
          thisID = '';
          
      var pageUrl2 = window.location.href+'&program_number=Q373&=something=something-else'

      if(pageUrl.indexOf('?')>-1) {

        //Check url
        if(pageUrl.indexOf('jmid')>-1 || pageUrl.indexOf('utm')>-1 || pageUrl.indexOf('?s=')>-1) {
          return;
        }

        urlQuery = pageUrl.split('?');
        if(urlQuery[1].indexOf('&')>-1) {
          urlQuery = urlQuery[1].split('&');
          (urlQuery.length <=3) ? generate_pop_up(urlQuery[1].split('=')[1], urlQuery[0].split('=')[1], urlQuery[2].split('=')[1]) : form_results(urlQuery);
        }
      }
      
      if(target){
        // Check if it was a click
        thisApi = target.attr('data-api');
        thisID = target.attr('data-id');
        thisType = target.attr('data-type');
        
        if(window.location.href.indexOf('?')>-1) window.open(window.location.href.split('?')[0]+'?id='+thisID+'&api='+thisApi+'&type='+thisType, '_self');
                
        switch(thisType) {
          case 'program':
            window.open(window.location.origin+'/programs-events-finder/'+'?program_number='+thisID+'&api='+thisApi+'&type='+thisType, '_self');
            break;
          case 'facility':
            window.open(window.location.origin+'/rentals-permits/reserve-a-shelter/'+'?id='+thisID+'&api='+thisApi+'&type='+thisType, '_self');
            break;
          case 'camp':
            window.open(window.location.origin+'/rentals-permits/reserve-a-campsite/'+'?id='+thisID+'&api='+thisApi+'&type='+thisType, '_self');
            break;
        }
      }
    }
    function form_results(query) {
      var url,
          type,
          results = '',
          resultsFor = $('results-for'),
          resultsForString = '<p><span>Results for: </span>',
          promises = [],
          page,
          newURL,
          sameDay = [],
          start, end, displayAges, displayPrice, series = '', seriesColor = '', eventDay, beginDateArray, newDay, displayMonthValue, displayDateValue, idBuild, cleanDay, cancellation;
                        
      query = query.join('&');
            
      /**
        * Remove the API required query and build the API URL
        **/
        
      if( query.indexOf('shelter')>-1 ) {
        //facilities
        type = 'facilities';
        query = '?'+query.replace('&type=shelter', '').replace('parks', 'park_id')+'&access_token='+accessToken;
        
        //create API URL
        if( query.indexOf('permits=&') == -1 ) {
          query = query.split('&');
          //if has permits
          for(var i = 0; i <= query.length; ++i) {
            if(query[i].indexOf('permits')>-1) {
              url = baseUrl+facilitiesAPI+'/permits/'+query[i].split('=')[1]+'?access_token='+accessToken;
              break;
            }
          }
        } else {
          //if has no permits
          url = baseUrl+facilitiesAPI+query;
        }
      } else if( query.indexOf('camp')>-1 ) {
         // camping
        type = 'camping';
        query = '?'+query.replace('&type=camp', '').replace('parks', 'park_id')+'&access_token='+accessToken;
        
        //create API URL
        if( query.indexOf('permits=&') == -1 ) {
          query = query.split('&');
          //if has permits
          for(var i = 0; i <= query.length; ++i) {
            if(query[i].indexOf('permits')>-1) {
              url = baseUrl+facilitiesAPI+'/camping//permits/'+query[i].split('=')[1]+'?access_token='+accessToken;
              break;
            }
          }
        } else {
          //if has no permits
          url = baseUrl+facilitiesAPI+'/camping/'+query;
        }
      } else {
        //programs
        type = 'programs';
        query = '?'+query.replace('&type=insivia', '').replace('parks', 'park_id').replace('topics', 'topic_id').replace('series', 'series_id').replace('start_date', 'begin_date').replace('experiences', 'tag_id')+'&access_token='+accessToken;
        url = baseUrl+programAPI+query;
      }//end build API URL
      
      /**
        * JSON API Request
        **/          
      if( url.indexOf('series_id=0000') >-1 ) {
        // All Conservation Kids Results
        promises.push( $.getJSON( baseUrl+programAPI+'/series/102?access_token='+accessToken ) );
        promises.push( $.getJSON( baseUrl+programAPI+'/series/85?access_token='+accessToken ) );
        promises.push( $.getJSON( baseUrl+programAPI+'/series/82?access_token='+accessToken ) );
        promises.push( $.getJSON( baseUrl+programAPI+'/series/88?access_token='+accessToken ) );
        
        $.when.apply(null, promises).done(function() {              
          
          var programs = [];              
          for( var i = 0; i <= promises.length; ++i) {
            if(promises[i]) {
              for( var j = 0; j <= promises[i].responseJSON.programs.length; ++j) {
                if( promises[i].responseJSON.programs[j] ) {
                  programs.push(promises[i].responseJSON.programs[j]);
                }
              }
            }
          }

          $('.insivia-frmp-list-view-days').html('').wrap('<div class="series-information"></div>').before('<h4 class="series-title">Conservation Kids Series</h4><p class="series-description">This series nurtures kids\' desire to explore nature and empowers them to speak out for the planet they will soon inherit. Watch as your child grows closer to nature, develops leadership skills and works with peers to protect Montgomery County\'s ecology. By completing programs in each of the three levels of this series, your child also will receive a special MetroParks Conservation Kids hoodie. Visit metroparks.org/kids.</p>');

          for(var k = 0; k <= programs.length; ++k) {
            if(programs[k]) {
              var beginDate = programs[k].begin_date,
                  start = to_am_pm(programs[k].start_time),
                  end = to_am_pm(programs[k].end_time),
                  displayAges = (programs[k].age_range.match(/^[0-9]+$/)) ? 'All ages' : programs[k].age_range,
                  displayPrice = (programs[k].prices[0].price == '0.00') ? programs[k].prices[0].description : '$' + programs[k].prices[0].price,
                  series = '',
                  series_color = '',
                  eventDay = new Date(programs[k].begin_date),
                  eventDotw = dotwArray[eventDay.getDay()],
                  eventMonth = monthsArray[eventDay.getMonth()];
                  
              if(programs[k].tags[0]) {
                for(var l = 0; l <= programs[k].tags.length; ++l) {
                  if(programs[k].tags[l]) {
                    if(programs[k].tags[l].marketing_color) {
                      series_color += ' series-'+programs[k].tags[l].marketing_color;
                    }
                  }
                }
              }
              if (programs[k].series_name) {
                series= '<a href="/programs-events-finder/?parks=&topics=&experiences=&series='+programs[k].series_id+'&start_date=&type=insivia&end_date=" class="insivia-frmp-event-series series-'+programs[k].series_id+'-link '+series_color+'">Part of ' + programs[k].series_name + ' series</a>';
                //console.log(programs[k].series_name+' '+series_color);
              }
              
              var beginDateArray = programs[k].begin_date.split('-'),
                  newDay = new Date(beginDateArray[1] + '/' + beginDateArray[2] + '/' + beginDateArray[0]),
                  displayMonthValue = ( (newDay.getMonth()+1) < 10 ) ? 0+''+(newDay.getMonth()+1) : (newDay.getMonth()+1),
                  displayDateValue = ( (newDay.getDate()) < 10 ) ? 0+''+newDay.getDate() : newDay.getDate(),
                  idBuild = newDay.getFullYear()+'-'+displayMonthValue+'-'+displayDateValue;
                  
                  var dayOfTheWeek = (dotwArray[(eventDay.getDay()+1)]) ? dotwArray[(eventDay.getDay()+1)] : 'Sunday';
                                                          
              if( !$('.insivia-frmp-list-view-days').children().length ) {
                $('.insivia-frmp-list-view-days').append('<li id="list-date-' + idBuild+'" class="series-'+programs[k].series_id+' insivia-frmp-list-view-' + dayOfTheWeek.toLowerCase() + ' insivia-frmp-list-view-day insivia-frmp-event-day active hasEvent"><span class="insivia-frmp-list-view-date"><span class="insivia-frmp-list-view-display-date">' + monthsArray[newDay.getMonth()] + ' ' + newDay.getDate() + ', ' + newDay.getFullYear() + '</span> <span class="insivia-frmp-list-view-dotw">' + dayOfTheWeek + '</span></span><ul class="insivia-frmp-list-view-event-list"></ul></li>');
              } else {
                if($('#list-date-' + idBuild).length === 0) {
                  $('.insivia-frmp-list-view-days').append('<li id="list-date-' + idBuild+'" class="insivia-frmp-list-view-' + dayOfTheWeek.toLowerCase() + ' insivia-frmp-list-view-day insivia-frmp-event-day active hasEvent"><span class="insivia-frmp-list-view-date"><span class="insivia-frmp-list-view-display-date">' + monthsArray[newDay.getMonth()] + ' ' + newDay.getDate() + ', ' + newDay.getFullYear() + '</span> <span class="insivia-frmp-list-view-dotw">' + dayOfTheWeek + '</span></span><ul class="insivia-frmp-list-view-event-list"></ul></li>');
                }
              }
              if($('#list-item-' + slugify(programs[k].title) + '-'+programs[k].begin_date).length === 0) {
                $('#list-date-' + idBuild+' ul.insivia-frmp-list-view-event-list').append('<li id="list-item-' + slugify(programs[k].title) + '-'+programs[k].begin_date+'" class="insivia-frmp-event">'+series+'<span class="insivia-frmp-event-title blue">' + '<a href="#' + slugify(programs[k].title) + '" class="popup-btn blue" data-api="'+programAPI+'" data-id="'+programs[k].program_number+'" data-type="program">' + programs[k].title + '</a>' + '</span>' + '<div class="insivia-frmp-list-view-event-bottom insivia-frmp-row">' + '<div class="insivia-frmp-list-view-event-left insivia-col-2">' + '<ul class="insivia-frmp-list-view-event-info-list">' + '<li class="insivia-frmp-list-view-event-info-item">' + '<span class="insivia-frmp-list-view-location-name">' + '<strong>' + programs[k].location_name + '</strong>' + '</span> | ' + '<span class="insivia-frmp-list-view-event-time">' + '<span class="insivia-frmp-list-view-event-start-time">' + start + '</span>' + ' - <span class="insivia-frmp-list-view-event-end-time">' + end + '</span>' + '</span>' + '</li>' + '<li class="insivia-frmp-list-view-event-info-item">' + '<strong><span class="insivia-frmp-list-view-ages">AGE: ' + displayAges + '</span> | ' + '<span class="insivia-frmp-list-view-price">' + displayPrice + '</span></strong>' + '</li>' + '</ul>' + '</div>' + '<div class="insivia-frmp-list-view-event-right insivia-col-2">' + '<div class="insivia-frmp-list-view-content">' + trim_string(programs[k].description, 25) + '</div>' + '</div>' + '</div>' + '</li>').queue(function() {
                });
              }
            }
          }
          //check_event_number(); 
        }).done(function() {
          $('.popup-btn').click(function(e) {
            e.preventDefault();
            generate_faux_page( $(this) );
          });
          $('.insivia-frmp-list-view-event-bottom').click(function() {
            var near = $(this).prev('span').children('a');
            generate_faux_page( $(near) );
          });
        });
        //TODO need $.when.apply();
        
      } else {
        //all results
        if(url.indexOf('tag_id=145')>-1) {
          url = url.replace('tag_id=145', 'tags=family&tags=Preschool');
        }
        //console.log(url);
        $.getJSON(url, function(json) {
          page = (json.total_pages) ? json.total_pages : json.page_number;
        }).done(function() {
          (page == null) ? page = 1 : page = page;
          
          if(page) {
            for(var i = 1; i <= page; ++i) {
              var jsonRequest = $.getJSON(url+'&page='+i);
              promises.push( jsonRequest );
            }
          } 
          $.when.apply(null, promises).done(function() {
            
            var APIresults = [];
            for( var i = 0; i <= promises.length; ++i) {
              if(promises[i]) {
                                    
                if(promises[i].responseJSON.programs) {
                  for( var j = 0; j <= promises[i].responseJSON.programs.length; ++j) {
                    if( promises[i].responseJSON.programs[j] ) {
                      APIresults.push(promises[i].responseJSON.programs[j]);
                    }
                  }
                } else {
                  
                  for( var j = 0; j <= promises[i].responseJSON.facilities.length; ++j) {
                    if( promises[i].responseJSON.facilities[j] ) {
                      APIresults.push(promises[i].responseJSON.facilities[j]);
                    }
                  }
                }
              }
            }
            
            // Build Results for message
            (url.indexOf('permits/')>-1) ? newURL = [ 'permit_id='+url.split('?')[0].split('').reverse().join('').split('/')[0].split('').reverse().join('') ] : newURL = url.split('?')[1].split('&').slice(0,-1);

            for(var j = 0; j <= newURL.length; ++j) {
              if(newURL[j]) {
                if(newURL[j].slice(-1) != '=') {
                  switch(newURL[j].split('=')[0]) {
                    case 'park_id':
                      resultsForString += APIresults[0].park_name;
                      break;
                    case 'start_date':
                      if(newURL[0].slice(-1) == '=') {
                        (type == 'camping') ? resultsForString += 'Campsites' : resultsForString += 'Shelters';
                      }
                      resultsForString += ' starting on ' + newURL[j].split('=')[1];
                      break;
                    case 'capacity':
                      if(newURL[0].slice(-1) == '=' && newURL[2].slice(-1) == '=') {
                        (type == 'camping') ? resultsForString += 'Campsites' : resultsForString += 'Shelters';
                      }
                      resultsForString += ' with a minimum capacity of ' + newURL[j].split('=')[1];
                      break;
                    case 'topic_id':
                      resultsForString += ' ' + $('#insivia-frmp-list-view-form-element-topics option[value='+newURL[j].split('=')[1]+']').text();
                      break; 
                    case 'begin_date':
                      (newURL[0].slice(-1) == '=') ? resultsForString += 'Programs' : resultsForString += ' programs';
                      resultsForString += ' starting on ' + newURL[j].split('=')[1];
                      sameDay.push(newURL[j].split('=')[1]);
                      break;
                    case 'end_date':
                      (newURL[4].slice(-1) == '=') ? resultsForString += 'Programs' : resultsForString += ' and';
                      resultsForString +=' ending by ' + newURL[j].split('=')[1]; 
                      sameDay.push(newURL[j].split('=')[1]);                           
                      break;
                    case 'tag_id':
                      resultsForString += ' ' + $('#insivia-frmp-list-view-form-element-experiences option[value='+newURL[j].split('=')[1]+']').text()+' experiences';                      
                      break;
                    case 'series_id':
                      resultsForString += ' ' + $('#insivia-frmp-list-view-form-element-series option[value='+newURL[j].split('=')[1]+']').text()+' series';
                      break;
                    case 'permit_id':
                      (type == 'camping') ? resultsForString += 'Campsites' : resultsForString += 'Shelters';
                      var permitType = '';
                      switch( parseInt(newURL[j].split('=')[1]) ) {
                        case 35:
                          permitType = 'Shelter Permit';
                          break;
                        case 14:
                          permitType = 'Shelter Permit, Alcohol Permitted';
                          break;
                        case 2:
                          permitType = 'Frontcountry Camping';
                          break;
                        case 3:
                          permitType = 'Backcountry Camping';
                          break;
                      }
                      resultsForString += ' with a permit type of ' + permitType;
                      break;
                  }
                }
              }
            }
            resultsForString += '</p>';
            if( !resultsFor.length ) {
              $('.insivia-frmp-list-view-days').before('<div class="results-for">'+resultsForString+'</div>');
            }
            
            // If results are for a series add series structures
            if(url.indexOf('series_id=&') === -1) {
              $('.insivia-frmp-list-view-days').wrap('<div class="series-information"></div>');
              $('.insivia-frmp-list-view-days').before('<h4 class="series-title"></h4><p class="series-description"></p>');
            }
            $('.insivia-frmp-list-view-days').html('');

            /**
              * Build Results
              **/
            for(var k = 0; k <= APIresults.length; ++k) {
              if(APIresults[k]) {
                //vars
                start = (APIresults[k].start_time) ? to_am_pm(APIresults[k].start_time) : '';
                end = (APIresults[k].end_time) ? to_am_pm(APIresults[k].end_time) : '';
                if( APIresults[k].age_range ) { displayAges = (APIresults[k].age_range.match(/^[0-9]+$/)) ? 'All ages' : APIresults[k].age_range; } else { displayAges = ''; }
                if ( APIresults[k].prices ) { (APIresults[k].prices[0].price == '0.00') ? displayPrice = APIresults[k].prices[0].description : displayPrice = '$' + APIresults[k].prices[0].price } else { displayPrice = ''; }
                if( APIresults[k].tags ) {
                  seriesColor = '';
                  for( var l = 0; l <= APIresults[k].tags.length; ++l ) {
                    if(APIresults[k].tags[l]) {
                      if(APIresults[k].tags[l].marketing_color) {
                        seriesColor += ' series-'+APIresults[k].tags[l].marketing_color;
                      }
                    }
                  }
                  
                }
                if (APIresults[k].series_name) {
                  console.log(APIresults[k].title+' '+APIresults[k].series_name);
                  series = '<a href="/programs-events-finder/?parks=&topics=&experiences=&series='+APIresults[k].series_id+'&start_date=&type=insivia&end_date=" class="insivia-frmp-event-series series-'+APIresults[k].series_id+'-link'+seriesColor+'">Part of ' + APIresults[k].series_name + ' series</a>';
                  //console.log(APIresults[k].series_name+' '+seriesColor);
                  if(url.indexOf('series_id=&') === -1) {
                    $('.series-title').html(APIresults[k].series_name);
                    $('.series-description').html(APIresults.series_description);
                  }
                } else {
                  series = '';
                }
                eventDay = (APIresults[k].begin_date) ? new Date(APIresults[k].begin_date) : '';
                beginDateArray = (APIresults[k].begin_date) ? APIresults[k].begin_date.split('-') : '';
                newDay = (beginDateArray) ? new Date(beginDateArray[1] + '/' + beginDateArray[2] + '/' + beginDateArray[0]) : '';
                if( newDay ) {
                  displayMonthValue = ( (newDay.getMonth()+1) < 10 ) ? 0+''+(newDay.getMonth()+1) : (newDay.getMonth()+1);
                  displayDateValue = ( (newDay.getDate()) < 10 ) ? 0+''+newDay.getDate() : newDay.getDate();
                  idBuild = newDay.getFullYear()+'-'+displayMonthValue+'-'+displayDateValue;
                } else {
                  displayMonthValue = '';
                  displayDateValue = '';
                  idBuild = '';
                }
                if( eventDay ) { cleanDay = (dotwArray[(eventDay.getDay()+1)]) ? dotwArray[(eventDay.getDay()+1)] : dotwArray[0] } else { cleanDay = '' }
                if( APIresults[k].is_cancelled ) {
                  cancellation = ( APIresults[k].is_cancelled == 1 ) ? cancellation = '<span class="red">Program Cancelled</span>' : cancellation = '';
                } else {
                  cancellation = '';
                }
                
                //Facilities
                if(APIresults[k].facility_id) {
                results += '<li id="' + slugify(APIresults[k].name) + '-shelter-list-item" class="insivia-frmp-list-item">'+
                           '<span class="insivia-frmp-list-item-content insivia-frmp-row">'+                            
                              '<span class="insivia-frmp-list-item-content-left">'+
                                '<p class="insivia-frmp-list-item-name">'+APIresults[k].name+' at <span class="insivia-frmp-list-item-location">'+APIresults[k].park_name+'</span></p>';
                    
                    if(APIresults[k].address.address) {            
                      results += '<p class="insivia-frmp-list-item-address-wrapper">'+
                                  '<span class="insivia-frmp-list-item-address">'+APIresults[k].address.address+' ';
                                  if(APIresults[k].address.address2) {
                                    results += '<span class="insivia-frmp-list-item-address-2">'+APIresults[k].address.address2+'</span> ';
                                  }
                      results += '</span>'+
                                  '<span class="insivia-frmp-list-item-city">'+APIresults[k].address.city+'</span>, '+
                                  '<span class="insivia-frmp-list-item-state">'+APIresults[k].address.state+'</span> '+
                                  '<span class="insivia-frmp-list-item-zip">'+APIresults[k].address.zip+'</span>'+
                                '</p>';
                    } else {
                      results += '<p class="insivia-frmp-list-item-address-wrapper no-children"></p>';
                    }
                                
                      results += '<span class="insivia-frmp-gallery-link"><a href="/gallery'+APIresults[k].facility_id+'" data-api="'+facilitiesAPI+'" data-id="'+APIresults[k].facility_id+'" data-type="facility">View gallery</a></span>'+
                              '</span>'+
                              '<span class="insivia-frmp-list-item-content-middle">'+
                                '<span class="insivia-frmp-list-item-list-content-top">'+
                                  '<p class="insivia-frmp-list-item-capacity"><strong>Capacity:</strong> <span class="insivia-frmp-list-item-capacity-value">'+APIresults[k].capacity+'</span></p>'+
                                '</span>'+
                                '<span class="insivia-frmp-list-item-amenities">'+
                                  '<p><strong>Amenities</strong></p>'+
                                  '<ul class="insivia-frmp-list-item-amenities-list insivia-frmp-row">';
                                    if(APIresults[k].amenities.length) {
                                      for(var l = 0; l<=APIresults[k].amenities.length; ++l) {
                                        if(APIresults[k].amenities[l]) {
                                          console.log(APIresults[k].name +' '+ APIresults[k].amenities[l].name);
                                          results += '<li class="insivia-frmp-list-item-amenity '+slugify(APIresults[k].amenities[l].name)+'" data-name="'+APIresults[k].amenities[l].name+'" title="'+APIresults[k].amenities[l].name+'"></li>';
                                        }
                                      }
                                    }
                      results += '</ul>'+
                                '</span>'+
                              '</span>'+
                              '<span class="insivia-frmp-list-item-content-right">'+
                                '<p class="insivia-frmp-list-item-view-details-wrapper"><a href="'+APIresults[k].facility_id+'" class="blue-btn btn interactive-map-listing-btn view-details popup-btn" data-api="'+facilitiesAPI+'" data-id="'+APIresults[k].facility_id+'" data-type="facility">View details</a></p>'+
                                '<p class="insivia-frmp-list-item-reserve-now-wrapper"><a class="blue-btn btn reserve-now" data-id="'+APIresults[k].facility_id+'">Reserve now</a></p>'+
                              '</span>'+
                            '</span>'+
                          '</li>';
                }
                
                // Programs
                if( !$('.insivia-frmp-list-view-days').children().length ) {
                  if(APIresults[k].series_id) {
                  $('.insivia-frmp-list-view-days').append('<li id="list-date-' + idBuild+'" class="series-'+APIresults[k].series_id+' insivia-frmp-list-view-' + cleanDay.toLowerCase() + ' insivia-frmp-list-view-day insivia-frmp-event-day active hasEvent"><span class="insivia-frmp-list-view-date"><span class="insivia-frmp-list-view-display-date">' + monthsArray[newDay.getMonth()] + ' ' + newDay.getDate() + ', ' + newDay.getFullYear() + '</span> <span class="insivia-frmp-list-view-dotw">' + cleanDay + '</span></span><ul class="insivia-frmp-list-view-event-list"></ul></li>');
                  }
                } else {
                  if($('#list-date-' + idBuild).length === 0) {
                    if( eventDay.getDay()+1 != 7 ) {
                    $('.insivia-frmp-list-view-days').append('<li id="list-date-' + idBuild+'" class="insivia-frmp-list-view-' + cleanDay.toLowerCase() + ' insivia-frmp-list-view-day insivia-frmp-event-day active hasEvent"><span class="insivia-frmp-list-view-date"><span class="insivia-frmp-list-view-display-date">' + monthsArray[newDay.getMonth()] + ' ' + newDay.getDate() + ', ' + newDay.getFullYear() + '</span> <span class="insivia-frmp-list-view-dotw">' + cleanDay + '</span></span><ul class="insivia-frmp-list-view-event-list"></ul></li>');
                    } else {
                      $('.insivia-frmp-list-view-days').append('<li id="list-date-' + idBuild+'" class="insivia-frmp-list-view-' + cleanDay.toLowerCase() + ' insivia-frmp-list-view-day insivia-frmp-event-day active hasEvent"><span class="insivia-frmp-list-view-date"><span class="insivia-frmp-list-view-display-date">' + monthsArray[newDay.getMonth()] + ' ' + newDay.getDate() + ', ' + newDay.getFullYear() + '</span> <span class="insivia-frmp-list-view-dotw">' + cleanDay + '</span></span><ul class="insivia-frmp-list-view-event-list"></ul></li>');
                    }
                  }
                }//program dates
                
                if( $('#list-date-' + idBuild+' ul.insivia-frmp-list-view-event-list').length ) {
                  $('#list-date-' + idBuild+' ul.insivia-frmp-list-view-event-list').append('<li id="list-item-' + slugify(APIresults[k].title) + '-'+APIresults[k].begin_date+'" class="insivia-frmp-event">'+series+'<span class="insivia-frmp-event-title blue">' + '<a class="popup-btn blue" data-count="1" data-api="'+programAPI+'" data-id="'+APIresults[k].program_number+'" data-type="program">' + APIresults[k].title + '</a>' + '</span>' + '<div class="insivia-frmp-list-view-event-bottom insivia-frmp-row">' + '<div class="insivia-frmp-list-view-event-left insivia-col-2">' + '<ul class="insivia-frmp-list-view-event-info-list">' + '<li class="insivia-frmp-list-view-event-info-item">' + '<span class="insivia-frmp-list-view-location-name">' + '<strong>' + APIresults[k].location_name + '</strong>' + '</span> | ' + '<span class="insivia-frmp-list-view-event-time">' + '<span class="insivia-frmp-list-view-event-start-time">' + start + '</span>' + ' - <span class="insivia-frmp-list-view-event-end-time">' + end + '</span>' + '</span>' + '</li>' + '<li class="insivia-frmp-list-view-event-info-item">' + '<strong><span class="insivia-frmp-list-view-ages">AGE: ' + displayAges + '</span> | ' + '<span class="insivia-frmp-list-view-price">' + displayPrice + '</span></strong>' + '</li>' + '</ul>' + '</div>' + '<div class="insivia-frmp-list-view-event-right insivia-col-2">' + '<div class="insivia-frmp-list-view-content">' + cancellation+' '+trim_string(APIresults[k].description, 25) + '</div>' + '</div>' + '</div>' + '</li>')   ;
                }                 
              }
            }
          }).done(function() {
                            
            if(window.location.href.indexOf('&type=camp')>-1) $('#camping-list-view').html(results);
            if(window.location.href.indexOf('&type=shelter')>-1) $('#shelter-list-view').html(results);
            //$('.insivia-frmp-list-view-days').html(results);
            
            $('.insivia-frmp-gallery-link').click(function(e) {
              e.preventDefault();
              put_to_slide($(this).children('a').attr('data-api'), $(this), $(this).children('a').attr('data-type'), $(this).children('a').attr('data-id'));
            });
            $('.view-details').click(function(e) {
              e.preventDefault();
              generate_faux_page( $(this) );
            });
            
            $.each($('.reserve-now'), function() {
              $(this).click(function(e) {
                e.preventDefault();
                registration_calendar(currentDate, $(this).attr('data-id'));
              });
            });
            
            if( !$('.list-view').children().length ) {
              $('.list-view').html('<li class="no-results">'+resultsNone+'</li>');
            }
            
            $('.popup-btn').click(function(e) {
              e.preventDefault();
              //console.log('Click');
              generate_faux_page( $(this) );
            });
            
            $('.insivia-frmp-list-view-event-bottom').click(function() {
              var near = $(this).prev('span').children('a');
              //console.log('Click');
              generate_faux_page( $(near) );
            });
            
          });
          
        });
      }          
    }// end function
    function registration_calendar(today, facilityID, camping) {
      
      //camping = 1||0
      (camping) ? camping : camping = 0;
      
      if(window.location.href.indexOf('camp')>-1) {
        camping = 1;
      }
      
      (facilityID) ? facilityID : facilityID = 786016;
            
      var daysArray = days_in_month(today.getMonth(), today.getFullYear()),
        calendarBuild = '',
        d = 0,
        w = 0,
        m = today.getMonth(),
        nm = today.getMonth(),
        displayMonth = '',
        displayDay,
        todayCSS = '',
        url,
        startDate,
        endDate,
        lastDay = new Date(today.getFullYear(), today.getMonth()+1, 0);
              
      //Header & Navigation
      calendarBuild += '<div class="insivia-frmp-calendar-header">' +
                        '<div class="insivia-frmp-calendar-nav-wrapper insivia-frmp-row">' +
                        '<span class="insivia-frmp-calendar-nav calendar-prev insivia-col-4"><a href="#"><</a></span>' +
                        '<span class="insivia-frmp-calendar-month insivia-col-2">' + monthsArray[today.getMonth()] + '</span>' +
                        '<span class="insivia-frmp-calendar-nav calendar-next insivia-col-4"><a href="#">></a></span>' +
                        '</div>' +
                        '</header>';
      
      //Days of the week
      calendarBuild += '<div class="insivia-frmp-calendar-days-of-the-week insivia-frmp-row">' +
                        '<div class="insivia-frmp-calendar-' + dotwArray[0].toLowerCase() + ' insivia-frmp-calendar-day-of-the-week insivia-col-7">' + dotwArray[0] + '</div>' +
                        '<div class="insivia-frmp-calendar-' + dotwArray[1].toLowerCase() + ' insivia-frmp-calendar-day-of-the-week insivia-col-7">' + dotwArray[1] + '</div>' +
                        '<div class="insivia-frmp-calendar-' + dotwArray[2].toLowerCase() + ' insivia-frmp-calendar-day-of-the-week insivia-col-7">' + dotwArray[2] + '</div>' +
                        '<div class="insivia-frmp-calendar-' + dotwArray[3].toLowerCase() + ' insivia-frmp-calendar-day-of-the-week insivia-col-7">' + dotwArray[3] + '</div>' +
                        '<div class="insivia-frmp-calendar-' + dotwArray[4].toLowerCase() + ' insivia-frmp-calendar-day-of-the-week insivia-col-7">' + dotwArray[4] + '</div>' +
                        '<div class="insivia-frmp-calendar-' + dotwArray[5].toLowerCase() + ' insivia-frmp-calendar-day-of-the-week insivia-col-7">' + dotwArray[5] + '</div>' +
                        '<div class="insivia-frmp-calendar-' + dotwArray[6].toLowerCase() + ' insivia-frmp-calendar-day-of-the-week insivia-col-7">' + dotwArray[6] + '</div>' +
                        '</div>';
      
      //Rows of days
      calendarBuild += '<div class="insivia-frmp-calendar-days insivia-frmp-row">';
      
      //Start of the week until the first day of the month
      for (var i = 0; i < daysArray[0].getDay(); ++i) {
        calendarBuild += '<div class="insivia-frmp-calendar-' + dotwArray[w].toLowerCase() + ' insivia-frmp-calendar-week-' + i + ' insivia-frmp-calendar-day insivia-frmp-event-day insivia-col-7 inactive"></div>';
        ++w;
      }

      if (w === 0)  w = 0;
      
      //Days of the week in the actual month
      for(var i = 0; i <= daysArray.length; ++i) {
        ++d;
        if( w > (dotwArray.length - 1) ) w = 0;

        //Finish up the week
        if(i == daysArray.length) {
          for(var n = w; n <= (dotwArray.length - 1); ++n) {
            if(n == dotwArray.length || n === 0) break;
            
            calendarBuild += '<div class="insivia-frmp-calendar-' + dotwArray[w].toLowerCase() + ' insivia-frmp-calendar-week-' + i + ' insivia-frmp-calendar-day insivia-frmp-event-day insivia-col-7 inactive"></div>';
          }
          break;
        }
        
        nm = today.getMonth();
        ++nm;
        
        (nm < 10) ? displayMonth = '0' + nm: displayMonth = nm;
        (d < 10) ? displayDay = '0' + d: displayDay = d;
        (d == today && m == theMonth) ? todayCSS = " today": todayCSS = "";
                
        calendarBuild += '<div id="date-' + today.getFullYear() + '-' + displayMonth + '-' + displayDay + '" class="insivia-frmp-calendar-' + dotwArray[w].toLowerCase() + ' insivia-frmp-calendar-week-' + i + ' insivia-frmp-calendar-day insivia-frmp-event-day insivia-col-7 active' + todayCSS + '"><div class="insivia-frmp-calendar-day-content"><span class="insivia-frmp-row"><span class="insivia-frmp-calendar-date">' + d + '</span></span><ul class="insivia-frmp-calendar-day-events"></ul></div></div>';
        
        ++w;
      }
      
      if ($('.insivia-frmp-lighbox').length === 0) $('body').append('<div class="insivia-frmp-lighbox"></div>');
       
      $('.insivia-frmp-lighbox').html('<div id="insivia-frmp-reservation-calendar">'+calendarBuild+'</div>');
      $('.insivia-frmp-lighbox, #insivia-frmp-reservation-calendar').show();
      $('#insivia-frmp-reservation-calendar .insivia-frmp-calendar-header').before('<div class="insivia-frmp-lighbox-popup-close">X</div>');
      $.each($('.insivia-frmp-lighbox-popup-close'),function() {
        $(this).click(function() {
          var previous = document.referrer;
          ( previous.indexOf('?parks')>-1) ? window.open(previous, '_self') : $('.insivia-frmp-lighbox').stop().fadeOut(800);
        });
      });

      startDate = today.getFullYear() + '-' ;
      
      ( (parseInt(today.getMonth())+1)  < 10) ? startDate += '0'+(today.getMonth()+1) : startDate += today.getMonth()+1;
      startDate += '-';
      (today.getDate() < 10) ? startDate += '0'+today.getDate() : startDate += today.getDate();

      endDate = lastDay.getFullYear() + '-';
      ( (parseInt(lastDay.getMonth())+1) < 10 ) ? endDate += '0'+(lastDay.getMonth()+1) : endDate += lastDay.getMonth()+1;
      endDate += '-';
      (lastDay.getDate() < 10) ? endDate += '0'+lastDay.getDate() : endDate += lastDay.getDate();
      
      url = baseUrl+facilitiesAPI+'/'+facilityID+'/'+startDate+'/'+endDate+'/availability?access_token='+accessToken;

      $.getJSON(url, function(json) {
        if(!json.dates) return;
        if(json.dates.length) {          
          for(var i = 0; i <= json.dates.length; ++i) {
            if(json.dates[i]) {
              var currentDate = new Date( json.dates[i].date ),
                startDay = new Date(currentDate.getFullYear(), 0, 0),
                diff = currentDate - startDay,
                oneDay = 1000 * 60 * 60 * 24,
                currentDay = Math.ceil(diff/oneDay),
                jan1Date = new Date( currentDate.getFullYear(), 0, 1),
                mar31Date = new Date ( currentDate.getFullYear(), 3, 0),
                jan1Diff = jan1Date - startDay,
                mar31Diff = mar31Date - startDay,
                jan1 = Math.ceil(jan1Diff/oneDay),
                mar31 = Math.ceil(mar31Diff/oneDay),
                apr1Date = new Date( currentDate.getFullYear(), 3, 1),
                oct31Date = new Date ( currentDate.getFullYear(), 10, 0),
                apr1Diff = apr1Date - startDay,
                oct31Diff = oct31Date - startDay,
                apr1 = Math.ceil(apr1Diff/oneDay),
                oct31 = Math.ceil(oct31Diff/oneDay);
                                
              if( $('#date-'+json.dates[i].date) ) {
                $('#date-'+json.dates[i].date).addClass(json.dates[i].status);
                
                if(json.dates[i].status == 'unavailable') {
                  $('#date-'+json.dates[i].date).attr('data-active', 0);
                } else {
                  $('#date-'+json.dates[i].date).attr('data-active', 1).attr('data-value', json.dates[i].date);
                                    
                  if( currentDay >= jan1 && currentDay <= mar31 ) {
                    //Jan 1 - Mar 31
                    if( $('#date-'+json.dates[i].date).attr('class') ) {
                      ( $('#date-'+json.dates[i].date).attr('class').indexOf('saturday')>-1 || $('#date-'+json.dates[i].date).attr('class').indexOf('sunday')>-1 ) ? $('#date-'+json.dates[i].date+' .insivia-frmp-calendar-day-events').html('<li class="starting-at">Starting at $'+json.facility.rental_rates.rental_rates[0].weekend_cost+'</li>') : $('#date-'+json.dates[i].date+' .insivia-frmp-calendar-day-events').html('<li class="starting-at">Starting at $'+json.facility.rental_rates.rental_rates[0].weekday_cost+'</li>');
                    }
                  } else if( currentDay >= apr1 && currentDay <= oct31 ) {
                    //Apr 1 - Oct 31
                    if( $('#date-'+json.dates[i].date).attr('class') ) {
                      ( $('#date-'+json.dates[i].date).attr('class').indexOf('saturday')>-1 || $('#date-'+json.dates[i].date).attr('class').indexOf('sunday')>-1 ) ? $('#date-'+json.dates[i].date+' .insivia-frmp-calendar-day-events').html('<li class="starting-at">Starting at $'+json.facility.rental_rates.rental_rates[1].weekend_cost+'</li>') : $('#date-'+json.dates[i].date+' .insivia-frmp-calendar-day-events').html('<li class="starting-at">Starting at $'+json.facility.rental_rates.rental_rates[1].weekday_cost+'</li>');
                    }
                  } else {
                    //Nov 1 - Dec 31
                    if( $('#date-'+json.dates[i].date).attr('class') ) {
                      ( $('#date-'+json.dates[i].date).attr('class').indexOf('saturday')>-1 || $('#date-'+json.dates[i].date).attr('class').indexOf('sunday')>-1 ) ? $('#date-'+json.dates[i].date+' .insivia-frmp-calendar-day-events').html('<li class="starting-at">Starting at $'+json.facility.rental_rates.rental_rates[2].weekend_cost+'</li>') : $('#date-'+json.dates[i].date+' .insivia-frmp-calendar-day-events').html('<li class="starting-at">Starting at $'+json.facility.rental_rates.rental_rates[2].weekday_cost+'</li>');
                    }
                  }
                }
              }
            }
          }
        }
      }).done(function() {
          var month = today.getMonth(),
              year = today.getFullYear(),
              nextMonth;

        $('#insivia-frmp-reservation-calendar .insivia-frmp-calendar-nav').click(function(e) {
          e.preventDefault();
          if($(this).attr('class').indexOf('next')>-1) {
            if(month == 12) {
              month = 1;
              ++year;
            }
            month = month +1;
            nextMonth = new Date(year, month);
          } else if( $(this).attr('class').indexOf('next') == -1 ) {
            if(month == 1) {
              month = 12;
              --year;
            }
            month = month-1;
            nextMonth = new Date(year, month);
          }
          registration_calendar(nextMonth, facilityID, camping);
        });
        $('#insivia-frmp-reservation-calendar .available').click(function() {
          
          var formBuild = '',
              jsonString,
              newDay,
              dateValue = $(this).attr('data-value'),
              endVal = 17,
              startVal = 9,
              maxVal = 17,
              minVal = 0,
              displayTime,
              currentDate = new Date(dateValue),
              startDay = new Date(currentDate.getFullYear(), 0, 0),
              diff = currentDate - startDay,
              oneDay = 1000 * 60 * 60 * 24,
              currentDay = Math.ceil(diff/oneDay),
              apr1Date = new Date( currentDate.getFullYear(), 3, 1),
              oct31Date = new Date ( currentDate.getFullYear(), 10, 0),
              apr1Diff = apr1Date - startDay,
              oct31Diff = oct31Date - startDay,
              apr1 = Math.ceil(apr1Diff/oneDay),
              oct31 = Math.ceil(oct31Diff/oneDay),
              reserveDate, reserveDiff, reserveDay;
              
                if(currentDay>apr1&&currentDay<oct31) {
                  startVal = 8;
                  minVal = 8;
                  endVal = 22;
                  maxVal = 22;
                } else {
                  startVal = 8;
                  minVal = 8;
                  endVal = 20;
                  maxVal = 20;
                }
                
                if(camping) {
                  startVal = 12;
                }
                
          
          url = baseUrl+facilitiesAPI+'/'+facilityID+'/'+$(this).attr('data-value')+'/'+$(this).attr('data-value')+'/availability?access_token='+accessToken;          
          $.getJSON(url, function(json) {
            
            if(json.length == 0) return;
            
            reserveDate =  new Date(json.dates[0].date);
            reserveDiff = reserveDate - startDay;
            reserveDay = Math.ceil(reserveDiff/oneDay);
            
            if(reserveDay>apr1&&reserveDay<oct31) {
              startVal = 10;
              var initialStart = startVal;
              minVal = 10;
              endVal = 22;
              maxVal = 22;
            } else {
              startVal = 10;
              var initialStart = startVal;
              minVal = 10;
              endVal = 20;
              maxVal = 20;
            }
            
            if(camping) {
              startVal = 12;
            }

            if( facilityID == '786160' ) {
              startVal = 18;
              var initialStart = startVal;
              minVal = 18;
              endVal = 20;
              maxVal = 20;
            } else {
              console.log('Not Ice RInk');
            }
            
            formBuild += '<div id="reservation-form-'+facilityID+'" class="reservation-form-wrapper"><div class="insivia-frmp-lighbox-popup-close">X</div>';
            jsonString = '{"reserve":{"facility_id":"'+facilityID+'","date":"'+dateValue+'","end_date":"'+dateValue+'","start_time":"10:00:00","end_time":"13:00:00","permit_id":"35"}}';
            newDay = new Date( dateValue.split('-')[0]+'/'+dateValue.split('-')[1]+'/'+dateValue.split('-')[2] );

            formBuild += '<form id="'+slugify(json.facility.name)+'-registration" method="POST" name="registration-form">'+
                          '<p>Reservation for '+json.facility.name+' on '+monthsArray[newDay.getMonth()]+' '+newDay.getDate()+', '+newDay.getFullYear()+'</p>' +
                          '<div><textarea name="access_token" style="display:none;">'+accessToken+'</textarea>'+
                          '<input type="hidden" name="session_id" value="'+Cookies.get('reservation-session-id')+'"/>' +
                          '<p>Starting at $'+json.dates[0].cost+'</p>'+
                          '<ul><li></li>' +
                          '<li><label>Permit Requested:</label> <select class="permit_type">';
                          
                          for(var i = 0; i <= json.facility.permits_available.length; ++i) {
                            if(json.facility.permits_available[i]) {
                              formBuild += '<option value="'+json.facility.permits_available[i].id+'">'+json.facility.permits_available[i].name+'</option>';                                
                            }
                          }
                          
            formBuild += '</select></li>' +
                          '<li><label>Arrival Time</label> <select class="arrival_time">';

                            while(startVal <= endVal) {
                              if(startVal < 12) {
                                formBuild += '<option value="'+startVal+':00:00">'+startVal+':00 am</option>';
                                formBuild += '<option value="'+startVal+':30:00">'+startVal+':30 am</option>';
                              } else if(startVal == 12) {
                                formBuild += '<option value="'+startVal+':00:00">'+startVal+':00 pm</option>';
                                formBuild += '<option value="'+startVal+':30:00">'+startVal+':30 pm</option>';
                              } else {
                                 formBuild += '<option value="'+startVal+':00:00">'+(startVal-12)+':00 pm</option>'; 
                                 if(startVal != maxVal) formBuild += '<option value="'+startVal+':30:00">'+(startVal-12)+':30 pm</option>'; 
                              }
                              ++startVal
                            }
                          
            formBuild += '</select></li>' +
                          '<li><label>Departure Time</label><select class="departure_time">';
                          if( !camping ){
                            if(startVal >= endVal) startVal = initialStart+1; 
                          } else {
                            if(startVal >= endVal) startVal = 12; 
                          }
                          
                          if(camping) {
                            while(startVal < endVal) {
                              if(startVal == 12) {
                                formBuild += '<option value="'+startVal+':00:00">'+startVal+':00 pm</option>';
                              } else {
                                formBuild += '<option value="'+startVal+':00:00">'+startVal+':00 am</option>';
                                formBuild += '<option value="'+startVal+':30:00">'+startVal+':30 am</option>';
                              }
                              --startVal
                              if(startVal < minVal) {
                                break;
                              }
                            }
                          } else {
                            while(startVal <= endVal) {
                              if(startVal < 12) {
                                formBuild += '<option value="'+startVal+':00:00">'+startVal+':00 am</option>';
                                formBuild += '<option value="'+startVal+':30:00">'+startVal+':30 am</option>';
                              } else if(startVal == 12) {
                                formBuild += '<option value="'+startVal+':00:00">'+startVal+':00 pm</option>';
                                formBuild += '<option value="'+startVal+':30:00">'+startVal+':30 pm</option>';
                              } else {
                                 formBuild += '<option value="'+startVal+':00:00">'+(startVal-12)+':00 pm</option>'; 
                                if(startVal != maxVal) formBuild += '<option value="'+startVal+':30:00">'+(startVal-12)+':30 pm</option>'; 
                              }
                              ++startVal
                            }
                          }
            
            formBuild += '</select></li>';
            
            if(camping) {
              formBuild += '<li><label>Departure Date</label><select class="departure_date">';
              
              if(json.dates[0].available_checkout_dates) {
                for(var i = 0; i <= json.dates[0].available_checkout_dates.length; ++i) {
                  if(json.dates[0].available_checkout_dates[i]) {
                    formBuild += '<option value="'+json.dates[0].available_checkout_dates[i]+'">'+json.dates[0].available_checkout_dates[i]+'</option>';
                  }
                }
              }
              formBuild += '</select></li>';
            }
            
            formBuild += '<li><textarea name="reserve" style="display:none;">'+jsonString+'</textarea></li>';
            
            if(!camping) {
              if(json.facility.rental_rates.extra_prices) {
                  formBuild += '<li><span class="rental-rate-title"></span>Shelter base fee includes '+json.facility.rental_rates.extra_prices.additional_hours_after+' hours. '+json.facility.rental_rates.extra_prices.description+'</li>';
              }
            }
                          
            formBuild += '<li><p class="insivia-frmp-message"><p></li></ul>'+
                          '<p><input type="submit" class="register" value="Reserve"></input></p></div>' +
                          '</form></div>';
            
            formBuild += '</div>';
            
          }).done(function() {            
            $('.insivia-frmp-lighbox').html(formBuild);
            $.each($('.insivia-frmp-lighbox-popup-close'),function() {
              $(this).click(function() {
                var previous = document.referrer;
                ( previous.indexOf('?parks')>-1) ? window.open(previous, '_self') : $('.insivia-frmp-lighbox').stop().fadeOut(800);
              });
            });
            $.each($('.permit_type'), function() {
                var permit_type = $(this).val(),
                    targetID = $(this).closest('form').attr('id'),
                    textArea = $('#'+targetID).find('textarea')[1],
                    jsnString = $(textArea).text(),
                    jsnObj = JSON.parse(jsnString);
                    jsnObj.reserve.permit_id = permit_type;
                $(textArea).html(JSON.stringify(jsnObj).replace(' ',''));
              $(this).on('change', function() {
                permit_type = $(this).val();                
                targetID = $(this).closest('form').attr('id');
                textArea = $('#'+targetID).find('textarea')[1],
                jsnString = $(textArea).text();
                jsnObj = JSON.parse(jsnString);
                jsnObj.reserve.permit_id = permit_type;
                $(textArea).html(JSON.stringify(jsnObj).replace(' ',''));
              });
            });              
            $.each($('.arrival_time'), function() {
                var arrival_time = $(this).val(),
                    targetID = $(this).closest('form').attr('id'),
                    textArea = $('#'+targetID).find('textarea')[1],
                    jsnString = $(textArea).text(),
                    jsnObj = JSON.parse(jsnString);
                    jsnObj.reserve.start_time = arrival_time;
                    jsnString = JSON.stringify(jsnObj);
                $(textArea).html(jsnString);
              $(this).on('change', function() {
                arrival_time = $(this).val();                
                targetID = $(this).closest('form').attr('id');
                textArea = $('#'+targetID).find('textarea')[1],
                jsnString = $(textArea).text();
                jsnObj = JSON.parse(jsnString);
                jsnObj.reserve.start_time = arrival_time;
                $(textArea).html(JSON.stringify(jsnObj));
              });
            });
            $.each($('.departure_time'), function() {
                var departure_time = $(this).val(),
                    targetID = $(this).closest('form').attr('id'),
                    textArea = $('#'+targetID).find('textarea')[1],
                    jsnString = $(textArea).text(),
                    jsnObj = JSON.parse(jsnString);
                    jsnObj.reserve.end_time = departure_time;
                $(textArea).html(JSON.stringify(jsnObj));
              $(this).on('change', function() {
                departure_time = $(this).val();                
                targetID = $(this).closest('form').attr('id');
                textArea = $('#'+targetID).find('textarea')[1],
                jsnString = $(textArea).text();
                jsnObj = JSON.parse(jsnString);
                jsnObj.reserve.end_time = departure_time;
                $(textArea).html(JSON.stringify(jsnObj));
              });
            });
            $.each($('.departure_date'), function() {
                var departure_date = $(this).val(),
                    targetID = $(this).closest('form').attr('id'),
                    textArea = $('#'+targetID).find('textarea')[1],
                    jsnString = $(textArea).text(),
                    jsnObj = JSON.parse(jsnString);
                    jsnObj.reserve.end_date = departure_date;
                $(textArea).html(JSON.stringify(jsnObj));
              $(this).on('change', function() {
                departure_date = $(this).val();                
                targetID = $(this).closest('form').attr('id');
                textArea = $('#'+targetID).find('textarea')[1],
                jsnString = $(textArea).text();
                jsnObj = JSON.parse(jsnString);
                jsnObj.reserve.end_date = departure_date;
                $(textArea).html(JSON.stringify(jsnObj));
              });
            });
            $.each($('.reservation-form-wrapper form .register'), function() {
              
              $(this).click(function(e){
                e.preventDefault();

                var formID = $(this).closest('form'),
                    trgt = $(formID),
                    url = 'https://reservations.metroparks.org/api/v1/facilities/reserve/';
                
                $.ajax({
                  type: 'POST',
                  url: url,
                  crossDomain: true,
                  processData: false,
                  dataType: false,
                  data: trgt.serialize(),
                  success: function(data) {
                                        
                    if(data.result == 'success') {
                      
                      Cookies.set('reservation-cart-count', data.cart.length);
                      Cookies.set('checkout', data.Checkout);
                      Cookies.set('view-cart', data.View_Cart);
                      Cookies.set('clear-cart', data.Clear_Cart);
                      Cookies.set('reservation-session-id', data.session_id);
                      Cookies.set('cart-type', 'facility');
                                              
                      var cookiep = (Cookies.get('program-cart-count') == 'undefined') ? Cookies.get('program-cart-count') : 0;
                      var cookier = (Cookies.get('reservation-cart-count') == 'undefined') ? Cookies.get('reservation-cart-count') : 0;
                      
                      var cart_count = parseInt(cookiep) + parseInt(cookier);
                      $('.header-cart-area').addClass('show').attr('data-cart', '/cart/');
                      $('.shopping-cart-number').html(data.cart.length);
                      $(formID).find('.insivia-frmp-message').html('Item has been added to your cart. <a class="insivia-frmp-lighbox-popup-close">Continue browsing</a> <a href="/cart/">View Cart</a>').addClass('green');
                      $(formID).find('.register').hide();
                      $.each($('.insivia-frmp-lighbox-popup-close'),function() {
                        $(this).click(function() {
                          var previous = document.referrer;
                          ( previous.indexOf('?parks')>-1) ? window.open(previous, '_self') : $('.insivia-frmp-lighbox').stop().fadeOut(800);
                        });
                      });
                    }
                  },
                  error: function( jqXHR, textStatus, errorThrown ) {
                    if(errorThrown ==  'Conflict') $('.insivia-frmp-message').html('This event is currently full.').addClass('red');
                  }
                });

              });
                            
            });
          });
        });
      });
    }
    function the_cart(programsSessionID, facilitiesSessionID) {
            
      var url1 = baseUrl,
          url2 = baseUrl,
          programCartItems = '<div id="insivia-frmp-program-cart"><h2 class="cart-sub-title">Registrations</h2><ul class="cart-list">',
          facilityCartItems = '<div id="insivia-frmp-facility-cart"><h2 class="cart-sub-title">Reservations</h2><ul class="cart-list">',
          programTotal = 0.00,
          facilityTotal = 0.00,
          programCount = 0,
          facilityCount = 0,
          cartItemDisplayDay,
          cartItemDisplayMonth,
          cartItemDate,
          cartItemStart,
          cartItemEnd,
          testTotal = 0.00;
      
      (programsSessionID) ? programsSessionID = programsSessionID : programsSessionID = Cookies.get('program-session-id');
      (facilitiesSessionID) ? facilitiesSessionID = facilitiesSessionID : facilitiesSessionID = Cookies.get('reservation-session-id');

      if(programsSessionID || facilitiesSessionID) {
        var promises = [];

        url1 += programAPI+'/cart/'+programsSessionID+'?access_token='+accessToken;
        url2 += facilitiesAPI+'/cart/'+facilitiesSessionID+'?access_token='+accessToken;
        
        promises.push( $.getJSON(url1) );
        promises.push( $.getJSON(url2) );
        $.when.apply(null, promises).done(function() {
          var results = [],
          jsonString;              
          for( var i = 0; i <= promises.length; ++i) {
            if(promises[i]) {
              
              if(promises[i].responseJSON.cart) {
                                
                if(promises[i].responseJSON.cart.length) {
                  for(var j = 0; j <= promises[i].responseJSON.cart.length; ++j) {
                    if(promises[i].responseJSON.cart[j]) {
                      
                      cartItemStart = ( promises[i].responseJSON.cart[j].start_time.split(':')[0].charAt(0) == 0 ) ? promises[i].responseJSON.cart[j].start_time.split(':')[0].slice(1)+':'+promises[i].responseJSON.cart[j].start_time.split(':')[1] : promises[i].responseJSON.cart[j].start_time.split(':')[0]+':'+promises[i].responseJSON.cart[j].start_time.split(':')[1];
                      cartItemStart = ( parseInt(cartItemStart.split(':')[0]) > 12 ) ? (parseInt(cartItemStart.split(':')[0])-12)+':'+cartItemStart.split(':')[1]+'pm' : cartItemStart+'am';
                      cartItemEnd = ( promises[i].responseJSON.cart[j].end_time.split(':')[0].charAt(0) == 0 ) ? promises[i].responseJSON.cart[j].end_time.split(':')[0].slice(1)+':'+promises[i].responseJSON.cart[j].end_time.split(':')[1] : promises[i].responseJSON.cart[j].end_time.split(':')[0]+':'+promises[i].responseJSON.cart[j].end_time.split(':')[1];
                      cartItemEnd = ( parseInt(cartItemEnd.split(':')[0]) > 12 ) ? (parseInt(cartItemEnd.split(':')[0])-12)+':'+cartItemEnd.split(':')[1]+'pm' : cartItemEnd+'am';
                      
                      var isProgram = promises[i].responseJSON.cart[0].program_title;
                      if(isProgram){
                        
                        cartItemDisplayDay = ( (new Date(promises[i].responseJSON.cart[j].start_date).getDay()+1) == 7 ) ? dotwArray[new Date(promises[i].responseJSON.cart[j].start_date).getDay()] : dotwArray[new Date(promises[i].responseJSON.cart[j].start_date).getDay()+1];
                        cartItemDate = new Date(promises[i].responseJSON.cart[j].start_date).getDate()+1;
                        
                        ++programCount;
                        jsonString = '{"session_id" : "'+promises[i].responseJSON.session_id+'", "price_id" : "'+promises[i].responseJSON.cart[j].price_id+'", "number_participants" : "'+promises[i].responseJSON.cart[j].number_participants+'"}';
                        programCartItems += '<li data-id="'+promises[i].responseJSON.cart[i].program_id+'" data-item-id="'+promises[i].responseJSON.cart[j].cart_item_id+'" class="cart-item insivia-frmp-row"><a href="/programs-events-finder/?id='+promises[i].responseJSON.cart[j].program_id+'&api=programs&type=program" class="blue cart-item-link">'+promises[i].responseJSON.cart[j].program_title+'</a><span class="item-info insivia-frmp-row"><span class="cart-item-date">'+cartItemDisplayDay+', '+monthsArray[ new Date(promises[i].responseJSON.cart[j].start_date).getMonth() ]+' '+cartItemDate+', '+new Date(promises[i].responseJSON.cart[j].start_date).getFullYear()+'</span><span class="cart-item-time"><span class="start-time">'+cartItemStart+'</span> to <span class="end-time">'+cartItemEnd+'</span></span>'+
                          '<span class="cart-item-price">$'+promises[i].responseJSON.cart[j].price+'</span><form class="participant-count-form" name="participant-count-form'+promises[i].responseJSON.cart[j].cart_item_id+'"><textarea name="access_token" style="display:none;">'+accessToken+'</textarea><input type="hidden" name="session_id" value="'+Cookies.get('program-session-id')+'"/><input type="hidden" name="price_id" value="'+promises[i].responseJSON.cart[j].price_id+'"/><select class="participant-count" name="number_participants">';
                            for(var k = 0; k <= 10; ++k) {
                              (k == promises[i].responseJSON.cart[j].number_participants) ? programCartItems += '<option value="'+k+'" selected>'+k+'</option>' : programCartItems += '<option value="'+k+'">'+k+'</option>';
                            }
                        programCartItems += '</select><textarea style="display:none;">'+jsonString+'</textarea></form>'+
                                              '<a class="delete-this-item" data-api="'+programAPI+'" data-id="'+promises[i].responseJSON.cart[j].program_id+'" data-session="'+programsSessionID+'" data-price="'+promises[i].responseJSON.cart[j].price_id+'" href="'+promises[i].responseJSON.cart[j].price_id+'">X</a></span></li>';
                                              
                        programTotal = parseFloat(promises[i].responseJSON.cart[j].total_cost) + parseFloat(programTotal);
                      } else {
  
                        cartItemDisplayDay = ( (new Date(promises[i].responseJSON.cart[j].date).getDay()+1) == 7 ) ? dotwArray[new Date(promises[i].responseJSON.cart[j].date).getDay()] : dotwArray[new Date(promises[i].responseJSON.cart[j].date).getDay()+1];
                        cartItemDate = new Date(promises[i].responseJSON.cart[j].date).getDate()+1;
  
                        ++facilityCount;
                        facilityCartItems += '<li data-id="'+promises[i].responseJSON.cart[j].facility_id+'" data-item-id="'+promises[i].responseJSON.cart[j].cart_item_id+'" class="cart-item insivia-frmp-row"><a href="#" class="blue cart-item-link">'+promises[i].responseJSON.cart[j].facility+'</a>'+
                                                '<span class="item-info insivia-frmp-row"><span class="cart-item-date">'+cartItemDisplayDay+', '+monthsArray[ new Date(promises[i].responseJSON.cart[j].date).getMonth() ]+' '+cartItemDate+', '+new Date(promises[i].responseJSON.cart[j].date).getFullYear()+'</span><span class="cart-item-time"><span class="start-time">'+cartItemStart+'</span> to <span class="end-time">'+cartItemEnd+'</span></span><span class="cart-item-price">$'+promises[i].responseJSON.cart[j].price+'</span>'+
                                                '<a class="delete-this-item" data-api="'+facilitiesAPI+'" data-id="'+promises[i].responseJSON.cart[j].cart_item_id+'" data-session="'+facilitiesSessionID+'" href="/'+promises[i].responseJSON.cart[j].facility_id+'">X</a></span></li>';
                          
                        facilityTotal = parseFloat(promises[i].responseJSON.cart[j].total_cost) + parseFloat(facilityTotal);
                      }
                    }
                  }
                }
              }
            }
          }
                    
          if( programCount == 0 ) { programCartItems += '<li class="empty-cart">Cart is empty</li>'; }
          
          if( facilityCount == 0 ) { facilityCartItems += '<li class="empty-cart">Cart is empty</li>'; }
          
          programCartItems += '</ul>';
          facilityCartItems += '</ul>'; 
          
            programCartItems += '<div class="total insivia-frmp-row"><p>Total: <span class="total-value">$'+parseFloat(programTotal).toFixed(2)+'</span></p><p><a class="continue-shopping" href="/programs-events-finder/">Search other programs</a><a id="cart-checkout" class="checkout" href="https://reservations.metroparks.org/checkout/?rsid='+programsSessionID+'">Checkout</a></p></div>';
            facilityCartItems += '<div class="total insivia-frmp-row"><p>Total: <span class="total-value">$'+parseFloat(facilityTotal).toFixed(2)+'</span></p><p><a id="cart-checkout" class="checkout" href="https://reservations.metroparks.org/checkout/?rsid='+facilitiesSessionID+'">Checkout</a></p></div>';
                                 
          programCartItems += '<div>';
          facilityCartItems += '</div>';
                    
          $('#register-cart').html(programCartItems);
          $('#reserve-cart').html(facilityCartItems);
          
          if( $('#clear-cart').length ==0 ) {
            $('#insivia-frmp-cart').append('<a id="clear-cart" href="">Clear Cart</a>');
          }
          
          $('.delete-this-item').click(function(e) {
            e.preventDefault();
              var $this = $(this);
            var url = ( $(this).attr('data-api') == programAPI ) ? baseUrl+$(this).attr('data-api')+'/cart/'+$(this).attr('data-session')+'/delete?session_id='+$(this).attr('data-session')+'&price_id='+$(this).attr('data-price')+'&program_id='+$(this).attr('data-id')+'&access_token='+accessToken : baseUrl+$(this).attr('data-api')+'/cart/'+$(this).attr('data-session')+'/delete?session_id='+$(this).attr('data-session')+'&cart_item_id='+$(this).attr('data-id')+'&access_token='+accessToken;                        
            $.getJSON(url, function(json) {
              Cookies.set('cart', json.cart.length);
              $('.shopping-cart-number').html(json.cart.length);
              ($this.closest('ul').parent().attr('id').indexOf('program')>-1) ? Cookies.set('program-session-id', json.session_id) : Cookies.set('reservation-session-id', json.session_id);
              the_cart( Cookies.get('program-session-id'), Cookies.get('reservation-session-id') );
            });
          });
          $('.participant-count').on('change', function() {
            var trgt = $(this).closest('form'),
                url = 'https://reservations.metroparks.org/api/v1/programs/cart/'+Cookies.get('program-session-id')+'/update';
            $.ajax({
              type: 'POST',
              url: url,
              crossDomain: true,
              processData: false,
              dataType: false,
              data: trgt.serialize(),
              success: function(data) {
              },
              error: function( jqXHR, textStatus, errorThrown ) {
                if(errorThrown ==  'Conflict') $('.insivia-frmp-message').html('This event is currently full.').addClass('red');
              }
            });                        
          });
          $('#clear-cart').click(function(e) {
            e.preventDefault();
            var promises = [],
                url1 = 'https://reservations.metroparks.org/api/v1/'+programAPI+'/cart/'+Cookies.get('program-session-id')+'/clear?access_token='+accessToken,
                url2 = 'https://reservations.metroparks.org/api/v1/'+facilitiesAPI+'/cart/'+Cookies.get('reservation-session-id')+'/clear?access_token='+accessToken;
            
            promises.push( $.getJSON(url1) );
            promises.push( $.getJSON(url2) );
            
            $.when.apply(null, promises).done(function() {
              
             if(promises.length) {
               for(var i = 0; i <= promises.length; ++i) {
                 if(promises[i]) {
                   
                     Cookies.set('program-cart-count', 0);
                     Cookies.set('reservation-cart-count', 0);
                   
                    var cookiep = (Cookies.get('program-cart-count') == 'undefined') ? Cookies.get('program-cart-count') : 0;
                    var cookier = (Cookies.get('reservation-cart-count') == 'undefined') ? Cookies.get('reservation-cart-count') : 0;
                    
                    var cart_count = parseInt(cookiep) + parseInt(cookier);
                   
                    if(!promises[i].responseJSON.cart.length) {
                      $('.header-cart-area').removeClass('show').attr('data-cart', '/cart/');
                      $('.shopping-cart-number').html(promises[i].responseJSON.cart.length);
                    }
                   the_cart( Cookies.get('program-session-id'), Cookies.get('reservation-session-id') );
                 }
               }
             }
                          
            });            
          });
        });
                
      } else {
        $('#register-cart').html(programCartItems+'<li class="empty-cart">Cart is empty</li></ul></div>');
        $('#reserve-cart').html(facilityCartItems+'<li class="empty-cart">Cart is empty</li></ul></div>');
      }
    }
    function search_results(url, append) {
      var results = '';
      //url = url.replace('%20&', '+%26');
      //url = url.replace('%20', '+');
      console.log(url);
      $.getJSON(url, function(json) {        
        var page = json.total_pages;

        if(page) {
          var promises = [];
          for(var i = 1; i <= page; ++i) {
            var jsonRequest = $.getJSON(url+'&page='+i);
            promises.push( jsonRequest );
          }
          
          $.when.apply(null, promises).done(function() {
            if(promises.length) {

              var programs = [];              

              $.each(promises, function(i, val) {
                if(promises[i]) {
                  $.each(promises[i].responseJSON.programs, function(j, val) {
                    if( promises[i].responseJSON.programs[j] ){
                      programs.push(promises[i].responseJSON.programs[j]);
                    }
                  });
                }
              });
                            
              if(programs.length) {
                $.each(programs, function(i, val) {
                  var cancellation = '';
                if(programs[i].is_cancelled == 1) {
                  cancellation = '<span class="red">Program Cancelled</span>';
                }
                                    
                  results += '<div class="blog-post-area">'+
                                '<div class="blog-list-title-area" style="width: 100%;">'+
                                  '<a href="http://'+window.location.hostname+'/programs-events-finder/?program_number='+programs[i].program_number+'&api=programs&type=program">'+
                                  '<h2>'+programs[i].title+'</h2></a>'+
                                  '<p>'+cancellation+' '+programs[i].description+'</p><a class="strategy-blog-post-button orange-btn btn" href="http://'+window.location.hostname+'/programs-events-finder/?program_number='+programs[i].program_number+'&api=programs&type=program" style="width: 30%;">Read More</a>'+
                                '</div>'+
                              '</div>';

                });
                
                if(!append) {
                  $('.blog-listing-area').html(results);
                } else {
                  $('.blog-listing-area').append(results);
                }
                
              }
            }
          });
        } else {
          $('.blog-listing-area').html(resultsNone);
        }                  
        
      }).done(function() {
        
      });
    }
    function faux_pagination(keyword) {
      var browserURL = window.location.href,
          apiURL = "https://reservations.metroparks.org/api/v1/programs/?keyword=",
          url, pages,
          alreadyPaged = $('.nav-links .page-numbers');
          
      $.each(alreadyPaged, function(i, val) {
        if(alreadyPaged[i]) {
          if( $(alreadyPaged[i]).attr('class').indexOf('prev')>-1 || $(alreadyPaged[i]).attr('class').indexOf('next')>-1 ) {
            alreadyPaged.splice(i, 1);
          }
        }
      });
                      
      if(!keyword) {
        
        if(browserURL.indexOf( '?s=' )>-1) {
          
          url = apiURL+browserURL.split('?s=')[1]+'&access_token='+accessToken;
          if(browserURL.indexOf('type=program')>-1) {
            url = url.replace('&type=program','');
            $('.blog-listing-area').html('');
            //url = url.replace('&', '%26').replace(' ','+');
            //url = url.replace(' ','+');
            //alert(url);
            search_results(url);
          } else {
                              
          $.getJSON(url, function(json) {
            pages = json.total_pages;
            
            console.log(pages);
          }).done(function() {
            // Override the 404 error page when results are in the API but not in Wordpress
            if(pages) {
              if( $('.search-no-results').length && pages ) {
                $('.blog-listing-area').html('');
                search_results(url);
              }
              
              // append additional pagination
              if( $('.nav-links .next').length ) {
                
                var it = parseInt($(alreadyPaged[alreadyPaged.length-1]).text()),
                    b = it;
                                  
                while(it<=(pages+b)) {
                  ++it;
                  $('.nav-links .next').before('<a class="page-numbers faux-pagination" data-page="'+(it-b)+'">'+it+'</a>');
                  if(it == (pages+b)) {
                    break;
                  }
                }
                
              } else {
                search_results(url, 1);
              }
              
              $('a.faux-pagination').click(function() {
                var pageNum = $(this).attr('data-page'),
                    val = $(this).text(),
                    current = $(this);
                
                $(this).replaceWith('<span class="page-numbers current faux-pagination" data-page="'+pageNum+'">'+val+'</span>');
                
                $.each($('.nav-links span.current'), function(i, val) {
                  var classes = $(this).attr('class'),
                      href,
                      dta = $(this).attr('data-page');                
                  if(classes.indexOf('faux-pagination') == -1) {
                    
                    ( parseInt( $(this).text() ) == 1) ? href = 'http://'+window.location.hostname+window.location.search : href = 'http://'+window.location.hostname+'/page/'+$(this).text()+'/'+window.location.search;
                    
                      $(this).replaceWith('<a class="page-numbers" href="'+href+'">'+$(this).text()+'</a>');
                  } else {
                    if( JSON.stringify($(this)) != JSON.stringify(current) ) {
                      $(this).replaceWith('<a class="page-numbers faux-pagination" data-page="'+dta+'">'+$(this).text()+'</a>');
                    }
                  }
                });
                              
                var nurl = url+'&page='+pageNum;
                search_results(nurl);
              });
              
              // Add the next button because it disapears on the final page of the Wordpress results
              if( $('.nav-links .next').length === 0 ) {
                $('.nav-links').append('<a class="next page-numbers">Next</a>');
              }
              
              $('.nav-links .next').click(function(e) {
                if( $('.nav-links span.current').attr('class').indexOf('faux')>-1 || $('.nav-links span.current').next().attr('class').indexOf('faux')>-1 ) {
                  e.preventDefault();
                                  
                  if( $('.nav-links span.current').next().attr('class').indexOf('next') == -1 ) {
                    var thisE = $('.nav-links span.current').next(),
                        pageNum = thisE.attr('data-page'),
                        val = thisE.text();
                                          
                    thisE.replaceWith('<span class="page-numbers current faux-pagination" data-page="'+pageNum+'">'+val+'</span>');
                                      
                    $.each($('.nav-links span.current'), function(i, val) {
                      var classes = $(this).attr('class'),
                          href,
                          dta = $(this).attr('data-page');  
                                        
                      if(classes.indexOf('faux-pagination') == -1) {
                        
                        ( parseInt( $(this).text() ) == 1) ? href = 'http://'+window.location.hostname+window.location.search : href = 'http://'+window.location.hostname+'/page/'+$(this).text()+'/'+window.location.search;
                        
                        $(this).replaceWith('<a class="page-numbers" href="'+href+'">'+$(this).text()+'</a>');
                      } else {
                        if( $(this).attr('data-page') !== $(thisE[0]).attr('data-page') ) {
                          $(this).replaceWith('<a class="page-numbers faux-pagination" data-page="'+dta+'">'+$(this).text()+'</a>');
                        }
                      }
                    });
                    
                    // Hide the next button on the last page of the API results to simulate default Wordpress functionality
                    if( $('.nav-links span.current').next().attr('class').indexOf('next')>-1 ) {
                      $('.nav-links .next').hide();
                    }
                  }
                  
                  var nurl = url+'&page='+pageNum;  
                  search_results(nurl);
                }
              });
              
              $('.nav-links .prev').click(function(e) {
                if( $('.nav-links span.current').attr('class').indexOf('faux')>-1 ) {
                  e.preventDefault();
                  
                  if( $('.nav-links span.current').prev().attr('class').indexOf('faux') == -1 ) {
                    window.open($('.nav-links span.current').prev().attr('href'),'_self');
                  }
                  
                  if( $('.nav-links span.current').prev().attr('class').indexOf('prev') == -1 ) {
  
                    var thisE = $('.nav-links span.current').prev(),
                        pageNum = thisE.attr('data-page'),
                        val = thisE.text();
  
                    thisE.replaceWith('<span class="page-numbers current faux-pagination" data-page="'+pageNum+'">'+val+'</span>');
  
                    $.each($('.nav-links span.current'), function(i, val) {
                      var classes = $(this).attr('class'),
                          href,
                          dta = $(this).attr('data-page');  
                                        
                      if(classes.indexOf('faux-pagination') == -1) {
                        
                        ( parseInt( $(this).text() ) == 1) ? href = 'http://'+window.location.hostname+window.location.search : href = 'http://'+window.location.hostname+'/page/'+$(this).text()+'/'+window.location.search;
                        
                        $(this).replaceWith('<a class="page-numbers" href="'+href+'">'+$(this).text()+'</a>');
                      } else {
                        if( $(this).attr('data-page') !== $(thisE[0]).attr('data-page') ) {
                          $(this).replaceWith('<a class="page-numbers faux-pagination" data-page="'+dta+'">'+$(this).text()+'</a>');
                        }
                      }
                    });
  
                    var nurl = url+'&page='+pageNum;  
                    search_results(nurl);
                  }
                }
              });
            }
            
          });//Done

          }
        } // end ?s=
      }  
    }
    
    function init_api_integration() {
      
      if(!navigator.cookieEnabled) {
        $('body').append('<div class="no-cookie-support">You must have browser cookies turned on in order to reserve a shelter or camping site or to register for a program.</div>');
      }
      faux_pagination()
      generate_faux_page();
      
      if(window.location.href.indexOf('?s=')) {
        $('.search-results').after('<p class="looking-for-programs">Are you searching for a program? <a href="/programs-events-finder/">Visit our Programs & Events Finder.</a></p>');
      }
      
      if($('#insivia-frmp-cart').length) the_cart( Cookies.get('program-session-id'), Cookies.get('reservation-session-id') );
      
      // Build all sub page sliders
      if($('.sub-slider').length ) put_to_slide($('.sub-slider').attr('data-api'), $('.sub-slider'), $('.sub-slider').attr('data-type'), $('.sub-slider').attr('data-value'), $('.sub-slider').attr('data-tag'), $('.sub-slider').attr('data-max'));
      
      // all gallery links
      $('.insivia-frmp-gallery-link').click(function(e) {
        e.preventDefault();
        put_to_slide($(this).children('a').attr('data-api'), $(this), $(this).children('a').attr('data-type'), $(this).children('a').attr('data-id'));
      });
            
      // Build home page slider
      if( $('#insivia-frmp-homepage-slider').length ) put_to_slide(programAPI, $('#insivia-frmp-homepage-slider'), 'home');
      
      // Build Calendar
      if( $('#insivia-frmp-calendar').length && $('#insivia-frmp-calendar-listview').length ) api_call('', 'calendar');
      
      // Build Facility Landing Page
      if( $('#insivia-frmp-shelter-map').length || $('#insivia-frmp-reserve-shelter').length ) api_call('', 'facilities');
      
      // Build Camping Landing Page
      if( $('#insivia-frmp-camping-map').length || $('#insivia-frmp-camping') ) api_call('', 'camps');
      
      var cookiep = (Cookies.get('program-cart-count')) ? Cookies.get('program-cart-count') : 0;
      var cookier = (Cookies.get('reservation-cart-count')) ? Cookies.get('reservation-cart-count') : 0;
            
      var cart_count = parseInt(cookiep) + parseInt(cookier);
      
      if(cart_count&&cart_count != 0) {
        $('.header-cart-area').addClass('show').attr('data-cart', '/cart/');
        $('.shopping-cart-number').html(cart_count);
      }
      
      $('.header-cart-area').click(function() {
        var url = '/cart/';
        window.open(url, "_self");
      });
      
      if( $('body').attr('class').indexOf('page-id-76')>-1 ) {
        $('.rental-collapse-content-area').before('<div id="reserve-ice-rink" class="insivia-frmp-row"><a class="blue-btn btn reserve-now" data-id="786160">Reserve now</a></div>');
      }
      
    }//init

    $(document).ready(function() {
      if ($('.insivia-frmp-lighbox').length === 0)
        $('body').append('<div class="insivia-frmp-lighbox"></div>');

      init_api_integration();
    });
  });

})(jQuery, this);