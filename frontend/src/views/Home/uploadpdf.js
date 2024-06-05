import React, { useState, useEffect } from "react";
import axios from "axios";

function UploadPDF() {
  const [title, setTitle] = useState("");
  const [file, setFile] = useState(null);
  const [image, setImage] = useState(null); // Thêm state cho ảnh
  const [courseCateId, setCourseCateId] = useState("");
  const [allCourses, setAllCourses] = useState([]);
  const [pdfFile, setPdfFile] = useState(null);

  useEffect(() => {
    getPdf();
  }, []);

  const getPdf = async () => {
    try {
      const result = await axios.get("http://localhost:5000/get-all-course");
      setAllCourses(result.data.data);
    } catch (error) {
      console.error("Error fetching courses:", error);
    }
  };

  const submitImage = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("title", title);
    formData.append("courseCateId", courseCateId);
    formData.append("file", file);
    formData.append("image", image);
    try {
      const result = await axios.post("http://localhost:5000/upload-course", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (result.data.status === "ok") {
        alert("Uploaded Successfully!!!");
        getPdf();
      }
    } catch (error) {
      console.error("Error uploading course:", error);
    }
  };

  const showFile = (file) => {
    setPdfFile(`http://localhost:5000/files/${file}`);
  };

  return (
    <div>
      <form className="formStyle" onSubmit={submitImage}>
        <h4>Upload Pdf in React</h4>
        <br />
        <input
          type="text"
          className="form-control"
          placeholder="Title"
          required
          onChange={(e) => setTitle(e.target.value)}
        />
        <br />
        <input
          type="text"
          className="form-control"
          placeholder="Category Id"
          required
          onChange={(e) => setCourseCateId(e.target.value)}
        />
        <br />
        <input
          type="file"
          className="form-control"
          accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx"
          required
          onChange={(e) => setFile(e.target.files[0])}
        />
        <br />
        {/* <input
          type="file"
          className="form-control"
          accept="image/*" // Chỉ chấp nhận các loại ảnh
          required
          onChange={(e) => setImage(e.target.files[0])}
        />
        <br /> */}
        <button className="btn btn-primary" type="submit">
          Submit
        </button>
      </form>
      <div className="uploaded">
        <h4>Uploaded PDF:</h4>
        <div className="output-div">
          {allCourses == null
            ? ""
            : allCourses.map((data, index) => (
                <div className="inner-div" key={index}>
                  <h6>Title: {data.title}</h6>
                  <button className="btn btn-primary" onClick={() => showFile(data.document)}>
                    Show File
                  </button>
                </div>
              ))}
        </div>
      </div>
    </div>
  );
}

export default UploadPDF;
