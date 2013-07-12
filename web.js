var express = require('express');

var app = express.createServer(express.logger());

app.get('/', function(request, response) {
<<<<<<< HEAD
  response.send('Hello World2!');
=======
  response.send('Hello World!');
>>>>>>> 950a10a7020a48cbdbf62b1311f5dd0c768c3675
});

var port = process.env.PORT || 5000;
app.listen(port, function() {
  console.log("Listening on " + port);
<<<<<<< HEAD
});
=======
});
>>>>>>> 950a10a7020a48cbdbf62b1311f5dd0c768c3675
