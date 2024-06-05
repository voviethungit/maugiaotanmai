import React, { useState } from 'react';
import './css/userinfor.css';
import './css/base.css';
import './css/mainuser.css';
import Header from '../Home/Header';
import Footer from '../Home/Footer';
import { Link } from 'react-router-dom';

const ConfirmModal = ({ isOpen, onCancel, onConfirm }) => {
  return (
    isOpen && (
      <div className="confirm-modal">
      <div className='success-modal-deleteaccount'>
        <p>Bạn có chắc chắn muốn xóa tài khoản của mình không?</p>
        <div className='button-xacnhanxoa'>
            <button onClick={onCancel} className='deletecancel-btn'>Hủy</button>
            <button onClick={onConfirm}>Xác nhận</button>        
        </div>
        </div>
      </div>
    )
  );
};

const SuccessModal = ({ isOpen, onClose }) => {
  return (
    isOpen && (
      <div className="success-modal">
      <div className='success-modal-deleteaccount'>
        <p>Hệ thống đã xác nhận xóa tài khoản của bạn</p>
        <p>Vui lòng chờ thông báo ở Gmail để xác nhận</p>
        <button onClick={onClose}>Đóng</button>
      </div>
      </div>
    )
  );
};

const handleLogout = () => {
    localStorage.clear();
    window.location.href = "http://localhost:3000/"
  };

function Deleteaccount() {
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [isSuccessModalOpen, setSuccessModalOpen] = useState(false);

  const handleDeleteClick = () => {
    setDeleteModalOpen(true);
  };

  const handleCancelDelete = () => {
    setDeleteModalOpen(false);
  };

  const handleConfirmDelete = () => {
    setTimeout(() => {
      setDeleteModalOpen(false);
      setSuccessModalOpen(true);
    }, 1000);
  };

  const handleCloseSuccessModal = () => {
    setSuccessModalOpen(false);
  };

  return (
    <div className="main-color">
      <Header />
      <div className="deleteaccount-form">
        <div className="deleteaccount-content">
        <h2>Yêu cầu xóa tài khoản</h2>
        <img src='https://www.mioto.vn/static/media/empty-del-account.8493997e.svg' alt=''></img>
        <div className='deleteaccount-content-inner'>
            <p>Khi xóa tài khoản, các thông tin sau (nếu có) sẽ bị xóa trên hệ thống:</p>
            <ul>
                <li>Thông tin cá nhân</li>
                <li>Thông tin lịch sử chuyến và danh sách xe</li>
            </ul>
            <p>Tiền ví và điểm thưởng sẽ được thanh toán theo quy định và chính sách hiện hành của Xe tốt.</p>
            <p>Việc đồng ý xóa tài khoản là bạn đã chấp nhận điều khoản chính sách xóa tài khoản của Xe tốt.</p>
            <p>Yêu cầu xóa tài khoản sẽ được xử lý trong vòng 15 ngày làm việc. Xe tốt sẽ liên hệ trực tiếp với bạn thông qua Email hoặc Số điện thoại đã cung cấp.</p>
            <p>Mọi thắc mắc xin liên hệ Fanpage của Xe tốt hoặc Hotline 0354399046 (7AM - 10PM) để được hỗ trợ.</p>
        </div>
          <div className="deleteaccount-btnn">
            <p onClick={handleDeleteClick} className="userinfor-nav-link">
              Xóa tài khoản
            </p>
          </div>
        </div>
      </div>
      <Footer />
      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onCancel={handleCancelDelete}
        onConfirm={handleConfirmDelete}
      />
      <SuccessModal
        isOpen={isSuccessModalOpen}
        onClose={handleLogout}
      />
    </div>
  );
}

export default Deleteaccount;
