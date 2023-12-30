// 12.28 나현 추가

const db = require('../src/database');

const sql = {
    commentList: `SELECT c.comment_id, u.nickname, DATE_FORMAT(c.createdAt, '%Y-%m-%d') as createdAt
               FROM users u INNER JOIN comments c ON u.user_id = c.user_id
               ORDER BY c.comment_id DESC
               LIMIT ?, ?;`, // 댓글번호로 내림차순 (GROUP BY c.comment_id 해야하나?)
    comment: `SELECT c.comment_id, u.nickname, content, DATE_FORMAT(c.createdAt, '%Y-%m-%d') as createdAt
            FROM users u INNER JOIN comments c ON u.user_id = c.user_id
            WHERE c.comment_id = ?;`, // 특정 강의 댓글 상세조회
    insert: `INSERT INTO comments(content, course_id, user_id)
             VALUES(?, ?, ?)`,
    delete: 'DELETE FROM comments WHERE comment_id = ?',
    totalCount: 'SELECT COUNT(*) as cnt FROM comments' // 총 댓글 개수
};

const commentsDAO = {
    commentList: async (item, callback) => { // data 들어온거 확인 완료!
        const no = Number(item.no) - 1 || 0;
        const size = Number(item.size) || 10;

        try {
            const [resp] = await db.query(sql.commentList, [no * size, size]);
            const [cntResp] = await db.query(sql.totalCount);
            const totalPage = Math.ceil(cntResp[0].cnt / size);
            callback({ status: 200, message: '댓글 리스트 조회 성공', pageno: no + 1, pagesize: size, total: cntResp[0].cnt, totalPage, data: resp });
        } catch (error) {
            console.error(error);
            callback({ status: 500, message: '댓글 리스트 조회 실패', error: error });
        }
    },

    comment: async (id, callback) => { // data 들어온거 확인 완료!
        try {
            const resp = await db.query(sql.meet, [id]);
            if (resp.length === 0) { // comment_id에 해당하는 댓글이 없다면
                callback({ status: 500, message: '댓글 상세 조회 실패', error: error });
            } else {
                callback({ status: 200, message: '댓글 상세 조회 성공', data: resp[0] });
            }
        } catch (error) {
            console.error(error);
            callback({ status: 500, message: '댓글 상세 조회 실패', error: error });
        }
    },

    insert: async (item, callback) => { // data 들어온거 확인 완료!
        console.log(item);
        try {
            const resp = await db.query(sql.insert, [item.content, item.course_id, item.user_id]);
            callback({ status: 200, message: '댓글 생성 성공', data: resp });
        } catch (error) {
            console.error(error);
            callback({ status: 500, message: '댓글 생성 실패', error: error });
        }
    },


    delete: async (id, callback) => { // data 들어온거 확인 완료!
        try {
            const resp = await db.query(sql.delete, [id]);
            if (resp.affectedRows === 0) { //  해당 조건에 맞는 행이 존재하지 않는다면 affectedRows가 0
                callback({ status: 500, message: '댓글 삭제 실패', error: error });
            } else {
                callback({ status: 200, message: '댓글 삭제 성공' });
            }
        } catch (error) {
            console.error(error);
            callback({ status: 500, message: '댓글 삭제 실패', error: error });
        }
    },
};

module.exports = commentsDAO;