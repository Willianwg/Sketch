const Post = require("../models/Post");
const path = require("path");
const fs = require("fs");

module.exports={
	
	async store(req, res){
		try{
		const { filename } = req.file;
		const { description } = req.body;
		const { user_id } = req.headers;
		
		const post = await Post.create({
			image:filename,
			description,
			author:user_id,
		});
		
		return res.json(post);
		}catch(err){
			return res.status(400).send({ error: err });
		};
	},
	
	async index(req, res){
		const { page = 1 } = req.query;
		const post = await Post.paginate({},{ page, limit:6, populate:["author", "comments.author"], sort:"-createdAt" });

		return res.json(post);
	},
	
	async show(req, res){
		const { user_id } = req.params;
		const post = await Post.find({ author:user_id });
		
		return res.json(post);
	},
	
	async destroy(req, res){
		const { post_id } = req.params;
		
		const post = await Post.findById(post_id);
		fs.unlink(path.resolve(__dirname,"..","..","uploads",`${post.image}`), err=>{ if(err)console.log(err); });
		
		await post.remove();
		
		return res.send();
	}

};