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
      this.getModel('Seguimiento').create(foro, seguimiento, function(seguimiento) {
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
    newPregunta: function() {
      var self = this;
      var seguimiento = this.request.params.seguimiento;
      var foro = this.request.params.foro;
      console.log(seguimiento);
      console.log(foro);
      this.getModel('Seguimiento').show(foro, seguimiento, function(seguimiento) {
        self.render('addPregunta', {
          foros: self.response.foros,
          seguimientoId: seguimiento._id
        })
      })
    },
    addPregunta: function() {

    },
    getPregunta: function() {

    },
    addSeguidor: function() {

    },
    delSeguidor: function() {

    }
  })
