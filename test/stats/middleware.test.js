﻿'use strict';

var Request = require('../request');

describe('Stats middleware', function () {
  var request, poll;

  before(function () {
    request = Request();
  });

  after(function (done) {
    request.close(done);
  });

  beforeEach(function (done) {
    request.post('/api/polls/').send({
      title: 'yolo'
    }).expect(200).end(function (err, res) {
      poll = res.body;
      done(err);
    });
  });

  it('should return right stats', function (done) {
    Promise.all( [
      addVotes(request, poll, 0, 10),
      addVotes(request, poll, 1, 20),
      addVotes(request, poll, 2, 30)
    ]).then(done.bind(null, null), done);
  });
});

function addVote (request, poll, answer) {
  return new Promise(function (success, reject) {
    request.post('/api/polls/' + poll._id + '/votes').expect(200).send({
      answer: answer
    }).end(function (err, res) {
      res.body.should.have.properties('answer', '_id');
      if (err) return reject(err);
      success(res.body);
    });
  });
}

function addVotes (request, poll, answer, times) {
  var votes = [];
  while (times > 0) {
    votes.push(addVote(request, poll, answer));
    times--;
  }
  return Promise.all(votes);
}
