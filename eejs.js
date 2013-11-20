var eejs = require('ep_etherpad-lite/node/eejs/');

exports.eejsBlock_styles = function(hook_name, args, cb){
  return cb();
}

exports.eejsBlock_globalSettings = function (hook_name, args, cb)
{
  args.content = args.content + eejs.require('ep_header_and_footer/templates/header_and_footer.ejs', {settings : false});
}


