$(document).ready(function(){
    $('select').on('change',function(){
      var selectValor = $(this).val();
      if(selectValor == "Programada"){
        document.getElementById("intervaloPeriodica").style.display = "block";
        document.getElementById("lapsoPeriodica").style.display = "block";
        document.getElementById("intPeriodica").style.display = "block";
        document.getElementById("lapPeriodica").style.display = "block";
      }else{
        document.getElementById("intervaloPeriodica").style.display = "none";
        document.getElementById("lapsoPeriodica").style.display = "none";
        document.getElementById("intPeriodica").style.display = "none";
        document.getElementById("lapPeriodica").style.display = "none";
      }
    });
  });

// Se puede cambiar los modales(que se cierren solo con el boton) y todos los botones cancelar para que se actualice la pagina y no tener problema con valores cambiados y dejado a medias