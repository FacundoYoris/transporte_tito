import connection from "../database/db.js";
import express from 'express'

const save = (req, res) => {
   const tipo = req.body.tipo;
   const tarea = req.body.tarea; //Esto es "actividad" en la BDD
   const fecha = req.body.fecha;
   const activo = req.body.activo;
   const Responsable = req.body.Responsable;
   const tiempo_esperado = req.body.tiempo_esperado;
   const Prioridad = req.body.Prioridad;
   //ACÁ FALTA SACAR EL USUARIO LOGUEADO EN EL MOMENTO
   const descripcion = req.body.descripcion;
   const lapso = req.body.lapso;
   
   //formatear fecha 
   const dateDB = new Date(req.body.fecha);
   let year = dateDB.getFullYear();
   let month = dateDB.getMonth() + 1;
   let day  = dateDB.getDate();
   let hour = dateDB.getHours();
   let minute = dateDB.getMinutes();
   month = (month < 10 ? "0" : "") + month;
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
     tiempo_esperado: tiempo_esperado,
     prioridad: Prioridad,
     descripción_problematica: descripcion,
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
   const tipo = req.body.tipo;
   const tarea = req.body.tarea; //Esto es "actividad" en la BDD
   const fecha = req.body.fecha;
   const activo = req.body.activo;
   const Responsable = req.body.Responsable;
   const tiempo_esperado = req.body.tiempo_esperado;
   const Prioridad = req.body.Prioridad;
   //ACÁ FALTA SACAR EL USUARIO LOGUEADO EN EL MOMENTO 
   const descripcion = req.body.descripcion;
   const lapso = req.body.lapso;
   connection.query('UPDATE orden_trabajo SET ? WHERE id_orden_trabajo = ?', [{tipo: tipo, actividad: tarea, fecha_inicio:fecha, activo:activo, responsable:Responsable, tiempo_esperado:tiempo_esperado, prioridad:Prioridad, descripción_problematica:descripcion},id],(error,results)=>{
      if(error){
         console.log(error);
      }else{
         res.redirect('/orden-de-trabajo/generar-orden');
      }
   })
};
const cambiarEstadoPendienteEnProceso = (req, res)=>{
   const id = req.body.id;
   connection.query('UPDATE orden_trabajo SET ? WHERE id_orden_trabajo = ?', [{estado: "En proceso"},id],(error,results)=>{
      if(error){
         console.log(error);
      }else{
         res.redirect('/orden-de-trabajo/pendiente');
      }
   })
};
const cambiarEstadoEnProcesoTerminada = (req, res)=>{
   const id = req.body.id;
   const descripcionSolucion= req.body.descripcionSolucion;
   connection.query('UPDATE orden_trabajo SET ? WHERE id_orden_trabajo = ?', [{estado: "Finalizada", descripcion_solucion: descripcionSolucion},id],(error,results)=>{
      if(error){
         console.log(error);
      }else{
         res.redirect('/orden-de-trabajo/en-proceso');
      }
   })
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