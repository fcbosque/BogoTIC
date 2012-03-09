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

/**
 * El modelo de usuarios.
 *
 * @api public
 */

module.exports = require(app.set('models') + '/ApplicationModel').extend(function() {
  var localidades = this.localidades;
  var ObjectId = this.ObjectId;

  var UsuarioSchema = new this.Schema({
    nombre          : { type: String, required: true, match: /[a-z]/ },
    apellido        : { type: String, required: true, match: /[a-z]/ },
    localidad       : { type: String, required: false, enum: localidades },
    edad            : { type: Number, required: false },
    educacion       : { type: String, required: false },
    correo          : { type: String, required: true },
    avatar          : { type: String, required: true, default: 'avatar.png' },
    fecha           : { type: Date, required: true, default: Date.now },
    karma           : { type: Number, required: false, default: 0 },
    url             : { type: String, required: false, default: "http://bogotic.com" },
    twitter         : { type: String, required: false },
    foros           : { type: Array, required: false },
    avisos          : { type: Boolean, required: false, default: true },
    mensajes        : [MensajeSchema],
    notificaciones  : [NotificacionSchema]
  });

  this.DBModel.plugin(this.mongooseAuth, {
    password: true
  });

  var MensajeSchema = new this.Schema({
    titulo    : { type: String, required: true, match: /[a-z]/ },
    autor     : { type: ObjectId, required: true },
    contenido : { type: String, required: true },
    fecha     : { type: Date, required: true, default: Date.now }
  })

  var NotificacionSchema = new this.Schema({
    titulo    : { type: String, required: true, match: /[a-z]/ },
    tipo      : { type: String, required: true },
    contenido : { type: String, required: true },
    fecha     : { type: Date, required: true, default: Date.now }
  })

  this.Mensaje      = this.mongoose.model('Mensaje', MensajeSchema);
  this.Notificacion = this.mongoose.model('Notificacion', NotificacionSchema);
  this.DBModel      = this.mongoose.model('Usuario', UsuarioSchema);
}).methods({
     
    /**
     * Devuelve todos los usuarios disponibles en la base de datos.
     *
     * Ejecuta el callback especificado por el controlador con
     * un arreglo que contiene todos los usuarios, de lo contrario
     * arroja una excepción con el error.
     *
     * @api public
     * @param {Function} callback
     */

    all: function(callback) {
      this.DBModel.find({}, function(err, usuarios) {
        if(err) throw new Error(err);
        if(callback) callback(usuarios);
      })
    },

    /**
     * Mostrar usuario individual.
     *
     * La busqueda del usuario la realiza mongoose, arrojando
     * una excepción en caso de error o ejecutando el callback
     * especificado en el controlador con el objeto de usuario.
     *
     * La busqueda se realiza mediante `username` el resultado
     * se pasa como parámetro en el `callback` que especifica
     * el controlador.
     *
     * @api public
     * @param {String} username
     * @param {Function} callback
     * @see ForoController.show
     */

    show: function(username, callback) {
      this.DBModel.find({ username: username }, function(usuario, callback) {
        if(err) throw new Error(err);
        if(callback) callback(usuario);
      })
    },
    modify: function(username, params, callback) {
      
    },
    remove: function(username, callback) {
    
    },

    /**
     * Creación de un nuevo usuario.
     *
     * La acción de guardar la ejecuta directamente mongoose
     * junto con el callback especificado en el controlador.
     *
     * El recurso es guardado en una colección independiente
     * con una propiedad `resource`.
     *
     * @api public
     * @param {Object} resource
     * @param {Function} callback
     * @see UsuarioController.create
     */
    
    create: function(resource, callback) {
      var _resource = new this.DBModel(resource);
      _resource.save(callback);
    }
  })
