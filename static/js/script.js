document.addEventListener('DOMContentLoaded', () => {
    fetchStudents();  // Cargar estudiantes al inicio
    document.getElementById('searchForm').addEventListener('submit', searchStudent);
    document.getElementById('addStudentForm').addEventListener('submit', addStudent);
    document.getElementById('btnAgregar').addEventListener('click', openModal);  // Mostrar el modal
    document.getElementById('btnCerrarModal').addEventListener('click', closeModal);  // Cerrar el modal
});

// Función para abrir el modal
function openModal() {
    document.getElementById('agregarEstudiante').style.display = 'block';
}

// Función para cerrar el modal
function closeModal() {
    document.getElementById('agregarEstudiante').style.display = 'none';
}

// Función para obtener estudiantes desde la API
async function fetchStudents() {
    const response = await fetch('/students');
    const students = await response.json();
    renderStudents(students);
}

// Función para buscar un estudiante por su ID
async function searchStudent(event) {
    event.preventDefault();
    const studentId = document.getElementById('searchStudentId').value;
    const response = await fetch(`/students/${studentId}`);
    const student = await response.json();
    renderSearchResult(student);
}

// Función para agregar un nuevo estudiante
async function addStudent(event) {
    event.preventDefault();
    const student = {
        student_id: document.getElementById('student_id').value,
        nombre: document.getElementById('name').value,
        apellido: document.getElementById('lastName').value,
        edad: document.getElementById('age').value,
        correo: document.getElementById('email').value,
        fecha_nacimiento: document.getElementById('birthDate').value,
        genero: document.getElementById('gender').value,
        materias: document.getElementById('subjects').value,
        trabajo: document.getElementById('job').value
    };
    const response = await fetch('/students/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(student)
    });
    const result = await response.json();
    alert(result.message);
    fetchStudents(); // Vuelve a cargar los estudiantes
    closeModal();  // Cierra el modal después de agregar el estudiante
}

// Función para renderizar la lista de estudiantes en la tabla
function renderStudents(students) {
    const tableBody = document.getElementById('students_table_body');
    tableBody.innerHTML = ''; // Limpiar la tabla antes de llenarla

    students.forEach(student => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${student.student_id}</td>
            <td>${student.nombre} ${student.apellido}</td>
            <td>${student.edad}</td>
            <td>${student.correo}</td>
            <td><button onclick="deleteStudent('${student.student_id}')">Eliminar</button></td>
        `;
        tableBody.appendChild(row);
    });
}

// Función para mostrar el resultado de la búsqueda
function renderSearchResult(student) {
    const searchResult = document.getElementById('searchResult');
    searchResult.innerHTML = '';

    if (student.message) {
        searchResult.innerHTML = `<p>${student.message}</p>`;
    } else {
        searchResult.innerHTML = `
            <h3>Estudiante encontrado:</h3>
            <p>ID: ${student.student_id}</p>
            <p>Nombre: ${student.nombre} ${student.apellido}</p>
            <p>Edad: ${student.edad}</p>
            <p>Correo: ${student.correo}</p>
        `;
    }
}

// Función para eliminar un estudiante
async function deleteStudent(studentId) {
    const response = await fetch(`/students/${studentId}`, {
        method: 'DELETE'
    });

    const result = await response.json();
    alert(result.message);
    fetchStudents(); // Vuelve a cargar los estudiantes
}

