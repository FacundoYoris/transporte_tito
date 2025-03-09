import moment from "moment";
import connection from "../database/db.js";
import express from 'express';

const save = (req, res) => {
    // Obtener el usuario actual desde la sesión
    const userName = req.session.userName;

    if (!userName) {
        return res.status(401).json({ error: "Usuario no autenticado" });
    }

    // Consulta para obtener el iddeposito del usuario actual
    connection.query('SELECT iddeposito FROM usuarios WHERE usuario = ?', [userName], (err, results) => {
        if (err) {
            console.error("Error al obtener el id del depósito:", err);
            return res.status(500).json({ error: "Error al obtener el id del depósito", details: err });
        }

        if (results.length === 0) {
            return res.status(404).json({ error: "Usuario no encontrado" });
        }

        const idDepositoUsuario = results[0].iddeposito; // Obtener el iddeposito del usuario

        // Crear el objeto con los datos de la carga
        const cargaData = {
            unidad: req.body.unidad,
            iddeposito: idDepositoUsuario, // Usar el iddeposito del usuario actual
            cantidad: req.body.cantidad,
            destino: req.body.destino,
            prioridad: 0,
            idcliente: req.body.clienteDestino,
            valordeclarado: req.body.valor,
            idproveedor: req.body.clienteOrigen,
            fecha: req.body.fecha,
        };

        // Insertar la carga en la base de datos
        connection.query('INSERT INTO carga SET ?', cargaData, (error, results) => {
            if (error) {
                console.error("Error al guardar carga:", error);
                return res.status(500).json({ error: "Error al guardar la carga", details: error });
            }
            res.redirect('/depositos');
        });
    });
};

// PROVEEDOR Y NOMBRE EN REALIDAD SON IDPROVEEDOR Y IDCLIENTE
const update = (req, res) => {
    const { id, proveedor, nombre, unidad, cantidad, valor, destino, prioridad, fecha } = req.body;
    
    // Ahora actualizar la tabla cargas con los demás datos
    connection.query(
        "UPDATE carga SET unidad=?, cantidad=?, destino=?, idcliente=?, valordeclarado=?, idproveedor=?, fecha=? WHERE id=?",
        [unidad, cantidad, destino, nombre,  valor, proveedor, fecha, id],
        (error) => {
            if (error) {
                console.log(error);
                res.status(500).send("Error actualizando la carga.");
            } else {
                res.redirect("/depositos"); // Redirigir después de actualizar
            }
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

const updatePrioridad = (req, res) => {
    const { id, prioridad } = req.body;


    connection.query(
        "UPDATE carga SET prioridad = ? WHERE id = ?",
        [prioridad, id],
        (error, results) => {
            if (error) {
                console.error("Error actualizando la prioridad:", error);
                return res.status(500).json({ success: false, message: "Error actualizando la prioridad." });
            }
            res.json({ success: true, prioridad }); // Devuelve un JSON en lugar de redirigir
        }
    );
};

export default {
    save,
    update,
    eliminarCarga,
    updatePrioridad,
};







