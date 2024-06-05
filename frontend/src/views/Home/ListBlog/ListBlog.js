import React, { useState, useEffect } from "react";
import "./css/listblog.css";
import Header from "../Header";
import Footer from "../Footer";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet";
import BeatLoader from "react-spinners/BeatLoader";

const ListBlog = () => {
  const [blogs, setBlogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true); 

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await fetch("http://localhost:5000/get-blog");
        const data = await response.json();
        setBlogs(data.blogs);
        setIsLoading(false);
      } catch (error) {
        console.error("Lỗi khi lấy danh sách blog: ", error);
        setIsLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  return (
    <div className="main__listblog">
      <Helmet>
        <title>TIN TỨC</title>
      </Helmet>
      <Header />
      <h4 className="titleTintuc">Toàn Bộ Tin Tức</h4>
      {isLoading ? (
        <div className="spinner-container">
          <BeatLoader color="#36d7b7" size={40} />
        </div>
      ) : (
        <div className="blog-container">
          {blogs.map((blog) => (
            <div key={blog._id} className="blog-card">
              <Link to={`/tin-tuc/${blog._id}`}>
                <img src={blog.imageBlog} alt={blog.title} />
              </Link>
              <div className="blog-info">
                <h3>{blog.title}</h3>
                {typeof blog.content === "object" ? (
                  <p>{blog.content.blocks[0].text.substring(0, 100)}...</p>
                ) : (
                  <p>Định dạng nội dung không hợp lệ.</p>
                )}
                <button  className="btn viewblog">
                <Link to={`/tin-tuc/${blog._id}`} className="readmore" > Đọc tiếp </Link>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Footer />
    </div>
  );
};

export default ListBlog;
