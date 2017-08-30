var path = require('path');
var exec = require('child_process').exec;
var ProgressBar = require('ascii-progress');
var build;
var server;
var isRunning = false;
console.log('=====================================================');
console.log('Building the client with ng build (output in dist)...');
console.log('=====================================================');
var bar = new ProgressBar({
    schema: ':elapseds.green [:bar.green.bgBlue] :percent.green :elapseds.green'
});
bar.update(0);
// Two watchers are set up
// 1. ng here watching the src files and rebuilding as necessary
// 2. In the server/index.js file to listen to the dist folder and refreshing the browser
if (process.cwd().search('client') !== -1) {
    build = exec('ng build --watch');
} else {
    process.chdir(path.join(__dirname, 'client'));
    build = exec('ng build --watch');
}
build.stderr.on('data', (data) => {
    bar.tick(data.substr(0, data.search('%')));
})
build.stdout.on('data', (data) => {
    process.chdir(path.join(__dirname));
    // The ng watcher invokes this listener over and over again
    // So let's not try to restart the server over and over!
    if (!isRunning) {
        console.log(data);
        console.log('=====================================================');
        console.info('     Starting server and opening in browser...');
        console.log('=====================================================');
        var server = exec('node ./server/index.js');
        server.stderr.on('data', (data) => console.log(data));
        server.stdout.on('data', (data) => console.log(data));
        isRunning = true;
    }
});
process.on('close', () => process.kill(build.pid))