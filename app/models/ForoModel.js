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
 * El modelo de foros.
 *
 * @api public
 */

module.exports = require(app.set('models') + '/ApplicationModel').extend(function() {
  var categorias = this.categorias;
  var localidades = this.localidades;
  var ObjectId = this.ObjectId;

  var ForoSchema = new this.Schema({
    nombre        : { type: String, required: false, match: /[a-z]/ },
    descripcion   : { type: String, required: false },
    categoria     : { type: String, required: false, enum: categorias },
    participantes : [ParticipanteSchema],
    sponsors      : [SponsorSchema],
    preguntas     : [PreguntaSchema],
    alianzas      : [AlianzaSchema],
    fecha         : { type: Date, required: true },
    abierto       : { type: Boolean, required: true, default: true },
    imagen        : { type: String, required: true, default: "bogotic.png" },
    lugar         : { type: String, required: true, default: "Por definir" },
    url           : { type: String, required: false, default: "www.bogotic.com" },
    relatoria     : { type: String, required: false },
    video         : { type: String, required: false },
    asistentes    : { type: Array, required: false, default: [] },
    informes      : { type: Array, required: false, default: [] }
  });
  
  var ParticipanteSchema = new this.Schema({
    nombre       : { type: String, required: true },
    imagen       : { type: String, required: true },
    descripcion  : { type: String, required: true },
    entidad      : { type: String, required: true }
  });

  var SponsorSchema = new this.Schema({
    nombre    : { type: String, required: true },
    imagen    : { type: String, required: true }
  });

  var AlianzaSchema = new this.Schema({
    nombre      : { type: String, required: true },
    url         : { type: String, required: true },
    descripcion : { type: String, required: true },
    twitter     : { type: String, required: true }
  });

  var PreguntaSchema = new this.Schema({
    autor        : { type: String, required: true },
    localidad    : { type: String, required: true, enum: localidades },
    titulo       : { type: String, required: true },
    contenido    : { type: String, required: true },
    fecha        : { type: Date, required: true, default: Date.now },
    autor        : { type: String, required: true },
    votos        : { type: Number, default: 0 },
    favs         : { type: Number, default: 0 }
  });

  this.Participante = this.mongoose.model('Participante', ParticipanteSchema);
  this.Sponsor      = this.mongoose.model('Sponsor', SponsorSchema);
  this.Alianza      = this.mongoose.model('Alianza', AlianzaSchema);
  this.Pregunta     = this.mongoose.model('Pregunta', PreguntaSchema);
  this.DBModel      = this.mongoose.model('Foro', ForoSchema);
}).methods({
    /**
     * Creación de un nuevo foro.
     *
     * La acción de guardar la ejecuta directamente mongoose
     * junto con el callback especificado en el controlador.
     *
     * @api public
     * @param {Object} resource
     * @param {Function} callback
     * @see ForoController.create
     */

    create: function(resource, callback) {
      var _resource = new this.DBModel(resource);
      _resource.save(callback);
    },

    /**
     * Mostrar foro individual.
     *
     * La busqueda del foro la realiza mongoose, arrojando
     * una excepción en caso de error o ejecutando el callback
     * especificado en el controlador con el objeto foro.
     *
     * @api public
     * @param {Integer} id
     * @param {Function} callback
     * @see ForoController.show
     */

    show: function(id, callback) {
      this.DBModel.findById(id, function(err, item) {
        if(err) throw new Error(err);
        if(callback) callback(err, item);
      });
    },

    /**
     * Eliminar un foro de la base de datos.
     *
     * Elimina un registro de foro vía `id` usando
     * mongoose para luego arrojar una excepción en caso
     * de error o ejecutar el callback del controlador.
     *
     * @api public
     * @param {Integer} id
     * @param {Function} callback
     */
    
    remove: function(id, callback) {
      var _resource = this.DBModel.findById(id);
      _resource.remove(function(err, confirm) {
        if(err) throw new Error(err);
        callback(err, confirm);
      });        
    },

    /**
     * Modificar un foro existente.
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
      });
    },

    /**
     * Devuelve todos los foros disponibles en la base de datos.
     *
     * Ejecuta el callback especificado por el controlador con
     * un arreglo que contiene todos los foros.
     * 
     * @api public
     * @param {Function} callback
     */

    all: function(callback) {
      this.DBModel.find({}, function(err, items) {
        if(err) throw new Error(err);
        if(callback) callback(err, items);
      });
    },

    /**
     * Busca en toda la colección de foros usando expresiones
     * regulares.
     *
     * `callback` se ejecuta al final de la compilación del
     * RegExp en la clausula de query de mongoose.
     *
     * @api public
     * @param {String} param
     * @param {Function} callback
     */

    search: function(param, callback) {
      this.DBModel.where('', new RegExp(param, 'i')).run(callback);
    },

    /**
     * Añade una pregunta a un foro en particular.
     *
     * @api public
     * @param {Integer} foro
     * @param {Object} pregunta
     * @param {Function} callback
     */

    addPregunta: function(foro, pregunta, callback) {
      var self = this;
      this.DBModel.findById(foro, function(err, foro) {
        if(err) throw new Error(err);
        foro.preguntas.push(new self.Pregunta(pregunta));
        foro.save(function(err) {
          if(err) throw new Error(err);
          callback(err, foro);
        })
      })
    },

    /**
     * Devuelve una pregunta en particular de un foro determinado.
     *
     * Si no se arroja una excepción entonces recorremos las preguntas
     * del foro para poder ejecutar el callback con la pregunta especifica.
     * 
     * `callback` espera el siguiente formato:
     *  - `pregunta` objeto de la pregunta actual
     *  - `foro` objeto de foro que se compone de:
     *    - `id` id del foro
     *    - `nombre` nombre del foro
     *
     * @api public
     * @param {Integer} foro
     * @param {Integer} pregunta
     * @param {Function} callback
     */

    getPregunta: function(foro, pregunta, callback) {
      var self = this;
      this.DBModel.findById(foro, function(err, foro) {
        if(err) throw new Error(err);
        var pregunta = foro.preguntas.filter(function (preg) {
          return (preg._id.toString() == preguntaId.toString());
        });

        callback(null, {
          pregunta: pregunta[0],
          foro: foro
        });
      });
    },
    addParticipante: function(foro, participante, callback) {},
    remParticipante: function(foro, participante, callback) {},
    addSponsor: function(foro, sponsor, callback) {},
    remSponsor: function(foro, sponsor, callback) {},
    addAlianza: function(foro, alianza, callback) {},
    remAlianza: function(foro, alianza, callback) {},
    addAsistente: function(foro, asistente, callback) {},
    remAsistente: function(foro, asistente, callback) {}
  });
