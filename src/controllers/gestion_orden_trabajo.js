import moment from "moment";
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
   
   connection.query('INSERT INTO orden_trabajo SET ?', {
     tipo: tipo,
     actividad: tarea,
     fecha_inicio: fecha,
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
   //ACá cambié fechaFormateada por req.body.fecha
   connection.query('UPDATE orden_trabajo SET ? WHERE id_orden_trabajo = ?', [{estado:estado,tipo: tipo, actividad: tarea, fecha_inicio:req.body.fecha, activo:activo, responsable:Responsable,  prioridad:Prioridad, usuario_creador: req.session.userName, descripción_problematica:descripcion,lapsoProgramada:lapso,descripcion_solucion:solucion,elemento:elemento},id],(error,results)=>{
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
   var fechaMoment = moment(fechaInicioReal,'YYYY-MM-DD HH:mm:ss.SSS').format('YYYY-MM-DDTHH:mm');
   console.log(fechaMoment);
   connection.query('UPDATE orden_trabajo SET ? WHERE id_orden_trabajo = ?', [{estado: "En proceso",fecha_inicio_real:fechaMoment},id],(error,results)=>{
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
   const fechaInicio = req.body.fechaI; //Tipo varchar
   const lapsoHorasMilisegundos = req.body.horas  * 3600000;//Se pasa la cantidad de horas a milisegundos para luego sumarlo a la fecha
   const fechaInicioReal = req.body.inicioReal;//Tipo varchar formato aaaa/mm/ddThh:mm
 
   //Formateando la fecha de fin del tipo Date al formato con el que la guardo en la base de datos (dd/mm/aaaa)
   const fechaFin = new Date(); //Este formato tira tres horas adelantado por la zona horaria(acá en visual. En la consola tira bien).
   const fechaFinMilisegundos = fechaFin.getTime();
   var fechaMomentFin = moment(fechaFin,'YYYY-MM-DD HH:mm:ss.SSS').format('YYYY-MM-DDTHH:mm');

   // Extraer partes de la cadena porque es de tipo varchar en la base de datos
      var year = fechaInicioReal.substring(0, 4);
      var month = fechaInicioReal.substring(5, 7) - 1; // Restar 1 ya que los meses van de 0 a 11
      var day = fechaInicioReal.substring(8, 10);
      var hour = fechaInicioReal.substring(11, 13);
      var minute = fechaInicioReal.substring(14, 16);
// Crear un objeto Date
      var fechaInicioRealTipoDate = new Date(year, month, day, hour, minute);//La paso a formato date
      const milisegundosFechaInicioReal = fechaInicioRealTipoDate.getTime();
   
   const duracionOT = (fechaFinMilisegundos - milisegundosFechaInicioReal)/3600000; //Duración en horas que tardó la orden de trabajo

   if(tipo == "Correctiva"){
      connection.query('UPDATE orden_trabajo SET ? WHERE id_orden_trabajo = ?', [{estado: "Finalizada", descripcion_solucion: descripcionSolucion, fecha_fin: fechaMomentFin,horas_totales:duracionOT},id],(error,results)=>{
         if(error){
            console.log(error);
         }else{
            res.redirect('/orden-de-trabajo/en-proceso');
         }
      })
   }else{
      const nuevaFechaInicio = new Date(fechaFinMilisegundos +  lapsoHorasMilisegundos); //Fecha de inicio nueva = fecha en la que termina mas la cantidad de horas(en milisegundos) en la que se repite la O.T programada
      let fechaMomentInicio = moment(nuevaFechaInicio, "ddd MMM DD YYYY HH:mm:ss [GMT]Z (Z)").format("YYYY-MM-DDTHH:mm");
   
      //Insertar en la tabla de ordenes Programadas finalizadas la nueva orden 
      connection.query('INSERT INTO ot_programada_finalizada SET ?', {
         id_orden_programada: id,
         fecha_inicio: fechaMomentInicio,
         fecha_inicio_real:fechaInicioReal,
         fecha_fin: fechaMomentFin,
         observacion: descripcionSolucion,
         horas_totales:duracionOT,
       }, (error, results) => {
         if (error) {
           console.log(error);
         } else {
           //Actualizar la orden de trabajo para que se resetee con la nueva fecha de inicio y pase a estado pendiente.
           //ACÄ CAMBIO NUEVAFECHAINICIO FORMATEADA POR NUEVA FECHA INICIO
            connection.query('UPDATE orden_trabajo SET ? WHERE id_orden_trabajo = ?', [{estado: "Pendiente", fecha_inicio: fechaMomentInicio},id],(error,results)=>{
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









// //formatear fecha 
   // const dateDB = new Date(req.body.fecha);//Toma la fecha que viene del formulario
   // let year = dateDB.getFullYear();//filtra el año
   // let month = dateDB.getMonth() + 1;//filtra el mes (tira siempre un mes menos, empieza desde el cero)
   // let day  = dateDB.getDate(); // filtra el dia
   // let hour = dateDB.getHours(); //filtra la hora
   // let minute = dateDB.getMinutes(); //filtra los minutos
   // month = (month < 10 ? "0" : "") + month; //Le da formato "0X si es menor a 10"
   // day = (day < 10 ? "0" : "") + day; 
   // hour = (hour < 10 ? "0" : "") + hour;
   // minute = (minute < 10 ? "0" : "") + minute;
   // const fechaFormateada = `${day}/${month}/${year} ${hour}:${minute}`;