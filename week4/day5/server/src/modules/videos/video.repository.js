import Video from "./video.model.js";

export class VideoRepository {
  create(data) {
    return Video.create(data);
  }

  findAllVisible() {
    return Video.find({ isVisible: true }).select('-videoUrl -publicId');
  }

  findById(id) {
    return Video.findById(id);
  }

  updateById(id, update) {
    return Video.findByIdAndUpdate(id, update, { new: true });
  }

  deleteById(id) {
    return Video.findByIdAndDelete(id);
  }

  count() {
    return Video.countDocuments({ isVisible: true });
  }

  getGenreStats() {
    return Video.aggregate([
      { $match: { isVisible: true } },
      { $group: { _id: '$genre', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);
  }
}
