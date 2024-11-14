import connection from "../database/db.js";
import express from 'express';

const saveSolicitud = (req, res) => {
    const usuario = req.session.userName;
    const descripcion = req.body.descripcion; 
    const activo = req.body.activo;
    const Prioridad = req.body.Prioridad;

    connection.query('INSERT INTO solicitud_ot SET ?', {
        activo: activo,
        prioridad: Prioridad,
        usuario_generador: usuario,
        problema: descripcion,
    }, (error, results) => {
        if (error) {
            console.log(error);
        } else {
            res.redirect('/solicitar-tarea');
        }
    });
};


export default {
    saveSolicitud,
};