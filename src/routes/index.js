import { Router } from 'express'
const router = Router()

router.get('/', (req, res) => res.render('inicio_sesion.ejs', {x: 'Inicio de sesión' })) 
//Cuando el servidor este en la pagina inicial ejecutar inicio_sesion.ejs
router.get('/estadistica', (req, res) => res.render('estadistica.ejs'))
router.get('/estadistica2', (req, res) => res.render('estadistica2.ejs'))
router.get('/orden-de-trabajo', (req, res) => res.render('orden_trabajo.ejs'))
router.get('/almacen', (req, res) => res.render('almacen.ejs'))
router.get('/gestion-mantenimiento', (req, res) => res.render('gestion_mantenimiento.ejs'))
router.get('/terceros', (req, res) => res.render('terceros.ejs'))

export default router