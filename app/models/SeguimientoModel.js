module.exports = require(app.set('models') + '/ApplicationModel').extend(function() {
  var localidades = this.localidades;
  var estadosConsulta = ['En votación', 'Satisfactoria', 'No satisfactoria', 'En respuesta'];
  var ObjectId = this.ObjectId;

  this.SeguimientoSchema = new this.Schema({
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
})
  .methods({
    create: function(foro, resource, callback) {
      var _resource = new this.DBModel(resource);
      _resource.foro = foro;
      _resource.save(callback);
    },
    show: function(foro, id, callback) {
      var ObjectId = this.ObjectId;
      this.DBModel.findById(id, function(err, item) {
        if(err) throw new Error(err);
        if(callback) callback(foro, item);
      });
    },
    remove: function(id, callback) {
      var _resource = this.DBModel.findById(id);
      _resource.remove(function(err, callback) {
        if(err) throw new Error(err);
        if(callback) callback;
      })
    },
    modify: function(id, params, callback) {
      var self = this;
      this.DBModel.findById(id, function(resource, callback) {
        resource.update(self.params.id, self.params, callback)
      });
    },
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
