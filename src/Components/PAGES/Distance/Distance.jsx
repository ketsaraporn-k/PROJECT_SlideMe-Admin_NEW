import React, { useState } from "react";
import "./Distance-1.css";
import axios from "axios"; // ต้องติดตั้ง axios ก่อนด้วย: npm install axios

const Distance = () => {
    const [fromLocation, setFromLocation] = useState("");
    const [toLocation, setToLocation] = useState("");
    const [distanceKm, setDistanceKm] = useState("");
    const [savedMessage, setSavedMessage] = useState("");

    const handleSave = async () => {
        if (fromLocation && toLocation && distanceKm) {
            try {
                const response = await axios.post("http://localhost:3000/distance", {
                    from_location: fromLocation,
                    to_location: toLocation,
                    distance_km: parseFloat(distanceKm),
                });

                if (response.status === 201) {
                    setSavedMessage("บันทึกระยะทางเรียบร้อยแล้ว!");
                    setFromLocation("");
                    setToLocation("");
                    setDistanceKm("");
                }
            } catch (error) {
                console.error("เกิดข้อผิดพลาด:", error);
                setSavedMessage("ไม่สามารถบันทึกระยะทางได้");
            }
        }
    };

    return (
        <div className="distance-container">
            <h2>จัดการระยะทาง</h2>
            <input
                type="text"
                placeholder="จากสถานที่"
                value={fromLocation}
                onChange={(e) => setFromLocation(e.target.value)}
            />
            <input
                type="text"
                placeholder="ไปยังสถานที่"
                value={toLocation}
                onChange={(e) => setToLocation(e.target.value)}
            />
            <input
                type="number"
                placeholder="ระยะทาง (กิโลเมตร)"
                value={distanceKm}
                onChange={(e) => setDistanceKm(e.target.value)}
            />
            <button onClick={handleSave}>บันทึก</button>

            {savedMessage && <p className="saved-result">{savedMessage}</p>}
        </div>
    );
};

export default Distance;