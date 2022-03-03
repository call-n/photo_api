# This is a overview of the application

app.js
└── /routes/index.js
    ├── user.js
    │   ├── /controllers/user_controller.js
    │   ├── /models/User.js
    │   └── /validation/user.js
    │
    └── /middleware/auth.js .Goes thru auth to get futher
        │
        ├── album.js
        │   ├── /controllers/album_controller.js
        │   ├── /models/Album.js
        │   ├── /models/AlbumPhotos.js
        │   └── /validation/album.js
        └── photo.js
            ├── /controllers/photo_controller.js
            ├── /models/Photo.js
            └── /validation/photo.js
