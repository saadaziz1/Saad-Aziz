import { ApiError } from "../../shared/errors/ApiError.js";
import cloudinary from "../../config/cloudinary.config.js";

export class VideoService {
  constructor(videoRepo, subscriptionService) {
    this.videoRepo = videoRepo;
    this.subscriptionService = subscriptionService;
  }

  // Helper method to upload buffer to Cloudinary
  async uploadToCloudinary(buffer, options) {
    return new Promise((resolve, reject) => {
      try {
        cloudinary.uploader.upload_stream(options, (error, result) => {
          if (error) {
            console.error('Cloudinary upload error:', error);
            reject(error);
          } else {
            resolve(result);
          }
        }).end(buffer);
      } catch (error) {
        console.error('Cloudinary upload stream error:', error);
        reject(error);
      }
    });
  }

  // Public
  async listVideos() {
    return this.videoRepo.findAllVisible();
  }

  async getVideoDetails(id) {
    const video = await this.videoRepo.findById(id);
    if (!video || !video.isVisible) throw new ApiError(404, "Video not found");

    const { videoUrl, publicId, ...publicData } = video.toObject();
    return publicData;
  }

  // Protected
  async streamVideo(id, user) {
    if (!user) throw new ApiError(401, "Login required");

    if (user.role !== "SUPER_ADMIN") {
      await this.subscriptionService.checkAccess(user);
    }

    const video = await this.videoRepo.findById(id);
    if (!video || !video.isVisible) throw new ApiError(404, "Video not found");

    return video.videoUrl;
  }

  async uploadVideo(meta, files) {
    console.log('Upload video service called with:', { meta, files });
    
    if (!files || !files.video || !files.video[0]) {
      throw new ApiError(400, "Video file is required");
    }
    
    if (!files.thumbnail || !files.thumbnail[0]) {
      throw new ApiError(400, "Thumbnail file is required");
    }
    
    const videoFile = files.video[0];
    const thumbnailFile = files.thumbnail[0];
    
    console.log('Video file info:', { 
      originalname: videoFile.originalname, 
      mimetype: videoFile.mimetype, 
      size: videoFile.size,
      bufferLength: videoFile.buffer?.length 
    });
    
    console.log('Thumbnail file info:', { 
      originalname: thumbnailFile.originalname, 
      mimetype: thumbnailFile.mimetype, 
      size: thumbnailFile.size,
      bufferLength: thumbnailFile.buffer?.length 
    });

    try {
      console.log('Starting video upload to Cloudinary...');
      const videoResult = await this.uploadToCloudinary(videoFile.buffer, {
        resource_type: "video",
        folder: "ott-videos"
      });
      console.log('Video upload successful:', videoResult.secure_url);

      console.log('Starting thumbnail upload to Cloudinary...');
      const thumbnailResult = await this.uploadToCloudinary(thumbnailFile.buffer, {
        folder: "ott-videos/thumbnails"
      });
      console.log('Thumbnail upload successful:', thumbnailResult.secure_url);
      
      const videoData = {
        ...meta,
        videoUrl: videoResult.secure_url,
        publicId: videoResult.public_id,
        thumbnailUrl: thumbnailResult.secure_url
      };
      
      // Parse JSON fields
      if (meta.languages) {
        try {
          videoData.languages = JSON.parse(meta.languages);
        } catch (e) {
          videoData.languages = meta.languages;
        }
      }
      
      if (meta.director) {
        try {
          videoData.director = JSON.parse(meta.director);
        } catch (e) {
          videoData.director = meta.director;
        }
      }
      
      if (meta.cast) {
        try {
          videoData.cast = JSON.parse(meta.cast);
        } catch (e) {
          videoData.cast = meta.cast;
        }
      }
      
      if (files.directorImage?.[0]) {
        console.log('Starting director image upload to Cloudinary...');
        const directorResult = await this.uploadToCloudinary(files.directorImage[0].buffer, {
          folder: "ott-videos/directors"
        });
        console.log('Director image upload successful:', directorResult.secure_url);
        if (!videoData.director) videoData.director = {};
        videoData.director.image = directorResult.secure_url;
      }

      console.log('Creating video record in database...');
      const video = await this.videoRepo.create(videoData);
      console.log('Video created successfully:', video._id);

      return video;
    } catch (error) {
      console.error('Upload video service error:', error);
      throw error;
    }
  }

  async updateVideo(id, meta, files) {
    const updateData = { ...meta };
    
    // Parse JSON fields if they exist
    if (meta.languages) {
      try {
        updateData.languages = JSON.parse(meta.languages);
      } catch (e) {
        updateData.languages = meta.languages;
      }
    }
    
    if (meta.director) {
      try {
        updateData.director = JSON.parse(meta.director);
      } catch (e) {
        updateData.director = meta.director;
      }
    }
    
    if (meta.cast) {
      try {
        updateData.cast = JSON.parse(meta.cast);
      } catch (e) {
        updateData.cast = meta.cast;
      }
    }

    if (files?.video?.[0]) {
      const videoResult = await this.uploadToCloudinary(files.video[0].buffer, {
        resource_type: "video",
        folder: "ott-videos"
      });
      updateData.videoUrl = videoResult.secure_url;
      updateData.publicId = videoResult.public_id;
    }

    if (files?.thumbnail?.[0]) {
      const thumbResult = await this.uploadToCloudinary(files.thumbnail[0].buffer, {
        folder: "ott-videos/thumbnails"
      });
      updateData.thumbnailUrl = thumbResult.secure_url;
    }
    
    if (files?.directorImage?.[0]) {
      const directorResult = await this.uploadToCloudinary(files.directorImage[0].buffer, {
        folder: "ott-videos/directors"
      });
      if (!updateData.director) updateData.director = {};
      updateData.director.image = directorResult.secure_url;
    }

    const updatedVideo = await this.videoRepo.updateById(id, updateData);
    if (!updatedVideo) throw new ApiError(404, "Video not found");

    return updatedVideo;
  }

  async deleteVideo(id) {
    const video = await this.videoRepo.findById(id);
    if (!video) throw new ApiError(404, "Video not found");

    await cloudinary.uploader.destroy(video.publicId, { resource_type: "video" });
    return this.videoRepo.deleteById(id);
  }
}
