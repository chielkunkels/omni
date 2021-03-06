import createSelect from './createSelect';

export default function createInsert(pool) {
	return (table, data) => new Promise((resolve, reject) => {
		pool.getConnection((err, conn) => {
			if (err) {
				return reject(err);
			}

			const query = `INSERT INTO ${table} SET ?`;
			conn.query(query, data, (err, result) => {
				conn.release();
				if (err) {
					return reject(err);
				}

				createSelect(pool)('user', result.insertId)
					.then(rows => resolve({ ...rows[0] }))
					.catch(reject);
			});
		});
	});
}
