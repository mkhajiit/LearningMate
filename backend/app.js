const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const testRouter = require('./routes/test');
const meetRouter = require('./routes/meets'); // 민경 추가
const participantRouter = require('./routes/participants'); // 민경 추가
const reviewRouter = require('./routes/reviews'); // 민경 추가
<<<<<<< HEAD:learningmate-server/app.js

const app = express();
const session = require('express-session');
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

=======
const app = express();
const session = require('express-session');
const courseRouter = require('./routes/courses'); // 나현 추가
const commentRouter = require('./routes/comments'); // 나현 추가
const bookmarkRouter = require('./routes/bookmark'); // 나현 추가
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
//정적경로를 public으로 설정
>>>>>>> 1b42eeed5b96900da7e62beb1862a35aeb2ccdae:backend/app.js
app.use(express.static(path.join(__dirname, 'public')));
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
//origin: 클라이언트의 주소 , 다른 포트로 쿠키를 보낼때는 cors 옵션에  credentials: true 추가해야함
<<<<<<< HEAD:learningmate-server/app.js
app.use(
    cors({
        origin: `https://web-learningmate-5r422alqajqbni.sel4.cloudtype.app`,
        credentials: true,
    })
);
=======
app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
>>>>>>> 1b42eeed5b96900da7e62beb1862a35aeb2ccdae:backend/app.js
//saveUninitialized는 세션이 초기화될 때(예: 사용자가 웹사이트에 처음 방문했을 때) 세션을 저장할지 여부를 결정합니다.
//resave는 요청이 완료된 후(통신 후)에 세션을 저장할지 여부를 결정합니다.
app.use(
    session({
        secret: 'login session',
        resave: false,
        saveUninitialized: false,
        cookie: {
            httpOnly: true, // 클라이언트에서 쿠키에 접근하는 것을 방지
            secure: true, // HTTPS를 통해서만 쿠키를 전송하도록 설정 (배포 시에는 true로 변경) 로컬은 http 쓰기때문에 false로 사용
            // maxAge: 1800000, // 쿠키의 만료 기간 (밀리초 단위, 여기서는 30분)1800000 maxAge 옵션을 0이아니라 설정하지 않으면 브라우저 종료시 세션이 삭제됨
            sameSite: 'none',
            domain: 'web-learningmate-5r422alqajqbni.sel4.cloudtype.app', //배포환경) domain은 https://를 붙이지마세요
        },
    })
);
//라우터
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use(testRouter);

app.use('/meets', meetRouter); // 민경 추가
app.use('/participants', participantRouter); // 민경 추가
app.use('/reviews', reviewRouter); // 민경 추가

app.use('/courses', courseRouter); // 나현 추가
app.use('/comments', commentRouter); // 나현 추가
app.use('/bookmark', bookmarkRouter); // 나현 추가

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;
