Mendeley search API JSON-P Proxy in Node.js
===

To run:

    APIKEY=YOUR_API_KEY node server.js

The server will start on port 8001 unless process.env.PORT is specified.

Parameters:

    query: The search query (required).
    jsonp: The function name to use for the JSON response. Default is 'callback'.
    format: The expected format of the response, if not JSON. Supports: 'text', 'xml', 'string'.
