define(
    function () {
        var phoneRegExp = /^[\+0-9][0-9-\s]+[0-9]+$/,
            intNumberRegExp = /[0-9]+/,
            //forbiddenChars = /[^><]/,
            nameRegExp = /^[A-zА-я]+[A-zА-я0-9-'\s]+[A-zА-я0-9]+$/,
            streetRegExp = /^[A-zА-я][A-zА-я0-9-,\s\.\/]+[A-zА-я0-9]+$/,
            moneyAmountRegExp = /^[0-9]{1,9}\.?[0-9]{0,2}$/,
            loggedRegExp = /^[0-9]{1,9}\.?[0-9]?$/;

        var validatePhone = function(validatedString){
            return phoneRegExp.test(validatedString);
        }

        var validateName = function(validatedString){
            return nameRegExp.test(validatedString);
        }

        var validateStreet = function(validatedString){
            return streetRegExp.test(validatedString);
        }

        var validateLoggedValue = function(validatedString){
            return loggedRegExp.test(validatedString);
        }

        var validateNumber = function(validatedString){
            return intNumberRegExp.test(validatedString);
        }

        var validateMoneyAmount = function(validatedString){
            return moneyAmountRegExp.test(validatedString);
        }

        var validDate = function(validatedString){
            return new Date(validatedString).getMonth() ? true : false;
        }

        var errorMessages = {
            nameError: "field contains some special characters. Only letters and numbers are allowed",
            notNumberMsg: "field should contain a valid integer value",
            loggedNotValid: "field should contain a valid decimal value with max 1 digit after dot"
        }


        return {
            validLoggedValue: validateLoggedValue,
            errorMessages: errorMessages,
            validNumber: validateNumber,
            validStreet: validateStreet,
            validDate: validDate,
            validPhone: validatePhone,
            validName: validateName,
            validMoneyAmount: validateMoneyAmount
        }
    });
