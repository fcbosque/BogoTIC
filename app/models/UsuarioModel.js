module.exports = require(app.set('models') + '/ApplicationModel').extend(function() {
  var localidades = this.localidades;
  var ObjectId = this.ObjectId;
  this.DBModel = this.mongoose.model('Usuario', new this.Schema({
    nombre          : { type: String, required: true, match: /[a-z]/ },
    apellido        : { type: String, required: true, match: /[a-z]/ },
    localidad       : { type: String, required: false, enum: localidades },
    edad            : { type: Number, required: false },
    educacion       : { type: String, required: false },
    correo          : { type: String, required: true },
    avatar          : { type: String, required: true, default: 'avatar.png' },
    fecha           : { type: Date, required: true, default: Date.now },
    karma           : { type: Number, required: false, default: 0 },
    url             : { type: String, required: false, default: "http://bogotic.com" },
    twitter         : { type: String, required: false },
    foros           : { type: Array, required: false },
    avisos          : { type: Boolean, required: false, default: true },
    mensajes        : [Mensaje],
    notificaciones  : [Notificacion]
  }));

  var Mensaje = new this.Schema({
    titulo    : { type: String, required: true, match: /[a-z]/ },
    autor     : { type: ObjectId, required: true },
    contenido : { type: String, required: true },
    fecha     : { type: Date, required: true, default: Date.now }
  })

  var Notificacion = new this.Schema({
    titulo    : { type: String, required: true, match: /[a-z]/ },
    tipo      : { type: String, required: true },
    contenido : { type: String, required: true },
    fecha     : { type: Date, required: true, default: Date.now }
  })

  this.Mensaje      = Mensaje;
  this.Notificacion = Notificacion;
})
