import React, { useState, useEffect } from 'react';
import './css/header.css';
import './css/base.css';
import { FaBell, FaAngleDown, FaBars, FaX, FaUserLarge, FaDoorOpen } from "react-icons/fa6";
import { Link } from 'react-router-dom';
import axios from 'axios';
import images from './img/erenyeager.jpg';
import { BeatLoader } from 'react-spinners';

function Header() {

  const [isHeaderFixed, setIsHeaderFixed] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY;
      setIsHeaderFixed(offset > 200);
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [fullName, setFullName] = useState('');
  const [avatar, setAvatar] = useState(null);
  const [isBell, setIsBell] = useState(true);
  const [isArrow, setIsArrow] = useState(true);
  const [isLoadingUserData, setIsLoadingUserData] = useState(true); 

  const togglebellDisplay = () => {
    setIsBell(!isBell);
  };
  
  const togglearrowDisplay = () => {
    setIsArrow(!isArrow);
  };

  const handleLogout = () => {
    localStorage.clear();
    setIsLoggedIn(false);
    setFullName('');
    setAvatar(null);
    setIsLoadingUserData(false);
    window.location.href = "/";
  };

  const defaultImage = images;

  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken');
    if (accessToken) {
      axios.get('http://localhost:5000/getProfile', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      .then((response) => {
        setAvatar(response.data.user.avatar);
        setFullName(response.data.user.fullName);
        setIsLoggedIn(true);
        setIsLoadingUserData(false);
      })
      .catch((error) => {
        console.error('Lỗi :', error);
        setIsLoadingUserData(false);
      });
    } else {
      setIsLoadingUserData(false);
    }
  }, []); 

  return (
    <div className={`header ${isHeaderFixed ? 'fixed' : ''} ${isHeaderFixed ? 'transparent' : ''}`} id='header'>
      <Link to="/" className='header__icon'>
        {/* <img src='https://i.ibb.co/RzXzDV0/7901d3f3f7ad56f30fbc.jpg' className='header__icon-img' /> */}
      </Link>
      <ul className='header__page'>
        <Link to="/" className='logout-item-page' id='trangchu'>TRANG CHỦ</Link>
        {isLoggedIn ? (
          <>
            <Link to="/ve-xe-tot" className='header__page-item login__page' id='gioithieu'>GIỚI THIỆU</Link>
            <Link to='/toan-bo-tai-lieu' className='logout-item-page' id='tailieu'>TÀI LIỆU</Link>
            <Link to='/doi-ngu' className='logout-item-page' id='lienhe'>ĐỘI NGŨ</Link>
            <Link to='/tin-tuc' className='logout-item-page' id='tintuc'>TIN TỨC</Link>
            <Link to='/lien-he' className='logout-item-page' id='lienhe'>LIÊN HỆ</Link>
          </>
        ) : (
          <>
            <Link to="/ve-xe-tot" className='logout-item-page' id='gioithieu'>GIỚI THIỆU</Link>
            <Link to='/toan-bo-tai-lieu' className='logout-item-page' id='tailieu'>TÀI LIỆU</Link>
            <Link to='/doi-ngu' className='logout-item-page' id='lienhe'>ĐỘI NGŨ</Link>
            <Link to='/tin-tuc' className='logout-item-page' id='tintuc'>TIN TỨC</Link>
            <Link to='/lien-he' className='logout-item-page' id='lienhe'>LIÊN HỆ</Link>
          </>
        )}
       
        {isLoadingUserData ? (
          <div className="spinner-container">
            <BeatLoader color="#36d7b7" size={22} />
          </div>
          
        ) : isLoggedIn ? (
          <div className='header__page-item-login'>
             <span onClick={togglebellDisplay} className='header__page-item-login-bell'>
              <i className='header__page-item-login-firt'><FaBell /></i>
              <div style={{ display: isBell ? 'none' : 'block' }} className='header__page-item-login-bell-list'>
                <p className='header__page-item-login-bell-list-name'>Thông báo</p>
                <p className='header__page-item-login-bell-list-text'>Hiện tại bạn chưa có thông báo nào từ Trường mẫu giáo Tân Thanh</p>
              </div>
            </span>
            <li className='header__page-item-vertical'></li>
            <div className='header__page-item-login-avt'>
              <img src={avatar || defaultImage} alt="" />
            </div>
            <h3 className='header__page-item-login-name'>{fullName}</h3>
            <span onClick={togglearrowDisplay} className='header__page-item-login-arrow'>
              <i className='header__page-item-login-last'><FaAngleDown /></i>
              <div style={{ display: isArrow ? 'none' : 'block' }} className='header__page-item-login-arrow-list'>
                <Link to='/nguoi-dung' className='header__page-item-login-arrow-list-name'>
                  <i><FaUserLarge /></i>Trang Cá Nhân
                </Link>
                <p className='header__page-item-login-arrow-list-name' onClick={handleLogout}>
                  <i><FaDoorOpen /></i>Đăng Xuất
                </p>
              </div>
            </span>
          </div>
        ) : (
          <div className='header__page-item-logout'>
            <Link to="/dang-ky" className='header__page-item-logout-register' id='dangky'>ĐĂNG KÝ</Link>
            <Link to="/dang-nhap" className='header__page-item-logout-register header__page-item-logout-register-button' id='dangnhap'>ĐĂNG NHẬP</Link>
          </div>
        )}
        <label htmlFor="nav-tablet-input" className="nav__bars-icon">
          <i className="header__page-item-login-iconbars"><FaBars /></i>
        </label>
        <input hidden type="checkbox" className="nav__input" id="nav-tablet-input" />
        <div id='nav__overlay' className='nav__overlay'>
          <label htmlFor='nav-tablet-input' id='close-overlay'>
            <i className='close-overlay-icon'><FaX /></i>
          </label>
          <div className='header__page-item-login-overlay'>
            {isLoggedIn ? (
              <div className='navbar__user'>
                <div className='header__page-item-login-overlay-avt'>
                  <img src={avatar || defaultImage} alt="" />
                  <h3 className='header__page-item-login-overlay-avt-name'>Xin chào <br />{fullName}</h3>
                </div>
                <Link to="/ve-xe-tot" className='header__page-item-login-overlay-about'>
                  <h3 className='header__page-item-login-overlay-about-name'>Về Xe Tốt</h3>
                </Link>
                <Link to="/chuyen-di-cua-toi" className='header__page-item-login-overlay-go'>
                  <h3 className='header__page-item-login-overlay-go-name'>Chuyến đi</h3>
                </Link>
                <Link to="/nap-tien" className='header__page-item-login-overlay-pay'>
                  <h3 className='header__page-item-login-overlay-pay-name'>Nạp Tiền</h3>
                </Link>
                <Link to="/bai-viet" className='header__page-item-login-overlay-listblog'>
                  <h3 className='header__page-item-login-overlay-listblog-name'>Bài Viết</h3>
                </Link>
                <div className='header__page-item-login-overlay-logout'>
                  <h3 className='header__page-item-login-overlay-logout-name' onClick={handleLogout}>
                    <i><FaDoorOpen /></i>Đăng xuất
                  </h3>
                </div>
                <Link to='/nguoi-dung' className='header__page-item-login-overlay-profile'>
                  <h3 className='header__page-item-login-overlay-profile-name'>
                    <i><FaUserLarge /></i>Trang cá nhân
                  </h3>
                </Link>
              </div>
            ) : (
              <div className='navbar__notuser'>
                <div className='navbar__notuser-name'>
                  <h3>Bạn chưa đăng ký đăng nhập ?</h3>
                </div>
                <Link to='/dang-nhap' className='navbar__notuser-login'>
                  <h3 className='navbar__notuser-login-text'>Đăng nhập</h3>
                </Link>
                <Link to="/dang-ky" className='navbar__notuser-register'>
                  <h3 className='navbar__notuser-register-text'>Đăng ký</h3>
                </Link>
                <Link to="/ve-xe-tot" className='navbar__notuser-register about__mobile'>
                  <h3 className='navbar__notuser-register-text'>Về Xe Tốt</h3>
                </Link>
                <Link to="/bai-viet1" className='navbar__notuser-register about__mobile'>
                  <h3 className='navbar__notuser-register-text'>Bài Viết</h3>
                </Link>
              </div>
            )}
          </div>
        </div>
      </ul>
    </div>
  )
}

export default Header;
