var FriendOS = require("../lib/index.js");

var app = new FriendOS({
    license: "1dec9dbf-2c8e-4e7d-9bfd-e31936a5d5e1",
    remote: "http://localhost:8888"
});

app.start(function(err)
{
    if(err)
    {
        console.log(err);
    }
}); 