import database from '../database/db.js'
import express from 'express'

const login = (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
  
    database.query('SELECT * FROM usuarios WHERE usuario = ? AND contraseña = ?', [username, password], (err, rows) => {
      if (err) {
        alert("Error al conectarse con la base de datos");
        res.send(err);
      } else if (rows.length === 0) {
        res.render("inicio_sesion", {"x": true});
      } else {
        req.session.logueado=true;
        const privilegio = rows[0].privilegio;
        if (privilegio === 1) {
          req.session.loggedImAdmin = true;
        } else {
          req.session.loggedImAdmin = false;
        }
        req.session.userName = username;
        res.redirect('/estadistica');
      }
    });
  };
  const logout = (req,res) => {
    req.session.destroy(()=>{
      res.redirect('/');
    });
  }

  export default
  {
    login,
    logout,

  } 
