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
        var patronFecha = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/;
        // Verificar si la fecha coincide con el patrón
        if (patronFecha.test(fechaInicio)) {
          // La fecha tiene el patrón deseado
          // Aplica el formato deseado a las fechas utilizando Moment.js
          var fechaInicioFormateada = moment(fechaInicio, 'YYYY-MM-DDTHH:mm').format('DD-MM-YYYY HH:mm');
          // Establece las fechas formateadas en el modal verOrden actual
          $(this).find('#fechaInicio').text(fechaInicioFormateada);
        }
         // Verificar si la fecha coincide con el patrón
         if (patronFecha.test(fechaInicioReal)) {
          // La fecha tiene el patrón deseado
          // Aplica el formato deseado a las fechas utilizando Moment.js
          var fechaInicioRealFormateada = moment(fechaInicioReal, 'YYYY-MM-DDTHH:mm').format('DD-MM-YYYY HH:mm');
          // Establece las fechas formateadas en el modal verOrden actual
          $(this).find('#fechaInicioReal').text(fechaInicioRealFormateada);
        }
         // Verificar si la fecha coincide con el patrón
         if (patronFecha.test(fechaFin)) {
          // La fecha tiene el patrón deseado
          // Aplica el formato deseado a las fechas utilizando Moment.js
          var fechaFinFormateada = moment(fechaFin, 'YYYY-MM-DDTHH:mm').format('DD-MM-YYYY HH:mm');
          // Establece las fechas formateadas en el modal verOrden actual
          $(this).find('#fechaFin').text(fechaFinFormateada);
        }
    });
});
