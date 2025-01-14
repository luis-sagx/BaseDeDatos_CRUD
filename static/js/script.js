document.addEventListener('DOMContentLoaded', () => {
    const btnAgregar = document.getElementById('btnAgregar');
    const modal = document.getElementById('agregarEstudiante');
    const btnCerrarModal = document.getElementById('btnCerrarModal');

    // Abrir modal al presionar el botón "Agregar Nuevo Estudiente"
    btnAgregar.addEventListener('click', () => {
        modal.style.display = 'flex';
    });

    // Cerrar modal al presionar el botón de cerrar
    btnCerrarModal.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    // Cerrar modal al hacer clic fuera del formulario
    window.addEventListener('click', (event) => {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });
});

async function fetchStudents() {
    const response = await fetch('/students');
    const students = await response.json();
    renderStudents(students);
}

// Función para agregar un estudiante
async function addStudent(event) {
    event.preventDefault();

    const student = {
        student_id: document.getElementById('student_id').value,
        nombre: document.getElementById('name').value,
        apellido: document.getElementById('lastName').value,
        edad: document.getElementById('age').value,
        correo: document.getElementById('email').value,
        fechaNacimiento: document.getElementById('birthDate').value,
        genero: document.getElementById('gender').value,
        materiasQueToma: document.getElementById('subjects').value,
        trabajo: document.getElementById('job').value,
        direccion: "",  // No está en el formulario, pero puedes añadirlo si lo deseas
    };

    const response = await fetch('/students/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(student),
    });

    const result = await response.json();
    alert(result.message);
    fetchStudents(); // Vuelve a cargar los estudiantes
}

// Función para eliminar un estudiante
async function deleteStudent(studentId) {
    const response = await fetch(`/students/${studentId}`, {
        method: 'DELETE',
    });

    const result = await response.json();
    alert(result.message);
    fetchStudents(); // Vuelve a cargar los estudiantes
}

// Función para renderizar los estudiantes en la tabla
function renderStudents(students) {
    const tableBody = document.getElementById('students_table_body');
    tableBody.innerHTML = '';  // Limpiar la tabla antes de llenarla

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

// Cargar los estudiantes al cargar la página
document.addEventListener('DOMContentLoaded', fetchStudents);