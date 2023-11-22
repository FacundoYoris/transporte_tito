import { Router } from 'express'
const router = Router()

router.get('/', (req, res) => res.render('inicio_sesion.ejs', {x: 'Inicio de sesión' })) 
//Cuando el servidor este en la pagina inicial ejecutar inicio_sesion.ejs
router.get('/estadistica', (req, res) => res.render('estadistica.ejs', {"login": req.session.loggedImAdmin}))
router.get('/orden-de-trabajo', (req, res) => res.render('orden_trabajo.ejs', {"login": req.session.loggedImAdmin}))
router.get('/almacen', (req, res) => res.render('almacen.ejs', {"login": req.session.loggedImAdmin}))
router.get('/gestion-mantenimiento', (req, res) => res.render('gestion_mantenimiento.ejs', {"login": req.session.loggedImAdmin}))
router.get('/terceros', (req, res) => res.render('terceros.ejs', {"login": req.session.loggedImAdmin}))
router.get('/administrar-usuario', (req, res) => res.render('administrar_usuario.ejs', {"login": req.session.loggedImAdmin}))

export default router