function(instance, properties, context) {   
  console.log('TestChat init', properties.exam, properties.client);
  
  var xhr = new XMLHttpRequest();

  var body = '';   

  body = 'client='+properties.client;    
  body += '&exam='+properties.exam;

  xhr.open("POST", 'https://'+context.keys.api_host+'/timeline/chat', true);
  xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

  xhr.onload  = function() {
    instance.canvas.empty();
    if (xhr.response) {
      var resp = JSON.parse(xhr.response).response;
      if (resp.length > 0) {
        for(var i in resp) {
          instance.canvas.append($('<p><b>'+resp[i].extra+':</b> '+resp[i].content+'</p>'));
        }                  
      } 
    }
  };  

  xhr.send(body);

  if (instance.data.client) {
    console.log('TextChat close old hub connection')
    instance.data.client.disconnect();
    instance.data.client = null;
  }

  instance.data.client = new BroadcastHubClient(
    {server: 'https://'+context.keys.api_host+':8443/sockets/', auth: 'TextChat'});  
    
  instance.data.client.on('message:'+properties.exam, function (message) {
      received = JSON.parse(message);
      if(received.entity == 'message') {      
        instance.canvas.append($('<p><b>'+received.extra+':</b> '+received.content+'</p>'));
      }
  });
  
  instance.data.client.subscribe(properties.exam);  
  console.log('TextChat inited on', instance.data.client.client._server);  
}