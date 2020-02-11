import {exec} from 'child_process';
import {env} from 'config/env';

const {database} = env;

exec(`psql -h ${database.host} -U ${database.user} -p ${database.port} -a -q -f src/scripts/db_prepare.sql`, error => {
    if (error) {
        console.error(`error: ${error} `);
    } else {
        console.log('success');
    }
});
