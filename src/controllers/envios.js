import moment from "moment";
import connection from "../database/db.js";
import generarHojaDeRutaPDF from '../helpers/generarHojaDeRutaPDF.js';

const saveEnvio = (req, res) => {
  const { idCamion, dniChofer, cargas } = req.body;
  const usuario = req.session.userName;

  if (!idCamion || !dniChofer || !Array.isArray(cargas) || cargas.length === 0) {
    return res.status(400).json({ success: false, message: 'Datos incompletos' });
  }

  const queryDeposito = 'SELECT iddeposito FROM usuarios WHERE usuario = ?';
  connection.query(queryDeposito, [usuario], (err, resultadoDeposito) => {
    if (err || resultadoDeposito.length === 0) {
      return res.status(500).json({ success: false, message: 'Error al obtener origen' });
    }

    const idOrigen = resultadoDeposito[0].iddeposito;

    const queryChofer = 'SELECT nrochof FROM conductores WHERE dnichof = ?';
    connection.query(queryChofer, [dniChofer], (err, resultadoChofer) => {
      if (err || resultadoChofer.length === 0) {
        return res.status(500).json({ success: false, message: 'Error al obtener chofer' });
      }

      const nroChofer = resultadoChofer[0].nrochof;

      const insertRuta = `
        INSERT INTO hojaderuta (id_origen, id_destino, idchofer, fecha, idcamion)
        VALUES (?, ?, ?, NOW(), ?)
      `;
      const valoresRuta = [idOrigen, 1, nroChofer, idCamion];

      connection.query(insertRuta, valoresRuta, (err, resultadoInsert) => {
        if (err) {
          return res.status(500).json({ success: false, message: 'Error al guardar hoja de ruta' });
        }

        const idHojaRuta = resultadoInsert.insertId;

        // Insertar cargas en cargaporenvio
        const insertCarga = 'INSERT INTO cargaporenvio (idenvio, idcarga) VALUES ?';
        const values = cargas.map(c => [idHojaRuta, c.id]);

        connection.query(insertCarga, [values], (err) => {
          if (err) {
            return res.status(500).json({ success: false, message: 'Error al asociar cargas' });
          }

          // Actualizar estado de las cargas a "en envío"
          const queryActualizarEstado = 'UPDATE carga SET estado = 1 WHERE id IN (?)';
          const cargaIds = cargas.map(c => c.id);

          connection.query(queryActualizarEstado, [cargaIds], (err2) => {
            if (err2) {
              return res.status(500).json({ success: false, message: 'Error al actualizar cargas' });
            }

            // ✅ Devolvemos JSON, no PDF
            return res.json({ success: true, idHojaRuta });
          });
        });
      });
    });
  });
};




const updateEnvio = (req, res) => {
  const { idHojaRuta, idCamion, dniChofer, cargasOriginales, cargasActuales } = req.body;

  if (!idHojaRuta || !idCamion || !dniChofer) {
    return res.status(400).send("Datos incompletos.");
  }

  const originales = cargasOriginales.map(Number);
  const actuales = cargasActuales.map(Number);

  const quitar = originales.filter(id => !actuales.includes(id));
  const agregar = actuales.filter(id => !originales.includes(id));

  console.log("Originales:", originales);
  console.log("Actuales:", actuales);
  console.log("Quitar:", quitar);
  console.log("Agregar:", agregar);

  // ✅ Buscar nrochof usando dniChofer
  connection.query('SELECT nrochof FROM conductores WHERE dnichof = ?', [dniChofer], (err, resultChofer) => {
    if (err || resultChofer.length === 0) {
      console.error("❌ Error obteniendo chofer:", err);
      return res.status(500).send("Error obteniendo chofer.");
    }

    const nroChofer = resultChofer[0].nrochof;

    // ✅ Actualizar chofer y camión en hojaderuta
    const updateEnvioQuery = 'UPDATE hojaderuta SET idchofer = ?, idcamion = ? WHERE id = ?';
    connection.query(updateEnvioQuery, [nroChofer, idCamion, idHojaRuta], err => {
      if (err) {
        console.error("❌ Error actualizando hoja de ruta:", err);
        return res.status(500).send("Error actualizando hoja de ruta.");
      }

      // ✅ Eliminar cargas quitadas
      if (quitar.length > 0) {
        connection.query('DELETE FROM cargaporenvio WHERE idenvio = ? AND idcarga IN (?)', [idHojaRuta, quitar]);
        connection.query('UPDATE carga SET estado = 0 WHERE id IN (?)', [quitar]);
      }

      // ✅ Agregar nuevas cargas (estadoEntregaAvda = NULL)
      if (agregar.length > 0) {
        const addValues = agregar.map(id => [idHojaRuta, id, null]);
        connection.query('INSERT INTO cargaporenvio (idenvio, idcarga, estadoEntregaAvda) VALUES ?', [addValues]);
        connection.query('UPDATE carga SET estado = 1 WHERE id IN (?)', [agregar]);
      }

      // ✅ Generar PDF actualizado
      generarHojaDeRutaPDF(idHojaRuta, res);
      
    });
  });
};

export default {
  saveEnvio,
  updateEnvio,
};
