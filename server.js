// Simple JSONP Proxy for NodeJS
// Josh Hundley - http://joshhundley.com - http://twitter.com/oJshua
//
// nisc (http://nkls.schmckr.de) hacked it into a Mendeley document search proxy for
// http://stackoverflow.com/questions/8297528/citation-lookup-with-ajax-using-oai-pmh/8309307

var util = require("util"), http = require("http"), url = require("url");
var MENDELEY_SEARCH = 'http://api.mendeley.com/oapi/documents/search/';
var apiPort = parseInt(process.env.PORT) || 8001;
var apiKey = process.env.APIKEY;

if(!apiKey) {
  console.error("Please provide an apiKey (env variable 'APIKEY') .. exiting.");
  process.exit(1);
}

http.createServer(function(req, res) {

  var params = url.parse(req.url, true).query;

  var format = 'json';
  var jsonp = 'callback';
  var response = '';
  var requestUrl;

  function writeUsage(res) {
    res.writeHead(200, {
      'Content-Type' : "text/plain"
    });
    res.write("JSON-P Mendeley PROXY\n\n");
    res.write("Usage:\n");
    res.write("\tquery: The search query (required).\n");
    res.write("\tcallback: The function name to use for the JSON response. Default is 'callback'.\n");
    res.write("\tformat: The expected format of the response, if not JSON. Supports: 'text', 'xml', 'string'.\n");
    return res.end();
  }

  function writeJSONP(contents, override) {

    if (typeof override != 'undefined') {
      format = 'json';
    }
    res.writeHead(200, {
      'Content-Type' : 'application/javascript'
    });

    switch (format) {
      case 'text':
      case 'xml':
      case 'string':
        res.write(jsonp + "(unescape('" + escape(contents) + "'))");
        break;
      default:
        res.write(jsonp + '(' + contents + ')');
        break;
    }
    return res.end();
  }

  if (typeof params == 'undefined') {
    return writeUsage(res);
  }

  if (typeof params.format != 'undefined' && params.format != '') {
    format = params.format;
  }

  if (typeof params.callback != 'undefined' && params.callback != '') {
    jsonp = (params.callback + '').replace(/[^a-zA-Z0-9._$]+/g, '');
  }

  if (!params.query) {
    return writeUsage(res);
  }

  var port = 80
  var path = MENDELEY_SEARCH+params.query+"?consumer_key="+apiKey;
  var requestURL = url.parse(path);

  var client = http.createClient(port, requestURL.hostname);
  var request = client.request("GET", path, {
    Host : requestURL.hostname,
    'Accept' : '*/*',
    'User-Agent' : 'Mozilla/5.0 (compatible; MSIE 6.0; Windows NT5.0)',
    'Accept-Language' : 'en-us',
    'Accept-Charset' : 'ISO-8859-1,utf-8;q=0.7,*;q=0.7'
  });

  request.addListener('response', function(response) {
    var body = '';

    response.setEncoding("utf8");

    response.addListener("data", function(chunk) {
      body += chunk;
    });

    response.addListener('end', function() {
      writeJSONP(body);
    });
  });

  request.end();

}).listen(apiPort);

util.puts('Server running at http://127.0.0.1:' + apiPort);
