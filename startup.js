var exec = require('child_process').exec;
var child = exec('cd client && ng build && cd ..');
child.stdout.on('data', function(data) {
    console.log(data);
});
child.stderr.on('data', function(data) {
    console.log(data);
});
