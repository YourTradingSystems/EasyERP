define(
    function () {
        var phoneRegExp = /^[\+0-9]{0,1}[0-9]+$/,
            nameRegExp = /^[A-zА-я]+-?[A-zА-я]+$/;

        var validatePhone = function(validatedString){
            return phoneRegExp.test(validatedString);
        }

        var validateName = function(validatedString){
            return nameRegExp.test(validatedString);
        }

        return {
            validPhone: validatePhone,
            validName: validateName
        }
    });
