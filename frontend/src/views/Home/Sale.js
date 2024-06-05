import "./css/base.css";
import "./css/sale.css";
import React, { useState, useEffect } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { FaX } from "react-icons/fa6";

function Sale() {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedTitle, setSelectedTitle] = useState(null);
  const [selectedContent, setSelectedContent] = useState(null);
  const [overlayOpacity, setOverlayOpacity] = useState(0);
  const [events, setEvents] = useState([]);

  useEffect(() => {
    if (modalOpen) {
      document.body.classList.add("modal-open");
    } else {
      document.body.classList.remove("modal-open");
    }
  }, [modalOpen]);

  useEffect(() => {
    // Fetch events data from the API
    fetch('http://localhost:5000/getallEvent')
      .then((response) => response.json())
      .then((data) => setEvents(data))
      .catch((error) => console.error('Error fetching events:', error));
  }, []);

  const openModal = (image, title, content) => {
    setSelectedImage(image);
    setSelectedTitle(title);
    setSelectedContent(content);

    setModalOpen(true);
    setOverlayOpacity(1);
  };

  const closeModal = () => {
    setModalOpen(false);
    setOverlayOpacity(0);
  };

  const settings = {
    dots: true,
    infinite: false,
    speed: 400,
    slidesToShow: 3,
    slidesToScroll: 1,
    initialSlide: 0,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          initialSlide: 0,
          dots: true,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          initialSlide: 2,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  return (
    <div className="sale">
      <div className="sale__text">
        <h3>Hoạt Động Diễn Ra</h3>
        <p>2023-2024</p>
      </div>
      <div className="sale__slider">
        <Slider {...settings}>
          {events.map((item) => (
            <div
              className="sale__slider-container"
              onClick={() =>
                openModal(item.image, item.title, item.content)
              }
              key={item._id}
            >
              <div className="sale__slider-container-top">
                <img src={item.image} alt={item.title} />
              </div>
              <div className="sale__slider-title">
                <h4>{item.title}</h4>
              </div>
            </div>
          ))}
        </Slider>
      </div>
      {modalOpen && (
        <div
          className="modal-overlay"
          onClick={closeModal}
          style={{ opacity: overlayOpacity }}
        >
          <div className="modall" onClick={(e) => e.stopPropagation()}>
            <span className="modal-close" onClick={closeModal}>
              <FaX />
            </span>
            <img src={selectedImage} alt="Selected" />
            <div className="modall-content1">
              <h1>{selectedTitle}</h1>
              <p>{selectedContent}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Sale;
