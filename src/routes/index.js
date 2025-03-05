

// La variable "login" = req.session.loggedImAdmin hace referencia a si el usuario tiene privilegio de administrador
// La variable "operario" = req.session.loggedImOperario hace referencia a si el usuario tiene privilegio de operario
// La variable "usuarioExterno" = req.session.loggedImExterno hace referencia a si el usuario tiene privilegio de usuario externo
import { Router } from 'express'
import connection from '../database/db.js'

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

    // Consulta que une la tabla carga con clientes dos veces para obtener nomclie y nomprov
    const query = `
        SELECT 
            carga.id, 
            carga.unidad, 
            carga.idproveedor,
            proveedor.nomclie AS nomprov, -- Nombre del proveedor
            carga.iddeposito, 
            carga.cantidad, 
            carga.destino, 
            carga.prioridad, 
            carga.idcliente, 
            cliente.nomclie AS nomclie, -- Nombre del cliente
            carga.valordeclarado 
        FROM carga 
        LEFT JOIN clientes AS cliente ON carga.idcliente = cliente.numclie
        LEFT JOIN clientes AS proveedor ON carga.idproveedor = proveedor.numclie
        WHERE carga.iddeposito = ?`;

    connection.query(query, [depositoId], (error, results) => {
        if (error) {
            return res.status(500).json({ error: 'Error en la consulta' });
        }
        res.json(results); // Enviamos las cargas con nomclie y nomprov como respuesta JSON
    });
});



router.get('/envios', (req, res) => res.render('envios.ejs'));
router.get('/clientes', (req, res) => res.render('clientes.ejs'));
router.get('/proveedores', (req, res) => res.render('proveedores.ejs'));
router.get('/conductores', (req, res) => res.render('conductores.ejs'));
router.get('/camiones', (req, res) => res.render('camiones.ejs'));

router.get('/modificarDatosPersonales', (req,res) => res.render('modificarDatosPersonales.ejs'))
router.get('/newPassword', (req,res) =>{
    const userActual = req.session.userName
    connection.query('SELECT * FROM usuarios WHERE usuario = ?',[userActual], (error, results)=>{
        if(error){
            throw error;
        }else{    
            res.render('newPassword.ejs', {"dato":results});
        }
        });
    
});



import save from '../controllers/carga.js';
router.post('/save', save.save);//Guardar una nueva carga
router.post('/update', save.update);//Editar una carga en depósito 
router.post('/carga/delete', save.eliminarCarga);//Eliminar una carga

import saveClientes from '../controllers/clientes.js';
router.post('/saveClientes', saveClientes.saveClientes);//Guardar nuevo cliente


export default router