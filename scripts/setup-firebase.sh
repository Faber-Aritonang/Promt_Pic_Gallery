#!/bin/bash
# Firebase Project Setup Script for PromtPicGallery
# Run this after creating your Firebase project at https://console.firebase.google.com

set -e

echo "🔥 Firebase Project Setup for PromtPicGallery"
echo "=============================================="
echo ""

# Check if Firebase CLI is installed
if ! command -v firebase &> /dev/null; then
    echo "📦 Installing Firebase CLI..."
    npm install -g firebase-tools
fi

# Check if logged in
if ! firebase projects:list &> /dev/null; then
    echo "🔐 Please log in to Firebase..."
    firebase login
fi

echo ""
echo "📋 Setup Instructions:"
echo "======================"
echo ""
echo "1. Go to https://console.firebase.google.com"
echo "2. Create a new project (or use existing)"
echo "3. Enable the following services:"
echo "   - Authentication → Sign-in method → Google"
echo "   - Cloud Firestore → Create database → Start in test mode"
echo "   - (Optional) Cloud Storage for profile images"
echo ""
echo "4. Register a Web App:"
echo "   - Project Settings → General → Your apps → Add app → Web"
echo "   - Copy the firebaseConfig values"
echo ""
echo "5. Generate Service Account Key:"
echo "   - Project Settings → Service accounts → Generate new private key"
echo "   - Save the JSON file securely"
echo ""
echo "6. Update .env.local with your credentials:"
echo ""

# Check if .env.local exists
if [ -f .env.local ]; then
    echo "   ✅ .env.local exists"
else
    echo "   📝 Creating .env.local from .env.example..."
    cp .env.example .env.local
    echo "   ✅ Created .env.local — please fill in your Firebase credentials"
fi

echo ""
echo "7. Deploy Firestore rules:"
echo "   firebase deploy --only firestore:rules"
echo ""
echo "8. Seed the database with 20 templates:"
echo "   npm run seed"
echo ""
echo "=============================================="
echo "Done! Your Firebase project is ready for PromtPicGallery."
