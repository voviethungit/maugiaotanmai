// Course.js
import React, { useState, useEffect } from 'react';
import Header from './Header';
import Footer from './Footer';
import { Helmet } from 'react-helmet';
import { pdfjs } from "react-pdf";
import axios from "axios";
import BeatLoader from "react-spinners/BeatLoader";
import { useParams } from "react-router-dom";
import './css/course.css';

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.js",
  import.meta.url
).toString();

function Course() {
    const [allFiles, setAllFiles] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const { cateId, cateTitle } = useParams(); 

    useEffect(() => {
        getFiles();
    }, [cateId]);

    const getFiles = async () => {
        try {
            setIsLoading(true); 
            const result = await axios.get(`http://localhost:5000/get-courses-by-cate/${cateId}`);
            console.log(result.data.data);
            setAllFiles(result.data.data);
        } catch (error) {
            console.error("Error fetching files:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const downloadFile = (fileUrl) => {
        const downloadLink = document.createElement("a");
        downloadLink.href = fileUrl;
        downloadLink.download = fileUrl.substring(fileUrl.lastIndexOf('/') + 1);
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
    };

    const getFileIcon = (fileName) => {
        const fileExtension = fileName.split('.').pop();
        switch (fileExtension) {
            case 'doc':
            case 'docx':
                return 'https://upload.wikimedia.org/wikipedia/commons/8/8d/Microsoft_Word_2013-2019_logo.svg'; 
            case 'xls':
            case 'xlsx':
                return 'https://upload.wikimedia.org/wikipedia/commons/7/73/Microsoft_Excel_2013-2019_logo.svg'; 
            case 'rar':
                return 'https://upload.wikimedia.org/wikipedia/fr/a/aa/WinRAR_logo_big.png'; 
            default:
                return 'default-icon.png'; 
        }
    };

    return (
        <div className='course-container'>
            <Helmet>
                <title>{cateTitle}</title>
            </Helmet>
            <Header />
            <br/>
            <br/>
            <br/>
            <br/>
            {isLoading ? (
                <div className="spinner-container">
                    <BeatLoader color="#36d7b7" size={40} />
                </div>
            ) : (
                <div className="uploaded">
                    <h4 className='titleCourse'>{cateTitle}</h4>
                    <div className="output-div">
                        {allFiles == null
                            ? ""
                            : allFiles.map((data, index) => (
                                <div className="inner-div" key={index}>
                                    <img src={getFileIcon(data.document)} alt="" className='file-icon'/>
                                    <h6>{data.title}</h6>
                                    <button
                                        className="btn btn-primary"
                                        onClick={() => downloadFile(`http://localhost:5000/files/${data.document}`)}
                                    >
                                        Download
                                    </button>
                                </div>
                            ))}
                    </div>
                </div>
            )}
            <Footer />
        </div>
    )
}

export default Course;
