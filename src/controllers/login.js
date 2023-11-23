import database from '../database/db.js'
import express from 'express'

const login = (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
  
    database.query('SELECT * FROM usuarios WHERE usuario = ? AND contraseña = ?', [username, password], (err, rows) => {
      if (err) {
        res.send(err);
      } else if (rows.length === 0) {
        res.render("inicio_sesion", {"x": true});
      } else {
        const privilegio = rows[0].privilegio;
        if (privilegio === 1) {
          req.session.loggedImAdmin = true;
        } else {
          req.session.loggedImAdmin = false;
        }
        res.redirect('/estadistica');
      }
    });
  };
  export default login;
