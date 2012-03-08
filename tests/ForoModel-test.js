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

var ForoModel = require('../app/models/ForoModel.js');

var testForo = {
  nombre: 'Foro de prueba',
  descripcion: 'Probando la descripcion',
  fecha: new Date(),
  abierto: true
};

vows.describe('app/models/ForoModel').addBatch({
  "Modelo del Foro": {
    "revisando la clase": {
      "y modelos anexos": {
        topic: new ForoModel(),
        "debe tener los 4 modelos anexos": function (clase) {
          assert.isFunction(clase.Participante);
          assert.isFunction(clase.Sponsor);
          assert.isFunction(clase.Alianza);
          assert.isFunction(clase.Pregunta);
        },
        "debe tener los constructores respectivos": function (clase) {
          assert.equal(clase.Participante.modelName, 'Participante');
          assert.equal(clase.Sponsor.modelName, 'Sponsor');
          assert.equal(clase.Alianza.modelName, 'Alianza');
          assert.equal(clase.Pregunta.modelName, 'Pregunta');
        }
      },
      "y los metodos prometidos": {
        topic: new ForoModel(),
        "debe tener create, show, remove, modify and all": function (clase) {
          assert.isFunction(clase.create)
          assert.isFunction(clase.show)
          assert.isFunction(clase.remove)
          assert.isFunction(clase.modify)
          assert.isFunction(clase.all)
        },
        "debe tener los adicionales addPregunta y getPregunta": function (clase) {
          assert.isFunction(clase.addPregunta);
          assert.isFunction(clase.getPregunta);
        }
      }
    },
    "Instanciando": {
      topic: new ForoModel(),
      "debe caargarse un modelo tipo foro": function (foro) {
        assert.isFunction(foro.DBModel);
        assert.equal(foro.DBModel.modelName, 'Foro');
      },
      "debe tener las categorias y las localidades": function (foro) {
        assert.isArray(foro.categorias);
        assert.isArray(foro.localidades);
      }
    },
    "Cargando": {
      topic: function () {
        var nuevo = new ForoModel();
        nuevo.create(testForo, this.callback);
      },
      "debe cargarse con los datos": function (err, foro) {
      assert.isNull(err);
      assert.equal(foro.nombre, testForo.nombre);
      assert.equal(foro.fecha, testForo.fecha);
      assert.equal(foro.descripcion, testForo.descripcion);
      assert.ok(foro._id);
      }
    }
  }
}).addBatch({
  "Metodo del Foro": {
    topic: new ForoModel(),
    "all() ": {
      topic: function (Foro) {
        Foro.all(this.callback)
      },
      "Listado de foros": function (err, lista) {
        assert.isNull(err);
        assert.isArray(lista);
        assert.isObject(lista[0]);
      }
    }
  }
}).export(module);
