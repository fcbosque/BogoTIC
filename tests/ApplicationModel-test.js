var vows = require('vows'),
    assert = require('assert'),
    Class = global.Class = require('klass');

var AppModel = require('../app/models/ApplicationModel.js');

vows.describe('app/models/ApplicationModel').addBatch({
  "Modelo principal de la aplicacion": {
    "Instanciado": {
      topic: new AppModel(),
      "debe tener las categorias": function (instance) {
        assert.isArray(instance.categorias);
      },
      "debe tener las localidades": function (instance) {
        assert.isArray(instance.localidades);
      },
      "debe tener el constructor de mongoose": function (instance) {
        assert.isFunction(instance.mongoose.Mongoose);
        assert.isFunction(instance.mongoose.connect);

      },
      "debe tener los metodos prometidos": function (instance) {
        assert.isFunction(instance.show);
        assert.isFunction(instance.all);
        assert.isFunction(instance.create);
        assert.isFunction(instance.remove);
        assert.isFunction(instance.modify);
      }
    }
  }
}).export(module);
