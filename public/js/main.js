$(function() {
  $("a[rel=popover]").popover({ offset: 10 }).click(function(e) { e.preventDefault() })
  $('#actividad-reciente a:first').tab('show')
})
