module.exports = require(app.set('models') + '/ApplicationModel').extend(function() {
  var categorias = this.categorias;
  var localidades = this.localidades;
  var ObjectId = this.ObjectId
  this.DBModel = this.mongoose.model('Foro', new this.Schema({
    nombre        : { type: String, required: false, match: /[a-z]/ },
    descripcion   : { type: String, required: false },
    categoria     : { type: String, required: false, enum: categorias },
    participantes : [Participante],
    sponsors      : [Sponsor],
    preguntas     : [Pregunta],
    alianzas      : [Alianza],
    fecha         : { type: Date, required: true },
    abierto       : { type: Boolean, required: true, default: true },
    imagen        : { type: String, required: true },
    lugar         : { type: String, required: true },
    url           : { type: String, required: false },
    relatoria     : { type: String, required: false },
    video         : { type: String, required: false },
    asistentes    : { type: Array, required: false, default: [] },
    informes      : { type: Array, required: false, default: [] }
  }));
  
  var Participante = new this.Schema({
    nombre       : { type: String, required: true },
    imagen       : { type: String, required: true },
    descripcion  : { type: String, required: true },
    entidad      : { type: String, required: true }
  });

  var Sponsor = new this.Schema({
    nombre       : { type: String, required: true },
    imagen       : { type: String, required: true }
  });

  var Alianza = new this.Schema({
    nombre      : { type: String, required: true },
    url         : { type: String, required: true },
    descripcion : { type: String, required: true },
    twitter     : { type: String, required: true }
  });

  var Pregunta = new this.Schema({
    autor        : { type: String, required: true },
    localidad    : { type: String, required: true, enum: localidades },
    titulo       : { type: String, required: true },
    contenido    : { type: String, required: true },
    fecha        : { type: Date, required: true, default: Date.now },
    autor        : { type: String, required: true },
    votos        : { type: Number, default: 0 },
    favs         : { type: Number, default: 0 }
  });
})
  .methods({
    create: function(resource, callback) {
      var _resource = new this.DBModel(resource);
      _resource.save(callback);
    },
    show: function(id, callback) {
      this.DBModel.findById(id, function(err, item) {
        if(err) throw new Error(err);
        if(callback) callback(item);
      });
    },
    remove: function(id, callback) {
      var _resource = this.DBModel.findById(id);
      _resource.remove(function(err, callback) {
        if(err) throw new Error(err);
        if(callback) callback;
      });        
    },
    modify: function(id, params, callback) {
      var self = this;
      this.DBModel.findById(id, function(resource, callback) {
        resource.update(self.params.id, self.params, callback);
      });
    },
    all: function(callback) {
      this.DBModel.find({}, function(err, items) {
        if(err) throw new Error(err);
        if(callback) callback(items);
      });
    },
    addPregunta: function(foro, pregunta, callback) {
      var self = this;
      this.DBModel.findById(foro, function(err, foro) {
        if(err) throw new Error(err);
        foro.preguntas.push(pregunta);
        foro.save(function() {
          callback(foro)
        })
      })
    },
    getPregunta: function(foro, pregunta, callback) {
      var self = this;
      this.DBModel.findById(foro, function(err, foro) {
        if(err) throw new Error(err);
        for(var _pregunta in foro.preguntas) {
          if(foro.preguntas[_pregunta]._id == pregunta) {
            callback({
              pregunta: foro.preguntas[_pregunta],
              foro: {
                id: foro._id,
                nombre: foro.nombre
              }
            })
          }
        };
      });
    }
  })
