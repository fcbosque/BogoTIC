module.exports = require('matador').BaseController.extend(function () {
  this.viewFolder = ''
  this.addBeforeFilter(this.allForos)
})
  .methods({
    allForos: function(callback) {
      var self = this;
      this.getModel('Foro').all(function(foros) {
        self.response.foros = foros;
        return callback(null)
      })
    }
  });
