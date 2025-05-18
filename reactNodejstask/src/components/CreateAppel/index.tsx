import React, { useEffect, useState } from "react";
import { format } from "date-fns"
import { Complete } from "../Actions/Complete";
import { Cancel } from "../Actions/Cancel";
import { DateFilter } from "../Actions/DateFilter";
import AllCancel from "../Actions/AllCancel";
import Create from "../Actions/Create";

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

export default function CreateAppeal() {
    const [appealsMapList, setAppelsMapList] = useState<Appeal[]>([])
    const [filteredAppeals, setFilteredAppeals] = useState<Appeal[] | null>(null);
    const listToRender = filteredAppeals ?? appealsMapList

    // кнопка на обращение, чтобы взять его
    const handleStartSubmit = async (id: number) => {
        try {
            const data = await fetch(`http://localhost:3001/appeals/${id}/start`, { method: 'GET', headers: { 'Content-Type': 'application/json', } })

            if (!data.ok) {
                console.error('Ошибка. Взять обращение не удалось!')
            }

            const updatedAppeal = await data.json();
            setAppelsMapList((prev) => prev.map(a => (a.id === updatedAppeal.id ? updatedAppeal : a)))

            window.location.reload()
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await fetch(`http://localhost:3001/appeals`, { method: 'GET', headers: { 'Content-Type': 'application/json', } })
                const response: Appeal[] = await data.json()
                console.log("response: ", response)

                if (Array.isArray(response)) {
                    setAppelsMapList(response);
                } else {
                    console.error("Unexpected data format:", response);
                }
            } catch (error) {
                console.log(error)
            }
        }
        fetchData()
    }, [])

    return (
        <div style={{ display: 'grid', gap: '12px' }}>
            <div>
                <Create />
            </div>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'space-between' }}>
                <DateFilter onFilter={(appeals: Appeal[]) => setFilteredAppeals(appeals)} />
                <AllCancel />
            </div>
            <span>Обращения</span>
            {listToRender.map((appeal, index) => {
                const currentCreatedDate = format(appeal.createdAt, 'H:mm, dd.MM.yyyy')
                const currentUpdatedDate = format(appeal.updatedAt, 'H:mm, dd.MM.yyyy')
                return (
                    <div key={appeal.id} style={{ display: 'grid' }}>
                        {/* нужно изменить это, создав отдельный компонент */}
                        <div>
                            <div style={{ display: "flex", alignItems: "center", backgroundColor: "#FFF", border: '1px solid black', borderRadius: "12px 12px 12px 0", padding: "8px" }}>
                                <span style={{ minWidth: "5%" }}>{index + 1}</span>
                                <div style={{ display: "grid", minWidth: "30%", maxWidth: "30%" }}>
                                    <span style={{ fontWeight: '600' }}>{appeal.topic}</span>
                                    <span>{appeal.message}</span>
                                </div>
                                <div style={{ width: "15%" }}>
                                    {appeal.status.toString() === "NEW" || appeal.status.toString() === "IN_PROGRESS" || appeal.status.toString() === "COMPLETED"
                                        ? <span style={{ color: "green" }}>{appeal.status}</span>
                                        : <span style={{ color: "red" }}>{appeal.status}</span>}
                                </div>
                                <div style={{ width: "25%" }}>
                                    <span><span style={{ fontWeight: '600' }}>Date:</span> {currentCreatedDate}</span>
                                </div>
                                <div style={{ width: "25%" }}>
                                    <span><span style={{ fontWeight: '600' }}>Update:</span> {currentUpdatedDate}</span>
                                </div>
                            </div>
                            <div style={{ display: 'flex', gap: '8px' }}>
                                <button onClick={() => handleStartSubmit(appeal.id)} style={{ cursor: 'pointer', backgroundColor: '#FFE26F', border: 'none', borderRadius: '0 0 8px 8px', width: '10em', height: '2.2em', fontSize: '15px' }} type="submit">Взять в работу</button>
                                <Complete id={appeal.id} />
                                <Cancel id={appeal.id} />
                            </div>
                        </div>
                    </div>
                )
            })}
        </div>
    )
}