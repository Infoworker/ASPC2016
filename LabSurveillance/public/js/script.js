  var wsUri = "ws://localhost:3000/echo";
  var output;

  function init()
  {
    output = document.getElementById("output");
    testWebSocket();
    $("#TakeImage").on("click", function() {
        doSend("TakePicture");
    })
    $("#StartButton").on("click", function() {
        doSend("StartInterval");
    })
    $("#StopButton").on("click", function() {
        doSend("StopInterval");
    })

  }

  function testWebSocket()
  {
    websocket = new WebSocket(wsUri);
    websocket.onopen = function(evt) { onOpen(evt) };
    websocket.onclose = function(evt) { onClose(evt) };
    websocket.onmessage = function(evt) { onMessage(evt) };
    websocket.onerror = function(evt) { onError(evt) };
  }

  function onOpen(evt)
  {
    writeToScreen("CONNECTED");
    doSend("WebSocket rocks");
  }

  function onClose(evt)
  {
    writeToScreen("DISCONNECTED");
  }

  function onMessage(evt)
  {
      //alert(evt.data);
        writeToScreen('<span style="color: blue;">RESPONSE: ' + evt.data+'</span>');
        var timestamp = new Date().getTime();
        $("#Image").attr("src", "/image.png?" + timestamp);
     //websocket.close();
  }

  function onError(evt)
  {
    writeToScreen('<span style="color: red;">ERROR:</span> ' + evt.data);
  }

  function doSend(message)
  {
    writeToScreen("SENT: " + message);
    websocket.send(message);
  }

  function writeToScreen(message)
  {
    var pre = document.createElement("p");
    pre.style.wordWrap = "break-word";
    pre.innerHTML = message;
    output.appendChild(pre);
  }

  window.addEventListener("load", init, false);
