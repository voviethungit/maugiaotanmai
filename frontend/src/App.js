import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import './App.css';
import Main from './views/Home/Main';
import MainUser from './views/User/MainUser';
import MainAbout from './views/About/MainAbout';
import ListBlog from './views/Home/ListBlog/ListBlog';
import MainProduct from './views/Home/Product/MainProduct';
import MainLogin from './views/Home/Login_Register/MainLogin';
import MainRegister from './views/Home/Login_Register/MainRegister';
import Forgotpasword from './views/Home/Login_Register/Forgotpasword';
import Myfavs from './views/User/Myfavs';
import UserInfor from './views/User/UserInfor';
import Mycars from './views/User/Mycars';
import Myreward from './views/User/Myreward';
import Mytrips from './views/User/Mytrips';
import Resetpw from './views/User/Resetpw';
import Navbarmobile from './views/User/Navbarmobile';
import Myaddress from './views/User/Myaddress'
import Maintrip from './views/Home/Trip/Maintrip';
import ScrollToTop from './views/Home/Scroptotop';
import Policy from './views/Home/Policy/Policy';
import Terms from './views/Home/Policy/Terms';
import Personalinfo from './views/Home/Policy/Personalinfo';
import Resolveconflic from './views/Home/Policy/Resolveconflic';
import Mainhowto from './views/Home/howtowork/Mainhowto';
import Booking from './views/Home/howtowork/Booking';
import Paymenthowto from './views/Home/howtowork/Paymenthowto';
import Regu from './views/Home/howtowork/Regu';
import Mainlocation from './views/Home/Location/Mainlocation';
import PayLive from './views/Pay/PayLive';
import NotFound from './views/Home/NotFound';
import SuccessPassword from './views/Home/Login_Register/SuccessPassword';
import Pay from './views/Pay/Pay';
import SuccessPage from './views/Pay/SuccessPage'
import Deleteaccount from './views/User/Deleteaccount';
import Team from './views/Home/Team';
import Support from './views/Home/Support';
import Course from './views/Home/Course';
import Uploadblog from './views/Home/Uploadblog';
import Blogdetail from './views/Home/ListBlog/Blockdetail';
import UploadPDF from './views/Home/uploadpdf';
import AddCourseCate from './views/Home/AddCourseCate';
import CourseCate from './views/Home/CourseCate';
import Dashboard from './admin/dashboard';
import UserPage from './admin/user';
import ProductsPage from './admin/teacher';
import BlogsPage from './admin/blog';
import CategorysPage from './admin/category';
import CousesPage from './admin/course';
import CourseCatePage from './admin/coursecate';
import EventsPage from './admin/event';
function App() {
  return (
    <>
      <HelmetProvider>
      <Router>
        <ScrollToTop />
        <Routes>
          <Route path='/' element={<Main />} />
          <Route path="*" element={<NotFound />} />
         
          <Route path='/nguoi-dung' element={<MainUser />} />
          <Route path='/lien-he' element={<Support />} />
          <Route path='/tai-lieu/:cateId/:cateTitle' element={<Course />} />
          <Route path='/yeu-cau-xoa-nguoi-dung' element={<Deleteaccount />} />
          <Route path='/ve-xe-tot' element={<MainAbout />} />
          <Route path='/tin-tuc' element={<ListBlog />} />
          <Route path='/tin-tuc/:blogId' element={<Blogdetail />} />
          <Route path='/san-pham/:id' element={<MainProduct />} />
          <Route path='/dang-nhap' element={<MainLogin />} />
          <Route path='/dang-ky' element={<MainRegister />} />
          <Route path='/dang-nhap/quen-mat-khau' element={<Forgotpasword />} />
          <Route path='/UserInfor' element={<UserInfor />} />
          <Route path='/xe-yeu-thich' element={<Myfavs />} />
          <Route path='/chuyen-di-cua-toi' element={<Mytrips />} />
          <Route path='/vi-cua-toi' element={<Mycars />} />
          <Route path='/qua-tang-cua-toi' element={<Myreward />} />
          <Route path='/dia-chi-cua-toi' element={<Myaddress />} />
          <Route path='/doi-mat-khau' element={<Resetpw />} />
          <Route path='/Navbarmobile' element={<Navbarmobile />} />
          <Route path='/bao-hiem' element={<Maintrip />} />
          <Route path='/policy' element={<Policy />} />
          <Route path='/terms' element={<Terms />} />
          <Route path='/perso' element={<Personalinfo />} />
          <Route path='/resolve' element={<Resolveconflic />} />
          <Route path='/mainhow' element={<Mainhowto />} />
          <Route path='/book' element={<Booking />} />
          <Route path='/paymen' element={<Paymenthowto />} />
          <Route path='/regu' element={<Regu />} />
          <Route path='/dia-diem/:id' element={<Mainlocation />} />
          <Route path='/nap-tien' element={<PayLive />} />
          <Route path='/thanh-toan/:id' element={<Pay />} />
          <Route path='/success' element={<SuccessPage />} />
          <Route path='/doi-ngu' element={<Team />} />
          <Route path='/reset-password/:token' element={<SuccessPassword />} />
          <Route path='/uploadcourse' element={<UploadPDF />} />
          <Route path='/testallcourse' element={<AddCourseCate />} />
          <Route path='/toan-bo-tai-lieu' element={<CourseCate />} />

          {/* Admin */}
          <Route path='/admin/dashboard' element={<Dashboard />} />
          <Route path='/admin/tai-khoan' element={<UserPage />} />
          <Route path='/admin/giang-vien' element={<ProductsPage />} />
          <Route path='/admin/tin-tuc' element={<BlogsPage />} />
          <Route path='/admin/bo-phan' element={<CategorysPage />} />
          <Route path='/admin/tai-lieu' element={<CousesPage />} />
          <Route path='/admin/danh-muc-tai-lieu' element={<CourseCatePage />} />
          <Route path='/admin/hoat-dong-dien-ra' element={<EventsPage />} />  
          <Route path="/admin/dang-tai-tin-tuc" element={<Uploadblog />} />
       </Routes>
      </Router>
      </HelmetProvider>
    </>
  );
}

export default App;

