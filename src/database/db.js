
import mysql2 from 'mysql2';
const connection = mysql2.createPool({
	host: 'localhost',
	user: 'tito_user',
	password: '42530953!Facund0',
	database: 'transporte_tito',
	dateStrings: true // ← ESTA LÍNEA resuelve todo
	// host: 'biughjwhbdg2q0yrwblg-mysql.services.clever-cloud.com',
	// user: 'umzfvpwgo5uu9npw',
	// password: 'BEcIMMtlk17QUIstuw9p',
	// database: 'biughjwhbdg2q0yrwblg'
});
export default connection;


