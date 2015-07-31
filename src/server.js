var http = require('http');
var scraper = require('./scraper');
 
http.createServer(function (req, res) {
  if(req.method == "GET") {
    if(req.url == "/itinerary") {
      res.writeHead(200, {
        'Content-Type': 'text/json',
        'Access-Control-Allow-Origin' : "*"
      });
      res.end(JSON.stringify(scraper.callRequest("http://wap.ratp.fr/siv/itinerary-list?type1=station&name1=nation&type2=station&name2=pyren%C3%A9es&reseau=ferre&traveltype=plus_rapide&datestart=true&datehour=13&dateminute=0")))
    } else {
      res.writeHead(404, "Salut :D");
    }
  }
  res.end()
}).listen(3000);
 
console.log('Server running on port 3000.');