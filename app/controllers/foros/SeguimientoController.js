module.exports = require(app.set('controllers') + '/ApplicationController').extend(function() {
  this.viewFolder = 'seguimiento'
})
  .methods({
    index: function() {
      var self = this;
      var foro = this.request.params.foro;
      var seguimiento = this.request.params.id;
      this.getModel('Foro').show(foro, function(foro) {
        self.getModel('Seguimiento').all(foro, function(foro, seguimientos) {
          self.render('index', {
            foros: self.response.foros,
            foro: foro,
            seguimientos: seguimientos
          });
        })
      });
    },
    new: function() {
      var self = this;
      var foro = this.request.params.foro;
      this.getModel('Foro').show(foro, function(foro) {
        self.render('new', {
          foros: self.response.foros,
          foro: {
            id: foro._id,
            nombre: foro.nombre
          }
        });
      });
    },
    create: function() {
      var self = this;
      var foro = this.request.params.foro;
      var seguimiento = this.request.body.seguimiento;
      this.getModel('Seguimiento').create(foro, seguimiento, function() {
        self.response.redirect("/foros/" + foro + "/seguimientos");
      });
    },
    show: function() {
      var self = this;
      var foro = this.request.params.foro;
      var seguimiento = this.request.params.id;
      this.getModel('Foro').show(foro, function(foro) {
        self.getModel('Seguimiento').show(foro, seguimiento, function(foro, seguimiento) {
          self.render('show', {
            foros: self.response.foros,
            foro: {
              id: foro.id,
              nombre: foro.nombre
            },
            seguimiento: seguimiento
          });
        });
      });
    },
    remove: function() {
      var self = this;
      this.getModel('Seguimiento').remove(id, function(seguimiento) {
        self.send(200);
      })
    },
    modify: function() {
      var self = this
      this.getModel('Seguimiento').modify(id, params, function(foro) {
        self.send(200);
      });
    },
    addPregunta: function() {
      var self = this;
      var foro = this.request.params.foro;
      var seguimiento = this.request.params.seguimiento;
      var pregunta = this.request.body.pregunta;
      this.getModel('Seguimiento').addPregunta(seguimiento, pregunta, function() {
        self.response.redirect('/foros/' + foro + '/seguimientos/' + seguimiento);
      });
    },
    addConsulta: function() {
      var self = this;
      var foro = this.request.params.foro;
      var seguimiento = this.request.params.seguimiento;
      var consulta = this.request.body.consulta;
      this.getModel('Seguimiento').addConsulta(seguimiento, consulta, function() {
        self.response.redirect('/foros/' + foro + '/seguimientos/' + seguimiento);
      });
    },
    getConsulta: function() {

    },
    getPregunta: function() {

    },
    addSeguidor: function() {

    },
    delSeguidor: function() {

    }
  })
