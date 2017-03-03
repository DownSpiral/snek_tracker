window.onload = function(e) {
  var friend_img = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA4AAAAOCAYAAAAfSC3RAAAAAXNSR0IArs4c6QAAAVlpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IlhNUCBDb3JlIDUuNC4wIj4KICAgPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4KICAgICAgPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIKICAgICAgICAgICAgeG1sbnM6dGlmZj0iaHR0cDovL25zLmFkb2JlLmNvbS90aWZmLzEuMC8iPgogICAgICAgICA8dGlmZjpPcmllbnRhdGlvbj4xPC90aWZmOk9yaWVudGF0aW9uPgogICAgICA8L3JkZjpEZXNjcmlwdGlvbj4KICAgPC9yZGY6UkRGPgo8L3g6eG1wbWV0YT4KTMInWQAAAORJREFUKBVjYBgygBmbS1lZWQ2A4uGMjIweLCwsH//9+/cCXR0jugAzM/MGV1Nlf109QwYuLi6GkyeOMuw+fXfB379/E5HVomgE2eRsqHReuVCIgY2LFazu17c/DHcnvmHYe/a+4e/fvy/ANDPBGCAaaGqArr4hUBMLEDNDMQuDHlAMKOeArBZFI0gC5DxiAIpGkP9OHj/K8BPoPJATIfg3w6WL5xmAcgeQDUQJVVDo3X/xwVDoIaeG5Cc1Bp4nEgyXV99i2H3m7sI/f/7MQNaIEjgwCVAgQf0kAHIFcqDA1AwhGgABXFPcpnUR1wAAAABJRU5ErkJggg==';
  var dead_img = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA4AAAAOCAYAAAAfSC3RAAAAAXNSR0IArs4c6QAAAVlpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IlhNUCBDb3JlIDUuNC4wIj4KICAgPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4KICAgICAgPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIKICAgICAgICAgICAgeG1sbnM6dGlmZj0iaHR0cDovL25zLmFkb2JlLmNvbS90aWZmLzEuMC8iPgogICAgICAgICA8dGlmZjpPcmllbnRhdGlvbj4xPC90aWZmOk9yaWVudGF0aW9uPgogICAgICA8L3JkZjpEZXNjcmlwdGlvbj4KICAgPC9yZGY6UkRGPgo8L3g6eG1wbWV0YT4KTMInWQAAAOZJREFUKBVjYBgygBmbS1lZWQ2A4uGMjIweLCwsH//9+/cCXR0jugAzM/OGVHMFfxV1LQYODg6GKxfPMcw++WDB379/E5HVomgE2ZRkLH8+/bcSw9e/3GB13MxfGWax32WYe/qR4e/fvy/ANDPBGCAaaGqAqoYWWNO3vzwMIAwyACQGlHNAVouiESTBwcmJLI+TjaIR5L/L588ycDN/YeCCYpBTb9+4xgCUO4BsCkqogkLvwvOPhv9lGTS+64gwvFXkYNj26hrDnFMPFv7582cGskaUwIFJgAIJ6icBkCuQAwWmZgjRAKNJVAQ+xlwfAAAAAElFTkSuQmCC';
  var new_img = function() {
    var img = document.createElement("img");
    img.src = friend_img;
    img.className = "nsi";
    img.style.position = "absolute";
    img.style.left = "0px";
    img.style.top = "0px";
    img.style.opacity = 1;
    img.style.zIndex = 13;
    window.trf(img, window.agpu);
    window.loch.appendChild(img);
    return img;
  }
  var address = document.getElementById("server_address").value;
  var socket = window.io.connect(address);
  var images = {};
  socket.on("player_coords", function(coords) {
    var player_ids = Object.keys(coords);
    var grd = window.grd;
    player_ids.map(function(id) {
      if (id != socket.id) {
        var player = coords[id];
        var img = images[id] || new_img();
        if (player.x && player.y) {
          img.style.left = Math.round(52 + 40 * (player.x - grd) / grd - 7) + "px";
          img.style.top = Math.round(52 + 40 * (player.y - grd) / grd - 7) + "px";
        }
        img.src = (player.alive ? friend_img : dead_img);
        images[id] = img;
      }
    });
    var imgs_to_remove = Object.keys(images).filter(function(id) {
      return player_ids.indexOf(id) < 0;
    });
    imgs_to_remove.map(function(id) {
      var img = images[id];
      img.parentNode.removeChild(img);
      delete images[id];
    });
  });

  var update = function() {
    var alive = false;
    return function() {
      var snake = window.snake;
      var last_x, last_y;
      if (snake) {
        alive = true;
        socket.emit("update_coords", {
          name: window.my_nick,
          x: snake.xx,
          y: snake.yy,
          alive: alive
        });
        last_x = snake.xx;
        last_y = snake.yy;
      } else if (alive) {
        alive = false;
        socket.emit("update_coords", {
          name: window.my_nick,
          x: last_x,
          y: last_y,
          alive: alive
        });
      }
    }
  };

  setInterval(update(), 1000);
}
