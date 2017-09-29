'use strict';

var appUrl = window.location.origin;
var ajaxFunctions = {
   ready: function ready (fn) {
      if (typeof fn !== 'function') {
         return;
      }

      if (document.readyState === 'complete') {
         return fn();
      }

      document.addEventListener('DOMContentLoaded', fn, false);
   },
   ajaxRequest: function ajaxRequest (method, url, params, callback) {
      var xmlhttp = new XMLHttpRequest();
      
     xmlhttp.onreadystatechange = function () {
         if (xmlhttp.readyState === 4 && xmlhttp.status === 200) {
            callback(xmlhttp.response);
         }
      };

      xmlhttp.open(method, url, true);
       if (method.toLowerCase() == 'post' || method.toLowerCase() == 'put') {
         xmlhttp.setRequestHeader("Content-type", "application/json");
      }

      if (params != null) {
         xmlhttp.send(params);
      }
      else {
         xmlhttp.send();
      }
      
   }
};