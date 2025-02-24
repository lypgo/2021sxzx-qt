const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  // app.use(
  //   '/orientationApi',
  //   createProxyMiddleware({
  //     target: 'http://8.134.73.52:5001/api/v1/getRuleTree',
  //     changeOrigin: true,
  //   })
  // );
  app.use(
    '/searchApi',
    createProxyMiddleware({
      // target: 'http://111.230.197.244:7301/',
     target: 'http://8.134.73.52:5000/', 
     pathRewrite: {
        '^/searchApi':'' //remove /api
      },
      changeOrigin: true,
    })
  );
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'http://8.134.73.52:5001/',
      // target: 'http://localhost:5001/',
      changeOrigin: true,
    })
  );
};