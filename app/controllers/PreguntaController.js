module.exports = require(app.set('controllers') + '/ApplicationController').extend(function() {
  this.viewFolder = 'pregunta'
})
  .methods({
    index: function() {
      var self = this;
      var foro = this.request.params.foro;
      this.getModel('Foro').show(foro, function(foro) {
        self.render('index', {
          foro: {
            preguntas: foro.preguntas,
            nombre: foro.nombre,
            id: foro._id
          }
        })
      })
    },
    new: function() {
      var self = this;
      var foro = this.request.params.foro;
      this.getModel('Foro').show(foro, function(foro) {
        self.render('new', {
          foroId: foro._id
        });
      });
    },
    create: function() {
      var self = this;
      var foro = this.request.params.foro;
      var pregunta = this.request.body.pregunta;
      this.getModel('Foro').addPregunta(foro, pregunta, function(pregunta) {
        self.response.redirect("/foro/" + foro + "/preguntas");
      });
    },
    show: function(foro, pregunta) {
      var self = this;
      var foro = this.request.params.foro;
      var pregunta = this.request.params.id;
      this.getModel('Foro').getPregunta(foro, pregunta, function(item) {
        self.render('show', {
          foro: {
            id: item.foro.id,
            nombre: item.foro.nombre
          },
          pregunta: item.pregunta
        })
      })
    },
    remove: function(id) {
      var self = this;
      this.getModel('Pregunta').remove(id, function(pregunta) {
        self.send(200);
      })
    },
    modify: function(id) {
      var self = this
      this.getModel('Pregunta').modify(id, params, function(pregunta) {
        self.send(200);
      });
    }
  })
