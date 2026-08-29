const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api/todos";

async function handleResponse(response) {
    if (!response.ok) {
        const error = await response.json().catch(() => ({ message: 'Network error' }));
        throw new Error(error.message || `HTTP error! status: ${response.status}`);
    }
    return response.json();
}

async function connect(todo) {
    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ task: todo })
        });
        return await handleResponse(response);
    } catch (error) {
        throw error;
    }
}

async function getTodos() {
    try {
        const response = await fetch(API_URL, {
            method: 'GET'
        });
        return await handleResponse(response);
    } catch (error) {
        throw error;
    }
}

async function deleteTodo(id) {
    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'DELETE'
        });
        return await handleResponse(response);
    } catch (error) {
        throw error;
    }
}

async function updateTodo(id, task) {
    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ task })
        });
        return await handleResponse(response);
    } catch (error) {
        throw error;
    }
}

export default connect;
export { getTodos, deleteTodo, updateTodo };