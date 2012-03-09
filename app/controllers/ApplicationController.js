module.exports = require('matador').BaseController.extend(function () {
  this.viewFolder = ''
  this.addBeforeFilter(this.allForos)
  this.addBeforeFilter(this.usuarioActual)
})
  .methods({
    allForos: function(callback) {
      var self = this;
      this.getModel('Foro').all(function(foros) {
        self.response.foros = foros;
        return callback(null)
      })
    },
    usuarioActual: function(callback) {
      var self = this;
      if(this.request.cookies.autorizado) {
        this.getModel('Usuario').show(function(usuario) {
          self.response.usuario = usuario;
          return callback(null)
        })
      } else {
        return callback(null)
      }
    }
  });
