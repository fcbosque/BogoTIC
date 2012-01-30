module.exports = require(app.set('models') + '/ApplicationModel').extend(function() {
  this.DBModel = this.mongoose.model('Usuario', new this.Schema({
    nombre     : { type: String, required: true, match: /[a-z]/ },
    apellido   : { type: String, required: true, match: /[a-z]/ },
    localidad  : { type: String, lowercase: true, trim: true },
    edad       : { type: Number },
    educacion  : { type: String },
    correo     : { type: String },
    favs       : { type: Array },
    votos      : { type: Array },
    fecha      : { type: Date, default: Date.now }
  }));
})
