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

 const update = (req, res) => {
   const { id, nombre, unidad, cantidad, valor, destino, prioridad } = req.body;
   
   // Buscar el idcliente en la tabla cargas
   connection.query(
       "SELECT idcliente FROM carga WHERE id = ?",
       [id],
       (error, results) => {
           if (error) {
               console.log(error);
               return res.status(500).send("Error buscando el cliente asociado.");
           }

           if (results.length === 0) {
               return res.status(400).send("Carga no encontrada.");
           }

           const idcliente = results[0].idcliente; // Obtener el ID del cliente asociado
           

           // Actualizar el nomclie en la tabla clientes
           connection.query(
               "UPDATE clientes SET nomclie = ? WHERE numclie = ?",
               [nombre, idcliente],
               (error) => {
                   if (error) {
                       console.log(error);
                       return res.status(500).send("Error actualizando el cliente.");
                   }

                   // Ahora actualizar la tabla cargas con los demás datos
                   connection.query(
                       "UPDATE carga SET unidad=?, cantidad=?, valordeclarado=?, destino=?, prioridad=? WHERE id=?",
                       [unidad, cantidad, valor, destino, prioridad, id],
                       (error) => {
                           if (error) {
                               console.log(error);
                               res.status(500).send("Error actualizando la carga.");
                           } else {
                               res.redirect("/depositos"); // Redirigir después de actualizar
                           }
                       }
                   );
               }
           );
       }
   );
};



const eliminarCarga = (req, res) => {
   const id = req.body.id;  // Obtener el ID de la carga desde el cuerpo de la solicitud

   // Ejecutar la consulta SQL para eliminar la carga
   connection.query('DELETE FROM carga WHERE id = ?', [id], (error, results) => {
       if (error) {
           console.log(error);
           return res.status(500).send('Error al eliminar la carga.');
       } else {
           // Redirigir a la página de carga o a cualquier otra página que desees
           res.redirect('/depositos'); // Puedes ajustar esta ruta según tu lógica
       }
   });
};


export default {
   save, 
   update,
   eliminarCarga,
};







