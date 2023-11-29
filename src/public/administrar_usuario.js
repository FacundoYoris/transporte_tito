$(document).ready(function() {
    $("#boton-aceptar").click(function() {
      var contrasenaActual = $("#contrasena_actual").val();
      var nombreNuevo = $("#nombre_nuevo").val();
      var contrasenaNueva = $("#contrasena_nueva").val();
      var repetirContrasena = $("#repetir_contrasena").val();
  
      if (contrasenaNueva != repetirContrasena) {
        alert("Las contraseñas no coinciden.");
        return;
      }
  
      // Solicitar confirmación al usuario
      var confirmacion = confirm("¿Desea actualizar los datos?");
      if (confirmacion) {
        // Actualizar los datos en la base de datos
        // ...
      } else {
        // Cancelar la operación
        window.location.reload();
      }
    });
  });