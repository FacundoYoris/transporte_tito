import PDFDocument from 'pdfkit';
import connection from '../database/db.js';
import moment from 'moment';

export default function generarHojaDeRutaPDF(idHojaRuta, res) {
  const queryEnvio = `
    SELECT e.id, e.fecha, c.nomchof, c.dnichof, m.desmovil, m.patmovil, m.pacmovil
    FROM hojaderuta e
    LEFT JOIN conductores c ON e.idchofer = c.nrochof
    LEFT JOIN moviles m ON e.idcamion = m.nummovil
    WHERE e.id = ?
  `;

  connection.query(queryEnvio, [idHojaRuta], (err, envioResult) => {
    if (err || envioResult.length === 0) {
      return res.status(500).send("Error obteniendo datos del envío.");
    }

    const envio = envioResult[0];
    const fecha = moment(envio.fecha).format('DD/MM/YYYY HH:mm');

    const queryCargas = `
      SELECT carga.id, cli.nomclie AS cliente, prov.nomclie AS proveedor, cli.locclie AS localidad,
             carga.cantidad, carga.unidad, carga.valordeclarado, cargaporenvio.estadoEntregaAvda
      FROM cargaporenvio
      LEFT JOIN carga ON cargaporenvio.idcarga = carga.id
      LEFT JOIN clientes cli ON carga.idcliente = cli.numclie
      LEFT JOIN clientes prov ON carga.idproveedor = prov.numclie
      WHERE cargaporenvio.idenvio = ?
        AND (cargaporenvio.estadoEntregaAvda IS NULL OR cargaporenvio.estadoEntregaAvda = 1)
    `;

    connection.query(queryCargas, [idHojaRuta], (err, cargas) => {
      if (err) return res.status(500).send("Error obteniendo cargas.");

      // Calcular total solo con cargas aceptadas o pendientes
      const totalValor = cargas.reduce((acc, c) => acc + Number(c.valordeclarado || 0), 0);

      const doc = new PDFDocument({ size: 'A4', layout: 'landscape', margin: 40 });

      // Nombre de archivo más descriptivo
      const fechaNombre = moment(envio.fecha).format('DD-MM-YYYY_HHmm');
      const fileName = `Hoja de ruta ${idHojaRuta} - ${fechaNombre}.pdf`;

      res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
      res.setHeader('Content-Type', 'application/pdf');
      doc.pipe(res);

      // === ENCABEZADO ===
      doc.font('Times-Bold').fontSize(12).fillColor('black');
      doc.text(`Fecha: ${fecha}`, 40, 40, { continued: true });
      doc.text(`Hoja de ruta: ${idHojaRuta}`, { align: 'right' });

      // Línea separadora
      doc.moveDown(0.3);
      doc.moveTo(40, doc.y).lineTo(800, doc.y).lineWidth(2).strokeColor('black').stroke();

      doc.moveDown(1.5);

      // === SECCIÓN CAMIÓN ===
      doc.font('Times-Roman').fontSize(11).fillColor('#444');
      doc.text(`Camión: `, 40, doc.y, { continued: true })
         .font('Times-Bold').fillColor('black').text(envio.desmovil, { continued: true })
         .font('Times-Roman').fillColor('#444').text(`   Patente Camión: `, { continued: true })
         .font('Times-Bold').fillColor('black').text(envio.patmovil, { continued: true })
         .font('Times-Roman').fillColor('#444').text(`   Patente Acoplado: `, { continued: true })
         .font('Times-Bold').fillColor('black').text(envio.pacmovil);

      doc.moveDown(1);

      // === SECCIÓN CHOFER ===
      doc.font('Times-Roman').fillColor('#444').text(`Chofer: `, 40, doc.y, { continued: true })
         .font('Times-Bold').fillColor('black').text(envio.nomchof, { continued: true })
         .font('Times-Roman').fillColor('#444').text(`   DNI: `, { continued: true })
         .font('Times-Bold').fillColor('black').text(envio.dnichof);

      doc.moveDown(1.5);

      // === TOTAL ===
      doc.font('Times-Bold').fontSize(12).fillColor('black')
         .text(`TOTAL: $${totalValor.toLocaleString('es-AR')}`, 40);
      doc.moveDown(1.5);

      // === TABLA ===
      const startY = doc.y;
      const colX = [40, 80, 180, 320, 500, 640, 740];

      // Encabezados
      doc.rect(40, startY, 760, 20).fill('#e6e6e6');
      doc.fillColor('black').font('Times-Bold').fontSize(10);
      doc.text('N°', colX[0], startY + 5);
      doc.text('Fecha', colX[1], startY + 5);
      doc.text('Cliente', colX[2], startY + 5);
      doc.text('Proveedor', colX[3], startY + 5);
      doc.text('Localidad', colX[4], startY + 5);
      doc.text('Cantidad', colX[5], startY + 5);
      doc.text('Valor', colX[6], startY + 5);

      let currentY = startY + 25;
      doc.font('Times-Roman').fillColor('black');

      cargas.forEach((carga, index) => {
        if (currentY > 550) {
          doc.addPage({ size: 'A4', layout: 'landscape' });
          currentY = 40;
        }

        doc.text(index + 1, colX[0], currentY);
        doc.text(moment(envio.fecha).format('DD/MM/YYYY'), colX[1], currentY);
        doc.text(carga.cliente, colX[2], currentY, { width: 120 });
        doc.text(carga.proveedor, colX[3], currentY, { width: 160 });
        doc.text(carga.localidad, colX[4], currentY);
        doc.text(`${carga.cantidad} ${carga.unidad}`, colX[5], currentY);
        doc.text(`$${Number(carga.valordeclarado).toLocaleString('es-AR')}`, colX[6], currentY);
        currentY += 20;
      });

      doc.end();
    });
  });
}
