 var Case = require('../models/Case.js');
 var banner = require('../models/banner.js');
 var news = require('../models/news.js');
 var leave = require('../models/leave.js');
 var user = require('../models/user.js');
 var multer  = require('multer');
 var crypto = require('crypto');
 var ObjectID = require('mongodb').ObjectID;
 var fs = require('fs');
 var storage = multer.diskStorage({
     destination: function (req, file, cb){
         cb(null, './public/images')
     },
     filename: function (req, file, cb){
         cb(null, file.originalname)
     }
 });
 var upload = multer({
     storage: storage 
 });

 module.exports = function(app){
  // 下面代码是未登录前不能访问其他页面
 	// app.get('/users/:title',function(req,res,next){
 	// 	var t = req.params.title,
 	// 		use = req.session.user;
 	// 	if(!use){
 	// 		return res.redirect('/users')
 	// 	}
 	// 	next();
 	// });
 	app.get('/users',function(req,res){
 		 res.render('admin/page/login')
 	});
 	// app.get('/users/index', checkLogin);
 	app.get('/users/index',function(req,res){
 		res.render('admin/page/index',{
 			user:req.session.user || {}
 		});
 	});
 	app.get('/users/cL',function(req,res){
 		Case.getAll(function(err,docs){
 			if(err){
 				res.redirect('/users');
 			}
 			var img = docs;

 			res.render('admin/page/caseList',{
 				user:req.session.user || {},
 				title:'案例列表',
 				img:img,
 				success: req.flash('success').toString(),
 				error: req.flash('error').toString()
 			});
 		})

 	});
 	app.get('/users/ac',function(req,res){
 		res.render('admin/page/addCase',{
 			user:req.session.user || {},
 			success: req.flash('success').toString(),
 			error: req.flash('error').toString()
 		})
 	});
 	app.post('/users/ac', upload.single('field1'),function(req,res){
 		
 		var src =req.file.filename,
 		    show = req.body.show,
 			c = new Case(src,show);
 			c.save(function(err){ 
 				if(err){
 					req.flash('error','添加失败');
 					return res.redirect('back');
 				}
 				req.flash('success','添加成功');
 				res.redirect('/users/cL');
 			})
 			
 	});
 	app.get('/rmC/:_id/:src',function(req,res){
 		var id = ObjectID(req.params._id),
 			imgPath = 'public/images/'+req.params.src;
 		fs.unlink(imgPath,function(err){
 			if(err){
 				req.flash('error','删除图片失败');
 				return res.redirect('/users/cL');
 			}
 			Case.remove(id,function(err){
 				if(err){
 					req.flash('error','删除失败');
 					return res.redirect('/users/cL');
 				}
 				req.flash('success','删除成功');
 				res.redirect('/users/cL');
 			});
 		});
 		
 	});
 	app.get('/modifyC/:id',function(req,res){
 		var id = ObjectID(req.params.id);
 		Case.getOne(id,function(err,docs){
 			if(err){
 				req.flash('error','修改失败'); 
 				res.redirect('back');
 			}
 			var session = req.session;
 			session.doc = docs;
 			res.redirect('/users/cu');
 		})
 	});
 	app.get('/users/cu',function(req,res){
 		res.render('admin/page/caseU',{
 			user:req.session.user || {},
 			doc:req.session.doc,
 			success: req.flash('success').toString(),
 			error: req.flash('error').toString()
 		});
 	});
 	app.post('/users/cu/:id/:src',upload.single('field1'),function(req,res){
 		var id = ObjectID(req.params.id),
 			src=req.file.filename,
 			imgPath = 'public/images/'+req.params.src;
 		fs.unlink(imgPath,function(err){
 			if(err){
 				req.flash('error','修改失败');
 				return res.redirect('back');
 			}
 			Case.update(id,src,function(err){
 				if(err){
 					req.flash('error','修改失败');
 					return res.redirect('back');
 				}
 				req.flash('success','修改成功');
 				res.redirect('/users/cL');
 			})
 		})
 	});
 	app.get('/users/ab',function(req,res){
 		res.render('admin/page/bannerAdd',{
 			user:req.session.user || {},
 			success: req.flash('success').toString(),
 			error: req.flash('error').toString()
 		});
 	});
 	app.get('/users/bL',function(req,res){
 		banner.getAll(function(err,docs){
 			if(err){
 				req.flash('error','获取失败');
 				return res.redirect('/users/bL');
 			}
 			res.render('admin/page/bannerList',{
 				user:req.session.user || {},
 				docs:docs,
 				success: req.flash('success').toString(),
 				error: req.flash('error').toString()
 			});
 		})
 		
 	});
 	app.post('/users/ab',upload.single('field2'),function(req,res){
 		var src = req.file.filename,
 			show = req.body.show;
 		var ban = new banner(src,show);
 		ban.save(function(err){
 			if(err){
 				req.flash('error','添加失败');
 				return res.redirect('/users/ab');
 			}
 			req.flash('success','添加成功');
 			res.redirect('/users/bL');
 		});
 	});
 	app.get('/rmBan/:id/:src',function(req,res){
 		var id = ObjectID(req.params.id),
 			imgPath = 'public/images/'+req.params.src;
 		fs.unlink(imgPath,function(err){
 			if(err){
 				req.flash('error','删除失败');
 				return res.redirect('back');
 			}
 			banner.remove(id,function(err){
 				if(err){
 					req.flash('error','删除失败');
 					return res.redirect('/users/bL');
 				}
 				req.flash('success','删除成功');
 				res.redirect('/users/bL');
 			})
 		});
 	});
 	app.get('/xgB/:id',function(req,res){
 			var id = ObjectID(req.params.id);
 			banner.getOne(id,function(err,ban){
 				if(err){
 					req.flash('error','出错返回');
 					return res.redirect('back');
 				}
 				res.render('admin/page/bannerU',{
 					user:req.session.user || {},
 					ban:ban,
 					success: req.flash('success').toString(),
 					error: req.flash('error').toString()
 				})

 			})
 	});
 	app.get('/users/aN',function(req,res){
 		res.render('admin/page/Addnews',{
 			user:req.session.user || {},
 			success: req.flash('success').toString(),
 			error: req.flash('error').toString()
 		});
 	});
 	app.post('/users/bU/:id',upload.single('field3'),function(req,res){
 		console.log("看见谁知道犯困了睡觉地方");
 		var id = ObjectID(req.params.id),
 			show = req.body.show,
 			src = req.file.filename;
 		
 		banner.update(id,src,show,function(err){
 			if(err){
 				req.flash('error','错误返回');
 				return res.redirect('back');
 			}
 			req.flash('success','修改成功！');
 			res.redirect('/users/bL');
 		});
 	});
 	app.post('/users/aN',function(req,res){
 		var title = req.body.nTitle,
 			summary = req.body.summary,
 			show = req.body.show,
 			editor = req.body.editor;
 		var onNew = new news(title,summary,show,editor);
 		onNew.save(function(err){
 			if(err){
 				req.flash('error','添加失败');
 				return res.redirect('back');
 			}
 			req.flash('success','添加成功');
 			res.redirect('/users/Nl');
 		});
 	});
 	app.get('/users/Nl',function(req,res){
 		news.getAll(function(err,docs){
 			if(err){
 				req.flash('error','获取数据出错');
 				return res.redirect('back');
 			}
 			res.render('admin/page/newsList',{
 				user:req.session.user || {},
 				doc:docs,
 				success: req.flash('success').toString(),
 				error: req.flash('error').toString()
 			});
 		});
 	});
 	app.get('/removeN/:id',function(req,res){
 		var id = ObjectID(req.params.id);
 		news.remove(id,function(err){
 			if(err){
 				req.flash('error','删除失败');
 				return res.redirect('back');
 			}
 			req.flash('success','删除成功');
 			res.redirect('/users/Nl');
 		})
 	});
 	app.get('/modifyN/:id',function(req,res){
 		var id = ObjectID(req.params.id);
 		news.getOne(id,function(err,docs){
 			if(err){
 				req.flash('error','出错返回！');
 				return res.redirect('back');
 			}
 			res.render('admin/page/newsU',{
 				user:req.session.user || {},
 				doc:docs
 			})
 		})
 	});
 	app.post('/users/NU/:id',function(req,res){
 		var id = ObjectID(req.params.id),
 			title = req.body.nTitle,
 			summary = req.body.summary,
 			show = req.body.show,
 			editor = req.body.editor;
 		news.update(id,title,summary,show,editor,function(err){
 			if(err){
 				req.flash('error','修改出错');
 				return res.redirect('back');
 			}
 			req.flash('success','修改成功');
 			res.redirect('/users/Nl');
 		})
 	});
 	app.get('/users/leave',function(req,res){
 		leave.getAll(function(err,docs){
 			res.render('admin/page/leave',{
 				user:req.session.user || {},
 				doc:docs,
 				success: req.flash('success').toString(),
 				error: req.flash('error').toString()
 			});
 		});
 	});
 	app.get('/removeL/:id',function(req,res){
 		var id = ObjectID(req.params.id);
 		leave.remove(id,function(err){
 			if(err){
 				req.flash('error','出错返回');
 				return res.redirect('back');
 			}

 			req.flash('success','删除成功');
 			res.redirect('/users/leave');
 		})
 	});
 	app.get('/users/addAdmin',function(req,res){
 		res.render('admin/page/addAdmin',{
 			user:req.session.user || {},
 			success: req.flash('success').toString(),
 			error: req.flash('error').toString()
 		})
 	});
 	app.get('/users/adminList',function(req,res){
 		user.getAll(function(err,user){
 			if(err){
 				req.flash('error','出错');
 				return res.redirect('back');
 			}
 			res.render('admin/page/adminList',{
 				user:req.session.user || {},
 				user:user,
 				success: req.flash('success').toString(),
 				error: req.flash('error').toString()
 			})
 		});
 		
 	});
 	app.post('/users/addAdmin',function(req,res){
 		var md5 = crypto.createHash('md5'),
 			password = md5.update(req.body.password).digest('hex');
 		var fo = {
 			name:req.body.username,
 			password : req.body.password,
 			cpassword : req.body.cpassword,
 			role : req.body.role
 		}	
 		if(fo.password != fo.cpassword){
 			req.flash('error','两次输入的密码不一致!');
 			return res.redirect('back');
 		}
 		fo.password = password;
 		user.getUser(fo.name,function(err,user){
 			if(err){
 				req.flash('error','出错返回！');
 				return res.redirect('back');
 			}
 			if(user){
 				req.flash('error', '用户已存在!');
 				return res.redirect('back');
 			}
 		});
 		var use = new user(fo);
 		use.save(function(err,doc){
 			if(err){
 				req.flash('error','出错！');
 				return res.redirect('back');
 			}
 			req.flash('success','添加成功');
 			res.redirect('/users/adminList');
 		});
 	});

 	app.post('/users',function(req,res){
 		var md5 = crypto.createHash('md5');
 		var username = req.body.username,
 			password = md5.update(req.body.password).digest('hex');
 		user.getUser(username,function(err,user){
 			if(!user){
 				return res.send({'data':'用户不存在！'})
 			}
 			if(user.password != password ){
 				return res.send({'data':'密码错误'})
 			}
 			req.session.user = user;
 			res.send({'success':1})
 		})

 	})

 	app.get('/signOut',function(req,res){
 		req.session.user = "";
 		res.redirect('/users');
 	});
 }