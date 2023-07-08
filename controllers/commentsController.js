const Comment = require('../models/comments');
const Like = require('../models/like');
const Post = require('../models/post')

module.exports.addComment = async (req, res) => {
    try {
        const {postId} = req.params
        const userId = req.user.userId;
        const { comment } = req.body
        console.log(comment);
        if (!comment) {
            return res.send({
                success: false,
                msg: "required field missing "
            })
        }

        const post= await Post.findById(postId)
        if(!post){
            return res.send({
                success: false,
                msg: "Post Not Found"
            })
        }
        const createComment = new Comment({
            comment,
            user:userId,
            post:postId

        })

        await createComment.save()
        post.comments.push(createComment)
        await post.save()

        res.send({
            createComment,
            post
        })



    } catch (err) {
        res.send(err)
    }
}

module.exports.showComment = async (req, res) => {
    const { postId } = req.params;
  
    try {
      const post = await Post.findById(postId).populate('comments');
  
      if (!post) {
        return res.send({
          success: false,
          msg: "Post Not Found",
        });
      }
  
      const allComments = post.comments;
  
      res.send({
        success: true,
        comments: allComments,
      });
    } catch (err) {
      console.error(err);
      res.send(err);
    }
  };
  

module.exports.updateComment=async(req,res)=>{
    const {commentId}=req.params
    const {newComment}=req.body

    try{

        const updateComment=await Comment.findById(commentId)
        if(!updateComment){
            return res.send({
                success: false,
                msg: "Comment Not Found"
            })
        }

        updateComment.comment=newComment
        await updateComment.save()

        return res.send({
            success: true,
            msg:'Comment updated successfully',
            newComment:updateComment.comment
        })

    }catch(err){
        console.log(err);
        return res.send(err)
    }
}

module.exports.deleteComment=async(req,res)=>{
    const {commentId}=req.params


   try{
    const comment= await Comment.findById(commentId)
    if(!comment){
        return res.send({
            success: false,
            msg: "Comment Not Found",
          });
    }

    await comment.deleteOne()
    const postId=comment.post

    await Post.findByIdAndUpdate(postId,{$pull:{comments:commentId}})
    await Like.deleteMany({comment: commentId})

    res.send({
        success: true,
        msg: "Comment deleted"
    })
   }catch(err){
    console.log(err);
    return res.send(err)
   }
}