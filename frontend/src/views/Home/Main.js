import React from 'react'
import Header from './Header';
import Banner from './Banner';
import Sale from './Sale';
import Content from './Content';
import Location from './Location';
import Post from './Post';
import Blog from './Blog';
import Footer from './Footer';
import { Helmet } from 'react-helmet';
import './css/Main.css';
const Main = () => {
  return (
    <div className='main'>
       <Helmet>
        <title>Trang chủ</title>
      </Helmet>
      <Header/>
      <Banner/>
      <Sale/>
      <Location/>
      <Post/>
      <Blog />
      <Footer />
    </div>
  )
}

export default Main;