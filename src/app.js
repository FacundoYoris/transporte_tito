
import dotenv from 'dotenv';
dotenv.config({path: './env/.env'});
import express from 'express'
import session from 'express-session'
import ejs from 'ejs'
import {dirname, join} from 'path'
import {fileURLToPath} from 'url'
import indexRoutes from './routes/index.js'
import mysql2 from 'mysql2';
import flash from 'connect-flash';


const app = express()
const __dirname = dirname(fileURLToPath(import.meta.url)) //Forma de obtener la ruta absoluta. Por mas que movamos views de carpeta en carpeta siempre va a estar de la forma correcta.

app.set('views', join(__dirname, 'views'))
app.set('view engine', 'ejs')

app.use(express.static(join(__dirname,'public')))

app.use(express.urlencoded({extended:false}));//cambiado para ver si anda bien el formulario. Antes estaba en false
app.use(express.json());


app.use(
    session({
        secret: 'secret',
        resave: true,
        saveUninitialized: true, // Corregido
        cookie: {
            expires: new Date(Date.now() + 518400000),
            maxAge: 518400000
        }
    })
);

app.use(flash());

app.use((req, res, next) => {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  next();
});


const checkSessionMiddleware = (req, res, next) => {
    if (req.session.logueado) {
        return next(); // Continúa si el usuario está logueado
    } else if (req.path === '/login' || req.path === '/cerrarSesion') {
        return next(); // Permite acceso a login y logout
    } else {
        // Si no está logueado, renderiza la página de inicio de sesión
        return res.render('inicio_sesion.ejs', { x: false });
    }
};

// Usa el middleware en todas las rutas
app.use(checkSessionMiddleware);

app.use(indexRoutes)
const puerto = process.env.PORT || 3000;
app.listen(puerto, ()=>{
    console.log('Server is listening on port: '+puerto);
}) //Que la aplicación esté escuchando en el puerto asignado



import connection from './database/db.js'


// function mifuncion(){
//     connection.query('SELECT * FROM usuarios', (error,usuarios) =>{
//         if(error){
//             console.log(error);
//         }else{
//             console.log("Base de datos conectada");
//         }
//     });
// };
// mifuncion();