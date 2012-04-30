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
    modeloId : { type: String, required: true },
    usuario  : { type: String, required: true },
    voto     : { type: Number, required: true, enum: [1, -1] }
  });

  this.DBModel      = this.mongoose.model('Voto', VotoSchema);
}).methods({
  /**
   * Este metodo permitira registrar los votos
   */
  registrarVoto: function (modelo, modeloID, usuario, voto, callback) {
    // @todo Agregar un find aca por los datos para verificar que no este
    // duplicando voto.
    var self = this;
    var votando = new this.DBModel({
      modelo: modelo,
      modeloId: modeloID,
      usuario: usuario,
      voto: voto
    });
    votando.save(function (err, doc) {
      // Agregamos el voto al modelo elejido
      var modelos = modelo.split(':');
      var query = {};
      // Creamos la condicion de acuerdo al subrecurso mencionado
      query[modelos[1] + '._id'] = new self.mongoose.Types.ObjectId(modeloID);
      // Traemos el modelo de acuerdo al recurso especificado
      self.mongoose.model(modelos[0]).find(query, function (err, foros) {
        // Filtramos la pregunta correcta.
        var correcto = foros[0][modelos[1]].filter(function (preg) {
          return (preg._id.toString() == modeloID);
        });
        // Ajustamos el voto
        correcto[0].votos += voto;
        correcto[0].votantes++;
        // Pasamos la lista de preguntas actualizada
        var diferencia = {};
        diferencia[modelos[1]] = foros[0][modelos[1]];
        // Actualizamos el recurso
        self.mongoose.model(modelos[0]).update(query, diferencia, callback);
      })
    });
  }
});