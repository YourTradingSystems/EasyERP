define(
    function () {
        var phoneRegExp = /^[\+0-9]{0,1}[0-9]+$/,
            intNumberRegExp = /[0-9]+/,
            nameRegExp = /^[A-zА-я]+-?[A-zА-я]+$/,
            streetRegExp = /^[A-zА-я]\s\.[A-zА-я0-9-,\/]{0,20}[A-zА-я0-9]+$/,
            moneyAmountRegExp = /^[0-9]{1,9}\.?[0-9]{0,2}$/;

        var validatePhone = function(validatedString){
            return phoneRegExp.test(validatedString);
        }

        var validateName = function(validatedString){
            return nameRegExp.test(validatedString);
        }

        var validateStreet = function(validatedString){
            return streetRegExp.test(validatedString);
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

        return {
            validNumber: validateNumber,
            validStreet: validateStreet,
            validDate: validDate,
            validPhone: validatePhone,
            validName: validateName,
            validMoneyAmount: validateMoneyAmount
        }
    });
