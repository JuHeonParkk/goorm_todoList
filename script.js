const list = document.querySelector("#list");
const createBtn = document.querySelector("#addBtn");

// 초기엔 빈 배열로 시작
let todos = [];

// createBtn 클릭 이벤트 핸들러
createBtn.addEventListener("click", createNewTodo);
function createNewTodo() {
  // 새로운 todo 아이템 생성
  const item = {
    id: Date.now(),
    title: "",
    completed: false,
  };

  // 배열에 새로운 아이템 추가
  // unshift() : 배열의 맨 앞에 요소를 추가
  todos.unshift(item);

  // 새로운 todo 아이템을 화면에 추가
  const {
    itemElement,
    titleElement,
    checkBoxElement,
    editBtnElement,
    deleteBtnElement,
  } = createTodoElement(item);
  list.prepend(itemElement); // list 요소에 새로운 아이템 추가

  titleElement.removeAttribute("disabled"); // title 입력창 활성화
  titleElement.focus(); // title 입력창에 포커스 설정
  saveListLocalStorage(); // localStorage에 todos 배열 저장
}

// 새로운 todo 아이템을 todos 배열에 추가
// HTML 요소 생성
function createTodoElement(item) {
  // list div 요소 생성
  const itemElement = document.createElement("div");
  itemElement.classList.add("item");

  // checkbox 요소 생성
  const checkBoxElement = document.createElement("input");
  checkBoxElement.type = "checkbox";
  checkBoxElement.checked = item.completed; // 체크박스 상태 설정

  // 체크박스가 true이면 completed 클래스 추가
  if (item.completed) {
    itemElement.classList.add("completed");
  }

  // 할 일 텍스트 요소 생성
  const titleElement = document.createElement("input");
  titleElement.type = "text";
  titleElement.value = item.title;
  titleElement.placeholder = "할 일을 입력하세요";

  // button action 요소 생성
  const actionsElement = document.createElement("div");
  actionsElement.classList.add("actions");

  // edit 버튼 요소 생성
  const editBtnElement = document.createElement("button");
  editBtnElement.classList.add("material-icons");
  editBtnElement.innerText = "edit"; // 버튼 텍스트 설정

  // delete 버튼 요소 생성
  const deleteBtnElement = document.createElement("button");
  deleteBtnElement.classList.add("material-icons", "remove-btn");
  deleteBtnElement.innerText = "remove_circle"; // 버튼 텍스트 설정

  // HTML 문서 안에 새로운 요소 추가(.append)
  actionsElement.append(editBtnElement, deleteBtnElement); // actions 요소에 button 추가(actionElement에 자식요소 추가)

  itemElement.append(checkBoxElement, titleElement, actionsElement); // item 요소에 checkbox, title, actions 추가(itemElement에 자식요소 추가)

  // checkbox 이벤트
  // change : 체크박스 상태가 변경되었을 때 발생생
  checkBoxElement.addEventListener("change", () => {
    item.completed = checkBoxElement.checked; // checkbox 상태에 따라 completed 속성 업데이트

    if (item.completed) {
      itemElement.classList.add("completed");
    } else {
      itemElement.classList.remove("completed");
    }
  });

  // title 입력 이벤트
  titleElement.addEventListener("input", () => {
    item.title = titleElement.value; // title 입력값을 item의 title 속성에 저장
    saveListLocalStorage(); // localStorage에 저장
  });

  // blur : 객체가 포커스가 벗어날 때 발생
  titleElement.addEventListener("blur", () => {
    titleElement.setAttribute("disabled", ""); // title 입력창 비활성화

    saveListLocalStorage(); // localStorage에 변경된 todos 배열 저장
  });

  // edit 버튼 클릭 이벤트
  editBtnElement.addEventListener("click", () => {
    titleElement.removeAttribute("disabled"); // title 입력창 활성화
    titleElement.focus(); // title 입력창에 포커스 설정
  });

  // delete 버튼 클릭 이벤트
  deleteBtnElement.addEventListener("click", () => {
    // todos 배열에서 해당 아이템 제거
    // filter() : 배열의 각 요소를 순회하면서 조건에 맞는 요소만 남김
    // 빼고 싶은 걸 제외하고 나머지 요소를 새로운 배열로 반환
    todos = todos.filter((todo) => todo.id !== item.id);
    itemElement.remove(); // HTML 요소에서 아이템 제거
    saveListLocalStorage(); // localStorage에 변경된 todos 배열 저장
  });

  return {
    itemElement,
    titleElement,
    checkBoxElement,
    editBtnElement,
    deleteBtnElement,
  };
}

// localStorage
function saveListLocalStorage() {
  // todos 배열을 JSON 문자열로 변환하여 localStorage에 저장
  const data = JSON.stringify(todos);
  localStorage.setItem("todos", data);
}

// localStorage에서 todos 배열을 불러오기
function loadListLocalStorage() {
  // localStorage에서 todos 데이터를 가져와서 JSON 문자열을 객체로 변환
  const data = localStorage.getItem("todos");
  if (data) {
    todos = JSON.parse(data);
  } else {
    todos = []; // 데이터가 없으면 빈 배열로 초기화
  }
}

function displayTodos() {
  loadListLocalStorage(); // localStorage에서 todos 배열 불러오기
  for (let i = 0; i < todos.length; i++) {
    const item = todos[i];
    const { itemElement } = createTodoElement(item);
    list.append(itemElement); // list 요소에 아이템 추가
  }
}

displayTodos(); // 페이지 로드 시 todos 배열을 화면에 표시
