// import { Router } from 'express'
// const router = Router()

// router.get('/', (req, res) => res.render('inicio_sesion.ejs', {"x":false})) 
// //Cuando el servidor este en la pagina inicial ejecutar inicio_sesion.ejs
// router.get('/estadistica', (req, res) => res.render('estadistica.ejs', {"login": req.session.loggedImAdmin}))
// router.get('/orden-de-trabajo', (req, res) => res.render('orden_trabajo.ejs', {"login": req.session.loggedImAdmin}))
// router.get('/almacen', (req, res) => res.render('almacen.ejs', {"login": req.session.loggedImAdmin}))
// router.get('/gestion-mantenimiento', (req, res) => res.render('gestion_mantenimiento.ejs', {"login": req.session.loggedImAdmin}))
// router.get('/terceros', (req, res) => res.render('terceros.ejs', {"login": req.session.loggedImAdmin}))
// router.get('/administrar-usuario', (req, res) => res.render('administrar_usuario.ejs', {"login": req.session.loggedImAdmin}))

// export default router

////////////////////////////////////////////////////////
import { Router } from 'express'
import connection from '../database/db.js'

const router = Router()

router.get('/', (req, res) => res.render('inicio_sesion.ejs', {"x": false })) 
//Cuando el servidor este en la pagina inicial ejecutar inicio_sesion.ejs
router.get('/estadistica', (req, res) => res.render('estadistica.ejs', {"login": req.session.loggedImAdmin}))
router.get('/orden-de-trabajo', (req, res) => { 
    connection.query('SELECT * FROM orden_trabajo', (error, results)=>{
        if(error){
            throw error;
        }else{
            res.render('orden_trabajo.ejs', {results: results,"login": req.session.loggedImAdmin});
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
    connection.query('SELECT * FROM orden_trabajo', (error, results)=>{
        if(error){
            throw error;
        }else{
            res.render('gestion_orden_trabajo.ejs', {results: results,"login": req.session.loggedImAdmin});
        }

    })
})
//RUTA PARA CREAR LOS REGISTROS.
router.get('/orden-de-trabajo/create', (req, res) => res.render('create.ejs'))
//RUTA PARA EDITAR LOS REGISTROS
router.get('/orden-de-trabajo/edit/:id', (req, res) => {
    const id = req.params.id;
    connection.query('SELECT * FROM orden_trabajo WHERE id_orden_trabajo = ?',[id], (error, results)=>{
        
        if(error){
            throw error;
        }else{
            res.render('edit.ejs', {orden: results[0]});
        }

        });
});
//RUTA PARA ELIMINAR UNA ORDEN
router.get('/orden-de-trabajo/delete/:id', (req, res) => {
    const id = req.params.id;
    connection.query('DELETE FROM orden_trabajo WHERE id_orden_trabajo = ?', [id], (error, results)=>{
        
        if(error){
            throw error;
        }else{
            res.redirect('/orden-de-trabajo/generar-orden');
        }

        });
});
router.get('/almacen', (req, res) => res.render('almacen.ejs', {"login": req.session.loggedImAdmin}))
router.get('/gestion-mantenimiento', (req, res) => res.render('gestion_mantenimiento.ejs', {"login": req.session.loggedImAdmin}))
router.get('/terceros', (req, res) => res.render('terceros.ejs', {"login": req.session.loggedImAdmin}))
router.get('/administrar-usuario', (req, res) => res.render('administrar_usuario.ejs', {"login": req.session.loggedImAdmin}))
import save from '../controllers/gestion_orden_trabajo.js';
router.post('/save', save.save);
router.post('/update', save.update);
export default router