(function () {

    var log4js = require('log4js');

    log4js.configure({
          appenders:[
            {type:'console'},
            {type:'dateFile', filename: 'logs/log.js', category: 'app'}
          ],
          replaceConsole: true,
        });
        var log = log4js.getLogger('app');

    module.exports = log;

}());
