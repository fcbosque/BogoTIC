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

/**
 * El modelo de usuarios.
 *
 * @api public
 */

var crypto = require('crypto');

module.exports = require(app.set('models') + '/ApplicationModel').extend(function() {
  var localidades = this.localidades;
  var ObjectId = this.ObjectId;

  var UsuarioSchema = new this.Schema({
    nombre          : { type: String,  required: true, match: /[a-z]/ },
    apellido        : { type: String,  required: true, match: /[a-z]/ },
    admin           : { type: Boolean, required: false, default: false },
    localidad       : { type: String,  required: false, enum: localidades },
    edad            : { type: Number,  required: false },
    educacion       : { type: String,  required: false },
    correo          : { type: String,  required: true },
    avatar          : { type: String, required: false, default: '/img/avatar.png' },
    fecha           : { type: Date,    required: true, default: Date.now },
    karma           : { type: Number,  required: false, default: 0 },
    url             : { type: String,  required: false, default: "http://bogotic.com" },
    twitter         : { type: String,  required: false },
    foros           : { type: Array,   required: false },
    avisos          : { type: Boolean, required: false, default: true },
    password        : { type: String,  required: false },
    mensajes        : [MensajeSchema],
    notificaciones  : [NotificacionSchema],
    favoritos       : { type: Array,   required: false }
  });

  var MensajeSchema = new this.Schema({
    titulo    : { type: String,   required: true, match: /[a-z]/ },
    autor     : { type: ObjectId, required: true },
    contenido : { type: String,   required: true },
    fecha     : { type: Date,    required: true, default: Date.now }
  });

  var NotificacionSchema = new this.Schema({
    titulo    : { type: String, required: true, match: /[a-z]/ },
    tipo      : { type: String, required: true },
    contenido : { type: String, required: true },
    fecha     : { type: Date,   required: true, default: Date.now }
  });

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

    all: function (callback) {
      this.DBModel.find({}, function (err, usuarios) {
        if (err) throw new Error(err);
        if (callback) callback(usuarios);
      });
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

    show: function (username, callback) {
      this.DBModel.find({ username: username }, function (err, usuario) {
        if (err) throw new Error(err);
        if (callback) callback(usuario);
      });
    },
    modify: function (username, params, callback) {
      
    },
    remove: function (username, callback) {
    
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
    
    create: function (resource, callback) {
      resource.password = crypto.createHmac('sha256', 'BOGOTIC').update(resource.clave).digest('hex');
      delete resource.clave;
      var _resource = new this.DBModel(resource);
      _resource.save(callback);
    },

    /**
     * Autenticacion de un usuario.
     *
     * Simplemente ciframos debilmente la clave y comparamos
     * con el hash que hay guardado en la BD.
     *
     * @param {Object} loginData La info ingresada por el usuario
     */

    authenticate: function (loginData, callback) {
      this.DBModel.findOne({correo:loginData.correo}, function (err, user) {
        if (err) throw new Error(err);
        if (user) {
          // FIXME: Se debe cambiar el salt. Seguimiento en #45
          var clave = crypto.createHmac('sha256', 'BOGOTIC').update(loginData.clave).digest('hex');
          if (clave === user.password) {
            callback(null, user);
          } else {
            console.log('Fallo Autenticacion de', loginData.correo);
            callback({message:'Datos Incorrectos'});
          }
        } else {
          console.log('Solicitado un usuario que no existe', loginData);
          callback({message:'Correo no registrado'});
        }
      });
    },

    /**
     * Revisamos si un ID es favorito.
     *
     * Simplemente revisamos si el ID esta en la matriz de favoritos.
     *
     * @param {String} ID del recurso a revisar
     * @param {String} ID del usuario a revisar
     */

    esFavorito: function (recurso, usuario, callback) {
      this.DBModel.findById(usuario, function (err, user) {
        if (err) throw new Error(err);
        if (user) {
          var resultado = user.favoritos.filter(function (check) {
            return (check == recurso);
          });
          callback(resultado.length === 1);
        } else {
          callback(false);
        }
      });
    },

    /**
     * Agregamos o quitamos un ID de favoritos.
     *
     * Luego de una consulta para verificar si el usuario ha ingresado
     * verificamos si el ID del recurso ya ha sido favoriteado con
     * anterioridad para poder agregarlo o removerlo.
     * 
     * @param {String} modelo Una cadena referenciando el recurso a usar.
     * @param {String} userID El ID del usuario seleccionado.
     * @param {String} recurso El ID del recurso a agregar como favorito.
     */

    favoritear: function (modelo, userID, recurso, callback) {
      var self = this;
      // Consultamos el usuario que esta logueado
      this.DBModel.findById(userID, function (err, user) {
        if (err) throw new Error(err);
        if (user) {
          // Verificamos si el ID ya esta como favorito
          var test = user.favoritos.indexOf(recurso);
          if (test === -1) {
            user.favoritos.push(recurso);
          } else {
            user.favoritos.splice(test, 1);
          }

          user.save(function (err, doc) {
            // sacamos el modelo
            var modelos = modelo.split(':');
            var query = {};
            // Creamos la condicion de acuerdo al subrecurso mencionado
            query[modelos[1] + '._id'] = new self.mongoose.Types.ObjectId(recurso);
            // Traemos el modelo de acuerdo al recurso especificado
            self.mongoose.model(modelos[0]).find(query, function (err, recursos) {
              // Filtramos el subrecurso correcto.
              var correcto = recursos[0][modelos[1]].filter(function (sub) {
                return (sub._id.toString() == recurso);
              });
              // Ajustamos el valor del numero de favoritos
              if (test === -1) {
                correcto[0].favs++;
              } else {
                correcto[0].favs--;
              }
              // Pasamos la lista de subrecursos actualizada
              var diferencia = {};
              diferencia[modelos[1]] = recursos[0][modelos[1]];
              // Actualizamos el recurso
              self.mongoose.model(modelos[0]).update(query, diferencia, function (err) {
                callback((err) ? false : true);
              });
            });
          });
        } else {
          callback(false);
        }
      });
    }
  });
