var apiURL = 'https://1dhhcnzmxi.execute-api.us-east-1.amazonaws.com/v1';

var get = function(username, id) {
};

exports.handler = function(event, context) {
  console.log(event);
  get(event.username, event.id).then(context.succeed).catch(context.fail);
};
