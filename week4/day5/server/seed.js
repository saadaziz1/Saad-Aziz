import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import User from "./src/modules/users/user.model.js";
import Video from "./src/modules/videos/video.model.js";
import { config } from "dotenv";

config();

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");

    // Clear existing data
    await User.deleteMany({});
    await Video.deleteMany({});
    console.log("Cleared existing data");

    // Create admin user
    const hashedPassword = await bcrypt.hash("admin123", 10);
    const adminUser = await User.create({
      name: "Admin User",
      email: "admin@streamflix.com",
      password: hashedPassword,
      role: "SUPER_ADMIN"
    });

    // Create regular user
    const userPassword = await bcrypt.hash("user123", 10);
    const regularUser = await User.create({
      name: "John Doe",
      email: "user@streamflix.com",
      password: userPassword,
      role: "USER"
    });

    console.log("Created users:", { admin: adminUser.email, user: regularUser.email });

    // Create movies data with real posters and Cloudinary videos
    const videos = [
      // Action Movies
      {
        title: "Avengers: Endgame",
        description: "After the devastating events of Avengers: Infinity War, the universe is in ruins. With the help of remaining allies, the Avengers assemble once more to reverse Thanos' actions and restore balance to the universe.",
        genre: "Action",
        releaseYear: 2019,
        duration: 10800,
        thumbnailUrl: "https://m.media-amazon.com/images/M/MV5BMTc5MDE2ODcwNV5BMl5BanBnXkFtZTgwMzI2NzQ2NzM@._V1_.jpg",
        videoUrl: "https://res.cloudinary.com/dxnxa5jgc/video/upload/v1766408547/ott-videos/bpnazhfe5uglwppqqgqw.mp4",
        publicId: "avengers_endgame",
        isVisible: true,
        languages: ["English"],
        director: {
          name: "Anthony Russo, Joe Russo",
          image: "https://via.placeholder.com/300x400/1a1a1a/ffffff?text=Director",
          country: "USA"
        },
        cast: [
          { name: "Robert Downey Jr.", image: "https://via.placeholder.com/200x250/1a1a1a/ffffff?text=RDJ" },
          { name: "Chris Evans", image: "https://via.placeholder.com/200x250/1a1a1a/ffffff?text=CE" },
          { name: "Mark Ruffalo", image: "https://via.placeholder.com/200x250/1a1a1a/ffffff?text=MR" },
          { name: "Chris Hemsworth", image: "https://via.placeholder.com/200x250/1a1a1a/ffffff?text=CH" },
          { name: "Scarlett Johansson", image: "https://via.placeholder.com/200x250/1a1a1a/ffffff?text=SJ" }
        ],
        reviews: [
          { name: "John Smith", location: "From USA", rating: 5, review: "An epic conclusion to the Marvel saga. Incredible action and emotional depth." },
          { name: "Sarah Johnson", location: "From UK", rating: 4, review: "Great movie with amazing visual effects and character development." }
        ]
      },
      {
        title: "John Wick",
        description: "An ex-hit-man comes out of retirement to track down the gangsters that took everything from him.",
        genre: "Action",
        releaseYear: 2014,
        duration: 6060,
        thumbnailUrl: "https://m.media-amazon.com/images/M/MV5BMTU2NjA1ODgzMF5BMl5BanBnXkFtZTgwMTM2MTI4MjE@._V1_.jpg",
        videoUrl: "https://res.cloudinary.com/dxnxa5jgc/video/upload/v1766409574/ott-videos/mit7vfqyoj8sjrvxebez.mp4",
        publicId: "john_wick",
        isVisible: true,
        languages: ["English"],
        director: {
          name: "Chad Stahelski",
          image: "https://via.placeholder.com/300x400/1a1a1a/ffffff?text=Director",
          country: "USA"
        },
        cast: [
          { name: "Keanu Reeves", image: "https://via.placeholder.com/200x250/1a1a1a/ffffff?text=KR" },
          { name: "Michael Nyqvist", image: "https://via.placeholder.com/200x250/1a1a1a/ffffff?text=MN" },
          { name: "Alfie Allen", image: "https://via.placeholder.com/200x250/1a1a1a/ffffff?text=AA" }
        ],
        reviews: [
          { name: "Mike Wilson", location: "From Canada", rating: 5, review: "Stylish action movie with incredible choreography and Keanu at his best." },
          { name: "Emma Davis", location: "From Australia", rating: 4, review: "Non-stop action with a simple but effective revenge story." }
        ]
      },
      {
        title: "Mad Max: Fury Road",
        description: "In a post-apocalyptic wasteland, a woman rebels against a tyrannical ruler in search for her homeland with the aid of a group of female prisoners, a psychotic worshiper, and a drifter named Max.",
        genre: "Action",
        releaseYear: 2015,
        duration: 7200,
        thumbnailUrl: "https://m.media-amazon.com/images/M/MV5BN2EwM2I5OWMtMGQyMi00Zjg1LWJkNTctZTdjYTA4OGUwZjMyXkEyXkFqcGdeQXVyMTMxODk2OTU@._V1_.jpg",
        videoUrl: "https://res.cloudinary.com/dxnxa5jgc/video/upload/v1766409613/ott-videos/jjsxwnbjdbtvp76bwiwm.mp4",
        publicId: "mad_max_fury_road",
        isVisible: true,
        languages: ["English"],
        director: {
          name: "George Miller",
          country: "Australia"
        }
      },{
        title: "Superbad",
        description: "Two co-dependent high school seniors are forced to deal with separation anxiety after their plan to stage a booze-soaked party goes awry.",
        genre: "Action",
        releaseYear: 2007,
        duration: 6780,
        thumbnailUrl: "https://m.media-amazon.com/images/M/MV5BY2VkMDg4ZTYtN2M3Yy00NWZiLWE2ODEtZjU5MjZkYWNkNGIzXkEyXkFqcGdeQXVyODY5Njk4Njc@._V1_.jpg",
        videoUrl: "https://res.cloudinary.com/dxnxa5jgc/video/upload/v1766409574/ott-videos/mit7vfqyoj8sjrvxebez.mp4",
        publicId: "superbad",
        isVisible: true,
        languages: ["English"]
      },
      // Comedy Movies
      {
        title: "The Hangover",
        description: "Three buddies wake up from a bachelor party in Las Vegas, with no memory of the previous night and the bachelor missing.",
        genre: "Comedy",
        releaseYear: 2009,
        duration: 6000,
        thumbnailUrl: "https://m.media-amazon.com/images/M/MV5BNGQwZjg5YmYtY2VkNC00NzliLTljYTctNzI5NmU3MjE2ODQzXkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_.jpg",
        videoUrl: "https://res.cloudinary.com/dxnxa5jgc/video/upload/v1766408547/ott-videos/bpnazhfe5uglwppqqgqw.mp4",
        publicId: "hangover",
        isVisible: true,
        languages: ["English"]
      },
      {
        title: "Superbad",
        description: "Two co-dependent high school seniors are forced to deal with separation anxiety after their plan to stage a booze-soaked party goes awry.",
        genre: "Comedy",
        releaseYear: 2007,
        duration: 6780,
        thumbnailUrl: "https://m.media-amazon.com/images/M/MV5BY2VkMDg4ZTYtN2M3Yy00NWZiLWE2ODEtZjU5MjZkYWNkNGIzXkEyXkFqcGdeQXVyODY5Njk4Njc@._V1_.jpg",
        videoUrl: "https://res.cloudinary.com/dxnxa5jgc/video/upload/v1766409574/ott-videos/mit7vfqyoj8sjrvxebez.mp4",
        publicId: "superbad",
        isVisible: true,
        languages: ["English"]
      },
      {
        title: "Deadpool",
        description: "A wisecracking mercenary gets experimented on and becomes immortal but ugly, and sets out to track down the man who ruined his looks.",
        genre: "Comedy",
        releaseYear: 2016,
        duration: 6480,
        thumbnailUrl: "https://m.media-amazon.com/images/M/MV5BYzE5MjY1ZDgtMTkyNC00MTMyLThhMjAtZGI5OTE1NzFlZGJjXkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_.jpg",
        videoUrl: "https://res.cloudinary.com/dxnxa5jgc/video/upload/v1766409613/ott-videos/jjsxwnbjdbtvp76bwiwm.mp4",
        publicId: "deadpool",
        isVisible: true,
        languages: ["English"]
      }, {
        title: "The Shawshank Redemption",
        description: "Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.",
        genre: "Comedy",
        releaseYear: 1994,
        duration: 8520,
        thumbnailUrl: "https://m.media-amazon.com/images/M/MV5BNDE3ODcxYzMtY2YzZC00NmNlLWJiNDMtZDViZWM2MzIxZDYwXkEyXkFqcGdeQXVyNjAwNDUxODI@._V1_.jpg",
        videoUrl: "https://res.cloudinary.com/dxnxa5jgc/video/upload/v1766408547/ott-videos/bpnazhfe5uglwppqqgqw.mp4",
        publicId: "shawshank_redemption",
        isVisible: true,
        languages: ["English"]
      },
      // Drama Movies
      {
        title: "The Shawshank Redemption",
        description: "Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.",
        genre: "Drama",
        releaseYear: 1994,
        duration: 8520,
        thumbnailUrl: "https://m.media-amazon.com/images/M/MV5BNDE3ODcxYzMtY2YzZC00NmNlLWJiNDMtZDViZWM2MzIxZDYwXkEyXkFqcGdeQXVyNjAwNDUxODI@._V1_.jpg",
        videoUrl: "https://res.cloudinary.com/dxnxa5jgc/video/upload/v1766408547/ott-videos/bpnazhfe5uglwppqqgqw.mp4",
        publicId: "shawshank_redemption",
        isVisible: true,
        languages: ["English"],
        director: {
          name: "Frank Darabont",
          image: "https://via.placeholder.com/300x400/1a1a1a/ffffff?text=Director",
          country: "USA"
        },
        cast: [
          { name: "Tim Robbins", image: "https://via.placeholder.com/200x250/1a1a1a/ffffff?text=TR" },
          { name: "Morgan Freeman", image: "https://via.placeholder.com/200x250/1a1a1a/ffffff?text=MF" },
          { name: "Bob Gunton", image: "https://via.placeholder.com/200x250/1a1a1a/ffffff?text=BG" }
        ],
        reviews: [
          { name: "David Brown", location: "From USA", rating: 5, review: "A masterpiece of storytelling. One of the greatest films ever made." },
          { name: "Lisa Chen", location: "From Singapore", rating: 5, review: "Emotionally powerful and beautifully crafted. A true classic." }
        ]
      },
      {
        title: "Forrest Gump",
        description: "The presidencies of Kennedy and Johnson, the events of Vietnam, Watergate and other historical events unfold from the perspective of an Alabama man with an IQ of 75.",
        genre: "Drama",
        releaseYear: 1994,
        duration: 8520,
        thumbnailUrl: "https://m.media-amazon.com/images/M/MV5BNWIwODRlZTUtY2U3ZS00Yzg1LWJhNzYtMmZiYmEyNmU1NjMzXkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_.jpg",
        videoUrl: "https://res.cloudinary.com/dxnxa5jgc/video/upload/v1766409574/ott-videos/mit7vfqyoj8sjrvxebez.mp4",
        publicId: "forrest_gump",
        isVisible: true,
        languages: ["English"]
      },{
        title: "The Conjuring",
        description: "Paranormal investigators Ed and Lorraine Warren work to help a family terrorized by a dark presence in their farmhouse.",
        genre: "Drama",
        releaseYear: 2013,
        duration: 6720,
        thumbnailUrl: "https://m.media-amazon.com/images/M/MV5BMTM3NjA1NDMyMV5BMl5BanBnXkFtZTcwMDQzNDMzOQ@@._V1_.jpg",
        videoUrl: "https://res.cloudinary.com/dxnxa5jgc/video/upload/v1766409613/ott-videos/jjsxwnbjdbtvp76bwiwm.mp4",
        publicId: "conjuring",
        isVisible: true,
        languages: ["English"],director: {
          name: "Frank Darabont",
          image: "https://via.placeholder.com/300x400/1a1a1a/ffffff?text=Director",
          country: "USA"
        },
        cast: [
          { name: "Tim Robbins", image: "https://via.placeholder.com/200x250/1a1a1a/ffffff?text=TR" },
          { name: "Morgan Freeman", image: "https://via.placeholder.com/200x250/1a1a1a/ffffff?text=MF" },
          { name: "Bob Gunton", image: "https://via.placeholder.com/200x250/1a1a1a/ffffff?text=BG" }
        ],
        reviews: [
          { name: "David Brown", location: "From USA", rating: 5, review: "A masterpiece of storytelling. One of the greatest films ever made." },
          { name: "Lisa Chen", location: "From Singapore", rating: 5, review: "Emotionally powerful and beautifully crafted. A true classic." }
        ]
      },
      {
        title: "Get Out",
        description: "A young African-American visits his white girlfriend's parents for the weekend, where his simmering uneasiness about their reception of him eventually reaches a boiling point.",
        genre: "Drama",
        releaseYear: 2017,
        duration: 6240,
        thumbnailUrl: "https://m.media-amazon.com/images/M/MV5BMjUxMDQwNjcyNl5BMl5BanBnXkFtZTgwNzcwMzc0MTI@._V1_.jpg",
        videoUrl: "https://res.cloudinary.com/dxnxa5jgc/video/upload/v1766408547/ott-videos/bpnazhfe5uglwppqqgqw.mp4",
        publicId: "get_out",
        isVisible: true,
        languages: ["English"],director: {
          name: "Frank Darabont",
          image: "https://via.placeholder.com/300x400/1a1a1a/ffffff?text=Director",
          country: "USA"
        },
        cast: [
          { name: "Tim Robbins", image: "https://via.placeholder.com/200x250/1a1a1a/ffffff?text=TR" },
          { name: "Morgan Freeman", image: "https://via.placeholder.com/200x250/1a1a1a/ffffff?text=MF" },
          { name: "Bob Gunton", image: "https://via.placeholder.com/200x250/1a1a1a/ffffff?text=BG" }
        ],
        reviews: [
          { name: "David Brown", location: "From USA", rating: 5, review: "A masterpiece of storytelling. One of the greatest films ever made." },
          { name: "Lisa Chen", location: "From Singapore", rating: 5, review: "Emotionally powerful and beautifully crafted. A true classic." }
        ]
      },
      // Horror Movies
      {
        title: "The Conjuring",
        description: "Paranormal investigators Ed and Lorraine Warren work to help a family terrorized by a dark presence in their farmhouse.",
        genre: "Horror",
        releaseYear: 2013,
        duration: 6720,
        thumbnailUrl: "https://m.media-amazon.com/images/M/MV5BMTM3NjA1NDMyMV5BMl5BanBnXkFtZTcwMDQzNDMzOQ@@._V1_.jpg",
        videoUrl: "https://res.cloudinary.com/dxnxa5jgc/video/upload/v1766409613/ott-videos/jjsxwnbjdbtvp76bwiwm.mp4",
        publicId: "conjuring",
        isVisible: true,
        languages: ["English"],director: {
          name: "Frank Darabont",
          image: "https://via.placeholder.com/300x400/1a1a1a/ffffff?text=Director",
          country: "USA"
        },
        cast: [
          { name: "Tim Robbins", image: "https://via.placeholder.com/200x250/1a1a1a/ffffff?text=TR" },
          { name: "Morgan Freeman", image: "https://via.placeholder.com/200x250/1a1a1a/ffffff?text=MF" },
          { name: "Bob Gunton", image: "https://via.placeholder.com/200x250/1a1a1a/ffffff?text=BG" }
        ],
        reviews: [
          { name: "David Brown", location: "From USA", rating: 5, review: "A masterpiece of storytelling. One of the greatest films ever made." },
          { name: "Lisa Chen", location: "From Singapore", rating: 5, review: "Emotionally powerful and beautifully crafted. A true classic." }
        ]
      },
      {
        title: "Get Out",
        description: "A young African-American visits his white girlfriend's parents for the weekend, where his simmering uneasiness about their reception of him eventually reaches a boiling point.",
        genre: "Horror",
        releaseYear: 2017,
        duration: 6240,
        thumbnailUrl: "https://m.media-amazon.com/images/M/MV5BMjUxMDQwNjcyNl5BMl5BanBnXkFtZTgwNzcwMzc0MTI@._V1_.jpg",
        videoUrl: "https://res.cloudinary.com/dxnxa5jgc/video/upload/v1766408547/ott-videos/bpnazhfe5uglwppqqgqw.mp4",
        publicId: "get_out",
        isVisible: true,
        languages: ["English"],director: {
          name: "Frank Darabont",
          image: "https://via.placeholder.com/300x400/1a1a1a/ffffff?text=Director",
          country: "USA"
        },
        cast: [
          { name: "Tim Robbins", image: "https://via.placeholder.com/200x250/1a1a1a/ffffff?text=TR" },
          { name: "Morgan Freeman", image: "https://via.placeholder.com/200x250/1a1a1a/ffffff?text=MF" },
          { name: "Bob Gunton", image: "https://via.placeholder.com/200x250/1a1a1a/ffffff?text=BG" }
        ],
        reviews: [
          { name: "David Brown", location: "From USA", rating: 5, review: "A masterpiece of storytelling. One of the greatest films ever made." },
          { name: "Lisa Chen", location: "From Singapore", rating: 5, review: "Emotionally powerful and beautifully crafted. A true classic." }
        ]
      }, {
        title: "The Shawshank Redemption",
        description: "Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.",
        genre: "Horror",
        releaseYear: 1994,
        duration: 8520,
        thumbnailUrl: "https://m.media-amazon.com/images/M/MV5BNDE3ODcxYzMtY2YzZC00NmNlLWJiNDMtZDViZWM2MzIxZDYwXkEyXkFqcGdeQXVyNjAwNDUxODI@._V1_.jpg",
        videoUrl: "https://res.cloudinary.com/dxnxa5jgc/video/upload/v1766408547/ott-videos/bpnazhfe5uglwppqqgqw.mp4",
        publicId: "shawshank_redemption",
        isVisible: true,
        languages: ["English"],director: {
          name: "Frank Darabont",
          image: "https://via.placeholder.com/300x400/1a1a1a/ffffff?text=Director",
          country: "USA"
        },
        cast: [
          { name: "Tim Robbins", image: "https://via.placeholder.com/200x250/1a1a1a/ffffff?text=TR" },
          { name: "Morgan Freeman", image: "https://via.placeholder.com/200x250/1a1a1a/ffffff?text=MF" },
          { name: "Bob Gunton", image: "https://via.placeholder.com/200x250/1a1a1a/ffffff?text=BG" }
        ],
        reviews: [
          { name: "David Brown", location: "From USA", rating: 5, review: "A masterpiece of storytelling. One of the greatest films ever made." },
          { name: "Lisa Chen", location: "From Singapore", rating: 5, review: "Emotionally powerful and beautifully crafted. A true classic." }
        ]
      },
      // Drama Movies
      {
        title: "The Shawshank Redemption",
        description: "Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.",
        genre: "Horror",
        releaseYear: 1994,
        duration: 8520,
        thumbnailUrl: "https://m.media-amazon.com/images/M/MV5BNDE3ODcxYzMtY2YzZC00NmNlLWJiNDMtZDViZWM2MzIxZDYwXkEyXkFqcGdeQXVyNjAwNDUxODI@._V1_.jpg",
        videoUrl: "https://res.cloudinary.com/dxnxa5jgc/video/upload/v1766408547/ott-videos/bpnazhfe5uglwppqqgqw.mp4",
        publicId: "shawshank_redemption",
        isVisible: true,
        languages: ["English"],director: {
          name: "Frank Darabont",
          image: "https://via.placeholder.com/300x400/1a1a1a/ffffff?text=Director",
          country: "USA"
        },
        cast: [
          { name: "Tim Robbins", image: "https://via.placeholder.com/200x250/1a1a1a/ffffff?text=TR" },
          { name: "Morgan Freeman", image: "https://via.placeholder.com/200x250/1a1a1a/ffffff?text=MF" },
          { name: "Bob Gunton", image: "https://via.placeholder.com/200x250/1a1a1a/ffffff?text=BG" }
        ],
        reviews: [
          { name: "David Brown", location: "From USA", rating: 5, review: "A masterpiece of storytelling. One of the greatest films ever made." },
          { name: "Lisa Chen", location: "From Singapore", rating: 5, review: "Emotionally powerful and beautifully crafted. A true classic." }
        ]
      },
      // Romance Movies
      {
        title: "The Notebook",
        description: "A poor yet passionate young man falls in love with a rich young woman, giving her a sense of freedom, but they are soon separated because of their social differences.",
        genre: "Romance",
        releaseYear: 2004,
        duration: 7380,
        thumbnailUrl: "https://m.media-amazon.com/images/M/MV5BMTk3OTM5Njg5M15BMl5BanBnXkFtZTYwMzA0ODI3._V1_.jpg",
        videoUrl: "https://res.cloudinary.com/dxnxa5jgc/video/upload/v1766409574/ott-videos/mit7vfqyoj8sjrvxebez.mp4",
        publicId: "notebook",
        isVisible: true,
        languages: ["English"],director: {
          name: "Frank Darabont",
          image: "https://via.placeholder.com/300x400/1a1a1a/ffffff?text=Director",
          country: "USA"
        },
        cast: [
          { name: "Tim Robbins", image: "https://via.placeholder.com/200x250/1a1a1a/ffffff?text=TR" },
          { name: "Morgan Freeman", image: "https://via.placeholder.com/200x250/1a1a1a/ffffff?text=MF" },
          { name: "Bob Gunton", image: "https://via.placeholder.com/200x250/1a1a1a/ffffff?text=BG" }
        ],
        reviews: [
          { name: "David Brown", location: "From USA", rating: 5, review: "A masterpiece of storytelling. One of the greatest films ever made." },
          { name: "Lisa Chen", location: "From Singapore", rating: 5, review: "Emotionally powerful and beautifully crafted. A true classic." }
        ]
      },
      {
        title: "Titanic",
        description: "A seventeen-year-old aristocrat falls in love with a kind but poor artist aboard the luxurious, ill-fated R.M.S. Titanic.",
        genre: "Romance",
        releaseYear: 1997,
        duration: 11640,
        thumbnailUrl: "https://m.media-amazon.com/images/M/MV5BMDdmZGU3NDQtY2E5My00ZTliLWIzOTUtMTY4ZGI1YjdiNjk3XkEyXkFqcGdeQXVyNTA4NzY1MzY@._V1_.jpg",
        videoUrl: "https://res.cloudinary.com/dxnxa5jgc/video/upload/v1766409613/ott-videos/jjsxwnbjdbtvp76bwiwm.mp4",
        publicId: "titanic",
        isVisible: true,
        languages: ["English"],director: {
          name: "Frank Darabont",
          image: "https://via.placeholder.com/300x400/1a1a1a/ffffff?text=Director",
          country: "USA"
        },
        cast: [
          { name: "Tim Robbins", image: "https://via.placeholder.com/200x250/1a1a1a/ffffff?text=TR" },
          { name: "Morgan Freeman", image: "https://via.placeholder.com/200x250/1a1a1a/ffffff?text=MF" },
          { name: "Bob Gunton", image: "https://via.placeholder.com/200x250/1a1a1a/ffffff?text=BG" }
        ],
        reviews: [
          { name: "David Brown", location: "From USA", rating: 5, review: "A masterpiece of storytelling. One of the greatest films ever made." },
          { name: "Lisa Chen", location: "From Singapore", rating: 5, review: "Emotionally powerful and beautifully crafted. A true classic." }
        ]
      },{
        title: "Inception",
        description: "A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.",
        genre: "Romance",
        releaseYear: 2010,
        duration: 8880,
        thumbnailUrl: "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_.jpg",
        videoUrl: "https://res.cloudinary.com/dxnxa5jgc/video/upload/v1766408547/ott-videos/bpnazhfe5uglwppqqgqw.mp4",
        publicId: "inception",
        isVisible: true,
        languages: ["English"],director: {
          name: "Frank Darabont",
          image: "https://via.placeholder.com/300x400/1a1a1a/ffffff?text=Director",
          country: "USA"
        },
        cast: [
          { name: "Tim Robbins", image: "https://via.placeholder.com/200x250/1a1a1a/ffffff?text=TR" },
          { name: "Morgan Freeman", image: "https://via.placeholder.com/200x250/1a1a1a/ffffff?text=MF" },
          { name: "Bob Gunton", image: "https://via.placeholder.com/200x250/1a1a1a/ffffff?text=BG" }
        ],
        reviews: [
          { name: "David Brown", location: "From USA", rating: 5, review: "A masterpiece of storytelling. One of the greatest films ever made." },
          { name: "Lisa Chen", location: "From Singapore", rating: 5, review: "Emotionally powerful and beautifully crafted. A true classic." }
        ]
      },
      {
        title: "Interstellar",
        description: "A team of explorers travel through a wormhole in space in an attempt to ensure humanity's survival.",
        genre: "Romance",
        releaseYear: 2014,
        duration: 10140,
        thumbnailUrl: "https://m.media-amazon.com/images/M/MV5BZjdkOTU3MDktN2IxOS00OGEyLWFmMjktY2FiMmZkNWIyODZiXkEyXkFqcGdeQXVyMTMxODk2OTU@._V1_.jpg",
        videoUrl: "https://res.cloudinary.com/dxnxa5jgc/video/upload/v1766409574/ott-videos/mit7vfqyoj8sjrvxebez.mp4",
        publicId: "interstellar",
        isVisible: true,
        languages: ["English"],director: {
          name: "Frank Darabont",
          image: "https://via.placeholder.com/300x400/1a1a1a/ffffff?text=Director",
          country: "USA"
        },
        cast: [
          { name: "Tim Robbins", image: "https://via.placeholder.com/200x250/1a1a1a/ffffff?text=TR" },
          { name: "Morgan Freeman", image: "https://via.placeholder.com/200x250/1a1a1a/ffffff?text=MF" },
          { name: "Bob Gunton", image: "https://via.placeholder.com/200x250/1a1a1a/ffffff?text=BG" }
        ],
        reviews: [
          { name: "David Brown", location: "From USA", rating: 5, review: "A masterpiece of storytelling. One of the greatest films ever made." },
          { name: "Lisa Chen", location: "From Singapore", rating: 5, review: "Emotionally powerful and beautifully crafted. A true classic." }
        ]
      },
      // Sci-Fi Movies
      {
        title: "Inception",
        description: "A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.",
        genre: "Sci-Fi",
        releaseYear: 2010,
        duration: 8880,
        thumbnailUrl: "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_.jpg",
        videoUrl: "https://res.cloudinary.com/dxnxa5jgc/video/upload/v1766408547/ott-videos/bpnazhfe5uglwppqqgqw.mp4",
        publicId: "inception",
        isVisible: true,
        languages: ["English"],director: {
          name: "Frank Darabont",
          image: "https://via.placeholder.com/300x400/1a1a1a/ffffff?text=Director",
          country: "USA"
        },
        cast: [
          { name: "Tim Robbins", image: "https://via.placeholder.com/200x250/1a1a1a/ffffff?text=TR" },
          { name: "Morgan Freeman", image: "https://via.placeholder.com/200x250/1a1a1a/ffffff?text=MF" },
          { name: "Bob Gunton", image: "https://via.placeholder.com/200x250/1a1a1a/ffffff?text=BG" }
        ],
        reviews: [
          { name: "David Brown", location: "From USA", rating: 5, review: "A masterpiece of storytelling. One of the greatest films ever made." },
          { name: "Lisa Chen", location: "From Singapore", rating: 5, review: "Emotionally powerful and beautifully crafted. A true classic." }
        ]
      },
      {
        title: "Interstellar",
        description: "A team of explorers travel through a wormhole in space in an attempt to ensure humanity's survival.",
        genre: "Sci-Fi",
        releaseYear: 2014,
        duration: 10140,
        thumbnailUrl: "https://m.media-amazon.com/images/M/MV5BZjdkOTU3MDktN2IxOS00OGEyLWFmMjktY2FiMmZkNWIyODZiXkEyXkFqcGdeQXVyMTMxODk2OTU@._V1_.jpg",
        videoUrl: "https://res.cloudinary.com/dxnxa5jgc/video/upload/v1766409574/ott-videos/mit7vfqyoj8sjrvxebez.mp4",
        publicId: "interstellar",
        isVisible: true,
        languages: ["English"],director: {
          name: "Frank Darabont",
          image: "https://via.placeholder.com/300x400/1a1a1a/ffffff?text=Director",
          country: "USA"
        },
        cast: [
          { name: "Tim Robbins", image: "https://via.placeholder.com/200x250/1a1a1a/ffffff?text=TR" },
          { name: "Morgan Freeman", image: "https://via.placeholder.com/200x250/1a1a1a/ffffff?text=MF" },
          { name: "Bob Gunton", image: "https://via.placeholder.com/200x250/1a1a1a/ffffff?text=BG" }
        ],
        reviews: [
          { name: "David Brown", location: "From USA", rating: 5, review: "A masterpiece of storytelling. One of the greatest films ever made." },
          { name: "Lisa Chen", location: "From Singapore", rating: 5, review: "Emotionally powerful and beautifully crafted. A true classic." }
        ]
      },{
        title: "Inception",
        description: "A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.",
        genre: "Sci-Fi",
        releaseYear: 2010,
        duration: 8880,
        thumbnailUrl: "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_.jpg",
        videoUrl: "https://res.cloudinary.com/dxnxa5jgc/video/upload/v1766408547/ott-videos/bpnazhfe5uglwppqqgqw.mp4",
        publicId: "inception",
        isVisible: true,
        languages: ["English"],director: {
          name: "Frank Darabont",
          image: "https://via.placeholder.com/300x400/1a1a1a/ffffff?text=Director",
          country: "USA"
        },
        cast: [
          { name: "Tim Robbins", image: "https://via.placeholder.com/200x250/1a1a1a/ffffff?text=TR" },
          { name: "Morgan Freeman", image: "https://via.placeholder.com/200x250/1a1a1a/ffffff?text=MF" },
          { name: "Bob Gunton", image: "https://via.placeholder.com/200x250/1a1a1a/ffffff?text=BG" }
        ],
        reviews: [
          { name: "David Brown", location: "From USA", rating: 5, review: "A masterpiece of storytelling. One of the greatest films ever made." },
          { name: "Lisa Chen", location: "From Singapore", rating: 5, review: "Emotionally powerful and beautifully crafted. A true classic." }
        ]
      },
      {
        title: "Interstellar",
        description: "A team of explorers travel through a wormhole in space in an attempt to ensure humanity's survival.",
        genre: "Sci-Fi",
        releaseYear: 2014,
        duration: 10140,
        thumbnailUrl: "https://m.media-amazon.com/images/M/MV5BZjdkOTU3MDktN2IxOS00OGEyLWFmMjktY2FiMmZkNWIyODZiXkEyXkFqcGdeQXVyMTMxODk2OTU@._V1_.jpg",
        videoUrl: "https://res.cloudinary.com/dxnxa5jgc/video/upload/v1766409574/ott-videos/mit7vfqyoj8sjrvxebez.mp4",
        publicId: "interstellar",
        isVisible: true,
        languages: ["English"],director: {
          name: "Frank Darabont",
          image: "https://via.placeholder.com/300x400/1a1a1a/ffffff?text=Director",
          country: "USA"
        },
        cast: [
          { name: "Tim Robbins", image: "https://via.placeholder.com/200x250/1a1a1a/ffffff?text=TR" },
          { name: "Morgan Freeman", image: "https://via.placeholder.com/200x250/1a1a1a/ffffff?text=MF" },
          { name: "Bob Gunton", image: "https://via.placeholder.com/200x250/1a1a1a/ffffff?text=BG" }
        ],
        reviews: [
          { name: "David Brown", location: "From USA", rating: 5, review: "A masterpiece of storytelling. One of the greatest films ever made." },
          { name: "Lisa Chen", location: "From Singapore", rating: 5, review: "Emotionally powerful and beautifully crafted. A true classic." }
        ]
      },
      // Thriller Movies
      {
        title: "Gone Girl",
        description: "With his wife's disappearance having become the focus of an intense media circus, a man sees the spotlight turned on him when it's suspected that he may not be innocent.",
        genre: "Thriller",
        releaseYear: 2014,
        duration: 8940,
        thumbnailUrl: "https://m.media-amazon.com/images/M/MV5BMTk0MDQ3MzAzOV5BMl5BanBnXkFtZTgwNzU1NzE3MjE@._V1_.jpg",
        videoUrl: "https://res.cloudinary.com/dxnxa5jgc/video/upload/v1766409613/ott-videos/jjsxwnbjdbtvp76bwiwm.mp4",
        publicId: "gone_girl",
        isVisible: true,
        languages: ["English"],director: {
          name: "Frank Darabont",
          image: "https://via.placeholder.com/300x400/1a1a1a/ffffff?text=Director",
          country: "USA"
        },
        cast: [
          { name: "Tim Robbins", image: "https://via.placeholder.com/200x250/1a1a1a/ffffff?text=TR" },
          { name: "Morgan Freeman", image: "https://via.placeholder.com/200x250/1a1a1a/ffffff?text=MF" },
          { name: "Bob Gunton", image: "https://via.placeholder.com/200x250/1a1a1a/ffffff?text=BG" }
        ],
        reviews: [
          { name: "David Brown", location: "From USA", rating: 5, review: "A masterpiece of storytelling. One of the greatest films ever made." },
          { name: "Lisa Chen", location: "From Singapore", rating: 5, review: "Emotionally powerful and beautifully crafted. A true classic." }
        ]
      },
      {
        title: "Se7en",
        description: "Two detectives, a rookie and a veteran, hunt a serial killer who uses the seven deadly sins as his motives.",
        genre: "Thriller",
        releaseYear: 1995,
        duration: 7620,
        thumbnailUrl: "https://m.media-amazon.com/images/M/MV5BOTUwODM5MTctZjczMi00OTk4LTg3NWUtNmVhMTAzNTNjYjcyXkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_.jpg",
        videoUrl: "https://res.cloudinary.com/dxnxa5jgc/video/upload/v1766408547/ott-videos/bpnazhfe5uglwppqqgqw.mp4",
        publicId: "se7en",
        isVisible: true,
        languages: ["English"],director: {
          name: "Frank Darabont",
          image: "https://via.placeholder.com/300x400/1a1a1a/ffffff?text=Director",
          country: "USA"
        },
        cast: [
          { name: "Tim Robbins", image: "https://via.placeholder.com/200x250/1a1a1a/ffffff?text=TR" },
          { name: "Morgan Freeman", image: "https://via.placeholder.com/200x250/1a1a1a/ffffff?text=MF" },
          { name: "Bob Gunton", image: "https://via.placeholder.com/200x250/1a1a1a/ffffff?text=BG" }
        ],
        reviews: [
          { name: "David Brown", location: "From USA", rating: 5, review: "A masterpiece of storytelling. One of the greatest films ever made." },
          { name: "Lisa Chen", location: "From Singapore", rating: 5, review: "Emotionally powerful and beautifully crafted. A true classic." }
        ]
      },{
        title: "Inception",
        description: "A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.",
        genre: "Thriller",
        releaseYear: 2010,
        duration: 8880,
        thumbnailUrl: "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_.jpg",
        videoUrl: "https://res.cloudinary.com/dxnxa5jgc/video/upload/v1766408547/ott-videos/bpnazhfe5uglwppqqgqw.mp4",
        publicId: "inception",
        isVisible: true,
        languages: ["English"],director: {
          name: "Frank Darabont",
          image: "https://via.placeholder.com/300x400/1a1a1a/ffffff?text=Director",
          country: "USA"
        },
        cast: [
          { name: "Tim Robbins", image: "https://via.placeholder.com/200x250/1a1a1a/ffffff?text=TR" },
          { name: "Morgan Freeman", image: "https://via.placeholder.com/200x250/1a1a1a/ffffff?text=MF" },
          { name: "Bob Gunton", image: "https://via.placeholder.com/200x250/1a1a1a/ffffff?text=BG" }
        ],
        reviews: [
          { name: "David Brown", location: "From USA", rating: 5, review: "A masterpiece of storytelling. One of the greatest films ever made." },
          { name: "Lisa Chen", location: "From Singapore", rating: 5, review: "Emotionally powerful and beautifully crafted. A true classic." }
        ]
      },
      {
        title: "Interstellar",
        description: "A team of explorers travel through a wormhole in space in an attempt to ensure humanity's survival.",
        genre: "Thriller",
        releaseYear: 2014,
        duration: 10140,
        thumbnailUrl: "https://m.media-amazon.com/images/M/MV5BZjdkOTU3MDktN2IxOS00OGEyLWFmMjktY2FiMmZkNWIyODZiXkEyXkFqcGdeQXVyMTMxODk2OTU@._V1_.jpg",
        videoUrl: "https://res.cloudinary.com/dxnxa5jgc/video/upload/v1766409574/ott-videos/mit7vfqyoj8sjrvxebez.mp4",
        publicId: "interstellar",
        isVisible: true,
        languages: ["English"],director: {
          name: "Frank Darabont",
          image: "https://via.placeholder.com/300x400/1a1a1a/ffffff?text=Director",
          country: "USA"
        },
        cast: [
          { name: "Tim Robbins", image: "https://via.placeholder.com/200x250/1a1a1a/ffffff?text=TR" },
          { name: "Morgan Freeman", image: "https://via.placeholder.com/200x250/1a1a1a/ffffff?text=MF" },
          { name: "Bob Gunton", image: "https://via.placeholder.com/200x250/1a1a1a/ffffff?text=BG" }
        ],
        reviews: [
          { name: "David Brown", location: "From USA", rating: 5, review: "A masterpiece of storytelling. One of the greatest films ever made." },
          { name: "Lisa Chen", location: "From Singapore", rating: 5, review: "Emotionally powerful and beautifully crafted. A true classic." }
        ]
      },
      // Fantasy Movies
      {
        title: "The Lord of the Rings: The Fellowship of the Ring",
        description: "A meek Hobbit from the Shire and eight companions set out on a journey to destroy the powerful One Ring and save Middle-earth from the Dark Lord Sauron.",
        genre: "Fantasy",
        releaseYear: 2001,
        duration: 10680,
        thumbnailUrl: "https://m.media-amazon.com/images/M/MV5BN2EyZjM3NzUtNWUzMi00MTgxLWI0NTctMzY4M2VlOTdjZWRiXkEyXkFqcGdeQXVyNDUzOTQ5MjY@._V1_.jpg",
        videoUrl: "https://res.cloudinary.com/dxnxa5jgc/video/upload/v1766409574/ott-videos/mit7vfqyoj8sjrvxebez.mp4",
        publicId: "lotr_fellowship",
        isVisible: true,
        languages: ["English"],director: {
          name: "Frank Darabont",
          image: "https://via.placeholder.com/300x400/1a1a1a/ffffff?text=Director",
          country: "USA"
        },
        cast: [
          { name: "Tim Robbins", image: "https://via.placeholder.com/200x250/1a1a1a/ffffff?text=TR" },
          { name: "Morgan Freeman", image: "https://via.placeholder.com/200x250/1a1a1a/ffffff?text=MF" },
          { name: "Bob Gunton", image: "https://via.placeholder.com/200x250/1a1a1a/ffffff?text=BG" }
        ],
        reviews: [
          { name: "David Brown", location: "From USA", rating: 5, review: "A masterpiece of storytelling. One of the greatest films ever made." },
          { name: "Lisa Chen", location: "From Singapore", rating: 5, review: "Emotionally powerful and beautifully crafted. A true classic." }
        ]
      },
      {
        title: "Harry Potter and the Philosopher's Stone",
        description: "An orphaned boy enrolls in a school of wizardry, where he learns the truth about himself, his family and the terrible evil that haunts the magical world.",
        genre: "Fantasy",
        releaseYear: 2001,
        duration: 9120,
        thumbnailUrl: "https://m.media-amazon.com/images/M/MV5BNjQ3NWNlNmQtMTE5ZS00MDdmLTlkZjUtZTBlM2UxMGFiMTU3XkEyXkFqcGdeQXVyNjUwNzk3NDc@._V1_.jpg",
        videoUrl: "https://res.cloudinary.com/dxnxa5jgc/video/upload/v1766409613/ott-videos/jjsxwnbjdbtvp76bwiwm.mp4",
        publicId: "harry_potter_1",
        isVisible: true,
        languages: ["English"],director: {
          name: "Frank Darabont",
          image: "https://via.placeholder.com/300x400/1a1a1a/ffffff?text=Director",
          country: "USA"
        },
        cast: [
          { name: "Tim Robbins", image: "https://via.placeholder.com/200x250/1a1a1a/ffffff?text=TR" },
          { name: "Morgan Freeman", image: "https://via.placeholder.com/200x250/1a1a1a/ffffff?text=MF" },
          { name: "Bob Gunton", image: "https://via.placeholder.com/200x250/1a1a1a/ffffff?text=BG" }
        ],
        reviews: [
          { name: "David Brown", location: "From USA", rating: 5, review: "A masterpiece of storytelling. One of the greatest films ever made." },
          { name: "Lisa Chen", location: "From Singapore", rating: 5, review: "Emotionally powerful and beautifully crafted. A true classic." }
        ]
      },{
        title: "The Lord of the Rings: The Fellowship of the Ring",
        description: "A meek Hobbit from the Shire and eight companions set out on a journey to destroy the powerful One Ring and save Middle-earth from the Dark Lord Sauron.",
        genre: "Fantasy",
        releaseYear: 2001,
        duration: 10680,
        thumbnailUrl: "https://m.media-amazon.com/images/M/MV5BN2EyZjM3NzUtNWUzMi00MTgxLWI0NTctMzY4M2VlOTdjZWRiXkEyXkFqcGdeQXVyNDUzOTQ5MjY@._V1_.jpg",
        videoUrl: "https://res.cloudinary.com/dxnxa5jgc/video/upload/v1766409574/ott-videos/mit7vfqyoj8sjrvxebez.mp4",
        publicId: "lotr_fellowship",
        isVisible: true,
        languages: ["English"],director: {
          name: "Frank Darabont",
          image: "https://via.placeholder.com/300x400/1a1a1a/ffffff?text=Director",
          country: "USA"
        },
        cast: [
          { name: "Tim Robbins", image: "https://via.placeholder.com/200x250/1a1a1a/ffffff?text=TR" },
          { name: "Morgan Freeman", image: "https://via.placeholder.com/200x250/1a1a1a/ffffff?text=MF" },
          { name: "Bob Gunton", image: "https://via.placeholder.com/200x250/1a1a1a/ffffff?text=BG" }
        ],
        reviews: [
          { name: "David Brown", location: "From USA", rating: 5, review: "A masterpiece of storytelling. One of the greatest films ever made." },
          { name: "Lisa Chen", location: "From Singapore", rating: 5, review: "Emotionally powerful and beautifully crafted. A true classic." }
        ]
      },
      {
        title: "Harry Potter and the Philosopher's Stone",
        description: "An orphaned boy enrolls in a school of wizardry, where he learns the truth about himself, his family and the terrible evil that haunts the magical world.",
        genre: "Fantasy",
        releaseYear: 2001,
        duration: 9120,
        thumbnailUrl: "https://m.media-amazon.com/images/M/MV5BNjQ3NWNlNmQtMTE5ZS00MDdmLTlkZjUtZTBlM2UxMGFiMTU3XkEyXkFqcGdeQXVyNjUwNzk3NDc@._V1_.jpg",
        videoUrl: "https://res.cloudinary.com/dxnxa5jgc/video/upload/v1766409613/ott-videos/jjsxwnbjdbtvp76bwiwm.mp4",
        publicId: "harry_potter_1",
        isVisible: true,
        languages: ["English"],director: {
          name: "Frank Darabont",
          image: "https://via.placeholder.com/300x400/1a1a1a/ffffff?text=Director",
          country: "USA"
        },
        cast: [
          { name: "Tim Robbins", image: "https://via.placeholder.com/200x250/1a1a1a/ffffff?text=TR" },
          { name: "Morgan Freeman", image: "https://via.placeholder.com/200x250/1a1a1a/ffffff?text=MF" },
          { name: "Bob Gunton", image: "https://via.placeholder.com/200x250/1a1a1a/ffffff?text=BG" }
        ],
        reviews: [
          { name: "David Brown", location: "From USA", rating: 5, review: "A masterpiece of storytelling. One of the greatest films ever made." },
          { name: "Lisa Chen", location: "From Singapore", rating: 5, review: "Emotionally powerful and beautifully crafted. A true classic." }
        ]
      },
      // Animation Movies
      {
        title: "Toy Story",
        description: "A cowboy doll is profoundly threatened and jealous when a new spaceman figure supplants him as top toy in a boy's room.",
        genre: "Animation",
        releaseYear: 1995,
        duration: 4860,
        thumbnailUrl: "https://m.media-amazon.com/images/M/MV5BMDU2ZWJlMjktMTRhMy00ZTA5LWEzNDgtYmNmZTEwZTViZWJkXkEyXkFqcGdeQXVyNDQ2OTk4MzI@._V1_.jpg",
        videoUrl: "https://res.cloudinary.com/dxnxa5jgc/video/upload/v1766408547/ott-videos/bpnazhfe5uglwppqqgqw.mp4",
        publicId: "toy_story",
        isVisible: true,
        languages: ["English"],director: {
          name: "Frank Darabont",
          image: "https://via.placeholder.com/300x400/1a1a1a/ffffff?text=Director",
          country: "USA"
        },
        cast: [
          { name: "Tim Robbins", image: "https://via.placeholder.com/200x250/1a1a1a/ffffff?text=TR" },
          { name: "Morgan Freeman", image: "https://via.placeholder.com/200x250/1a1a1a/ffffff?text=MF" },
          { name: "Bob Gunton", image: "https://via.placeholder.com/200x250/1a1a1a/ffffff?text=BG" }
        ],
        reviews: [
          { name: "David Brown", location: "From USA", rating: 5, review: "A masterpiece of storytelling. One of the greatest films ever made." },
          { name: "Lisa Chen", location: "From Singapore", rating: 5, review: "Emotionally powerful and beautifully crafted. A true classic." }
        ]
      },{
        title: "The Lord of the Rings: The Fellowship of the Ring",
        description: "A meek Hobbit from the Shire and eight companions set out on a journey to destroy the powerful One Ring and save Middle-earth from the Dark Lord Sauron.",
        genre: "Animation",
        releaseYear: 2001,
        duration: 10680,
        thumbnailUrl: "https://m.media-amazon.com/images/M/MV5BN2EyZjM3NzUtNWUzMi00MTgxLWI0NTctMzY4M2VlOTdjZWRiXkEyXkFqcGdeQXVyNDUzOTQ5MjY@._V1_.jpg",
        videoUrl: "https://res.cloudinary.com/dxnxa5jgc/video/upload/v1766409574/ott-videos/mit7vfqyoj8sjrvxebez.mp4",
        publicId: "lotr_fellowship",
        isVisible: true,
        languages: ["English"],director: {
          name: "Frank Darabont",
          image: "https://via.placeholder.com/300x400/1a1a1a/ffffff?text=Director",
          country: "USA"
        },
        cast: [
          { name: "Tim Robbins", image: "https://via.placeholder.com/200x250/1a1a1a/ffffff?text=TR" },
          { name: "Morgan Freeman", image: "https://via.placeholder.com/200x250/1a1a1a/ffffff?text=MF" },
          { name: "Bob Gunton", image: "https://via.placeholder.com/200x250/1a1a1a/ffffff?text=BG" }
        ],
        reviews: [
          { name: "David Brown", location: "From USA", rating: 5, review: "A masterpiece of storytelling. One of the greatest films ever made." },
          { name: "Lisa Chen", location: "From Singapore", rating: 5, review: "Emotionally powerful and beautifully crafted. A true classic." }
        ]
      },
      {
        title: "Harry Potter and the Philosopher's Stone",
        description: "An orphaned boy enrolls in a school of wizardry, where he learns the truth about himself, his family and the terrible evil that haunts the magical world.",
        genre: "Animation",
        releaseYear: 2001,
        duration: 9120,
        thumbnailUrl: "https://m.media-amazon.com/images/M/MV5BNjQ3NWNlNmQtMTE5ZS00MDdmLTlkZjUtZTBlM2UxMGFiMTU3XkEyXkFqcGdeQXVyNjUwNzk3NDc@._V1_.jpg",
        videoUrl: "https://res.cloudinary.com/dxnxa5jgc/video/upload/v1766409613/ott-videos/jjsxwnbjdbtvp76bwiwm.mp4",
        publicId: "harry_potter_1",
        isVisible: true,
        languages: ["English"],director: {
          name: "Frank Darabont",
          image: "https://via.placeholder.com/300x400/1a1a1a/ffffff?text=Director",
          country: "USA"
        },
        cast: [
          { name: "Tim Robbins", image: "https://via.placeholder.com/200x250/1a1a1a/ffffff?text=TR" },
          { name: "Morgan Freeman", image: "https://via.placeholder.com/200x250/1a1a1a/ffffff?text=MF" },
          { name: "Bob Gunton", image: "https://via.placeholder.com/200x250/1a1a1a/ffffff?text=BG" }
        ],
        reviews: [
          { name: "David Brown", location: "From USA", rating: 5, review: "A masterpiece of storytelling. One of the greatest films ever made." },
          { name: "Lisa Chen", location: "From Singapore", rating: 5, review: "Emotionally powerful and beautifully crafted. A true classic." }
        ]
      },
      {
        title: "Finding Nemo",
        description: "After his son is captured in the Great Barrier Reef and taken to Sydney, a timid clownfish sets out on a journey to bring him home.",
        genre: "Animation",
        releaseYear: 2003,
        duration: 6000,
        thumbnailUrl: "https://m.media-amazon.com/images/M/MV5BZjMxYzc4MzEtZDkwNy00M2Q5LWE3MjYtZWNmYmNhMjAyYTU4XkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_.jpg",
        videoUrl: "https://res.cloudinary.com/dxnxa5jgc/video/upload/v1766409574/ott-videos/mit7vfqyoj8sjrvxebez.mp4",
        publicId: "finding_nemo",
        isVisible: true,
        languages: ["English"],director: {
          name: "Frank Darabont",
          image: "https://via.placeholder.com/300x400/1a1a1a/ffffff?text=Director",
          country: "USA"
        },
        cast: [
          { name: "Tim Robbins", image: "https://via.placeholder.com/200x250/1a1a1a/ffffff?text=TR" },
          { name: "Morgan Freeman", image: "https://via.placeholder.com/200x250/1a1a1a/ffffff?text=MF" },
          { name: "Bob Gunton", image: "https://via.placeholder.com/200x250/1a1a1a/ffffff?text=BG" }
        ],
        reviews: [
          { name: "David Brown", location: "From USA", rating: 5, review: "A masterpiece of storytelling. One of the greatest films ever made." },
          { name: "Lisa Chen", location: "From Singapore", rating: 5, review: "Emotionally powerful and beautifully crafted. A true classic." }
        ]
      },
      
    ];

    const createdVideos = await Video.insertMany(videos);
    console.log(`Created ${createdVideos.length} videos`);

    console.log("Seed data created successfully!");
    console.log("\nLogin credentials:");
    console.log("Admin: admin@streamflix.com / admin123");
    console.log("User: user@streamflix.com / user123");
    
  } catch (error) {
    console.error("Error seeding data:", error);
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB");
  }
};

seedData();