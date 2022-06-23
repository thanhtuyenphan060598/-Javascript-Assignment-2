const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);
const inputName = $(".input-name");
const birthday = $(".select-birthday");
const formSubmit = $(".form-submit");
const tableList = $(".table-list");
const filterBirth = $(".filter-birthday");
const filterGender = $(".filter-gender");
const sortField = $(".sort-field");
const sortUpDown = $(".sort-up-down");
let data = JSON.parse(localStorage.getItem("data")) || [];
const filter = {};
const sortCase = {};

function render(data) {
  const htmls = data.map((item, index) => {
    return `<tr>
            <th scope="row">${index + 1}</th>
            <td>${item.name}</td>
            <td>${item.birthday}</td>
            <td>${item.gender}</td>
            <td>${item.time}</td>
            <td class="col-detele">
              <button onClick="deleteHandle(${index})" class="delete">
                <i class="fa fa-trash-o" aria-hidden="true"></i>
              </button>
            </td>
            </tr>`;
  });
  tableList.innerHTML = htmls.join("");
  renderBirthday();
}

function user(name, birthday, gender, time) {
  this.name = name;
  this.birthday = birthday;
  this.gender = gender;
  this.time = time;
}

function padTo2Digits(num) {
  return num.toString().padStart(2, "0");
}

function formatAMPM(date) {
  var hours = date.getHours();
  var minutes = date.getMinutes();
  var ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  minutes = minutes < 10 ? "0" + minutes : minutes;
  var strTime = hours + ":" + minutes + "" + ampm;
  return strTime;
}

function formatDate(date) {
  return (
    formatAMPM(new Date()) +
    " " +
    [
      padTo2Digits(date.getDate()),
      padTo2Digits(date.getMonth() + 1),
      date.getFullYear(),
    ].join("/")
  );
}

function renderBirthday() {
  const htmls = [];
  for (let i = 1990; i <= 2022; i++) {
    htmls.push(`<option value="${i}">${i}</option>`);
  }
  const filterHtmls = ["<option>Năm sinh</option>"];
  const unique = [...new Set(data.map((item) => item.birthday))];
  for (const item of unique) {
    filterHtmls.push(`<option value="${item}">${item}</option>`);
  }
  filterBirth.innerHTML = filterHtmls.join("");
  birthday.innerHTML = htmls.join("");
}

function submit(callback, e) {
  e.preventDefault();
  let name = inputName.value;
  let birthday1 = birthday.value;
  let gender = $('input[name="gender"]:checked').value;
  let time = formatDate(new Date());
  const userData = new user(name, birthday1, gender, time);
  data.push(userData);
  localStorage.setItem("data", JSON.stringify(data));
  inputName.value = "";
  callback(data);
  alert("Thêm Thành Công !!!");
}

function filterHandle(name, value) {
  filter[name] = value;
  const newData = data.filter((item) => {
    return Object.keys(filter).length > 1
      ? item.birthday === filter.filterBirthday &&
          item.gender === filter.filterGender
      : item.birthday === filter.filterBirthday ||
          item.gender === filter.filterGender;
  });
  sortFieldCaseHandle(newData);
  render(newData);
}

function sortFieldCaseHandle(data, name, value) {
  sortCase[name] = +value;
  //sort columns in descending order
  if (sortCase.sortFieldUpDown === 1) {
    if (sortCase.sortFieldTitle === 0) {
      data.sort((a, b) => {
        if (a.name > b.name) return -1;
        if (a.name < b.name) return 1;
        return 0;
      });
    }
    if (sortCase.sortFieldTitle === 1) {
      data.sort((a, b) => {
        return b.birthday - a.birthday;
      });
    }
    if (sortCase.sortFieldTitle === 2) {
      data.sort((a, b) => {
        if (a.gender > b.gender) return -1;
        if (a.gender < b.gender) return 1;
        return 0;
      });
    }
    if (sortCase.sortFieldTitle === 3) {
      console.log("1");
      data.sort((a, b) => {
        if (a.time > b.time) return -1;
        if (a.time < b.time) return 1;
        return 0;
      });
    }
  }
  // sort columns in ascending order
  else {
    if (sortCase.sortFieldTitle === 0) {
      data.sort((a, b) => {
        if (a.name > b.name) return 1;
        if (a.name < b.name) return -1;
        return 0;
      });
    }
    if (sortCase.sortFieldTitle === 1) {
      data.sort((a, b) => {
        return a.birthday - b.birthday;
      });
    }
    if (sortCase.sortFieldTitle === 2) {
      data.sort((a, b) => {
        if (a.gender > b.gender) return 1;
        if (a.gender < b.gender) return -1;
        return 0;
      });
    }
    if (sortCase.sortFieldTitle === 3) {
      console.log("1");
      data.sort((a, b) => {
        if (a.time > b.time) return 1;
        if (a.time < b.time) return -1;
        return 0;
      });
    }
  }
  render(data);
}
function deleteHandle(item) {
  const newData = data.filter((a, index) => index !== item);
  data = [...newData];
  localStorage.setItem("data", JSON.stringify(data));
  render(data);
  renderBirthday();
  alert("Xóa Thành Công !!!");
}

function listenFilterEvent() {
  formSubmit.addEventListener("submit", (e) => {
    submit(render, e);
  });
  filterBirth.addEventListener("change", (e) => {
    filterHandle(e.target.name, e.target.value);
  });
  filterGender.addEventListener("change", (e) => {
    filterHandle(e.target.name, e.target.value);
  });
  sortField.addEventListener("change", (e) => {
    sortFieldCaseHandle(data, e.target.name, e.target.value);
  });
  sortUpDown.addEventListener("change", (e) => {
    sortFieldCaseHandle(data, e.target.name, e.target.value);
  });
}

renderBirthday();
listenFilterEvent();
sortFieldCaseHandle(data, "sortFieldTitle", 0);
render(data);
