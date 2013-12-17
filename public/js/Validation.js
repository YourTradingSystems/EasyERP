define(
    function () {
        var phoneRegExp = /^[\+0-9][0-9-\s]+[0-9]+$/,
            intNumberRegExp = /[0-9]+/,
            startsWithNumberRegExp = /^[0-9]+/,
            nameRegExp = /^[A-Za-zА-Яа-я0-9]+[A-Za-zА-Яа-я0-9-'\s]+[A-Za-zА-Яа-я0-9]+$/,
            streetRegExp = /^[A-zА-я][A-zА-я0-9-,\s\.\/]+[A-zА-я0-9]+$/,
            moneyAmountRegExp = /^[0-9]{1,9}\.?[0-9]{0,2}$/,
            emailRegExp = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            loggedRegExp = /^[0-9]{1,9}\.?[0-9]?$/;
        var MIN_LENGTH = 1;

        var startsWithNumber = function(validatedString){
            return startsWithNumberRegExp.test(validatedString);
        }

        var validateEmail = function(validatedString){
            return emailRegExp.test(validatedString);
        }

        var requiredFieldLength = function(validatedString){
            return validatedString.length >= MIN_LENGTH;
        }

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
            nameError: "field value is incorrect. It should start with a letter and only letters and numbers are allowed",
            notNumberMsg: "field should contain a valid integer value",
            loggedNotValid: "field should contain a valid decimal value with max 1 digit after dot",
            minLengthMsg: "field should be at least " + MIN_LENGTH + " characters long",
            invalidMoneyAmountMsg: "field should contain a number with max 2 digits after dot",
            invalidEmailMsg: "field should contain a valid email address",
            startsWithNumberMsg: "field should start with a letter"
        }


        return {
            startsWithNumber: startsWithNumber,
            validEmail: validateEmail,
            withMinLength: requiredFieldLength,
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
