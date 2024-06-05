// components/UploadBlog.js

import React, { useState } from 'react';
import { EditorState, convertToRaw } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import './css/testup.css';
import { TextField } from '@mui/material';

const UploadBlog = () => {
  const [title, setTitle] = useState('');
  const [editorState, setEditorState] = useState(() => EditorState.createEmpty());
  const [image, setImage] = useState(null);
  const [uploading, setUploading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      setUploading(true);
      const formData = new FormData();
      formData.append('title', title);
      formData.append('content', JSON.stringify(convertToRaw(editorState.getCurrentContent())));
      formData.append('imageBlog', image);

      const response = await fetch('http://localhost:5000/upload-blog', {
        method: 'POST',
        body: formData,
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
      });
      const data = await response.json();
      console.log(data);
      setTitle('');
      setEditorState(() => EditorState.createEmpty());
      setImage(null);
      setUploading(false);
    } catch (error) {
      console.error('Lỗi khi đăng tải blog: ', error);
      setUploading(false);
    }
  };

  return (
    <div className="upload-blog-container">
      <h1>Tải Tin Tức Mới</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          {/* <label>Tiêu đề:</label> <br/> <br/> */}
          {/* <input type="text"   /> */}
          <TextField
              label="Tiêu đề"
              name="title"
              fullWidth
              margin="normal"
              value={title} 
              onChange={(e) => setTitle(e.target.value)}
              required
            />
        </div>
        <div className="form-group">
          <label>Nội dung:</label> <br/> <br/>
          <Editor
            editorState={editorState}
            onEditorStateChange={setEditorState}
            wrapperClassName="editor-wrapper"
            editorClassName="editor-content"
            toolbarClassName="editor-toolbar"
            toolbar={{
                options: [
                    'inline',
                    'blockType',
                    'fontSize',
                    'list',
                    'textAlign',
                    'link',
                    'embedded',
                    'emoji',
                    'image',
                    'remove',
                    'history',
                  ],
                  inline: {
                    options: [
                      'bold',
                      'italic',
                      'underline',
                      'strikethrough',
                      'monospace',
                      'superscript',
                      'subscript',
                    ],
                  },
              image: {
                uploadEnabled: true,
                previewImage: true,
                inputAccept: 'image/*',
                alt: { present: true, mandatory: false },
                defaultSize: {
                  height: 'auto',
                  width: 'auto',
                },
              },
            }}
          />
        </div>
        <div className="form-group">
          <label>Ảnh Tin Tức:</label> <br/> <br/> 
          <input type="file" accept="image/*" onChange={(e) => setImage(e.target.files[0])} required />
        </div>
        <button type="submit" className="submit-btn" disabled={uploading}>{uploading ? 'Đang tải lên...' : 'Đăng tải'}</button>
      </form>
    </div>
  );
}

export default UploadBlog;
