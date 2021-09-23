var express = require('express');
var router = express.Router();

/* GET users listing. */
router.post('/abc', function(req, res, next) {
    console.dir(req.body , {depth: null});
    res.send({body:'success'});
});

router.get('/abc', function(req, res, next) {
  // console.log(req.body);
  res.send('very nice');4
});

module.exports = router;
