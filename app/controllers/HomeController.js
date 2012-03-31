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

module.exports = require(app.set('controllers') + '/ApplicationController').extend()
  .methods({
    /**
     * Ruta de index
     *
     * @api public
     * @render index
     */
    index: function () {
      if (this.request.session.usuario) {
        this.render('dashboard', { usuario: this.request.session.usuario });
      } else {
        this.render('index', { foros: this.response.foros });
      }
    },
    /**
     * Ruta de acerca
     *
     * @api public
     * @render acerca
     */
    acerca: function() {
      this.render('acerca', { foros: this.response.foros });
    },
    /**
     * Ruta de ayuda
     *
     * @api public
     * @render ayuda
     */
    ayuda: function() {
      this.render('ayuda', { foros: this.response.foros });
    },
    /**
     * Ruta de TOS
     *
     * @api public
     * @render tos
     */
    tos: function() {
      this.render('tos', { foros: this.response.foros });
    }
  })
