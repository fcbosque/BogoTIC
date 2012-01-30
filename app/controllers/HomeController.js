module.exports = require(app.set('controllers') + '/ApplicationController').extend()
  .methods({
    index: function () {
      this.render('index', {});
    },
    acerca: function() {
      this.render('acerca', {});
    },
    ayuda: function() {
      this.render('ayuda', {});
    },
    tos: function() {
      this.render('tos', {});
    }
  })
