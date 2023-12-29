import connection from "../database/db.js";
import express from 'express'
const saveItem = (req, res)=>{
    const item = req.body.item;
    const cantidad = req.body.cantidad; //Esto es "actividad" en la BDD
    const CantidadAdvertencia = req.body.CantidadAdvertencia;
    const CantidadCritica = req.body.CantidadCritica;
    connection.query('INSERT INTO stock SET ?', {item: item, cantidad: cantidad, CantidadAdvertencia:CantidadAdvertencia, CantidadCritica:CantidadCritica},(error,results)=>{
       if(error){
          console.log(error);
       }else{
          res.redirect('/modificar-stock');
       }
    })
 };
 const updateStock = (req, res)=>{
    const id = req.body.id;
    const item = req.body.item;
    const cantidad = req.body.cantidad; //Esto es "actividad" en la BDD
    const CantidadAdvertencia = req.body.CantidadAdvertencia;
    const CantidadCritica = req.body.CantidadCritica;
    connection.query('UPDATE stock SET ? WHERE idstock = ?', [{item: item, cantidad: cantidad, CantidadAdvertencia:CantidadAdvertencia, CantidadCritica:CantidadCritica},id],(error,results)=>{
       if(error){
          console.log(error);
       }else{
          res.redirect('/modificar-stock');
       }
    })
 };

 const eliminarItem = (req, res)=>{
   const id = req.body.id;
   connection.query('DELETE FROM stock WHERE idstock = ?', [id], (error, results)=>{
       
       if(error){
           throw error;
       }else{
           res.redirect('/modificar-stock');
       }

       });
};



 export default {
    saveItem, 
    updateStock,
    eliminarItem,
 };