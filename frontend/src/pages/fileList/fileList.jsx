import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import './FileList.css';
import NavBar from '../NavBar/NavBar';
import ReportPopup from '../ReportPopup/ReportPopup';


export default function FileListPage() {
    const { predmetiId, stopnjaId, letnikId, semesterId, predmetId, vrstaId } = useParams();
    const [menuOpen, setMenuOpen] = useState(false);
    const toggleMenu = () => setMenuOpen(o => !o);

    const [files, setFiles] = useState([]);
    const [userMap, setUserMap] = useState({});
    const [reportingFile, setReportingFile] = useState(null);

    const fileInputRef = useRef(null);
    const [authMessage, setAuthMessage] = useState('');
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    useEffect(() => {
        fetch('/api/users/me', { credentials: 'include' })
          .then(res => {
            console.log("loged in")
            if (res.ok) setIsLoggedIn(true);
          })
          .catch(() => setIsLoggedIn(false));
      }, []);

    // TODO: get user from context or props
    const handleAddClick = () => {
        if (!isLoggedIn) {
            setAuthMessage('Za to dejanje poraš biti prijavljen');
            return;
        }
        setAuthMessage('');
        if (fileInputRef.current) fileInputRef.current.click();
    };

    const handleFileAdd = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('file', file);
        formData.append('subjectId', predmetId);
        formData.append('tagId', vrstaId);
        console.log()

        try {
            const res = await fetch('/api/files/upload', {
                method: 'POST',
                body: formData,
                credentials: 'include'
            });

            if (!res.ok) throw new Error('Upload failed');
            const newFile = await res.json();
            setFiles(prev => [...prev, newFile]);
        } catch (err) {
            console.error('Upload error:', err);
        }
    };

    /*GENERAL TODO:
         -flagging
         -showing rating
         -hide voting and flagging when not logged in
     */

    useEffect(() => {
        fetch(`/api/files/subjects/${predmetId}/files`) 
            .then(res => res.json())
            .then(async (data) => {
                setFiles(data);
    
                const uniqueUserIds = [...new Set(data.map(file => file.createdBy))];
                const userEntries = await Promise.all(
                    uniqueUserIds.map(async id => {
                        try {
                            const res = await fetch(`/api/users/${id}`);
                            const user = await res.json();
                            return [id, user.username];
                        } catch {
                            return [id, 'Neznan'];
                        }
                    })
                );
                setUserMap(Object.fromEntries(userEntries));
            })
            .catch(console.error);
    }, [predmetId]);

    const noFiles = files.length === 0;

    const fileTypeTitle = {
        "1": "Zapiski",
        "2": "Vaje",
        "3": "Izpiti in kolokviji"
    }[vrstaId] || "Dokumenti";

    const handleVoting = async (fileId, typeOfVOte) => {
        try {
            const res = await fetch(`/api/files/${fileId}/${typeOfVOte ? "upvote" : "downvote"}`, {
                method: 'POST',
            });

            if (!res.ok) {
                throw new Error('Failed to vote');
            }

            console.log(`Voted file with ID: ${fileId}`);
        } catch (error) {
            console.error('Error voting file:', error);
        }

    };

    const handleReportSubmit = async (fileId, reason, description) => {

        alert("razlog: "+reason+", opis: "+description);
        //TODO ker manjka v API
        /*try {
            const res = await fetch(`/api/files/${fileId}/report`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ reason, description }),
            });
            if (!res.ok) throw new Error('Failed to report file');
            alert('Prijava uspešno poslana');
        } catch (error) {
            console.error('Napaka pri prijavi datoteke:', error);
            alert('Napaka pri pošiljanju prijave.');
        }*/
    };

    const handleDownload = async (fileId, fileName) => {
        try {
            const res = await fetch(`/api/files/${fileId}`, {
                method: 'GET',
                credentials: 'include'
            });
            if (!res.ok) throw new Error('Download failed');
            const blob = await res.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = fileName;
            document.body.appendChild(a);
            a.click();
            a.remove();
            window.URL.revokeObjectURL(url);
        } catch (err) {
            console.error('Download error:', err);
        }
    };

    const handleDelete = async (fileId) => {
        try {
            const res = await fetch(`/api/files/${fileId}`, {
                method: 'DELETE',
                credentials: 'include'
            });
            if (!res.ok) throw new Error('Delete failed');
            // Remove the deleted file from state
            setFiles(prev => prev.filter(f => f.id !== fileId));
        } catch (err) {
            console.error('Delete error:', err);
        }
    };


    return (
        <div className="filelist-page-container">
            <NavBar menuOpen={menuOpen} onMenuToggle={toggleMenu} />
            <hr className="page-separator" />

            <div className="body">
                <div className="file-header">
                  <h1 className="file-use-title">{fileTypeTitle}</h1>
                  <button className="add-button" onClick={handleAddClick}>
                    + Dodaj dokument
                    {authMessage && <div className="auth-message">{authMessage}</div>}
                  </button>
                  <input
                    type="file"
                    ref={fileInputRef}
                    style={{ display: 'none' }}
                    onChange={handleFileAdd}
                  />
                </div>

                {!noFiles ? (
                    <div className="files-container">
                        {files.map(file => (
                            <div className="file-row" key={file.id}>
                                <div className="file-info">
                                    <div className="left-group">
                                        <span className="file-title">{file.name}</span>
                                        <span className="file-author">{userMap[file.createdBy] || 'Nalaganje...'}</span>
                                        <span className="file-date">
                                            {new Date(file.createdAt).toLocaleString('sl-SI', {
                                                year: 'numeric',
                                                month: '2-digit',
                                                day: '2-digit',
                                                hour: '2-digit',
                                                minute: '2-digit',
                                            })}
                                        </span>
                                    </div>
                                    <span
                                        className="material-icons download-icon"
                                        onClick={() => handleDownload(file.id, file.name)}
                                    >
                                        download
                                    </span>
                                    <span className="material-icons flag-icon" onClick={() => setReportingFile(file)}>flag</span>
                                </div>
                                <div className="voting-section">
                                    <div className="vote-count">{0}</div>
                                    <span className="vote-btn upvote material-icons" onClick={() => handleVoting(file.id, true)}>thumb_up</span>
                                    <span className="vote-btn downvote material-icons" onClick={() => handleVoting(file.id, false)}>thumb_down</span>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="no-subjects-message">
                        Dokumenti niso bili najdeni, ker jih verjetno ni v bazi.
                    </p>
                )}
            </div>
            {reportingFile && (
                <ReportPopup
                    file={reportingFile}
                    onClose={() => setReportingFile(null)}
                    onSubmit={handleReportSubmit}
                />
            )}
        </div>
    );
}
