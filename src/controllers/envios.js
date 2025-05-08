import moment from "moment";
import connection from "../database/db.js";
import express from 'express';

const saveEnvio = (req, res) => {
  const { idCamion, dniChofer, cargas } = req.body;
  const usuario = req.session.userName;

  // 1. Obtener iddeposito (idorigen) desde el usuario logueado
  const queryDeposito = 'SELECT iddeposito FROM usuarios WHERE usuario = ?';
  connection.query(queryDeposito, [usuario], (err, resultadoDeposito) => {
    if (err) {
      console.error('Error al obtener iddeposito:', err);
      return res.status(500).json({ success: false, message: 'Error al obtener origen' });
    }

    if (resultadoDeposito.length === 0) {
      return res.status(404).json({ success: false, message: 'Usuario no encontrado' });
    }

    const idOrigen = resultadoDeposito[0].iddeposito;

    // 2. Obtener nrochof desde el dniChofer
    const queryChofer = 'SELECT nrochof FROM conductores WHERE dnichof = ?';
    connection.query(queryChofer, [dniChofer], (err, resultadoChofer) => {
      if (err) {
        console.error('Error al obtener nrochof:', err);
        return res.status(500).json({ success: false, message: 'Error al obtener chofer' });
      }

      if (resultadoChofer.length === 0) {
        return res.status(404).json({ success: false, message: 'Chofer no encontrado' });
      }

      const nroChofer = resultadoChofer[0].nrochof;

      // 3. Insertar en hojaderuta
      const insertRuta = `
        INSERT INTO hojaderuta (id_origen, id_destino, idchofer, fecha, idcamion)
        VALUES (?, ?, ?, NOW(), ?)
      `;
      const valoresRuta = [idOrigen, 1, nroChofer, idCamion];

      connection.query(insertRuta, valoresRuta, (err, resultadoInsert) => {
        if (err) {
          console.error('Error al insertar hoja de ruta:', err);
          return res.status(500).json({ success: false, message: 'Error al guardar hoja de ruta' });
        }

        const idHojaRuta = resultadoInsert.insertId;
        console.log('Hoja de ruta creada con ID:', idHojaRuta);

        // Insertar las cargas asociadas a este envío
if (!Array.isArray(cargas) || cargas.length === 0) {
  return res.status(400).json({ success: false, message: 'No se recibieron cargas para asociar.' });
}

const insertCarga = 'INSERT INTO cargaporenvio (idenvio, idcarga) VALUES (?, ?)';

let errores = 0;

cargas.forEach(carga => {
  const valores = [idHojaRuta, carga.id];

  connection.query(insertCarga, valores, (err) => {
    if (err) {
      console.error('Error al insertar carga en cargaporenvio:', err);
      errores++;
    }
  });
});

// Esperar un poco para asegurar que se ejecutaron los INSERTs antes de responder
setTimeout(() => {
  if (errores > 0) {
    return res.status(500).json({ success: false, message: 'Algunas cargas no se insertaron correctamente.' });
 }
  res.json({ success: true, idHojaRuta });
}, 500); // 0.5 segundos
      });
    });
  });
};




export default {
    saveEnvio,
};