$(document).ready(function(){
    // Creamos una fila en el head de la tabla y la clonamos para cada columna
    var $headerRow = $('#tabla thead tr');
    var $clonedHeaderRow = $headerRow.clone(true).addClass('cloned-header-row').appendTo('#tabla thead');
    
    $clonedHeaderRow.find('th').each(function (i) {
        if (i < 7) {
            var title = $(this).text(); //es el nombre de la columna
            $(this).html('<input type="text" placeholder="'+title+'..." />');
            
            $(this).on('click', 'input', function (e) {
                e.stopPropagation(); // Evitar que el evento de clic se propague a la columna para ordenar
            }).on('keyup change', 'input', function () {
                var columnIndex = $(this).closest('th').index();
                if (table.column(columnIndex).search() !== this.value) {
                    table.column(columnIndex).search(this.value).draw();
                }
            });
        }
    });

    // Inicializamos la DataTable
    var table = $('#tabla').DataTable({
        orderCellsTop: true,
        fixedHeader:true,
        responsive: true,
        language: {
            processing: "Tratamiento en curso...",
            search: "Buscar&nbsp;:",
            lengthMenu: "Visualizar _MENU_",
            info: "_START_ a _END_ -- Total: _TOTAL_ items",
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
        lengthMenu: [ [5,10, 25,-1], [5,10, 25,"Mostrar todo"] ],
        columnDefs: [
            { targets: [7], orderable: false }
        ],
        drawCallback: function() {
            // Formatear las fechas en la tabla cada vez que se redibuja
            $('#tabla tbody tr').each(function() {
                var fecha = $(this).find('td:eq(5)').text();
                // Verificar si la fecha está en el formato original
                if (moment(fecha, 'YYYY-MM-DDTHH:mm', true).isValid()) {
                    // Si es así, formatearla al nuevo formato
                    var fechaFormateada = moment(fecha, 'YYYY-MM-DDTHH:mm').format('DD - MM - YYYY HH:mm');
                    $(this).find('td:eq(5)').text(fechaFormateada);
                }
                // Si la fecha ya está en el nuevo formato, no hacer nada
            });
        },
        scrollY: 500, // Agregamos scroll en Y
        scrollX: true, // Agregamos scroll en X
    });
    $clonedHeaderRow.find('th:last-child').text('');
});
$(document).ready(function(){
    // Creamos una fila en el head de la tabla y la clonamos para cada columna
    var $headerRow = $('#tablaSinPrivilegio thead tr');
    var $clonedHeaderRow = $headerRow.clone(true).addClass('cloned-header-row').appendTo('#tablaSinPrivilegio thead');
    
    $clonedHeaderRow.find('th').each(function (i) {
        if (i < 3) { // Ajustamos el número de columnas aquí
            var title = $(this).text(); // es el nombre de la columna
            $(this).html('<input type="text" class="buscador_columna" placeholder="'+title+'..." />');
            
            $(this).on('click', 'input', function (e) {
                e.stopPropagation(); // Evitar que el evento de clic se propague a la columna para ordenar
            }).on('keyup change', 'input', function () {
                var columnIndex = $(this).closest('th').index();
                if (table.column(columnIndex).search() !== this.value) {
                    table.column(columnIndex).search(this.value).draw();
                }
            });
        }
    });

    // Inicializamos la DataTable
    var table = $('#tablaSinPrivilegio').DataTable({
        orderCellsTop: true,
        fixedHeader: true,
        responsive: true,
        language: {
            processing: "Tratamiento en curso...",
            search: "Buscar&nbsp;:",
            lengthMenu: "Visualizar _MENU_",
            info: "_START_ a _END_ -- Total: _TOTAL_ items",
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
                last: "Último"
            },
        },
        lengthMenu: [ [5, 10, 25, -1], [5, 10, 25, "Mostrar todo"] ],
        columnDefs: [
            { targets: [2], orderable: false } // Ajustamos el índice de la columna que no es ordenable
        ],
        drawCallback: function() {
            // Formatear las fechas en la tabla cada vez que se redibuja
            $('#tablaSinPrivilegio tbody tr').each(function() {
                var fecha = $(this).find('td:eq(1)').text(); // Ajustamos el índice de la columna de fecha
                // Verificar si la fecha está en el formato original
                if (moment(fecha, 'YYYY-MM-DDTHH:mm', true).isValid()) {
                    // Si es así, formatearla al nuevo formato
                    var fechaFormateada = moment(fecha, 'YYYY-MM-DDTHH:mm').format('DD - MM - YYYY HH:mm');
                    $(this).find('td:eq(1)').text(fechaFormateada);
                }
                // Si la fecha ya está en el nuevo formato, no hacer nada
            });
        },
        scrollY: 500, // Agregamos scroll en Y
        scrollX: true, // Agregamos scroll en X
    });
    $clonedHeaderRow.find('th:last-child').text('');
});
