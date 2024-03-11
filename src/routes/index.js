import { Router } from 'express'
import connection from '../database/db.js'
const router = Router()



router.get('/', (req, res) => res.render('inicio_sesion.ejs', {"x": false }))

import login from '../controllers/login.js'
router.post('/login', login.login);
router.get('/cerrarSesion', login.logout);


router.get('/estadistica', (req, res) => { 
    connection.query('SELECT * FROM stock WHERE cantidad <= CantidadCritica', (error1, results)=>{
        if(error1){
            throw error1;
        }else{
            connection.query('SELECT * FROM orden_trabajo WHERE estado = ? ORDER BY fecha_inicio', ['Pendiente'] , (error, pendientes)=>{
                if(error){
                    throw error;
                }else{
                    
                    res.render('estadistica.ejs', {pendientes: pendientes,results: results,"login": req.session.loggedImAdmin});
                }
            })
        }

    })
})

router.get('/almacen/stock', (req, res) => { 
    connection.query('SELECT * FROM stock', (error, results)=>{
        if(error){
            throw error;
        }else{
            res.render('stock.ejs', {results: results,"login": req.session.loggedImAdmin});
        }

    })
})

router.get('/almacen/activos', (req, res) => { 
    connection.query('SELECT * FROM activos', (error, results)=>{
        if(error){
            throw error;
        }else{
            res.render('activos.ejs', {results: results,"login": req.session.loggedImAdmin});
        }

    })
})

router.get('/modificar-activos', (req, res) => { 
    connection.query('SELECT * FROM activos', (error, results)=>{
        if(error){
            throw error;
        }else{
            res.render('modificarActivo.ejs', {results: results,"login": req.session.loggedImAdmin});
        }

    })
})

router.get('/modificar-stock', (req, res) => { 
    connection.query('SELECT * FROM stock', (error, results)=>{
        if(error){
            throw error;
        }else{
            res.render('modificarStock.ejs', {results: results,"login": req.session.loggedImAdmin});
        }

    })
})


router.get('/orden-de-trabajo', (req, res) => { 
    connection.query('SELECT * FROM orden_trabajo', (error, results)=>{
        if(error){
            throw error;
        }else{
            res.render('orden_trabajo.ejs', {results: results,"login": req.session.loggedImAdmin});
        }

    })
})


router.get('/orden-de-trabajo-graficoBarras', (req, res) => {
    // Realiza la consulta a la base de datos para obtener la cantidad de órdenes de trabajo de cada tipo
    connection.query(
        'SELECT estado, COUNT(*) AS cantidad FROM orden_trabajo GROUP BY estado',
        (error, results, fields) => {
            if (error) {
                console.error('Error al ejecutar la consulta:', error);
                res.status(500).send('Error en el servidor');
                return;
            }

            // Consulta adicional para contar la cantidad total de filas en la tabla ot_programada_finalizada
            connection.query(
                'SELECT COUNT(*) AS total FROM ot_programada_finalizada',
                (error2, results2, fields2) => {
                    if (error2) {
                        console.error('Error al ejecutar la consulta:', error2);
                        res.status(500).send('Error en el servidor');
                        return;
                    }

                    // Procesa los resultados y construye el objeto de respuesta
                    const data = {
                        pendientes: 0,
                        enProceso: 0,
                        finalizadas: 0,
                        totalFinalizadas: results2[0].total // Total de filas en ot_programada_finalizada
                    };
                    
                    results.forEach(row => {
                        if (row.estado === 'Pendiente') {
                            data.pendientes = row.cantidad;
                        } else if (row.estado === 'En proceso') {
                            data.enProceso = row.cantidad;
                        } else if (row.estado === 'Finalizada') {
                            data.finalizadas = row.cantidad + data.totalFinalizadas;
                        }
                    });
                    
                    // Envía los datos al cliente en formato JSON
                    res.json(data);
                }
            );
        }
    );
});


router.get('/orden-de-trabajo-graficoPorcentaje', (req, res) => {
    // Realiza la consulta a la base de datos para obtener la cantidad de órdenes de trabajo con el tipo "Correctiva"
    connection.query(
        'SELECT COUNT(*) AS total_correctivas FROM orden_trabajo WHERE tipo = "Correctiva"',
        (error1, results1, fields1) => {
            if (error1) {
                console.error('Error al ejecutar la consulta:', error1);
                res.status(500).send('Error en el servidor');
                return;
            }

            // Realiza la consulta a la base de datos para obtener la cantidad de órdenes de trabajo con el tipo "Correctiva" y estado "Finalizada"
            connection.query(
                'SELECT COUNT(*) AS total_correctivas_finalizadas FROM orden_trabajo WHERE tipo = "Correctiva" AND estado = "Finalizada"',
                (error2, results2, fields2) => {
                    if (error2) {
                        console.error('Error al ejecutar la consulta:', error2);
                        res.status(500).send('Error en el servidor');
                        return;
                    }

                    // Procesa los resultados y construye el objeto de respuesta
                    const data = {
                        totalCorrectivas: results1[0].total_correctivas,
                        totalCorrectivasFinalizadas: results2[0].total_correctivas_finalizadas
                    };

                    // Envía los datos al cliente en formato JSON
                    res.json(data);
                }
            );
        }
    );
});


router.get('/orden-de-trabajo-graficoTorta', (req, res) => {
    // Realiza la consulta a la base de datos para obtener la cantidad de órdenes de trabajo de cada tipo
    connection.query(
        'SELECT tipo, COUNT(*) AS cantidad FROM orden_trabajo GROUP BY tipo',
        (error, results, fields) => {
            if (error) {
                console.error('Error al ejecutar la consulta:', error);
                res.status(500).send('Error en el servidor');
                return;
            }

            // Procesa los resultados y construye el objeto de respuesta
            const data = {
                correctiva: 0,
                programada: 0
            };

            results.forEach(row => {
                if (row.tipo === 'Correctiva') {
                    data.correctiva = row.cantidad;
                } else if (row.tipo === 'Programada') {
                    data.programada = row.cantidad;
                }
            });
            

            // Envía los datos al cliente en formato JSON
            res.json(data);
        }
    );
});


router.get('/datos-calendario', (req, res) => {
    // Realiza la consulta a la base de datos para obtener los datos del calendario
    connection.query(
        'SELECT actividad AS title, fecha_inicio AS start FROM orden_trabajo',
        (error, results, fields) => {
            if (error) {
                console.error('Error al ejecutar la consulta:', error);
                res.status(500).send('Error en el servidor');
                return;
            }

            // Procesa los resultados y construye el objeto de eventos del calendario
            const eventos = results.map(row => ({
                title: row.title,
                start: row.start
            }));
            // Envía los datos al cliente en formato JSON
            res.json(eventos);
        }
    );
});


router.get('/stock-disponible', (req, res) => { 
    connection.query('SELECT * FROM stock', (error, results)=>{
        if(error){
            throw error;
        }else{
            res.json({results: results});
        }

    })
})

router.get('/orden-de-trabajo/pendiente', (req, res) => { 
    connection.query('SELECT * FROM orden_trabajo WHERE estado = ?', ['Pendiente'] , (error, results)=>{
        if(error){
            throw error;
        }else{
            res.render('pendiente.ejs', {results: results,"login": req.session.loggedImAdmin});
        }

    })
})

router.get('/orden-de-trabajo/finalizada', (req, res) => { 
    connection.query('SELECT * FROM orden_trabajo WHERE estado = ?', ['Finalizada'] , (error, results)=>{
        if(error){
            throw error;
        }else{
            res.render('finalizada.ejs', {results: results,"login": req.session.loggedImAdmin});
        }

    })
})

router.get('/orden-de-trabajo/en-proceso', (req, res) => { 
    connection.query('SELECT * FROM orden_trabajo WHERE estado = ?', ['En proceso'] , (error, results)=>{
        if(error){
            throw error;
        }else{
            res.render('en_proceso.ejs', {results: results,"login": req.session.loggedImAdmin});
        }

    })
})

router.get('/orden-de-trabajo/generar-orden', (req, res) => { 
    // Consulta para obtener los activos distintos
    connection.query('SELECT DISTINCT nombre FROM activos', (errorActivos, activos) => {
        if (errorActivos) {
            throw errorActivos;
        } else {
            // Consulta para obtener todas las órdenes de trabajo
            connection.query('SELECT * FROM orden_trabajo', (errorOrdenes, results) => {
                if (errorOrdenes) {
                    throw errorOrdenes;
                } else {
                    
                    // Renderizar la plantilla 'gestion_orden_trabajo.ejs' y pasar los resultados de ambas consultas y los datos de inicio de sesión
                    res.render('gestion_orden_trabajo.ejs', { results: results, activos: activos, login: req.session.loggedImAdmin });
                }
            });
        }
    });
});


//RUTA PARA CREAR LOS REGISTROS.
router.get('/orden-de-trabajo/create', (req, res) => res.render('create.ejs'))

//RUTA PARA EDITAR LOS REGISTROS
router.get('/orden-de-trabajo/edit/:id', (req, res) => {
    const id = req.params.id;
    connection.query('SELECT * FROM orden_trabajo WHERE id_orden_trabajo = ?',[id], (error, results)=>{
        
        if(error){
            throw error;
        }else{
            res.json({orden: results[0]});
        }

        });
});

router.get('/terceros', (req, res) =>{
    connection.query('SELECT * FROM terceros', (error, results)=>{
        if(error){
            throw error;
        }else{
            res.render('terceros.ejs', {results: results,"login": req.session.loggedImAdmin});
        }
    });
});

router.get('/almacen', (req, res) => res.render('almacen.ejs', {"login": req.session.loggedImAdmin}))
router.get('/gestion-mantenimiento', (req, res) => res.render('gestion_mantenimiento.ejs', {"login": req.session.loggedImAdmin}))
router.get('/administrar-usuario', (req, res) => res.render('administrar_usuario.ejs', {"login": req.session.loggedImAdmin}))
router.get('/orden-de-trabajo/rangeDates', (req,res) => res.render('nuevaTablaFiltrada.ejs', {"login": req.session.loggedImAdmin}))




import save from '../controllers/gestion_orden_trabajo.js';
router.post('/save', save.save);
router.post('/update', save.update);
router.post('/cambiar-estado-pendiente-enProceso', save.cambiarEstadoPendienteEnProceso);
router.post('/cambiar-estado-enProceso-Terminada', save.cambiarEstadoEnProcesoTerminada);
router.post('/orden-de-trabajo/delete', save.eliminarOrden);

import saveItem from '../controllers/gestion_stock.js';
router.post('/saveItem', saveItem.saveItem);
router.post('/updateStock', saveItem.updateStock);
router.post('/modificar-stock/delete', saveItem.eliminarItem);

import activo from '../controllers/gestion_activo.js';
router.post('/saveActivo', activo.saveActivo);
router.post('/eliminarActivo', activo.eliminarActivo);
router.post('/updateActivo', activo.updateActivo);

import tercero from '../controllers/gestion_tercero.js';
router.post('/saveTercero', tercero.saveTercero);
router.post('/updateTercero', tercero.updateTercero);
router.post('/eliminarTercero',tercero.eliminarTercero);

import actualizarPorFechas from '../controllers/actualizarTabla.js';
router.post('/actualizarTablaFechas', actualizarPorFechas.rangoFechas);
router.post('/actualizarTablaFechas-EnProceso', actualizarPorFechas.rangoFechasEnProceso);
router.post('/actualizarTablaFechas-Pendientes', actualizarPorFechas.rangoFechasPendientes);
router.post('/actualizarTablaFechas-Finalizadas', actualizarPorFechas.rangoFechasFinalizadas);
router.post('/actualizarTablaFechas-Gestion', actualizarPorFechas.rangoFechasGestion);


export default router


//RUTA PARA ELIMINAR UNA ORDEN
// router.get('/orden-de-trabajo/delete/:id', (req, res) => {
//     const id = req.params.id;
//     connection.query('DELETE FROM orden_trabajo WHERE id_orden_trabajo = ?', [id], (error, results)=>{
        
//         if(error){
//             throw error;
//         }else{
//             res.redirect('/orden-de-trabajo/generar-orden');
//         }

//         });
// });


// //RUTA PARA EDITAR LOS REGISTROS
// router.get('/orden-de-trabajo/edit/:id', (req, res) => {
//     const id = req.params.id;
//     connection.query('SELECT * FROM orden_trabajo WHERE id_orden_trabajo = ?',[id], (error, results)=>{
        
//         if(error){
//             throw error;
//         }else{
//             res.json(results[0]);
//         }
//         });
// });