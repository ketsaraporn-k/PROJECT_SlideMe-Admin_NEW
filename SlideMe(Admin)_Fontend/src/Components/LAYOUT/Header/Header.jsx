import "./Header.css";

function Header() {
    return (
        <div className="header-container">
            <div className="profile-info">
                <img
                    src={"/ีuser.png"} // ตรวจสอบ path รูปภาพให้ถูกต้อง
                    alt="User Profile"
                    className="profile-img"
                />
                <div className="profile-details">
                    <h2>John Doe</h2> {/* สามารถเปลี่ยนเป็นค่าจาก backend */}
                    <p>Admin</p> {/* สามารถเปลี่ยนเป็นค่าจาก backend */}
                </div>
            </div>
        </div>
    );
}

export default Header;
