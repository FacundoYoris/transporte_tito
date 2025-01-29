import moment from "moment";
import connection from "../database/db.js";
import express from 'express';

const save = (req, res) => {
const cliente = req.body.cliente;
console.log(cliente);
   return;
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
       res.redirect('#');
     }
   });
 };

const update = (req, res)=>{
//    const id = req.body.id;
//    const tipo = req.body.select;
//    const tarea = req.body.tarea; //Esto es "actividad" en la BDD
//    const activo = req.body.activo;
//    const Responsable = req.body.Responsable;
//    const Prioridad = req.body.Prioridad;
//    const descripcion = req.body.descripcion;
//    const lapso = req.body.lapPeriodica;
//    const estado = req.body.estado;
//    const solucion = req.body.descripcionSolucion;
//    const elemento = req.body.elemento;

   connection.query('UPDATE orden_trabajo SET ? WHERE id_orden_trabajo = ?', [{estado:estado,tipo: tipo, actividad: tarea, fecha_inicio:req.body.fecha, activo:activo, responsable:Responsable,  prioridad:Prioridad, usuario_creador: req.session.userName, descripción_problematica:descripcion,lapsoProgramada:lapso,descripcion_solucion:solucion,elemento:elemento},id],(error,results)=>{
      if(error){
         console.log(error);
      }else{
         res.redirect('#');
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
   eliminarOrden,
};







