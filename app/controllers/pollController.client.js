/*global appUrl,ajaxFunctions*/
'use strict';

(function () {

   var addButton = document.getElementById("addOption");
   var submitButton = document.getElementById("submitBtn");
   var pollIdField = document.getElementById("pollId");
   var resultsButton = document.getElementById("resultsBtn");
   var voteButton = document.getElementById("voteBtn");
   var apiUrl = appUrl + '/api/:id/votes';
   
   if (pollIdField != null) {
   	ajaxFunctions.ajaxRequest('GET', appUrl+"/api/poll", null, function (data) {
   		var pollObject = JSON.parse(data);

	      if (pollObject.name !== null) {
	         var nameField = document.querySelector("input[name=name]");
	         nameField.value = pollObject.name;
	      }
	
	      if (pollObject.options !== null && pollObject.options.length > 0) {
	         pollObject.options.forEach(function(option){
	            var nextOption = addOption();
	            nextOption.value = option.text;
	            nextOption.setAttribute("disabled", "disabled");
	         });
	      }
      	var linkBox = document.getElementById("pollLink");
	 		linkBox.textContent = "https://myvoter-beastoso.c9users.io/vote/"+pollObject._id;
	 		var linkBtn = document.getElementById("copyBtn");
	 		linkBtn.addEventListener('click', function() {
	 			linkBox.select();
	 			 document.execCommand('copy');
	 		});
	 		
		   if (resultsButton != null) {
		      resultsButton.setAttribute("href","/results/"+pollObject._id)
		   }
		   if (voteButton != null) {
		      voteButton.setAttribute("href","/vote/"+pollObject._id)
		   }
      });
   	
	}
   if (addButton != null) {
      addButton.addEventListener('click', addOption);
   }
   if (submitButton != null) {
      submitButton.addEventListener('click', sendForm);
   }

})();

function addOption() {
   var form = document.getElementById("pollForm");
   var formItems = form.getElementsByTagName('input');
	var i, counter = 0;
	for (i = 0; i < formItems.length; i++) {
		var child = formItems[i];
		if (child.getAttribute("name").startsWith('pollOption')) {
			counter++;
		}
	}
   
	var container = document.getElementById("options");
	var newItem = container.children[0].cloneNode(true);
	var newOption = newItem.getElementsByTagName("input")[0];
	newItem.removeAttribute("id");
	newItem.removeAttribute("style");
	newOption.setAttribute("name","pollOption"+counter);
	newOption.value = "";
	container.appendChild(document.createElement("br"));
	container.appendChild(newItem);
	return newOption;
}

function sendForm() {
	var form = document.getElementById("pollForm");
	
	var formData = {
		'name': null,
		'description': null,
		'options': []
	};
	var formItems = form.getElementsByTagName('input');
	var isUpdate = false;
	var i;
	for (i = 0; i < formItems.length; i++) {
		var child = formItems[i];
		if (child.getAttribute("name") == 'name') {
			formData.name = child.value;
		}
		else if (child.getAttribute("name") == 'pollId') {
			isUpdate = true;
			formData.poll_id = child.value;
		}
		else if (child.getAttribute("name").startsWith('pollOption')) {
			if (child.getAttribute("id") !== "dummyOption") {
				formData.options.push(child.value);
			}
		}
	}
	
	formData = JSON.stringify(formData);
		
		
	var method = isUpdate ? "PUT" : "POST";
	ajaxFunctions.ready(ajaxFunctions.ajaxRequest(method, "/api/poll", formData, function (data) {

		var pollId = JSON.parse(data);
 		if (pollId) {
 			if (!isUpdate) {
 				var detailsDiv = document.getElementById("details");
 				detailsDiv.setAttribute("style","display:none;");
 				var shareDiv = document.getElementById("share");
 				shareDiv.removeAttribute("style");
 				var header = document.getElementsByTagName("h1")[0];
 				header.setAttribute("style","display:none;");
 				var linkBox = document.getElementById("pollLink");
 				linkBox.textContent = "https://myvoter-beastoso.c9users.io/vote/"+pollId;
 				var linkBtn = document.getElementById("copyBtn");
 				linkBtn.addEventListener('click', function() {
 					linkBox.select();
 					 document.execCommand('copy');
 				});
 			}
  			 
		}
	}));
}
