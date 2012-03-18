var crypto = require('crypto');

module.exports = require(app.set('models') + '/ApplicationModel').extend(function() {
  var localidades = this.localidades;
  var ObjectId = this.ObjectId;

  var UsuarioSchema = new this.Schema({
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
    password        : { type: String, required: false },
    mensajes        : [MensajeSchema],
    notificaciones  : [NotificacionSchema]
  });

  var MensajeSchema = new this.Schema({
    titulo    : { type: String, required: true, match: /[a-z]/ },
    autor     : { type: ObjectId, required: true },
    contenido : { type: String, required: true },
    fecha     : { type: Date, required: true, default: Date.now }
  })

  var NotificacionSchema = new this.Schema({
    titulo    : { type: String, required: true, match: /[a-z]/ },
    tipo      : { type: String, required: true },
    contenido : { type: String, required: true },
    fecha     : { type: Date, required: true, default: Date.now }
  })

  this.Mensaje      = this.mongoose.model('Mensaje', MensajeSchema);
  this.Notificacion = this.mongoose.model('Notificacion', NotificacionSchema);
  this.DBModel      = this.mongoose.model('Usuario', UsuarioSchema);
})
  .methods({
    all: function(callback) {
      this.DBModel.find({}, function(err, usuarios) {
        if(err) throw new Error(err);
        if(callback) callback(usuarios);
      })
    },
    show: function(username, callback) {
      this.DBModel.find({ username: username }, function(err, usuario) {
        if(err) throw new Error(err);
        if(callback) callback(usuario);
      })
    },
    modify: function(username, params, callback) {
      
    },
    remove: function(username, callback) {
    
    },
    create: function(resource, callback) {
      resource.password = crypto.createHmac('sha256', 'BOGOTIC').update(resource.clave).digest('hex');
      delete resource.clave;
      var _resource = new this.DBModel(resource);
      _resource.save(callback);
    },
    authenticate: function (loginData, callback) {
      this.DBModel.findOne({correo:loginData.correo}, function (err, user) {
        if (err) throw new Erro(err);
        if (user) {
          var clave = crypto.createHmac('sha256', 'BOGOTIC').update(loginData.clave).digest('hex');
          if (clave === user.password) {
            console.log('Autenticado COrrectamente');
            callback(null, user);
          } else {
            callback({message:'Datos Incorrectos'});
          }
        } else {
          callback({message:'Correo no registrado'});
        }
      });
    }
  })
