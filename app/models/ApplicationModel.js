module.exports = require('./BaseModel').extend(function() {
  this.mongo = require('mongodb');
  this.mongoose = require('mongoose');
  this.mongooseAuth = require('mongoose-auth');
  this.Schema = this.mongoose.Schema;
  this.ObjectId = this.Schema.ObjectId;
  this.mongoose.connect('mongodb://localhost/BogoTIC');

  this.categorias = ['Tecnología y deuda pública', 'Tecnología e investigación social',
                     'Tecnología y productividad', 'Tecnología y educación',
                     'Tecnología y fomento', 'Tecnología y gobierno', 'Tecnología y cultura',
                     'Tecnología e igualdad', 'Tecnología y derechos', 'Tecnología y pirateria']

  this.localidades = ['Antonio Nariño', 'Barrios Unidos', 'Bosa',
                      'Chapinero', 'Ciudad Bolívar', 'Engativá', 'Fontibón',
                      'Kennedy', 'La Candelaria', 'Los Mártires', 'Puente Aranda',
                      'Rafael Uribe Uribe', 'San Cristóbal', 'Santa Fe', 'Suba',
                      'Sumapaz', 'Teusaquillo', 'Tunjuelito', 'Usaquén', 'Usme']
})
  .methods({
    create: function(params, callback) {
    },
    show: function(id, callback) {
    },
    remove: function(id, callback) {
    },
    modify: function(id, params, callback) {
    },
    all: function(callback) {
    },
    search: function (params, callback) {

    }
  })
