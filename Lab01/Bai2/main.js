const SERVER = "https://web-502070.web.app/lab1/students.json";
let btnFetch, btnAjax, tBody, notification;

window.addEventListener("load", () => {
    btnFetch = document.getElementById("btnFetch");
    btnAjax = document.getElementById("btnAjax");
    tBody = document.getElementById("table-body");
    notification = document.getElementById("notification");

    btnFetch.addEventListener("click", loadByFetch);
    btnAjax.addEventListener("click", loadByAjax);
})

function loadByFetch() { 
    fetch(SERVER)
        .then(response => response.json())
        .then(json => {
            let students = json.data;
            tBody.innerHTML = "";
            displayStudents(students);
            notification.innerHTML = "Load by Fetch";
        }).catch(err => console.log(err));
}

function loadByAjax() { 
    let xhr = new XMLHttpRequest();
    xhr.addEventListener("load", e => { 
        if (xhr.readyState === 4 && xhr.status === 200) {
            let json = xhr.response;
            let students = json.data;
            tBody.innerHTML = "";
            displayStudents(students);
            notification.innerHTML = "Load by Ajax";
        }else {
            console.log("Error");
        }
    })
    xhr.open("GET", SERVER, true);
    xhr.responseType = "json";
    xhr.send();
}

function displayStudents(students) {
    students.forEach(student => {
        let tr = document.createElement("tr");
        let td1 = document.createElement("td");
        let td2 = document.createElement("td");
        let td3 = document.createElement("td");
        
        td1.innerHTML = student.id;
        td2.innerHTML = student.name;
        td3.innerHTML = student.age;

        tr.appendChild(td1);
        tr.appendChild(td2);
        tr.appendChild(td3);

        tBody.appendChild(tr);
    });
}