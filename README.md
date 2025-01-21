# Social Media Bot

A simple automation tool for managing social media accounts and scheduling posts across multiple platforms.

## Features

- **Multi-platform Support**: Manage Twitter, Instagram, and Facebook accounts
- **Post Scheduling**: Schedule posts for automatic publishing
- **Web Dashboard**: Easy-to-use web interface for managing accounts and posts
- **Automated Posting**: Background scheduler that posts content at scheduled times
- **Account Management**: Add and manage multiple social media accounts

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm

### Installation

1. Clone the repository:
```bash
git clone https://github.com/JessicaGarciaz/SocialMediaBot.git
cd SocialMediaBot
```

2. Install dependencies:
```bash
npm install
```

3. Start the application:
```bash
npm start
```

4. For development with auto-restart:
```bash
npm run dev
```

## Usage

1. Open your browser and navigate to `http://localhost:3000`
2. Add your social media accounts using the web interface
3. Create and schedule posts
4. The automated scheduler will handle posting at the specified times

## API Endpoints

### Accounts
- `GET /api/accounts` - Get all accounts
- `POST /api/accounts` - Create new account

### Posts
- `GET /api/posts` - Get all posts
- `POST /api/posts` - Create new post
- `PUT /api/posts/:id/status` - Update post status

### Scheduler
- `GET /api/scheduler/status` - Get scheduler status
- `POST /api/scheduler/start` - Start scheduler
- `POST /api/scheduler/stop` - Stop scheduler

## Database Schema

The application uses SQLite with the following tables:

- **accounts**: Social media account information
- **posts**: Post content and scheduling information

## Contributing

This is a personal project, but feel free to fork and modify as needed.

## License

MIT License