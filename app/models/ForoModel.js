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
  this.Sponsor = this.mongoose.model('Sponsor', SponsorSchema);
  this.Alianza = this.mongoose.model('Alianza', AlianzaSchema);
  this.Pregunta = this.mongoose.model('Pregunta', PreguntaSchema);
  this.DBModel = this.mongoose.model('Foro', ForoSchema);
})
  .methods({
    create: function(resource, callback) {
      var _resource = new this.DBModel(resource);
      _resource.save(callback);
    },
    show: function(id, callback) {
      this.DBModel.findById(id, function(err, item) {
        if(err) throw new Error(err);
        if(callback) callback(err, item);
      });
    },
    remove: function(id, callback) {
      var _resource = this.DBModel.findById(id);
      _resource.remove(function(err, confirm) {
        if(err) throw new Error(err);
        callback(err, confirm);
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
        if(callback) callback(err, items);
      });
    },
    search: function(param, callback) {
      this.DBModel.where('', new RegExp(param, 'i')).run(callback);
    },
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
    getPregunta: function(foro, preguntaId, callback) {
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
