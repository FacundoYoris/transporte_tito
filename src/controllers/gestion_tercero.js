import connection from "../database/db.js";
import express from 'express'
const saveTercero = (req, res)=>{
    const nombre = req.body.nombre;
    const apellido = req.body.apellido;
    const rol = req.body.rol;
    const telefono = req.body.telefono;
    const email = req.body.email;
    const nota = req.body.nota;
    connection.query('INSERT INTO terceros SET ?', {nombre: nombre, apellido: apellido, rol:rol, numero_telefonico:telefono,correo_electronico:email,descripcion:nota},(error,results)=>{
       if(error){
          console.log(error);
       }else{
          res.redirect('/terceros');
       }
    })
 };

 const updateTercero = (req, res)=>{
   const id = req.body.id;
   const nombre = req.body.nombre;
   const apellido = req.body.apellido; 
   const rol = req.body.rol;
   const telefono = req.body.telefono;
   const email = req.body.email;
   const nota = req.body.nota;
   connection.query('UPDATE terceros SET ? WHERE idterceros = ?', [{nombre: nombre, apellido: apellido, rol:rol, numero_telefonico:telefono,correo_electronico:email,descripcion:nota},id],(error,results)=>{
      if(error){
         console.log(error);
      }else{
         res.redirect('/terceros');
      }
   })
};

const eliminarTercero = (req, res)=>{
  const id = req.body.id;
  connection.query('DELETE FROM terceros WHERE idterceros = ?', [id], (error, results)=>{
      
      if(error){
          throw error;
      }else{
          res.redirect('/terceros');
      }

      });
};

 export default{
    saveTercero,
    updateTercero,
    eliminarTercero,
 }