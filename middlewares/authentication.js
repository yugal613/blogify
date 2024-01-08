const { validateToken } = require("../Services/authentication");

function checkForAuthenticationCookie(cookieName) {
    return (req, resp, next) => {
        const tokencookievalue = req.cookies[cookieName];
        if (!tokencookievalue) {
            return next();
        }

        try {
            const userpayload = validateToken(tokencookievalue);
            req.user = userpayload;
        } catch (error) { }
        return next();
    };
}


module.exports = {
    checkForAuthenticationCookie,
}