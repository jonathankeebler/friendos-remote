var fs = require('fs'),
    http = require('http'),
    request = require("superagent"),
    archiver = require('archiver'),
    httpProxy = require('http-proxy');

function FriendOS(user_settings)
{
    if(!user_settings) user_settings = {};

    this.remote = user_settings.remote || "http://localhost:8888";
    this.port = user_settings.port || 8000;
}

FriendOS.prototype.start = function(next)
{
    console.log("Creating archive...");
    this.compress(function(err)
    {
        if(err)
        {
            return next(err);
        }

        console.log("Uploading archive...");
        this.upload(function(err, remote_id)
        {
            if(err)
            {
                return next(err);
            }
            else
            {
                console.log("Remote ID: " + remote_id);
                
                console.log("Starting server...");

                var proxy = httpProxy.createProxyServer({target: this.remote}).listen(this.port);
                proxy.on('proxyReq', function(proxyReq, req, res, options) {
                    proxyReq.setHeader('X-Remote', remote_id);
                });

                console.log("Listening on port " + this.port);
                
            }

        }.bind(this));

    }.bind(this));

    
};

FriendOS.prototype.upload = function(next)
{
    var request = require("superagent");
    request
        .post(this.remote + "/remotes/")
        .attach("file", __dirname + "/../data/archive.zip")
        .end(function(err, res)
        {
            if(err)
            {
                next(err);
            }
            else if(!res.body.remote)
            {
                next(new Error("No remote id was returned from server"));
            }
            else
            {
                next(null, res.body.remote);
            }
        }); 
}

FriendOS.prototype.compress = function(next)
{
    var output = fs.createWriteStream(__dirname + '/../data/archive.zip');
    var archive = archiver('zip', {
        zlib: { level: 9 } // Sets the compression level.
    });

    // listen for all archive data to be written
    output.on('close', function() {
        next();
    });

    // good practice to catch this error explicitly
    archive.on('error', function(err) {
        next(err);
    });

    // pipe archive data to the file
    archive.pipe(output);

    archive.directory('library/');
    archive.directory('starters/');

    archive.finalize();
}


module.exports = FriendOS;