
import mysql from 'mysql';
const connection = mysql.createPool({
	host: 'localhost',
	user: 'root',
	password: '42530953',
	database: 'innway_sw_mantenimiento'
});
export default connection;
