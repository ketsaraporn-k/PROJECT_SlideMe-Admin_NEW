import React, { useEffect, useState } from "react";
import "./Price-1.css";
import axios from "axios";

const Price = () => {
    const [prices, setPrices] = useState([]);
    const [newPrice, setNewPrice] = useState({
        vehicle_type: "",
        price: "",
        distance_id: "",
    });

    useEffect(() => {
        fetchPrices();
    }, []);

    const fetchPrices = async () => {
        try {
            const response = await axios.get("http://localhost:5000/price");
            setPrices(response.data);
        } catch (error) {
            console.error("โหลดข้อมูลล้มเหลว:", error);
        }
    };

    const handleChange = (id, field, value) => {
        setPrices((prev) =>
            prev.map((item) =>
                item._id === id ? { ...item, [field]: value } : item
            )
        );
    };

    const handleSave = async (id) => {
        const item = prices.find((p) => p._id === id);
        try {
            await axios.put(`http://localhost:3000/price/${id}`, item);
            fetchPrices();
        } catch (error) {
            console.error("แก้ไขล้มเหลว:", error);
        }
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:3000/price/${id}`);
            fetchPrices();
        } catch (error) {
            console.error("ลบล้มเหลว:", error);
        }
    };

    const handleAdd = async () => {
        try {
            const res = await axios.post("http://localhost:3000/price", {
                vehicle_type: newPrice.vehicle_type,
                price: parseFloat(newPrice.price),
                distance_id: newPrice.distance_id,
            });
            if (res.status === 201) {
                fetchPrices();
                setNewPrice({ vehicle_type: "", price: "", distance_id: "" });
            }
        } catch (error) {
            console.error("เพิ่มล้มเหลว:", error);
        }
    };

    return (
        <div className="price-container">
            <h2>บริการและราคา</h2>
            <table>
                <thead>
                    <tr>
                        <th>#</th>
                        <th>ประเภทรถ</th>
                        <th>ราคา</th>
                        <th>รหัสระยะทาง</th>
                        <th>การจัดการ</th>
                    </tr>
                </thead>
                <tbody>
                    {prices.map((item, index) => (
                        <tr key={item._id}>
                            <td>{index + 1}</td>
                            <td>
                                <input
                                    type="text"
                                    value={item.vehicle_type}
                                    onChange={(e) =>
                                        handleChange(item._id, "vehicle_type", e.target.value)
                                    }
                                />
                            </td>
                            <td>
                                <input
                                    type="number"
                                    value={item.price}
                                    onChange={(e) =>
                                        handleChange(item._id, "price", e.target.value)
                                    }
                                />
                            </td>
                            <td>
                                <input
                                    type="text"
                                    value={item.distance_id}
                                    onChange={(e) =>
                                        handleChange(item._id, "distance_id", e.target.value)
                                    }
                                />
                            </td>
                            <td>
                                <button onClick={() => handleSave(item._id)}>บันทึก</button>
                                <button onClick={() => handleDelete(item._id)}>ลบ</button>
                            </td>
                        </tr>
                    ))}
                    <tr>
                        <td>#</td>
                        <td>
                            <input
                                type="text"
                                placeholder="ประเภทรถ"
                                value={newPrice.vehicle_type}
                                onChange={(e) =>
                                    setNewPrice({ ...newPrice, vehicle_type: e.target.value })
                                }
                            />
                        </td>
                        <td>
                            <input
                                type="number"
                                placeholder="ราคา"
                                value={newPrice.price}
                                onChange={(e) =>
                                    setNewPrice({ ...newPrice, price: e.target.value })
                                }
                            />
                        </td>
                        <td>
                            <input
                                type="text"
                                placeholder="รหัสระยะทาง"
                                value={newPrice.distance_id}
                                onChange={(e) =>
                                    setNewPrice({ ...newPrice, distance_id: e.target.value })
                                }
                            />
                        </td>
                        <td>
                            <button onClick={handleAdd}>เพิ่ม</button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
};

export default Price;