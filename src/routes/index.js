

// La variable "login" = req.session.loggedImAdmin hace referencia a si el usuario tiene privilegio de administrador
// La variable "operario" = req.session.loggedImOperario hace referencia a si el usuario tiene privilegio de operario
// La variable "usuarioExterno" = req.session.loggedImExterno hace referencia a si el usuario tiene privilegio de usuario externo
import { Router } from 'express'
import connection from '../database/db.js'
import generarHojaDeRutaPDF from '../helpers/generarHojaDeRutaPDF.js';
const router = Router()


//Desde la raíz se va hacia el formulario para completar el login
router.get('/', (req, res) => res.render('inicio_sesion.ejs'))
//Se importa el archivo login.js de controllers para verificar en su función login si el usuario tiene un usuario y contraseña válido
import login from '../controllers/login.js'
router.post('/login', login.login);
//Se ejecuta en login.js la función logout, la cual cierra la sesión actual
router.get('/cerrarSesion', login.logout);

// Ruta para obtener todos los depósitos (sin cargas)
router.get('/depositos', (req, res) => {
  const queryUsuarioDeposito = `
        SELECT u.iddeposito, d.nombre AS nombreDeposito
        FROM usuarios u
        LEFT JOIN depositos d ON u.iddeposito = d.id
        WHERE u.usuario = ?
    `;

  connection.query(queryUsuarioDeposito, [req.session.userName], (error, result) => {
    if (error) {
      throw error;
    }

    const userDeposito = result.length > 0 ? result[0] : { iddeposito: null, nombreDeposito: "Sin depósito asignado" };

    const queryDepositos = 'SELECT id, nombre FROM depositos';
    const queryClientes = 'SELECT numclie,nomclie FROM clientes';

    connection.query(queryDepositos, (error, depositos) => {
      if (error) {
        throw error;
      }

      connection.query(queryClientes, (error, clientes) => {
        if (error) {
          throw error;
        }

        res.render('depositos.ejs', {
          depositos,
          clientes,
          gestor: req.session.gestor,
          deposito: req.session.deposito,
          administracion: req.session.administracion,
          idDeposito: userDeposito.iddeposito,
          nombreDeposito: userDeposito.nombreDeposito
        });
      });
    });
  });
});

// Ruta API para obtener las cargas según el depósito seleccionado
router.get('/api/cargas', (req, res) => {
  const depositoId = req.query.depositoId;

  const query = `
        SELECT 
            carga.id, 
            carga.unidad, 
            carga.idproveedor,
            proveedor.nomclie AS nomprov,
            carga.iddeposito, 
            carga.cantidad, 
            carga.prioridad, 
            carga.idcliente, 
            carga.remito,
            cliente.nomclie AS nomclie,
            cliente.locclie AS loccliente,
            cliente.domclie AS domcliente,
            carga.valordeclarado,
            carga.fecha,
            carga.observacion
        FROM carga 
        LEFT JOIN clientes AS cliente ON carga.idcliente = cliente.numclie
        LEFT JOIN clientes AS proveedor ON carga.idproveedor = proveedor.numclie
        WHERE carga.iddeposito = ?
          AND carga.estado = 0   -- ✅ Mostrar solo las que están en el depósito
    `;

  connection.query(query, [depositoId], (error, results) => {
    if (error) {
      return res.status(500).json({ error: 'Error en la consulta' });
    }
    res.json(results);
  });
});

// Ruta para recibir una carga y actualizar su estado
router.post('/api/carga/recibir', (req, res) => {
  const { idCarga, destinoId, recibido } = req.body;

  // Paso 1: Actualizar la tabla carga
  const queryCarga = `
    UPDATE carga
    SET estado = 0 ${recibido ? ', iddeposito = ?' : ''}
    WHERE id = ?
  `;
  const paramsCarga = recibido ? [destinoId, idCarga] : [idCarga];

  connection.query(queryCarga, paramsCarga, (error) => {
    if (error) {
      console.error('❌ Error actualizando carga:', error);
      return res.status(500).json({ success: false, message: 'Error actualizando carga' });
    }

    // Paso 2: Actualizar estadoEntregaAvda en cargaporenvio
    let estadoEntregaAvda = null;

    if (recibido) {
      estadoEntregaAvda = destinoId == 1 ? 1 : null; // 1 = Avellaneda, si es otro no se marca como entrega final
    } else {
      estadoEntregaAvda = 0; // no llegó
    }

    const queryEstadoEntrega = `
      UPDATE cargaporenvio
      SET estadoEntregaAvda = ?
      WHERE idcarga = ?
    `;

    connection.query(queryEstadoEntrega, [estadoEntregaAvda, idCarga], (err2) => {
      if (err2) {
        console.error('⚠️ Error actualizando estadoEntregaAvda:', err2);
        return res.status(500).json({ success: false, message: 'Error al marcar estadoEntregaAvda' });
      }

      return res.json({ success: true });
    });
  });
});


// Ruta para obtener el destino del cliente para autocompletar en el formulario de carga
router.get('/api/destinoCliente/:id', (req, res) => {
  const idCliente = req.params.id;

  const query = 'SELECT locclie FROM clientes WHERE numclie = ? LIMIT 1';
  connection.query(query, [idCliente], (err, results) => {
    if (err) {
      console.error('Error al consultar la base de datos:', err);
      return res.status(500).json({ error: 'Error de base de datos' });
    }
    if (results.length === 0) {
      return res.status(404).json({ error: 'Cliente no encontrado' });
    }
    res.json(results[0]); // { locclie: '...' }
  });
});

router.get('/envios', (req, res) => {
  const userName = req.session.userName;

  if (!userName) {
    return res.status(401).send("Usuario no autenticado.");
  }

  const userQuery = `SELECT iddeposito FROM usuarios WHERE usuario = ?`;

  connection.query(userQuery, [userName], (error, userResults) => {
    if (error) return res.status(500).send("Error al obtener el iddeposito del usuario.");
    if (userResults.length === 0) return res.status(404).send("Usuario no encontrado.");

    const idDepositoUsuario = userResults[0].iddeposito;
    let enviosQuery;
    let queryParams = [];

    const baseQuery = `
      SELECT 
        e.id,
        e.finalizada,  -- ✅ Agregamos este campo
        e.id_origen, 
        d_origen.nombre AS nombre_origen,
        e.id_destino, 
        d_destino.nombre AS nombre_destino,
        e.idchofer, 
        e.idcamion, 
        e.fecha,
        conductores.*,
        moviles.*
      FROM hojaderuta e
      LEFT JOIN depositos d_origen ON e.id_origen = d_origen.id
      LEFT JOIN depositos d_destino ON e.id_destino = d_destino.id
      LEFT JOIN conductores ON conductores.nrochof = e.idchofer
      LEFT JOIN moviles ON moviles.nummovil = e.idcamion
    `;

    if (idDepositoUsuario === 1) {
      enviosQuery = baseQuery;
    } else {
      enviosQuery = baseQuery + ' WHERE e.id_origen = ?';
      queryParams = [idDepositoUsuario];
    }

    connection.query(enviosQuery, queryParams, (error, envios) => {
      if (error) return res.status(500).send("Error al obtener los envíos.");

      const envioIds = envios.map(e => e.id);
      if (envioIds.length === 0) {
        return res.render('envios.ejs', { envios: [] });
      }

      const cargaporenvioQuery = `SELECT * FROM cargaporenvio WHERE idenvio IN (?)`;

      connection.query(cargaporenvioQuery, [envioIds], (error, detalles) => {
        if (error) return res.status(500).send("Error al obtener las cargas por envío.");

        const cargaIds = detalles.map(d => d.idcarga);

        const cargaQuery = `
          SELECT 
            carga.*, 
            cli.nomclie AS nombre_cliente, 
            cli.locclie AS localidad_cliente,
            prov.nomclie AS nombre_proveedor,
            prov.locclie AS localidad_proveedor
          FROM carga
          LEFT JOIN clientes AS cli ON carga.idcliente = cli.numclie
          LEFT JOIN clientes AS prov ON carga.idproveedor = prov.numclie
          WHERE carga.id IN (?)
        `;

        connection.query(cargaQuery, [cargaIds], (error, cargas) => {
          if (error) return res.status(500).send("Error al obtener detalles de la tabla carga.");

          const cargasMap = {};
          cargas.forEach(c => {
            cargasMap[c.id] = c;
          });

          const detallesConCarga = detalles.map(det => ({
            idenvio: det.idenvio,
            idcarga: det.idcarga,
            estadoEntregaAvda: det.estadoEntregaAvda,
            carga: cargasMap[det.idcarga] || null
          }));

          const enviosConTodo = envios.map(envio => {
            const detallesEnvio = detallesConCarga.filter(d => d.idenvio === envio.id);
            const totalValorDeclarado = detallesEnvio.reduce((sum, det) => {
              const valor = Number(det.carga?.valordeclarado || 0);
              return sum + valor;
            }, 0);

            return {
              ...envio,
              detalles: detallesEnvio,
              total_valor: totalValorDeclarado
            };
          });

          res.render('envios.ejs', { envios: enviosConTodo });
        });
      });
    });
  });
});


router.get('/editar-envio/:id', (req, res) => {
  const idEnvio = req.params.id;
  const userName = req.session.userName;

  if (!userName) return res.status(401).send("Usuario no autenticado.");

  const userQuery = `SELECT iddeposito FROM usuarios WHERE usuario = ?`;

  connection.query(userQuery, [userName], (error, userResults) => {
    if (error) return res.status(500).send("Error al obtener el iddeposito del usuario.");
    if (userResults.length === 0) return res.status(404).send("Usuario no encontrado.");

    const idDepositoUsuario = userResults[0].iddeposito;

    const envioQuery = `
      SELECT 
        e.id,
        e.id_origen, 
        d_origen.nombre AS nombre_origen,
        e.id_destino, 
        d_destino.nombre AS nombre_destino,
        e.idchofer, 
        e.idcamion, 
        e.fecha,
        conductores.*,
        moviles.*
      FROM hojaderuta e
      LEFT JOIN depositos d_origen ON e.id_origen = d_origen.id
      LEFT JOIN depositos d_destino ON e.id_destino = d_destino.id
      LEFT JOIN conductores ON conductores.nrochof = e.idchofer
      LEFT JOIN moviles ON moviles.nummovil = e.idcamion
      WHERE e.id = ?
    `;

    connection.query(envioQuery, [idEnvio], (error, envioResults) => {
      if (error) return res.status(500).send("Error al obtener la hoja de ruta.");
      if (envioResults.length === 0) return res.status(404).send("Hoja de ruta no encontrada.");

      const envio = envioResults[0];

      const detallesQuery = `SELECT * FROM cargaporenvio WHERE idenvio = ?`;

      connection.query(detallesQuery, [idEnvio], (error, detalles) => {
        if (error) return res.status(500).send("Error al obtener las cargas asociadas.");

        const cargaIds = detalles.map(d => d.idcarga);

        if (cargaIds.length === 0) {
          return continuarConRender([], envio);
        }

        const cargaQuery = `
          SELECT 
            carga.*, 
            cli.nomclie AS nombre_cliente, 
            cli.locclie AS localidad_cliente,
            prov.nomclie AS nombre_proveedor,
            prov.locclie AS localidad_proveedor
          FROM carga
          LEFT JOIN clientes AS cli ON carga.idcliente = cli.numclie
          LEFT JOIN clientes AS prov ON carga.idproveedor = prov.numclie
          WHERE carga.id IN (?)
        `;

        connection.query(cargaQuery, [cargaIds], (error, cargas) => {
          if (error) return res.status(500).send("Error al obtener datos de las cargas.");

          const cargasMap = {};
          cargas.forEach(c => {
            cargasMap[c.id] = c;
          });

          const detallesConCarga = detalles.map(det => ({
            idenvio: det.idenvio,
            idcarga: det.idcarga,
            estadoEntregaAvda: det.estadoEntregaAvda,
            carga: cargasMap[det.idcarga] || null
          }));

          continuarConRender(detallesConCarga, envio);
        });
      });

      function continuarConRender(detallesConCarga, envioBase) {
        const cargasDisponiblesQuery = `
          SELECT 
            carga.*, 
            cli.nomclie AS nomclie, 
            cli.locclie AS locclie, 
            prov.nomclie AS nomproveedor
          FROM carga
          LEFT JOIN clientes AS cli ON carga.idcliente = cli.numclie
          LEFT JOIN clientes AS prov ON carga.idproveedor = prov.numclie
          WHERE carga.iddeposito = ? AND carga.estado = 0
        `;

        connection.query(cargasDisponiblesQuery, [idDepositoUsuario], (error, cargasDisponibles) => {
          if (error) return res.status(500).send("Error al obtener cargas disponibles.");

          const choferesQuery = `
            SELECT conductores.*, moviles.patmovil AS patente_camion, moviles.pacmovil AS patente_acoplado
            FROM conductores
            JOIN moviles ON conductores.idcamion = moviles.nummovil
          `;

          connection.query(choferesQuery, (error, choferes) => {
            if (error) return res.status(500).send("Error al obtener choferes.");

            res.render('editarenvio', {
              envio: {
                ...envioBase,
                detalles: JSON.stringify(detallesConCarga)
              },
              cargas: cargasDisponibles,
              choferes
            });
          });
        });
      }
    });
  });
});



router.get('/descargar/:id', (req, res) => {
  const idHojaRuta = req.params.id;
  generarHojaDeRutaPDF(idHojaRuta, res);
});

// Cambiar estado de finalización
router.post('/envios/finalizar', (req, res) => {
  const { idEnvio, finalizada } = req.body;

  const query = 'UPDATE hojaderuta SET finalizada = ? WHERE id = ?';
  connection.query(query, [finalizada, idEnvio], (err) => {
    if (err) {
      console.error('❌ Error actualizando estado de finalización:', err);
      return res.status(500).json({ success: false });
    }
    res.json({ success: true });
  });
});





// Ruta para cargar un nuevo envío
router.get('/cargarenvionuevo', (req, res) => {
  const userName = req.session.userName;

  if (!userName) {
    return res.status(401).send("Usuario no autenticado.");
  }

  const userQuery = `SELECT iddeposito FROM usuarios WHERE usuario = ?;`;

  connection.query(userQuery, [userName], (error, userResults) => {
    if (error) {
      console.log(error);
      return res.status(500).send("Error al obtener el iddeposito del usuario.");
    }

    if (userResults.length === 0) {
      return res.status(404).send("Usuario no encontrado.");
    }

    const idDepositoUsuario = userResults[0].iddeposito;
    let enviosQuery, cargaQuery;
    let queryParams = [];


    enviosQuery = `
                SELECT 
                    e.id, 
                    e.id_origen, 
                    d_origen.nombre AS nombre_origen,
                    e.id_destino, 
                    d_destino.nombre AS nombre_destino,
                    e.idchofer, 
                    e.idcamion, 
                    e.fecha, 
                    c.id AS cargaporenvio_id, 
                    c.idenvio, 
                    c.idcarga,
                    ca.idcliente,
                    cl.nomclie, 
                    cl.locclie, 
                    cl.domclie
                FROM hojaderuta e
                LEFT JOIN cargaporenvio c ON e.id = c.idenvio
                LEFT JOIN carga ca ON c.idcarga = ca.id
                LEFT JOIN clientes cl ON ca.idcliente = cl.numclie
                LEFT JOIN depositos d_origen ON e.id_origen = d_origen.id
                LEFT JOIN depositos d_destino ON e.id_destino = d_destino.id
                WHERE e.id_origen = ?;
            `;

    cargaQuery = `
                SELECT 
                    c.*, 
                    cl.nomclie, 
                    cl.locclie, 
                    cl.domclie,
                    prov.nomclie AS nomproveedor
                FROM carga c
                LEFT JOIN clientes cl ON c.idcliente = cl.numclie
                LEFT JOIN clientes prov ON c.idproveedor = prov.numclie
                WHERE c.iddeposito = ? AND c.estado = 0;   -- Solo las que están en depósito
            `;

    queryParams.push(idDepositoUsuario);


    const conductoresQuery = `
            SELECT 
                c.nomchof, 
                c.dnichof,
                c.nrochof,
                c.idcamion, 
                m.patmovil AS patente_camion, 
                m.pacmovil AS patente_acoplado
            FROM conductores c
            JOIN moviles m ON c.idcamion = m.nummovil;
        `;

    connection.query(enviosQuery, queryParams, (error, enviosResults) => {
      if (error) {
        console.log(error);
        return res.status(500).send("Error al obtener los envíos.");
      }

      connection.query(cargaQuery, queryParams, (error, cargaResults) => {
        if (error) {
          console.log(error);
          return res.status(500).send("Error al obtener las cargas.");
        }

        connection.query(conductoresQuery, (error, conductoresResults) => {
          if (error) {
            console.log(error);
            return res.status(500).send("Error al obtener los conductores.");
          }

          res.render('nuevoenvio.ejs', {

            envios: enviosResults,
            cargas: cargaResults,
            choferes: conductoresResults
          });
        });
      });
    });
  });
});


router.get('/clientes', (req, res) => {
  const sqlClientes = 'SELECT * FROM clientes';
  const sqlSituacionIVA = 'SELECT sitiva FROM situacioniva';

  connection.query(sqlClientes, (errorClientes, resultsClientes) => {
    if (errorClientes) {
      console.error('Error obteniendo clientes:', errorClientes);
      return res.status(500).send('Error en el servidor');
    }

    connection.query(sqlSituacionIVA, (errorSituacionIVA, resultsSituacionIVA) => {
      if (errorSituacionIVA) {
        console.error('Error obteniendo situación IVA:', errorSituacionIVA);
        return res.status(500).send('Error en el servidor');
      }


      // Pasamos ambas listas a la vista
      res.render('clientes.ejs', {
        clientes: resultsClientes,
        situacionesIVA: resultsSituacionIVA
      });
    });
  });
});

router.get('/conductores', (req, res) => {
  const sqlConductores = `
        SELECT c.nrochof, c.nomchof, c.dnichof,c.telchof, m.patmovil AS patente_camion 
        FROM conductores c
        LEFT JOIN moviles m ON c.idcamion = m.nummovil
    `;
  const sqlCamiones = 'SELECT nummovil, patmovil FROM moviles';

  connection.query(sqlConductores, (errorConductores, resultsConductores) => {
    if (errorConductores) {
      console.error('Error obteniendo conductores:', errorConductores);
      return res.status(500).send('Error en el servidor');
    }

    connection.query(sqlCamiones, (errorCamiones, resultsCamiones) => {
      if (errorCamiones) {
        console.error('Error obteniendo camiones:', errorCamiones);
        return res.status(500).send('Error en el servidor');
      }

      res.render('conductores.ejs', {
        conductores: resultsConductores,
        camiones: resultsCamiones
      });
    });
  });
});

router.get('/camiones', (req, res) => {
  const sql = `
    SELECT m.*, c.nomchof 
    FROM moviles m
    LEFT JOIN conductores c ON c.idcamion = m.nummovil
  `;
  const sqlConductores = 'SELECT nrochof, nomchof FROM conductores';

  connection.query(sql, (errorCamiones, resultsCamiones) => {
    if (errorCamiones) {
      console.error('Error obteniendo camiones:', errorCamiones);
      return res.status(500).send('Error en el servidor');
    }

    connection.query(sqlConductores, (errorConductores, resultsConductores) => {
      if (errorConductores) {
        console.error('Error obteniendo conductores:', errorConductores);
        return res.status(500).send('Error en el servidor');
      }

      res.render('camiones.ejs', {
        camiones: resultsCamiones,
        conductores: resultsConductores
      });
    });
  });
});


router.get('/modificarDatosPersonales', (req, res) => res.render('modificarDatosPersonales.ejs'))
router.get('/newPassword', (req, res) => {
  const userActual = req.session.userName
  connection.query('SELECT * FROM usuarios WHERE usuario = ?', [userActual], (error, results) => {
    if (error) {
      throw error;
    } else {
      res.render('newPassword.ejs', { "dato": results });
    }
  });

});



import save from '../controllers/carga.js';
router.post('/save', save.save);//Guardar una nueva carga
router.post('/update', save.update);//Editar una carga en depósito 
router.post('/carga/delete', save.eliminarCarga);//Eliminar una carga
router.post('/api/carga/update-prioridad', save.updatePrioridad);//Cambiar prioridad


import saveClientes from '../controllers/clientes.js';
router.post('/saveClientes', saveClientes.saveClientes);//Guardar nuevo cliente
router.post('/saveClientes-2', saveClientes.saveClientes2);//Guardar nuevo cliente
router.post('/updateCliente', saveClientes.updateCliente)//Editar un cliente
router.post('/eliminarCliente', saveClientes.eliminarCliente);//Eliminar cliente


import saveEnvio from '../controllers/envios.js'
router.post('/guardarEnvio', saveEnvio.saveEnvio);//guardar un envío
router.post('/updateEnvio', saveEnvio.updateEnvio);//editar un envío


import saveConductor from '../controllers/conductores.js'
router.post('/saveConductor', saveConductor.saveConductor);//guardar un conductor
router.post('/updateConductor', saveConductor.updateConductor)//Editar un Conductor
router.post('/eliminarConductor', saveConductor.eliminarConductor)//eliminar un Conductor

import saveCamion from '../controllers/camiones.js'
router.post('/saveCamion', saveCamion.saveCamion);//guardar un Camion
router.post('/updateCamion', saveCamion.updateCamion)//Editar un Camion
router.post('/eliminarCamion', saveCamion.eliminarCamion)//eliminar un Camion


export default router