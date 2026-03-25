# 🔍 Deal Detector

> **Smart Price Tracking & Deal Aggregation Platform**

Deal Detector is a full-stack system that tracks product prices across multiple e-commerce websites, stores historical pricing data, and alerts users when prices drop below their target thresholds.

![Node.js](https://img.shields.io/badge/Node.js-18+-339933?logo=node.js&logoColor=white)
![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-6+-47A248?logo=mongodb&logoColor=white)
![Python](https://img.shields.io/badge/Python-3.9+-3776AB?logo=python&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-yellow)

---

## ✨ Features

- **Multi-Site Price Scraping** — Automated scraping from Amazon, Flipkart, eBay, and more using Python (BeautifulSoup + Selenium)
- **Price History Tracking** — Records and visualizes price changes over time with interactive charts
- **Price Drop Alerts** — Set custom alerts and get notified when prices hit your target
- **JWT Authentication** — Secure user registration and login with token-based auth
- **Product Search & Filtering** — Full-text search with category, source, and price range filters
- **Top Deals Discovery** — Aggregation pipeline to surface the biggest discounts
- **User Dashboard** — Track products, manage alerts, and view savings
- **Responsive UI** — Dark-themed React frontend with modern design
- **Rate Limiting** — Tiered rate limiting for API, auth, and scraper routes
- **RESTful API** — 15+ well-structured API endpoints following MVC architecture

---

## 🛠️ Tech Stack

| Layer     | Technology                          |
| --------- | ----------------------------------- |
| Backend   | Node.js, Express.js                 |
| Frontend  | React.js 18, React Router v6        |
| Database  | MongoDB, Mongoose ODM               |
| Scraper   | Python 3, BeautifulSoup, Selenium   |
| Auth      | JWT (jsonwebtoken), bcryptjs         |
| Charts    | Chart.js, react-chartjs-2           |
| Styling   | Vanilla CSS (dark theme)            |
| Security  | Helmet, CORS, express-rate-limit    |

---

## 📁 Project Structure

```
deal-detector/
├── backend/
│   ├── config/
│   │   ├── db.js                  # MongoDB connection
│   │   └── keys.js                # Environment config
│   ├── controllers/
│   │   ├── productController.js   # Product CRUD + search
│   │   ├── userController.js      # Auth + profile
│   │   ├── alertController.js     # Price alert management
│   │   └── categoryController.js  # Category CRUD
│   ├── middleware/
│   │   ├── auth.js                # JWT verification + role-based access
│   │   ├── errorHandler.js        # Global error handler
│   │   └── rateLimiter.js         # API rate limiting
│   ├── models/
│   │   ├── Product.js             # Product schema + price history
│   │   ├── User.js                # User schema + password hashing
│   │   ├── PriceAlert.js          # Alert schema
│   │   └── Category.js            # Category schema
│   ├── routes/
│   │   ├── productRoutes.js
│   │   ├── userRoutes.js
│   │   ├── alertRoutes.js
│   │   └── categoryRoutes.js
│   ├── utils/
│   │   └── helpers.js             # Shared utility functions
│   ├── server.js                  # Express app entry point
│   ├── package.json
│   └── .env.example
├── frontend/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.js          # Navigation bar
│   │   │   ├── ProductCard.js     # Product display card
│   │   │   ├── SearchBar.js       # Debounced search
│   │   │   ├── PriceChart.js      # Chart.js price history
│   │   │   ├── FilterPanel.js     # Sidebar filters
│   │   │   ├── AlertBadge.js      # Alert status badge
│   │   │   ├── Footer.js          # Page footer
│   │   │   └── Loader.js          # Loading spinner
│   │   ├── pages/
│   │   │   ├── Home.js            # Product listing + deals
│   │   │   ├── ProductDetail.js   # Single product view
│   │   │   ├── Login.js           # Login form
│   │   │   ├── Register.js        # Registration form
│   │   │   ├── Dashboard.js       # User dashboard
│   │   │   └── Alerts.js          # Alert management
│   │   ├── services/
│   │   │   ├── api.js             # Axios instance + interceptors
│   │   │   ├── authService.js     # Auth API calls
│   │   │   └── productService.js  # Product API calls
│   │   ├── App.js                 # Root component + routing
│   │   ├── App.css                # Global styles
│   │   └── index.js               # React entry point
│   └── package.json
├── scraper/
│   ├── scraper.py                 # Python web scraper
│   └── requirements.txt
├── .gitignore
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18+
- **MongoDB** 6+ (local or Atlas)
- **Python** 3.9+
- **Chrome/Chromium** (for Selenium)

### Backend Setup

```bash
cd backend
cp .env.example .env         # Configure your environment variables
npm install
npm run dev                  # Starts server on port 5000
```

### Frontend Setup

```bash
cd frontend
npm install
npm start                    # Starts React dev server on port 3000
```

### Scraper Setup

```bash
cd scraper
pip install -r requirements.txt
python scraper.py
```

---

## 📡 API Endpoints

### Authentication

| Method | Endpoint               | Description           | Access  |
| ------ | ---------------------- | --------------------- | ------- |
| POST   | `/api/users/register`  | Register new user     | Public  |
| POST   | `/api/users/login`     | Login & get JWT token | Public  |
| GET    | `/api/users/me`        | Get user profile      | Private |
| PUT    | `/api/users/me`        | Update profile        | Private |

### Products

| Method | Endpoint                          | Description              | Access  |
| ------ | --------------------------------- | ------------------------ | ------- |
| GET    | `/api/products`                   | List all products        | Public  |
| GET    | `/api/products/:id`               | Get product by ID        | Public  |
| POST   | `/api/products`                   | Create product           | Private |
| PUT    | `/api/products/:id`               | Update product           | Private |
| DELETE | `/api/products/:id`               | Delete product           | Admin   |
| GET    | `/api/products/:id/price-history` | Get price history        | Public  |
| GET    | `/api/products/deals/top`         | Get top deals            | Public  |

### Alerts

| Method | Endpoint             | Description              | Access  |
| ------ | -------------------- | ------------------------ | ------- |
| GET    | `/api/alerts`        | Get user's alerts        | Private |
| POST   | `/api/alerts`        | Create price alert       | Private |
| PUT    | `/api/alerts/:id`    | Update alert             | Private |
| DELETE | `/api/alerts/:id`    | Delete alert             | Private |
| POST   | `/api/alerts/check`  | Trigger alert check      | Admin   |

### Tracking

| Method | Endpoint                       | Description            | Access  |
| ------ | ------------------------------ | ---------------------- | ------- |
| POST   | `/api/users/track/:productId`  | Track a product        | Private |
| DELETE | `/api/users/track/:productId`  | Untrack a product      | Private |

### Categories

| Method | Endpoint               | Description          | Access  |
| ------ | ---------------------- | -------------------- | ------- |
| GET    | `/api/categories`      | List all categories  | Public  |
| POST   | `/api/categories`      | Create category      | Admin   |
| PUT    | `/api/categories/:id`  | Update category      | Admin   |
| DELETE | `/api/categories/:id`  | Delete category      | Admin   |

### Health Check

| Method | Endpoint       | Description       | Access |
| ------ | -------------- | ----------------- | ------ |
| GET    | `/api/health`  | API health check  | Public |

---

## 🔒 Environment Variables

Create a `.env` file in the `backend/` directory:

```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://localhost:27017/deal-detector
JWT_SECRET=your-secret-key
JWT_EXPIRATION=7d
CLIENT_URL=http://localhost:3000
```

---

## 🧪 Running Tests

```bash
# Backend tests
cd backend
npm test

# Frontend tests
cd frontend
npm test
```

---

## 📝 License

This project is licensed under the **MIT License**.

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request
