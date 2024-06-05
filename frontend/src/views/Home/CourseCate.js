import React, { useEffect, useState } from 'react';
import './css/coursecate.css'
import './css/base.css'
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import Header from './Header';
import Footer from './Footer';
import { Link } from 'react-router-dom';
import { BeatLoader } from 'react-spinners'; 

function CourseCate() {
    const [coursecates, setCoursecates] = useState([]);
    const [loading, setLoading] = useState(true); 

    useEffect(() => {
        fetchAllCategories();
    }, []);

    const fetchAllCategories = async () => {
        try {
            const response = await fetch('http://localhost:5000/all-coursecate');
            const data = await response.json();
            if (data.success) {
                setCoursecates(data.categories);
            } else {
                console.log("Lỗi khi lấy danh sách khoá học");
            }
        } catch (error) {
            console.error("Lỗi kết nối: ", error);
        } finally {
            setLoading(false);
        }
    };

    const location2 = {
        dots: true,
        infinite: false,
        speed: 400,
        slidesToShow: 4,
        slidesToScroll: 1,
        initialSlide: 0,
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 4,
                    slidesToScroll: 1,
                    initialSlide: 0,
                    dots: true,
                },
            },
            {
                breakpoint: 940,
                settings: {
                    slidesToShow: 3,
                    slidesToScroll: 1,
                    infinite: true,
                    dots: true,
                },
            },
            {
                breakpoint: 750,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 1,
                    initialSlide: 2,
                },
            },
            {
                breakpoint: 500,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                },
            },
        ],
    };

    return (
        <div>
            <Header/>
            <div className='location2'>
                <br/>
                <br/>
                <br/>
                <br/>
                <h2>Toàn Bộ Tài Liệu</h2>
                <div className='location2__slider'>
                    {loading ? (
                        <div className="spinner-container">
                            <BeatLoader color="#36d7b7" size={22} />
                        </div>
                    ) : (
                        <Slider {...location2}>
                            {coursecates && coursecates.map((item, index) => (
                               <Link 
                               to={`/tai-lieu/${item._id}/${encodeURIComponent(item.title)}`}
                               className="location2__slider-container" 
                               key={index}
                           >
                                    <div className="location2__slider-container-top">
                                        <img
                                            src={item.imageCategory}
                                            alt={item.title}
                                        />
                                    </div>
                                    <div className='location2__slider-overwhite'>
                                    </div>
                                    <div className='location2__slider-container-bottom'>
                                        <h3 className='location2__slider-container-bottom-name'>
                                            {item.title}
                                        </h3>
                                    </div>
                                </Link>
                            ))}
                        </Slider>
                    )}
                </div>
            </div>
            <Footer/>
        </div>
    )
}

export default CourseCate;
