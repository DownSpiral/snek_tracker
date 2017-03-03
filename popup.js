document.addEventListener('DOMContentLoaded', function() {
  var cur_address;
  chrome.storage.local.get("server_address", function(address){
    var server = document.getElementById("server");
    cur_address = address.server_address;
    server.value = address.server_address;
  });

  var button = document.getElementById("button");
  button.addEventListener("click", function(e) {
    var server = document.getElementById("server");
    if (server.value != cur_address) {
      chrome.storage.local.set({ server_address: server.value }, function(){
        chrome.tabs.create({ url: 'http://slither.io' });
      });
    } else {
      chrome.tabs.create({ url: 'http://slither.io' });
    }
  });
});
