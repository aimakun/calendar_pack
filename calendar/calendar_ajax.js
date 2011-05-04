/**
 * Ensure Calendar namespace is established.
 */
Drupal.Calendar = Drupal.Calendar || {};

Drupal.behaviors.calendarAjax = function(context) {
  // check only with the views that has the ajax option set on
  // this function only exists if there is some calendar with ajax on
  $.each(Drupal.settings.views.ajaxViews, function(i,settings) {
      // check if the calendar theme has added the views name and then add the ajax feature
      if ( typeof( Drupal.settings.calendar_ajax[settings.view_name] ) != "undefined"){
        Drupal.Calendar.makeCalendarAjaxy(i);
      }
  });
};

Drupal.Calendar.makeCalendarAjaxy = function(i) {
  if(Drupal.settings.views.ajaxViews[i]) {

    //--- BASIC SETTINGS ----------------------------------------
    var settings        = Drupal.settings.views.ajaxViews[i];
    var view_name       = settings.view_name;
    var view_display_id = settings.view_display_id;
    var view_dom_id     = settings.view_dom_id;
    var ajax_path = ((Drupal.settings.views.ajax_path instanceof Array) ? Drupal.settings.views.ajax_path[i]:Drupal.settings.views.ajax_path);

    var view_scope = '.view-id-' + view_name + '.view-display-id-' + view_display_id + '.view-dom-id-' + view_dom_id ;

    //--- GET THE NEXT/PREV ARGUMENTS ----------------------------
    var prev_date = new Date();
    var next_date = new Date();
    var view_args_next = '';
    var view_args_prev = '';
	var urlargs = settings.view_args.split('/');
	
	if(urlargs instanceof Array && urlargs.length>0){
		var args = urlargs[0].split('-');		
		args[0] = parseInt(args[0]);
		delete urlargs[0];
		urlargs = urlargs.join('/');
	} else {
		var args = urlargs.split('-');		
		args[0] = parseInt(args[0]);
		urlargs = '';
	}
	//not a calendar?
	if (isNaN(args[0])) return;

		switch(args.length) {
		  case 1:
			//year view
			prev_date.setFullYear(args[0]-1,1,1);
			view_args_prev = '' + (prev_date.getFullYear()) + urlargs;
			next_date.setFullYear(args[0]+1,1,1);
			view_args_next = '' + (next_date.getFullYear()) + urlargs; 
			break;
		  case 2:
			if (args[1].charAt(0)=='W') {
			  //week view
			  //we cheat here
			  var current = parseInt(args[1].substr(1));
			  var href = $(view_scope + ' .calendar-calendar .date-prev a').attr('href').split('/');
			  view_args_prev = args[0]+'-W'+(current-1) + urlargs;
			  href = $(view_scope + ' .calendar-calendar .date-next a').attr('href').split('/');
			  view_args_next = args[0]+'-W'+(current+1) + urlargs;
			}
			else {
			  //month view
			  args[1] = parseInt(args[1],10);
			  prev_date.setFullYear(args[0],args[1]-2,1);
			  view_args_prev = '' + (prev_date.getFullYear()) + '-' + ((prev_date.getMonth()+1) < 10 ? '0' : '') + (prev_date.getMonth()+1) + urlargs;
			  next_date.setFullYear(args[0],args[1],1);
			  view_args_next = '' + (next_date.getFullYear()) + '-' + (next_date.getMonth()+1) + urlargs;
			}
			break;
		  case 3:
			//day view
			args[1] = parseInt(args[1],10);
			args[2] = parseInt(args[2],10);
			prev_date.setFullYear(args[0],args[1]-1,args[2]-1);
			view_args_prev = '' + (prev_date.getFullYear()) + '-' + (prev_date.getMonth()+1) + '-' + (prev_date.getDate()) + urlargs;
			next_date.setFullYear(args[0],args[1]-1,args[2]+1);
			view_args_next = '' + (next_date.getFullYear()) + '-' + (next_date.getMonth()+1) + '-' + (next_date.getDate()) + urlargs;
			break;
		  default:
			//not calendar?
			return;
		}
	

    //--- CHANGE THE NEXT/PREV LINKS -----------------------------

    //--- attach ajax calls on the prev buttons -------------
    $(view_scope + ' .calendar-calendar .date-prev a:not(.calendar-ajax-processed)').click( function() {
      $(this).addClass('views-throbbing')
      $.ajax({
        url: ajax_path,
        data: {
          'js': 1,
          'view_name': view_name,
          'view_display_id': view_display_id,
          'view_dom_id': view_dom_id,
          'view_args': view_args_prev
        },
        dataType: 'json',
        success: function (data, status, request) {
          //--- some basic update -----------------
          Drupal.settings.views.ajaxViews[i].view_args = view_args_prev;
          Drupal.settings.views.ajaxViews[i].view_path = settings.view_base_path+'/'+view_args_prev;
          //--- upload the new view ---------------
          Drupal.Views.Ajax.ajaxViewResponse(view_scope,data);
          $('a.views-throbbing').removeClass('views-throbbing');
        },
        error: function() { $(this).removeClass('views-throbbing');}
      });
      return false;
    });
    $(view_scope + ' .calendar-calendar .date-prev a').addClass('calendar-ajax-processed');

    //--- attach ajax calls on the next buttons -------------
    $(view_scope + ' .calendar-calendar .date-next a:not(.calendar-ajax-processed)').click( function() {
      $(this).addClass('views-throbbing')
      $.ajax({
        url: ajax_path,
        data: {
          'js': 1,
          'view_name': view_name,
          'view_display_id': view_display_id,
          'view_dom_id': view_dom_id,
          'view_args': view_args_next
        },
        dataType: 'json',
        success: function (data, status, request) {
          //--- some basic update -----------------
          Drupal.settings.views.ajaxViews[i].view_args = view_args_next;
          Drupal.settings.views.ajaxViews[i].view_path = settings.view_base_path+'/'+view_args_next;
          //--- upload the new view ---------------
          Drupal.Views.Ajax.ajaxViewResponse(view_scope,data);
          $('a.views-throbbing').removeClass('views-throbbing');
        },
        error: function() { $(this).removeClass('views-throbbing');}
      });
      return false;
    });
    $(view_scope + ' .calendar-calendar .date-next a').addClass('calendar-ajax-processed');

  }
}