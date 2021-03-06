import GoogleLogin from './components/GoogleLogin';
import { createCallbackHandler, redirectHandler } from './handlers';

/* eslint-disable indent */
const createTableQuery = (
`create table if not exists auth_google (
	user_id int(11) not null auto_increment,
	google_id varchar(50) not null,
	primary key (user_id)
) engine=InnoDB default charset=utf8 collate=utf8_unicode_ci;`
);
/* eslint-enable indent */

export default function authGooglePlugin(omni) {
	omni.mysql.query(createTableQuery)
		.then(result => {
			if (result.warningCount === 0) {
				console.info('Created auth_google table');
			}
		});

	omni.auth.addProvider('google', GoogleLogin, userId => new Promise((resolve, reject) => {
		omni.mysql.query('SELECT google_id FROM auth_google WHERE user_id = ?', [userId])
			.then(([row]) => {
				if (!row) throw new Error(`Can't find user with id ${userId}`);
				resolve(row.google_id);
			})
			.catch(reject);
	}));

	omni.app.get('/auth/google', redirectHandler);
	omni.app.get('/auth/google/callback', createCallbackHandler(omni));
}
