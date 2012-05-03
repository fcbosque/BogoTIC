/*
 * This file is part of Foros BogoTIC.
 *
 * Foros BogoTIC is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 * 
 * Foros BogoTIC is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 * 
 * You should have received a copy of the GNU General Public License
 * along with Foros BogoTIC.  If not, see <http://www.gnu.org/licenses/>.
*/

var matador = require('matador')

app.configure(function () {
  app.set('models', __dirname + '/app/models')
  app.set('helpers', __dirname + '/app/helpers')
  app.set('views', __dirname + '/app/views')
  app.set('controllers', __dirname + '/app/controllers')

  app.set('view engine', 'html')
  app.register('.html', matador.engine)

  app.use(matador.methodOverride())
  app.use(matador.bodyParser({
    uploadDir: __dirname + '/public/subidos',
    keepExtensions: true
  }))
  app.use(matador.cookieParser())
  app.use(matador.session({ secret:"SeSiOnEsDeBoGoTiC" }))
  app.use(matador.static(__dirname + '/public'))
})

app.configure('development', function () {
  app.use(matador.errorHandler({ dumpExceptions: true, showStack: true }))
})

app.configure('production', function () {
  app.use(matador.errorHandler())
})
app.set('viewPartials', matador.partials.build(app.set('views')))
matador.mount(require('./app/config/routes'))
app.listen(3000)
console.log('matador running on port 3000')
