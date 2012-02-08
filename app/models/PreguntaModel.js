module.exports = require(app.set('models') + '/ApplicationModel').extend(function() {
  var ObjectId = this.ObjectId
  this.DBModel = this.mongoose.model('Pregunta', new this.Schema({
    autor        : { type: String, required: true },
    localidad    : { type: String, required: true },
    titulo       : { type: String, required: true },
    contenido    : { type: String, required: true },
    fecha        : { type: Date, required: true, default: Date.now },
    votos        : { type: Number, default: 0 },
    favs         : { type: Number, default: 0}
  }))
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
      })
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
      })
    },
    all: function(id) {
      this.DBModel.find({ entityId: id }, function(err, preguntas) {
        if(err) throw new Error(err);
        if(callback) callback(preguntas);
      })
    }
  })
