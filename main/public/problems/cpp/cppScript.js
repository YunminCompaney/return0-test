let editor; // CodeMirror 인스턴스를 전역 변수로 선언

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

                // Prism은 텍스트 컨텐츠로 설정하기 전에 클래스를 확인
                if (!modalCode.classList.contains('language-cpp')) {
                    modalCode.classList.add('language-cpp');
                }

                // 코드 설정
                modalCode.textContent = code;

                // 강제로 Prism 다시 적용
                Prism.highlightAllUnder(modal);
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
    console.log(submitButton); // submitButton 요소가 제대로 선택되었는지 확인

    const answerModal = document.getElementById("answerModal");
    const modalTitle = document.getElementById("modalTitle");
    const answerText = document.getElementById("answerText");
    const saveAnswerButton = document.getElementById("saveAnswer");
    const answerCloseSpan = answerModal.querySelector(".close");

    // CodeMirror 인스턴스 생성
    editor = CodeMirror.fromTextArea(answerText, {
        lineNumbers: true,
        mode: "text/x-c++src",
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
    console.log("Submit");
    event.preventDefault();

    const confirmation = confirm("제출하면 답안을 수정하실 수 없습니다. 제출하시겠습니까?");
    if (confirmation) {
        // 학번 입력 받기
        const studentId = prompt("학번과 이름을 입력해주세요:");
        if (!studentId) {
            alert("학번과 이름을 입력해야 제출할 수 있습니다.");
            return;
        }

        // 압축 파일 생성
        const zip = new JSZip();

        // 코드 파일을 저장할 폴더 생성
        const codeFolder = zip.folder("code");

        // 모든 문제 답안을 하나의 텍스트 파일로 저장
        let textContent = "📝 시험 답안지\n\n";

        // 객관식 문제 답안 추가
        textContent += "==== 객관식 문제 ====\n\n";
        document.querySelectorAll('select').forEach((selectElement, index) => {
            const selectedAnswer = selectElement.value;
            const questionText = selectElement.closest('li').querySelector('p').textContent;
            const answerText = selectElement.options[selectElement.selectedIndex].textContent;

            textContent += `문제 ${index + 1}: ${questionText.trim()}\n`;
            textContent += `답변: ${selectedAnswer} (${answerText})\n\n`;
        });

        // 단답형 문제 답안 추가 (텍스트 입력 필드)
        textContent += "==== 단답형 문제 ====\n\n";
        document.querySelectorAll('input[type="text"]').forEach((inputElement, index) => {
            const questionText = inputElement.closest('li').querySelector('p').textContent;
            const answer = inputElement.value;

            textContent += `문제 ${index + 1}: ${questionText.trim()}\n`;
            textContent += `답변: ${answer}\n\n`;
        });

        // 텍스트 파일을 압축 파일의 루트에 저장
        zip.file('answers.txt', textContent);

        // 서답형 문제는 별도 파일로 저장
        document.querySelectorAll('.answer-button').forEach(button => {
            const questionNumber = button.getAttribute('data-question');
            const code = localStorage.getItem(`answer${questionNumber}`) || '';

            // 서답형 문제 코드를 code 폴더 안에 저장
            codeFolder.file(`problem${questionNumber}.cpp`, code);
        });

        // 압축 파일 생성 및 다운로드
        zip.generateAsync({ type: 'blob' }).then((content) => {
            sendToWebhook(content, studentId);

            // 데이터 처리 후에 localStorage 삭제
            document.querySelectorAll('.answer-button').forEach(button => {
                const questionNumber = button.getAttribute('data-question');
                localStorage.removeItem(`answer${questionNumber}`);
            });
        });

        console.log("답안이 제출되었습니다.");
        window.location.href = '/submitComplete.html';
    }
}

const sendToWebhook = async(zipBlob, studentId) => {
    const formData = new FormData();
    formData.append('username', 'Submit webhook'); // Webhook 이름
    formData.append('content', `답안이 제출되었습니다!\n\n학번: **${studentId}**\n응시 언어: **C++**`); // Webhook 내용
    formData.append('attachment', zipBlob, `${studentId}_answers.zip`); // 파일을 FormData에 추가

    const response = await fetch('https://discord.com/api/webhooks/1350488946450239600/gJUPOl8M7JPTaVamj2UXQ52HzopeR8pGZkpNQBLTP_Mb1wsrLqKxyp3iWVaStx9W9_j8', {
        method: 'POST',
        body: formData
    });

    if (response.ok) {
        console.log('파일이 성공적으로 전송되었습니다.');
    } else {
        console.error('파일 전송 중 오류 발생:', response.status);
    }
};