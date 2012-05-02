$(document).ready(function () {
  var favorito = $('#favorito');

  favorito.click(function () {
    favoritear(favorito);
  });

  function esFav (btn) {
    return btn.find('i').hasClass('icon-star');
  }

  function favoritear (b) {
    var fav = esFav(b);
    $.post(location.pathname + '/favorito', {
      favorito: !fav
    }, function (data, status) {
      b.button('toggle');
      if (fav) {
        b.find('i').removeClass('icon-star');
        b.find('i').addClass('icon-star-empty');
      } else {
        b.find('i').removeClass('icon-star-empty');
        b.find('i').addClass('icon-star');
      }
    }).error(function (xhr) {
      alert(xhr.status + ' ' + xhr.responseText);
    });
  };
});