import React, { useState, useEffect } from 'react';
import axios from 'axios';

// Types
interface Competency {
  id: number;
  name: string;
}

interface EmployeeCompetency {
  competency_id: number;
  required_score: number;
}

interface EmployeeCreate {
  emp_number: string;
  job_code: string;
  emp_name: string;
  job_role: string;
  department_id: number;
  competencies: EmployeeCompetency[];
}

const CreateEmployee: React.FC = () => {
  // State
  const token = localStorage.getItem("token");
  const [competencies, setCompetencies] = useState<Competency[]>([]);
  const [selectedCompetencies, setSelectedCompetencies] = useState<EmployeeCompetency[]>([]);
  const [formData, setFormData] = useState<Omit<EmployeeCreate, 'competencies'>>({
    emp_number: '',
    job_code: '',
    emp_name: '',
    job_role: '',
    department_id: 0,
  });
  const [message, setMessage] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch competencies on component mount
  useEffect(() => {
    const fetchCompetencies = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get('http://127.0.0.1:8000/competencies');
        setCompetencies(response.data);
        setError(null);
      } catch (err) {
        setError('Failed to fetch competencies. Please try again later.');
        console.error('Error fetching competencies:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCompetencies();
  }, []);

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData({
      ...formData,
      [id]: id === 'department_id' ? parseInt(value) || 0 : value,
    });
  };

  // Add a new competency row
  const addCompetency = () => {
    setSelectedCompetencies([
      ...selectedCompetencies,
      { competency_id: 0, required_score: 0 },
    ]);
  };

  // Remove a competency row
  const removeCompetency = (index: number) => {
    const updatedCompetencies = [...selectedCompetencies];
    updatedCompetencies.splice(index, 1);
    setSelectedCompetencies(updatedCompetencies);
  };

  // Update competency selection
  const handleCompetencyChange = (index: number, competency_id: number) => {
    const updatedCompetencies = [...selectedCompetencies];
    updatedCompetencies[index].competency_id = competency_id;
    setSelectedCompetencies(updatedCompetencies);
  };

  // Update required score
  const handleScoreChange = (index: number, required_score: number) => {
    const updatedCompetencies = [...selectedCompetencies];
    updatedCompetencies[index].required_score = required_score;
    setSelectedCompetencies(updatedCompetencies);
  };

  // Get available competencies (excluding already selected ones)
  const getAvailableCompetencies = (currentIndex: number) => {
    const selectedIds = selectedCompetencies
      .map((comp, index) => (index !== currentIndex ? comp.competency_id : 0))
      .filter(id => id !== 0);
    
    return competencies.filter(comp => !selectedIds.includes(comp.id));
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate competencies
    const validCompetencies = selectedCompetencies.filter(
      comp => comp.competency_id > 0 && comp.required_score > 0
    );
    
    if (validCompetencies.length !== selectedCompetencies.length) {
      setError('Please complete all competency selections');
      return;
    }

    const employeeData: EmployeeCreate = {
      ...formData,
      competencies: validCompetencies,
    };

    try {
      setIsLoading(true);
      setError(null);
      
      const response = await axios.post(
        "http://127.0.0.1:8000/employees",
        employeeData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setMessage('Employee added successfully!');
      
      // Reset form
      setFormData({
        emp_number: '',
        job_code: '',
        emp_name: '',
        job_role: '',
        department_id: 0,
      });
      setSelectedCompetencies([]);
      
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to create employee');
      console.error('Error creating employee:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">Add Employee</h2>
      
      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4">
          {error}
        </div>
      )}
      
      {message && (
        <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-4">
          {message}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 gap-6">
          <div>
            <label htmlFor="emp_number" className="block text-sm font-medium text-gray-700">
              Employee Number
            </label>
            <input
              type="text"
              id="emp_number"
              value={formData.emp_number}
              onChange={handleInputChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              required
            />
          </div>
          
          <div>
            <label htmlFor="job_code" className="block text-sm font-medium text-gray-700">
              Job Code
            </label>
            <input
              type="text"
              id="job_code"
              value={formData.job_code}
              onChange={handleInputChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              required
            />
          </div>
          
          <div>
            <label htmlFor="emp_name" className="block text-sm font-medium text-gray-700">
              Employee Name
            </label>
            <input
              type="text"
              id="emp_name"
              value={formData.emp_name}
              onChange={handleInputChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              required
            />
          </div>
          
          <div>
            <label htmlFor="job_role" className="block text-sm font-medium text-gray-700">
              Job Role
            </label>
            <input
              type="text"
              id="job_role"
              value={formData.job_role}
              onChange={handleInputChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              required
            />
          </div>
          
          <div>
            <label htmlFor="department_id" className="block text-sm font-medium text-gray-700">
              Department ID
            </label>
            <input
              type="number"
              id="department_id"
              value={formData.department_id || ''}
              onChange={handleInputChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              required
            />
          </div>
          
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Competencies</h3>
            
            {isLoading && competencies.length === 0 ? (
              <p>Loading competencies...</p>
            ) : (
              <>
                <div id="competenciesContainer">
                  {selectedCompetencies.map((comp, index) => {
                    const availableCompetencies = getAvailableCompetencies(index);
                    
                    return (
                      <div key={index} className="competency flex flex-wrap items-center gap-4 mb-4 p-4 border border-gray-200 rounded">
                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            Competency:
                          </label>
                          <select
                            className="competency_id mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                            value={comp.competency_id}
                            onChange={(e) => handleCompetencyChange(index, parseInt(e.target.value))}
                            required
                          >
                            <option value={0}>Select a competency</option>
                            {availableCompetencies.map((c) => (
                              <option key={c.id} value={c.id}>
                                {c.name}
                              </option>
                            ))}
                            {comp.competency_id > 0 && !availableCompetencies.some(c => c.id === comp.competency_id) && (
                              <option value={comp.competency_id}>
                                {competencies.find(c => c.id === comp.competency_id)?.name || 'Unknown'}
                              </option>
                            )}
                          </select>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            Required Score:
                          </label>
                          <input
                            type="number"
                            className="required_score mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                            min="1"
                            max="10"
                            value={comp.required_score || ''}
                            onChange={(e) => handleScoreChange(index, parseInt(e.target.value) || 0)}
                            required
                          />
                        </div>
                        
                        <button
                          type="button"
                          className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded mt-4"
                          onClick={() => removeCompetency(index)}
                        >
                          Remove
                        </button>
                      </div>
                    );
                  })}
                </div>
                
                <button
                  type="button"
                  className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded"
                  onClick={addCompetency}
                >
                  Add Competency
                </button>
              </>
            )}
          </div>
          
          <div>
            <button
              type="submit"
              className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded"
              disabled={isLoading}
            >
              {isLoading ? 'Adding...' : 'Add Employee'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CreateEmployee;