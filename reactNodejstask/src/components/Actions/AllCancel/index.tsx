import React, { useState } from "react";
import Popup from "reactjs-popup";

enum Status {
    NEW,
    IN_PROGRESS,
    COMPLETED,
    CANCELED
}

interface Appeal {
    id: number;
    topic: string;
    message: string;
    status: Status;
    resolutionText: string;
    cancellationReason: string;
    createdAt: string;
    updatedAt: string;
}

export default function AllCancel() {
    const [appeals, setAppels] = useState({ id: 0, topic: "", message: "", status: "", resolutionText: "", cancellationReason: "", createdAt: "", updatedAt: "" })
    const [appealsMapList, setAppelsMapList] = useState<Appeal[]>([])
    const [isModalOpen, setIsModalOpen] = useState(false);

    // кнопка для создания обращения (отправки в базу)
    const handleCancelSubmit = async () => {
        try {
            const data = await fetch(`http://localhost:3001/appeals/cancel-in-work`,
                {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ cancellationReason: appeals.cancellationReason })
                }
            )
            console.log('dataComplete: ', data)

            if (!data.ok) {
                console.error('Ошибка. Отменить обращение не удалось!')
            }

            const updatedAppeal = await data.json();
            setAppelsMapList((prev) => prev.map(a => (a.id === updatedAppeal.id ? updatedAppeal : a)))

            window.location.reload()
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <div>
            <Popup trigger={<button style={{ cursor: 'pointer', backgroundColor: '#FF6F6F', border: 'none', borderRadius: '8px', width: '20em', height: '2.2em', fontSize: '15px' }}>Отменить все обращения в 'работе'</button>} modal nested>
                {!isModalOpen && (
                    <div className="modal" style={{ display: 'grid', justifyContent: 'center', alignItems: 'center', minWidth: '300px', minHeight: '150px', backgroundColor: "#A8A8A8", marginBottom: "12px", borderRadius: "12px", padding: "8px" }}>
                        <div className="content">Причина отмены обращения</div>
                        <textarea
                            value={appeals.cancellationReason}
                            onChange={(e) => setAppels({ ...appeals, cancellationReason: e.target.value })}
                        />
                        <div>
                            <button type="submit" style={{ cursor: 'pointer', border: 'none', borderRadius: '8px', width: '15em', height: '2em', fontSize: '14px'}} onClick={() => { handleCancelSubmit(); setIsModalOpen(true) }}>Отправить</button>
                        </div>
                    </div>
                )}
            </Popup>
        </div>
    )
}