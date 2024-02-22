$(document).ready(function() {
  $('select').on('change', function() { //Change detecta cuando se hace un cambio en el input del formulario que tiene id=select
    var selectedValue = $(this).val();
    $('#intervaloPeriodica, #lapsoPeriodica, #intPeriodica, #lapPeriodica').toggle(selectedValue === "Programada");
  });
});

