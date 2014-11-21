var http = require('http'),
	fs = require('fs');

var assetTypes = ['js', 'css', 'json', 'png'];

var CONTENT_TYPE_ASSET = 'asset';
var CONTENT_TYPE_ROUTE = 'route';

function getFileFromPath(path, contentType) {
	var file = "/";

	if (contentType == CONTENT_TYPE_ASSET)
		file += "public/";

	if (path == '/')
		file += "index.html";
	else
		file += path;

	return __dirname + file;
}

function getContentTypeFromPath(path) {
	var extension = path.split('.'),
		extension = extension[extension.length - 1];

	if (assetTypes.indexOf(extension) > -1)
		return CONTENT_TYPE_ASSET;

	return CONTENT_TYPE_ROUTE;
}

var server = http.createServer(function(req, res) {
	var contentType = getContentTypeFromPath(req.url),
		fileToLoad = getFileFromPath(req.url, contentType);


	fs.readFile(fileToLoad, function(err, data){
		if (err) {
			res.writeHead(404);
			res.end(JSON.stringify(err));
			return;
		}
		res.writeHead(200);
		res.end(data);
	});
});

var port = 3000;
server.listen(port, function() {
	console.log('server listening on port ' + port);
});
