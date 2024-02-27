
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
                    { targets: [1,2,3,4,6,7], orderable: false }
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

    // TODO ESTO ES PARA CAMBIAR EL FORMATO DE LA FECHA.
    $('#tabla tbody tr').each(function() {
        var fecha = $(this).find('td:eq(5)').text(); // Obtener la fecha de la columna 5
        var fechaFormateada = moment(fecha, 'YYYY-MM-DDTHH:mm').format('DD - MM - YYYY HH:mm'); // Formatear la fecha
        $(this).find('td:eq(5)').text(fechaFormateada); // Establecer la fecha formateada en la columna 5
    });

    // Desactivar la ordenación para las celdas de encabezado clonadas
    $('#tabla thead tr:eq(1) th').each(function () {
        $(this).removeClass('sorting sorting_asc sorting_desc').addClass('no-sort');
    });
    
    
});











//ESTE CÓDIGO ME ARREGLA LO DESALINEADO PERO SE ROMPEN LOS BUSCADORES Xd
// $(document).ready(function () {
//     var table = $('#tabla').DataTable({
//         orderCellsTop: true,
//         fixedHeader: true,
//         language: {
//             processing: "Tratamiento en curso...",
//             search: "Buscar&nbsp;:",
//             lengthMenu: "Visualizar _MENU_",
//             info: "_START_ a _END_ -- Total: _TOTAL_ items",
//             infoEmpty: "No existen datos.",
//             infoFiltered: "(filtrado de _MAX_ elementos en total)",
//             infoPostFix: "",
//             loadingRecords: "Cargando...",
//             zeroRecords: "No se encontraron datos con tu búsqueda",
//             emptyTable: "No hay datos disponibles en la tabla.",
//             paginate: {
//                 first: "Primero",
//                 previous: "Anterior",
//                 next: "Siguiente",
//                 last: "Ultimo"
//             },
//             aria: {
//                 sortAscending: ": active para ordenar la columna en orden ascendente",
//                 sortDescending: ": active para ordenar la columna en orden descendente"
//             }
//         },
//         scrollY: 400,
//         lengthMenu: [ [5,10, 25, -1], [5,10, 25, "todos"] ],
        
//     });
//     //Creamos una fila en el head de la tabla y lo clonamos para cada columna
//     $('#tabla thead tr').clone(true).appendTo( '#tabla thead' );

//     $('#tabla thead tr:eq(1) th').each( function (i) {
//         var title = $(this).text(); //es el nombre de la columna
//         $(this).html( '<input type="text" placeholder="Search...'+title+'" />' );
 
//         $( 'input', this ).on( 'keyup change', function () {
//             if ( table.column(i).search() !== this.value ) {
//                 table
//                     .column(i)
//                     .search( this.value )
//                     .draw();
//             }
//         } );
//     } );   
// });