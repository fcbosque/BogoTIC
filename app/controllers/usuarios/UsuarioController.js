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
  var self = this;
  this.viewFolder = 'usuario';
  this.events.on('user:*:*', function (req, data) {
    self.getModel('Evento').saveEvent(this.event, req, data);
  });
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
        if (usuarios) {
          self.locals.usuarios = usuarios;
        }
        self.render('index', self.locals);
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
      this.events.emit('user:creacion:form', this.request);
      this.render('new', this.locals);
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
      this.events.emit('user:creacion:inicia', this.request, usuario);
      this.getModel('Usuario').create(usuario, function(err, usr) {
        if (err) {
          console.log(err);
          self.events.emit('user:creacion:error', self.request, err);
          self.request.flash('error', err.message);
        } else {
          self.events.emit('user:creacion:exito', self.request, usr);
          self.request.flash('success', 'Usuario creado con exito!')
        }
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
        if (usuario) {
          self.locals.usuario = usuario;
        }
        self.render('show', self.locals);
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
        if (err) self.request.flash('error', err.message);
        if (user) {
          self.request.session.usuario = user;
        } else {
          self.request.flash('error', 'El usuario no se encontro');
        }
        self.response.redirect('/');
      });
    },
    logout: function () {
      this.request.session.destroy();
      this.response.redirect('/');
    }
  })
