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

module.exports = require(app.set('controllers') + '/ApplicationController').extend(function() {
  this.viewFolder = 'usuario'
}).methods({
    /**
     * Renderiza el listado de usuarios.
     * 
     * Los objetos que se envian a la plantilla son
     *
     *  - `foros` arreglo de objetos foro
     *  - `usuarios` arreglo de objetos usuario
     * 
     * @api public
     * @render usuario/index
     * @param {Object} foros
     * @see ApplicationController.index
     * @see UsuarioModel.all
     */

    index: function() {
      var self = this;
      this.getModel('Usuario').all(function(usuarios) {
        self.render('index', {
          usuarios: usuarios,
          foros: this.response.foros
        })
      })
    },

    /**
     * Renderiza el formulario para la creación de usuarios.
     *
     * Los objetos que se envian a la plantilla son
     *
     *  - `foros` arreglo de objetos foro
     * 
     * @api public
     * @render usuario/new
     * @see ApplicationController.new
     */

    new: function() {
      this.render('new', { foros: this.response.foros });
    },

    /**
     * Crea un nuevo usuario en la base de datos.
     *
     * El nuevo usuario se construye mediante los middlewares de
     * express para luego ser enviado al modelo de Usuario para ser
     * almacenado. Arroja una excepción en caso de error.
     *
     * @api public
     * @redirect /
     * @param {Object} usuario
     * @see ApplicationController.create
     * @see UsuarioModel.create
     */
    
    create: function() {
      var self = this;
      var usuario = this.request.body.usuario;
      this.getModel('Usuario').create(usuario, function(err, usuario) {
        if (err) console.log(err);
        self.response.redirect("/");
      });
    },

    /**
     * Renderiza un usuario en particular.
     *
     * Los objetos que se envian a la plantilla son
     *
     *  - `foros` arreglo de objetos foro
     *  - `usuario` objeto de usuario nuevo
     *
     * @api public
     * @render usuario/show
     * @param {String} username
     * @see ApplicationController.show
     * @see UsuarioModel.show
     */

    show: function() {
      var self = this;
      var username = this.request.params.username;
      this.getModel('Usuario').show(username, function(usuario) {
        self.render('show', {
          usuario: usuario,
          foros: this.response.foros
        })
      })
    },

    /**
     * Elimina un usuario en particular.
     *
     * @api public
     * @redirect /
     * @param {String} username
     * @see ApplicationController.remove
     * @see UsuarioModel.remove
     */

    remove: function() {
      var self = this;
      var username = this.request.params.username;
      this.getModel('Usuario').remove(username, function(usuario) {
        self.send(200);
      })
    },

    /**
     * Modifica un usuario en particular.
     *
     * @api public
     * @redirect /usuario/:username
     * @param {String} username
     * @param {Object} params
     * @see ApplicationController.modify
     * @see UsuarioModel.modify
     */
   
    modify: function() {
      var self = this;
      var username = this.request.params.username;
      this.getModel('Usuario').modify(username, params, function(usuario) {
        self.send(200);
      });
    },
    login: function () {
      var self = this;
      var data = this.request.body.usuario;
      this.getModel('Usuario').authenticate(data, function (err, user) {
        if (err) console.log(err);
        if (user) {
          // @todo Poner en el middleware de sessiones.
          self.response.usuario = user;
          console.log('Mostrando', user);
          self.render('../index');
        } else {
          self.response.message = { type: 'Error', message: 'El usuario no se encontro'};
          self.response.redirect('/');
        }
      });
    }
  })
