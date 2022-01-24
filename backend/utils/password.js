const passwordValidator = require('password-validator')

let passwordSchema = new passwordValidator()

passwordSchema
.is().min(8)                                    // Minimum length 8
.is().max(100)                                  // Maximum length 100
.has().uppercase()                              // Must have uppercase letters
.has().lowercase()                              // Must have lowercase letters
.has().digits(1)                                // Must have at least 1 digit
.is().not().oneOf(['Passw0rd', 'Password123'])  // Blacklist these values

module.exports = passwordSchema