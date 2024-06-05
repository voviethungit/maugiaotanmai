import React, { useState, useEffect } from "react";
import axios from "axios";
import BeatLoader from "react-spinners/BeatLoader";
import { Link, useParams, useLocation } from "react-router-dom";
import "./css/contentproduct.css";
import "./css/base.css";
import { Helmet } from "react-helmet";
import {
  FaHeart,
  FaShareNodes,
  FaStar,
  FaFax,
  FaShield,
  FaQuestion,
  FaCalendarMinus,
  FaCircleCheck,
  FaCircleExclamation,
  FaFlag,
  FaChair,
  FaMendeley,
  FaChargingStation,
  FaBluetoothB,
  FaCamera,
  FaCameraRetro,
  FaBullseye,
  FaCarBurst,
  FaLocationCrosshairs,
  FaUsb,
  FaGlassWater,
  FaHandDots,
  FaIdCard,
  FaIdCardClip,
  FaLocationDot,
  FaCarRear,
  FaX,
  FaAddressCard,
  FaPhoneVolume,
  FaSquareEnvelope,
} from "react-icons/fa6";
import { BsShieldCheck } from "react-icons/bs";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import imgGirl from "../img/banner1.jpg";
import moment from "moment";
import "moment/locale/vi";

function ContentProduct() {
  const [defaultImage, setDefaultImage] = useState({});
  const { id } = useParams();
  const [reviews, setReviews] = useState([]);
  const [showFullComment, setShowFullComment] = useState(
    Array(reviews.length).fill(false)
  );
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [car, setCar] = useState(null);
  const [backgroundColor, setBackgroundColor] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [overlayOpacity, setOverlayOpacity] = useState(0);
  const [isHidden, setIsHidden] = useState(true);
  const [similarCars, setSimilarCars] = useState([]);
  const [copySuccess, setCopySuccess] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [licenseStatus, setLicenseStatus] = useState({
    hasDrivingLicense: false,
    status: "",
  });
  const openModal = (image) => {
    setModalOpen(true);
    setOverlayOpacity(1);
  };

  const closeModal = () => {
    setModalOpen(false);
    setOverlayOpacity(0);
  };

  useEffect(() => {
    applyFavoriteStatus();
  }, []);

  const applyFavoriteStatus = () => {
    const favoriteStatus = localStorage.getItem(`favorite_${id}`);
    if (favoriteStatus === "true") {
      setIsFavorite(true);
    }
  };

  const handleFavoriteClick = async () => {
    try {
      const userId = localStorage.getItem("userId");
      const accessToken = localStorage.getItem("accessToken");

      if (!userId || !accessToken) {
        setShowLoginPrompt(true);
        return;
      }

      const response = await fetch(
        `http://localhost:5000/favorite/${userId}/${id}`,
        {
          method: isFavorite ? "DELETE" : "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({
            carId: id,
            title: car.title,
            imagePath: car.imagePath,
            price: car.price,
          }),
        }
      );

      const data = await response.json();
      if (data.success) {
        setIsFavorite((prevState) => {
          const newState = !prevState;
          localStorage.setItem(`favorite_${id}`, newState ? "true" : "false");
          return newState;
        });
      }
    } catch (error) {
      console.error("Lỗi khi thêm vào xe yêu thích:", error);
    }
  };
  useEffect(() => {
    const userId = localStorage.getItem("userId");
    const accessToken = localStorage.getItem("accessToken");
    axios
      .get(`http://localhost:5000/check-gplx/${userId}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      .then((response) => {
        setLicenseStatus(response.data);
        console.log(response.data);
      })
      .catch((error) => {
        console.error("Error fetching license status:", error);
      });
    }, []);
  // cuộn trang
  const { carreaload } = useLocation();
  const getReviews = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/reviews/${id}`);
      setReviews(response.data);
    } catch (error) {
      console.error("Error fetching reviews:", error);
    }
  };
  useEffect(() => {
    getReviews();
  }, [id]);

  useEffect(() => {
    window.scrollTo(0, 0);

    const fetchSimilarCars = async () => {
      try {
        const response = await fetch(`http://localhost:5000/get-car/${id}`);
        const data = await response.json();

        if (data.success) {
          setSimilarCars(data.similarCars);
        } else {
          console.error("Failed to fetch similar cars:", data.message);
        }
      } catch (error) {
        console.error("Error fetching similar cars:", error);
      }
    };

    fetchSimilarCars();
  }, [id, carreaload]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const accessToken = localStorage.getItem("accessToken");
      const userId = localStorage.getItem("userId");
      const response = await axios.post(
        "http://localhost:5000/reviews",
        {
          userId,
          carId: id,
          rating: rating,
          reviewText: reviewText,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      getReviews();
      console.log("Review submitted:", response.data);
    } catch (error) {
      console.error("Error submitting review:", error);
    }
  };

  useEffect(() => {
    axios
      .get(`http://localhost:5000/get-car/${id}`)
      .then((response) => {
        setCar(response.data.car);
      })
      .catch((error) => {
        console.error("Lỗi:", error);
      });
  }, [id]);

  if (!car) {
    return <div className="spinner-container">
    <BeatLoader color="#36d7b7" size={40} />
  </div>;
  }
  const contactproduct__tablet = {
    dots: true,
    infinite: false,
    speed: 400,
    slidesToShow: 2,
    slidesToScroll: 1,
    initialSlide: 0,
    style: { display: "none" },
    responsive: [
      {
        breakpoint: 990,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          infinite: true,
          dots: true,
          style: { display: "block" },
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          initialSlide: 2,
          style: { display: "block" },
        },
      },
      {
        breakpoint: 550,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          style: { display: "block" },
        },
      },
      {
        breakpoint: 350,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          style: { display: "block" },
        },
      },
    ],
  };
  // ảnh xe trên cùng
  const dataImageCar = [
    {
      id: 1,
      img: car.imagePath,
    },
    {
      id: 2,
      img: car.image1,
    },
    {
      id: 3,
      img: car.image2,
    },
    {
      id: 4,
      img: car.image3,
    },
  ];
  // Hàm tính tổng số bình luận
  const getTotalComments = (reviews) => {
    return reviews.length;
  };

  // Hàm tính trung bình cộng số đánh giá
  const getTotalRatings = (reviews) => {
    if (reviews.length === 0) {
      return 0;
    }
    let totalRatings = 0;
    reviews.forEach((review) => {
      totalRatings += review.rating;
    });

    return (totalRatings / reviews.length).toFixed(2);
  };
  const totalComments = getTotalComments(reviews);
  const totalRatings = getTotalRatings(reviews);
  // Đánh giá sao
  const rate = (starNumber) => {
    setRating(starNumber);
  };
  //hàm hiển thị bình luận
  const toggleComment = (index) => {
    const newCommentStates = [...showFullComment];
    newCommentStates[index] = !newCommentStates[index];
    setShowFullComment(newCommentStates);
  };
  // hàm hiển thị xem thêm điều khoản
  const toggleContent = () => {
    setIsHidden(!isHidden);
  };

  const handleShareClick = () => {
    navigator.clipboard
      .writeText(window.location.href)
      .then(() => {
        setCopySuccess(true);
        setTimeout(() => {
          setCopySuccess(false);
        }, 2000);
      })
      .catch((error) => {
        console.error("Error copying:", error);
      });
  };
  // tính tổng giá tiền
  const tongTien = car.price + 125000 + 125000;
//  đổi màu tương thích với trạng thái nút
const buttonClass = `btn__large price-container-button ${
  !licenseStatus.hasDrivingLicense ? 'disabled' : ''
}`;
//đổi màu nền trong hình thức giấy phép lái xe
const requiredPapersClass = `required-papers ${
  licenseStatus.hasDrivingLicense ? 'has-license' : ''
}`;
  return (
    <div className="contentproduct">
      <Helmet>
        <title>{car.title}</title>
      </Helmet>
      <div className="contentproduct__img">
        <div className="contentproduct__img-main">
          <img src={car.imagePath} alt={car.title}></img>
        </div>
        <div className="contentproduct__img-list">
          <img
            src={car.image1}
            alt=""
            className="contentproduct__img-list-child"
          />
          <img
            src={car.image2}
            alt=""
            className="contentproduct__img-list-child"
          />
         
        </div>
      </div>
      <Slider
        {...contactproduct__tablet}
        className="contentproduct__img-tablet"
      >
        {dataImageCar.map((item) => (
          <img src={item.img} className="contentproduct-imgtablet-img"></img>
        ))}
      </Slider>
      <div className="contentproduct__detail">
        <div className="contentproduct__detail-container">
          <div className="contentproduct__detail-container-name">
            <div className="group-name">
              <h3>{car.title}</h3>
              <div className="group-icon">
                <i onClick={handleShareClick}>
                  <FaShareNodes></FaShareNodes>
                </i>
                <i onClick={handleFavoriteClick}>
                  <FaHeart color={isFavorite ? "red" : "black"} />
                </i>
              </div>
            </div>
            {showLoginPrompt && (
              <div className="login-prompt">
                <p>Bạn chưa đăng nhập để sử dụng chức năng.</p>
                <button>Đến trang đăng nhập</button>
                <button>Hủy</button>
              </div>
            )}
            {copySuccess && (
              <div className="coppy-modal">
                <div className="copy-success-message">
                  <p> Đã sao chép thành công! </p>
                </div>
              </div>
            )}

            <div className="group-total">
              <div className="group-total-trip">
                <i>
                  <FaFax></FaFax>
                </i>
                <span>{car.location}</span>
              </div>
            </div>
            <div className="group-tag">
              <span className="group-tag-transmission tag-item">
                {" "}
                Vui vẻ
              </span>
              <span className="group-tag-delivery tag-item">
                {" "}
                Hòa dồng
              </span>
              <span className="group-tag-instant tag-item">Thân thiện</span>
            </div>
          </div>
          <div className="line-page"></div>
          <div className="contentproduct__detail-container-content">
            <div className="contentproduct__detail-container-content-info-cardesc">
              <h6>Thông Tin Cá Nhân</h6>
              <div className="outstanding-features">
                <div className="outstanding-features-item">
                  <i>
                  <FaAddressCard />
                  </i>
                  <div className="title">
                    <p className="sub">Chức Vụ</p>
                    <p className="main2">{car.tax}</p>
                  </div>
                </div>
                <div className="outstanding-features-item">
                  <i>
                  <FaPhoneVolume />
                  </i>
                  <div className="title">
                    <p className="sub">Số Điện Thoại</p>
                    <p className="main2">{car.numberPhone}</p>
                  </div>
                </div>
                <div className="outstanding-features-item">
                  <i>
                  <FaSquareEnvelope />
                  </i>
                  <div className="title">
                    <p className="sub">Email</p>
                    <p className="main2">{car.email}</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="line-page"></div>
            <div className="contentproduct__detail-container-content-describe">
              <h6>Mô Tả</h6>
              <p>{car.description}</p>
            </div>
            <div className="line-page"></div>
            <div className="line-page"></div>
            
            <form className="contentproduct__evaluate" onSubmit={handleSubmit}>
              <h3>Đánh giá giáo viên</h3>
              <div className="comment">
                <input
                  type="text"
                  placeholder="Hãy nhập đánh giá"
                  className="comment__input"
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                />
              </div>
              <div className="clickstart" id="clickstart">
                {[1, 2, 3, 4, 5].map((starNumber) => (
                  <span
                    key={starNumber}
                    className={`clickstart__star ${
                      starNumber <= rating ? "active" : ""
                    }`}
                    onClick={() => rate(starNumber)}
                  >
                    &#9733;
                  </span>
                ))}
              </div>
              <button type="submit" className="contentproduct__evaluate-button">
                Gửi
              </button>
            </form>
            <div className="line-page"></div>
            <div className="contentproduct__detail-container-content-evaluate">
              <div className="review">
                <i>
                  <FaStar></FaStar>
                </i>{" "}
                {totalRatings} <span>{totalComments} đánh giá</span>
              </div>
              <div className="list-reviews">
                {reviews.map((review, index) => (
                  <div className="list-reviews-item" key={index}>
                    <div className="list-reviews-item-firt">
                      <div className="list-reviews-item-firt-avt">
                        <img
                          className="list-reviews-item-img"
                          src={review.avatar}
                          alt={review.fullName}
                        />
                        <div className="list-reviews-item-name" key={index}>
                          <h6>{review.fullName}</h6>
                          <div className="list-reviews-item-name-star">
                            {Array.from({ length: review.rating }, (_, i) => (
                              <i key={i}>
                                <FaStar />
                              </i>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="list-reviews-item-cmt" key={index}>
                        <div
                          className={`list-reviews-item-name-cmt ${
                            showFullComment[index] ? "full-comment" : ""
                          }`}
                        >
                          <h3>{review.reviewText}</h3>
                          {!showFullComment[index] &&
                            review.reviewText.length > 150 && (
                              <div
                                className="show-more"
                                onClick={() => toggleComment(index)}
                              >
                                hiển thị thêm
                              </div>
                            )}
                          {showFullComment[index] && (
                            <div
                              className="none-more"
                              onClick={() => toggleComment(index)}
                            >
                              Ẩn
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    <p className="list-reviews-item-time">{review.createdAt}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
        </div>
      </div>
      {modalOpen && (
        <div
          className="report__overlay"
          onClick={closeModal}
          style={{ opacity: overlayOpacity }}
        >
          <form className="report__form" onClick={(e) => e.stopPropagation()}>
            <span className="report__form-close" onClick={closeModal}>
              <FaX />
            </span>
            <h3 className="report__form-title">Báo Xấu</h3>
            <div className="report__form-email">
              <h3 className="report__form-email-text">Email</h3>
              <input
                className="report__form-email-input"
                type="email"
                placeholder="Vui lòng nhập địa chỉ email của bạn"
              />
            </div>
            <div className="report__form-content">
              <h3 className="report__form-content-text">
                Vui lòng nhập báo cáo
              </h3>
              <textarea
                className="report__form-content-input"
                type="text"
                placeholder="Vui lòng nhập lý do hoặc lời nhắn"
              />
            </div>
            <button className="report__form-button">
              <h3 className="report__form-button-text">Báo cáo</h3>
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

export default ContentProduct;
