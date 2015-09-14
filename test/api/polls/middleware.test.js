var Request = require('../request');

describe('Poll middleware', function () {
  var request;

  before(function () {
    request = Request.Api();
  });

  after(function (done) {
    request.close(done);
  });

  it('get', function (done) {
    request.get('/polls/').expect(200).end(function (err, res) {
      res.body.should.be.instanceof(Array);
      done(err);
    });
  });

  it('post', function (done) {
    request.post('/polls/').expect(200).send({
      title: 'yolo'
    }).end(function (err, res) {
      res.body.should.have.properties('title', '_id');
      done(err);
    });
  });

  it('get by id', function (done) {
    request.post('/polls/').expect(200).send({
      title: 'yolo'
    }).end(function (err, res) {
      if (err) return done(err);
      var poll = res.body;

      request.get('/polls/' + poll._id).expect(200).end(function (err) {
        res.body.should.have.properties('title', '_id');
        done(err);
      });
    });
  });

  it('get by id not found', function (done) {
    request.get('/polls/yolo').expect(404, done);
  });

  it('delete by id', function (done) {
    request.post('/polls/').expect(200).send({
      title: 'yolo'
    }).end(function (err, res) {
      if (err) return done(err);
      var poll = res.body;

      request.del('/polls/' + poll._id).expect(200).end(function (err) {
        if (err) return done(err);
        request.get('/polls/' + poll._id).expect(404, done);
      });
    });
  });
});