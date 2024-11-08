const quotes = [
  "When you have eliminated the impossible, whatever remains, however improbable, must be the truth.",
  "There is nothing more deceptive than an obvious fact.",
  "I ought to know by this time that when a fact appears to be opposed to a long train of deductions it invariably proves to be capable of bearing some other interpretation.",
  "I never make exceptions. An exception disproves the rule.",
  "What one man can invent another can discover.",
  "Nothing clears up a case so much as stating it to another person.",
  "Education never ends, Watson. It is a series of lessons, with the greatest for the last.",
];

let words = [];
let wordIndex = 0;
let startTime = Date.now();

const quoteElement = document.getElementById("quote");
const messageElement = document.getElementById("message");
const typedValueElement = document.getElementById("typed-value");
const modal = document.getElementById("modal");
const modalMessage = document.getElementById("modal-message");
const closeModal = document.getElementsByClassName("close")[0];
const recordList = document.getElementById("record-list");

document.getElementById("typed-value").disabled = true;

document.getElementById("icon").addEventListener("click", function () {
  document.body.classList.toggle("black-mode");
  document.body.classList.toggle("white-mode");
  document
    .getElementsByClassName("modal-content")[0]
    .classList.toggle("black-mode");
  document
    .getElementsByClassName("modal-content")[0]
    .classList.toggle("white-mode");

  const svgElement = document.getElementById("icon");
  svgElement.classList.toggle("invert-colors");

  if (document.body.classList.contains("black-mode")) {
    if (quoteElement.childNodes.length != 0)
      quoteElement.childNodes[wordIndex].className = "highlight_dark";
  } else {
    if (quoteElement.childNodes.length != 0)
      quoteElement.childNodes[wordIndex].className = "highlight_white";
  }
});

document.getElementById("start").addEventListener("click", () => {
  const quoteIndex = Math.floor(Math.random() * quotes.length); // 무작위 인덱스 생성
  const quote = quotes[quoteIndex]; // 무작위 인덱스 값으로 인용문 선택

  words = quote.split(" "); // 공백 문자를 기준으로 words 배열에 저장
  wordIndex = 0; // 초기화

  const spanWords = words.map(function (word) {
    return `<span>${word} </span>`;
  });

  // input 활성화
  document.getElementById("typed-value").disabled = false;

  // span 태그로 감싼 후 배열에 저장
  quoteElement.innerHTML = spanWords.join(""); // 하나의 문자열로 결합 및 설정
  quoteElement.childNodes[0].className = document.body.classList.contains(
    "black-mode"
  )
    ? "highlight_dark"
    : "highlight_white"; // 첫번째 단어 강조
  messageElement.innerText = ""; // 메시지 요소 초기화
  typedValueElement.value = ""; //입력 필드 초기화
  typedValueElement.focus(); // 포커스 설정
  startTime = new Date().getTime(); // 타이핑 시작 시간 기록
});

typedValueElement.addEventListener("input", () => {
  const currentWord = words[wordIndex]; // 현재 타이핑할 단어를 currentWord 에 저장
  const typedValue = typedValueElement.value; // 입력한 값을 typedValue에 저장

  // 애니메이션 클래스 추가
  typedValueElement.classList.add("input-grow");

  // 애니메이션이 끝난 후 클래스 제거
  typedValueElement.addEventListener(
    "animationend",
    () => {
      typedValueElement.classList.remove("input-grow");
    },
    { once: true }
  );

  if (typedValue === currentWord && wordIndex === words.length - 1) {
    // 마지막 단어까지 정확히 입력했는 지 체크
    const elapsedTime = new Date().getTime() - startTime; // 타이핑에 소요된 시간 계산
    const message = `CONGRATULATIONS! You finished in ${
      elapsedTime / 1000
    } seconds.`; // 타이핑 완료 메시지
    modalMessage.innerText = message; // 모달 메시지 설정
    modal.style.display = "block"; // 모달 표시

    // 최고 기록 갱신
    updateTopRecords(elapsedTime / 1000);

    // input 비활성화
    document.getElementById("typed-value").disabled = true;

    // 이벤트 리스너 비활성화
    typedValueElement.removeEventListener("click", () => {});
    typedValueElement.removeEventListener("input", () => {});
  } else if (typedValue.endsWith(" ") && typedValue.trim() === currentWord) {
    // 입력된 값이 공백으로 끝났는지와 공백을 제거한 값이 현재 단어와 일치하는 지 확인
    typedValueElement.value = ""; // 입력 필드 초기화하여 다음 단어 입력 준비
    wordIndex++; // 다음 단어로 이동
    for (const wordElement of quoteElement.childNodes) {
      // 모든 강조 표시 제거
      wordElement.className = ""; // 클래스 제거
    }
    quoteElement.childNodes[wordIndex].className =
      document.body.classList.contains("black-mode")
        ? "highlight_dark"
        : "highlight_white"; // 다음으로 타이핑할 단어에 클래스 추가
  } else if (currentWord.startsWith(typedValue)) {
    //현재 단어의 일부를 맞게 입력하고 있는 지 확인
    typedValueElement.className = ""; // 올바르면 클래스 제거
  } else {
    typedValueElement.className = "error"; // 틀리면 error 클래스 추가
  }
});

// 모달 닫기
closeModal.onclick = function () {
  modal.style.display = "none";
};

// 모달 외부 클릭 시 닫기
window.onclick = function (event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
};

// 최고 기록 갱신 함수
function updateTopRecords(newRecord) {
  let records = JSON.parse(localStorage.getItem("topRecords")) || [];
  records.push(newRecord);
  records.sort((a, b) => a - b);
  if (records.length > 5) {
    records = records.slice(0, 5);
  }
  localStorage.setItem("topRecords", JSON.stringify(records));
  displayTopRecords(records);
}

// 최고 기록 표시 함수
function displayTopRecords(records) {
  recordList.innerHTML = "";
  records.forEach((record, index) => {
    const li = document.createElement("li");
    li.textContent = `${index + 1}. ${record} seconds`;
    recordList.appendChild(li);
  });
}

// 페이지 로드 시 최고 기록 표시
document.addEventListener("DOMContentLoaded", () => {
  const records = JSON.parse(localStorage.getItem("topRecords")) || [];
  displayTopRecords(records);
});
