/*
 * This file is part of Foros BogoTIC.
 *
 * Foros BogoTIC is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 * 
 * Foros BogoTIC is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 * 
 * You should have received a copy of the GNU General Public License
 * along with Foros BogoTIC.  If not, see <http://www.gnu.org/licenses/>.
*/

define([
  "jquery",
  "underscore",
  "backbone",
  "collections/foros",
  "views/foros"
  ], function($, _, Backbone, ForoCollection, ForoView) {

  var AppView = Backbone.View.extend({
    el: $("#contenedor"),
    events: {
      "click .algo": "function"
    },
    initialize: function() {
      this.Foros = new ForoCollection();


      //this.Foros.fetch();
    },
    render: function() {

    }
  });

  return AppView;
});
