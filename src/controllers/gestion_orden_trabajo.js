import connection from "../database/db.js";
import express from 'express'

const save = (req, res)=>{
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
   connection.query('INSERT INTO orden_trabajo SET ?', {tipo: tipo, actividad: tarea, fecha_inicio:fecha, activo:activo, responsable:Responsable, tiempo_esperado:tiempo_esperado, prioridad:Prioridad, descripción_problematica:descripcion},(error,results)=>{
      if(error){
         console.log(error);
      }else{
         res.redirect('/orden-de-trabajo/generar-orden');
      }
   })
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
export default {
   save, 
   update,
};