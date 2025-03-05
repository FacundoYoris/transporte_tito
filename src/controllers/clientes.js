import moment from "moment";
import connection from "../database/db.js";
import express from 'express';


// Función para guardar un cliente en la base de datos
const saveClientes = (req, res) => {
    const { 
        nomclie, domclie, locclie, telclie, 
        sitclie, cuiclie, maiclie, obsclie 
    } = req.body;

    if (!nomclie || !domclie || !locclie || !telclie || !sitclie || !cuiclie || !maiclie) {
        return res.status(400).json({ success: false, error: "Faltan datos obligatorios." });
    }

    const clienteData = { nomclie, domclie, locclie, telclie, sitclie, cuiclie, maiclie, obsclie };

    connection.query('INSERT INTO clientes SET ?', clienteData, (error, results) => {
        if (error) {
            console.error("Error al guardar el cliente:", error);
            return res.status(500).json({ success: false, error: "Error al guardar el cliente" });
        }

        res.json({
            success: true,
            numclie: results.insertId, 
            nomclie
        });
    });
};

export default {
    saveClientes, 
 };