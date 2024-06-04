const { validateToken } = require("../services/authentication");

//edi oka middleware prathi function token check chesthadi
function checkForAuthenticationCookie(cookiename) {
  return (req, res, next) => {
    const tokencookievalue = req.cookies[cookiename]
    if (!tokencookievalue) {
      return next();
    }
    try {
      const userpayload = validateToken(tokencookievalue);
      //antha correct ga ney untey simle ga nuvvu 
      req.user = userpayload;
    } catch (error) { }
    return next();
  }
}

module.exports = {
  checkForAuthenticationCookie,
};


