import { Router } from 'express'
import connection from '../database/db.js'

const router = Router()


//Desde la raíz se va hacia el formulario para completar el login
router.get('/', (req, res) => res.render('inicio_sesion.ejs', {"x": false }))
//Se importa el archivo login.js de controllers para verificar en su función login si el usuario tiene un usuario y contraseña válido
import login from '../controllers/login.js'
router.post('/login', login.login);
//Se ejecuta en login.js la función logout, la cual cierra la sesión actual
router.get('/cerrarSesion', login.logout);

//Cuando se va a la ruta de estadísticas, se toman todos los datos necesarios para los gráficos y se los manda a estadistica.ejs
router.get('/estadistica', (req, res) => { 
    // Obtener la fecha actual
    const fechaActual = new Date();

    // Consulta para obtener los registros de stock
    connection.query('SELECT * FROM stock WHERE cantidad <= CantidadCritica', (error1, results) => {
        if (error1) {
            throw error1;
        } else {
            // Consulta para obtener las órdenes de trabajo pendientes
            connection.query('SELECT * FROM orden_trabajo WHERE estado = ? ORDER BY fecha_inicio', ['Pendiente'], (error, pendientes) => {
                if (error) {
                    throw error;
                } else {
                    // Filtrar órdenes correctivas pendientes con fecha_inicio menor a la fecha actual
                    const correctivasPendientesAtrasadas = pendientes.filter(orden => orden.tipo === 'Correctiva' && new Date(orden.fecha_inicio) < fechaActual);

                    // Filtrar órdenes programadas pendientes con fecha_inicio menor a la fecha actual
                    const programadasPendientesAtrasadas = pendientes.filter(orden => orden.tipo === 'Programada' && new Date(orden.fecha_inicio) < fechaActual);
                    // Renderizar la plantilla con todos los datos
                    res.render('estadistica.ejs', {
                        pendientes: pendientes,
                        results: results,
                        correctivasPendientesAtrasadas: correctivasPendientesAtrasadas,
                        programadasPendientesAtrasadas: programadasPendientesAtrasadas,
                        login: req.session.loggedImAdmin
                    });
                }
            });
        }
    });
});


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
        'SELECT estado, COUNT(*) AS cantidad FROM orden_trabajo WHERE tipo = "Correctiva" GROUP BY estado',
        (error, results, fields) => {
            if (error) {
                console.error('Error al ejecutar la consulta:', error);
                res.status(500).send('Error en el servidor');
                return;
            }
            // Procesa los resultados y construye el objeto de respuesta
            const data = {
                pendientes: 0,
                enProceso: 0,
                finalizadas: 0,
            };
                    
            results.forEach(row => {
                if (row.estado === 'Pendiente') {
                    data.pendientes = row.cantidad;
                } else if (row.estado === 'En proceso') {
                    data.enProceso = row.cantidad;
                } else if (row.estado === 'Finalizada') {
                    data.finalizadas = row.cantidad;
                }
            });
            
            // Envía los datos al cliente en formato JSON
            res.json(data);
                
            
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
    let query;
    let params;

    if (req.session.loggedImAdmin) {
        query = 'SELECT * FROM orden_trabajo WHERE estado = ?';
        params = ['En proceso'];
    } else {
        query = 'SELECT * FROM orden_trabajo WHERE estado = ? AND responsable = ?';
        params = ['En proceso', req.session.userName];
    }

    connection.query(query, params, (error, results) => {
        if (error) {
            throw error;
        } else {
            res.render('en_proceso.ejs', {
                results: results,
                login: req.session.loggedImAdmin
            });
        }
    });
});


router.get('/orden-de-trabajo/generar-orden', (req, res) => { 
    // Consulta para obtener los activos distintos
    connection.query('SELECT DISTINCT nombre FROM activos', (errorActivos, activos) => {
        if (errorActivos) {
            throw errorActivos;
        } else {
            connection.query('SELECT DISTINCT nombre FROM activos', (errorActivos, activos) => {
                if (errorActivos) {
                    throw errorActivos;
                } else {
                    // Consulta para obtener todas las órdenes de trabajo
                    connection.query('SELECT usuario FROM usuarios', (errorUsuarios, usuarios) => {
                        if (errorUsuarios) {
                            throw errorUsuarios;
                        } else {
                             // Consulta para obtener todas las órdenes de trabajo
                            connection.query('SELECT * FROM orden_trabajo', (errorOrdenes, results) => {
                                if (errorOrdenes) {
                                    throw errorOrdenes;
                                } else {
                                    
                                    // Renderizar la plantilla 'gestion_orden_trabajo.ejs' y pasar los resultados de ambas consultas y los datos de inicio de sesión
                                    res.render('gestion_orden_trabajo.ejs', { results: results, activos: activos,usuarios:usuarios, login: req.session.loggedImAdmin });
                                }
                            }); 
                        }
                    });
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

router.get('/modificarDatosPersonales', (req,res) => res.render('modificarDatosPersonales.ejs',{"login": req.session.loggedImAdmin}))
router.get('/newPassword', (req,res) =>{
    const userActual = req.session.userName
    connection.query('SELECT * FROM usuarios WHERE usuario = ?',[userActual], (error, results)=>{
        if(error){
            throw error;
        }else{    
            res.render('newPassword.ejs', {"login": req.session.loggedImAdmin,"dato":results});
        }
        });
    
});

router.get('/fechasYtareasPrioridadAlta', (req, res) => {
    const userActual = req.session.userName;

    // Consulta SQL para obtener las ordenes de trabajo que coinciden con el usuario actual, prioridad "Alta" y estado "Pendiente"
    const consultaOrdenes = `
        SELECT fecha_inicio, id_orden_trabajo,actividad
        FROM orden_trabajo
        WHERE responsable = ? AND prioridad = 'Alta' AND estado = 'Pendiente'
        ORDER BY fecha_inicio;
    `;

    // Ejecutar la consulta para obtener las ordenes de trabajo
    connection.query(consultaOrdenes, [userActual], (error, resultados) => {
        if (error) {
            throw error;
        }

        // Objeto para almacenar las ordenes de trabajo agrupadas por fecha_inicio
        const ordenesAgrupadas = {};

        // Iterar sobre los resultados para agruparlos por fecha_inicio
        resultados.forEach(orden => {
            const { fecha_inicio, id_orden_trabajo } = orden;
            if (!ordenesAgrupadas[fecha_inicio]) {
                ordenesAgrupadas[fecha_inicio] = [];
            }
            ordenesAgrupadas[fecha_inicio].push(id_orden_trabajo);
        });

        // Ordenar las fechas de forma ascendente
        const fechasOrdenadas = Object.keys(ordenesAgrupadas).sort();

        // Crear el arreglo final con el formato deseado
        const resultadoFinal = fechasOrdenadas.map(fecha => ({
            fecha_inicio: fecha,
            tareas: ordenesAgrupadas[fecha]

        }));
       
        // Renderizar la vista con los resultados finales
        res.json(resultadoFinal);
    });
});

router.get('/fechasYtareasPrioridadMedia', (req, res) => {
    const userActual = req.session.userName;

    // Consulta SQL para obtener las ordenes de trabajo que coinciden con el usuario actual, prioridad "Alta" y estado "Pendiente"
    const consultaOrdenes = `
        SELECT fecha_inicio, id_orden_trabajo
        FROM orden_trabajo
        WHERE responsable = ? AND prioridad = 'Media' AND estado = 'Pendiente'
        ORDER BY fecha_inicio;
    `;

    // Ejecutar la consulta para obtener las ordenes de trabajo
    connection.query(consultaOrdenes, [userActual], (error, resultados) => {
        if (error) {
            throw error;
        }

        // Objeto para almacenar las ordenes de trabajo agrupadas por fecha_inicio
        const ordenesAgrupadas = {};

        // Iterar sobre los resultados para agruparlos por fecha_inicio
        resultados.forEach(orden => {
            const { fecha_inicio, id_orden_trabajo } = orden;
            if (!ordenesAgrupadas[fecha_inicio]) {
                ordenesAgrupadas[fecha_inicio] = [];
            }
            ordenesAgrupadas[fecha_inicio].push(id_orden_trabajo);
        });

        // Ordenar las fechas de forma ascendente
        const fechasOrdenadas = Object.keys(ordenesAgrupadas).sort();

        // Crear el arreglo final con el formato deseado
        const resultadoFinal = fechasOrdenadas.map(fecha => ({
            fecha_inicio: fecha,
            tareas: ordenesAgrupadas[fecha]
        }));
        console.log(resultadoFinal);
        // Renderizar la vista con los resultados finales
        res.json(resultadoFinal);
    });
});

router.get('/fechasYtareasPrioridadBaja', (req, res) => {
    const userActual = req.session.userName;

    // Consulta SQL para obtener las ordenes de trabajo que coinciden con el usuario actual, prioridad "Alta" y estado "Pendiente"
    const consultaOrdenes = `
        SELECT fecha_inicio, id_orden_trabajo
        FROM orden_trabajo
        WHERE responsable = ? AND prioridad = 'Baja' AND estado = 'Pendiente'
        ORDER BY fecha_inicio;
    `;

    // Ejecutar la consulta para obtener las ordenes de trabajo
    connection.query(consultaOrdenes, [userActual], (error, resultados) => {
        if (error) {
            throw error;
        }

        // Objeto para almacenar las ordenes de trabajo agrupadas por fecha_inicio
        const ordenesAgrupadas = {};

        // Iterar sobre los resultados para agruparlos por fecha_inicio
        resultados.forEach(orden => {
            const { fecha_inicio, id_orden_trabajo } = orden;
            if (!ordenesAgrupadas[fecha_inicio]) {
                ordenesAgrupadas[fecha_inicio] = [];
            }
            ordenesAgrupadas[fecha_inicio].push(id_orden_trabajo);
        });

        // Ordenar las fechas de forma ascendente
        const fechasOrdenadas = Object.keys(ordenesAgrupadas).sort();

        // Crear el arreglo final con el formato deseado
        const resultadoFinal = fechasOrdenadas.map(fecha => ({
            fecha_inicio: fecha,
            tareas: ordenesAgrupadas[fecha]
        }));
        console.log(resultadoFinal);
        // Renderizar la vista con los resultados finales
        res.json(resultadoFinal);
    });
});


router.get('/orden-de-trabajo/:id', (req, res) => {
    const idOrdenTrabajo = req.params.id;
    // Realizar la consulta a la base de datos para obtener los detalles de la orden de trabajo con el ID proporcionado
    connection.query('SELECT * FROM orden_trabajo WHERE id_orden_trabajo = ?', [idOrdenTrabajo], (error, results) => {
        if (error) {
            console.error('Error al obtener los detalles de la orden de trabajo:', error);
            res.status(500).json({ error: 'Error interno del servidor' });
        } else {
            // Devolver los detalles de la orden de trabajo en formato JSON
            res.json(results[0]); // Suponiendo que solo se espera un resultado
        }
    });
});


import save from '../controllers/gestion_orden_trabajo.js';
router.post('/save', save.save);//Guardar una nueva orden de trabajo
router.post('/update', save.update);//Editar una orden de trabajo
router.post('/cambiar-estado-pendiente-enProceso', save.cambiarEstadoPendienteEnProceso);//Cuando se presiona para empezar la orden cambiar su estado de pendiente a en proceso
router.post('/cambiar-estado-enProceso-Terminada', save.cambiarEstadoEnProcesoTerminada);//Cuando se presiona para finalizar la orden que esta en proceso pasa a finalizada y se guarda su solución
router.post('/orden-de-trabajo/delete', save.eliminarOrden);//Eliminar una orden de trabajo
router.post('/modificarDatosPersonales', save.modificarDatosPersonales);

import saveItem from '../controllers/gestion_stock.js';
router.post('/saveItem', saveItem.saveItem);//Guardar nueva componente de stock
router.post('/updateStock', saveItem.updateStock);//Editar el stock
router.post('/modificar-stock/delete', saveItem.eliminarItem);//Borrar un elemento de stock

import activo from '../controllers/gestion_activo.js';
router.post('/saveActivo', activo.saveActivo);//Guardar un activo
router.post('/eliminarActivo', activo.eliminarActivo);//Eliminar un activo
router.post('/updateActivo', activo.updateActivo);//Modificar un activo

import tercero from '../controllers/gestion_tercero.js';
router.post('/saveTercero', tercero.saveTercero);//Cargar persona que produce algún servicio
router.post('/updateTercero', tercero.updateTercero);//Editar los datos de la persona
router.post('/eliminarTercero',tercero.eliminarTercero);//Eliminar todos los datos de la perosna

import actualizarPorFechas from '../controllers/actualizarTabla.js';
router.post('/actualizarTablaFechas', actualizarPorFechas.rangoFechas);//Nueva tabla que posee solo las fechas que se encuentran en un rango de fecha en específico
router.post('/actualizarTablaFechas-EnProceso', actualizarPorFechas.rangoFechasEnProceso);//IDEM pero con solo las ordenes de trabajo en proceso
router.post('/actualizarTablaFechas-Pendientes', actualizarPorFechas.rangoFechasPendientes);//IDEM pero solo con las ordenes de trabajo pendientes
router.post('/actualizarTablaFechas-Finalizadas', actualizarPorFechas.rangoFechasFinalizadas);//IDEM pero solo con las ordenes de trabajo finalizadas
router.post('/actualizarTablaFechas-Gestion', actualizarPorFechas.rangoFechasGestion);//Verificar si esto esta en uso o no


export default router

