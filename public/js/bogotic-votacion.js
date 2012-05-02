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

$(document).ready(function (){
  function votar (v) {
    var voto = ( v ? 'favor' : 'contra');
    $.post(location.pathname + '/votar', {
      voto: voto
    }, function (data, status) {
      $('#votarUp, #votarDown').fadeOut(500, function () {
        $(this).remove();
      });
    }).error(function (xhr) {
      alert(xhr.status + ' ' + xhr.responseText);
    });
  }

  var btnUp = $('#votarUp'),
      btnDown = $('#votarDown');

  btnUp.click(function () {
    btnUp.button('loading');
    votar(true);
  });

  btnDown.click(function () {
    btnDown.button('loading');
    votar(false);
  });
});