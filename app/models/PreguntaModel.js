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
 * El modelo de preguntas.
 *
 * @api public
 */

module.exports = require(app.set('models') + '/ApplicationModel').extend(function() {
  var localidades = this.localidades;
  var ObjectId = this.ObjectId;

  var PreguntaSchema = new this.Schema({
    autor        : { type: String, required: true },
    localidad    : { type: String, required: true, enum: localidades },
    titulo       : { type: String, required: true },
    contenido    : { type: String, required: true },
    fecha        : { type: Date, required: true, default: Date.now },
    votos        : { type: Number, default: 0 },
    favs         : { type: Number, default: 0}
  });

  this.DBModel = this.mongoose.model('Pregunta', PreguntaSchema);
}).methods({
    /**
     * Creación de una nueva pregunta
     *
     * La acción de guardar la ejecuta directamente mongoose
     * junto con el callback especificado en el controlador.
     *
     * @api public
     * @param {Object} resource
     * @param {Function} callback
     * @see PreuntaController.create
     */

    create: function(resource, callback) {
      var _resource = new this.DBModel(resource);
      _resource.save(callback);
    },

    /**
     * Mostrar pregunta individual
     *
     * La busqueda de la pregunta la realiza mongoose, arrojando
     * una excepción en caso de error o ejecutando el callback
     * especificado en el controlador con el objeto pregunta.
     *
     * @api public
     * @param {Integer} id
     * @param {Function} callback
     * @see PreguntaController.show
     */

    show: function(id, callback) {
      this.DBModel.findById(id, function(err, item) {
        if(err) throw new Error(err);
        if(callback) callback(item);
      })
    },

    /**
     * Eliminar una pregunta de la base de datos.
     *
     * Elimina un registro de pregunta mediante la id usando
     * mongoose para luego arrojar una excepción en caso
     * de error o ejecutar el callback del controlador.
     *
     * @api public
     * @param {Integer} id
     * @param {Function} callback
     */
 
    remove: function(id, callback) {
      var _resource = this.DBModel.findById(id);
      _resource.remove(function(err, callback) {
        if(err) throw new Error(err);
        if(callback) callback;
      });
    },

    /**
     * Modificar una pregunta existente.
     *
     * Actualiza un registro en la base de datos usando
     * `params` como objeto con las propiedades actualizadas.
     *
     * @api public
     * @param {Integer} id
     * @param {Object} params
     * @param {Function} callback
     */

    modify: function(id, params, callback) {
      var self = this;
      this.DBModel.findById(id, function(resource, callback) {
        resource.update(self.params.id, self.params, callback);
      })
    },

    /**
     * Devuelve todas las preguntas disponibles en la base de datos.
     *
     * Ejecuta el callback especificado por el controlador con
     * un arreglo que contiene todos los foros.
     * 
     * @api public
     * @param {Function} callback
     */

    all: function(id) {
      this.DBModel.find({ entityId: id }, function(err, preguntas) {
        if(err) throw new Error(err);
        if(callback) callback(preguntas);
      })
    }
  })
