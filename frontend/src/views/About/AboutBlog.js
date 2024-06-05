import React from "react";
// import Nav from "./Nav";
import './css/aboutblog.css';
import './css/base.css'



import {
  FaSuitcaseRolling,
  FaUserGroup,
  FaHatCowboy,
  FaCar,
  FaMapLocationDot,
  FaRegStar,
} from "react-icons/fa6";

const AboutBlog = () => {
  return (
    <div>
    

      <div className="container_about">

        <div className="aboutus-desc">
          <h1>Trường mẫu giáo Tân Mai</h1>
          <p>
          Thành lập năm 2016 được tách ra từ trường mẫu giáo tân thanh,
          năm 2019 được công nhận trường đạt chuẩn Quốc Gia mức độ 1.
            <br />
           Phương châm : Quản lý Hạnh phúc giáo viên sẽ hạnh phúc trẻ hạnh phúc hướng tới ngôi trường mầm non hạnh phúc
          </p>
        </div>
        <div className="aboutus-img">
          <img className="imgabout"
            src="https://firebasestorage.googleapis.com/v0/b/xetotdanang.appspot.com/o/MAUGIAO%2F7815c03b-1bee-4ff9-bd43-e1a544fce5fd.jfif?alt=media&token=58b8df1e-2074-4bb4-ba8d-35c10e42a2f9"
            alt=""
          />
        </div>

        <div className="intro-container">
          <div className="intro-container__info">
            <h2>Vui vẻ - Hạnh Phúc</h2>
            <p>
              <strong>Cầm lái</strong> và <strong>Khám phá</strong> thế giới đầy{" "}
              <strong> Cảm hứng </strong>
            </p>
            <p>
            Thành lập năm 2016 được tách ra từ trường mẫu giáo tân thanh,
          năm 2019 được công nhận trường đạt chuẩn Quốc Gia mức độ 1.
              <br />
              Phương châm : Quản lý Hạnh phúc giáo viên sẽ hạnh phúc trẻ hạnh phúc hướng tới ngôi trường mầm non hạnh phúc
            </p>
          </div>
          <div className="intro-container__img">
            <img className="imgabout"
              src="https://i.ibb.co/ysJ78mh/e0935782-00cc-4eff-b188-ab8aba73023f.jpg"
              alt=""
            />{" "}
          </div>
        </div>
      </div>
   
      <div className="aboutus-icon">
        <h1>Tân Mai và những con số </h1>
        <div className="list-icon">
          <div className="list-icon__item">
            <span className="icon-item__content">
              {" "}
              <FaSuitcaseRolling />
            </span>
            <h5>100+</h5>
            <p>
              Chuyến đi ngoại khóa
              <br />
             Tân Mai đã đồng hành
            </p>
          </div>
          <div className="list-icon__item">
            <span className="icon-item__content">
              {" "}
              <FaUserGroup />
            </span>
            <h5>1,000+</h5>
            <p>
              Học Sinh
              <br />
             Đã học tập tại trường
            </p>
          </div>
          <div className="list-icon__item">
            <span className="icon-item__content">
              {" "}
              <FaHatCowboy />
            </span>
            <h5>50+</h5>
            <p>
              Giáo Viên
              <br />
             trong trường học
            </p>
          </div>
          <div className="list-icon__item">
            <span className="icon-item__content">
              {" "}
              <FaRegStar />
            </span>
            <h5>4.95/5*</h5>
            <p>
              Là số điểm nhận được từ trên 1,000+ bậc phụ huynh
              <br />
              đánh giá về trường học
            </p>
          </div>
        </div>
      </div>
    
       </div>
       
      
  
  );
};

export default AboutBlog;
