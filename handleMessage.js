/** *
*
* Responsible for negotiating messages between two clients
*
****/

const authorManager = require('../../src/node/db/AuthorManager');
const padMessageHandler = require('../../src/node/handler/PadMessageHandler');
const db = require('ep_etherpad-lite/node/db/DB').db;
const async = require('../../src/node_modules/async');


// Remove cache for this procedure
db.dbSettings.cache = 0;

const buffer = {};

/*
* Handle incoming messages from clients
*/
exports.handleMessage = function (hook_name, context, callback) {
  // Firstly ignore any request that aren't about chat
  let isHeaderMessage = false;
  let isFooterMessage = false;
  if (context) {
    if (context.message && context.message) {
      if (context.message.type === 'COLLABROOM') {
        if (context.message.data) {
          if (context.message.data.type) {
            if (context.message.data.type === 'header') {
              isHeaderMessage = true;
            }
            if (context.message.data.type === 'footer') {
              isFooterMessage = true;
            }
          }
        }
      }
    }
  }
  if (!isHeaderMessage && !isFooterMessage) {
    callback(false);
    return false;
  }

  const message = context.message.data;
  /** *
    What's available in a message?
     * action -- The action IE chatPosition
     * padId -- The padId of the pad both authors are on
     * targetAuthorId -- The Id of the author this user wants to talk to
     * message -- the actual message
     * myAuthorId -- The Id of the author who is trying to talk to the targetAuthorId
  ***/
  if (message.action === 'sendHeaderMessage') {
    authorManager.getAuthorName(message.myAuthorId, (er, authorName) => { // Get the authorname
      const msg = {
        type: 'COLLABROOM',
        data: {
          type: 'CUSTOM',
          payload: {
            action: 'recieveHeaderMessage',
            authorId: message.myAuthorId,
            authorName,
            padId: message.padId,
            message: message.message,
          },
        },
      };
      sendToRoom(message, msg);
      saveRoomHeader(message.padId, message.message);
    });
  }

  if (message.action === 'sendFooterMessage') {
    authorManager.getAuthorName(message.myAuthorId, (er, authorName) => { // Get the authorname
      const msg = {
        type: 'COLLABROOM',
        data: {
          type: 'CUSTOM',
          payload: {
            action: 'recieveFooterMessage',
            authorId: message.myAuthorId,
            authorName,
            padId: message.padId,
            message: message.message,
          },
        },
      };
      sendToRoom(message, msg);
      saveRoomFooter(message.padId, message.message);
    });
  }


  if (isHeaderMessage || isFooterMessage) {
    callback([null]);
  } else {
    callback(true);
  }
};

function saveRoomFooter(padId, message) {
  console.log('Save footer');
  db.set(`footer:${padId}`, message);
}

function saveRoomHeader(padId, message) {
  db.set(`header:${padId}`, message);
}

function sendToRoom(message, msg) {
  const bufferAllows = true; // Todo write some buffer handling for protection and to stop DDoS -- myAuthorId exists in message.
  if (bufferAllows) {
    setTimeout(() => { // This is bad..  We have to do it because ACE hasn't redrawn by the time the chat has arrived
      padMessageHandler.handleCustomObjectMessage(msg, false, () => {
        // TODO: Error handling.
      });
    }
    , 100);
  }
}

exports.clientVars = function (hook, pad, callback) {
  const padId = pad.pad.id;
  db.get(`header:${padId}`, (err, value) => {
    const msg = {
      type: 'COLLABROOM',
      data: {
        type: 'CUSTOM',
        payload: {
          action: 'recieveHeaderMessage',
          padId,
          message: value,
        },
      },
    };
    sendToRoom(false, msg);
  });

  db.get(`footer:${padId}`, (err, value) => {
    const msg = {
      type: 'COLLABROOM',
      data: {
        type: 'CUSTOM',
        payload: {
          action: 'recieveFooterMessage',
          padId,
          message: value,
        },
      },
    };
    sendToRoom(false, msg);
  });

  return callback();
};
