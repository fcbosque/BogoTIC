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

var testContext = {};

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
      "debe cargarse un modelo tipo foro": function (foro) {
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
        testContext.Foro = foro;
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
      },
      "Foro con nombre y descripcion": function (err, lista) {
        var foro = lista[0];
        assert.isNull(err);
        assert.isString(foro.nombre);
        assert.isString(foro.descripcion);
      }
    },
    "show() ": {
      topic: function (Foro) {
        Foro.show(testContext.Foro._id, this.callback);
      },
      "Muestra los datos de un foro en especifico": function (err, foro) {
        assert.isNull(err);
        assert.ok(foro);
        assert.equal(foro.nombre, testContext.Foro.nombre);
        assert.equal(foro.descripcion, testContext.Foro.descripcion);
      }
    },
    /**
    "modify() ": {
      topic: function (Foro) {
        Foro.modify(testContext.Foro._id, {
          nombre:'Esto es un nuevo nombre',
          descripcion: 'La nueva descripcion',
          id: testContext.Foro._id
        }, this.callback);
      },
      "Responde correctamente el callback": function (err, doc, otro) {
        assert.isNull(err);
        assert.ok(false);
      }
    }
    **/
  }
}).addBatch({
  "Metodo del Foro": {
    topic: new ForoModel(),
    "remove() ": {
      topic: function (Foro) {
        Foro.remove(testContext.Foro._id, this.callback);
      },
      "Responde correctamente sin errores": function (err, res) {
        assert.isNull(err);
        assert.equal(res, 1);
      }
    }
  }
}).addBatch({
  "Metodos adicionales del Foro": {
    topic: function () {
      var self = this;
      var Foro = new ForoModel();
      Foro.create(testForo, function (err, foro) {
        self.callback(err, Foro, foro);
      });
    },
    "el addPregunta()": {
      topic: function (Foro, foro) {
        Foro.addPregunta(foro._id, {
          autor: "testAuthor",
          localidad: "Kennedy",
          titulo: "¿Pregunta de prueba?",
          contenido: "Espero que la pregunta quede guardada en la base de datos",
          fecha: new Date()
        }, this.callback);
      },
      "Debo recibir un foro": function (foro) {
        assert.equal(foro.nombre, testForo.nombre);
        assert.equal(foro.descripcion, testForo.descripcion);
        assert.ok(foro._id);
      },
      "Debe tener un array de preguntas": function (foro) {
        assert.isArray(foro.preguntas);
        assert.ok(foro.preguntas.length > 0);
      },
      "Debe tener la pregunta": function (foro) {
        var pregunta = foro.preguntas[0];
        assert.isObject(pregunta);
        assert.ok(pregunta._id);
        assert.equal(pregunta.autor, "testAuthor");
        assert.equal(pregunta.localidad, "Kennedy");
        assert.equal(pregunta.contenido.length, 57);
        testContext.Pregunta = pregunta;
        testContext.PreguntaForo = foro;
      },
      "despues el getPregunta()": {
        topic: function () {
          var Foro = new ForoModel();
          Foro.getPregunta(testContext.PreguntaForo._id, testContext.Pregunta._id, this.callback);
        },
        "Debe traer la pregunta": function (res) {
         assert.ok(res);
         assert.ok(res.foro._id);
         assert.ok(res.pregunta._id);
         assert.equal(res.pregunta.contenido.length, 57);
        },
      }
    }
  }
}).export(module);
