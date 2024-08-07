
//EL SIGUIENTE CÓDIGO ANDA BIEN PERO CUANDO SE LE PONE EL SCROLLY ME DESALINEA EL ENCABEZADO DE LA TABLA CON EL BUSCAR
$(document).ready(function(){

     // Creamos una fila en el head de la tabla y la clonamos para cada columna
     var $headerRow = $('#tabla thead tr');
     var $clonedHeaderRow = $headerRow.clone(true).appendTo('#tabla thead');
     
 
     $clonedHeaderRow.find('th').each(function (i) {
         if (i < 7) {
             var title = $(this).text(); //es el nombre de la columna
             $(this).html('<input type="text" class="'+title+'" placeholder="'+title+'..." />');
             
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
                    { targets: [2,3,6,7], orderable: false }
                ],
                scrollY: 400, // Agregamos scroll en Y
                scrollX: true,
    });
    $clonedHeaderRow.find('th:last-child').text('');
   
});
