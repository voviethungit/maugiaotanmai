import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Helmet } from "react-helmet";
import Header from "../Header";
import Footer from "../Footer";
import './css/blogdetail.css'
const Blogdetail = () => {
  const { blogId } = useParams();
  const [blog, setBlog] = useState(null);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const response = await fetch(`http://localhost:5000/get-blog/${blogId}`);
        const data = await response.json();
        setBlog(data.blog);
      } catch (error) {
        console.error("Lỗi khi lấy bài viết: ", error);
      }
    };

    fetchBlog();
  }, [blogId]);

  if (!blog) {
    return <div>Loading...</div>;
  }

  const renderContent = () => {
    return blog.content.blocks.map((block, index) => {
      const key = `block-${index}`;

      // Xử lý phần tử atomic
      if (block.type === "atomic") {
        // Kiểm tra xem entityRanges có dữ liệu không
        if (block.entityRanges.length > 0) {
          // Lặp qua mảng entityRanges để tìm entity có type là IMAGE
          const imageEntity = block.entityRanges.find(
            (range) => blog.content.entityMap[range.key].type === "IMAGE"
          );
          // Nếu tìm thấy entity IMAGE, trả về phần tử img
          if (imageEntity) {
            const imageSrc = blog.content.entityMap[imageEntity.key].data.src;
            const imageAlt = blog.content.entityMap[imageEntity.key].data.alt;
            return <img key={key} src={imageSrc} alt={imageAlt} />;
          }
        }
        return null;
      }

      // Xử lý các khối văn bản khác
      let style = {};
      if (block.inlineStyleRanges && block.inlineStyleRanges.length > 0) {
        block.inlineStyleRanges.forEach((range) => {
          switch (range.style) {
            case "BOLD":
              style.fontWeight = "bold";
              break;
            case "ITALIC":
              style.fontStyle = "italic";
              break;
            case "fontsize-16":
              style.fontSize = "16px";
              break;
            // Add other font sizes as needed
            default:
              break;
          }
        });
      }

      return <div key={key} style={style}>{block.text}</div>;
    });
  };

  return (
    <div className="blog-detail">
      <Helmet>
        <title>{blog.title}</title>
      </Helmet>
      <Header />
      
      <div className="blog-content">
        <div className="abc">
        <h1>{blog.title}</h1>
        <hr className="hrblog"/>
        <div className="content">
        <img src={blog.imageBlog} alt="" />
        <hr className="hrblog"/>
         <br/>
         <br/>
        {renderContent()}
        </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Blogdetail;