
//EL SIGUIENTE CÓDIGO ANDA BIEN PERO CUANDO SE LE PONE EL SCROLLY ME DESALINEA EL ENCABEZADO DE LA TABLA CON EL BUSCAR
$(document).ready(function(){
    var table = $('#tabla').DataTable({
       orderCellsTop: true,
       fixedHeader: true,
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
                lengthMenu: [ [-1,5,10, 25], ["todos",5,10, 25] ],
                columnDefs: [
                    { targets: [3], orderable: false }
                ],
    });

    //Creamos una fila en el head de la tabla y lo clonamos para cada columna
    $('#tabla thead tr').clone(true).appendTo( '#tabla thead' );
    

    $('#tabla thead tr:eq(1) th').each( function (i) {
    if(i<7){
        var title = $(this).text(); //es el nombre de la columna
        $(this).html( '<input type="text" placeholder="'+title+'..." />' );
 
        $( 'input', this ).on( 'keyup change', function () {
            if ( table.column(i).search() !== this.value ) {
                table
                    .column(i)
                    .search( this.value )
                    .draw();
            }
        } );
    }
    } );
    
    $('#tabla thead tr:eq(1) th:last-child').text('');
    $('#tabla thead tr:eq(1) input[type="text"]').css('width', '100%');
    var $searchInputs = $('#tabla thead tr:eq(1) input[type="text"]');
    $searchInputs.css({
        'width': '100%',
        'min-width': '100px' // Puedes ajustar este valor según tus necesidades
    });
    var $searchContainer = $('#tabla thead tr:eq(1)');
    $searchContainer.css('max-width', '100px');


    // Desactivar el ordenamiento para las celdas de encabezado clonadas
    $('#tabla thead tr:eq(1) th').each(function () {
        $(this).removeClass('sorting sorting_asc sorting_desc').addClass('no-sort');
    });
    // Formatear la segunda columna centrada
    $('#tabla tbody tr td:nth-child(2)').css('text-align', 'center');
});
