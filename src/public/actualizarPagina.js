window.addEventListener('resize', () => {
    // Actualiza la página
    window.location.reload();
  });

//ESTA FUNCIÓN ME ACTUALIZA EL FORMATO PARA VER LAS DISTINTAS FECHAS EN EL MODAL VER ORDEN
  $(document).ready(function() {
    // Evento que se dispara al mostrar el modal verOrden
    $('body').on('show.bs.modal', '[id^=verOrden]', function (e) {
        // Obtiene las fechas del modal verOrden actual
        var fechaInicio = $(this).find('#fechaInicio').text().trim();
        var fechaInicioReal = $(this).find('#fechaInicioReal').text().trim();
        var fechaFin = $(this).find('#fechaFin').text().trim();

        // Aplica el formato deseado a las fechas utilizando Moment.js
        var fechaInicioFormateada = moment(fechaInicio, 'YYYY-MM-DDTHH:mm').format('DD-MM-YYYY HH:mm');
        var fechaInicioRealFormateada = moment(fechaInicioReal, 'YYYY-MM-DDTHH:mm').format('DD-MM-YYYY HH:mm');
        var fechaFinFormateada = moment(fechaFin, 'YYYY-MM-DDTHH:mm').format('DD-MM-YYYY HH:mm');

        // Establece las fechas formateadas en el modal verOrden actual
        $(this).find('#fechaInicio').text(fechaInicioFormateada);
        $(this).find('#fechaInicioReal').text(fechaInicioRealFormateada);
        $(this).find('#fechaFin').text(fechaFinFormateada);
    });
});

function Recargar() {
  // Recarga la página
  setTimeout(function() {
    window.location.reload();
  }, 500);
}