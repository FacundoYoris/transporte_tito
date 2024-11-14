//Javascript correspondiente a la tabla stock agotado
$(document).ready(function(){
    // Creamos una fila en el head de la tabla y la clonamos para cada columna
    var $headerRow = $('#tabla thead tr');
    var $clonedHeaderRow = $headerRow.clone(true).addClass('cloned-header-row').appendTo('#tabla thead');
    
    $clonedHeaderRow.find('th').each(function (i) {
        if (i < 5) {
            var title = $(this).text(); //es el nombre de la columna
            $(this).html('<input type="text" class=" '+title+'"  placeholder="'+title+'..." />');
            
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

    var table = $('#tabla').DataTable({
       orderCellsTop: true,
       responsive: true,
       
       lengthChange: true,
       paging: true, // Oculta los botones de anterior y siguiente
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
                scrollY: 500, // Agregamos scroll en Y
                scrollX: true,
                lengthMenu: [ [5, 10, 25, -1], [5, 10, 25, "Mostrar todo"] ],
                
                
    });
    
});


//Javascript correspondiente a la tabla stock agotado
$(document).ready(function(){
    // Creamos una fila en el head de la tabla y la clonamos para cada columna
    var $headerRow = $('#tabla2 thead tr');
    var $clonedHeaderRow = $headerRow.clone(true).addClass('cloned-header-row').appendTo('#tabla2 thead');
    
    $clonedHeaderRow.find('th').each(function (i) {
        if (i < 5) {
            var title = $(this).text(); //es el nombre de la columna
            $(this).html('<input type="text" class=" '+title+'"  placeholder="'+title+'..." />');
            
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

    var table = $('#tabla2').DataTable({
       orderCellsTop: true,
       responsive: true,
       
       lengthChange: true,
       paging: true, // Oculta los botones de anterior y siguiente
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
                scrollY: 500, // Agregamos scroll en Y
                scrollX: true,
                lengthMenu: [ [5, 10, 25, -1], [5, 10, 25, "Mostrar todo"] ],
                columnDefs: [
                    { targets: [5], orderable: false } // Ajustamos el índice de la columna que no es ordenable
                ],
                
    });
    $clonedHeaderRow.find('th:last-child').text('');
});
