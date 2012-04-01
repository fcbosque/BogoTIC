var vows = require('vows'),
    assert = require('assert'),
    Class = global.Class = require('klass'),
    app = global.app = require('matador').createServer();

app.configure(function () {
  app.set('models', __dirname + '/../app/models')
  app.set('helpers', __dirname + '/../app/helpers')
  app.set('views', __dirname + '/../app/views')
  app.set('controllers', __dirname + '/../app/controllers')
});

var SeguimientoModel = require('../app/models/SeguimientoModel.js');

var testContext = {};

/**
 * TERMINAR
 *
vows.describe('app/models/SeguimientoModel').addBatch({
  "Modelo de Seguimiento": {
    topic: new SeguimientoModel(),
    ""
  }
}).export(module);
*/
