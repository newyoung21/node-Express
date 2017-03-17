var mongodb = require('./db');
function leave(company,telphone,address,content){
	this.company = company;
	this.telphone = telphone;
	this.address = address;
	this.content = content;
}

module.exports = leave;
//保存留言数据
leave.prototype.save = function(callback){
	var date = new Date();
	var time = {
	    date: date,
	    year : date.getFullYear(),
	    month : date.getFullYear() + "-" + (date.getMonth() + 1),
	    day : date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate(),
	    minute : date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + " " + 
	    date.getHours() + ":" + (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) 
	}

	var l = {
		company:this.company,
		telphone:this.telphone,
		address:this.address,
		content:this.content,
		time:time
	}
	mongodb.open(function(err,db){
		if(err){
			return callback(err);
		}

		db.collection('leaves',function(err,collection){
			if(err){
				return callback(err);
			}
			collection.insert(l,{
				safe: true
			},function(err){
				if(err){
					return callback(err);
				}
				callback(null);
			});
		});
	});
}
//获取全部留言
leave.getAll = function(callback){
	mongodb.open(function(err,db){
		if(err){
			return callback(err);
		}
		db.collection('leaves',function(err,collection){
			if(err){
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
}
//删除单个留言
leave.remove = function(id,callback){
	mongodb.open(function(err,db){
		if(err){
			return callback(err);
		}
		db.collection('leaves',function(err,collection){
			if(err){
				return callback(err);
			}
			collection.remove({
				'_id':id
			},function(err){
				if(err){
					return callback(err);
				}
				callback(null);
			})
		});
	})
}