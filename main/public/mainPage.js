function selectLanguage(language) {
    // 각 언어에 맞는 시험 페이지로 이동
    switch(language) {
        case 'python':
            window.location.href = './problems/python/pythonProblem.html';
            break;
        case 'cpp':
            window.location.href = './problems/cpp/cppProblem.html';
            break;
        case 'javascript':
            window.location.href = './problems/javascript/jsProblem.html';
            break;
        default:
            alert('잘못된 선택입니다.');
    }
}