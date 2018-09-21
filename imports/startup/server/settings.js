/**
 * Created by saturnbay on 2015-02-08.
 * Email configuration
 */

// Amazon SES mail-service
const ases = {
    username: 'your-username',
    password: 'your-password',
    server  : 'email-smtp.us-west-2.amazonaws.com',
    port    : 465
};
// Amazon mail-settings
process.env.MAIL_URL = 'smtps://' + encodeURIComponent( ases.username ) + ':' + encodeURIComponent( ases.password ) + '@' + encodeURIComponent( ases.server ) + ':' + ases.port;

// Mailgun mail-service
const smtp = {
    username: 'support@ab9.net',
    password: 'your-password',
    server  : 'gator3274.hostgator.com',
    port    : 465
};
// Mailgun mail-settings
// process.env.MAIL_URL = 'smtps://' + encodeURIComponent( smtp.username ) + ':' + encodeURIComponent( smtp.password ) + '@' + encodeURIComponent( smtp.server ) + ':' + smtp.port;
// process.env.MAIL_URL = "smtps://postmaster%40<your-smtp-address-url>:password@smtp.mailgun.org:587";

// Hostgator mail-service
const hgator = {
    username: 'support@ab9.net',
    password: 'your-password',
    server  : 'gator3274.hostgator.com',
    port    : 465
};
// Hostgator mail-settings
// process.env.MAIL_URL = 'smtps://' + encodeURIComponent( hgator.username ) + ':' + encodeURIComponent( hgator.password ) + '@' + encodeURIComponent( hgator.server ) + ':' + hgator.port;
