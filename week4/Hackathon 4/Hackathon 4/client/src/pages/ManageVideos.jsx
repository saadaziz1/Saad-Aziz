import React, { useState, useEffect } from 'react';
import { videoService } from '../services/auth';
import AdminLayout from '../components/Admin/AdminLayout';
import Modal from '../components/UI/Modal';
import LoadingSpinner from '../components/UI/LoadingSpinner';

const ManageVideos = () => {
  const [videos, setVideos] = useState([]);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [uploadData, setUploadData] = useState({
    title: '',
    description: '',
    genre: '',
    releaseYear: '',
    duration: '',
    isPremium: false
  });
  const [videoFile, setVideoFile] = useState(null);
  const [thumbnailFile, setThumbnailFile] = useState(null);

  useEffect(() => {
    fetchVideos();
  }, []);

  const fetchVideos = async () => {
    try {
      const response = await videoService.getAllVideos();
      setVideos(response.data);
    } catch (err) {
      console.error('Failed to fetch videos:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    
    if (!videoFile || !thumbnailFile) {
      alert('Please select both video and thumbnail files');
      return;
    }
    
    try {
      const formData = new FormData();
      formData.append('title', uploadData.title);
      formData.append('description', uploadData.description);
      formData.append('genre', uploadData.genre);
      formData.append('releaseYear', uploadData.releaseYear);
      formData.append('duration', uploadData.duration);
      formData.append('isPremium', uploadData.isPremium);
      formData.append('video', videoFile);
      formData.append('thumbnail', thumbnailFile);
      
      await videoService.uploadVideo(formData);
      alert('Video uploaded successfully!');
      setShowUploadModal(false);
      setUploadData({
        title: '',
        description: '',
        genre: '',
        releaseYear: '',
        duration: '',
        isPremium: false
      });
      setVideoFile(null);
      setThumbnailFile(null);
      fetchVideos();
    } catch (err) {
      alert(err.response?.data?.message || 'Upload failed');
    }
  };

  const handleDelete = async (videoId) => {
    if (window.confirm('Are you sure you want to delete this video?')) {
      try {
        await videoService.deleteVideo(videoId);
        alert('Video deleted successfully!');
        fetchVideos();
      } catch (err) {
        alert(err.response?.data?.message || 'Delete failed');
      }
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <AdminLayout>
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1>Manage Videos</h1>
          <p>Upload and manage your video content library</p>
        </div>
        <button 
          className="btn"
          onClick={() => setShowUploadModal(true)}
        >
          + Upload Video
        </button>
      </div>

      {videos.length === 0 ? (
        <div className="no-data">
          <p>No videos found. Upload your first video!</p>
        </div>
      ) : (
        <div className="data-table">
          <table>
            <thead>
              <tr>
                <th>Title</th>
                <th>Genre</th>
                <th>Year</th>
                <th>Duration</th>
                <th>Type</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {videos.map((video) => (
                <tr key={video._id}>
                  <td>{video.title}</td>
                  <td>{video.genre}</td>
                  <td>{video.releaseYear}</td>
                  <td>{video.duration} min</td>
                  <td>
                    {video.isPremium ? (
                      <span className="badge premium">Premium</span>
                    ) : (
                      <span className="badge free">Free</span>
                    )}
                  </td>
                  <td>
                    <button
                      className="btn btn-secondary"
                      onClick={() => handleDelete(video._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal
        isOpen={showUploadModal}
        onClose={() => setShowUploadModal(false)}
        title="Upload Video"
      >
        <form onSubmit={handleUpload}>
          <div className="form-group">
            <label>Title</label>
            <input
              type="text"
              value={uploadData.title}
              onChange={(e) => setUploadData({...uploadData, title: e.target.value})}
              required
            />
          </div>
          <div className="form-group">
            <label>Description</label>
            <textarea
              value={uploadData.description}
              onChange={(e) => setUploadData({...uploadData, description: e.target.value})}
              required
            />
          </div>
          <div className="form-group">
            <label>Genre</label>
            <input
              type="text"
              value={uploadData.genre}
              onChange={(e) => setUploadData({...uploadData, genre: e.target.value})}
              required
            />
          </div>
          <div className="form-group">
            <label>Release Year</label>
            <input
              type="number"
              value={uploadData.releaseYear}
              onChange={(e) => setUploadData({...uploadData, releaseYear: e.target.value})}
              required
            />
          </div>
          <div className="form-group">
            <label>Duration (minutes)</label>
            <input
              type="number"
              value={uploadData.duration}
              onChange={(e) => setUploadData({...uploadData, duration: e.target.value})}
              required
            />
          </div>
          <div className="form-group">
            <label>Thumbnail Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setThumbnailFile(e.target.files[0])}
              required
            />
          </div>
          <div className="form-group">
            <label>Video File</label>
            <input
              type="file"
              accept="video/*"
              onChange={(e) => setVideoFile(e.target.files[0])}
              required
            />
          </div>
          <div className="form-group">
            <label>
              <input
                type="checkbox"
                checked={uploadData.isPremium}
                onChange={(e) => setUploadData({...uploadData, isPremium: e.target.checked})}
              />
              Premium Content
            </label>
          </div>
          <button type="submit" className="btn">
            Upload Video
          </button>
        </form>
      </Modal>
    </AdminLayout>
  );
};

export default ManageVideos;