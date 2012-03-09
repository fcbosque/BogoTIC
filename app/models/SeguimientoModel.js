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
 * El modelo de seguimientos.
 *
 * @api public
 */

module.exports = require(app.set('models') + '/ApplicationModel').extend(function() {
  var localidades = this.localidades;
  var estadosConsulta = ['En votación', 'Satisfactoria', 'No satisfactoria', 'En respuesta'];
  var ObjectId = this.ObjectId;

  var SeguimientoSchema = new this.Schema({
    titulo      : { type: String, required: true, match: /[a-z]/ },
    foro        : { type: ObjectId, required: true },
    creador     : { type: ObjectId, required: false },
    descripcion : { type: String, required: false },
    fecha       : { type: Date, default: Date.now, required: true },
    seguidores  : { type: Array, default: [], required: false },
    localidad   : { type: String, required: true, enum: localidades },
    consultas   : [ConsultaSchema],
    preguntas   : [PreguntaSchema],
    informes    : [InformeSchema],
    abierto     : { type: Boolean, required: true, default: true }
  });

  var InformeSchema = new this.Schema({
    titulo      : { type: String, required: true },
    responsable : { type: String, required: true },
    referencia  : { type: String, required: true },
    contenido   : { type: String, required: true },
    fecha       : { type: Date, required: true, default: Date.now }
  });

  var ConsultaSchema = new this.Schema({
    votos         : { type: Number, required: true, default: 0 },
    estado        : { type: String, required: true, default: 'En votación', enum: estadosConsulta },
    motivo        : { type: String, required: true },
    fecha         : { type: Date, required: true, default: Date.now },
    interlocutor  : { type: String, required: true },
    respuesta     : { type: String, requided: false },
    descripcion   : { type: String, required: true },
    satisfactoria : { type: Boolean, required: false }
  });

  var RespuestaSchema = new this.Schema({
    autor     : { type: String, required: true },
    contenido : { type: String, required: true },
    votos     : { type: Number, default: 0 },
    fecha     : { type: Date, required: true, default: Date.now }
  });

  var PreguntaSchema = new this.Schema({
    autor     : { type: String, required: false },
    localidad : { type: String, required: true, enum: localidades },
    titulo    : { type: String, required: true },
    contenido : { type: String, required: true },
    fecha     : { type: Date, required: true, default: Date.now },
    votos     : { type: Number, required: false, default: 0 },
    favs      : { type: Number, required: false, default: 0 }
  });

  this.Pregunta  = this.mongoose.model('Pregunta', PreguntaSchema);
  this.Respuesta = this.mongoose.model('Respuesta', RespuestaSchema);
  this.Consulta  = this.mongoose.model('Consulta', ConsultaSchema);
  this.Informe   = this.mongoose.model('Informe', InformeSchema);
  this.DBModel   = this.mongoose.model('Seguimiento', SeguimientoSchema);
}).methods({
    /**
     * Creación de un nuevo grupo de seguimiento asociado a un foro.
     *
     * La acción de guardar la ejecuta directamente mongoose
     * junto con el callback especificado en el controlador.
     *
     * El recurso es guardado en una colección independiente
     * con una propiedad `foro` que hace referencia al `ObjectId`
     * del foro en particular en la colección de Foros.
     *
     * @api public
     * @param {Integer} foro
     * @param {Object} resource
     * @param {Function} callback
     * @see SeguimientoController.create
     */

    create: function(foro, resource, callback) {
      var _resource = new this.DBModel(resource);
      _resource.foro = foro;
      _resource.save(callback);
    },

    /**
     * Mostrar grupo de seguimiento individual.
     *
     * La busqueda del grupo de seguimiento la realiza mongoose,
     * arrojando una excepción en caso de error o ejecutando el
     * callback especificado en el controlador con el objeto del
     * grupo de seguimiento.
     *
     * La busqueda se realiza mediante `foro` y se pasa como
     * parámetro en el `callback` que especifica el controlador.
     *
     * @api public
     * @param {Integer} foro
     * @param {Integer} id
     * @param {Function} callback
     * @see ForoController.show
     */

    show: function(foro, id, callback) {
      this.DBModel.findById(id, function(err, item) {
        if(err) throw new Error(err);
        if(callback) callback(foro, item);
      });
    },
    
    /**
     * Eliminar un grupo de seguimiento de la base de datos.
     *
     * Elimina un registro de grupo de seguimiento vía `id`
     * usando mongoose para luego arrojar una excepción en
     * caso de error o ejecutar el callback del controlador.
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
      })
    },

    /**
     * Modificar un grupo de seguimiento existente.
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
        resource.update(self.params.id, self.params, callback)
      });
    },

    /**
     * Devuelve todos los grupos de seguimiento disponibles en
     * la base de datos según `foro`.
     *
     * Ejecuta el callback especificado por el controlador con
     * un arreglo que contiene todos los grupos de segumiento y
     * también con un objeto temporal `_foro` con las propiedades
     * para construir la vista. Estas son:
     *
     *  - `id` id del foro
     *  - `nombre` nombre del foro
     *  - `localidad` localidad que compete el foro
     *  - `fecha` la fecha de realización del foro
     *  - `categoria` la categoría particular de ese foro
     *
     * @api public
     * @param {Integer} foro
     * @param {Function} callback
     */

    all: function(foro, callback) {
      var ObjectId = this.ObjectId;
      this.DBModel.find({ foro: foro }, function(err, items) {
        if(err) throw new Error(err);
        var _foro = {};
        _foro.id = foro._id;
        _foro.nombre = foro.nombre;
        _foro.localidad = foro.localidad;
        _foro.fecha = foro.fecha;
        _foro.categoria = foro.categoria;
        if(callback) callback(_foro, items);
      });
    },

    /**
     * Busca en toda la colección de grupos de seguimiento
     * usando expresiones regulares.
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
     * Añade una consulta a un grupo de seguimiento en particular.
     *
     * La consulta cuando se crea es sometida a votación por todos
     * los miembros del grupo. Si la votación es exitosa, entonces
     * la consulta se puede realizar.
     *
     * La realización de la consulta incluye la generación de una
     * URL temporal donde se registrará la respuesta de la consulta
     * por parte de un usuario invitado. La URL se destruye una vez
     * se ha respondido la consulta.
     *
     * @api public
     * @param {Integer} seguimiento
     * @param {Object} consulta
     * @param {Function} callback
     */

    addConsulta: function(seguimiento, consulta, callback) {
      var self = this;
      this.DBModel.findById(seguimiento, function(err, seguimiento) {
        if(err) throw new Error(err);
        seguimiento.consultas.push(new self.Consulta(consulta));
        seguimiento.save(function(err) {
          if(err) throw new Error(err);
          if(callback) callback(seguimiento);
        });
      });
    },
    getConsulta: function(seguimiento, consulta, callback) {

    },
    answerConsulta: function(seguimiento, consulta, callback) {

    },

    /**
     * Añadir una nueva pregunta a un grupo de consulta en particular.
     *
     * En caso de que no se arroje una excepción, se incluirá la
     * `pregunta` al `seguimiento` para luego ejecutar `callback`
     * con el objeto completo de `seguimiento` que retorna la consulta
     * de mongoose.
     *
     * @api public
     * @param {Integer} seguimiento
     * @param {Object} pregunta
     * @param {Function} callback
     */

    addPregunta: function(seguimiento, pregunta, callback) {
      var self = this;
      this.DBModel.findById(seguimiento, function(err, seguimiento) {
        if(err) throw new Error(err);
        seguimiento.preguntas.push(new self.Pregunta(pregunta));
        seguimiento.save(function(err) {
          if(err) throw new Error(err);
          if(callback) callback(seguimiento);
        })
      })
    },

    /**
     * Traer una pregunta especifica de un grupo de seguimiento en
     * particular.
     *
     * Si no se arroja una excepción entonces luego de recorrer el
     * arreglo de `seguimiento.preguntas` y se encuentre en registrado
     * se ejecutará `callback` con los siguientes objetos:
     *
     *  - `pregunta` objeto de la pregunta en cuestión
     *  - `seguimiento` objeto seguimiento que consta de:
     *    - `id` id del seguimiento
     *    - `nombre` nombre del seguimiento
     *
     * @api public
     * @param {Integer} seguimiento
     * @param {Integer} pregunta
     * @param {Function} callback
     */

    getPregunta: function(seguimiento, pregunta, callback) {
      var self = this;
      this.DBModel.findById(seguimiento, function(err, seguimiento) {
        if(err) throw new Error(err);
        for(var _pregunta in seguimiento.preguntas) {
          if(seguimiento.preguntas[_pregunta],_id == pregunta) {
            callback({
              pregunta: seguimiento.preguntas[_pregunta],
              seguimiento: {
                id: seguimiento._id,
                nombre: seguimiento.nombre
              }
            })
          }
        }
      })
    },
    addSeguidor: function(seguimiento, seguidor, callback) {},
    delSeguidor: function(seguimiento, seguidor, callback) {},
    addInforme: function(seguimiento, informe, callback) {},
    getInforme: function(seguimiento, informe, callback) {}
  })
