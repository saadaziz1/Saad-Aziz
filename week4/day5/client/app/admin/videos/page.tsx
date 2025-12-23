"use client";

import { useState } from "react";
import { useMovies } from "@/hooks/useMovies";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Plus, Edit, Trash2, Upload, ChevronLeft, ChevronRight, Eye } from "lucide-react";
import Link from "next/link";
import { api } from "@/lib/api";
import { Movie } from "@/types";

interface UploadData {
  title: string;
  description: string;
  genres: string[];
  releaseYear: number;
  duration: number;
  languages: string[];
  director: {
    name: string;
    country: string;
    image: string;
  };
  cast: string[];
  videoFile: File | null;
  thumbnailFile: File | null;
  directorImageFile: File | null;
}

const AdminVideos = () => {
  const { movies, isMoviesLoading } = useMovies();
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [editingMovie, setEditingMovie] = useState<Movie | null>(null);
  const [uploading, setUploading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(6);
  const [streamUrl, setStreamUrl] = useState<string | null>(null);
  const [uploadData, setUploadData] = useState<UploadData>({
    title: "",
    description: "",
    genres: [],
    releaseYear: new Date().getFullYear(),
    duration: 0,
    languages: [],
    director: {
      name: "",
      country: "",
      image: ""
    },
    cast: [],
    videoFile: null,
    thumbnailFile: null,
    directorImageFile: null
  });

  // Pagination logic
  const totalItems = Array.isArray(movies) ? movies.length : 0;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentMovies = Array.isArray(movies) ? movies.slice(startIndex, endIndex) : [];

  const goToPage = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  const handleEdit = async (movie: Movie) => {
    setEditingMovie(movie);
    setUploadData({
      title: movie.title,
      description: movie.description,
      genres: Array.isArray(movie.genre) ? [movie.genre] : [movie.genre].filter(Boolean),
      releaseYear: movie.releaseYear,
      duration: Math.floor(movie.duration / 60),
      languages: movie.languages || [],
      director: {
        name: movie.director?.name || "",
        country: movie.director?.country || "",
        image: movie.director?.image || ""
      },
      cast: movie.cast?.map(c => c.name).filter(Boolean) || [],
      videoFile: null,
      thumbnailFile: null,
      directorImageFile: null
    });
    
    // Fetch stream URL for video preview
    try {
      const response = await api.get(`/videos/stream/${movie._id}`);
      setStreamUrl(response.data.videoUrl);
    } catch (error: any) {
      console.error('Failed to fetch stream URL:', error);
      setStreamUrl(null);
    }
    
    setShowUploadForm(true);
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('title', uploadData.title);
      formData.append('description', uploadData.description);
      formData.append('genres', JSON.stringify(uploadData.genres));
      formData.append('releaseYear', uploadData.releaseYear.toString());
      formData.append('duration', (uploadData.duration * 60).toString());
      formData.append('languages', JSON.stringify(uploadData.languages));
      formData.append('director', JSON.stringify(uploadData.director));
      formData.append('cast', JSON.stringify(uploadData.cast.map(name => ({ name }))));
      if (uploadData.videoFile) formData.append('video', uploadData.videoFile);
      if (uploadData.thumbnailFile) formData.append('thumbnail', uploadData.thumbnailFile);
      if (uploadData.directorImageFile) formData.append('directorImage', uploadData.directorImageFile);

      await api.put(`/videos/${editingMovie?._id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      alert('Video updated successfully!');
      setShowUploadForm(false);
      setEditingMovie(null);
      setUploadData({
        title: "",
        description: "",
        genres: [],
        releaseYear: new Date().getFullYear(),
        duration: 0,
        languages: [],
        director: {
          name: "",
          country: "",
          image: ""
        },
        cast: [],
        videoFile: null,
        thumbnailFile: null,
        directorImageFile: null
      });
      window.location.reload();
    } catch (error: any) {
      console.error('Update failed:', error);
      const errorMessage = error.response?.data?.message || 'Failed to update video';
      alert(errorMessage);
    } finally {
      setUploading(false);
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingMovie) return handleUpdate(e);

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('title', uploadData.title);
      formData.append('description', uploadData.description);
      formData.append('genres', JSON.stringify(uploadData.genres));
      formData.append('releaseYear', uploadData.releaseYear.toString());
      formData.append('duration', (uploadData.duration * 60).toString());
      formData.append('languages', JSON.stringify(uploadData.languages));
      formData.append('director', JSON.stringify(uploadData.director));
      formData.append('cast', JSON.stringify(uploadData.cast.map(name => ({ name }))));
      if (uploadData.videoFile) formData.append('video', uploadData.videoFile);
      if (uploadData.thumbnailFile) formData.append('thumbnail', uploadData.thumbnailFile);
      if (uploadData.directorImageFile) formData.append('directorImage', uploadData.directorImageFile);

      await api.post('/videos', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      alert('Video uploaded successfully!');
      setShowUploadForm(false);
      setUploadData({
        title: "",
        description: "",
        genres: [],
        releaseYear: new Date().getFullYear(),
        duration: 0,
        languages: [],
        director: {
          name: "",
          country: "",
          image: ""
        },
        cast: [],
        videoFile: null,
        thumbnailFile: null,
        directorImageFile: null
      });
      window.location.reload();
    } catch (error) {
      console.error('Upload failed:', error);
      alert('Failed to upload video');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (movieId: string) => {
    if (confirm('Are you sure you want to delete this video?')) {
      try {
        await api.delete(`/videos/${movieId}`);
        alert('Video deleted successfully!');
        window.location.reload();
      } catch (error) {
        console.error('Delete failed:', error);
        alert('Failed to delete video');
      }
    }
  };

  if (!movies) {
    return null;
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8">
      <div className="max-w-[1600px] mx-0 md:mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 sm:mb-8">
          <div>
            <h1 className="text-white text-2xl sm:text-3xl 3xl:text-6xl font-bold">Video Management</h1>
            <p className="text-gray-500 3xl:text-xl">Manage platform content</p>
          </div>
          <Button 
            onClick={() => setShowUploadForm(true)}
            className="bg-white text-black hover:bg-gray-200 w-fit 3xl:text-lg 3xl:px-6 3xl:py-3"
          >
            <Plus className="w-4 h-4 3xl:w-5 3xl:h-5 mr-2" />
            Add Video
          </Button>
        </div>

        {/* Upload Form */}
        {showUploadForm && (
          <Card className="bg-[#0A0A0A] border-[#1A1A1A] p-6 3xl:p-16 mb-6">
            <h2 className="text-white text-xl 3xl:text-3xl font-bold mb-4">
              {editingMovie ? 'Edit Video' : 'Upload New Video'}
            </h2>
            <form onSubmit={handleUpload} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-white text-sm 3xl:text-base font-medium mb-2">Title</label>
                <input
                  type="text"
                  value={uploadData.title}
                  onChange={(e) => setUploadData({ ...uploadData, title: e.target.value })}
                  className="w-full px-3 py-2 3xl:px-4 3xl:py-3 3xl:text-lg bg-[#1A1A1A] border border-[#2A2A2A] rounded-md text-white focus:outline-none focus:border-white"
                  required={!editingMovie}
                />
              </div>
              
              <div>
                <label className="block text-white text-sm 3xl:text-base font-medium mb-2">Genres (comma separated)</label>
                <input
                  type="text"
                  value={uploadData.genres.join(", ")}
                  onChange={(e) => setUploadData({ ...uploadData, genres: e.target.value.split(",").map(genre => genre.trim()).filter(genre => genre) })}
                  className="w-full px-3 py-2 3xl:px-4 3xl:py-3 3xl:text-lg bg-[#1A1A1A] border border-[#2A2A2A] rounded-md text-white focus:outline-none focus:border-white"
                  placeholder="Action, Adventure, Drama"
                />
              </div>
              
              <div>
                <label className="block text-white text-sm 3xl:text-base font-medium mb-2">Release Year</label>
                <input
                  type="number"
                  value={uploadData.releaseYear || new Date().getFullYear()}
                  onChange={(e) => setUploadData({ ...uploadData, releaseYear: parseInt(e.target.value) || new Date().getFullYear() })}
                  className="w-full px-3 py-2 3xl:px-4 3xl:py-3 3xl:text-lg bg-[#1A1A1A] border border-[#2A2A2A] rounded-md text-white focus:outline-none focus:border-white"
                  min="1900"
                  max={new Date().getFullYear() + 5}
                  required={!editingMovie}
                />
              </div>
              
              <div>
                <label className="block text-white text-sm 3xl:text-base font-medium mb-2">Duration (minutes)</label>
                <input
                  type="number"
                  value={uploadData.duration || 0}
                  onChange={(e) => setUploadData({ ...uploadData, duration: parseInt(e.target.value) || 0 })}
                  className="w-full px-3 py-2 3xl:px-4 3xl:py-3 3xl:text-lg bg-[#1A1A1A] border border-[#2A2A2A] rounded-md text-white focus:outline-none focus:border-white"
                  min="1"
                  required={!editingMovie}
                />
              </div>
              
              <div>
                <label className="block text-white text-sm 3xl:text-base font-medium mb-2">Languages (comma separated)</label>
                <input
                  type="text"
                  value={uploadData.languages.join(", ")}
                  onChange={(e) => setUploadData({ ...uploadData, languages: e.target.value.split(",").map(lang => lang.trim()).filter(lang => lang) })}
                  className="w-full px-3 py-2 3xl:px-4 3xl:py-3 3xl:text-lg bg-[#1A1A1A] border border-[#2A2A2A] rounded-md text-white focus:outline-none focus:border-white"
                  placeholder="English, Hindi, Tamil"
                />
              </div>
              
              <div>
                <label className="block text-white text-sm 3xl:text-base font-medium mb-2">Director Name</label>
                <input
                  type="text"
                  value={uploadData.director.name}
                  onChange={(e) => setUploadData({ ...uploadData, director: { ...uploadData.director, name: e.target.value } })}
                  className="w-full px-3 py-2 3xl:px-4 3xl:py-3 3xl:text-lg bg-[#1A1A1A] border border-[#2A2A2A] rounded-md text-white focus:outline-none focus:border-white"
                />
              </div>
              
              <div>
                <label className="block text-white text-sm 3xl:text-base font-medium mb-2">Director Country</label>
                <input
                  type="text"
                  value={uploadData.director.country}
                  onChange={(e) => setUploadData({ ...uploadData, director: { ...uploadData.director, country: e.target.value } })}
                  className="w-full px-3 py-2 3xl:px-4 3xl:py-3 3xl:text-lg bg-[#1A1A1A] border border-[#2A2A2A] rounded-md text-white focus:outline-none focus:border-white"
                />
              </div>
              
              <div>
                <label className="block text-white text-sm 3xl:text-base font-medium mb-2">Director Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setUploadData({ ...uploadData, directorImageFile: e.target.files?.[0] || null })}
                  className="w-full px-3 py-2 3xl:px-4 3xl:py-3 3xl:text-lg bg-[#1A1A1A] border border-[#2A2A2A] rounded-md text-white focus:outline-none focus:border-white file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-white file:text-black hover:file:bg-gray-200"
                />
                {uploadData.directorImageFile && (
                  <div className="mt-2">
                    <img
                      src={URL.createObjectURL(uploadData.directorImageFile)}
                      alt="Director preview"
                      className="w-16 h-16 3xl:w-20 3xl:h-20 object-cover rounded-md"
                    />
                  </div>
                )}
                {editingMovie && !uploadData.directorImageFile && editingMovie.director?.image && (
                  <div className="mt-2">
                    <img
                      src={editingMovie.director.image}
                      alt="Current director"
                      className="w-16 h-16 3xl:w-20 3xl:h-20 object-cover rounded-md"
                    />
                    <p className="text-gray-400 text-xs mt-1">Current director image</p>
                  </div>
                )}
              </div>
              
              <div>
                <label className="block text-white text-sm 3xl:text-base font-medium mb-2">Cast (comma separated names)</label>
                <input
                  type="text"
                  value={uploadData.cast.join(", ")}
                  onChange={(e) => setUploadData({ ...uploadData, cast: e.target.value.split(",").map(name => name.trim()).filter(name => name) })}
                  className="w-full px-3 py-2 3xl:px-4 3xl:py-3 3xl:text-lg bg-[#1A1A1A] border border-[#2A2A2A] rounded-md text-white focus:outline-none focus:border-white"
                  placeholder="Actor 1, Actor 2, Actor 3"
                />
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-white text-sm 3xl:text-base font-medium mb-2">Description</label>
                <textarea
                  value={uploadData.description}
                  onChange={(e) => setUploadData({ ...uploadData, description: e.target.value })}
                  className="w-full px-3 py-2 3xl:px-4 3xl:py-3 3xl:text-lg bg-[#1A1A1A] border border-[#2A2A2A] rounded-md text-white focus:outline-none focus:border-white"
                  rows={3}
                  required={!editingMovie}
                />
              </div>
              
              <div>
                <label className="block text-white text-sm 3xl:text-base font-medium mb-2">Video File</label>
                <input
                  type="file"
                  accept="video/*"
                  onChange={(e) => setUploadData({ ...uploadData, videoFile: e.target.files?.[0] || null })}
                  className="w-full px-3 py-2 3xl:px-4 3xl:py-3 3xl:text-lg bg-[#1A1A1A] border border-[#2A2A2A] rounded-md text-white focus:outline-none focus:border-white file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-white file:text-black hover:file:bg-gray-200"
                  required={!editingMovie}
                />
                {uploadData.videoFile && (
                  <div className="mt-2">
                    <video
                      src={URL.createObjectURL(uploadData.videoFile)}
                      className="w-48 3xl:w-64 h-32 3xl:h-40 object-cover rounded-md bg-black"
                      controls
                    />
                  </div>
                )}
                {editingMovie && !uploadData.videoFile && (
                  <div className="mt-2">
                    {streamUrl ? (
                      <video
                        src={streamUrl}
                        className="w-48 3xl:w-64 h-32 3xl:h-40 object-cover rounded-md bg-black"
                        controls
                      />
                    ) : (
                      <div className="w-48 3xl:w-64 h-32 3xl:h-40 bg-gray-800 rounded-md flex items-center justify-center">
                        <p className="text-gray-400 text-sm">Loading video...</p>
                      </div>
                    )}
                    <p className="text-gray-400 text-xs mt-1">Current video</p>
                  </div>
                )}
              </div>
              
              <div>
                <label className="block text-white text-sm 3xl:text-base font-medium mb-2">Thumbnail</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setUploadData({ ...uploadData, thumbnailFile: e.target.files?.[0] || null })}
                  className="w-full px-3 py-2 3xl:px-4 3xl:py-3 3xl:text-lg bg-[#1A1A1A] border border-[#2A2A2A] rounded-md text-white focus:outline-none focus:border-white file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-white file:text-black hover:file:bg-gray-200"
                  required={!editingMovie}
                />
                {uploadData.thumbnailFile && (
                  <div className="mt-2">
                    <img
                      src={URL.createObjectURL(uploadData.thumbnailFile)}
                      alt="Thumbnail preview"
                      className="w-48 3xl:w-64 h-32 3xl:h-40 object-cover rounded-md"
                    />
                  </div>
                )}
                {editingMovie && !uploadData.thumbnailFile && (
                  <div className="mt-2">
                    <img
                      src={editingMovie.thumbnailUrl}
                      alt="Current thumbnail"
                      className="w-48 3xl:w-64 h-32 3xl:h-40 object-cover rounded-md"
                    />
                    <p className="text-gray-400 text-xs mt-1">Current thumbnail</p>
                  </div>
                )}
              </div>
              
              <div className="md:col-span-2 flex gap-4">
                <Button
                  type="submit"
                  disabled={uploading}
                  className="bg-white text-black hover:bg-gray-200 3xl:text-lg 3xl:px-6 3xl:py-3"
                >
                  <Upload className="w-4 h-4 3xl:w-5 3xl:h-5 mr-2" />
                  {uploading ? 'Processing...' : (editingMovie ? 'Update Video' : 'Upload Video')}
                </Button>
                <Button
                  type="button"
                  onClick={() => {
                    setShowUploadForm(false);
                    setEditingMovie(null);
                    setUploadData({
                      title: "",
                      description: "",
                      genres: [],
                      releaseYear: new Date().getFullYear(),
                      duration: 0,
                      languages: [],
                      director: {
                        name: "",
                        country: "",
                        image: ""
                      },
                      cast: [],
                      videoFile: null,
                      thumbnailFile: null,
                      directorImageFile: null
                    });
                  }}
                  className="bg-gray-800 text-white hover:bg-gray-700 3xl:text-lg 3xl:px-6 3xl:py-3"
                >
                  Cancel
                </Button>
              </div>
            </form>
          </Card>
        )}

        {/* Video Grid */}
        <Card className="bg-[#0A0A0A] border-[#1A1A1A] overflow-hidden sm:m-0 sm:w-full 3xl:p-8">
          {isMoviesLoading ? (
            <div className="text-center text-white py-12">Loading videos...</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6 p-3">
              {currentMovies.length > 0 ? currentMovies.map((movie) => (
                <div key={movie._id} className="bg-[#1A1A1A] rounded-lg overflow-hidden hover:bg-[#2A2A2A] transition-colors">
                  <div className="w-full aspect-video bg-[#111]">
                    <img
                      src={movie.thumbnailUrl}
                      alt={movie.title}
                      className="w-full h-full object-cover"
                      draggable={false}
                    />
                  </div>
                  <div className="p-4 3xl:p-6">
                    <h3 className="text-white font-semibold mb-2 line-clamp-1 3xl:text-xl">{movie.title}</h3>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="px-2 py-1 3xl:px-3 3xl:py-2 bg-white/10 text-white text-xs 3xl:text-sm rounded-full">{movie.genre}</span>
                      <span className="text-gray-400 text-xs 3xl:text-sm">{movie.releaseYear}</span>
                    </div>
                    <p className="text-gray-400 text-sm 3xl:text-base mb-4 line-clamp-2">{movie.description}</p>
                    <div className="flex flex-wrap gap-2">
                      <Link href={`/movies/${movie._id}`}>
                        <Button size="sm" className="bg-white text-black hover:bg-gray-200 text-xs 3xl:text-sm h-8 3xl:h-10 3xl:px-4">
                          <Eye className="w-3 h-3 3xl:w-4 3xl:h-4 mr-1" /> View
                        </Button>
                      </Link>
                      <Button onClick={() => handleEdit(movie)} size="sm" className="bg-gray-800 text-white hover:bg-gray-700 text-xs 3xl:text-sm h-8 3xl:h-10 3xl:px-4">
                        <Edit className="w-3 h-3 3xl:w-4 3xl:h-4 mr-1" /> Edit
                      </Button>
                      <Button onClick={() => handleDelete(movie._id)} size="sm" className="bg-gray-800 text-white hover:bg-gray-700 text-xs 3xl:text-sm h-8 3xl:h-10 3xl:px-4">
                        <Trash2 className="w-3 h-3 3xl:w-4 3xl:h-4 mr-1" /> Delete
                      </Button>
                    </div>
                  </div>
                </div>
              )) : (
                <div className="col-span-full text-center text-gray-500 py-12">
                  No videos found. Upload your first video to get started.
                </div>
              )}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-6 py-4 border-t border-[#1A1A1A]">
              <div className="text-gray-500 text-sm">
                Showing {startIndex + 1}-{Math.min(endIndex, totalItems)} of {totalItems} videos
              </div>
              <div className="flex items-center gap-2">
                <Button
                  onClick={() => goToPage(currentPage - 1)}
                  disabled={currentPage === 1}
                  size="sm"
                  className="bg-gray-800 hover:bg-gray-700 text-white disabled:opacity-50"
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>

                {/* Page buttons - show at most 3 pages */}
                {(() => {
                  const visiblePages = 3;
                  let startPage = Math.max(currentPage - 1, 1);
                  let endPage = startPage + visiblePages - 1;

                  if (endPage > totalPages) {
                    endPage = totalPages;
                    startPage = Math.max(endPage - visiblePages + 1, 1);
                  }

                  const pages = [];
                  for (let i = startPage; i <= endPage; i++) pages.push(i);

                  return pages.map((page) => (
                    <Button
                      key={page}
                      onClick={() => goToPage(page)}
                      size="sm"
                      className={`w-8 h-8 ${
                        currentPage === page
                          ? 'bg-white text-black hover:bg-gray-200'
                          : 'bg-gray-800 hover:bg-gray-700 text-white'
                      }`}
                    >
                      {page}
                    </Button>
                  ));
                })()}

                <Button
                  onClick={() => goToPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  size="sm"
                  className="bg-gray-800 hover:bg-gray-700 text-white disabled:opacity-50"
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default AdminVideos;
