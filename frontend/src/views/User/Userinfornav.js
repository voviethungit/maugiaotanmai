import React,{useState, useEffect} from "react";
import "./css/userinfor.css";
import "./css/base.css";
import "./css/mainuser.css";
import { Link } from "react-router-dom";
import {
  FaUser,
  FaCar,
  FaHeart,
  FaMapLocationDot,
  FaGift,
  FaLocationDot,
  FaKey,
  FaTrashCan,
  FaArrowRightFromBracket,
} from "react-icons/fa6";

function Userinfornav() {
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("isAdmin");
    localStorage.removeItem("userId");
    window.location.href = "http://localhost:3000/";
  };

  const [activeLink, setActiveLink] = useState(null);

  const handleLinkClick = (link) => {
    setActiveLink(link);
  };
  useEffect(() => {
    const isAdminUser = localStorage.getItem("isAdmin");
    setIsAdmin(isAdminUser === "true");
  }, []);
  return (

    <div>
      <ul className="userinfor__nav-list">
        <Link
          to="/nguoi-dung"
          className="userinfor-nav-link" 
        >
          <li className={`userinfor__nav-list-child ${activeLink === '/nguoi-dung' ? 'active-link' : ''}`}
              onClick={() => handleLinkClick('/nguoi-dung')} >
            <i className="userinfor__nav-list-child-icon">
              <FaUser />
            </i>
            <p className="userinfor__nav-list-child-text">Tài khoản của tôi</p>
          </li>
        </Link>

        {isAdmin && (
          <Link to="/admin/dashboard" className="userinfor-nav-link">
            <li className="userinfor__nav-list-child">
              <i className="userinfor__nav-list-child-icon">
                <FaUser />
              </i>
              <p className="userinfor__nav-list-child-text">Truy Cập Admin</p>
            </li>
          </Link>
        )}

        <Link
          to="/dia-chi-cua-toi"
          className="userinfor-nav-link"
        >
          <li className={`userinfor__nav-list-child ${activeLink === '/dia-chi-cua-toi' ? 'active-link' : ''}`}
              onClick={() => handleLinkClick('/dia-chi-cua-toi')} >
            <i className="userinfor__nav-list-child-icon">
              <FaLocationDot></FaLocationDot>
            </i>
            <p className="userinfor__nav-list-child-text">Địa chỉ của tôi</p>
          </li>
        </Link>

        <Link
          to="/doi-mat-khau"
          className="userinfor-nav-link"
        >
          <li className={`userinfor__nav-list-child ${activeLink === '/doi-mat-khau' ? 'active-link' : ''}`}
              onClick={() => handleLinkClick('/doi-mat-khau')} >
            <i className="userinfor__nav-list-child-icon">
              <FaKey></FaKey>
            </i>
            <p className="userinfor__nav-list-child-text">Đổi mật khẩu</p>
          </li>
        </Link>

        <Link onClick = {handleLogout}
          className="userinfor-nav-link"
        >
          <li className="userinfor__nav-list-child">
            <i className="userinfor__nav-list-child-icon">
              <FaArrowRightFromBracket></FaArrowRightFromBracket>
            </i>
            <p className="userinfor__nav-list-child-text">Đăng xuất</p>
          </li>
        </Link>


      </ul>
    </div>
  );
}
export default Userinfornav;
