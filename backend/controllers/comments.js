const commentsDAO = require('../models/commentsDAO');

exports.commentInsert = async (req, res) => {
    const commentData = req.body;
    try {
        await commentsDAO.insert(commentData, (resp) => {
            res.send(resp);
        });
    } catch (err) {
        console.log(err);
    }
};

exports.commentUpdate = async (req, res) => {
    const commentData = req.body;
    try {
        await commentsDAO.update(commentData, (resp) => {
            res.send(resp);
        });
    } catch (err) {
        console.log(err);
    }
};

exports.commentDelete = async (req, res) => {
    const { comment_id } = req.params;
    try {
        await commentsDAO.delete(comment_id, (resp) => {
            res.send(resp);
        });
    } catch (err) {
        console.log(err);
    }
};

exports.commentList = async (req, res) => {
    const comment_list = req.query;
    try {
        await commentsDAO.commentList(comment_list, (resp) => {
            res.send(resp);
        });
    } catch (err) {
        console.log(err);
    }
};

exports.comment = async (req, res) => {
    const { comment_id } = req.params;
    try {
        await commentsDAO.comment(comment_id, (resp) => {
            res.send(resp);
        });
    } catch (err) {
        console.log(err);
    }
};

exports.lectureCommentList = async(req,res)=>{
    const {course_id} = req.params;
    try{
        await commentsDAO.lectureCommentList(course_id,(resp)=>{
            res.send(resp);
        })
    }catch(error){
        console.log(error);
    }
};

exports.myLectureCommentList = async (req, res) => {
    const { user_id } = req.params;
    try {
      const resp = await commentsDAO.myLectureCommentList(user_id);
      res.status(resp.status).send(resp);
    } catch (error) {
      console.error(error);
      res.status(500).send({ status: 500, message: '내 댓글 조회 실패', error: error.message });
    }
  };
  