/*global appUrl,ajaxFunctions*/
'use strict';


(function () {

   var polls = document.querySelector('#latestPolls');
   var apiUrl = appUrl + '/api/poll/all';

   ajaxFunctions.ready(ajaxFunctions.ajaxRequest('GET', apiUrl, null, function (data) {
      var pollsObject = JSON.parse(data);

      if (pollsObject.polls !== null && pollsObject.polls.length > 0) {
         pollsObject.polls.forEach(function(poll){
            var pollElem = document.getElementById("dummyPoll").cloneNode(true);
            pollElem.removeAttribute("style");
            pollElem.setAttribute("id","poll-"+poll._id);
            var textElem = pollElem.getElementsByClassName("pollName")[0];
            textElem.textContent = poll.name;
            var voteBtn = pollElem.getElementsByClassName("voteBtn")[0];
            voteBtn.addEventListener('click', function() {
               window.location.pathname = '/vote/'+poll._id;
            });
            var viewBtn = pollElem.getElementsByClassName("viewBtn")[0];
            viewBtn.addEventListener('click', function() {
               window.location.pathname = '/results/'+poll._id;
            });
            if (poll.votes > 0) {
               var counter = pollElem.getElementsByClassName("voteCountNum")[0];
               counter.textContent = poll.votes;
               var toolTipCounter = pollElem.getElementsByClassName("ttCountNum")[0];
               toolTipCounter.textContent = poll.votes+" people have voted";
            }
            polls.appendChild(pollElem);
         });
      }
      else {
         polls.innerHTML = "<p>No polls have been created. Sign in to create one now!</p>";
      }

   }));
})();
