function enviarDatosEditModal(id){
    const url = "/stock-disponible";
    fetch(url)
        .then(response => response.json())
        .then(data => console.log(data))
        .catch(error => console.log(error))
}
// // function enviarDatosEditModal(id){
// //     const url = "/orden-de-trabajo/edit/" + id;
// //     fetch(url)
// //       .then(response => response.json())
// //       .then(data => {
// //         // Envia los datos al modal
// //         // document.getElementById("editarOrden"+data.id_orden_trabajo).postMessage(data, "*");
// //       })
// //       .catch(error => console.log(error));
// //   }

//   // function enviarDatosEditModal(id){
//   //   const url = "/orden-de-trabajo/edit/" + id;
//   //   fetch(url)
//   //     .then(response => response.json())
//   //     .then(data => {
//   //       // Obtiene el elemento DOM del modal
//   //       const modal = document.getElementById("editarOrden"+data.id_orden_trabajo);
//   //       const idInput = modal.querySelector("#id");
//   //       const tareaInput = modal.querySelector("#tarea");
//   //       // const tipoInput = modal.querySelector("#tipo");
//   //       const fechaInput = modal.querySelector("#fecha");
//   //       const activoInput = modal.querySelector("#activo");
//   //       const ResponsableInput = modal.querySelector("#Responsable");
//   //       const tiempo_esperadoInput = modal.querySelector("#tiempo_esperado");
//   //       // const PrioridadInput = modal.querySelector("#Prioridad");
//   //       const descripciónInput = modal.querySelector("#descripción");
//   //       idInput.value= data.id_orden_trabajo;
//   //       tareaInput.value= data.actividad;
//   //       // tipoInput.value= data.tipo;
//   //       fechaInput.value= data.fecha_inicio;
//   //       activoInput.value= data.activo;
//   //       ResponsableInput.value= data.responsable;
//   //       tiempo_esperadoInput.value= data.tiempo_esperado;
//   //       // PrioridadInput.value= data.prioridad;
//   //       descripciónInput.value= data.descripción_problematica;
//   //       console.log(tareaInput.value);
//   //     })
//   //     .catch(error => console.log(error));
//   // }


//   function enviarDatosEditModal(id){
//     const url = "/orden-de-trabajo/edit/" + id;
//     fetch(url)
//       .then(response => response.json())
//       .then(data => {
//         // Obtiene el elemento DOM del modal
//         const modal = document.getElementById("editarOrden"+data.id_orden_trabajo);
  
//         // Comprueba si el elemento modal existe
//         if (modal) {
//           const idInput = modal.querySelector("#id");
//           const tareaInput = modal.querySelector("#tarea");
//           // const tipoInput = modal.querySelector("#tipo");
//           const fechaInput = modal.querySelector("#fecha");
//           const activoInput = modal.querySelector("#activo");
//           const ResponsableInput = modal.querySelector("#Responsable");
//           const tiempo_esperadoInput = modal.querySelector("#tiempo_esperado");
//           // const PrioridadInput = modal.querySelector("#Prioridad");
//           const descripciónInput = modal.querySelector("#descripción");
  
//           idInput.value= data.id_orden_trabajo;
//           tareaInput.value= data.actividad;
//           // tipoInput.value= data.tipo;
//           fechaInput.value= data.fecha_inicio;
//           activoInput.value= data.activo;
//           ResponsableInput.value= data.responsable;
//           tiempo_esperadoInput.value= data.tiempo_esperado;
//           // PrioridadInput.value= data.prioridad;
//           descripciónInput.value= data.descripción_problematica;
//         }
//       })
//       .catch(error => console.log(error));
//   }