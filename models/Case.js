var mongodb = require('./db');
function Case(src,show){
	this.src = src;
	this.show = show; 
};
module.exports = Case;
Case.prototype.save = function(callback) {
	var date = new Date();
	var time = {
	    date: date,
	    year : date.getFullYear(),
	    month : date.getFullYear() + "-" + (date.getMonth() + 1),
	    day : date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate(),
	    minute : date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + " " + 
	    date.getHours() + ":" + (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) 
	}

	var c = {
		time : time,
		src : this.src,
		show :this.show
	}

	mongodb.open(function(err,db){
		if(err){
			return callback(err);
		}

		db.collection('cases',function(err,collection){
			if(err){
				mongodb.close();
				return callback(err);
			}

			collection.insert(c,{
				safe: true
			},function(err){
				mongodb.close();
				if(err){
					return callback(err);
				}
				callback(null);
			});
		});
	})
}
Case.getAll = function(callback){
	mongodb.open(function(err,db){
		if(err){
			return callback(err);
		}
		db.collection('cases',function(err,collection){
			if(err){
				mongodb.close();
				return callback(err);
			}
			collection.find().toArray(function(err,docs){
				mongodb.close();
				if(err){
					return callback(err);
				}
				callback(null,docs);
			})
		})
	})
}
Case.remove = function(id,callback){
	mongodb.open(function(err,db){
		if(err){
			return callback(err);
		};
		db.collection('cases',function(err,collection){
			if(err){
				mongodb.close();
				return callback(err);
			};
			collection.remove(
				{"_id":id},
				function(err){
					mongodb.close();
					if(err){
						return callback(err);
					}
					callback(null);
				});
		});
	})
}
// 获取首页显示
Case.getIndex = function(callback){
	mongodb.open(function(err,db){
		if(err){
			return callback(err);
		}
		db.collection('cases',function(err,collection){
			if(err){
				mongodb.close();
				return callback(err);
			}
			collection.find({
				'show':'yes'
			}).limit(9)
			.toArray(function(err,docs){
				if(err){
					return callback(err);
				}
				callback(null,docs);
			});
		});
	});
}
// 根据ID获取单个案例详情
Case.getOne = function(id,callback){
	mongodb.open(function(err,db){
		if(err){
			return callback(err);
		}
		db.collection('cases',function(err,collection){
			if(err){
				mongodb.close();
				return callback(err);
			}
			collection.findOne({
				"_id":id
			},function(err,docs){
				mongodb.close();
				if(err){
					return callback(err);
				}
				callback(null,docs);
			});
		});
	});
} 
// 修改案例图片
Case.update = function(id,src,callback){
	mongodb.open(function(err,db){
		if(err){
			return callback(err);
		}
		db.collection('cases',function(err,collection){
			if(err){
				mongodb.close();
				return callback(err);
			}
			collection.update({
				'_id':id
			},{
				$set: {src:src}
			},function(err){
				mongodb.close();
				if(err){
					return callback(err);
				}
				callback(null);
			});
		});
	});
}