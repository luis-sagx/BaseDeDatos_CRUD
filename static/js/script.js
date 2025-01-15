document.addEventListener('DOMContentLoaded', () => {
    fetchStudents();  // Cargar estudiantes al inicio
    document.getElementById('searchForm').addEventListener('submit', searchStudent);
    document.getElementById('addStudentForm').addEventListener('submit', addStudent);
    document.getElementById('btnAgregar').addEventListener('click', openAddModal);  // Mostrar el modal para añadir
    document.getElementById('btnCerrarModal').addEventListener('click', closeAddModal);  // Cerrar el modal para añadir
    document.getElementById('btnCerrarEditarModal').addEventListener('click', closeEditModal); // Cerrar el modal para editar
    document.getElementById('editStudentForm').addEventListener('submit', updateStudent); // Actualizar estudiante
});

// Función para abrir el modal de añadir
function openAddModal() {
    document.getElementById('agregarEstudiante').style.display = 'block';
}

// Función para cerrar el modal de añadir
function closeAddModal() {
    document.getElementById('agregarEstudiante').style.display = 'none';
}

// Función para abrir el modal de edición
function openEditModal(student) {
    document.getElementById('edit_student_id').value = student.student_id;
    document.getElementById('edit_name').value = student.nombre;
    document.getElementById('edit_lastName').value = student.apellido;
    document.getElementById('edit_age').value = student.edad;
    document.getElementById('edit_email').value = student.correo;
    document.getElementById('edit_birthDate').value = student.fecha_nacimiento;
    document.getElementById('edit_gender').value = student.genero;
    document.getElementById('edit_subjects').value = student.materias;
    document.getElementById('edit_job').value = student.trabajo;

    document.getElementById('editarEstudiante').style.display = 'block';
}

// Función para cerrar el modal de edición
function closeEditModal() {
    document.getElementById('editarEstudiante').style.display = 'none';
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
    closeAddModal();  // Cierra el modal después de agregar el estudiante
}

// Función para actualizar un estudiante
async function updateStudent(event) {
    event.preventDefault();
    const studentId = document.getElementById('edit_student_id').value;
    const student = {
        nombre: document.getElementById('edit_name').value,
        apellido: document.getElementById('edit_lastName').value,
        edad: document.getElementById('edit_age').value,
        correo: document.getElementById('edit_email').value,
        fecha_nacimiento: document.getElementById('edit_birthDate').value,
        genero: document.getElementById('edit_gender').value,
        materias: document.getElementById('edit_subjects').value,
        trabajo: document.getElementById('edit_job').value
    };
    const response = await fetch(`/students/${studentId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(student)
    });
    const result = await response.json();
    alert(result.message);
    fetchStudents(); // Vuelve a cargar los estudiantes
    closeEditModal(); // Cierra el modal después de editar el estudiante
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
            <td>
                <button onclick="deleteStudent('${student.student_id}')">Eliminar</button>
                <button onclick='editStudent(${JSON.stringify(student)})'>Editar</button>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

// Función para editar un estudiante
function editStudent(student) {
    openEditModal(student);
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
