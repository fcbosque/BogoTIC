module.exports = require(app.set('controllers') + '/ApplicationController').extend(function() {
  this.viewFolder = 'foro'
})
  .methods({
    index: function() {
      var self = this;
      var seguimientos = [];
      var foros = this.response.foros;
      
      foros.forEach(function(foro) {
        self.getModel('Seguimiento').all(foro._id, function(_foro, seguimientos) {
          seguimientos.forEach(function(seguimiento) {
            seguimientos.push(seguimiento);
          });
        });
      });
        
      this.render('index', {
        foros: foros,
        total_foros: foros.length,
        total_seguimientos: seguimientos.length,
        seguimientos: seguimientos
      });
    },
    new: function() {
      this.render('new', { foros: this.response.foros });
    },
    create: function() {
      var self = this;
      var foro = this.request.body.foro
      this.getModel('Foro').create(foro, function(err) {
        if(err) throw new Error(err);
      })
      this.response.redirect('/foros');
    },
    show: function(id) {
      var self = this;
      var foro = this.request.params.id
      this.getModel('Foro').show(foro, function(foro) {
        self.render('show', {
          foros: self.response.foros,
          foro: {
            nombre: foro.nombre,
            id: foro._id,
            fecha: foro.fecha,
            preguntas: foro.preguntas,
            descripcion: foro.descripcion
          }
        })
      })
    },
    remove: function(id) {
      var self = this;
      this.getModel('Foro').remove(id, function(foro) {
        self.send(200);
      })
    },
    modify: function(id) {
      var self = this
      this.getModel('Foro').modify(id, params, function(foro) {
        self.send(200);
      });
    }
  })
