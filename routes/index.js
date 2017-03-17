'use strict';
var Case = require('../models/Case.js');
var banner = require('../models/banner.js');
var news = require('../models/news.js');
var leave = require('../models/leave.js');
var ObjectID = require('mongodb').ObjectID;
module.exports = function(app) {
  app.get('/', function (req, res) {
    var b = new Promise(function(resolve,reject){
          banner.getAll(function(err,imgs){
            resolve(imgs);
          });
      }); 
    var c = new Promise(function(resolve,reject){
            Case.getIndex(function(err,docs){
                  resolve(docs);
            });
        });
    var n = new Promise(function(resolve,reject){
        news.indexShow(function(err,docs){
            resolve(docs);
        })
    });    
    Promise
    .all([c,b,n])
    .then(function(results){
      res.render('home/page/index',{
        img:results[0],
        ban:results[1],
        news:results[2],
        active:'index'
      })
    }) 
  });
  app.get('/co',function(req,res){
  	res.render('home/page/company',{active: 'gs'});
  });
  app.get('/s',function(req,res){
  	res.render('home/page/service',{active: 'server'});
  });
  app.get('/ca',function(req,res){
  	res.render('home/page/case',{active: 'cases'});
  });
  app.get('/n',function(req,res){
    var page =parseInt(req.query.p) || 1;
    news.getFour(page,function(err,docs,total){
        res.render('home/page/news',{
          doc:docs,
          page:page,
          isFirstPage:(page-1) == 0,
          isLastPage: ((page-1)*4 + docs.length) == total,
          active:'news'
        });
    })
  });
  app.get('/a',function(req,res){
  	res.render('home/page/about',{active: 'about'}); 
  });
  app.get('/nc/:id',function(req,res){
      var id =ObjectID(req.params.id);
      news.getOne(id,function(err,docs){
        if(err){
          return false;
        }
        res.render('home/page/news_detail',{
          doc:docs,
          active:'news'
        });
      })
  });
  app.post('/leave',function(req,res){
      var company = req.body.company,
          telphone = req.body.telphone,
          address = req.body.address,
          content = req.body.content;
      var lea = new leave(company,telphone,address,content);
      lea.save(function(err){
          if(err){
            return res.send({'r':'error'});
          }
          res.send({'r':'success'});
      });
  });
};
