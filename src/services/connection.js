const API_URL = import.meta.env.VITE_API_URL;

async function handleResponse(response) {
    if (!response.ok) {
        const error = await response.json().catch(() => ({ message: 'Network error' }));
        console.error('API Error:', error);
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
            credentials: 'include', // Important for session cookies
            body: JSON.stringify({ task: todo })
        });
        return await handleResponse(response);
    } catch (error) {
        console.error('Connect error:', error);
        throw error;
    }
}

async function getTodos() {
    try {
        const response = await fetch(API_URL, {
            method: 'GET',
            credentials: 'include' // Important for session cookies
        });
        return await handleResponse(response);
    } catch (error) {
        console.error('GetTodos error:', error);
        throw error;
    }
}

async function deleteTodo(id) {
    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'DELETE',
            credentials: 'include' // Important for session cookies
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
            credentials: 'include', // Important for session cookies
            body: JSON.stringify({ task })
        });
        return await handleResponse(response);
    } catch (error) {
        throw error;
    }
}

export default connect;
export { getTodos, deleteTodo, updateTodo };