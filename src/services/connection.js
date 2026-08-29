const API_URL = import.meta.env.VITE_API_URL || "https://todo-backend-1-50bxdra22-noizys.vercel.app/api/todos";

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
        console.log('Adding todo:', todo);
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ task: todo })
        });
        console.log('Response status:', response.status);
        return await handleResponse(response);
    } catch (error) {
        console.error('Connect error:', error);
        throw error;
    }
}

async function getTodos() {
    try {
        console.log('Fetching todos from:', API_URL);
        const response = await fetch(API_URL, {
            method: 'GET'
        });
        console.log('GET response status:', response.status);
        return await handleResponse(response);
    } catch (error) {
        console.error('GetTodos error:', error);
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