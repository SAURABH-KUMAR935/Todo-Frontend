import React from 'react'
import connect, { getTodos, deleteTodo, updateTodo } from './services/connection';

const App = () => {
  const [todos, setTodos] = React.useState([]);
  const [todo, setTodo] = React.useState('');
  const [editIndex, setEditIndex] = React.useState(null);
  const [editText, setEditText] = React.useState('');
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);
  const [actionLoading, setActionLoading] = React.useState(false);

  React.useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getTodos();
      setTodos(data);
    } catch (err) {
      setError('Failed to load todos. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setTodo(e.target.value);
  };

  const handleAdd = async () => {
    if (todo.trim() === '') {
      setError('Please enter a todo');
      return;
    }

    try {
      setActionLoading(true);
      setError(null);
      const newTodo = await connect(todo);
      setTodos([...todos, newTodo]);
      setTodo('');
    } catch (err) {
      setError('Failed to add todo. Please try again.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleEdit = (index) => {
    setEditIndex(index);
    setEditText(todos[index].task);
    setError(null);
  };

  const handleSaveEdit = async () => {
    if (editText.trim() === '') {
      setError('Please enter a todo');
      return;
    }

    try {
      setActionLoading(true);
      setError(null);
      const todoToUpdate = todos[editIndex];
      const updatedTodo = await updateTodo(todoToUpdate._id, editText);
      const updatedTodos = [...todos];
      updatedTodos[editIndex] = updatedTodo;
      setTodos(updatedTodos);
      setEditIndex(null);
      setEditText('');
    } catch (err) {
      setError('Failed to update todo. Please try again.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setEditIndex(null);
    setEditText('');
    setError(null);
  };

  const handleDelete = async (index) => {
    try {
      setActionLoading(true);
      setError(null);
      const todoToDelete = todos[index];
      await deleteTodo(todoToDelete._id);
      const updatedTodos = todos.filter((_, i) => i !== index);
      setTodos(updatedTodos);
    } catch (err) {
      setError('Failed to delete todo. Please try again.');
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100">
      <div className='max-w-2xl mx-auto pt-20 px-4 pb-10'>
        {/* Header */}
        <div className='text-center mb-10'>
          <h1 className='text-5xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2'>
            ✨ Todo App
          </h1>
          <p className='text-gray-600 text-lg'>Stay organized, get things done</p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className='bg-red-50 border-2 border-red-200 text-red-700 px-6 py-4 rounded-xl mb-6 animate-pulse'>
            <div className='flex items-center justify-between'>
              <span className='flex items-center gap-2'>
                <span className='text-xl'>⚠️</span>
                {error}
              </span>
              <button
                onClick={() => setError(null)}
                className='text-red-700 hover:text-red-900 text-2xl leading-none hover:bg-red-100 rounded-full w-8 h-8 flex items-center justify-center transition-colors'
              >
                ×
              </button>
            </div>
          </div>
        )}

        {/* Input Section */}
        <div className='bg-white rounded-2xl shadow-xl p-6 mb-8 transform hover:scale-[1.02] transition-transform duration-300'>
          <div className='flex gap-3'>
            <input
              type="text"
              required
              value={todo}
              onChange={handleChange}
              placeholder='What needs to be done?'
              disabled={actionLoading}
              className='flex-1 border-2 border-gray-200 rounded-xl h-14 px-5 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 disabled:bg-gray-100 disabled:cursor-not-allowed text-gray-700 placeholder-gray-400 text-lg transition-all duration-300'
            />
            <button
              onClick={handleAdd}
              disabled={actionLoading}
              className='bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white px-8 py-3 rounded-xl font-semibold transition-all duration-300 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 active:translate-y-0'
            >
              {actionLoading ? (
                <span className='flex items-center gap-2'>
                  <svg className='animate-spin h-5 w-5' viewBox='0 0 24 24'>
                    <circle className='opacity-25' cx='12' cy='12' r='10' stroke='currentColor' strokeWidth='4' fill='none'></circle>
                    <path className='opacity-75' fill='currentColor' d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'></path>
                  </svg>
                  Adding...
                </span>
              ) : (
                <span className='flex items-center gap-2'>
                  <span>+</span> Add
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Todos List */}
        {loading ? (
          <div className='text-center py-16'>
            <div className='inline-block animate-spin rounded-full h-12 w-12 border-4 border-indigo-200 border-t-indigo-600 mb-4'></div>
            <p className='text-gray-600 text-lg font-medium'>Loading your todos...</p>
          </div>
        ) : todos.length === 0 ? (
          <div className='text-center py-16 bg-white/50 backdrop-blur-sm rounded-2xl border-2 border-dashed border-gray-300'>
            <div className='text-6xl mb-4'>📝</div>
            <h3 className='text-xl font-semibold text-gray-700 mb-2'>No todos yet</h3>
            <p className='text-gray-500'>Add your first task above to get started!</p>
          </div>
        ) : (
          <div className='space-y-4'>
            {todos.map((todo, index) => (
              <div
                key={todo._id || index}
                className='bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100 overflow-hidden'
              >
                {editIndex === index ? (
                  <div className='p-5 bg-gradient-to-r from-green-50 to-emerald-50'>
                    <div className='flex gap-3'>
                      <input
                        type="text"
                        value={editText}
                        onChange={(e) => setEditText(e.target.value)}
                        disabled={actionLoading}
                        className='flex-1 border-2 border-green-300 rounded-xl h-12 px-4 focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200 disabled:bg-gray-100 disabled:cursor-not-allowed text-gray-700 text-lg transition-all duration-300'
                        autoFocus
                      />
                      <button
                        onClick={handleSaveEdit}
                        disabled={actionLoading}
                        className='bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed shadow-md hover:shadow-lg transform hover:-translate-y-0.5 active:translate-y-0'
                      >
                        {actionLoading ? (
                          <span className='flex items-center gap-2'>
                            <svg className='animate-spin h-4 w-4' viewBox='0 0 24 24'>
                              <circle className='opacity-25' cx='12' cy='12' r='10' stroke='currentColor' strokeWidth='4' fill='none'></circle>
                              <path className='opacity-75' fill='currentColor' d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'></path>
                            </svg>
                            Saving...
                          </span>
                        ) : (
                          '✓ Save'
                        )}
                      </button>
                      <button
                        onClick={handleCancelEdit}
                        disabled={actionLoading}
                        className='bg-gray-200 hover:bg-gray-300 text-gray-700 px-6 py-3 rounded-xl font-semibold transition-all duration-300 disabled:bg-gray-100 disabled:cursor-not-allowed hover:shadow-md'
                      >
                        ✕ Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className='p-5 hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 transition-all duration-300'>
                    <div className='flex items-start gap-4'>
                      <div className='flex-1 min-w-0'>
                        <p className='text-lg text-gray-800 break-words leading-relaxed'>{todo.task}</p>
                        {todo.createdAt && (
                          <p className='text-sm text-gray-400 mt-2'>
                            Created: {new Date(todo.createdAt).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                      <div className='flex gap-2 shrink-0'>
                        <button
                          onClick={() => handleEdit(index)}
                          disabled={actionLoading}
                          className='bg-gradient-to-r from-blue-400 to-indigo-400 hover:from-blue-500 hover:to-indigo-500 text-white px-4 py-2 rounded-xl font-medium transition-all duration-300 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed shadow-md hover:shadow-lg transform hover:-translate-y-0.5 active:translate-y-0'
                        >
                          ✏️ Edit
                        </button>
                        <button
                          onClick={() => handleDelete(index)}
                          disabled={actionLoading}
                          className='bg-gradient-to-r from-red-400 to-pink-400 hover:from-red-500 hover:to-pink-500 text-white px-4 py-2 rounded-xl font-medium transition-all duration-300 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed shadow-md hover:shadow-lg transform hover:-translate-y-0.5 active:translate-y-0'
                        >
                          🗑️ Delete
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Footer */}
        <div className='text-center mt-10 text-gray-500 text-sm'>
          <p>💡 Tip: Click Edit to modify tasks, Delete to remove them</p>
        </div>
      </div>
    </div>
  )
}

export default App