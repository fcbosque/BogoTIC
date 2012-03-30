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
 * Modelo base para extender en la aplicación
 *
 * En esta clase se define la conexión a la base de datos y algunas
 * propiedades básicas de los modelos.
 *
 * @api public
 */

module.exports = require('./BaseModel').extend(function() {
  this.mongo = require('mongodb');
  this.mongoose = require('mongoose');
  this.Schema = this.mongoose.Schema;
  this.ObjectId = this.Schema.ObjectId;
  this.mongoose.connect('mongodb://localhost/BogoTIC');

  this.categorias = ['Tecnología y deuda pública', 'Tecnología e investigación social',
                     'Tecnología y productividad', 'Tecnología y educación',
                     'Tecnología y fomento', 'Tecnología y gobierno', 'Tecnología y cultura',
                     'Tecnología e igualdad', 'Tecnología y derechos', 'Tecnología y pirateria']

  this.localidades = ['Antonio Nariño', 'Barrios Unidos', 'Bosa',
                      'Chapinero', 'Ciudad Bolívar', 'Engativá', 'Fontibón',
                      'Kennedy', 'La Candelaria', 'Los Mártires', 'Puente Aranda',
                      'Rafael Uribe Uribe', 'San Cristóbal', 'Santa Fe', 'Suba',
                      'Sumapaz', 'Teusaquillo', 'Tunjuelito', 'Usaquén', 'Usme']
}).methods({
    /**
     * Prototipo de create
     * @api public
     * @param {Object} params
     * @param {Function} callback
     */
    create: function(params, callback) {
    },
    /**
     * Prototipo de show
     * @api public
     * @param {Integer} id
     * @param {Function} callback
     */
    show: function(id, callback) {
    },
    /**
     * Prototipo de remove
     * @api public
     * @param {Integer} id
     * @param {Function} callback
     */
    remove: function(id, callback) {
    },
    /**
     * Prototipo de modify
     * @api public
     * @param {Integer} id
     * @param {Object} params
     * @param {Function} callback
     */
    modify: function(id, params, callback) {
    },
    /**
     * Prototipo de all
     * @api public
     * @param {Function} callback
     */
    all: function(callback) {
    },
    /**
     * Prototipo de search
     * @api public
     * @param {String} params
     * @param {Function} callback
     */
    search: function(params, callback) {

    }
  })
