module.exports = require(app.set('models') + '/ApplicationModel').extend(function() {
  var ObjectId = this.ObjectId
  this.DBModel = this.mongoose.model('Foro', new this.Schema({
    nombre      : { type: String, required: false, match: /[a-z]/ },
    creador     : { type: ObjectId, required: false },
    descripcion : { type: String, required: false },
    categoria   : { type: String, required: false },
    preguntas   : [Pregunta],
    fecha       : { type: Date, default: Date.now, required: true }
  }));

  var Pregunta = this.mongoose.model('Pregunta', new this.Schema({
    autor        : { type: String, required: true },
    localidad    : { type: String, required: true },
    titulo       : { type: String, required: true },
    contenido    : { type: String, required: true },
    fecha        : { type: Date, required: true, default: Date.now },
    autor        : { type: String, required: true },
    votos        : { type: Number, default: 0 },
    favs         : { type: Number, default: 0 }
  }));

  this.Pregunta = Pregunta;
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
        var _pregunta = new self.Pregunta(pregunta);
        _pregunta.save(function() {
          foro.preguntas.push(_pregunta);
          foro.save(function() {
            callback(foro)
          })
        });
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
