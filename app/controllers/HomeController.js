/*!
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

module.exports = require(app.set('controllers') + '/ApplicationController').extend(function () {
  var self = this;
  this.events.on('render:*', function (req) {
    self.getModel('Evento').saveEvent(this.event, req);
  });
})
  .methods({
    /**
     * Ruta de index
     *
     * @api public
     * @render index
     */
    index: function () {
      this.locals.esIndex = true;
      if (this.request.session.usuario) {
        this.events.emit('render:dashboard', this.request);
        this.render('dashboard', this.locals);
      } else {
        this.events.emit('render:home', this.request);
        this.render('index', this.locals);
      }
    },
    /**
     * Ruta de acerca
     *
     * @api public
     * @render acerca
     */
    acerca: function() {
      this.events.emit('render:acerca', this.request);
      this.render('acerca', this.locals);
    },
    /**
     * Ruta de ayuda
     *
     * @api public
     * @render ayuda
     */
    ayuda: function() {
      this.events.emit('render:ayuda', this.request);
      this.render('ayuda', this.locals);
    },
    /**
     * Ruta de TOS
     *
     * @api public
     * @render tos
     */
    tos: function() {
      this.events.emit('render:tos', this.request);
      this.render('tos', this.locals);
    }
  })
