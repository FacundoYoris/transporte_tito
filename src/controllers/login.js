import database from '../database/db.js';
import express from 'express';

const login = (req, res) => {
  // Extraer el nombre de usuario y la contraseña de la solicitud HTTP
  const username = req.body.username;
  const password = req.body.password;

  // Consultar la base de datos para buscar un usuario con el nombre de usuario y la contraseña proporcionados
  database.query('SELECT * FROM usuarios WHERE usuario = ? AND contraseña = ?', [username, password], (err, rows) => {
    // Si hay un error al ejecutar la consulta o si no se encuentra ningún usuario, enviar una respuesta al cliente
    if (err) {
      console.log("Error al conectarse con la base de datos");
      res.send(err);
    } else if (rows.length === 0) {
      // Si no se encuentra ningún usuario, renderizar una vista con un mensaje de error
      res.render("inicio_sesion", {"x": true}); // X en true muestra el cartel de error de inicio de sesión
    } else {
      // Establecer el nombre de usuario en el objeto de sesión
      req.session.userName = username;

      // Si se encuentra un usuario, establecer la sesión como logueada
      req.session.logueado = true;

      // Extraer el nivel de privilegio del primer usuario encontrado en los resultados de la consulta
      const privilegio = rows[0].privilegio;

      // Asignar permisos basados en el nivel de privilegio
      if (privilegio === 1) {
        req.session.loggedImAdmin = true;
        req.session.loggedImOperario = false;
        req.session.loggedImExterno = false;
        res.redirect('/estadistica'); // Redirigir al dashboard de administrador
      } else if (privilegio === 0) {
        req.session.loggedImAdmin = false;
        req.session.loggedImOperario = true;
        req.session.loggedImExterno = false;
        res.redirect('/orden-de-trabajo/pendiente'); // Redirigir a la página de operarios
      } else if (privilegio === 2) {
        req.session.loggedImAdmin = false;
        req.session.loggedImOperario = false;
        req.session.loggedImExterno = true;
        res.redirect('/ordenes-solicitadas'); // Redirigir a la página para usuarios externos
      }
    }
  });
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
