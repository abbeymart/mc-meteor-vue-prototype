/**
 * Created by abbeymart on 2016-02-20.
 * MySQL connection configuration and activation
 */

import * as  mysql from 'mysql';

const connection = mysql.createConnection( {
    host    : 'localhost',
    user    : 'root',
    password: 'root',
    port    : 8889,
    database: 'mcdev',
} );

connection.connect( ( err ) => {
    if ( err ) {
        console.error( 'error connecting to mySQL DB: ' + err.stack );
        return;
    }
    console.log( 'Connected to mySQL DB at thread id ' + connection.threadId );
} );
