exports.handleClientMessage_CUSTOM = function (hook, context, cb) {
  if (context.payload.action == 'recieveHeaderMessage') {
    var message = context.payload.message;
    if (message) {
      $('#input_header').val(message);
    }
  }
  if (context.payload.action == 'recieveFooterMessage') {
    var message = context.payload.message;
    if (message) {
      $('#input_footer').val(message);
    }
  }
};

exports.documentReady = function () {
  $('#save_header').click(() => {
    $('#save_header').hide();
    sendHeader();
  });

  $('#input_header').keyup(() => {
    $('#save_header').show();
    sendHeader();
  });

  $('#save_footer').click(() => {
    $('#save_footer').hide();
    sendFooter();
  });

  $('#input_footer').keyup(() => {
    $('#save_footer').show();
    sendFooter();
  });
};

function sendHeader() {
  const myAuthorId = pad.getUserId();
  const padId = pad.getPadId();
  var message = $('#input_header').val();
  // Send chat message to send to the server
  var message = {
    type: 'header',
    action: 'sendHeaderMessage',
    message,
    padId,
    myAuthorId,
  };
  console.log('sent ', message);
  pad.collabClient.sendMessage(message); // Send the chat position message to the server
}

function sendFooter() {
  const myAuthorId = pad.getUserId();
  const padId = pad.getPadId();
  var message = $('#input_footer').val();
  // Send chat message to send to the server
  var message = {
    type: 'footer',
    action: 'sendFooterMessage',
    message,
    padId,
    myAuthorId,
  };
  pad.collabClient.sendMessage(message); // Send the chat position message to the server
}
