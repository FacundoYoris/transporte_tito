import moment from "moment";
import connection from "../database/db.js";
import express from 'express';

const saveEnvio = (req, res) => {
    console.log(req.body); // Mostrará en la consola todos los datos enviados desde el frontend
    // Aquí puedes realizar la lógica que necesites, por ejemplo guardar en la base de datos
    res.json({ success: true }); // Envía alguna respuesta al cliente
  };



export default {
    saveEnvio,
};