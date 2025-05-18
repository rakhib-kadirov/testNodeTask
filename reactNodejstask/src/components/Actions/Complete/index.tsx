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

interface CompleteAppeal {
    id: number;
}

export const Complete: React.FC<CompleteAppeal> = ({ id }) => {
    const [appeals, setAppels] = useState({ id: 0, topic: "", message: "", status: "", resolutionText: "", cancellationReason: "", createdAt: "", updatedAt: "" })
    const [appealsMapList, setAppelsMapList] = useState<Appeal[]>([])
    const [isModalOpen, setIsModalOpen] = useState(false);

    // кнопка для создания обращения (отправки в базу)
    const handleCompleteSubmit = async (id: number) => {
        try {
            const data = await fetch(`http://localhost:3001/appeals/${id}/complete`,
                {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ resolutionText: appeals.resolutionText })
                }
            )
            console.log('dataComplete: ', data.body)

            if (!data.ok) {
                console.error('Ошибка. Завершить обращение не удалось!')
            }

            const updatedAppeal = await data.json();
            setAppelsMapList((prev) => prev.map(a => (a.id === updatedAppeal.id ? updatedAppeal : a)))

            window.location.reload()
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <div key={id}>
            <Popup trigger={<button style={{ cursor: 'pointer', backgroundColor: '#59CC59', border: 'none', borderRadius: '0 0 8px 8px', width: '15em', height: '2.2em', fontSize: '15px' }}>Завершить обращение</button>} modal nested>
                {!isModalOpen && (
                    <div className="modal" style={{ display: 'grid', justifyContent: 'center', alignItems: 'center', minWidth: '300px', minHeight: '150px', backgroundColor: "#A8A8A8", marginBottom: "12px", borderRadius: "12px", padding: "8px" }}>
                        <div className="content">Принятое решение по обращению</div>
                        <textarea
                            value={appeals.resolutionText}
                            onChange={(e) => setAppels({ ...appeals, resolutionText: e.target.value })}
                        />
                        <div>
                            <button type="submit" style={{ cursor: 'pointer', border: 'none', borderRadius: '8px', width: '15em', height: '2em', fontSize: '14px'}} onClick={() => { handleCompleteSubmit(id); setIsModalOpen(true) }}>Завершить</button>
                        </div>
                    </div>
                )}
            </Popup>
        </div>
    )
}