let middleware = (req, res, next) => {

  console.log(req.headers);

  req.php = req.protocol + '://' + req.get('host').replace('127.0.0.1', 'localhost');
  return next();
};

module.exports = middleware;
