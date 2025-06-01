document.addEventListener('DOMContentLoaded', () => {
    const authToken = localStorage.getItem('authToken');
    const username = localStorage.getItem('username'); // Recuperamos el username

    // Elementos del DOM
    const usernameDisplay = document.getElementById('username-display');
    const logoutButton = document.getElementById('logout-button');
    const dashboardMessage = document.getElementById('dashboard-message');

    const addEmployeeForm = document.getElementById('add-employee-form');
    const employeeTableBody = document.getElementById('employee-table-body');

    const searchEmployeeForm = document.getElementById('search-employee-form');
    const searchNombreInput = document.getElementById('search-nombre');
    const clearSearchButton = document.getElementById('clear-search-button');

    // Modal de edición
    const editEmployeeModal = document.getElementById('edit-employee-modal');
    const editEmployeeForm = document.getElementById('edit-employee-form');
    const closeEditModalButton = document.getElementById('close-edit-modal');
    const editMessage = document.getElementById('edit-message');
    let currentEditingId = null;

    // 0. Verificar autenticación y configurar UI inicial
    if (!authToken) {
        window.location.href = 'index.html'; // Redirigir si no hay token
        return;
    }

    if (usernameDisplay && username) {
        usernameDisplay.textContent = `Usuario: ${username}`;
    }

    if (logoutButton) {
        logoutButton.addEventListener('click', () => {
            logout(); // Llama a la función logout() definida en auth.js
        });
    }

    async function fetchAuthenticated(url, options = {}) {
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authToken}`,
            ...options.headers,
        };
        const response = await fetch(url, { ...options, headers });

        if (response.status === 401 || response.status === 403) {
            // Token inválido o expirado, desloguear
            logout();
            return null; 
        }
        return response;
    }

    // 1. Cargar y mostrar empleados
    async function fetchAndDisplayEmployees(searchTerm = '') {
        let url = `${API_URL}/empleados`;
        if (searchTerm) {
            url = `${API_URL}/empleados/buscar/por-nombre?nombre=${encodeURIComponent(searchTerm)}`;
        }

        try {
            const response = await fetchAuthenticated(url);
            if (!response) return; // Manejado por fetchAuthenticated en caso de error de auth

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({ message: 'Error al cargar empleados.' }));
                showDashboardMessage(errorData.message || `Error ${response.status}`, 'error');
                employeeTableBody.innerHTML = `<tr><td colspan="7">${errorData.message || 'Error al cargar empleados.'}</td></tr>`;
                return;
            }

            const empleados = await response.json();
            employeeTableBody.innerHTML = ''; // Limpiar tabla 

            if (empleados.length === 0) {
                employeeTableBody.innerHTML = `<tr><td colspan="7">No se encontraron empleados.</td></tr>`;
                return;
            }

            empleados.forEach(empleado => {
                const row = employeeTableBody.insertRow();
                row.innerHTML = `
                    <td>${empleado.id}</td>
                    <td>${empleado.nombre}</td>
                    <td>${empleado.apellidos}</td>
                    <td>${empleado.telefono || 'N/A'}</td>
                    <td>${empleado.correo}</td>
                    <td>${empleado.direccion || 'N/A'}</td>
                    <td class="actions">
                        <button class="edit-btn" data-id="${empleado.id}">Editar</button>
                        <button class="delete-btn" data-id="${empleado.id}">Eliminar</button>
                    </td>
                `;
            });
        } catch (error) {
            console.error('Error al obtener empleados:', error);
            showDashboardMessage('Error de conexión al cargar empleados.', 'error');
            employeeTableBody.innerHTML = `<tr><td colspan="7">Error de conexión al cargar empleados.</td></tr>`;
        }
    }

    // 2. Agregar nuevo empleado
    if (addEmployeeForm) {
        addEmployeeForm.addEventListener('submit', async (event) => {
            event.preventDefault();
            const empleado = {
                nombre: document.getElementById('add-nombre').value,
                apellidos: document.getElementById('add-apellidos').value,
                telefono: document.getElementById('add-telefono').value,
                correo: document.getElementById('add-correo').value,
                direccion: document.getElementById('add-direccion').value,
            };

            try {
                const response = await fetchAuthenticated(`${API_URL}/empleados`, {
                    method: 'POST',
                    body: JSON.stringify(empleado),
                });

                if (!response) return;
                const data = await response.json();

                if (response.ok) {
                    showDashboardMessage(data.message || 'Empleado agregado exitosamente.', 'success');
                    addEmployeeForm.reset();
                    fetchAndDisplayEmployees(); // Recargar lista
                } else {
                    showDashboardMessage(data.message || `Error ${response.status} al agregar empleado.`, 'error');
                }
            } catch (error) {
                console.error('Error al agregar empleado:', error);
                showDashboardMessage('Error de conexión al agregar empleado.', 'error');
            }
        });
    }

    // 3. Manejar clics en botones de Editar y Eliminar (delegación de eventos)
    if (employeeTableBody) {
        employeeTableBody.addEventListener('click', async (event) => {
            const target = event.target;
            const id = target.dataset.id;

            if (target.classList.contains('delete-btn')) {
                if (confirm(`¿Estás seguro de que deseas eliminar al empleado con ID ${id}?`)) {
                    await deleteEmployee(id);
                }
            } else if (target.classList.contains('edit-btn')) {
                await openEditModal(id);
            }
        });
    }

    // 4. Eliminar empleado
    async function deleteEmployee(id) {
        try {
            const response = await fetchAuthenticated(`${API_URL}/empleados/${id}`, {
                method: 'DELETE',
            });

            if (!response) return;
            const data = await response.json();

            if (response.ok) {
                showDashboardMessage(data.message || 'Empleado eliminado exitosamente.', 'success');
                fetchAndDisplayEmployees(); // Recargar lista
            } else {
                showDashboardMessage(data.message || `Error ${response.status} al eliminar empleado.`, 'error');
            }
        } catch (error) {
            console.error('Error al eliminar empleado:', error);
            showDashboardMessage('Error de conexión al eliminar empleado.', 'error');
        }
    }

    // 5. Editar empleado - Abrir Modal y cargar datos
    async function openEditModal(id) {
        currentEditingId = id;
        try {
            const response = await fetchAuthenticated(`${API_URL}/empleados/${id}`);
            if (!response) return;

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({ message: 'Error al cargar datos del empleado para editar.' }));
                showDashboardMessage(errorData.message || `Error ${response.status}`, 'error');
                return;
            }

            const empleado = await response.json();
            document.getElementById('edit-id').value = empleado.id; // Aunque no se muestre, es útil tenerlo
            document.getElementById('edit-nombre').value = empleado.nombre;
            document.getElementById('edit-apellidos').value = empleado.apellidos;
            document.getElementById('edit-telefono').value = empleado.telefono || '';
            document.getElementById('edit-correo').value = empleado.correo;
            document.getElementById('edit-direccion').value = empleado.direccion || '';
            
            editMessage.textContent = ''; // Limpiar mensajes previos del modal
            editEmployeeModal.style.display = 'block';
        } catch (error) {
            console.error('Error al cargar empleado para editar:', error);
            showDashboardMessage('Error de conexión al cargar datos para editar.', 'error');
        }
    }

    // Cerrar modal de edición
    if (closeEditModalButton) {
        closeEditModalButton.onclick = () => {
            editEmployeeModal.style.display = 'none';
            currentEditingId = null;
        };
    }
    // Cerrar modal si se hace clic fuera del contenido
    window.onclick = (event) => {
        if (event.target == editEmployeeModal) {
            editEmployeeModal.style.display = 'none';
            currentEditingId = null;
        }
    };

    // Guardar cambios del empleado (Submit del formulario de edición)
    if (editEmployeeForm) {
        editEmployeeForm.addEventListener('submit', async (event) => {
            event.preventDefault();
            if (!currentEditingId) return;

            const empleadoActualizado = {
                nombre: document.getElementById('edit-nombre').value,
                apellidos: document.getElementById('edit-apellidos').value,
                telefono: document.getElementById('edit-telefono').value,
                correo: document.getElementById('edit-correo').value,
                direccion: document.getElementById('edit-direccion').value,
            };

            try {
                const response = await fetchAuthenticated(`${API_URL}/empleados/${currentEditingId}`, {
                    method: 'PUT',
                    body: JSON.stringify(empleadoActualizado),
                });

                if (!response) return;
                const data = await response.json();

                if (response.ok) {
                    editEmployeeModal.style.display = 'none';
                    currentEditingId = null;
                    showDashboardMessage(data.message || 'Empleado actualizado exitosamente.', 'success');
                    fetchAndDisplayEmployees(); // Recargar lista
                } else {
                    showEditModalMessage(data.message || `Error ${response.status} al actualizar.`, 'error');
                }
            } catch (error) {
                console.error('Error al actualizar empleado:', error);
                showEditModalMessage('Error de conexión al actualizar.', 'error');
            }
        });
    }

    // 6. Búsqueda de empleados
    if (searchEmployeeForm) {
        searchEmployeeForm.addEventListener('submit', (event) => {
            event.preventDefault();
            fetchAndDisplayEmployees(searchNombreInput.value.trim());
        });
    }
    if (clearSearchButton) {
        clearSearchButton.addEventListener('click', () => {
            searchNombreInput.value = '';
            fetchAndDisplayEmployees(); // Mostrar todos los empleados
        });
    }


    // Funciones auxiliares para mostrar mensajes
    function showDashboardMessage(message, type = 'info') { // type puede ser 'success', 'error', 'info'
        dashboardMessage.textContent = message;
        dashboardMessage.className = `message ${type}`;
        setTimeout(() => { // Opcional: ocultar mensaje después de un tiempo
           // dashboardMessage.textContent = '';
           // dashboardMessage.className = 'message';
        }, 5000);
    }
    function showEditModalMessage(message, type = 'info') {
        editMessage.textContent = message;
        editMessage.className = `message ${type}`;
    }


    // Carga inicial de empleados al entrar al dashboard
    fetchAndDisplayEmployees();
});