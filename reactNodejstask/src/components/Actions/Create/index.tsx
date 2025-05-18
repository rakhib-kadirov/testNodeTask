import React, { useState } from "react";
import Popup from "reactjs-popup";

export default function Create() {
    const [appeals, setAppels] = useState({ id: Number, topic: "", message: "", status: "", resolutionText: "", cancellationReason: "", createdAt: "", updatedAt: "" })
    const [isModalOpen, setIsModalOpen] = useState(false);

    // кнопка для создания обращения (отправки в базу)
    const handleCreateSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const data = await fetch(`http://localhost:3001/appeals`, { method: 'POST', headers: { 'Content-Type': 'application/json', }, body: JSON.stringify(appeals) })
        window.location.reload()
    }

    return (
        <div>
            <Popup trigger={<button style={{ cursor: 'pointer', backgroundColor: '#59CC59', border: 'none', borderRadius: '8px', width: '15em', height: '2.2em', fontSize: '15px' }}>Создать новое обращение</button>} modal nested>
                {!isModalOpen && (
                    <div className="modal" style={{ display: 'grid', justifyContent: 'center', alignItems: 'center', minWidth: '300px', minHeight: '150px', backgroundColor: "#A8A8A8", marginBottom: "12px", borderRadius: "12px", padding: "8px" }}>
                        <div className="content">Напишите тему и причину обращения</div>
                        <form onSubmit={handleCreateSubmit} style={{ display: 'grid', gap: '8px', width: '90%', marginTop: '4px' }}>
                            <input
                                placeholder="Тема обращения"
                                value={appeals.topic}
                                onChange={(e) => setAppels({ ...appeals, topic: e.target.value })}
                                // style={{ width: '100%', height: '24px', marginBottom: '8px' }}
                                style={{ maxWidth: '100%', height: '24px', padding: '4px 4px 4px 8px', border: '1px solid #56C991', borderRadius: '4px' }}
                            />
                            <textarea
                                placeholder="Сообщение"
                                value={appeals.message}
                                onChange={(e) => setAppels({ ...appeals, message: e.target.value })}
                                // style={{ width: '100%', height: '72px' }}
                                style={{ maxWidth: '100%', height: '72px', padding: '4px 4px 4px 8px', border: '1px solid #56C991', borderRadius: '4px' }}
                            />
                            <button style={{ cursor: 'pointer', border: 'none', borderRadius: '8px', width: '15em', height: '2em', fontSize: '14px'}} type="submit">Отправить</button>
                        </form>
                    </div>
                )}
            </Popup>
        </div>
    )
}