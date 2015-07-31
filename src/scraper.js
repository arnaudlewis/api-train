var request = require('request');
var cheerio = require('cheerio');



  var scraper = {
    getTime : function(node) {
    timestr = node.text().replace('(', '').replace(')', '').trim();
    var splitTime = timestr.split(':');
    var time = {
      hours: splitTime[0],
      minutes: splitTime[1]
    } 
    return time;
  },

  getLine : function(node) {
    var splitLine = node.find('img').attr('src').split('/');
    return splitLine[splitLine.length -1].split('_')[0].substr(1);
  },

  generateData : function (walkTime, duration, correspondances) {
    return  {
      nb_correspondances: correspondances.length,
      duration: duration,
      walk_duration: walkTime,
      correspondances: correspondances
    }
  },

  callRequest : function(urlRequest) {
    var options = {
      url: urlRequest,
      headers: {
        'User-Agent': 'hackday',
        'Accept': 'text/html'
      }
    }

    request(options, function (error, response, html) {

      if (!error && response.statusCode == 200) {
        var $ = cheerio.load(html);
        $.fn.ignore = function(sel){
          return this.clone().find(sel||">*").remove().end();
        };

      //erase useless block
      var body = $('body');
      $('div:not([class])').remove();

      var walkTime =$($(".bg2").get(0)).next().next().find('b').text().split(' ')[0];
      var duration = $('.subtitle').find('b').text().split(' ')[0];

      var correspondances = [];

      var firstPlace = {
        station_depart: $($(".bg2").get(0)).next().next().next().next().next().ignore('*').text().trim(),
        station_arrivee: $($(".bg2").get(0)).next().next().next().next().next().next().ignore('*').text().trim(),
        heure_depart: getTime($($(".bg2").get(0)).next().next().next().next().next().find('b').eq(-1)),
        ligne: getLine($($(".bg2").get(0)).next().next().next().next().next())
      };
      correspondances[0] = firstPlace;

      $(".bg1 img[src='static/public/image/i/correspondance_1.gif']").each(function(i, elem) {
        var correspondance = {
          station_depart: $(elem).parent().next().next().next().next().ignore('*').text().trim(),
          station_arrivee: $(elem).parent().next().next().next().next().next().ignore('*').text().trim(),
          heure_depart: getTime($(elem).parent().next().next().next().next().find('b').eq(-1)),
          ligne: getLine($(elem).parent().next().next().next().next())
        }
        correspondances[i+1] = correspondance;
      });
      console.log(generateData(walkTime, duration, correspondances));
    } else {
      console.log (error);  
    } 
  });
}
};

module.exports = scraper;