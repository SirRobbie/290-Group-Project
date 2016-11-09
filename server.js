/*
 * Here, you should write a simple server to serve files statically.
 */

var path = require('path');

var staticDir = path.join(__dirname, 'public');
var indexFilename = 'index.html';
var notFoundFilename = '404.html';
var port = process.env.PORT || 3000;

var http = require('http');
var url = require('url');
var fs = require('fs');

function handleRequest(request, response){
	
	var uri = url.parse(request.url).pathname, filename = path.join(staticDir, uri);
	
	fs.exists(filename, function(exists){
		if(!exists){
			filename = path.join(staticDir, '//404.html');
			fs.readFile(filename, "binary", function(err, file){
				if(err){
					response.writeHead(500, {"Content-Type": "text/plain"});
					response.write(err + "\n");
					response.end();
					return;
				}
				response.writeHead(404, {"Content-Type": "text/html"});
				response.write(file, "binary");
				response.end();
				return;
			});
		}
		else{
			
			if(fs.statSync(filename).isDirectory()){filename += '/index.html';}
		
			fs.readFile(filename, "binary", function(err, file){
				if(err){
					response.writeHead(500, {"Content-Type": "text/plain"});
					response.write(err + "\n");
					response.end();
					return;
				}
			response.writeHead(200);
			response.write(file, "binary");
			response.end();
			});
		}
		
	});
}

var server = http.createServer(handleRequest);

server.listen(port);
