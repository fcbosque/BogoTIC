module.exports = require(app.set('controllers') + '/ApplicationController').extend(function() {
  this.viewFolder = 'foro'
})
  .methods({
    index: function() {
      var self = this;
      this.getModel('Foro').all(function(foros) {
        self.render('index', {
          foros: foros,
          total: foros.length
        })
      })
    },
    new: function() {
      this.render('new', {});
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
      this.getModel('Foro').show(id, function(foro) {
        self.render('show', {
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
