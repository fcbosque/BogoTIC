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
  this.viewFolder = 'usuario';
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

    index: function () {
      var self = this;
      this.getModel('Usuario').all(function(usuarios) {
        if (usuarios) {
          self.locals.usuarios = usuarios;
        }
        self.render('index', self.locals);
      });
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

    new: function () {
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
    
    create: function () {
      var self = this;
      var usuario = this.request.body.usuario;
      // Verificamos si viene un archivo como imagen
      if (this.request.files) {
        if (this.request.files.usuario && this.request.files.usuario.avatar
          // Hack para evitar la subida de archivos vacios (Chrome)
          && this.request.files.usuario.avatar.size > 0) {
          var imagen = this.request.files.usuario.avatar;
          usuario.avatar = imagen.path.split('public').pop();
        }
      }
      this.getModel('Usuario').create(usuario, function(err, usuario) {
        if (err) {
          console.log(err);
          self.request.flash('error', err.message);
        } else {
          self.request.flash('success', 'Usuario creado con exito!');
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
      // Nos aseguramos que este un usuario logueado.
      if (this.request.session.usuario) {
        if (this.locals.usuario && this.locals.usuario === this.request.session.usuario) {
          this.render('show', this.locals);
        }
      } else {
        this.response.redirect('/');
      }
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

    remove: function () {
      var self = this;
      var username = this.request.params.username;
      this.getModel('Usuario').remove(username, function (usuario) {
        self.send(200);
      });
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
   
    modify: function () {
      var self = this;
      var username = this.request.params.username;
      this.getModel('Usuario').modify(username, params, function (usuario) {
        self.send(200);
      });
    },

    /**
     * Identifica un usario ante el sistema
     * 
     * Si los datos son correctos los datos son puestos
     * en la sesion. Si el ingreso es exitoso se redirecciona a /
     * de lo contrario de vuelta a /usuarios/login
     * 
     * @api public
     * @redirect /
     * @param {Object} usuario
     */

    login: function () {
      var self = this;
      var data = this.request.body.usuario;
      this.getModel('Usuario').authenticate(data, function (err, user) {
        if (err) {
          self.request.flash('error', err.message);
          self.response.redirect('/usuarios/login');
        }
        if (user) {
          self.request.session.usuario = user;
          self.response.redirect('/');
        }
      });
    },

    /**
     * Destruimos la sesion
     * 
     * @api public
     * @redirect /
     */

    logout: function () {
      this.request.session.destroy();
      this.response.redirect('/');
    },

    /**
     * Simplemente renderizamos el formulario de login
     * 
     * @api public
     */

    loginForm: function () {
      this.render('login', this.locals);
    }
  });
