const express = require("express");
const mongoose = require("mongoose");
const app = express();

app.use(express.json());

// 🔹 MongoDB Cloud Connection (MongoDB Atlas Free)
const MONGO_URL = "mongodb+srv://bharat:bharat123@cluster.mongodb.net/bharat_db?retryWrites=true&w=majority";

mongoose.connect(MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log("✅ Cloud MongoDB Connected!")).catch(err => console.log("❌ DB Error:", err));

// 🔹 User Schema
const userSchema = new mongoose.Schema({
  username: { type: String, unique: true, required: true },
  password: String,
  email: String,
  createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model("User", userSchema);

// 🔹 Simple HTML UI with Beautiful Design
app.get("/", (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        * { margin: 0; padding: 0; }
        body {
          font-family: Arial, sans-serif;
          height: 100vh;
          display: flex;
          justify-content: center;
          align-items: center;
          background: linear-gradient(45deg, #667eea, #764ba2, #f093fb, #4facfe);
          background-size: 400% 400%;
          animation: gradient 15s ease infinite;
          position: relative;
          overflow: hidden;
        }
        @keyframes gradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .container {
          background: white;
          padding: 40px;
          border-radius: 15px;
          box-shadow: 0 20px 60px rgba(0,0,0,0.3);
          max-width: 400px;
          width: 90%;
          position: relative;
          z-index: 10;
        }
        h2 { text-align: center; color: #333; margin-bottom: 30px; }
        input {
          width: 100%;
          padding: 12px;
          margin: 10px 0;
          border: 2px solid #ddd;
          border-radius: 8px;
          font-size: 16px;
          box-sizing: border-box;
          transition: border-color 0.3s;
        }
        input:focus {
          outline: none;
          border-color: #667eea;
        }
        button {
          width: 48%;
          padding: 12px;
          margin: 15px 1%;
          background: #667eea;
          color: white;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          font-weight: bold;
          font-size: 16px;
          transition: background 0.3s;
        }
        button:hover { background: #764ba2; }
        .button-group { display: flex; justify-content: space-between; }
        .info {
          margin-top: 20px;
          padding: 15px;
          background: #f0f0f0;
          border-radius: 8px;
          text-align: center;
          font-size: 14px;
          min-height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <h2>🚀 भारत SecureNet</h2>
        
        <input id="u" placeholder="Username" required>
        <input id="e" placeholder="Email (optional)">
        <input id="p" type="password" placeholder="Password" required>
        
        <div class="button-group">
          <button onclick="signup()">✍️ Signup</button>
          <button onclick="login()">🔐 Login</button>
        </div>
        
        <div class="info" id="info">Ready! 👍</div>
      </div>

      <script>
      async function signup(){
        let username = document.getElementById("u").value;
        let email = document.getElementById("e").value;
        let password = document.getElementById("p").value;
        let info = document.getElementById("info");
        
        if(!username || !password) {
          info.innerHTML = "❌ Username और Password भरो!";
          return;
        }
        
        info.innerHTML = "⏳ Processing...";
        
        try {
          let res = await fetch("/register", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({username, email, password})
          });
          
          let data = await res.json();
          if(data.success) {
            info.innerHTML = "✅ Signup Complete! अब Login करो";
            document.getElementById("u").value = "";
            document.getElementById("e").value = "";
            document.getElementById("p").value = "";
          } else {
            info.innerHTML = "❌ " + (data.message || "Error occurred");
          }
        } catch(error) {
          info.innerHTML = "❌ Connection Error: " + error.message;
        }
      }

      async function login(){
        let username = document.getElementById("u").value;
        let password = document.getElementById("p").value;
        let info = document.getElementById("info");
        
        if(!username || !password) {
          info.innerHTML = "❌ Username और Password भरो!";
          return;
        }
        
        info.innerHTML = "⏳ Checking...";
        
        try {
          let res = await fetch("/login", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({username, password})
          });
          
          let data = await res.json();
          if(data.success) {
            info.innerHTML = "🚀 Login Success! स्वागत है " + username;
          } else {
            info.innerHTML = "❌ Username या Password गलत है!";
          }
        } catch(error) {
          info.innerHTML = "❌ Connection Error: " + error.message;
        }
      }
      </script>
    </body>
    </html>
  `);
});

// Signup
app.post("/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;
    
    // Check if user exists
    const existingUser = await User.findOne({ username });
    if(existingUser) {
      return res.json({ success: false, message: "Username पहले से मौजूद है!" });
    }
    
    // Create new user
    const newUser = new User({ username, email, password });
    await newUser.save();
    
    res.json({ success: true, message: "User registered successfully" });
  } catch(err) {
    res.json({ success: false, message: "Error: " + err.message });
  }
});

// Login
app.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    
    const user = await User.findOne({ username, password });
    
    res.json({ success: !!user });
  } catch(err) {
    res.json({ success: false });
  }
});

// Start
const PORT = 3000;
app.listen(PORT, () => {
  console.log("🚀 Server Ready!");
  console.log(`👉 Open: http://localhost:${PORT}`);
});
