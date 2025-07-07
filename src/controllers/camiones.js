import connection from "../database/db.js";

// Crear un nuevo camión
const saveCamion = (req, res) => {
    const { desmovil, patmovil, pacmovil } = req.body;

    if (!desmovil || !patmovil) {
        return res.status(400).json({ success: false, error: "Faltan datos obligatorios." });
    }

    const camionData = {
        desmovil,
        patmovil,              // Patente del camión
        pacmovil: pacmovil || null // Patente del chasis (puede ser null)
    };

    connection.query('INSERT INTO moviles SET ?', camionData, (error, results) => {
        if (error) {
            console.error("Error al guardar el camión:", error);
            return res.status(500).json({ success: false, error: "Error al guardar el camión." });
        }

        res.redirect('/camiones');
    });
};

// Actualizar un camión existente
const updateCamion = (req, res) => {
    const { nummovil, desmovil, patmovil, pacmovil } = req.body;

    if (!nummovil || !desmovil || !patmovil) {
        return res.status(400).json({ success: false, error: "Faltan datos obligatorios." });
    }

    const camionData = {
        desmovil,
        patmovil,              // Patente del camión
        pacmovil: pacmovil || null
    };

    connection.query('UPDATE moviles SET ? WHERE nummovil = ?', [camionData, nummovil], (error, results) => {
        if (error) {
            console.error("Error al actualizar el camión:", error);
            return res.status(500).json({ success: false, error: "Error al actualizar el camión." });
        }

        res.redirect('/camiones');
    });
};

// Eliminar un camión
const eliminarCamion = (req, res) => {
    const { nummovil } = req.body;

    if (!nummovil) {
        return res.status(400).json({ success: false, error: "ID del camión no recibido." });
    }

    connection.query('DELETE FROM moviles WHERE nummovil = ?', [nummovil], (error, results) => {
        if (error) {
            console.error("Error al eliminar el camión:", error);
            return res.status(500).json({ success: false, error: "Error al eliminar el camión." });
        }

        res.redirect('/camiones');
    });
};

export default {
    saveCamion,
    updateCamion,
    eliminarCamion,
};
