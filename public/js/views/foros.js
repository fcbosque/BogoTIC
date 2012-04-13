define([
  "jQuery",
  "Underscore",
  "Backbone",
  "models/foro"
  ], function($, _, Backbone, Foro) {

  var ForoView = Backbone.View.extend({
    model: Foro,
    tagName: "li",
    events: {

    },
    initialize: function() {

    },
    render: function() {

    }
  });

  return ForoView;
});
