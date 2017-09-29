/*global appUrl,ajaxFunctions*/
'use strict';


(function () {

   var name = document.querySelector('#pollName');
   var submitBtn = document.querySelector('#submitBtn');
   var options = document.querySelector('#options');
   var apiUrl = appUrl + '/api/poll';

   function updateHtmlElement (data, element, userProperty) {
      element.innerHTML = data[userProperty];
   }

   ajaxFunctions.ready(ajaxFunctions.ajaxRequest('GET', apiUrl, null, function (data) {
      var pollObject = JSON.parse(data);

      if (pollObject) {
         var pollId = pollObject._id;
         if (pollObject.name !== null) {
            updateHtmlElement(pollObject, name, 'name');
         }
   
         if (pollObject.options !== null && pollObject.options.length > 0) {
            pollObject.options.forEach(function(option){
               var optionElem = document.getElementById("dummyOption").cloneNode(true);
               optionElem.removeAttribute("style");
               optionElem.removeAttribute("id");
               optionElem.setAttribute("data-option-id",option._id);
               var textElem = optionElem.getElementsByClassName("optionText")[0];
               textElem.textContent = option.text;
               options.appendChild(optionElem);
               optionElem.addEventListener('click', function() {
                  var optionElements = document.getElementsByClassName("voteOption");
                  var i;
                  for (i = 0; i<optionElements.length; i++) {
                     var elem = optionElements[i];
                     elem.setAttribute("class", "voteOption radio row"); //remove selected class
                     var checkBox = optionElem.getElementsByTagName("input");
                     checkBox.voteOption.checked = false;
                  }
                  optionElem.setAttribute("class", "voteOption radio optionSelected row");
                  var checkBox = optionElem.getElementsByTagName("input");
                  checkBox.voteOption.checked = true;
               });
            });
         }
         else {
            options.innerHTML = "<p>There are no options</p>";
         }
         
         submitBtn.addEventListener('click', function() {
            var selectedOption = document.getElementsByClassName("optionSelected");
            if (selectedOption) {
            	var pollIdField = document.getElementById("pollId");
            	pollIdField.value = pollId;
            	var optionIdField = document.getElementById("optionId");
            	optionIdField.value = selectedOption[0].getAttribute("data-option-id");
            	var form = document.getElementById("voteForm");
            	form.setAttribute("action", "/vote/"+pollId);
            	form.setAttribute("method", "POST");
            	form.submit();
            }
         });
      }
   }));
})();
