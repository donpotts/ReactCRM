// src/pages/TodoTaskPage.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { getTodoTasks, createTodoTask, updateTodoTask, deleteTodoTask } from '../api/auth.js';

const modalAnimations = `
  @keyframes fade-in {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  @keyframes scale-in-fade-in {
    from { transform: scale(0.95); opacity: 0; }
    to { transform: scale(1); opacity: 1; }
  }
  @keyframes fade-in-up {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }

  .animate-fade-in {
    animation: fade-in 0.3s ease-out forwards;
  }
  .animate-scale-in-fade-in {
    animation: scale-in-fade-in 0.3s ease-out forwards;
  }
  .animate-fade-in-up {
    animation: fade-in-up 0.4s ease-out forwards;
  }
`;

function TodoTaskForm({ todoTask, mode, authToken, onSave, onCancel }) {
  const [formData, setFormData] = useState({
    name: todoTask?.name || '',
    description: todoTask?.description || '',
    assignedTo: todoTask?.assignedTo || 0,
    status: todoTask?.status || '',
    dueDate: todoTask?.dueDate || '',
    createdDateTime: todoTask?.createdDateTime || '',
    modifiedDateTime: todoTask?.modifiedDateTime || '',
    userId: todoTask?.userId || 0,
    followupDate: todoTask?.followupDate || '',
    icon: todoTask?.icon || '',
    notes: todoTask?.notes || '',
  });
  const [formError, setFormError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setFormData({
      name: todoTask?.name || '',
      description: todoTask?.description || '',
      assignedTo: todoTask?.assignedTo || 0,
      status: todoTask?.status || '',
      dueDate: todoTask?.dueDate || '',
      createdDateTime: todoTask?.createdDateTime || '',
      modifiedDateTime: todoTask?.modifiedDateTime || '',
      userId: todoTask?.userId || 0,
      followupDate: todoTask?.followupDate || '',
      icon: todoTask?.icon || '',
      notes: todoTask?.notes || '',
    });
    setFormError(null);
  }, [todoTask, mode]);


  const handleChange = (e) => {
    const name = e.target.name;
    let newValue = e.target.type === 'checkbox' ? e.target.checked : e.target.value;

    if (name === 'assignedTo') {
      newValue = parseInt(e.target.value);
    }

    if (name === 'userId') {
      newValue = parseInt(e.target.value);
    }

    setFormData((prevData) => ({
      ...prevData,
      [name]: newValue,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setFormError(null);

    let result;
    if (mode === 'add') {
      console.log("Attempting to add new todo task with data:", formData);
      result = await createTodoTask(authToken, formData);
    } else if (mode === 'edit') {
      const { id: _id, ...dataToUpdate } = formData;
      console.log("Attempting to update todo task ID:", todoTask.id);
      console.log("Payload dataToUpdate:", dataToUpdate);
      result = await updateTodoTask(authToken, todoTask.id, dataToUpdate);
      console.log("Result from update API call:", result);
    }

    if (result.success) {
      onSave();
    } else {
      setFormError(result.message);
      console.error("Failed to save todo task:", result.message || "An unknown error occurred.");
    }
    setLoading(false);
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 max-w-lg mx-auto mt-8 animate-fade-in-up">
      <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">
        {mode === 'add' ? 'Add New Todo Task' : 'Edit Todo Task'}
      </h3>
      {formError && <p className="text-red-500 text-center mb-4">{formError}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
          <input
            type="text"
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
        <div>
          <label htmlFor="assignedTo" className="block text-sm font-medium text-gray-700">Assigned to</label>
          <input
            type="number"
            id="assignedTo"
            name="assignedTo"
            value={formData.assignedTo}
            onChange={handleChange}
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
        <div>
          <label htmlFor="status" className="block text-sm font-medium text-gray-700">Status</label>
          <input
            type="text"
            id="status"
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
        <div>
          <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700">Due Date</label>
          <input
            type="text"
            id="dueDate"
            name="dueDate"
            value={formData.dueDate}
            onChange={handleChange}
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
        <div>
          <label htmlFor="createdDateTime" className="block text-sm font-medium text-gray-700">Created Date Time</label>
          <input
            type="text"
            id="createdDateTime"
            name="createdDateTime"
            value={formData.createdDateTime}
            onChange={handleChange}
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
        <div>
          <label htmlFor="modifiedDateTime" className="block text-sm font-medium text-gray-700">Modified Date Time</label>
          <input
            type="text"
            id="modifiedDateTime"
            name="modifiedDateTime"
            value={formData.modifiedDateTime}
            onChange={handleChange}
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
        <div>
          <label htmlFor="userId" className="block text-sm font-medium text-gray-700">User Id</label>
          <input
            type="number"
            id="userId"
            name="userId"
            value={formData.userId}
            onChange={handleChange}
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
        <div>
          <label htmlFor="followupDate" className="block text-sm font-medium text-gray-700">Followup Date</label>
          <input
            type="text"
            id="followupDate"
            name="followupDate"
            value={formData.followupDate}
            onChange={handleChange}
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
        <div>
          <label htmlFor="icon" className="block text-sm font-medium text-gray-700">Icon</label>
          <input
            type="text"
            id="icon"
            name="icon"
            value={formData.icon}
            onChange={handleChange}
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
        <div>
          <label htmlFor="notes" className="block text-sm font-medium text-gray-700">Notes</label>
          <input
            type="text"
            id="notes"
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>

        <div className="flex justify-end space-x-4 pt-4">
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-2 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-6 py-2 bg-indigo-600 text-white rounded-lg font-semibold shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
            disabled={loading}
          >
            {loading ? (mode === 'add' ? 'Adding...' : 'Updating...') : (mode === 'add' ? 'Add Todo Task' : 'Save Changes')}
          </button>
        </div>
      </form>
    </div>
  );
}

function DeleteConfirmationModal({ isOpen, todoTask, onConfirm, onCancel }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-purple-500/20 to-indigo-600/20 flex items-center justify-center z-50 animate-fade-in">
      <div className="bg-white rounded-lg shadow-xl p-8 max-w-sm w-full mx-auto transform transition-transform duration-300 scale-95 opacity-0 animate-scale-in-fade-in">
        <h3 className="text-xl font-bold text-gray-800 mb-4 text-center">Confirm Deletion</h3>
        <p className="text-gray-700 text-center mb-6">
          Are you sure you want to delete todo task: {todoTask.name}?
        </p>
        <div className="flex justify-center space-x-4">
          <button
            onClick={onCancel}
            className="px-6 py-2 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
          >
            Cancel
          </button>
          <button
            onClick={() => onConfirm(todoTask.id)}
            className="px-6 py-2 bg-red-600 text-white rounded-lg font-semibold shadow-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-200"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

function TodoTaskPage({ authToken, onGoToHome }) {
  const [todoTasksData, setTodoTasksData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [viewMode, setViewMode] = useState('list');
  const [selectedTodoTask, setSelectedTodoTask] = useState(null);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [todoTaskToDelete, setTodoTaskToDelete] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [todoTasksPerPage, setTodoTasksPerPage] = useState(5);

  const indexOfLastTodoTask = currentPage * todoTasksPerPage;
  const indexOfFirstTodoTask = indexOfLastTodoTask - todoTasksPerPage;
  const currentTodoTasks = todoTasksData.slice(indexOfFirstTodoTask, indexOfLastTodoTask);

  const totalPages = Math.ceil(todoTasksData.length / todoTasksPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleTodoTasksPerPageChange = (e) => {
    setTodoTasksPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  const fetchTodoTasks = useCallback(async () => {
    setLoading(true);
    setError(null);
    const result = await getTodoTasks(authToken);

    if (result.success) {
      setTodoTasksData(result.data);
      console.log("Todo tasks fetched successfully:", result.data);
      setCurrentPage(1);
    } else {
      setError(result.message);
      console.error("Failed to fetch todo tasks:", result.message);
      setTodoTasksData([]);
    }
    setLoading(false);
  }, [authToken, setCurrentPage, setTodoTasksData, setLoading, setError]);

  useEffect(() => {
    if (authToken && viewMode === 'list') {
      fetchTodoTasks();
    } else if (!authToken) {
      setError("Please log in to view todo tasks.");
      setTodoTasksData([]);
    }
  }, [authToken, viewMode, fetchTodoTasks]);

  const handleAddClick = () => {
    setViewMode('add');
    setSelectedTodoTask(null);
  };

  const handleEditClick = (todoTask) => {
    setViewMode('edit');
    setSelectedTodoTask(todoTask);
  };

  const handleDeleteClick = (todoTask) => {
    setTodoTaskToDelete(todoTask);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async (todoTaskId) => {
    setIsDeleteModalOpen(false);
    setLoading(true);
    const result = await deleteTodoTask(authToken, todoTaskId);
    if (result.success) {
      console.log("Todo task deleted successfully.");
      fetchTodoTasks();
    } else {
      setError(result.message || "Failed to delete todo task.");
      console.error("Failed to delete todo task:", result.message);
    }
    setLoading(false);
    setTodoTaskToDelete(null);
  };

  const handleCancelDelete = () => {
    setIsDeleteModalOpen(false);
    setTodoTaskToDelete(null);
  };

  const handleFormSave = () => {
    setViewMode('list');
    fetchTodoTasks();
    setShowSuccessMessage(true);
    setTimeout(() => setShowSuccessMessage(false), 3000);
  };

  const handleFormCancel = () => {
    setViewMode('list');
    setSelectedTodoTask(null);
  };

  return (
    <div className="pt-24 pb-8 w-full max-w-4xl px-4 animate-fade-in mx-auto">
      <style>{modalAnimations}</style>

      {viewMode === 'list' && (
        <>
          <div className="flex justify-between items-center mb-10">
            <h2 className="text-4xl font-extrabold text-white mb-4">Your Todo Tasks</h2>
            <div className="flex space-x-4">
              <button
                onClick={handleAddClick}
                className="px-6 py-2 bg-green-500 text-white rounded-lg font-semibold shadow-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-200"
              >
                Add Todo Task
              </button>
            </div>
          </div>

          <p className="text-lg text-indigo-100 mb-6 text-center">Details from the secure API endpoint.</p>
          <button
            onClick={fetchTodoTasks}
            className="mt-4 px-6 py-2 bg-purple-600 text-white rounded-lg font-semibold shadow-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-all duration-200 mb-8 block mx-auto"
            disabled={loading || !authToken}
          >
            {loading ? 'Loading...' : 'Refresh Todo Tasks'}
          </button>

          {showSuccessMessage && (
            <p className="text-green-400 text-center mb-4 animate-fade-in">
              Todo task saved successfully!
            </p>
          )}

          {error && <p className="text-red-400 text-center mb-4">{error}</p>}

          {todoTasksData.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {currentTodoTasks.map((todoTask, index) => (
                  <div key={todoTask.id || index} className="bg-white rounded-2xl shadow-lg p-6 transform transition-transform duration-300 hover:scale-103 hover:shadow-xl flex flex-col justify-between">
                    <div>
                      <h3 className="text-xl font-bold text-gray-800 mb-2">{todoTask.name}</h3>
                      <p className="text-gray-600 text-sm">Description: {todoTask.description}</p>
                      <p className="text-gray-600 text-sm">Assigned to: {todoTask.assignedTo}</p>
                      <p className="text-gray-600 text-sm">Status: {todoTask.status}</p>
                      <p className="text-gray-600 text-sm">Due Date: {todoTask.dueDate}</p>
                      <p className="text-gray-600 text-sm">Created Date Time: {todoTask.createdDateTime}</p>
                      <p className="text-gray-600 text-sm">Modified Date Time: {todoTask.modifiedDateTime}</p>
                      <p className="text-gray-600 text-sm">User Id: {todoTask.userId}</p>
                      <p className="text-gray-600 text-sm">Followup Date: {todoTask.followupDate}</p>
                      <p className="text-gray-600 text-sm">Icon: {todoTask.icon}</p>
                      <p className="text-gray-600 text-sm">Notes: {todoTask.notes}</p>
                    </div>
                    <div className="mt-4 flex justify-end space-x-3">
                      <button
                        onClick={() => handleEditClick(todoTask)}
                        className="px-4 py-2 bg-blue-500 text-white rounded-lg text-sm font-medium shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteClick(todoTask)}
                        className="px-4 py-2 bg-red-500 text-white rounded-lg text-sm font-medium shadow-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all duration-200"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-4 mt-8 text-white">
                <div className="flex items-center space-x-2">
                  <label htmlFor="todoTasksPerPage" className="text-sm font-medium">Todo tasks per page:</label>
                  <select
                    id="todoTasksPerPage"
                    value={todoTasksPerPage}
                    onChange={handleTodoTasksPerPageChange}
                    className="bg-indigo-700 text-white rounded-lg shadow-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 cursor-pointer"
                  >
                    <option value="5">5</option>
                    <option value="10">10</option>
                    <option value="20">20</option>
                    <option value={todoTasksData.length}>All</option>
                  </select>
                </div>
                {totalPages > 1 && (
                  <div className="flex space-x-2">
                    <button
                      onClick={() => paginate(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="px-4 py-2 bg-indigo-700 rounded-lg shadow-md hover:bg-indigo-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                    >
                      Previous
                    </button>
                    {Array.from({ length: totalPages }, (_, i) => (
                      <button
                        key={i + 1}
                        onClick={() => paginate(i + 1)}
                        className={`px-4 py-2 rounded-lg shadow-md transition-colors duration-200 ${
                          currentPage === i + 1 ? 'bg-indigo-500 text-white' : 'bg-indigo-700 hover:bg-indigo-800 text-white'
                        }`}
                      >
                        {i + 1}
                      </button>
                    ))}
                    <button
                      onClick={() => paginate(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="px-4 py-2 bg-indigo-700 rounded-lg shadow-md hover:bg-indigo-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                    >
                      Next
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            !loading && !error && authToken && (
              <p className="text-indigo-200 text-center mt-8">No todo tasks to display. Click "Add Todo Task" to create one.</p>
            )
          )}

          {!authToken && !loading && !error && (
            <div className="text-center mt-8">
              <button
                onClick={onGoToHome}
                className="text-sm text-gray-300 hover:text-white font-medium transition-colors duration-200"
              >
                Go to Home
              </button>
            </div>
          )}
        </>
      )}

      {viewMode === 'add' && (
        <TodoTaskForm
          mode="add"
          authToken={authToken}
          onSave={handleFormSave}
          onCancel={handleFormCancel}
        />
      )}

      {viewMode === 'edit' && selectedTodoTask && (
        <TodoTaskForm
          todoTask={selectedTodoTask}
          mode="edit"
          authToken={authToken}
          onSave={handleFormSave}
          onCancel={handleFormCancel}
        />
      )}

      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        todoTask={todoTaskToDelete}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />
    </div>
  );
}

export default TodoTaskPage;
