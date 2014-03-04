var logWriter = function (fs) {
    function erfunc(destination, errorString) {
        var _dest = ((arguments.length > 1) || (destination.indexOf('.txt') > 0)) ? destination : 'log.txt';
        var _error = (arguments.length > 1) ? errorString : arguments[0];
        fs.open(_dest, "a", 0644, function (err, file_handle) {
            if (!err) {
                var date = new Date();
                var res = "-------------------------------------------------------------------------------------\r\n"
                    + date + " ---- " + _error + "\r\n"
                    + "-------------------------------------------------------------------------------------\r\n";

                fs.write(file_handle, res, null, 'utf8', function (err, written) {
                    if (!err) {
                        fs.close(file_handle);
                    } else {
                        console.log(err)// Произошла ошибка при записи
                    }
                });
            } else {
                // Обработка ошибок при открытии
            }
        });
    }
    return {
        log: erfunc
    }
}
module.exports = logWriter;