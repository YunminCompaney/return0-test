const express = require('express');
const path = require('path');
const app = express();
const port = 3000;

// 정적 파일 제공
app.use(express.static(path.join(__dirname, '..', 'public')));

// 언어별 소스 코드 파일 요청 처리
app.get('/source/:filename', (req, res) => {
    const { filename } = req.params;
    let filePath;

    // 파일 이름에 따라 언어 결정
    if (filename.endsWith('.cpp')) {
        filePath = path.join(__dirname, '..', 'public', 'problems', 'cpp', 'cpp_files', filename);
    } else if (filename.endsWith('.py')) {
        filePath = path.join(__dirname, '..', 'public', 'problems', 'python', 'python_files', filename);
    } else if (filename.endsWith('.js')) {
        filePath = path.join(__dirname, '..', 'public', 'problems', 'javascript', 'js_files', filename);
    } else {
        return res.status(400).send('지원하지 않는 파일 형식입니다.');
    }

    res.sendFile(filePath, (err) => {
        if (err) {
            console.error('파일 전송 오류:', err);
            res.status(404).send('파일을 찾을 수 없습니다.');
        }
    });
});



// 언어별 문제 페이지 라우팅
app.get('/problems/:language', (req, res) => {
    const { language } = req.params;
    let problemPath;

    switch (language) {
        case 'cpp':
            problemPath = path.join(__dirname, '..', 'public', 'problems', 'cpp', 'cppProblem.html');
            break;
        case 'python':
            problemPath = path.join(__dirname, '..', 'public', 'problems', 'python', 'pythonProblem.html');
            break;
        case 'javascript':
            problemPath = path.join(__dirname, '..', 'public', 'problems', 'javascript', 'javascriptProblem.html');
            break;
        default:
            return res.status(400).send('잘못된 언어 선택입니다.');
    }

    res.sendFile(problemPath, (err) => {
        if (err) {
            console.error('파일 전송 오류:', err);
            res.status(404).send('파일을 찾을 수 없습니다.');
        }
    });
});

// 메인 페이지
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'mainPage.html'));
});

// 에러 핸들링 미들웨어
app.use((err, req, res, next) => {
    console.error('서버 에러:', err);
    res.status(500).send('서버 오류가 발생했습니다.');
});

// 서버 시작
app.listen(port, () => {
    console.log(`서버가 http://localhost:${port} 에서 실행 중입니다.`);
});
