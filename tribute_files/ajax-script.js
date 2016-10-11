/*    jQuery(document).ready(function() {

      //Assign to a variable so that we can use it anytime
      var post_ajax = function(post_type, post_status, category_name, taxonomy, term, order, orderby, posts_per_page) {
        
        //Check if vars are empty and assign a default value if it is
        if(!post_type) { post_type = 'post'; } 
        if(!post_status) { post_status = 'publish'; }
        if(!category_name) { category_name = ''; }
        if(!taxonomy) { taxonomy = ''; }
        if(!term) { term = ''; }
        if(!order) { order = 'ASC'; }
        if(!orderby) { orderby = 'date'; }
        if(!posts_per_page) { posts_per_page = -1; }

        //jQuery ajax call                
        $.ajax({
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
            'term' : term
          },
          success : function(data) {
            //If it works
            console.log('successful');
            
            /*
             * data is what will be returned from your target php function
             * you would utilize jQuery to append the data to what ever container you would like
             * I'm in the proccess of making the target a variable so I am just printing everything
             * to the console
             **************************************************************************************/
             
            /*console.log(data);
          },
          error : function(xhr, textStatus, errorThrown) {
            //If it doesn't work
            console.error('error');
            //XMLHttpRequest
            console.log(xhr+ ' :: ' +textStatus+' :: '+errorThrown);
          }
        });
      };
      
      //Call the function from any where
      //post_ajax('portfolio', 'publish', 'branding-category', 'project-type', 'annual-reports' );
      
    });*/