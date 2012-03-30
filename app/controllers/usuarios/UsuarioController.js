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
      this.getModel('Usuario').create(usuario, function(err, usuario) {
        if (err) console.log(err);
        self.response.redirect("/");
      });
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
    },
    login: function () {
      var self = this;
      var data = this.request.body.usuario;
      this.getModel('Usuario').authenticate(data, function (err, user) {
        if (err) console.log(err);
        if (user) {
          // @todo Poner en el middleware de sessiones.
          self.response.usuario = user;
          console.log('Mostrando', user);
          self.render('../index');
        } else {
          self.response.message = { type: 'Error', message: 'El usuario no se encontro'};
          self.response.redirect('/');
        }
      });
    }
  })
