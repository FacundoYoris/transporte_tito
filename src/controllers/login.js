import database from '../database/db.js'
import express from 'express'

const login = (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
  
    database.query('SELECT * FROM usuarios WHERE usuario = ? AND contraseña = ?', [username, password], (err, rows) => {
      if (err) {
        res.send(err);
      } else if (rows.length === 0) {
        
        res.redirect('/');
      } else {
        const privilegio = rows[0].privilegio;
        req.session.loggedImAdmin = false;
        if (privilegio === 1) {
          req.session.loggedImAdmin = true;
          console.log("VERDADEROOOOOO");
        } else {
          req.session.loggedImAdmin = false;
            
          console.log("FALSOOOOOOOOOOO");
        }
        
        res.redirect('/estadistica');
      }
    });
  };


    
  export default login;
