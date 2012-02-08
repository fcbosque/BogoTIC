module.exports = require(app.set('controllers') + '/ApplicationController').extend()
  .methods({
    index: function () {
      this.render('index', { foros: this.response.foros });
    },
    acerca: function() {
      this.render('acerca', { foros: this.response.foros });
    },
    ayuda: function() {
      this.render('ayuda', { foros: this.response.foros });
    },
    tos: function() {
      this.render('tos', { foros: this.response.foros });
    }
  })
