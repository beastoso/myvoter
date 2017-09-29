/*global appUrl,ajaxFunctions*/
'use strict';


(function () {

   var name = document.querySelector('#user-name');
   var polls = document.querySelector('#user-polls');
   var apiUrl = appUrl + '/api/profile';

   function updateHtmlElement (data, element, userProperty) {
      element.innerHTML = data[userProperty];
   }

   ajaxFunctions.ready(ajaxFunctions.ajaxRequest('GET', apiUrl, null, function (data) {
      var userObject = JSON.parse(data);

      if (userObject.name !== null) {
         updateHtmlElement(userObject, name, 'name');
      }

      if (userObject.polls !== null && userObject.polls.length > 0) {
         userObject.polls.forEach(function(poll){
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
            var editBtn = pollElem.getElementsByClassName("editBtn")[0];
            editBtn.addEventListener('click', function() {
               window.location.pathname = '/edit/'+poll._id;
            });
            var deleteBtn = pollElem.getElementsByClassName("deleteBtn")[0];
            deleteBtn.addEventListener('click', function() {
               ajaxFunctions.ajaxRequest('DELETE', appUrl+'/api/poll/'+poll._id, null, function(data) {
                  polls.removeChild(pollElem);
               });
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
         polls.innerHTML = "<p>You haven't made any yet</p>";
      }

   }));
})();
