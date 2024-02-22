$(document).ready(function () {
    $('#tabla').DataTable({
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
            aria: {
                sortAscending: ": active para ordenar la columna en orden ascendente",
                sortDescending: ": active para ordenar la columna en orden descendente"
            }
        },
        scrollY: 400,
        lengthMenu: [ [5,10, 25, -1], [5,10, 25, "todos"] ],
    });
});


// const Button = ({ texto, texto1, deDondeVengo}) =>{
//     <form action="/actualizarTablaFechas-Gestion" method="POST" id="formularioFiltroFechas">
//     <div class="container containerFormulario">
//       <div class="row">
//         <div class="col-sm-2 max-width-150">
//           <label for="user" class="form-label mt-2"><strong>Fecha inicio</strong></label>
//           <input type="date" class="form-control" id="fechaInicio" name="fechaInicio" tabindex="1">
//         </div>
//         <div class="col-sm-2 max-width-150">
//           <label for="user" class="form-label mt-2"><strong>Fecha fin</strong></label>
//           <input type="date" class="form-control" id="fechaFin" name="fechaFin" tabindex="1">
//         </div>
//       {deDondeVengo === ""} }

//       </div> 
//     </div>
//   </form>
// }

// <Button TEXT1={"BOTON PARA CONFIRMAR"}