 var mongodb = require('./db');
 function news(title,summary,show,editor){
 	this.title = title;
 	this.summary= summary;
 	this.show = show;
 	this.editor = editor;
 }
 module.exports = news;

news.prototype.save = function(callback){
 	var date = new Date();
 	var time = {
 	    date: date,
 	    year : date.getFullYear(),
 	    month : date.getFullYear() + "-" + (date.getMonth() + 1),
 	    day : date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate(),
 	    minute : date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + " " + 
 	    date.getHours() + ":" + (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) 
 	}

 	var n = {
 		title : this.title,
 		summary : this.summary,
 		time : time,
 		show : this.show,
 		editor : this.editor
 	}

 	mongodb.open(function(err,db){
 		if(err){
 			return callback(err);
 		}
 		db.collection('newss',function(err,collection){
 			if(err){
 				return callback(err);
 			}

 			collection.insert(n,{
 				safe: true
 			},function(err){
 				if(err){
 					return callback(err);
 				}
 				callback(null);
 			})
 		});
 	});
}
//获取新闻所有数据
news.getAll = function(callback){
	mongodb.open(function(err,db){
		if(err){
			return callback(err);
		}
		db.collection('newss',function(err,collection){
			if(err){
				return callback(err);
			}
			collection.find().toArray(function(err,docs){
				if(err){
					return callback(err);
				}
				callback(null,docs);
			})
		})
	});
}
//删除单条数据
news.remove = function(id,callback){
	mongodb.open(function(err,db){
		if(err){
			return callback(err);
		};
		db.collection('newss',function(err,collection){
			if(err){
				return callback(err);
			};
			collection.remove({"_id":id},function(err){
				if(err){
					return callback(err);
				}
				callback(null);
			})
		});
	})
}
//获取单条数据
news.getOne = function(id,callback){
	mongodb.open(function(err,db){
		if(err){
			return callback(err);
		}
		db.collection('newss',function(err,collection){
			if(err){
				return callback(err);
			}
			collection.findOne({"_id":id},function(err,docs){
				if(err){
					return callback(err);
				}
				callback(null,docs);
			})
		});
	});
}
//修改新闻
news.update = function(id,title,summary,show,editor,callback){
	mongodb.open(function(err,db){
		if(err){
			return callback(err);
		}
		db.collection('newss',function(err,collection){
			if(err){
				return callback(err);
			}

			collection.update({'_id':id},{
				$set: {
					title:title,
					summary:summary,
					show:show,
					editor:editor
				}
			},function(err){
				if(err){
					return callback(err);
				}
				callback(null);
			});
		});
	})
}
//获取首页显示新闻
news.indexShow = function(callback){
	mongodb.open(function(err,db){
		if(err){
			return callback(err);
		}
		db.collection('newss',function(err,collection){
			if(err){
				return callback(err);
			}
			collection.find(
				{'show':'yes'},{'title':1,'time':1}
				).limit(3)
				 .sort({
				 	'time':-1
				 }).toArray(function(err,docs){
					if(err){
						return callback(err);
					}
					callback(null,docs);
				});
		});
	});
}
//获取四条新闻
news.getFour = function(page,callback){
	mongodb.open(function(err,db){
		if(err){
			return callback(err);
		}
		db.collection('newss',function(err,collection){
			if(err){
				return callback(err);
			}
			collection.count({},function(err,total){
				if(err){
					return callback(err);
				}
				collection.find({},{
					skip: (page - 1)*4,
					limit: 4
				}).sort({
					time:-1
				}).toArray(function(err,docs){
					if(err){
						return callback(err);
					}
					callback(null,docs,total);
				})
			})
		})
	});
}