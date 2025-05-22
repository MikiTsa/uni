import React, { useState } from 'react';
import './ReportPopup.css';

export default function ReportPopup({ onClose, onSubmit, file }) {
    const [reason, setReason] = useState('');
    const [description, setDescription] = useState('');
    const [submitted, setSubmitted] = useState(false);
    const [emptyDescription, setEmptyDescription] = useState(false);
    const [emptyReason, setEmptyReason] = useState(false);

    const handleSubmit = () => {
    const isReasonEmpty = reason.trim().length === 0;
    const isDescriptionEmpty = description.trim().length === 0;

    setEmptyReason(isReasonEmpty);
    setEmptyDescription(isDescriptionEmpty);

    if (!isReasonEmpty && !isDescriptionEmpty) {
        onSubmit(file.id, reason, description);
        setSubmitted(true);
    }
};

    return (
        <div className="report-popup-overlay">
            <div className="report-popup">
                {!submitted ? (
                    <>
                        <h2>Prijavi vsebino</h2>
                        <p className='data-name'><strong>Ime datoteke:</strong> {file.name}</p>
                        {emptyReason ? (
                            <p className='missing-input'>podati morate razlog</p>
                        ):
                        (<></>)}
                        <input
                            placeholder="Vnesi razlog"
                            value={reason}
                            onChange={e => setReason(e.target.value)}
                        />
                        {emptyDescription ? (
                            <p className='missing-input'>podati morate opis</p>
                        ):
                        (<></>)}
                        <textarea
                            placeholder="Vnesi opis..."
                            value={description}
                            onChange={e => setDescription(e.target.value)}
                        />
                        
                        <div className="report-popup-buttons">
                            <button className="cancel-button" onClick={onClose}>Prekliči</button>
                            <button className="submit-button" onClick={handleSubmit}>Pošlji prijavo</button>
                        </div>
                    </>
                ) : (
                    <>
                        <h2>Hvala ti!</h2>
                        <p>Vaša prijava je bila uspešno poslana. Vsebino bomo kmalu pregledali.</p>
                        <div className="report-popup-buttons">
                            <button className="submit-button" onClick={onClose}>Zapri</button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
