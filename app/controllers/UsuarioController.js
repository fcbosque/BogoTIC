module.exports = require(app.set('controllers') + '/ApplicationController').extend(function() {
  this.viewFolder = 'usuario'
})
  .methods({
    index: function() {
      var self = this;
      this.getModel('Usuario').all(function(usuarios) {
        self.render('index', {
          usuarios: usuarios
        })
      })
    },
    new: function() {
      this.render('new', {});
    },
    create: function() {
      var self = this;
      var usuario = this.request.body
      this.getModel('Usuario').create(usuario, v.bind(this, function(usuario) {
        self.send(200, {})
      }))
    },
    show: function(id) {
      var self = this;
      this.getModel('Usuario').show(id, function(usuario) {
        self.render('show', {
          usuario: usuario
        })
      })
    },
    remove: function(id) {
      var self = this;
      this.getModel('Usuario').remove(id, function(usuario) {
        self.send(200);
      })
    },
    modify: function(id) {
      var self = this
      this.getModel('Usuario').modify(id, params, function(usuario) {
        self.send(200);
      });
    }
  })
