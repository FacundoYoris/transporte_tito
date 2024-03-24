//Javascript correspondiente a la tabla stock agotado
$(document).ready(function(){
    var table = $('#tabla').DataTable({
       orderCellsTop: true,
       responsive: true,
       searching: false, // Oculta el buscador
       lengthChange: false,
       paging: false, // Oculta los botones de anterior y siguiente
       language: {
                    processing: "Tratamiento en curso...",
                    lengthMenu: "Visualizar _MENU_",
                    info: "Total: _TOTAL_ items",
                    infoEmpty: "No existen datos.",
                    infoFiltered: "(filtrado de _MAX_ elementos en total)",
                    infoPostFix: "",
                    loadingRecords: "Cargando...",
                    zeroRecords: "No se encontraron datos con tu búsqueda",
                    emptyTable: "No hay datos disponibles en la tabla.",
                    paginate: {
                        first: "Primero",
                        previous: "Anterior",
                        next: "Siguiente",
                        last: "Ultimo"
                    },
                },
                scrollX: true,
    });
});
//Javascript correspondiente a la tabla RESPONSABLE - TAREA ASOCIADA
$(document).ready(function(){
    var table1 = $('#tabla1').DataTable({
       orderCellsTop: true,
       responsive: true,
       searching: false, // Oculta el buscador
       lengthChange: false,
       paging: false, // Oculta los botones de anterior y siguiente
       language: {
                    processing: "Tratamiento en curso...",
                    lengthMenu: "Visualizar _MENU_",
                    info: "Total: _TOTAL_ items",
                    infoEmpty: "No existen datos.",
                    infoFiltered: "(filtrado de _MAX_ elementos en total)",
                    infoPostFix: "",
                    loadingRecords: "Cargando...",
                    zeroRecords: "No se encontraron datos con tu búsqueda",
                    emptyTable: "No hay datos disponibles en la tabla.",
                    paginate: {
                        first: "Primero",
                        previous: "Anterior",
                        next: "Siguiente",
                        last: "Ultimo"
                    },
                },
                drawCallback: function() {
                    // Formatear las fechas en la tabla cada vez que se redibuja
                    $('#tabla1 tbody tr').each(function() {
                        var fecha = $(this).find('td:eq(2)').text();
                        // Verificar si la fecha está en el formato original
                        if (moment(fecha, 'YYYY-MM-DDTHH:mm', true).isValid()) {
                            // Si es así, formatearla al nuevo formato
                            var fechaFormateada = moment(fecha, 'YYYY-MM-DDTHH:mm').format('DD - MM - YYYY HH:mm');
                            $(this).find('td:eq(2)').text(fechaFormateada);
                        }
                        // Si la fecha ya está en el nuevo formato, no hacer nada
                    });
                },
                scrollX: true,
    });

});
//Javascript correspondiente a la tabla TAREAS CORRECTIVAS ATRASADAS
$(document).ready(function(){
    var table3 = $('#tabla3').DataTable({
       orderCellsTop: true,
       responsive: true,
       searching: false, // Oculta el buscador
       lengthChange: false,
       paging: false, // Oculta los botones de anterior y siguiente
       language: {
                    processing: "Tratamiento en curso...",
                    lengthMenu: "Visualizar _MENU_",
                    info: "Total: _TOTAL_",
                    infoEmpty: "No existen datos.",
                    infoFiltered: "(filtrado de _MAX_ elementos en total)",
                    infoPostFix: "",
                    loadingRecords: "Cargando...",
                    zeroRecords: "No se encontraron datos con tu búsqueda",
                    emptyTable: "No hay datos disponibles en la tabla.",
                    paginate: {
                        first: "Primero",
                        previous: "Anterior",
                        next: "Siguiente",
                        last: "Ultimo"
                    },
                },
                drawCallback: function() {
                    // Formatear las fechas en la tabla cada vez que se redibuja
                    $('#tabla3 tbody tr').each(function() {
                        var fecha = $(this).find('td:eq(3)').text();
                        // Verificar si la fecha está en el formato original
                        if (moment(fecha, 'YYYY-MM-DDTHH:mm', true).isValid()) {
                            // Si es así, formatearla al nuevo formato
                            var fechaFormateada = moment(fecha, 'YYYY-MM-DDTHH:mm').format('DD - MM - YYYY HH:mm');
                            $(this).find('td:eq(3)').text(fechaFormateada);
                        }
                        // Si la fecha ya está en el nuevo formato, no hacer nada
                    });
                },
                scrollX: true,
    });

});
//Javascript correspondiente a la tabla TAREAS PROGRAMADAS ATRASADAS
$(document).ready(function(){
    var table4 = $('#tabla4').DataTable({
       orderCellsTop: true,
       responsive: true,
       searching: false, // Oculta el buscador
       lengthChange: false,
       paging: false, // Oculta los botones de anterior y siguiente
       language: {
                    processing: "Tratamiento en curso...",
                    lengthMenu: "Visualizar _MENU_",
                    info: "Total: _TOTAL_",
                    infoEmpty: "No existen datos.",
                    infoFiltered: "(filtrado de _MAX_ elementos en total)",
                    infoPostFix: "",
                    loadingRecords: "Cargando...",
                    zeroRecords: "No se encontraron datos con tu búsqueda",
                    emptyTable: "No hay datos disponibles en la tabla.",
                    paginate: {
                        first: "Primero",
                        previous: "Anterior",
                        next: "Siguiente",
                        last: "Ultimo"
                    },
                },
                drawCallback: function() {
                    // Formatear las fechas en la tabla cada vez que se redibuja
                    $('#tabla4 tbody tr').each(function() {
                        var fecha = $(this).find('td:eq(3)').text();
                        // Verificar si la fecha está en el formato original
                        if (moment(fecha, 'YYYY-MM-DDTHH:mm', true).isValid()) {
                            // Si es así, formatearla al nuevo formato
                            var fechaFormateada = moment(fecha, 'YYYY-MM-DDTHH:mm').format('DD - MM - YYYY HH:mm');
                            $(this).find('td:eq(3)').text(fechaFormateada);
                        }
                        // Si la fecha ya está en el nuevo formato, no hacer nada
                    });
                },
                scrollX: true,
    });

});