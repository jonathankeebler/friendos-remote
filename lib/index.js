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
    this.license = user_settings.license;

    this.root_directory = process.cwd();
}

FriendOS.prototype.test_modules = function(directory, next)
{
    fs.readdir(directory, function(err, files)
    {
        if(err) return next(err);

        function test_file(err)
        {
            if(err)
            {
                next(err);
                return;
            }
            else if(files.length == 0)
            {
                next();
                return;
            }
            
            var file = files.pop();

            var script = null;
            
            try
            {
                script = require(directory + file);
            }
            catch(err)
            {
                test_file(err);
            }

            if(!script) return;

            var functions = [];

            Object.keys(script).forEach(function(key)
            {
                var element = script[key];

                if(typeof element == "function")
                {
                    functions.push(element);
                }
                else if(Array.isArray(element))
                {
                    element.forEach(function(element)
                    {
                        if(typeof element == "function")
                        {
                            functions.push(element);
                        }
                    });
                }
            });

            function run_script(out)
            {
                if(functions.length == 0)
                {
                    test_file();
                }
                else
                {
                    var script = functions.pop();
                    try
                    {
                        var timeout = setTimeout(function()
                        {
                            test_file(new Error(file + ": Function took too long to execute: " + script.toString() ));
                        }, 5000);

                        script.call({
                            profile: {},
                            pass: pass_fail,
                            fail: pass_fail
                        });

                        function pass_fail(out)
                        {
                            clearTimeout(timeout);
                            run_script(out);
                        }
                    }
                    catch(err)
                    {
                        test_file(err);
                    }
                }
            }

            run_script();
        }

        test_file();
    });
};

FriendOS.prototype.start = function(next)
{
    if(!next)
    {
        next = function(err)
        {
            if(err)
            {
                console.log(err);
            }
        };
    }

    console.log("Validating configuration...");
    this.valid_configuration(function(err)
    {
        if(err)
        {
            return next(err);
        }

        console.log("Testing Library scripts...");
        this.test_modules(this.root_directory + "/library/", function(err)
        {
            if(err) return next(err);

            console.log("Testing Starter scripts...");
            this.test_modules(this.root_directory + "/starters/", function(err)
            {
                if(err) return next(err);

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
                                proxyReq.setHeader('X-License', this.license);
                            }.bind(this));

                            proxy.on('error', function(err) {
                                console.log(err);
                            }.bind(this));

                            console.log("Listening on port " + this.port);
                            
                        }

                    }.bind(this));

                }.bind(this));

            }.bind(this));

        }.bind(this));

                
    }.bind(this));
    
};

FriendOS.prototype.upload = function(next)
{
    var request = require("superagent");
    request
        .post(this.remote + "/remotes/")
        .set("X-License", this.license)
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
    var temp_dir = __dirname + "/../data";
    if (!fs.existsSync(temp_dir))
    {
        fs.mkdirSync(temp_dir);
    }

    var output = fs.createWriteStream(temp_dir + '/archive.zip');
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

    archive.file(this.root_directory + '/intents.csv', {name: "intents.csv"});
    archive.directory(this.root_directory + '/library/', "/library/");
    archive.directory(this.root_directory + '/starters/', "/starters/");

    fs.readdir(this.root_directory + '/node_modules/', function(err, files)
    {
        if(err)
        {
            return next(err);
        }

        function zip_file()
        {
            if(!files || files.length == 0)
            {
                return archive.finalize();
            }

            var file = files.pop();
            if(file == "friendos-remote")
            {
                return zip_file.call(this);
            }

            archive.directory(this.root_directory + '/node_modules/' + file, "/node_modules/" + file );
            zip_file.call(this);
        }

        zip_file.call(this);
    }.bind(this));
}

FriendOS.prototype.valid_configuration = function(next)
{
    if(!this.license)
    {
        return next(new Error("You must set a valid license key"));
    }

    fs.exists(this.root_directory + "/library/", function(exists)
    {
        if(!exists)
        {
            return next(new Error("No library was passed"));
        }
        else
        {
            fs.exists(this.root_directory + "/starters/", function(exists)
            {
                if(!exists)
                {
                    return next(new Error("No starters were passed"));
                }
                else
                {
                    fs.exists(this.root_directory + "/intents.csv", function(exists)
                    {
                        if(!exists)
                        {
                            return next(new Error("No intents were passed"));
                        }
                        else
                        {
                            return next();
                        }
                    });
                }
            }.bind(this));
        }
    }.bind(this));
}


module.exports = FriendOS;