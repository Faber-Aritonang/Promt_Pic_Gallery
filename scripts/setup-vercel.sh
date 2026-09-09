#!/bin/bash
# Vercel Deployment Setup for PromtPicGallery
# Run this to deploy to Vercel

set -e

echo "🚀 Vercel Deployment Setup for PromtPicGallery"
echo "================================================"
echo ""

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "📦 Installing Vercel CLI..."
    npm install -g vercel
fi

# Check if logged in
if ! vercel whoami &> /dev/null; then
    echo "🔐 Please log in to Vercel..."
    vercel login
fi

echo ""
echo "📋 Deployment Steps:"
echo "===================="
echo ""
echo "1. Link to your Vercel project:"
echo "   vercel link"
echo ""
echo "2. Set environment variables:"
echo "   vercel env add NEXT_PUBLIC_FIREBASE_API_KEY"
echo "   vercel env add NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN"
echo "   vercel env add NEXT_PUBLIC_FIREBASE_PROJECT_ID"
echo "   vercel env add NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET"
echo "   vercel env add NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID"
echo "   vercel env add NEXT_PUBLIC_FIREBASE_APP_ID"
echo "   vercel env add FIREBASE_SERVICE_ACCOUNT"
echo "   vercel env add CLOUDINARY_CLOUD_NAME"
echo "   vercel env add CLOUDINARY_UPLOAD_PRESET"
echo "   vercel env add GLM_API_KEY"
echo "   vercel env add GLM_API_ENDPOINT"
echo "   vercel env add GLM_MODEL"
echo "   vercel env add HUGGING_FACE_API_KEY"
echo "   vercel env add REPLICATE_API_TOKEN"
echo ""
echo "3. Deploy to production:"
echo "   vercel --prod"
echo ""
echo "4. Or push to GitHub for automatic deployment:"
echo "   git push origin main"
echo ""
echo "================================================"
echo "Done! Your app will be live at https://your-project.vercel.app"
