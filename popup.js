(function() {
    console.log(document);
    console.log('Body: ', document.body);
    var port = 1234;
    var livereload = document.createElement('script');
    livereload.type = 'text/javascript';
    livereload.src = 'http://' + (location.host || 'localhost').split(':')[0] + ':' + port + '/livereload.js?snipver=1';
    document.body.appendChild(livereload);
})();
