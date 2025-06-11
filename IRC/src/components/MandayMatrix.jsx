import React, { useState, useEffect } from 'react';
import YAML from 'yaml';
import './MandayMatrix.css';
import { useNavigate } from 'react-router-dom';

const defaultMatrix = {
  roles: {
    developer: {
      junior: { manday: 0.5, description: "Junior Developer" },
      mid: { manday: 1.0, description: "Mid-level Developer" },
      senior: { manday: 1.5, description: "Senior Developer" }
    },
    designer: {
      junior: { manday: 0.5, description: "Junior Designer" },
      mid: { manday: 1.0, description: "Mid-level Designer" },
      senior: { manday: 1.5, description: "Senior Designer" }
    },
    qa: {
      junior: { manday: 0.5, description: "Junior QA" },
      mid: { manday: 1.0, description: "Mid-level QA" },
      senior: { manday: 1.5, description: "Senior QA" }
    }
  },
  tasks: {
    frontend: {
      basic: { manday: 1, description: "Basic Frontend Task" },
      medium: { manday: 2, description: "Medium Frontend Task" },
      complex: { manday: 3, description: "Complex Frontend Task" }
    },
    backend: {
      basic: { manday: 1, description: "Basic Backend Task" },
      medium: { manday: 2, description: "Medium Backend Task" },
      complex: { manday: 3, description: "Complex Backend Task" }
    },
    database: {
      basic: { manday: 1, description: "Basic Database Task" },
      medium: { manday: 2, description: "Medium Database Task" },
      complex: { manday: 3, description: "Complex Database Task" }
    }
  }
};

function MandayMatrix() {
  const [matrix, setMatrix] = useState(defaultMatrix);
  const [yamlContent, setYamlContent] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMatrix = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('http://localhost:8000/manday-matrix', {
          credentials: 'include'
        });
        
        if (response.status === 401) {
          navigate('/login');
          return;
        }
        
        if (response.ok) {
          const data = await response.json();
          setMatrix(data);
        }
      } catch (err) {
        setError('Failed to load matrix configuration');
      } finally {
        setIsLoading(false);
      }
    };

    fetchMatrix();
  }, [navigate]);

  useEffect(() => {
    setYamlContent(YAML.stringify(matrix));
  }, [matrix]);

  const handleYamlChange = (e) => {
    setYamlContent(e.target.value);
  };

  const handleSave = async () => {
    try {
      const newMatrix = YAML.parse(yamlContent);
      setIsLoading(true);
      
      const response = await fetch('http://localhost:8000/manday-matrix', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(newMatrix)
      });

      if (response.status === 401) {
        navigate('/login');
        return;
      }

      if (response.ok) {
        setMatrix(newMatrix);
        setIsEditing(false);
        setError('');
      } else {
        throw new Error('Failed to save matrix');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setYamlContent(YAML.stringify(matrix));
    setIsEditing(false);
    setError('');
  };

  if (isLoading) {
    return (
      <div className="manday-matrix">
        <h2>Loading...</h2>
      </div>
    );
  }

  return (
    <div className="manday-matrix">
      <h2>Manday Matrix Configuration</h2>
      
      {isEditing ? (
        <div className="yaml-editor">
          <textarea
            value={yamlContent}
            onChange={handleYamlChange}
            rows={20}
            placeholder="Enter YAML configuration..."
          />
          {error && <div className="error-message">{error}</div>}
          <div className="button-group">
            <button 
              onClick={handleSave} 
              className="save-button"
              disabled={isLoading}
            >
              {isLoading ? 'Saving...' : 'Save'}
            </button>
            <button 
              onClick={handleCancel} 
              className="cancel-button"
              disabled={isLoading}
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div className="matrix-display">
          <pre>{yamlContent}</pre>
          <button 
            onClick={handleEdit} 
            className="edit-button"
            disabled={isLoading}
          >
            Edit Matrix
          </button>
        </div>
      )}

      <div className="matrix-info">
        <h3>Matrix Structure</h3>
        <p>The matrix is organized into two main sections:</p>
        <ul>
          <li>
            <strong>Roles:</strong> Defines manday values for different roles and seniority levels
            <ul>
              <li>Developer (Junior, Mid, Senior)</li>
              <li>Designer (Junior, Mid, Senior)</li>
              <li>QA (Junior, Mid, Senior)</li>
            </ul>
          </li>
          <li>
            <strong>Tasks:</strong> Defines manday values for different types of tasks
            <ul>
              <li>Frontend (Basic, Medium, Complex)</li>
              <li>Backend (Basic, Medium, Complex)</li>
              <li>Database (Basic, Medium, Complex)</li>
            </ul>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default MandayMatrix; 