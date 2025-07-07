import connection from "../database/db.js";

// Crear un nuevo conductor
const saveConductor = (req, res) => {
    const { nomchof, dnichof, idcamion } = req.body;

    if (!nomchof || !dnichof || !idcamion) {
        return res.status(400).json({ success: false, error: "Faltan datos obligatorios." });
    }

    const conductorData = { nomchof, dnichof, idcamion };

    connection.query('INSERT INTO conductores SET ?', conductorData, (error, results) => {
        if (error) {
            console.error("Error al guardar el conductor:", error);
            return res.status(500).json({ success: false, error: "Error al guardar el conductor." });
        }

        res.redirect('/conductores');
    });
};

// Actualizar un conductor existente
const updateConductor = (req, res) => {
    const { nrochof, nomchof, dnichof, idcamion } = req.body;

    if (!nrochof || !nomchof || !dnichof || !idcamion) {
        return res.status(400).json({ success: false, error: "Faltan datos obligatorios." });
    }

    const conductorData = { nomchof, dnichof, idcamion };

    connection.query('UPDATE conductores SET ? WHERE nrochof = ?', [conductorData, nrochof], (error, results) => {
        if (error) {
            console.error("Error al actualizar el conductor:", error);
            return res.status(500).json({ success: false, error: "Error al actualizar el conductor." });
        }

        res.redirect('/conductores');
    });
};

// Eliminar un conductor
const eliminarConductor = (req, res) => {
    const { nrochof } = req.body;

    if (!nrochof) {
        return res.status(400).json({ success: false, error: "ID del conductor no recibido." });
    }

    connection.query('DELETE FROM conductores WHERE nrochof = ?', [nrochof], (error, results) => {
        if (error) {
            console.error("Error al eliminar el conductor:", error);
            return res.status(500).json({ success: false, error: "Error al eliminar el conductor." });
        }

        res.redirect('/conductores');
    });
};

export default {
    saveConductor,
    updateConductor,
    eliminarConductor,
};
