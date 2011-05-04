<?php
// $Id: calendar-mini.tpl.php,v 1.1.2.6 2008/11/23 01:46:21 karens Exp $
/**
 * @file
 * Template to display a view as a mini calendar month.
 * 
 * @see template_preprocess_calendar_mini.
 *
 * $day_names: An array of the day of week names for the table header.
 * $rows: An array of data for each day of the week.
 * $view: The view.
 * $min_date_formatted: The minimum date for this calendar in the format YYYY-MM-DD HH:MM:SS.
 * $max_date_formatted: The maximum date for this calendar in the format YYYY-MM-DD HH:MM:SS.
 * 
 * $show_title: If the title should be displayed. Normally false since the title is incorporated
 *   into the navigation, but sometimes needed, like in the year view of mini calendars.
 * 
 */
//dsm('Display: '. $display_type .': '. $min_date_formatted .' to '. $max_date_formatted);

/*drupal_add_css('sites/all/modules/custom/jquery_tipsy/stylesheets/tipsy.css');
drupal_add_js('sites/all/modules/custom/jquery_tipsy/javascripts/jquery.tipsy.js', 'module');
$js = "$(document).ready( function() {
  $('.calendar-tooltip a').tipsy({html: true, title: function() { return $(this).parent().prev().html(); }});
});";
drupal_add_js($js, 'inline');*/
?>
<div class="calendar-calendar"><div class="month-view">
<?php if ($view->date_info->show_title): ?>
  <?php print theme('date_navigation', $view); ?>
<?php endif; ?> 
<table class="mini">
  <thead>
    <tr>
      <?php foreach ($day_names as $cell): ?>
        <th class="<?php print $cell['class']; ?>">
          <?php if (function_exists('_to_full_thai_day')): ?>
          <?php if (arg(0) == 'event') $cell['data'] = _to_full_thai_day($cell['data']); ?>
          <?php endif; ?>
          <?php print $cell['data']; ?>
        </th>
      <?php endforeach; ?>
    </tr>
  </thead>
  <tbody>
    <?php foreach ((array) $rows as $row): ?>
      <tr>
        <?php foreach ($row as $cell): ?>
        
          <td id="<?php print $cell['id']; ?>" class="<?php print $cell['class']; ?>">
            <?php if ($cell['events']): ?>
            <div class="qtip-link tooltip-text">
              <div class="qtip-header"><?php print t('List') ?></div>
              <div class="qtip-tooltip">
                <ul>
                <?php foreach ($cell['events'] as $event): ?>
                  <?php if (arg(0) == 'event'): ?>
                  <li class="node-type-<?php print $event['type'] ?>"><?php print l($event['title'], 'event/'. $event['nid']); ?></li>
                  <?php else: ?>
                  <li class="node-type-<?php print $event['type'] ?>"><?php print l($event['title'], 'node/'. $event['nid']); ?></li>
                  <?php endif; ?>
                <?php endforeach; ?>
                </ul>
              </div>
              <?php print strip_tags($cell['data'], '<div>'); ?>
            </div>
            <?php else: ?>
              <?php print strip_tags($cell['data'], '<div>'); ?>
            <?php endif; ?>
          </td>
        <?php endforeach; ?>
      </tr>
    <?php endforeach; ?>
  </tbody>
</table>
</div></div>
