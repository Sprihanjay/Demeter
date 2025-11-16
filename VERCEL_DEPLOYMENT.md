# Demeter - Vercel Monorepo Deployment Guide

## 🏗️ Architecture Overview

```
Single GitHub Repo: Sprihanjay/Demeter
│
├── Vercel Project 1: "demeter-frontend"
│   ├── Root: frontend/
│   ├── Runtime: Node.js (Vite)
│   └── URL: https://demeter-frontend.vercel.app
│
├── Vercel Project 2: "demeter-backend"
│   ├── Root: backend/
│   ├── Runtime: Node.js (Express)
│   └── URL: https://demeter-backend.vercel.app
│
└── Vercel Project 3: "demeter-ocr"
    ├── Root: backend/ocr/
    ├── Runtime: Python 3.11
    └── URL: https://demeter-ocr.vercel.app
```

## 📦 Deployment Order (IMPORTANT!)

Deploy in this specific order to ensure all URLs are available:

### 1️⃣ Deploy OCR Service First

**Why first?** Backend needs the OCR URL.

1. Go to [vercel.com/new](https://vercel.com/new)
2. Import: `Sprihanjay/Demeter`
3. Project Name: `demeter-ocr`
4. Root Directory: `backend/ocr`
5. Framework: Other

**Environment Variables:**
```bash
GOOGLE_APPLICATION_CREDENTIALS_JSON={"type":"service_account",...}
FIREBASE_PROJECT_ID=your-project
FIREBASE_STORAGE_BUCKET=your-bucket.appspot.com
```

**Deploy** → Note the URL: `https://demeter-ocr.vercel.app`

---

### 2️⃣ Deploy Backend Second

**Why second?** Frontend needs the backend URL.

1. Go to [vercel.com/new](https://vercel.com/new)
2. Import: `Sprihanjay/Demeter`
3. Project Name: `demeter-backend`
4. Root Directory: `backend`
5. Framework: Other

**Environment Variables:**
```bash
# Firebase Admin
FIREBASE_SERVICE_KEY={"type":"service_account",...}
FIREBASE_STORAGE_BUCKET=your-bucket.appspot.com

# APIs
GEMINI_API_KEY=your_gemini_key
ELEVENLABS_API_KEY=your_elevenlabs_key

# OCR Service URL (from step 1)
OCR_SERVICE_URL=https://demeter-ocr.vercel.app

# Environment
NODE_ENV=production
PORT=8080
```

**Deploy** → Note the URL: `https://demeter-backend.vercel.app`

---

### 3️⃣ Deploy Frontend Last

1. Go to [vercel.com/new](https://vercel.com/new)
2. Import: `Sprihanjay/Demeter`
3. Project Name: `demeter-frontend`
4. Root Directory: `frontend`
5. Framework: Vite

**Environment Variables:**
```bash
# Firebase Client
VITE_FIREBASE_API_KEY=your_key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project
VITE_FIREBASE_STORAGE_BUCKET=your-bucket.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123:web:abc
VITE_FIREBASE_MEASUREMENT_ID=G-XXX

# Backend URL (from step 2)
VITE_API_BASE_URL=https://demeter-backend.vercel.app
```

**Deploy** → URL: `https://demeter-frontend.vercel.app`

---

## ✅ What We Fixed

### Files Created/Modified:

1. ✅ `frontend/vercel.json` - Vite configuration
2. ✅ `backend/vercel.json` - Express serverless configuration
3. ✅ `backend/ocr/vercel.json` - Python runtime configuration
4. ✅ `backend/ocr/api/process.py` - Serverless function handler
5. ✅ `backend/package.json` - Removed Python postinstall, added start script

### Issues Resolved:

- ✅ Python postinstall removed from Node.js backend
- ✅ OCR service deployable as separate Python serverless function
- ✅ All three services can be deployed from single monorepo
- ✅ Proper routing and CORS handling

---

## 🔄 Auto-Deploy Workflow

After initial setup, any push to `main` branch will automatically redeploy all three projects:

```bash
git add .
git commit -m "Update code"
git push origin main
```

Vercel will:
- ✅ Detect changes in `frontend/` → Redeploy frontend
- ✅ Detect changes in `backend/` → Redeploy backend  
- ✅ Detect changes in `backend/ocr/` → Redeploy OCR service

---

## 🧪 Testing After Deployment

### Test OCR Service:
```bash
curl -X POST https://demeter-ocr.vercel.app/api/process \
  -H "Content-Type: application/json" \
  -d '{"uid": "test-uid"}'
```

### Test Backend:
```bash
curl https://demeter-backend.vercel.app/
```

### Test Frontend:
Open browser: `https://demeter-frontend.vercel.app`

---

## 📊 Environment Variables Summary

### Frontend (3 vars minimum)
- All `VITE_FIREBASE_*` configs
- `VITE_API_BASE_URL`

### Backend (5 vars minimum)
- `FIREBASE_SERVICE_KEY`
- `FIREBASE_STORAGE_BUCKET`
- `GEMINI_API_KEY`
- `OCR_SERVICE_URL`
- `NODE_ENV`

### OCR Service (3 vars minimum)
- `GOOGLE_APPLICATION_CREDENTIALS_JSON`
- `FIREBASE_PROJECT_ID`
- `FIREBASE_STORAGE_BUCKET`

---

## 🚨 Common Issues & Solutions

### Issue: OCR deployment fails
**Solution:** Make sure `requirements.txt` is in `backend/ocr/` directory

### Issue: Backend can't connect to OCR
**Solution:** Check `OCR_SERVICE_URL` environment variable in backend

### Issue: CORS errors
**Solution:** OCR service already has CORS headers. Backend needs to whitelist frontend domain.

### Issue: Firebase credentials not working
**Solution:** Ensure JSON is minified to single line, no line breaks

---

## 🎯 Next Steps

1. **Commit all changes:**
```bash
git add .
git commit -m "Add Vercel monorepo deployment configuration"
git push origin main
```

2. **Deploy in order:**
   - OCR Service → Backend → Frontend

3. **Update hardcoded URLs** in frontend code (optional but recommended)

4. **Test end-to-end** functionality

---

## 📚 Additional Resources

- [Vercel Python Runtime Docs](https://vercel.com/docs/functions/serverless-functions/runtimes/python)
- [Vercel Monorepo Guide](https://vercel.com/docs/monorepos)
- [Vercel Environment Variables](https://vercel.com/docs/projects/environment-variables)

---

Ready to deploy! 🚀
