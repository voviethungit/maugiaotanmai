import React, {useState} from 'react'
import './css/forgotpassword.css'
import Header from '../Header';
import Footer from '../Footer';
import axios from 'axios';

const Forgotpasword = () => {


  const [email, setEmail] = useState("");
  const [successMessage, setSuccessMessage] = useState(false);
  const [ submitted,setSubmitted] = useState(false);
  const [errorModalVisible, setErrorModalVisible] = useState(false);
const [errorModalContent, setErrorModalContent] = useState("");
  const handleForgotPassword = async (e) => {
    e.preventDefault();
     setSubmitted (true)
     setSubmitted(true);
    if (!email ) {
     showErrorModal("Email không được để trống");
  
      return;
    }
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        showErrorModal("Địa chỉ email không hợp lệ.");
        return;
      }
    try {
      const response = await axios.post(
        "http://localhost:5000/forgot-password",
        { email }
      );
    
  
      console.log(response.data);
      setSuccessMessage(true); 
      setTimeout(() => {
        setSuccessMessage(false);
      }, 3000);
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
          <Header/>
          
          {errorModalVisible && (
           <div className="background-modal-opacity2"  onClick={handleOverlayClick}>
        <div className="modal-error2 ">

            <button onClick={hideErrorModal}>X</button>
            <h1>Quên mật khẩu</h1>
            <p>{errorModalContent}</p>

        </div>
      </div>
    )}
        <form onSubmit={handleForgotPassword} className="form-Forgotpassword">
   
        <div className="Forgotpassword-container">
          <div className="Forgotpassword-content">
            <div className="Forgotpassword-header">
              <h2>Quên mật khẩu</h2>
            </div>
            <div className={successMessage ? "backdrop-show" : "backdrop-hide"}>
          {/* Hiển thị backdrop hoặc thông báo thành công */}
          <div className="success-message">
                <p>Yêu cầu đã được gửi thành công!</p>
              </div>
        </div>
            <div className="Forgotpassword-body">
              <div className="Forgotpassword-input-body">
                <div className="Forgotpassword-line-form">
                  <div className="custom-input-Forgotpassword">
                    <div className="wrap-info-Forgotpassword">
                      <div className="title-status-Forgotpassword">
                        <p>Email</p>
                        <div className="desc"></div>
                      </div>
                    </div>
                    <div className="wrap-input-Forgotpassword">
                      <div className="wrap-text-Forgotpassword">
                        <input
                          type="email"
                          name="email"
                          placeholder="Nhập Email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                        ></input>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="wrap-btn-Forgotpassword">
                  <button type="submit" className="">
                    Gửi Yêu Cầu
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
      <Footer />
    </div>
  );
};

export default Forgotpasword;
