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

module.exports = require('matador').BaseController.extend(function () {
  this.viewFolder = ''
  this.addBeforeFilter(this.allForos)
  this.addBeforeFilter(this.usuarioActual)

  // Creo este espacio para ir almacenando las locals que deban meter
  // los otros middlewares.
  this.locals = {};
}).methods({
    /**
     * Agrega un arreglo que contiene todos los foros al objeto
     * `response` para luego poder ser usados en todas las vistas.
     *
     * @api private
     * @return {Function} callback del controlador
     */

    allForos: function(callback) {
      var self = this;
      this.getModel('Foro').all(function(foros) {
        self.locals.foros = (foros ? foros : []);
        return callback(null)
      })
    },

    /**
     * Agrega el usuario actualmente ingresado en la aplicación
     * en el objeto `response` para ser usado en todos los
     * controladores si el usuario se encuentra autorizado y su
     * cookie como su sessión han sido validados.
     *
     * @api private
     * @return {Function} callback del controlador
     */

    usuarioActual: function(callback) {
      var self = this,
          user = this.request.session.usuario;

      if (user) {
        self.locals.usuario = user;
      }

      return callback(null)
    }
  });
