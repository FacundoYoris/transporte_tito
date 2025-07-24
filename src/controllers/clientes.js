import moment from "moment";
import connection from "../database/db.js";
import express from 'express';


// Función para guardar un cliente en la base de datos
const saveClientes = (req, res) => {
    

    const { 
        nomclie, domclie, locclie, telclie, 
        sitclie, cuiclie, maiclie, obsclie 
    } = req.body;

    if (!nomclie || !domclie || !locclie) {
        return res.status(400).json({ success: false, error: "Faltan datos obligatorios." });
    }

    const clienteData = { nomclie, domclie, locclie, telclie, sitclie, cuiclie, maiclie, obsclie };

    connection.query('INSERT INTO clientes SET ?', clienteData, (error, results) => {
        if (error) {
            console.error("Error al guardar el cliente:", error);
            return res.status(500).json({ success: false, error: "Error al guardar el cliente" });
        }

        // Redirigir a la ruta de los depósitos con un parámetro para abrir el modal
        res.redirect(`/depositos?openModal=true`);
    });
};


// Función para guardar un cliente en la base de datos
const saveClientes2 = (req, res) => {
    

    const { 
        nomclie, domclie, locclie, telclie, 
        sitclie, cuiclie, maiclie, obsclie 
    } = req.body;

    if (!nomclie || !domclie || !locclie) {
        return res.status(400).json({ success: false, error: "Faltan datos obligatorios." });
    }

    const clienteData = { nomclie, domclie, locclie, telclie, sitclie, cuiclie, maiclie, obsclie };

    connection.query('INSERT INTO clientes SET ?', clienteData, (error, results) => {
        if (error) {
            console.error("Error al guardar el cliente:", error);
            return res.status(500).json({ success: false, error: "Error al guardar el cliente" });
        }

        // Redirigir a la ruta de los depósitos con un parámetro para abrir el modal
        res.redirect(`/clientes`);
    });
};

const updateCliente = (req, res)=>{
    const id = req.body.id;
    const nombre = req.body.nomclie;
    const domicilio = req.body.domclie; 
    const locclie = req.body.locclie;
    const telclie = req.body.telclie;
    const maiclie = req.body.maiclie;
    const sitclie = req.body.sitclie;
    const cuiclie = req.body.cuiclie;
    const obsclie = req.body.obsclie;
    connection.query('UPDATE clientes SET ? WHERE numclie = ?', [{nomclie: nombre, domclie: domicilio, locclie:locclie, telclie:telclie,maiclie:maiclie,sitclie:sitclie, cuiclie:cuiclie, obsclie:obsclie },id],(error,results)=>{
       if(error){
          console.log(error);
       }else{
          res.redirect('/clientes');
       }
    })
 };


const eliminarCliente = (req, res)=>{
    const id = req.body.id;
    connection.query('DELETE FROM clientes WHERE numclie = ?', [id], (error, results)=>{
        
        if(error){
            throw error;
        }else{
            res.redirect('/clientes');
        }
 
        });
 };
export default {
    saveClientes,
    saveClientes2,
    updateCliente,
    eliminarCliente,
 };