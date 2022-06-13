<h1 align="center">Welcome to Youtube Downloader 👋</h1>
<p>
  <a href="#" target="_blank">
    <img alt="License: MIT" src="https://img.shields.io/badge/License-MIT-yellow.svg" />
  </a>
</p>

> A simple webapp that uses yt-dlp to download youtube videos.  
> This application is designed for personal backups or anything that falls under fair use!  
> Do not use this to download anything that might infinge on copyrights.

### ✨ [Demo](https://ytdl.derock.dev)

## Quickstart via docker

```sh
docker run -p 8080:8080 derockdev/youtubedownloader
```

And your done!  
You can view the site at http://127.0.0.1:8080

## Install

```sh
# Clone this repo
git clone https://github.com/ItzDerock/youtube-downloader-website

# Go inside the files
cd youtube-downloader-website

# Install dependencies
npm install
```

## Development Usage

```sh
npm run dev
```

## Build for production
```sh
# Build
npm run build

# Run prod code
npm run start
```

## Configuration

The application can be configured using environment variables.

The backend environment variables can be set at runtime (in docker, with `-e KEY=VALUE`) or by editing `./backend/.env`.

| Key                   | Description                           | Default                                 |
|-----------------------|---------------------------------------|-----------------------------------------|
| `PORT`                | The port to listen on.                | 8080                                    |
| `HOST`                | The IP to listen on.                  | 0.0.0.0                                 |
| `FRONTEND_PATH`       | The location of the frontend files.   | (relative to backend) ../frontend/build |
| `LOG_LEVEL`           | The level to log.                     | info (prod) or debug (dev)              |
| `NO_LOGS`             | Disables saving logs to file.         | false                                   |
| `MAX_DOWNLOAD_LENGTH` | Max video length. (-1 to disable)     | -1                                      |
| `TEMP_DIR`            | Where temporary files will be stored. | `os.tmpdir()`                           |

For frontend, there are two env files.
- `./frontend/.env` is global (dev and prod)
- `./frontend/.env.local` is for development only
Upon changing, you will need to rebuild the frontend.

| Key                 | Description                                                                  | Default (dev)         | Default (prod) |
|---------------------|------------------------------------------------------------------------------|-----------------------|----------------|
| `REACT_APP_API_URL` | API URL. Set to nothing for same location as where the frontend is served. | http://localhost:8080 | nothing        |

## Author

👤 **Derock**

* Website: https://derock.dev
* Github: [@ItzDerock](https://github.com/ItzDerock)

## 🤝 Contributing

Contributions, issues and feature requests are welcome!<br />Feel free to check [issues page](https://github.com/ItzDerock/youtube-downloader-website/issues). 

## Show your support

Give a ⭐️ if this project helped you!

***
_This README was generated with ❤️ by [readme-md-generator](https://github.com/kefranabg/readme-md-generator)_
