#!/bin/bash
# Cloudinary Setup Script for PromtPicGallery
# Run this to set up Cloudinary for image storage
# Free tier: 25 GB storage, no credit card required

set -e

echo "☁️  Cloudinary Setup for PromtPicGallery"
echo "========================================"
echo ""

# Check if .env.local exists
if [ ! -f .env.local ]; then
    echo "📝 Creating .env.local from .env.example..."
    cp .env.example .env.local
    echo "✅ Created .env.local"
else
    echo "✅ .env.local already exists"
fi

echo ""
echo "📋 Setup Instructions:"
echo "======================"
echo ""
echo "1. Go to https://cloudinary.com"
echo "   - Sign up for a free account (no credit card required)"
echo "   - Free tier: 25 GB storage, 25 GB bandwidth/month"
echo ""
echo "2. Get your Cloud Name:"
echo "   - After login, go to Dashboard"
echo "   - Copy the 'Cloud name' value (e.g., 'dxxxxxxx')"
echo ""
echo "3. Create an Upload Preset:"
echo "   - Go to Settings → Upload → Upload presets"
echo "   - Click 'Add upload preset'"
echo "   - Set 'Preset name' (e.g., 'promtpicgallery')"
echo "   - Set 'Signing mode' to 'Unsigned'"
echo "   - Save the preset"
echo ""
echo "4. Update .env.local with your credentials:"
echo ""

# Check current values in .env.local
CLOUD_NAME=$(grep -o 'CLOUDINARY_CLOUD_NAME=.*' .env.local 2>/dev/null | cut -d'=' -f2-)
UPLOAD_PRESET=$(grep -o 'CLOUDINARY_UPLOAD_PRESET=.*' .env.local 2>/dev/null | cut -d'=' -f2-)

if [ "$CLOUD_NAME" = "your_cloud_name" ] || [ -z "$CLOUD_NAME" ]; then
    echo "   ⚠️  CLOUDINARY_CLOUD_NAME is not set"
    echo "   Run: sed -i 's/CLOUDINARY_CLOUD_NAME=your_cloud_name/CLOUDINARY_CLOUD_NAME=YOUR_ACTUAL_CLOUD_NAME/' .env.local"
else
    echo "   ✅ CLOUDINARY_CLOUD_NAME is set"
fi

if [ "$UPLOAD_PRESET" = "your_upload_preset" ] || [ -z "$UPLOAD_PRESET" ]; then
    echo "   ⚠️  CLOUDINARY_UPLOAD_PRESET is not set"
    echo "   Run: sed -i 's/CLOUDINARY_UPLOAD_PRESET=your_upload_preset/CLOUDINARY_UPLOAD_PRESET=YOUR_ACTUAL_PRESET/' .env.local"
else
    echo "   ✅ CLOUDINARY_UPLOAD_PRESET is set"
fi

echo ""
echo "5. Test your setup:"
echo "   - Run 'npm run dev' to start the dev server"
echo "   - Go to http://localhost:3000/gallery"
echo "   - Try uploading an image to verify Cloudinary is working"
echo ""
echo "6. (Optional) Configure Cloudinary settings:"
echo "   - Go to Settings → Upload in Cloudinary dashboard"
echo "   - Configure allowed formats (e.g., jpg, png, webp)"
echo "   - Set max file size (default: 10 MB)"
echo "   - Configure auto-tagging or AI-powered features"
echo ""
echo "========================================"
echo "Done! Your Cloudinary is ready for PromtPicGallery."
echo ""
echo "💡 Tips:"
echo "   - Cloudinary automatically optimizes images on upload"
echo "   - You can add transformations via URL (e.g., resize, crop, watermark)"
echo "   - Free tier includes 25 GB storage and 25 GB bandwidth/month"
