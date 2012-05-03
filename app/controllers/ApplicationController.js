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
  this.viewFolder = '';
  this.addBeforeFilter(this.allForos);
  this.addBeforeFilter(this.usuarioActual);
  this.addBeforeFilter(['new'], this.estaLogueado);
  this.addBeforeFilter(this.errorsToLocals);

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

    allForos: function (callback) {
      var self = this;
      this.getModel('Foro').all(function (err, foros) {
        self.locals.foros = (foros ? foros : []);
        self.locals.organizado = function () {
          var res = [],
              listado = foros.map(function (f) { return { foro:f }; });
          for (var i=0; i <= listado.length; i+=3 ) {
            res.push({ filas: listado.slice(i, i + 3) });
          }
          return res;
        };
        return callback(null);
      });
    },

    /**
     * Agrega el usuario actualmente ingresado en la aplicación
     * en el objeto `response` para ser usado en todos los
     * controladores si el usuario se encuentra autorizado y su
     * cookie como su sessión han sido validados.
     * 
     * Si el usuario es administrador, tambien se pobla el objeto
     * admin para ser pasado en las vistas.
     *
     * @api private
     * @return {Function} callback del controlador
     */

    usuarioActual: function (callback) {
      var self = this,
          user = this.request.session.usuario;

      if (user) {
        self.locals.usuario = user;
      }

      if (user && user.admin == true) {
        self.locals.admin = user;
      }

      return callback(null);
    },

    /**
     * Verifica si el usuario que solicita el recurso tiene una session
     * iniciada con un usuario. De otro modo lo mandamos al inicio '/'
     * 
     * @api private
     * @return {Function} callback del controlador
     */

    estaLogueado: function (callback) {
      if (this.request.url === "/usuarios/nuevo") {
        // Hack para permitir mostrar el formulario de creacion de usuario.
        return callback(null);
      } else
      if (this.request.session.usuario) {
        return callback(null);
      } else {
        this.response.redirect('/');
      };
    },

    /**
     * Copia los errores guardados dentro de la sesion a los
     * locales del proximo render.
     * 
     * @api private
     * @return {Function} callback del controlador
     */

    errorsToLocals: function (callback) {
      var self = this;
      this.locals.errores = [];
      v.each(['success', 'info', 'error'], function (tipo) {
        var mensajes = self.request.flash(tipo);
        if (mensajes.length > 0) {
          v.each(mensajes, function (mensaje) {
            self.locals.errores.push({
              tipo: tipo,
              message: mensaje
            });
          });
        }
      });
      return callback(null);
    }
  });
