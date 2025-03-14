document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById("codeModal");
    const modalCode = document.getElementById("modalCode");
    const span = document.getElementsByClassName("close")[0];

    // 모달을 초기에는 숨김
    modal.style.display = "none";

    const fileMapping = {
        'src1': 'num1.cpp',
        'src2': 'num2.cpp',
        'src3': 'num3.cpp',
        'src4': 'num4.cpp',
        'src5': 'num5.cpp'
    };

    // 소스 버튼 클릭 처리
    Object.keys(fileMapping).forEach(buttonId => {
        const button = document.getElementById(buttonId);
        if (!button) return; // 버튼이 존재하지 않는 경우 처리

        button.addEventListener('click', async function() {
            try {
                modal.style.display = "flex";
                modalCode.textContent = "Loading..."; // 로딩 표시

                const response = await fetch(`/source/${fileMapping[buttonId]}`);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const code = await response.text();
                modalCode.textContent = code;

                // 코드 하이라이팅 설정
                Prism.highlightElement(modalCode);
            } catch (error) {
                modalCode.textContent = `Error: ${error.message}`;
                console.error('파일을 불러오는 중 오류가 발생했습니다:', error);
            }
        });
    });

    // 모달 닫기 버튼
    if (span) {
        span.addEventListener('click', () => {
            modal.style.display = "none";
        });
    }

    // 모달 외부 클릭시 닫기
    document.addEventListener('click', (event) => {
        if (event.target === modal) {
            modal.style.display = "none";
        }
    });

    // ESC 키로 모달 닫기
    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && modal.style.display === "flex") {
            modal.style.display = "none";
        }
    });

    // 제출 버튼 클릭 시 알림 표시
    const submitButton = document.getElementById('submit-button');
    const answerModal = document.getElementById("answerModal");
    const modalTitle = document.getElementById("modalTitle");
    const answerText = document.getElementById("answerText");
    const saveAnswerButton = document.getElementById("saveAnswer");
    const answerCloseSpan = answerModal.querySelector(".close");
    let editor; // CodeMirror 인스턴스를 전역 변수로 선언

    // CodeMirror 인스턴스 생성
    editor = CodeMirror.fromTextArea(answerText, {
        lineNumbers: true,
        mode: "javascript",
        theme: "monokai",
        indentUnit: 4,
        tabSize: 4,
        autoCloseBrackets: true,
        matchBrackets: true,
        lineWrapping: true
    });

    // 제출 버튼 클릭 시 알림 표시 및 서답형 답안 초기화
    submitButton.addEventListener('click', handleSubmit);
    // 답변 버튼 클릭 이벤트
    document.querySelectorAll('.answer-button').forEach(button => {
        button.addEventListener('click', () => {
            const questionNumber = button.getAttribute('data-question');
            modalTitle.textContent = `서답형 ${questionNumber}번 답변`;
            answerModal.style.display = "block";
            const savedAnswer = localStorage.getItem(`answer${questionNumber}`) || '';
            editor.setValue(savedAnswer);
            editor.refresh(); // CodeMirror 리프레시
        });
    });

    // 답변 저장 버튼 클릭 이벤트
    saveAnswerButton.addEventListener('click', () => {
        const questionNumber = modalTitle.textContent.split(' ')[1].replace('번', '');
        localStorage.setItem(`answer${questionNumber}`, editor.getValue());
        answerModal.style.display = "none";
    });

    // 답변 모달 닫기
    answerCloseSpan.addEventListener('click', () => {
        answerModal.style.display = "none";
    });

    // 답변 모달 외부 클릭시 닫기
    window.addEventListener('click', (event) => {
        if (event.target === answerModal) {
            answerModal.style.display = "none";
        }
    });

    // ESC 키로 답변 모달 닫기
    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && answerModal.style.display === "block") {
            answerModal.style.display = "none";
        }
    });

    // 모달이 열릴 때 CodeMirror 리프레시
    answerModal.addEventListener('shown.bs.modal', function() {
        editor.refresh();
    });

    // 윈도우 리사이즈 시 CodeMirror 리프레시
    window.addEventListener('resize', function() {
        editor.refresh();
    });
});

function handleSubmit(event) {
    event.preventDefault(); // 기본 제출 동작 방지
    const confirmation = confirm("제출하면 답안을 수정하실 수 없습니다. 제출하시겠습니까?");
    if (confirmation) {
        // 서답형 답안 초기화
        document.querySelectorAll('.answer-button').forEach(button => {
            const questionNumber = button.getAttribute('data-question');
            localStorage.removeItem(`answer${questionNumber}`);
        });

        // CodeMirror 에디터 초기화
        if (editor) {
            editor.setValue('');
        }

        // 답변 모달 닫기
        const answerModal = document.getElementById("answerModal");
        if (answerModal) {
            answerModal.style.display = "none";
        }

        // 여기에 제출 로직 추가 (예: 서버로 데이터 전송)
        console.log("답안이 제출되었습니다.");

        // 제출 후 페이지 새로고침 또는 다른 페이지로 리다이렉트
        // window.location.reload(); // 페이지 새로고침
        // window.location.href = "/submission-complete"; // 제출 완료 페이지로 이동
    }

}