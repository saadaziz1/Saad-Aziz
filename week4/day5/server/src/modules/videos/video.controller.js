export class VideoController {
  constructor(videoService) {
    this.videoService = videoService;
  }

  listVideos = async (req, res) => {
    try {
      const videos = await this.videoService.listVideos();
      res.json({ success: true, data: videos });
    } catch (error) {
      console.error('List videos error:', error);
      res.status(500).json({ success: false, message: error.message });
    }
  };

  getVideo = async (req, res) => {
    try {
      const video = await this.videoService.getVideoDetails(req.params.id);
      res.json({ success: true, data: video });
    } catch (error) {
      console.error('Get video error:', error);
      res.status(500).json({ success: false, message: error.message });
    }
  };

  streamVideo = async (req, res) => {
    try {
      const videoUrl = await this.videoService.streamVideo(req.params.id, req.user);
      res.json({ success: true, videoUrl });
    } catch (error) {
      console.error('Stream video error:', error);
      res.status(500).json({ success: false, message: error.message });
    }
  };

  uploadVideo = async (req, res) => {
    try {
      console.log('Upload request body:', req.body);
      console.log('Upload request files:', req.files);
      const video = await this.videoService.uploadVideo(req.body, req.files);
      res.status(201).json({ success: true, data: video });
    } catch (error) {
      console.error('Upload video error:', error);
      res.status(500).json({ success: false, message: error.message });
    }
  };

  updateVideo = async (req, res) => {
    try {
      console.log('Update request body:', req.body);
      console.log('Update request files:', req.files);
      const video = await this.videoService.updateVideo(req.params.id, req.body, req.files);
      res.json({ success: true, data: video });
    } catch (error) {
      console.error('Update video error:', error);
      res.status(500).json({ success: false, message: error.message });
    }
  };

  deleteVideo = async (req, res) => {
    try {
      await this.videoService.deleteVideo(req.params.id);
      res.json({ success: true, message: "Video deleted" });
    } catch (error) {
      console.error('Delete video error:', error);
      res.status(500).json({ success: false, message: error.message });
    }
  };
}
