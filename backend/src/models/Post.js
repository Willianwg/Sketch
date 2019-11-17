const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

const PostSchema = new mongoose.Schema({
	image:String,
	description:String,
	author:{
		type:mongoose.Schema.Types.ObjectId,
		ref:"User",
	},
	comments:[{
		author:{
			type:mongoose.Schema.Types.ObjectId,
			ref:"User",
		},
		comment:String,
	}],
	createdAt:{
		type:Date,
		default:Date.now,
	},
	
},{
	toJSON:{
		virtuals:true
	}
});

PostSchema.virtual("image_url").get(function(){
	return `http://localhost:3001/files/${this.image}`;
});

PostSchema.plugin(mongoosePaginate);

module.exports = mongoose.model("Post", PostSchema);