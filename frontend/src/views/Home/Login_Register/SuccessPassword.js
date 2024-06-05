import React, { useState } from "react";
import "./css/forgotpassword.css";
import Header from "../Header";
import Footer from "../Footer";
import axios from "axios";
import { useParams } from "react-router-dom";
const SuccessPassword = () => {
  const [newPassword, setNewPassword] = useState("");
  const [resetSuccess, setResetSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState(false);
  const [errorModalVisible, setErrorModalVisible] = useState(false);
  const [errorModalContent, setErrorModalContent] = useState("");
  const [ submitted,setSubmitted] = useState(false);

  const { token } = useParams();
  const handleResetPassword = async (e) => {
    e.preventDefault();
    setSubmitted(true)
    if(!newPassword) {
      showErrorModal("Vui lòng nhập mật khẩu")
      return;
    }
    if (newPassword.length < 6) {
      showErrorModal ("Mật khẩu phải chứa ít nhất 6 ký tự")
      return;
    }
    try {
      const response = await axios.post(
        `http://localhost:5000/reset-password/${token}`,
        { newPassword }
      );

      console.log(response.data);
      setSuccessMessage(true); 
      setTimeout(() => {
        setSuccessMessage(false);
        window.location.href = "http://localhost:3000/dang-nhap";
      }, 3000);
      console.log(response.data);
      setResetSuccess(true);
    } catch (error) {
      console.error(error);
    }
  };
  const showErrorModal = (content) => {
    setErrorModalContent(content);
    setErrorModalVisible(true);
  };

  const hideErrorModal = () => {
    setErrorModalVisible(false);
    setErrorModalContent("");
  };
  const handleOverlayClick = (e) => {
    console.log("Overlay clicked");
    if (e.target.classList.contains("background-modal-opacity2")) {
      hideErrorModal();
    }
  };
  return (
    <div>
       {errorModalVisible && (
           <div className="background-modal-opacity2"  onClick={handleOverlayClick}>
        <div className="modal-error2 ">

            <button onClick={hideErrorModal}>X</button>
       <br />
       <br />
            <p>{errorModalContent}</p>

        </div>
      </div>
    )}
      <Header />
      
      <div className="Forgotpassword-container">
        <div className="Forgotpassword-content">
          <div className="Forgotpassword-line-form">
            <div className="custom-input-Forgotpassword">
              <div className="wrap-info-Forgotpassword">
                <div className="title-status-Forgotpassword">
                  <p>Mật khẩu mới</p>
                  <div className="desc"></div>
                </div>
              </div>
              <div className="wrap-input-Forgotpassword">
                <div className="wrap-text-Forgotpassword">
                  <input
                    type="password"
                    name="newPassword"
                    placeholder="Nhập Mật Khẩu Mới"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  ></input>
                       <div className={successMessage ? "backdrop-show" : "backdrop-hide"}>
          {/* Hiển thị backdrop hoặc thông báo thành công */}
          <div className="success-message">
                <p>Cập nhật mật khẩu thành công!</p>
              </div>
        </div>
                </div>
              </div>
            </div>
          </div>
          <div className="wrap-btn-Forgotpassword">
            <button type="submit" className="" onClick={handleResetPassword}>
              Xác Nhận Mật Khẩu Mới
            </button>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default SuccessPassword;
