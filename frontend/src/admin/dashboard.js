import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './css/dashboard.css';
import HeaderAdmin from './header';
import Footer from './footer';
import Menu from './menu';
import { Helmet } from 'react-helmet';
import { Stack } from 'react-bootstrap';
import { Typography } from 'antd';
const Dashboard = () => {
  const [dashboardInfo, setDashboardInfo] = useState({
    totalUsers: 0,
    totalCars: 0,
    totalCategories: 0,
    totalPrices: 0,
    totalCourse: 0,
    countAvailableCars: 0,
    countUnavailableCars: 0
  });

  useEffect(() => {
    const fetchDashboardInfo = async () => {
      try {
        const accessToken = localStorage.getItem('accessToken');
        if (!accessToken) {
          console.error('Access token not found');
          return;
        }

        const headers = {
          Authorization: `Bearer ${accessToken}`
        };

        const response = await axios.get('http://localhost:5000/countAll', { headers });
        const availableCarsResponse = await axios.get('http://localhost:5000/countAvailableCars', { headers });
        const unavailableCarsResponse = await axios.get('http://localhost:5000/countUnavailableCars', { headers });

        setDashboardInfo({
          totalUsers: response.data.totalUsers,
          totalCars: response.data.totalCars,
          totalCategories: response.data.totalCategories,
          totalPrices: response.data.totalPrices,
          totalCourse: response.data.totalCourse,
          countAvailableCars: availableCarsResponse.data.countAvailableCars,
          countUnavailableCars: unavailableCarsResponse.data.countUnavailableCars
        });
        console.log(response);
      } catch (error) {
        console.error('Error fetching dashboard info:', error);
      }
    };

    fetchDashboardInfo();
  }, []);

  return (
    <>
    <Helmet>
        <title> Bảng Điều Khiển </title>
      </Helmet>
    <HeaderAdmin />
    <br/>
    <br/>
    <br/>
    <br/>
    <Menu/>
    <div className="dashboard">

      <div className="total-box">
        <i className="fas fa-users"></i>
        <div className="total-value">{dashboardInfo.totalUsers}</div>
        <div className="total-label">Tổng Tài Khoản</div>
      </div>
      <div className="total-box">
        <i className="fas fa-car"></i>
        <div className="total-value">{dashboardInfo.totalCars}</div>
        <div className="total-label">Tổng Giáo Viên</div>
      </div>
      <div className="total-box">
        <i className="fas fa-list-alt"></i>
        <div className="total-value">{dashboardInfo.totalCategories}</div>
        <div className="total-label">Tổng Bộ Phận</div>
      </div>
      <div className="total-box">
        <i className="fas fa-money-bill-wave"></i>
        <div className="total-value">{dashboardInfo.totalCourse}</div>
        <div className="total-label">Tổng Tài Liệu</div>
      </div>
    </div>
    <br/>
    <br/>
    </>
  );
};

export default Dashboard;
