import './MyDocs.css';
import NavBar from '../NavBar/NavBar';
import { useState, useEffect } from 'react';
import { FaFileWord, FaFilePdf, FaFileImage, FaGoogleDrive, FaTrash, FaChevronLeft } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

// Delete Confirmation Modal Component
const DeleteConfirmationModal = ({ show, onCancel, onConfirm, documentName }) => {
  if (!show) return null;
  
  return (
    <div className="delete-modal-backdrop">
      <div className="delete-modal">
        <h3>Potrdi brisanje</h3>
        <p>Ali ste prepričani, da želite izbrisati dokument "{documentName}"?</p>
        <div className="delete-modal-buttons">
          <button onClick={onCancel} className="cancel-btn">Prekliči</button>
          <button onClick={onConfirm} className="delete-btn">Izbriši</button>
        </div>
      </div>
    </div>
  );
};

export default function MyDocs() {
  const [menuOpen, setMenuOpen] = useState(false);
  const toggleMenu = () => setMenuOpen(open => !open);
  const navigate = useNavigate();

  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [documentToDelete, setDocumentToDelete] = useState(null);

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const response = await fetch('/api/files', { credentials: 'include' });
        if (!response.ok) throw new Error('Failed to fetch documents');
        const data = await response.json();
        setDocuments(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchDocuments();
  }, []);

  const handleDeleteClick = (doc) => {
    setDocumentToDelete(doc);
    setShowDeleteModal(true);
  };

  const handleCancelDelete = () => {
    setShowDeleteModal(false);
    setDocumentToDelete(null);
  };

  const handleConfirmDelete = async () => {
    if (!documentToDelete) return;
    
    try {
      const response = await fetch(`/api/files/${documentToDelete.id}`, {
        method: 'DELETE',
        credentials: 'include'
      });
      
      if (!response.ok) throw new Error('Failed to delete document');
      
      setDocuments(documents.filter(doc => doc.id !== documentToDelete.id));
      
    } catch (err) {
      console.error('Error deleting document:', err); 
    } finally {
      setShowDeleteModal(false);
      setDocumentToDelete(null);
    }
  };

  const iconForType = (extension) => {
    switch (extension?.toLowerCase()) {
      case 'word':
      case 'doc':
      case 'docx':
        return <FaFileWord color="blue" />;
      case 'pdf':
        return <FaFilePdf color="red" />;
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif':
        return <FaFileImage color="green" />;
      case 'drive':
        return <FaGoogleDrive color="orange" />;
      default:
        return <FaFileWord />;
    }
  };

  return (
    <div className='full-page'>
          <NavBar menuOpen={menuOpen} onMenuToggle={toggleMenu} />
          <hr className="page-separator" />

    <div className="documents-wrapper">
      <div className="documents-container">
        <h1 className="documents-title">MOJI DOKUMENTI</h1>
        
        <table className="documents-table">
          <tbody>
            {loading ? (
              <tr><td>Loading...</td></tr>
            ) : error ? (
              <tr><td style={{ color: 'red' }}>{error}</td></tr>
            ) : (
              documents.map((doc, index) => {
                const extension = doc.name?.split('.').pop();
                return (
                  <tr key={doc.id || index} className="document-row">
                    <td>
                      {iconForType(extension)}
                      <span className="doc-name" style={{ marginLeft: '8px' }}>{doc.name}</span>
                    </td>
                    <td>{doc.date || doc.createdAt ? new Date(doc.date || doc.createdAt).toLocaleDateString() : '-'}</td>
                    <td>
                      <button className="edit-btn">Uredi dokument</button>
                      <button 
                        className="delete-btn" 
                        onClick={() => handleDeleteClick(doc)} 
                        aria-label="Izbriši dokument"
                      >
                        <FaTrash color="black" />
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
      <button
        className="back-btn"
        onClick={() => navigate('/profile')}
        aria-label="Nazaj na profil"
      >
        <FaChevronLeft size={24} />
      </button>
      
      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal 
        show={showDeleteModal}
        documentName={documentToDelete?.name}
        onCancel={handleCancelDelete}
        onConfirm={handleConfirmDelete}
      />
    </div>
        </div>

  );
}
