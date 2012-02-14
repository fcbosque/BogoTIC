module.exports = require(app.set('controllers') + '/ApplicationController').extend(function() {
  this.viewFolder = 'usuario'
})
  .methods({
    index: function() {
      var self = this;
      this.getModel('Usuario').all(function(usuarios) {
        self.render('index', {
          usuarios: usuarios,
          foros: this.response.foros
        })
      })
    },
    new: function() {
      this.render('new', { foros: this.response.foros });
    },
    create: function() {
      var self = this;
      var usuario = this.request.body.usuario;
      this.getModel('Usuario').create(usuario, v.bind(this, function(usuario) {
        self.response.redirect("/");
      }))
    },
    show: function() {
      var self = this;
      var username = this.request.params.username;
      this.getModel('Usuario').show(username, function(usuario) {
        self.render('show', {
          usuario: usuario,
          foros: this.response.foros
        })
      })
    },
    remove: function() {
      var self = this;
      var username = this.request.params.username;
      this.getModel('Usuario').remove(username, function(usuario) {
        self.send(200);
      })
    },
    modify: function() {
      var self = this;
      var username = this.request.params.username;
      this.getModel('Usuario').modify(username, params, function(usuario) {
        self.send(200);
      });
    }
  })
