/**
 * @file ajax_calendar_views.js
 *
 * Handles AJAX fetching of calendar views, including filter submission and response.
 */
 
/**
 * Ajax behavior for calendar views - based on ajax_views.js
 */
Drupal.behaviors.CalendarViewsAjaxView = function() {
  if (Drupal.settings && Drupal.settings.views && Drupal.settings.views.ajaxViews) {
    var ajax_path = Drupal.settings.views.ajax_path;
    // If there are multiple views this might've ended up showing up multiple times.
    if (ajax_path.constructor.toString().indexOf("Array") != -1) {
      ajax_path = ajax_path[0];
    }
    $.each(Drupal.settings.views.ajaxViews, function(i, settings) {
      var view = '.view-dom-id-' + settings.view_dom_id;
      if (!$(view).size()) {
        // Backward compatibility: if 'views-view.tpl.php' is old and doesn't
        // contain the 'view-dom-id-#' class, we fall back to the old way of
        // locating the view:
        view = '.view-id-' + settings.view_name + '.view-display-id-' + settings.view_display_id;
      }

      $(view).filter(':not(.calendar-views-processed)')
        // Don't attach to nested views. Doing so would attach multiple behaviors
        // to a given element.
        .filter(function() {
          // If there is at least one parent with a view class, this view
          // is nested (e.g., an attachment). Bail.
          return !$(this).parents('.view').size();
        })
        .each(function() {
          // Set a reference that will work in subsequent calls.
          var target = this;
          $(this)
            .addClass('calendar-views-processed')
            // Process pager, tablesort, and summary links.
            .find('.calendar-calendar > .date-nav > .date-next a, .calendar-calendar > .date-nav > .date-prev a')
            .each(function () {
              var viewData = {};
              // Construct an object using the settings defaults and then overriding
              // with data specific to the link.
              $.extend(
                viewData,
                settings,
                Drupal.Views.parseQueryString($(this).attr('href')),
                // Extract argument data from the URL.
                Drupal.Views.parseViewArgs($(this).attr('href'), settings.view_base_path)
              );
              $(this).click(function () {
                $(this).addClass('views-throbbing');
                $.ajax({
                  url: ajax_path,
                  type: 'GET',
                  data: viewData,
                  success: function(response) {
                    $(this).removeClass('views-throbbing');
                    // Call all callbacks.
                    if (response.__callbacks) {
                      $.each(response.__callbacks, function(i, callback) {
                        eval(callback)(target, response);
                      });
                    }
                  },
                  error: function() { $(this).removeClass('views-throbbing'); alert(Drupal.t("An error occurred at @path.", {'@path': ajax_path})); },
                  dataType: 'json'
                });

                return false;
              });
            }); // .each function () {
      }); // $view.filter().each
    }); // .each Drupal.settings.views.ajaxViews
  } // if
};
