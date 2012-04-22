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

var testSeguimiento = {
  titulo: "Veeduria de Presupuesto",
  descripcion: "Espacio para la participacion ciudadana usando las TIC's",
  localidad: "Usme"
};

var testContext = {};

function createForo (callback) {
  var ForoModel = require('../app/models/ForoModel.js');

  var testForo = {
    nombre: "Rendicion Cuentas Presupuesto",
    descripcion: "Foro para la rendicion de cuentas sobre el presupuesto publico.",
    fecha: new Date(),
    abierto: true
  };

  var nuevoForo = new ForoModel();

  nuevoForo.create(testForo, callback);
}

/**
 * Pruebas para la creacion de grupos de seguimiento
 */
vows.describe('app/models/SeguimientoModel').addBatch({
  "Modelo de Seguimiento": {
    "revisando las clases": {
      "y los modelos anexos": {
        topic: new SeguimientoModel(),
        "debe tener los 4 modelos anexos": function (clase) {
          assert.isFunction(clase.Pregunta);
          assert.isFunction(clase.Respuesta);
          assert.isFunction(clase.Consulta);
          assert.isFunction(clase.Informe);
        },
        "debe tener los constructores respectivos": function (clase) {
          assert.equal(clase.Pregunta.modelName, 'Pregunta');
          assert.equal(clase.Respuesta.modelName, 'Respuesta');
          assert.equal(clase.Consulta.modelName, 'Consulta');
          assert.equal(clase.Informe.modelName, 'Informe');
        }
      },
      "y los metodos prometidos": {
        topic: new SeguimientoModel(),
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
      topic: new SeguimientoModel(),
      "debe cargarse un modelo tipo seguimiento": function (seguimiento) {
        assert.isFunction(seguimiento.DBModel);
        assert.equal(seguimiento.DBModel.modelName, 'Seguimiento');
      },
      "debe tener las localidades": function (seguimiento) {
        assert.isArray(seguimiento.localidades);
      }
    },
    "Cargando": {
      topic: function () {
        var self = this;
        createForo(function (err, foro) {
          var nuevo = new SeguimientoModel();
          nuevo.create(foro._id, testSeguimiento, self.callback);
        });
      },
      "debe cargarse con los datos": function (err, grupo) {
        assert.isNull(err);
        assert.equal(grupo.titulo, testSeguimiento.titulo);
        assert.equal(grupo.descripcion, testSeguimiento.descripcion);
        assert.equal(grupo.localidad, testSeguimiento.localidad);
        assert.ok(grupo.abierto);
      }
    }
  }
}).export(module);