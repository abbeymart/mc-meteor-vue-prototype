/**
 * Created by abbeymart on 2017-08-01
 */
// load email package for sending emails
const email = require( "emailjs" );

// setup smtp server settings
const server = email.server.connect( {
    user    : "support@ab9.net",
    password: "ab12support",
    host    : "gator3274.hostgator.com",
    port    : 465,
    ssl     : true
} );

export default function( from = "mConnect <support@ab9.net>", to = "someone <someone@your-email.com>", cc = "else <else@your-email.com>", subject = "Trade Information", messageBody = "I hope it works", mailType = "html" ) {

    // TODO: check / validate inputs

    // text message
    if( mailType === 'text' ) {
        // send the message and get a callback with an error or details of the message that was sent
        server.send( {
            text   : messageBody,
            from   : from,
            to     : to,
            cc     : cc,
            subject: subject,
        }, function( err, message ) {
            console.log( err || message );
        } );
    }

    // HTML message
    if( mailType === 'html' ) {
        const message = {
            text   : messageBody,
            from   : from,
            to     : to,
            cc     : cc,
            subject: subject,
            attachment:
                [
                    { data: "<html>i <i>hope</i> it works!</html>", alternative: true },
                    // { path: "path/to/file.zip", type: "application/zip", name: "renamed.zip" } // optional
                ]
        };

        // send the message and get a callback with an error or details of the message that was sent
        server.send( message, function( err, message ) {
            console.log( err || message );
        } );

        // you can continue to send more messages with successive calls to 'server.send',
        // they will be queued on the same SMTP connection

        // or you can create a new server connection with 'email.server.connect'
        // to asynchronously send individual emails instead of a queue

    }
}
