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

/**
 * El modelo de eventos.
 * Este modelo se usa para crear una interface al momento de guardar eventos
 * en la base de datos o de mandar correos o demas acciones.
 *
 * @api public
 */

module.exports = require(app.set('models') + '/ApplicationModel').extend(function() {
  var EventoSchema = new this.Schema({
    browser : { type: String },
    ip      : { type: String },
    evento  : { type: String },
    data    : { type: this.Schema.Types.Mixed },
    fecha   : { type: Date, default: Date.now }
  });

  this.DBModel      = this.mongoose.model('Evento', EventoSchema);
}).methods({
     
    /**
     * Guarda un evento en la base de datos para ser consultado despues
     * en la actividad reciente
     * 
     * @api public
     * @param {Function} callback
     */

    saveEvent: function(evento, req, data) {
      var _evento = new this.DBModel({
        browser: req.headers['user-agent'],
        ip: req.connection.remoteAddress,
        evento: evento,
        data: data || {}
      })
      _evento.save();
    }
  })
