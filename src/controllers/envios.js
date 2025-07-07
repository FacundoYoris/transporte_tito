import moment from "moment";
import connection from "../database/db.js";
import PDFDocument from 'pdfkit';

const saveEnvio = (req, res) => {
  const { idCamion, dniChofer, cargas } = req.body;
  const usuario = req.session.userName;

  const queryDeposito = 'SELECT iddeposito FROM usuarios WHERE usuario = ?';
  connection.query(queryDeposito, [usuario], (err, resultadoDeposito) => {
    if (err || resultadoDeposito.length === 0) {
      return res.status(500).send('Error al obtener origen');
    }

    const idOrigen = resultadoDeposito[0].iddeposito;

    const queryChofer = 'SELECT nrochof, nomchof FROM conductores WHERE dnichof = ?';
    connection.query(queryChofer, [dniChofer], (err, resultadoChofer) => {
      if (err || resultadoChofer.length === 0) {
        return res.status(500).send('Error al obtener chofer');
      }

      const nroChofer = resultadoChofer[0].nrochof;
      const nombreChofer = resultadoChofer[0].nomchof;

      const insertRuta = `
        INSERT INTO hojaderuta (id_origen, id_destino, idchofer, fecha, idcamion)
        VALUES (?, ?, ?, NOW(), ?)
      `;
      const valoresRuta = [idOrigen, 1, nroChofer, idCamion];

      connection.query(insertRuta, valoresRuta, (err, resultadoInsert) => {
        if (err) return res.status(500).send('Error al guardar hoja de ruta');

        const idHojaRuta = resultadoInsert.insertId;

        if (!Array.isArray(cargas) || cargas.length === 0) {
          return res.status(400).send('No se recibieron cargas.');
        }

        const insertCarga = 'INSERT INTO cargaporenvio (idenvio, idcarga) VALUES (?, ?)';
        let insertados = 0;

        cargas.forEach((carga, index) => {
          const valores = [idHojaRuta, carga.id];
          connection.query(insertCarga, valores, (err) => {
            if (!err) insertados++;
          });
        });

        // Esperar a que terminen las inserciones
        setTimeout(() => {
          if (insertados < cargas.length) {
            return res.status(500).send('No se pudieron asociar todas las cargas.');
          }

          // ✅ Generar el PDF
          const doc = new PDFDocument();

          res.setHeader('Content-disposition', `attachment; filename=hoja_ruta_${idHojaRuta}.pdf`);
          res.setHeader('Content-type', 'application/pdf');
          doc.pipe(res);

          // 👉 NUEVA LÍNEA INICIAL
          doc.fontSize(12).text(`Fecha: ${moment().format('DD/MM/YYYY HH:mm')}     Hoja de ruta: ${idHojaRuta}`);
          doc.moveDown();

          doc.fontSize(16).text('HOJA DE RUTA', { align: 'center' });
          doc.moveDown();
          doc.fontSize(12).text(`ID: ${idHojaRuta}`);
          doc.text(`Fecha: ${moment().format('DD/MM/YYYY HH:mm')}`);
          doc.text(`Camión: ${idCamion}`);
          doc.text(`Chofer: ${nombreChofer} (DNI ${dniChofer})`);
          doc.text(`Origen: ${idOrigen}`);
          doc.moveDown().text('Cargas asociadas:', { underline: true });

          cargas.forEach((carga, index) => {
            doc.moveDown(0.5);
            doc.text(`${index + 1}. Cliente: ${carga.cliente} | Proveedor: ${carga.proveedor}`);
            doc.text(`   Localidad: ${carga.localidad} | Cantidad: ${carga.cantidad} ${carga.unidad} | Remito: ${carga.remito}`);
            doc.text(`   Valor declarado: $${carga.valor}`);
          });

          doc.end();

        }, 500);
      });
    });
  });
};

export default {
  saveEnvio
};
