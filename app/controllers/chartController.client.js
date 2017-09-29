/*global appUrl,ajaxFunctions, Chart*/
'use strict';

function getRandomColour(isBorder) {
   //return '#'+(0x1000000+(Math.random())*0xffffff).toString(16).substr(1,6);
    var o = Math.round, r = Math.random, s = 255;
    return 'rgba(' + o(r()*s) + ',' + o(r()*s) + ',' + o(r()*s) + ',)';
}

function setTransparency(rgb, transparency) {
   return rgb.substr(0, rgb.length - 1)+transparency+")";
}

function getChart(selector, type, labels, data, backgroundColours, borderColours) {
   var ctx = document.getElementById(selector).getContext('2d');
   var options = {title: {display: false}};
   if (type == "pie") {
      options.legend = {position: 'bottom'};
   }
   var myChart = new Chart(ctx, {
       type: type,
       data: {
           labels: labels,
           datasets: [{
               label: '# of Votes',
               data: data,
               backgroundColor: backgroundColours,
               borderColor: borderColours,
               borderWidth: 1
           }]
       },
       options: options
   });
}

(function () {
   
   var name = document.querySelector('#pollName');
   var options = document.querySelector('#options');
   var apiUrl = appUrl + '/api/results';

   function updateHtmlElement (data, element, userProperty) {
      element.innerHTML = data[userProperty];
   }

   ajaxFunctions.ready(ajaxFunctions.ajaxRequest('GET', apiUrl, null, function (data) {
      var pollObject = JSON.parse(data);

      if (pollObject.name !== null) {
         updateHtmlElement(pollObject, name, 'name');
      }
      
      if (pollObject.options != null && pollObject.options.length > 0) {

         var labels = [];
         var data = [];
         var backgroundColours = [];
         var borderColours = [];
         pollObject.options.forEach(function(option) {
            labels.push(option.text);
            var voteCount = 0;
            if (pollObject.votes != null) {
               pollObject.votes.forEach(function(voteObj){
                  if (voteObj.option_id == option._id) {
                     voteCount = voteObj.count;
                  }
               });
            }
            data.push(voteCount);
            var colour = getRandomColour();
            backgroundColours.push(setTransparency(colour, 0.2));
            borderColours.push(setTransparency(colour, 1));
         });
         
         getChart("barResults", "horizontalBar", labels, data, backgroundColours, borderColours);
         getChart("pieResults", "pie", labels, data, backgroundColours, borderColours);
      }
   }));
})();
