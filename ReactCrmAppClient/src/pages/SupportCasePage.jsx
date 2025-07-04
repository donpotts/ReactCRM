// src/pages/SupportCasePage.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { getSupportCases, createSupportCase, updateSupportCase, deleteSupportCase } from '../api/auth.js';

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

function SupportCaseForm({ supportCase, mode, authToken, onSave, onCancel }) {
  const [formData, setFormData] = useState({
    customerId: supportCase?.customerId || 0,
    productId: supportCase?.productId || 0,
    serviceId: supportCase?.serviceId || '',
    status: supportCase?.status || '',
    description: supportCase?.description || '',
    createdDateTime: supportCase?.createdDateTime || '',
    modifiedDateTime: supportCase?.modifiedDateTime || '',
    userId: supportCase?.userId || 0,
    followupDate: supportCase?.followupDate || '',
    icon: supportCase?.icon || '',
    notes: supportCase?.notes || '',
  });
  const [formError, setFormError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setFormData({
      customerId: supportCase?.customerId || 0,
      productId: supportCase?.productId || 0,
      serviceId: supportCase?.serviceId || '',
      status: supportCase?.status || '',
      description: supportCase?.description || '',
      createdDateTime: supportCase?.createdDateTime || '',
      modifiedDateTime: supportCase?.modifiedDateTime || '',
      userId: supportCase?.userId || 0,
      followupDate: supportCase?.followupDate || '',
      icon: supportCase?.icon || '',
      notes: supportCase?.notes || '',
    });
    setFormError(null);
  }, [supportCase, mode]);


  const handleChange = (e) => {
    const name = e.target.name;
    let newValue = e.target.type === 'checkbox' ? e.target.checked : e.target.value;

    if (name === 'customerId') {
      newValue = parseInt(e.target.value);
    }

    if (name === 'productId') {
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
      console.log("Attempting to add new support case with data:", formData);
      result = await createSupportCase(authToken, formData);
    } else if (mode === 'edit') {
      const { id: _id, ...dataToUpdate } = formData;
      console.log("Attempting to update support case ID:", supportCase.id);
      console.log("Payload dataToUpdate:", dataToUpdate);
      result = await updateSupportCase(authToken, supportCase.id, dataToUpdate);
      console.log("Result from update API call:", result);
    }

    if (result.success) {
      onSave();
    } else {
      setFormError(result.message);
      console.error("Failed to save support case:", result.message || "An unknown error occurred.");
    }
    setLoading(false);
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 max-w-lg mx-auto mt-8 animate-fade-in-up">
      <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">
        {mode === 'add' ? 'Add New Support Case' : 'Edit Support Case'}
      </h3>
      {formError && <p className="text-red-500 text-center mb-4">{formError}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="customerId" className="block text-sm font-medium text-gray-700">Customer Id</label>
          <input
            type="number"
            id="customerId"
            name="customerId"
            value={formData.customerId}
            onChange={handleChange}
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
        <div>
          <label htmlFor="productId" className="block text-sm font-medium text-gray-700">Product Id</label>
          <input
            type="number"
            id="productId"
            name="productId"
            value={formData.productId}
            onChange={handleChange}
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
        <div>
          <label htmlFor="serviceId" className="block text-sm font-medium text-gray-700">Service Id</label>
          <input
            type="text"
            id="serviceId"
            name="serviceId"
            value={formData.serviceId}
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
            {loading ? (mode === 'add' ? 'Adding...' : 'Updating...') : (mode === 'add' ? 'Add Support Case' : 'Save Changes')}
          </button>
        </div>
      </form>
    </div>
  );
}

function DeleteConfirmationModal({ isOpen, supportCase, onConfirm, onCancel }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-purple-500/20 to-indigo-600/20 flex items-center justify-center z-50 animate-fade-in">
      <div className="bg-white rounded-lg shadow-xl p-8 max-w-sm w-full mx-auto transform transition-transform duration-300 scale-95 opacity-0 animate-scale-in-fade-in">
        <h3 className="text-xl font-bold text-gray-800 mb-4 text-center">Confirm Deletion</h3>
        <p className="text-gray-700 text-center mb-6">
          Are you sure you want to delete support case: {supportCase.id}?
        </p>
        <div className="flex justify-center space-x-4">
          <button
            onClick={onCancel}
            className="px-6 py-2 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
          >
            Cancel
          </button>
          <button
            onClick={() => onConfirm(supportCase.id)}
            className="px-6 py-2 bg-red-600 text-white rounded-lg font-semibold shadow-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-200"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

function SupportCasePage({ authToken, onGoToHome }) {
  const [supportCasesData, setSupportCasesData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [viewMode, setViewMode] = useState('list');
  const [selectedSupportCase, setSelectedSupportCase] = useState(null);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [supportCaseToDelete, setSupportCaseToDelete] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [supportCasesPerPage, setSupportCasesPerPage] = useState(5);

  const indexOfLastSupportCase = currentPage * supportCasesPerPage;
  const indexOfFirstSupportCase = indexOfLastSupportCase - supportCasesPerPage;
  const currentSupportCases = supportCasesData.slice(indexOfFirstSupportCase, indexOfLastSupportCase);

  const totalPages = Math.ceil(supportCasesData.length / supportCasesPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleSupportCasesPerPageChange = (e) => {
    setSupportCasesPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  const fetchSupportCases = useCallback(async () => {
    setLoading(true);
    setError(null);
    const result = await getSupportCases(authToken);

    if (result.success) {
      setSupportCasesData(result.data);
      console.log("Support cases fetched successfully:", result.data);
      setCurrentPage(1);
    } else {
      setError(result.message);
      console.error("Failed to fetch support cases:", result.message);
      setSupportCasesData([]);
    }
    setLoading(false);
  }, [authToken, setCurrentPage, setSupportCasesData, setLoading, setError]);

  useEffect(() => {
    if (authToken && viewMode === 'list') {
      fetchSupportCases();
    } else if (!authToken) {
      setError("Please log in to view support cases.");
      setSupportCasesData([]);
    }
  }, [authToken, viewMode, fetchSupportCases]);

  const handleAddClick = () => {
    setViewMode('add');
    setSelectedSupportCase(null);
  };

  const handleEditClick = (supportCase) => {
    setViewMode('edit');
    setSelectedSupportCase(supportCase);
  };

  const handleDeleteClick = (supportCase) => {
    setSupportCaseToDelete(supportCase);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async (supportCaseId) => {
    setIsDeleteModalOpen(false);
    setLoading(true);
    const result = await deleteSupportCase(authToken, supportCaseId);
    if (result.success) {
      console.log("Support case deleted successfully.");
      fetchSupportCases();
    } else {
      setError(result.message || "Failed to delete support case.");
      console.error("Failed to delete support case:", result.message);
    }
    setLoading(false);
    setSupportCaseToDelete(null);
  };

  const handleCancelDelete = () => {
    setIsDeleteModalOpen(false);
    setSupportCaseToDelete(null);
  };

  const handleFormSave = () => {
    setViewMode('list');
    fetchSupportCases();
    setShowSuccessMessage(true);
    setTimeout(() => setShowSuccessMessage(false), 3000);
  };

  const handleFormCancel = () => {
    setViewMode('list');
    setSelectedSupportCase(null);
  };

  return (
    <div className="pt-24 pb-8 w-full max-w-4xl px-4 animate-fade-in mx-auto">
      <style>{modalAnimations}</style>

      {viewMode === 'list' && (
        <>
          <div className="flex justify-between items-center mb-10">
            <h2 className="text-4xl font-extrabold text-white mb-4">Your Support Cases</h2>
            <div className="flex space-x-4">
              <button
                onClick={handleAddClick}
                className="px-6 py-2 bg-green-500 text-white rounded-lg font-semibold shadow-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-200"
              >
                Add Support Case
              </button>
            </div>
          </div>

          <p className="text-lg text-indigo-100 mb-6 text-center">Details from the secure API endpoint.</p>
          <button
            onClick={fetchSupportCases}
            className="mt-4 px-6 py-2 bg-purple-600 text-white rounded-lg font-semibold shadow-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-all duration-200 mb-8 block mx-auto"
            disabled={loading || !authToken}
          >
            {loading ? 'Loading...' : 'Refresh Support Cases'}
          </button>

          {showSuccessMessage && (
            <p className="text-green-400 text-center mb-4 animate-fade-in">
              Support case saved successfully!
            </p>
          )}

          {error && <p className="text-red-400 text-center mb-4">{error}</p>}

          {supportCasesData.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {currentSupportCases.map((supportCase, index) => (
                  <div key={supportCase.id || index} className="bg-white rounded-2xl shadow-lg p-6 transform transition-transform duration-300 hover:scale-103 hover:shadow-xl flex flex-col justify-between">
                    <div>
                      <h3 className="text-xl font-bold text-gray-800 mb-2">{supportCase.id}</h3>
                      <p className="text-gray-600 text-sm">Customer Id: {supportCase.customerId}</p>
                      <p className="text-gray-600 text-sm">Product Id: {supportCase.productId}</p>
                      <p className="text-gray-600 text-sm">Service Id: {supportCase.serviceId}</p>
                      <p className="text-gray-600 text-sm">Status: {supportCase.status}</p>
                      <p className="text-gray-600 text-sm">Description: {supportCase.description}</p>
                      <p className="text-gray-600 text-sm">Created Date Time: {supportCase.createdDateTime}</p>
                      <p className="text-gray-600 text-sm">Modified Date Time: {supportCase.modifiedDateTime}</p>
                      <p className="text-gray-600 text-sm">User Id: {supportCase.userId}</p>
                      <p className="text-gray-600 text-sm">Followup Date: {supportCase.followupDate}</p>
                      <p className="text-gray-600 text-sm">Icon: {supportCase.icon}</p>
                      <p className="text-gray-600 text-sm">Notes: {supportCase.notes}</p>
                    </div>
                    <div className="mt-4 flex justify-end space-x-3">
                      <button
                        onClick={() => handleEditClick(supportCase)}
                        className="px-4 py-2 bg-blue-500 text-white rounded-lg text-sm font-medium shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteClick(supportCase)}
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
                  <label htmlFor="supportCasesPerPage" className="text-sm font-medium">Support cases per page:</label>
                  <select
                    id="supportCasesPerPage"
                    value={supportCasesPerPage}
                    onChange={handleSupportCasesPerPageChange}
                    className="bg-indigo-700 text-white rounded-lg shadow-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 cursor-pointer"
                  >
                    <option value="5">5</option>
                    <option value="10">10</option>
                    <option value="20">20</option>
                    <option value={supportCasesData.length}>All</option>
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
              <p className="text-indigo-200 text-center mt-8">No support cases to display. Click "Add Support Case" to create one.</p>
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
        <SupportCaseForm
          mode="add"
          authToken={authToken}
          onSave={handleFormSave}
          onCancel={handleFormCancel}
        />
      )}

      {viewMode === 'edit' && selectedSupportCase && (
        <SupportCaseForm
          supportCase={selectedSupportCase}
          mode="edit"
          authToken={authToken}
          onSave={handleFormSave}
          onCancel={handleFormCancel}
        />
      )}

      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        supportCase={supportCaseToDelete}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />
    </div>
  );
}

export default SupportCasePage;
