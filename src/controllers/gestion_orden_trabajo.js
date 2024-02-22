import connection from "../database/db.js";
import express from 'express';

const save = (req, res) => {
   const tipo = req.body.select;
   const tarea = req.body.tarea; //Esto es "actividad" en la BDD
   const fecha = req.body.fecha;
   const activo = req.body.activo;
   const Responsable = req.body.Responsable;
   const Prioridad = req.body.Prioridad;
   const descripcion = req.body.descripcion;
   const lapso = req.body.lapsoPeriodica;
   const elemento = req.body.elemento;
   
   //formatear fecha 
   const dateDB = new Date(req.body.fecha);//Toma la fecha que viene del formulario
   let year = dateDB.getFullYear();//filtra el año
   let month = dateDB.getMonth() + 1;//filtra el mes (tira siempre un mes menos, empieza desde el cero)
   let day  = dateDB.getDate(); // filtra el dia
   let hour = dateDB.getHours(); //filtra la hora
   let minute = dateDB.getMinutes(); //filtra los minutos
   month = (month < 10 ? "0" : "") + month; //Le da formato "0X si es menor a 10"
   day = (day < 10 ? "0" : "") + day; 
   hour = (hour < 10 ? "0" : "") + hour;
   minute = (minute < 10 ? "0" : "") + minute;
   const fechaFormateada = `${day}/${month}/${year} ${hour}:${minute}`;
   connection.query('INSERT INTO orden_trabajo SET ?', {
     tipo: tipo,
     actividad: tarea,
     fecha_inicio: fechaFormateada,
     activo: activo,
     responsable: Responsable,
     prioridad: Prioridad,
     lapsoProgramada: lapso,
     usuario_creador: req.session.userName,
     descripción_problematica: descripcion,
     elemento: elemento,
   }, (error, results) => {
     if (error) {
       console.log(error);
     } else {
       res.redirect('/orden-de-trabajo/generar-orden');
     }
   });
 };

const update = (req, res)=>{
   const id = req.body.id;
   const tipo = req.body.select;
   const tarea = req.body.tarea; //Esto es "actividad" en la BDD
   const activo = req.body.activo;
   const Responsable = req.body.Responsable;
   const Prioridad = req.body.Prioridad;
   const descripcion = req.body.descripcion;
   const lapso = req.body.lapPeriodica;
   const estado = req.body.estado;
   const solucion = req.body.descripcionSolucion;
   const elemento = req.body.elemento;

   //formatear fecha 
   const dateDB = new Date(req.body.fecha);//Toma la fecha que viene del formulario
   let year = dateDB.getFullYear();//filtra el año
   let month = dateDB.getMonth() + 1;//filtra el mes (tira siempre un mes menos, empieza desde el cero)
   let day  = dateDB.getDate(); // filtra el dia
   let hour = dateDB.getHours(); //filtra la hora
   let minute = dateDB.getMinutes(); //filtra los minutos
   month = (month < 10 ? "0" : "") + month; //Le da formato "0X si es menor a 10"
   day = (day < 10 ? "0" : "") + day; 
   hour = (hour < 10 ? "0" : "") + hour;
   minute = (minute < 10 ? "0" : "") + minute;
   const fechaFormateada = `${day}/${month}/${year} ${hour}:${minute}`;
   connection.query('UPDATE orden_trabajo SET ? WHERE id_orden_trabajo = ?', [{estado:estado,tipo: tipo, actividad: tarea, fecha_inicio:fechaFormateada, activo:activo, responsable:Responsable,  prioridad:Prioridad, usuario_creador: req.session.userName, descripción_problematica:descripcion,lapsoProgramada:lapso,descripcion_solucion:solucion,elemento:elemento},id],(error,results)=>{
      if(error){
         console.log(error);
      }else{
         res.redirect('/orden-de-trabajo/generar-orden');
      }
   })
};

const cambiarEstadoPendienteEnProceso = (req, res)=>{
   const id = req.body.id;

   const fechaInicioReal = new Date(); //Este formato tira tres horas adelantado por la zona horaria.
   const fechaInicioRealMilisegundos = fechaInicioReal.getTime();
   const fechaInicioRealCorrecta = new Date(fechaInicioRealMilisegundos); //Por alguna razon luego utilizando los get se corrige el error de las tres horas

   let yearInicioReal = fechaInicioRealCorrecta.getFullYear();
   let monthInicioReal = fechaInicioRealCorrecta.getMonth() + 1;
   let dayInicioReal  = fechaInicioRealCorrecta.getDate();
   let hourInicioReal = fechaInicioRealCorrecta.getHours();
   let minuteInicioReal = fechaInicioRealCorrecta.getMinutes();
   monthInicioReal = (monthInicioReal < 10 ? "0" : "") + monthInicioReal;
   dayInicioReal = (dayInicioReal < 10 ? "0" : "") + dayInicioReal;
   hourInicioReal = (hourInicioReal < 10 ? "0" : "") + hourInicioReal;
   minuteInicioReal = (minuteInicioReal < 10 ? "0" : "") + minuteInicioReal;
   const fechaInicioRealFormateada = `${dayInicioReal}/${monthInicioReal}/${yearInicioReal} ${hourInicioReal}:${minuteInicioReal}`;
   connection.query('UPDATE orden_trabajo SET ? WHERE id_orden_trabajo = ?', [{estado: "En proceso",fecha_inicio_real:fechaInicioRealFormateada},id],(error,results)=>{
      if(error){
         console.log(error);
      }else{
         res.redirect('/orden-de-trabajo/pendiente');
      }
   })
};

const cambiarEstadoEnProcesoTerminada = (req, res)=>{
   //Sacando los datos del formulario.
   const id = req.body.id;
   const tipo = req.body.tipo; 
   const descripcionSolucion= req.body.descripcionSolucion;
   const fechaInicio = req.body.fechaI;
   const lapsoHorasMilisegundos = req.body.horas  * 3600000;//Se pasa la cantidad de horas a milisegundos para luego sumarlo a la fecha
   const fechaInicioReal = req.body.inicioReal;
   
   //Formateando la fecha de fin del tipo Date al formato con el que la guardo en la base de datos (dd/mm/aaaa)
   const fechaFin = new Date(); //Este formato tira tres horas adelantado por la zona horaria(acá en visual. En la consola tira bien).
   const fechaFinMilisegundos = fechaFin.getTime();
   const fechaFinCorrecta = new Date(fechaFinMilisegundos); //Por alguna razon luego utilizando los get se corrige el error de las tres horas
   //Acá fechaFinCorrecta es lo mismo que fechaFin nada más que antes usaba un lapso de corrección que no era necesario y como lo utilicé luego lo dejé
   let yearFin = fechaFinCorrecta.getFullYear();
   let monthFin = fechaFinCorrecta.getMonth() + 1;
   let dayFin  = fechaFinCorrecta.getDate();
   let hourFin = fechaFinCorrecta.getHours();
   let minuteFin = fechaFinCorrecta.getMinutes();
   monthFin = (monthFin < 10 ? "0" : "") + monthFin;
   dayFin = (dayFin < 10 ? "0" : "") + dayFin;
   hourFin = (hourFin < 10 ? "0" : "") + hourFin;
   minuteFin = (minuteFin < 10 ? "0" : "") + minuteFin;
   const fechaFinFormateada = `${dayFin}/${monthFin}/${yearFin} ${hourFin}:${minuteFin}`;

   //Tiempo total de duración de la O.T = (fechaFinMilisegundos) - (fechaInicioRealMilisegundos)
   //Sacando los milisegundos de la fecha de inicio real.
   const diaInicioR=  fechaInicioReal.split("/")[0];
   const mesInicioR=  fechaInicioReal.split("/")[1]-1;
   const anioInicioR=  fechaInicioReal.split("/")[2].split(" ")[0];
   const horaInicioR=  fechaInicioReal.split("/")[2].split(" ")[1].split(":")[0];
   const minInicioR=  fechaInicioReal.split("/")[2].split(" ")[1].split(":")[1];
   const fechaInicioRealFormatoDate = new Date(anioInicioR,mesInicioR,diaInicioR,horaInicioR,minInicioR);
   const milisegundosFechaInicioReal = fechaInicioRealFormatoDate.getTime();
   
   const duracionOT = (fechaFinMilisegundos - milisegundosFechaInicioReal)/3600000; //Duración en horas que tardó la orden de trabajo
   

   if(tipo == "Correctiva"){
      connection.query('UPDATE orden_trabajo SET ? WHERE id_orden_trabajo = ?', [{estado: "Finalizada", descripcion_solucion: descripcionSolucion, fecha_fin: fechaFinFormateada,horas_totales:duracionOT},id],(error,results)=>{
         if(error){
            console.log(error);
         }else{
            res.redirect('/orden-de-trabajo/en-proceso');
         }
      })
   }else{
      const nuevaFechaInicio = new Date(fechaFinMilisegundos +  lapsoHorasMilisegundos); //Fecha de inicio nueva = fecha en la que termina mas la cantidad de horas(en milisegundos) en la que se repite la O.T programada
      let nuevaFechaInicioyear = nuevaFechaInicio.getFullYear();
      let nuevaFechaIniciomonth = nuevaFechaInicio.getMonth() + 1;
      let nuevaFechaInicioday  = nuevaFechaInicio.getDate();
      let nuevaFechaIniciohour = nuevaFechaInicio.getHours();
      let nuevaFechaIniciominute = nuevaFechaInicio.getMinutes();
      nuevaFechaIniciomonth = (nuevaFechaIniciomonth < 10 ? "0" : "") + nuevaFechaIniciomonth;
      nuevaFechaInicioday = (nuevaFechaInicioday < 10 ? "0" : "") + nuevaFechaInicioday;
      nuevaFechaIniciohour = (nuevaFechaIniciohour < 10 ? "0" : "") + nuevaFechaIniciohour;
      nuevaFechaIniciominute = (nuevaFechaIniciominute < 10 ? "0" : "") + nuevaFechaIniciominute;
      const nuevaFechaFormateada = `${nuevaFechaInicioday}/${nuevaFechaIniciomonth}/${nuevaFechaInicioyear} ${nuevaFechaIniciohour}:${nuevaFechaIniciominute}`;
      //La nueva fecha formateada ya esta en el formato correcto, solamente faltan los siguientes pasos:
      //Insertar en la tabla de ordenes Programadas finalizadas la nueva orden 
      connection.query('INSERT INTO ot_programada_finalizada SET ?', {
         id_orden_programada: id,
         fecha_inicio: fechaInicio,
         fecha_fin: fechaFinFormateada,
         observacion: descripcionSolucion,
         horas_totales:duracionOT,
       }, (error, results) => {
         if (error) {
           console.log(error);
         } else {
           //Actualizar la orden de trabajo para que se resetee con la nueva fecha de inicio y pase a estado pendiente.
            connection.query('UPDATE orden_trabajo SET ? WHERE id_orden_trabajo = ?', [{estado: "Pendiente", fecha_inicio: nuevaFechaFormateada,fecha_inicio_real:fechaInicioReal},id],(error,results)=>{
            if(error){
               console.log(error);
            }else{
               res.redirect('/orden-de-trabajo/en-proceso');
            }
      })
         }
       });

   }
};

const eliminarOrden = (req, res)=>{
   const id = req.body.id;
   connection.query('DELETE FROM orden_trabajo WHERE id_orden_trabajo = ?', [id], (error, results)=>{
       
       if(error){
           throw error;
       }else{
           res.redirect('/orden-de-trabajo/generar-orden');
       }

       });
};


export default {
   save, 
   update,
   cambiarEstadoPendienteEnProceso,
   cambiarEstadoEnProcesoTerminada,
   eliminarOrden,
};