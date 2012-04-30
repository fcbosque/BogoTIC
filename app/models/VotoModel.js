/*!
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
 * El modelo de Votos. Es usado para registrar los diferentes votos
 * que se hagan en toda la aplicacion. Este modelo lo usara cada controlador
 * para agregar votos a cada uno de sus subrecursos (preguntas)
 * 
 * @api public
 */

module.exports = require(app.set('models') + '/ApplicationModel').extend(function() {
  var ObjectId = this.ObjectId;
  var VotoSchema = new this.Schema({
    modelo   : { type: String, required: true },
    modeloId : { type: ObjectId, required: true },
    usuario  : { type: ObjectId, required: true },
    voto     : { type: Number, required: true, enum: [1, -1] }
  });

  this.DBModel      = this.mongoose.model('Voto', VotoSchema);
}).methods({
  /**
   * Este metodo permitira registrar los votos
   */
  registrarVoto: function (modelo, modeloID, usuario, voto, callback) {
    var voto = new this.DBModel({
      modelo: modelo,
      modeloId: modeloID,
      usuario: usuario,
      voto: voto
    });
    voto.save(callback);
  }
});