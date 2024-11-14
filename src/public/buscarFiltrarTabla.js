$(document).ready(function(){
    // Configuración para la tabla principal (#tabla)
    var $headerRow = $('#tabla thead tr');
    var $clonedHeaderRow = $headerRow.clone(true).addClass('cloned-header-row').appendTo('#tabla thead');
    
    $clonedHeaderRow.find('th').each(function (i) {
        if (i < 7) {
            var title = $(this).text();
            $(this).html('<input type="text" class=" '+title+'" placeholder="'+title+'..." />');
            
            $(this).on('click', 'input', function (e) {
                e.stopPropagation();
            }).on('keyup change', 'input', function () {
                var columnIndex = $(this).closest('th').index();
                if (table.column(columnIndex).search() !== this.value) {
                    table.column(columnIndex).search(this.value).draw();
                }
            });
        }
    });

    var table = $('#tabla').DataTable({
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
        lengthMenu: [ [5,10,25,-1], [5,10,25,"Mostrar todo"] ],
        columnDefs: [
            { targets: [7], orderable: false }
        ],
        drawCallback: function() {
            $('#tabla tbody tr').each(function() {
                var fechaCelda = $(this).find('td:eq(5)');
                var fecha = fechaCelda.text().trim();

                if (moment(fecha, 'YYYY-MM-DDTHH:mm', true).isValid() && !fechaCelda.hasClass('formatted')) {
                    var fechaFormateada = moment(fecha, 'YYYY-MM-DDTHH:mm').format('DD - MM - YYYY HH:mm');
                    fechaCelda.text(fechaFormateada).addClass('formatted');
                }
            });
        },
        scrollY: 500,
        scrollX: true,
    });

    $clonedHeaderRow.find('th:last-child').text('');
});

$(document).ready(function(){
    // Configuración para la tabla sin privilegio (#tablaSinPrivilegio)
    var $headerRowSinPriv = $('#tablaSinPrivilegio thead tr');
    var $clonedHeaderRowSinPriv = $headerRowSinPriv.clone(true).addClass('cloned-header-row').appendTo('#tablaSinPrivilegio thead');
    
    $clonedHeaderRowSinPriv.find('th').each(function (i) {
        if (i < 3) {
            var title = $(this).text();
            $(this).html('<input type="text" class=" '+title+'" placeholder="'+title+'..." />');
            
            $(this).on('click', 'input', function (e) {
                e.stopPropagation();
            }).on('keyup change', 'input', function () {
                var columnIndex = $(this).closest('th').index();
                if (tableSinPriv.column(columnIndex).search() !== this.value) {
                    tableSinPriv.column(columnIndex).search(this.value).draw();
                }
            });
        }
    });

    var tableSinPriv = $('#tablaSinPrivilegio').DataTable({
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
            { targets: [2], orderable: false }
        ],
        drawCallback: function() {
            $('#tablaSinPrivilegio tbody tr').each(function() {
                var fechaCelda = $(this).find('td:eq(1)');
                var fecha = fechaCelda.text().trim();

                if (moment(fecha, 'YYYY-MM-DDTHH:mm', true).isValid() && !fechaCelda.hasClass('formatted')) {
                    var fechaFormateada = moment(fecha, 'YYYY-MM-DDTHH:mm').format('DD - MM - YYYY HH:mm');
                    fechaCelda.text(fechaFormateada).addClass('formatted');
                }
            });
        },
        scrollY: 500,
        scrollX: true,
    });

    $clonedHeaderRowSinPriv.find('th:last-child').text('');
});
