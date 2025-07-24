import database from '../database/db.js';
import express from 'express';

const login = (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  database.query(
    'SELECT * FROM usuarios WHERE usuario = ? AND contraseña = ?',
    [username, password],
    (err, rows) => {
      if (err) {
        console.error("Error en la base de datos:", err);
        return res.render('inicio_sesion', { error: 'Error en el servidor, intente más tarde.' });
      }

      if (rows.length === 0) {
        console.log("Datos incorrectos");
        return res.render('inicio_sesion', { error: 'Usuario o contraseña incorrectos.' });
      }

      // Si todo está bien, continuar con la sesión
      req.session.userName = username;
      req.session.logueado = true;

      const privilegio = rows[0].privilegio;

      if (privilegio === 'Gestor') {
        req.session.gestor = true;
        req.session.deposito = false;
        req.session.administracion = false;
        return res.redirect('/depositos');
      } else if (privilegio === 'Depósito') {
        req.session.gestor = false;
        req.session.deposito = true;
        req.session.administracion = false;
        return res.redirect('/depositos');
      } else if (privilegio === 'Administración') {
        req.session.gestor = false;
        req.session.deposito = false;
        req.session.administracion = true;
        return res.redirect('/depositos');
      }
    }
  );
};

const logout = (req, res) => {
  req.session.destroy(() => {
    res.redirect('/');
  });
};

export default {
  login,
  logout,
};
