const getPrivilegeLevel = (req) => {
    // Obtiene el nombre de usuario de la sesión
    const username = req.session.username;
  
    connection.query('SELECT privilegio FROM usuarios WHERE usuario = ?', [username], (err, rows) => {
      if (err) {
        res.send(err);
      } else {
        if (rows.length === 0) {
          res.sendStatus(401);
        } else {
          // Obtiene el nivel de privilegio del usuario
          const privilegeLevel = rows[0].privilegio;
  
          // Devuelve el nivel de privilegio del usuario
          res.send(privilegeLevel);
        }
      }
    });
  };
  
  function visibilidad_gestion_mantenimiento(){
    // Obtiene el nivel de privilegio del usuario
    const privilegeLevel = getPrivilegeLevel();

// Obtiene la referencia a la clase gestion__mantenimiento
    var gestionMantenimiento = document.querySelector('#gestion_mantenimiento');

// Oculta la clase si el nivel de privilegio es 0
    if (privilegeLevel === 0) {
        console.log('Sin privilegio');
        gestionMantenimiento.style.display = 'none';
    }else{
        console.log('privilegio');
    }
}
visibilidad_gestion_mantenimiento();