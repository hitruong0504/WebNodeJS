let btnLocal, btnSession;


function displayStudent(Student, id) {
    let tbody = document.getElementById(id);
    let tr = document.createElement("tr");
    let tdId = document.createElement("td");
    let tdName = document.createElement("td");
    let tdAge = document.createElement("td");
    tdId.innerHTML = Student.id;
    tdName.innerHTML = Student.name;
    tdAge.innerHTML = Student.age;
    tr.appendChild(tdId);
    tr.appendChild(tdName);
    tr.appendChild(tdAge);
    tbody.appendChild(tr);    
}

window.onload = function () {
    btnLocal = document.getElementById("btnLocal");
    btnSession = document.getElementById("btnSession");

    let LocalStudents = JSON.parse(window.localStorage.getItem("student"));
    let SessionStudents = JSON.parse(window.sessionStorage.getItem("student"));

    if (!LocalStudents) { 
        LocalStudents = [];
    } 
    
    LocalStudents.forEach(student => displayStudent(student, "table1"));
    
        
    if (!SessionStudents) { 
        SessionStudents = [];
    }

    SessionStudents.forEach(student => 
        displayStudent(student, "table2")
    );

    btnLocal.onclick = function () {
        let name = document.getElementById("name").value;
        let age = document.getElementById("age").value;
        let id = LocalStudents.length + 1;
        document.getElementById("name").value = "";
        document.getElementById("age").value = "";
        let student = { id, name, age };
        LocalStudents.push(student);
        window.localStorage.setItem("student", JSON.stringify(LocalStudents));
        displayStudent(student, "table1");
    }

    btnSession.onclick = function () { 
        let name = document.getElementById("name").value;
        let age = document.getElementById("age").value;
        let id = SessionStudents.length + 1;
        document.getElementById("name").value = "";
        document.getElementById("age").value = "";
        let student = { id, name, age };
        SessionStudents.push(student);
        window.sessionStorage.setItem("student", JSON.stringify(SessionStudents));
        displayStudent(student, "table2");
    }
}