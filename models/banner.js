mongodb = require('./db');
function banner(src,show){
	this.src = src;
	this.show = show;
}
module.exports = banner;

banner.prototype.save = function(callback){
	var date = new Date();
	var time = {
	    date: date,
	    year : date.getFullYear(),
	    month : date.getFullYear() + "-" + (date.getMonth() + 1),
	    day : date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate(),
	    minute : date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + " " + 
	    date.getHours() + ":" + (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) 
	};
	ban = {
		src:this.src,
		show:this.show,
		time :time
	};
	mongodb.open(function(err,db){
		if(err){
			return callback(err);
		}
		db.collection('banners',function(err,collection){
			if(err){
				mongodb.close();
				return callback(err); 
			}
			collection.insert(ban,{
				safe: true
			},function(err){
				mongodb.close();
				if(err){
					callback(err);
				}
				callback(null);
			})
		})
	})
};
//获取所有轮播图
banner.getAll = function(callback){
	mongodb.open(function(err,db){
		if(err){
			return callback(err);
		}
		db.collection('banners',function(err,collection){
			if(err){
				mongodb.close();
				return callback(err);
			}
			collection.find().toArray(function(err,docs){
				if(err){
					return callback(err);
				}
				callback(null,docs);  
			})
		});
	});
};
//根据ID删除图片
banner.remove = function(id,callback){
	mongodb.open(function(err,db){
		if(err){
			return callback(err); 
		}
		db.collection('banners',function(err,collection){
			if(err){
				mongodb.close();
				return callback(err);
			}
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
//获取单张轮播图
banner.getOne = function(id,callback){
	mongodb.open(function(err,db){
		if(err){
			return callback(err);
		}
		db.collection('banners',function(err,collection){
			if(err){
				return callback(err);
			}
			collection.findOne({
				'_id':id
			},function(err,ban){
				if(err){
					return callback(err);
				}
				callback(null,ban);
			})
		});
	});
}
//修改图片
banner.update = function(id,src,show,callback){
	mongodb.open(function(err,db){
		if(err){
			return callback(err);
		}
		db.collection('banners',function(err,collection){
			if(err){
				return callback(err);
			}
			collection.update({
				"_id":id
			},{
				$set:{
					src:src,
					show:show
				}
			},function(err){
				if(err){
					return callback(err);
				}
				callback(null);
			})
		});
	});
}

