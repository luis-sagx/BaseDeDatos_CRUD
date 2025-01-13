async function fetchStudents() {
    const response = await fetch('/students');
    const students = await response.json();
    renderStudents(students);
}

async function addStudent(event) {
    event.preventDefault();
    const studentId = document.getElementById('student_id').value;
    const studentName = document.getElementById('name').value;

    const response = await fetch('/students/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ student_id: studentId, name: studentName }),
    });

    const result = await response.json();
    alert(result.message);
    fetchStudents();
}

async function deleteStudent(studentId) {
    const response = await fetch(`/students/${studentId}`, {
        method: 'DELETE',
    });

    const result = await response.json();
    alert(result.message);
    fetchStudents();
}

function renderStudents(students) {
    const tableBody = document.getElementById('students_table_body');
    tableBody.innerHTML = '';

    students.forEach(student => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${student.student_id}</td>
            <td>${student.name}</td>
            <td><button onclick="deleteStudent('${student.student_id}')">Eliminar</button></td>
        `;
        tableBody.appendChild(row);
    });
}

document.addEventListener('DOMContentLoaded', fetchStudents);