import React, { useState, useEffect } from 'react';
import axios from 'axios';
import BeatLoader from 'react-spinners/BeatLoader';
import { FaLocationDot, FaAngleDown } from 'react-icons/fa6';

function Content() {
  const [categories, setCategories] = useState([]);
  const [cars, setCars] = useState([]);
  const [search, setSearch] = useState('');
  const [filteredCars, setFilteredCars] = useState([]);
  const [isOpenCategory, setIsOpenCategory] = useState(false);
  const [currentItem, setCurrentItem] = useState('Toàn Bộ');
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [carsPerPage, setCarsPerPage] = useState(9);
  const [hasProducts, setHasProducts] = useState(true);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    axios
      .get('http://localhost:5000/all-category')
      .then((response) => {
        setCategories(response.data.categories);
      })
      .catch((error) => {
        console.error('Lỗi:', error);
      });
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`http://localhost:5000/get-car-by-category/${selectedCategoryId}`);
        setCars(response.data.cars);
        setLoading(false);
        console.log(selectedCategoryId);
      } catch (error) {
        console.error('Lỗi:', error);
        setLoading(false);
      }
    };

    if (selectedCategoryId !== null) {
      fetchData();
    }
  }, [selectedCategoryId]);
  console.log(selectedCategoryId);
  const handleWindowSizeChange = () => {
    const width = window.innerWidth;
    if (width >= 990) {
      setCarsPerPage(9);
    } else if (width >= 550 && width < 990) {
      setCarsPerPage(4);
    } else {
      setCarsPerPage(2);
    }
  };

  useEffect(() => {
    handleWindowSizeChange();
    window.addEventListener('resize', handleWindowSizeChange);
    return () => {
      window.removeEventListener('resize', handleWindowSizeChange);
    };
  }, []);

  const toggleDropdown = () => {
    setIsOpenCategory(!isOpenCategory);
  };

  const handleItemClick = (categoryID) => {
    setCurrentItem(categoryID);
    setIsOpenCategory(false);
    setSelectedCategoryId(categoryID);
  };
  console.log(handleItemClick);
  useEffect(() => {
    const nameFilter =
      search !== '' ? cars.filter((car) => car.title.toLowerCase().includes(search.toLowerCase())) : cars;

    setFilteredCars(nameFilter);
    setHasProducts(nameFilter.length > 0);
  }, [search, cars]);

  const indexOfLastCar = currentPage * carsPerPage;
  const indexOfFirstCar = indexOfLastCar - carsPerPage;
  const currentCars = filteredCars.slice(indexOfFirstCar, indexOfLastCar);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setCurrentPage(1);
  };

  if (loading) {
    return (
      <div className="spinner-container">
        <BeatLoader color="#36d7b7" size={40} />
      </div>
    );
  }

  return (
    <div className="content" id="content">
      <h1 className="content__text">Đội Ngũ Giáo Viên</h1>
      <div className="content__search">
        <div className="content__search-form">
          <input
            type="text"
            className="content__search-form-input"
            placeholder="Tìm  Kiếm  Giáo  Viên"
            value={search}
            onChange={handleSearchChange}
          />
        </div>
        <div className="search-menu">
          {/* menu get car by category */}
        </div>
      </div>
      <div className="content__list">
        {!hasProducts && (
          <div className="not__product">
            <img
              src="https://etecvn.com/default/template/img/cart-empty.png"
              alt="hình ảnh không có sản phẩm"
              className="not__product-img"
            />
            <h3 className="not__product-text">Hiện tại không có giáo viên nào</h3>
          </div>
        )}
        {currentCars.map((car, index) => (
          <div className="content__list-child" key={index}>
            <nav>
              <img src={car.imagePath} className="content__list-child-img" alt={`Car ${index}`} />
              <div className="content__list-child-img-flash btn__electronic">
                <p className="content__list-child-img-flash-text">{car.tax}</p>
              </div>
            </nav>
            <div className="content__list-child-auto">
              <div className="content__list-child-auto-location"></div>
            </div>
            <div className="content__list-child-name">
              <h1 className="content__list-child-name-main">{car.title}</h1>
            </div>
            <div className="content__list-child-location">
              <i>
                <FaLocationDot />
              </i>
              <p className="content__list-child-location-text">{car.location}</p>
            </div>
            <div className="content__list-child-underlined"> </div>
            <div className="content__list-child-detail">
              <div className="content__list-child-detail-evaluate">
                <div className="content__list-child-detail-evaluate-usage">
                  <p className="content__list-child-detail-evaluate-usage-text">Slogan : {car.usage}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      {filteredCars.length > carsPerPage && (
        <div className="pagination">
          {Array.from({ length: Math.ceil(filteredCars.length / carsPerPage) }).map((_, index) => (
            <button
              key={index}
              onClick={() => paginate(index + 1)}
              className={`pagination-button ${index + 1 === currentPage ? 'active' : ''}`}
            >
              {index + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default Content;
