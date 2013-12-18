define(
    function () {
        var phoneRegExp = /^[0-9\+]?([0-9-\s()])+[0-9()]$/,
            intNumberRegExp = /[0-9]+/,
            nameRegExp = /^[A-Za-zА-Яа-я0-9]+[A-Za-zА-Яа-я0-9-'\s()\+!@#&]+/,
            invalidCharsRegExp = /[~<>\^\*₴]/,
            countryRegExp = /[a-zA-Zа-яА-Я\s-]+/,
            zipRegExp = /[a-zA-Zа-яА-Я0-9\s-]+/,
            streetRegExp = /^[a-zA-Zа-яА-Я0-9][a-zA-Zа-яА-Я0-9-,\s\.\/]+$/,
            moneyAmountRegExp = /^([0-9]{1,9})\.?([0-9]{1,2})?$/,
            emailRegExp = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            loggedRegExp = /^([0-9]{1,9})\.?([0-9]{1,2})?$/;
        var MIN_LENGTH = 2;

        var validateEmail = function(validatedString){
            return emailRegExp.test(validatedString);
        }

        var validateZip = function(validatedString){
            return zipRegExp.test(validatedString);
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

        var validateCountryName = function(validatedString){
            return countryRegExp.test(validatedString);
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

        var hasInvalidChars = function(validatedString){
            return invalidCharsRegExp.test(validatedString);
        }

        var errorMessages = {
            invalidNameMsg: "field value is incorrect. It should start with letter or number",
            notNumberMsg: "field should contain a valid integer value",
            invalidCountryMsg: "field should contain only letters, whitespaces and '-' sign",
            loggedNotValid: "field should contain a valid decimal value with max 1 digit after dot",
            minLengthMsg: "field should be at least " + MIN_LENGTH + " characters long",
            invalidMoneyAmountMsg: "field should contain a number with max 2 digits after dot",
            invalidEmailMsg: "field should contain a valid email address",
            requiredMsg: "field can not be empty",
            invalidCharsMsg: "field can not contain '~ < > ^ * ₴' signs",
            invalidStreetMsg: "field can contain only letters, numbers and '. , - /' signs",
            invalidPhoneMsg: "field should contain only numbers and '+ - ( )' signs",
            invalidZipMsg: "field should contain only letters, numbers and '-' sing"
        }

        var checkNameField = function(errorArray, required, fieldValue, fieldName){
            if(required){
                if(!fieldValue){
                    errorArray.push([fieldName, errorMessages.requiredMsg].join(' '));
                    return;
                }
                if(hasInvalidChars(fieldValue)) {
                    errorArray.push([fieldName, errorMessages.invalidCharsMsg].join(' '));
                    return;
                }
                if(fieldValue.length < 2) {
                    errorArray.push([fieldName, errorMessages.minLengthMsg].join(' '));
                    return;
                }
                if(!validateName(fieldValue)) errorArray.push([fieldName, errorMessages.invalidNameMsg].join(' '));
            } else{
                if(fieldValue){
                    if(hasInvalidChars(fieldValue)) {
                        errorArray.push([fieldName, errorMessages.invalidCharsMsg].join(' '));
                        return;
                    }
                    if(!validateName(fieldValue)) errorArray.push([fieldName, errorMessages.invalidNameMsg].join(' '));
                }
            }
        }

        var checkPhoneField = function(errorArray, required, fieldValue, fieldName){
            if(required){
                if(!fieldValue){
                    errorArray.push([fieldName, errorMessages.requiredMsg].join(' '));
                    return;
                }
                if(hasInvalidChars(fieldValue)) {
                    errorArray.push([fieldName, errorMessages.invalidCharsMsg].join(' '));
                    return;
                }
                if(!validatePhone(fieldValue)) errorArray.push([fieldName, errorMessages.invalidPhoneMsg].join(' '));
            } else {
                if(fieldValue){
                    if(hasInvalidChars(fieldValue)) {
                        errorArray.push([fieldName, errorMessages.invalidCharsMsg].join(' '));
                        return;
                    }
                    if(!validatePhone(fieldValue)) errorArray.push([fieldName, errorMessages.invalidPhoneMsg].join(' '));
                }
            }
        }

        var checkCountryCityStateField = function(errorArray, required, fieldValue, fieldName){
            if(required){
                if(!fieldValue){
                    errorArray.push([fieldName, errorMessages.requiredMsg].join(' '));
                    return;
                }
                if(hasInvalidChars(fieldValue)) {
                    errorArray.push([fieldName, errorMessages.invalidCharsMsg].join(' '));
                    return;
                }
                if(!validateCountryName(fieldValue)) errorArray.push([fieldName, errorMessages.invalidCountryMsg].join(' '));
            } else {
                if(fieldValue){
                    if(hasInvalidChars(fieldValue)) {
                        errorArray.push([fieldName, errorMessages.invalidCharsMsg].join(' '));
                        return;
                    }
                    if(!validateCountryName(fieldValue)) errorArray.push([fieldName, errorMessages.invalidCountryMsg].join(' '));
                }
            }
        }

        var checkZipField = function(errorArray, required, fieldValue, fieldName){
            if(required){
                if(!fieldValue){
                    errorArray.push([fieldName, errorMessages.requiredMsg].join(' '));
                    return;
                }
                if(hasInvalidChars(fieldValue)) {
                    errorArray.push([fieldName, errorMessages.invalidCharsMsg].join(' '));
                    return;
                }
                if(!validateZip(fieldValue)) errorArray.push([fieldName, errorMessages.invalidZipMsg].join(' '));
            } else {
                if(fieldValue){
                    if(hasInvalidChars(fieldValue)) {
                        errorArray.push([fieldName, errorMessages.invalidCharsMsg].join(' '));
                        return;
                    }
                    if(!validateZip(fieldValue)) errorArray.push([fieldName, errorMessages.invalidZipMsg].join(' '));
                }
            }
        }

        var checkStreetField = function(errorArray, required, fieldValue, fieldName){
            if(required){
                if(!fieldValue){
                    errorArray.push([fieldName, errorMessages.requiredMsg].join(' '));
                    return;
                }
                if(hasInvalidChars(fieldValue)) {
                    errorArray.push([fieldName, errorMessages.invalidCharsMsg].join(' '));
                    return;
                }
                if(!validateStreet(fieldValue)) errorArray.push([fieldName, errorMessages.invalidStreetMsg].join(' '));
            } else {
                if(fieldValue){
                    if(hasInvalidChars(fieldValue)) {
                        errorArray.push([fieldName, errorMessages.invalidCharsMsg].join(' '));
                        return;
                    }
                    if(!validateStreet(fieldValue)) errorArray.push([fieldName, errorMessages.invalidStreetMsg].join(' '));
                }
            }
        }

        var checkEmailField = function(errorArray, required, fieldValue, fieldName){
            if(required){
                if(!fieldValue){
                    errorArray.push([fieldName, errorMessages.requiredMsg].join(' '));
                    return;
                }
                if(hasInvalidChars(fieldValue)) {
                    errorArray.push([fieldName, errorMessages.invalidCharsMsg].join(' '));
                    return;
                }
                if(!validateEmail(fieldValue)) errorArray.push([fieldName, errorMessages.invalidEmailMsg].join(' '));
            } else {
                if(fieldValue){
                    if(hasInvalidChars(fieldValue)) {
                        errorArray.push([fieldName, errorMessages.invalidCharsMsg].join(' '));
                        return;
                    }
                    if(!validateEmail(fieldValue)) errorArray.push([fieldName, errorMessages.invalidEmailMsg].join(' '));
                }
            }
        }

        var checkNotesField = function(errorArray, required, fieldValue, fieldName){
            if(required){
                if(!fieldValue){
                    errorArray.push([fieldName, errorMessages.requiredMsg].join(' '));
                    return;
                }
                if(hasInvalidChars(fieldValue)) {
                    errorArray.push([fieldName, errorMessages.invalidCharsMsg].join(' '));
                    return;
                }
            } else {
                if(fieldValue){
                    if(hasInvalidChars(fieldValue)) {
                        errorArray.push([fieldName, errorMessages.invalidCharsMsg].join(' '));
                        return;
                    }
                }
            }
        }
        return {
            checkNotesField:checkNotesField,
            checkEmailField:checkEmailField,
            checkStreetField:checkStreetField,
            checkZipField:checkZipField,
            checkCountryCityStateField:checkCountryCityStateField,
            checkPhoneField:checkPhoneField,
            checkNameField:checkNameField,
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
