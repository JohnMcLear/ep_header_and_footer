exports.handleClientMessage_CUSTOM = function(hook, context, cb){
  if(context.payload.action == "recieveHeaderMessage"){
    var message = context.payload.message;
    if(message){
      $('#input_header').val(message);
    }
  }
  if(context.payload.action == "recieveFooterMessage"){
    var message = context.payload.message;
    if(message){
      $('#input_footer').val(message);
    }
  }

}

exports.documentReady = function(){
  $('#save_header').click(function(){
    $('#save_header').hide();
    sendHeader();
  });

  $('#input_header').keyup(function(){
    $('#save_header').show();
    sendHeader();
  });

  $('#save_footer').click(function(){
    $('#save_footer').hide();
    sendFooter();
  });

  $('#input_footer').keyup(function(){
    $('#save_footer').show();
    sendFooter();
  });


}

function sendHeader(){
  var myAuthorId = pad.getUserId();
  var padId = pad.getPadId();
  var message = $('#input_header').val();
  // Send chat message to send to the server
  var message = {
    type : 'header',
    action : 'sendHeaderMessage',
    message : message,
    padId : padId,
    myAuthorId : myAuthorId
  }
  console.log("sent ", message);
  pad.collabClient.sendMessage(message);  // Send the chat position message to the server
}

function sendFooter(){
  var myAuthorId = pad.getUserId();
  var padId = pad.getPadId();
  var message = $('#input_footer').val();
  // Send chat message to send to the server
  var message = {
    type : 'footer',
    action : 'sendFooterMessage',
    message : message,
    padId : padId,
    myAuthorId : myAuthorId
  }
  pad.collabClient.sendMessage(message);  // Send the chat position message to the server
}

