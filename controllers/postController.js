const User = require('../models/user')
const Post = require('../models/post')
const Comment = require('../models/comments')
const Like = require('../models/like')

module.exports.createPost = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { content } = req.body
        if (!content) {
            return res.send({
                success: false,
                msg: "required field missing "
            })
        }
        console.log(userId);

        const post = new Post({
            content,
            user: userId,
        })
        await post.save();

        res.send({
            success: true,
            msg: "Post Created Successfully",
            post
        })
    } catch (err) {
        res.send(err)
    }
}

module.exports.showPost = async (req, res) => {
    const userId = req.user.userId;

    const post = await Post.find({ user: userId })
    if (!post) {
        return res.send({
            success: false,
            msg: "Post Not Found"
        })
    }

    res.send(post)
}

module.exports.updatePost = async (req, res) => {
    const { postId } = req.params
    const { content } = req.body;
    try {
        const post = await Post.findById(postId)

        if (!post) {
            return res.send({
                success: false,
                msg: "Post Not Found"
            })
        }

        post.content = content

        await post.save()
        return res.status(200).json({ message: 'Post updated successfully', post });
    } catch (err) {
        res.send({
            success: false,
            msg: "Error in updating Post",
            err
        })
    }
}

module.exports.deletePost = async (req, res) => {
    const { postId } = req.params;
  
    try {
      // Delete all comments associated with the post
      await Comment.deleteMany({ post: postId });
      await Like.deleteMany({post: postId})
      
      const delpost = await Post.findById(postId);
  
      if (!delpost) {
        return res.send({
          success: false,
          msg: "Post Not Found",
        });
      }
  
      // Remove the post
      await delpost.deleteOne();
  
      return res.send({
        success: true,
        msg: "Post deleted successfully",
      });
    } catch (err) {
        console.log(err);
      res.send(err);
    }
  };
  