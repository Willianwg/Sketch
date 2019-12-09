const Post = require("../models/Post");

module.exports ={
	async store(req, res){
		const { comment } = req.body;
		const { post_id } = req.params;
		const { user_id } = req.headers;
		
		const post = await Post.findById(post_id);
		
		if(! post )
			return res.status(400).send({ error:"Post not found" });
		
		post.comments.push({ author:user_id, comment });
		await post.save();
		
		return res.json(post);
		
	},
	
};