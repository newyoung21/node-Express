var mongodb = require('./db');
function user(user){
	this.role = user.role;
	this.name = user.name;
	this.password = user.password;
}
module.exports = user;

user.prototype.save = function(callback){
	var us = {
		role:this.role,
		name:this.name,
		password:this.password 
	}

	mongodb.open(function(err,db){
		if(err){
			return callback(err);
		}
		db.collection('users',function(err,collection){
			if(err){
				return callback(err);
			}
			collection.insert(us,{
        		safe: true
      		},function(err,user){
				if(err){
					return callback(err)
				}
				callback(null,user[0]);
			});
		})
	})
}
//读取用户信息
user.getUser = function(name,callback){
	mongodb.open(function(err,db){
		if(err){
			return callback(err);
		}
		db.collection('users',function(err,collection){
			if(err){
				return callback(err);
			}
			collection.findOne({
				'name':name
			},function(err,user){
				if(err){
					return callback(err);
				}
				callback(err,user);
			})
		});
	})
}
//获取所有用户信息
user.getAll = function(callback){
	mongodb.open(function(err,db){
		db.collection('users',function(err,collection){
			if(err){
				return callback(err);
			}
			collection.find().toArray(function(err,user){
				if(err){
					return callback(err);
				}
				callback(null,user);
			});
		})
	});
}