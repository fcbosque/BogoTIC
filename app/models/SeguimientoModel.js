module.exports = require(app.set('models') + '/ApplicationModel').extend(function() {
  var ObjectId = this.ObjectId
  this.DBModel = this.mongoose.model('Seguimiento', new this.Schema({
    titulo      : { type: String, required: false, match: /[a-z]/ },
    foro        : { type: ObjectId, required: false },
    creador     : { type: ObjectId, required: false },
    descripcion : { type: String, required: false },
    categoria   : { type: String, required: false },
    fecha       : { type: Date, default: Date.now, required: true },
    seguidores  : { type: Array, default: [], required: false },
    localidad   : { type: String, required: true },
    consultas   : [Consulta],
    preguntas   : [Pregunta]
  }));

  var Consulta = new this.Schema({
    motivo        : { type: String, required: true },
    fecha         : { type: Date, required: true, default: Date.now },
    interlocutor  : { type: String, required: true },
    respuesta     : { type: String, requided: false },
    descripcion   : { type: String, required: true }
  });

  var Pregunta = new this.Schema({
    autor        : { type: String, required: true },
    localidad    : { type: String, required: true },
    titulo       : { type: String, required: true },
    contenido    : { type: String, required: true },
    fecha        : { type: Date, required: true, default: Date.now },
    autor        : { type: String, required: true },
    votos        : { type: Number, default: 0 },
    favs         : { type: Number, default: 0 }
  });
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
    remove: function(id, callback) {},
    modify: function(id, params, callback) {},
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
    addPregunta: function(pregunta, callback) {},
    getPregunta: function(pregunta, callback) {},
    addSeguidor: function(seguidor, callback) {},
    delSeguidor: function(seguidor, callback) {}
  })
