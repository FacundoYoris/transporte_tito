import connection from "../database/db.js";
import express from 'express'
const saveActivo = (req, res)=>{
    const activo = req.body.activo;
   //  const planta = req.body.planta; 
    const sector = req.body.sector;
    const estado = req.body.estado;
    const potencia = req.body.potencia;
    const horas_uso = req.body.horas;
    connection.query('INSERT INTO activos SET ?', {nombre: activo, sector: sector, estado:estado, potencia_nominal: potencia, horas_uso: horas_uso},(error,results)=>{
       if(error){
          console.log(error);
       }else{
          res.redirect('/modificar-activos');
       }
    })
 };

 const updateActivo = (req, res)=>{
   const id = req.body.id;
   // const planta = req.body.planta;
   const sector = req.body.sector;
   const nombre = req.body.activo;
   const estado = req.body.estado;
   const potencia = req.body.potencia;
   const horas_uso = req.body.horas;
   connection.query('UPDATE activos SET ? WHERE idactivos = ?', [{ sector: sector, nombre:nombre, estado:estado, potencia_nominal: potencia, horas_uso: horas_uso},id],(error,results)=>{
      if(error){
         console.log(error);
      }else{
         res.redirect('/modificar-activos');
      }
   })
};

 const eliminarActivo = (req, res)=>{
   const id = req.body.id;
   connection.query('DELETE FROM activos WHERE idactivos = ?', [id], (error, results)=>{
       
       if(error){
           throw error;
       }else{
           res.redirect('/modificar-activos');
       }

       });
};
 export default {
    saveActivo,
    eliminarActivo,
    updateActivo,
 };