/**
 * Created by abbeymart on 2016-08-28.
 * Email templates for user communication
 */

Accounts.emailTemplates.siteName = "mConnect";
Accounts.emailTemplates.from = "mConnect <support@ab9.net>";

Accounts.emailTemplates.verifyEmail = {
    subject() {
        return "[mConnect] Verify Your Email Address";
    },
    text( user, url ) {
        let emailAddress   = user.emails[ 0 ].address,
            urlWithoutHash = url.replace( '#/', '' ),
            supportEmail   = "support@ab9.net",
            emailBody      = `To verify your email address (${emailAddress}), visit the following link:\n\n${urlWithoutHash}\n\n. If you did not request this verification, please ignore this email. If you feel something is wrong, please contact our support team: ${supportEmail}.\n\n\n Regards,\n mConnect Support.`;
        return emailBody;
    }
};

Accounts.emailTemplates.resetPassword = {
    subject() {
        return "[mConnect] Reset/Change Your Password";
    },
    text( user, url ) {
        let emailAddress   = user.emails[ 0 ].address,
            urlWithoutHash = url.replace( '#/', '' ),
            supportEmail   = "support@ab9.net",
            emailBody      = `To reset password for your account / email address (${emailAddress}), visit the following link:\n\n${urlWithoutHash}\n\n. If you did not request the password reset, please ignore this email. If you feel something is wrong, please contact our support team: ${supportEmail}.\n\n\n Regards,\n mConnect Support.`;
        return emailBody;
    }
};

Accounts.emailTemplates.paidOrder = {
    subject() {
        return "[orderNumber] Order & Payment Completed";
    },
    text( user, url ) {
        let emailAddress   = user.emails[ 0 ].address,
            urlWithoutHash = url.replace( '#/', '' ),
            supportEmail   = "support@ab9.net",
            emailBody      = `To reset password for your account / email address (${emailAddress}), visit the following link:\n\n${urlWithoutHash}\n\n. If you did not request the password reset, please ignore this email. If you feel something is wrong, please contact our support team: ${supportEmail}.\n\n\n Regards,\n mConnect Support.`;
        return emailBody;
    }
};

Accounts.emailTemplates.invoiceOrder = {
    subject() {
        return "[orderNumber] Order Requisition & Invoice";
    },
    text( user, url ) {
        let emailAddress   = user.emails[ 0 ].address,
            urlWithoutHash = url.replace( '#/', '' ),
            supportEmail   = "support@ab9.net",
            emailBody      = `To reset password for your account / email address (${emailAddress}), visit the following link:\n\n${urlWithoutHash}\n\n. If you did not request the password reset, please ignore this email. If you feel something is wrong, please contact our support team: ${supportEmail}.\n\n\n Regards,\n mConnect Support.`;
        return emailBody;
    }
};

Accounts.emailTemplates.cancelOrder = {
    subject() {
        return "[orderNumber] Order Cancelled";
    },
    text( user, url ) {
        let emailAddress   = user.emails[ 0 ].address,
            urlWithoutHash = url.replace( '#/', '' ),
            supportEmail   = "support@ab9.net",
            emailBody      = `To reset password for your account / email address (${emailAddress}), visit the following link:\n\n${urlWithoutHash}\n\n. If you did not request the password reset, please ignore this email. If you feel something is wrong, please contact our support team: ${supportEmail}.\n\n\n Regards,\n mConnect Support.`;
        return emailBody;
    }
};

Accounts.emailTemplates.cancelOrderItem = {
    subject() {
        return "[orderNumber] Order Item(s) Cancelled";
    },
    text( user, url ) {
        let emailAddress   = user.emails[ 0 ].address,
            urlWithoutHash = url.replace( '#/', '' ),
            supportEmail   = "support@ab9.net",
            emailBody      = `To reset password for your account / email address (${emailAddress}), visit the following link:\n\n${urlWithoutHash}\n\n. If you did not request the password reset, please ignore this email. If you feel something is wrong, please contact our support team: ${supportEmail}.\n\n\n Regards,\n mConnect Support.`;
        return emailBody;
    }
};

Accounts.emailTemplates.returnOrder = {
    subject() {
        return "[orderNumber] Order Item(s) Returned";
    },
    text( user, url ) {
        let emailAddress   = user.emails[ 0 ].address,
            urlWithoutHash = url.replace( '#/', '' ),
            supportEmail   = "support@ab9.net",
            emailBody      = `To reset password for your account / email address (${emailAddress}), visit the following link:\n\n${urlWithoutHash}\n\n. If you did not request the password reset, please ignore this email. If you feel something is wrong, please contact our support team: ${supportEmail}.\n\n\n Regards,\n mConnect Support.`;
        return emailBody;
    }
};

Accounts.emailTemplates.invoicePayment = {
    subject() {
        return "[orderNumber] Payment Made";
    },
    text( user, url ) {
        let emailAddress   = user.emails[ 0 ].address,
            urlWithoutHash = url.replace( '#/', '' ),
            supportEmail   = "support@ab9.net",
            emailBody      = `To reset password for your account / email address (${emailAddress}), visit the following link:\n\n${urlWithoutHash}\n\n. If you did not request the password reset, please ignore this email. If you feel something is wrong, please contact our support team: ${supportEmail}.\n\n\n Regards,\n mConnect Support.`;
        return emailBody;
    }
};
