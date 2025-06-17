# 🌾 **Tariffarm**

![Tariffarm Banner](https://via.placeholder.com/1000x200.png?text=Tariffarm+Global+Trade+Dashboard)

**Tariffarm: A powerful tool for visualizing agricultural trade tariffs, costs, and routes with interactive 3D maps.**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)  
[![Built with Flask](https://img.shields.io/badge/Built%20With-Flask-blue)]()  
[![Built with React](https://img.shields.io/badge/Built%20With-React-61DAFB)]()  
[![Deployed on Vercel](https://img.shields.io/badge/Deploy-Vercel-black)]()

---

## 🚀 **What is Tariffarm?**
Tariffarm is a web-based platform designed to provide clarity and insight for agricultural trade.  
It helps smallholder farmers, exporters, and traders to:

- 📦 Calculate **applicable tariffs, duties, and regulatory fees**
- 🛳 Discover **optimal shipping routes** (land, sea, air)
- 🗺 Visualize **ports, customs points, logistics hubs**
- 💸 Estimate **total cost** and **delivery time**
- 📊 See **detailed cost breakdowns** for freight, handling, permits, customs

---

## ✨ **Key Features**
✅ **Secure login with Auth0**  
✅ **Protected/private API endpoints**  
✅ **Interactive 3D globe (amCharts)**  
✅ **Dynamic node coloring & selection**  
✅ **Animated trade routes with airplane icons**  
✅ **City-level and country-level mapping**

---

## 🎥 **Demo Video**
👉 [Watch on YouTube](https://www.youtube.com/watch?v=bZZq8BTu3Vk)

[![Tariffarm Demo](https://img.youtube.com/vi/bZZq8BTu3Vk/0.jpg)](https://www.youtube.com/watch?v=bZZq8BTu3Vk)

---

## 🖼 **Screenshots**

### 🌐 Global Dashboard View
![Global Dashboard](https://via.placeholder.com/800x400.png?text=Global+Dashboard+Screenshot)

### 📊 Trade Route Data Table
![Data Table](https://via.placeholder.com/800x400.png?text=Data+Table+Screenshot)

### 🛫 Animated Route Visualization
![Route Animation](https://via.placeholder.com/800x400.png?text=Route+Animation+Screenshot)

> _Tip: Replace the placeholder links above with actual screenshots of your app for maximum impact._

---

## 🛠 **Tech Stack**
| Technology | Purpose |
|------------|---------|
| **Python (Flask)** | Backend API + Auth0 integration |
| **React + Next.js** | Dynamic frontend UI |
| **amCharts 5** | 3D map & globe visualizations |
| **Tailwind CSS** | Responsive styling |
| **Vercel** | Deployment |
| **Auth0** | Authentication |
| **Gemini AI** | Logic augmentation |

---

## ⚡ **New Features**
- 🌟 Dynamic **city node highlighting** on 3D globe
- 🌟 Animated arrows with **custom airplane SVGs**
- 🌟 Final result button triggers backend **cost calculation**
- 🌟 Expanded city/country support (50+ nodes)
- 🌟 Improved **zoom and rotation controls**

---

## ⚙ **How to Run Locally**
```bash
# Backend
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
flask run

# Frontend
cd frontend
npm install
npm run dev
