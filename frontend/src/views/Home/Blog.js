import React, { useState, useEffect } from 'react';
import Slider from 'react-slick';
import './css/base.css';
import './css/blog.css';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import imgGirl from './img/banner1.jpg';
import { Link } from 'react-router-dom';
import axios from 'axios';
function Blog() {
  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await fetch("http://localhost:5000/get-blog");
        const data = await response.json();
        setBlogs(data.blogs);
      } catch (error) {
        console.error("Lỗi khi lấy danh sách blog: ", error);
      }
    };

    fetchBlogs();
  }, []);
    const [defaultImage, setDefaultImage] = useState({});
    const blogSlider = {
      dots: true,
      infinite: false,
      speed: 400,
      slidesToShow: 3,
      slidesToScroll: 1,
      initialSlide: 0,
      responsive: [
        {
          breakpoint: 990,
          settings: {
            slidesToShow: 3,
            slidesToScroll: 1,
            initialSlide: 0,
            infinite: true,
            dots: true,
          },
        },
        {
            breakpoint: 850,
            settings: {
              slidesToShow: 2,
              slidesToScroll: 1,
              initialSlide: 0,
              infinite: true,
              dots: true,
            },
          },
        {
          breakpoint: 600,
          settings: {
            slidesToShow: 1,
            slidesToScroll: 1,
            initialSlide: 0,
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
    const handleErrorImage = (data) => {
      setDefaultImage((prev) => ({
        ...prev,
        [data.target.alt]: data.target.alt,
        linkDefault: imgGirl,
      }));
    };
    const dataBlogSlider = [
      {
        id: 1,
        time: '12-8-2023',
        title: 'Khám phá ĐÀ NẴNG vào lễ QUỐC KHÁNH 2/9 bằng việc thuê xe',
        linkImg1: "https://yt.cdnxbvn.com/medias/uploads/132/132126-cho-den-mau-giao-thi-da-muon.jpg",
        linkTo: '/listblog'
      },
      {
        id: 2,
        time: '12-8-2023',
        title: 'Khám phá ĐÀ NẴNG vào lễ QUỐC KHÁNH 2/9 bằng việc thuê xe',
        linkImg2: "https://yt.cdnxbvn.com/medias/uploads/132/132126-cho-den-mau-giao-thi-da-muon.jpg",
        linkTo: '/listblog1'
      },
      {
        id: 3,
        time: '12-8-2023',
        title: 'Khám phá ĐÀ NẴNG vào lễ QUỐC KHÁNH 2/9 bằng việc thuê xe',
        linkImg3: "https://yt.cdnxbvn.com/medias/uploads/132/132126-cho-den-mau-giao-thi-da-muon.jp",
        linkTo: '/listblog2'
      },
      {
        id: 4,
        time: '12-8-2023',
        title: 'Khám phá ĐÀ NẴNG vào lễ QUỐC KHÁNH 2/9 bằng việc thuê xe',
        linkImg4: "https://yt.cdnxbvn.com/medias/uploads/132/132126-cho-den-mau-giao-thi-da-muon.jpg",
        linkTo: '/listblog3'
      },
    ];
    const handleImageClick = (linkTo) => {
      if (linkTo) {
        window.location.href = linkTo;
      }
    };

    const [currentSlide, setCurrentSlide] = useState(0);
  const blogsPerPage = 3;

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prevSlide) => (prevSlide + blogsPerPage) % blogs.length);
    }, 8000);
    return () => clearInterval(interval);
  }, [blogs.length]);

  const showSlide = (slideIndex) => {
    return (
      <div className='blog__slider'>
        {blogs.slice(slideIndex, slideIndex + blogsPerPage).map((blog, index) => (
          <div key={blog.id} className={`blog__slide ${index === 0 ? '' : ''}`}>
            <img  className='blog__slide-img' src={blog.imageBlog} alt={blog.title} onError={handleErrorImage} />
            <br/>
            <div className='blog__slide-text'>
              <p>{blog.time}</p>
              <br/> <hr className='hrtachanh'/>
              <h3 className='titleblog'>{blog.title}</h3>
              <br/>
              {typeof blog.content === "object" ? (
                  <p className='contentblog'>{blog.content.blocks[0].text.substring(0, 100)}...</p>
                ) : (
                  <p>Định dạng nội dung không hợp lệ.</p>
                )}
              <button to={`/tin-tuc/${blog._id}`} className='btn viewblog' >Đọc tiếp</button>
              <br/>
            </div>
          </div>
        ))}
      </div>
    );
  };
  

  return (
    <div className='blog' id='blog'>
       <div className='blog__name'>
        <h1 className='blog__name-main'>Tin Tức</h1>
       </div>
       <div className='blog__content'>
        
       <div className='blog__slider'>
       {showSlide(currentSlide)}
        </div>
       </div>   
       <div className="blog__mobile">
        <Slider {...blogSlider}>
          {dataBlogSlider.map((item) => (
            <div key={item.id} className="blog__mobile-slider">
              {item.linkTo ? (
                <Link to={item.linkTo}>
                  <img className='blog__mobile-slider-img' src={item.linkImg} alt={item.title} onError={handleErrorImage} />
                </Link>
              ) : (
                <img
                  key={item.id}
                  className='protect__mobile-slider-img'
                  src={item.linkImg || defaultImage}
                  alt={item.title}
                  onClick={() => handleImageClick(item.linkTo)}
                />
              )}
              <div className='blog__mobile-slider-text'>
                <p>{item.time}</p>
                <h3>{item.title}</h3>
              </div>
            </div>
          ))}
        </Slider>
      </div>
    </div>
  )
}

export default Blog
