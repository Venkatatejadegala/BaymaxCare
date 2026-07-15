# 🚀 Setup Instructions for BaymaxCare

## Step-by-Step Guide to Run on Any Laptop

### Step 1: Install Node.js
1. Go to [nodejs.org](https://nodejs.org/)
2. Download and install **Node.js 18 or higher** (LTS version recommended)
3. Verify installation by opening terminal/command prompt:
   ```bash
   node --version
   npm --version
   ```
   You should see version numbers if installation was successful.

### Step 2: Get the Project Files
1. Copy the entire `Baymax-health-assistant-main` folder to the new laptop
2. Open terminal/command prompt in the project folder

### Step 3: Install Dependencies
1. In the project folder, run:
   ```bash
   npm install
   ```
2. Wait for installation to complete (this may take a few minutes)

### Step 4: Get Google Gemini API Key
1. Go to [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Sign in with your Google account
3. Click **"Get API Key"** button
4. Click **"Create API Key"**
5. Copy the API key (it looks like: `AIza...`)

### Step 5: Create Environment File
1. In the project folder, create a new file named `.env.local`
   - **Windows**: Right-click → New → Text Document → Rename to `.env.local`
   - **Mac/Linux**: Create file in terminal: `touch .env.local`
2. Open `.env.local` in a text editor
3. Add this line (replace with your actual API key):
   ```
   GEMINI_API_KEY=your-actual-api-key-here
   ```
4. Save the file

### Step 6: Run the Project
1. In the terminal, run:
   ```bash
   npm run dev
   ```
2. Wait for the message: `✓ Ready on http://localhost:3000`
3. Open your browser and go to: `http://localhost:3000`

### Step 7: Use the App
1. Click **"Register"** to create a new account
2. Fill in your details (name, email, password)
3. Click **"Login"** to sign in
4. Start using the app!

## ⚠️ Common Issues & Solutions

### Issue: "npm: command not found"
**Solution**: Node.js is not installed. Go back to Step 1.

### Issue: "Port 3000 is already in use"
**Solution**: 
- Close other applications using port 3000
- Or run on a different port: `npm run dev -- -p 3001`
- Then access at `http://localhost:3001`

### Issue: "Cannot find module" errors
**Solution**: 
- Delete `node_modules` folder (if exists)
- Delete `package-lock.json` (if exists)
- Run `npm install` again

### Issue: "API key not working"
**Solution**:
- Make sure `.env.local` file exists in the root folder
- Check that the file name is exactly `.env.local` (not `.env.local.txt`)
- Verify the API key is correct (no extra spaces)
- Restart the server after creating/changing `.env.local`

### Issue: Page shows errors
**Solution**:
- Check the terminal for error messages
- Make sure all dependencies are installed (`npm install`)
- Make sure `.env.local` file exists with correct API key

## ✅ Quick Checklist

Before running the app, make sure:
- [ ] Node.js 18+ is installed
- [ ] Project folder is copied to the laptop
- [ ] `npm install` completed successfully
- [ ] `.env.local` file exists in root folder
- [ ] Gemini API key is added to `.env.local`
- [ ] Terminal shows "Ready on http://localhost:3000"

## 📞 Need Help?

If you encounter any issues:
1. Check the error message in the terminal
2. Verify all steps above are completed
3. Make sure your internet connection is working (for npm install and API calls)

---

**That's it! The app should now be running. Enjoy! 🎉**

