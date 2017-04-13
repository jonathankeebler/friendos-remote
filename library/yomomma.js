var request = require("superagent");
    
module.exports = {
	solve: function()
	{	
        var defaultResponse = 'I love my mom!';
        
        request
			.get('http://api.yomomma.info/')
            .set('Accept', 'application/json')
			.end(function(err, res)
			{
                if(err)
                {
                    console.log(err);
                    this.fail({out: defaultResponse});
                } 
                else
                {
                    
                    var json = JSON.parse(res.text);
                    
                    if(json && json.joke)
                    {
                        this.pass({out: json.joke});
                    } 
                    else
                    {
                        this.fail({out: defaultResponse});
                    }
                }
				
			}.bind(this));
    }  
};