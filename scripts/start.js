const connect = require('connect');
const http = require('http');
const parse = require('url-parse')
const { createProxyMiddleware } = require('http-proxy-middleware');
const { getResourceContent } = require('./lib/local');
const server = require('./lib/server');
const config = require('./lib/config');
const utils = require('./lib/utils');
const mime = require('mime-types');


const SERVER = config.getServer();
server.setServer(SERVER);


async function fixResourceIdToName(resource) {
  const [schemaName, resourceIdOrName] = utils.splitResource(resource);
  if (resourceIdOrName.match(/^\d+$/)) {
    if (!server.isAuthenticated()) {
      const {USERNAME, PASSWORD} = config.getSUPConfigAndLog();
      await server.login(USERNAME, PASSWORD);
    }

  } else {
    return `/${schemaName}/${encodeURIComponent(resourceIdOrName)}`;
  }
}

const {SERVER, USERNAME, PASSWORD} = config.getSUPConfigAndLog();
server.login(USERNAME, PASSWORD);

const app = connect();

app.use('/srv/resources/', async function(req, res, next){
  try {
    const {method, url} = req;
    const resource = await fixResourceIdToName(parse(url, true).pathname);

    if (method === 'GET') {
      const content = await getResourceContent(resource);
      if (content === null) {
        res.statusCode = 404;
        res.setHeader('Content-Type', 'text/plain');
        res.end(`Not found: ${resource}`);
      } else {
        res.setHeader('Content-Type', mime.lookup(resource) || 'application/octet-stream');
        res.end(content);
      }

    } else {
      throw new Error(`Method ${method} not implemented`)
    }
  } catch (err) {
    res.statusCode = 500;
    res.end('Error: ' + err.message);
    console.error(err);
  }
});

app.use('/', createProxyMiddleware({ target: SERVER, changeOrigin: true, secure: true }));

http.createServer(app).listen(3000);
