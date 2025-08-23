#!/bin/bash

# Android Icon Generator Script
# This script generates all required Android icon sizes from a source image
# Usage: ./generate-android-icons.sh source-icon.png

set -e

SOURCE_ICON=$1
OUTPUT_DIR="public/icons/android"

if [ -z "$SOURCE_ICON" ]; then
    echo "Usage: $0 <source-icon.png>"
    echo "Source icon should be at least 512x512 PNG"
    exit 1
fi

if [ ! -f "$SOURCE_ICON" ]; then
    echo "Error: Source icon file '$SOURCE_ICON' not found"
    exit 1
fi

# Check if ImageMagick is installed
if ! command -v convert &> /dev/null; then
    echo "Error: ImageMagick is required but not installed"
    echo "Install with: sudo apt-get install imagemagick (Ubuntu/Debian)"
    echo "Install with: brew install imagemagick (macOS)"
    exit 1
fi

# Create output directory
mkdir -p "$OUTPUT_DIR"

echo "Generating Android icons from $SOURCE_ICON..."

# Standard Android icon sizes
declare -A SIZES=(
    ["48"]="mdpi"
    ["72"]="hdpi"
    ["96"]="xhdpi"
    ["144"]="xxhdpi"
    ["192"]="xxxhdpi"
)

# Generate standard icons
for size in "${!SIZES[@]}"; do
    density="${SIZES[$size]}"
    output_file="$OUTPUT_DIR/icon-${size}x${size}.png"
    echo "Generating ${size}x${size} (${density})..."
    convert "$SOURCE_ICON" -resize "${size}x${size}" "$output_file"
done

# Generate Play Store icon
echo "Generating Play Store icon (512x512)..."
convert "$SOURCE_ICON" -resize "512x512" "$OUTPUT_DIR/icon-512x512.png"

# Generate PWA icons
echo "Generating PWA icons..."
convert "$SOURCE_ICON" -resize "64x64" "public/pwa-64x64.png"
convert "$SOURCE_ICON" -resize "192x192" "public/pwa-192x192.png"
convert "$SOURCE_ICON" -resize "512x512" "public/pwa-512x512.png"

# Generate maskable icon (with padding for safe area)
echo "Generating maskable icon..."
convert "$SOURCE_ICON" -resize "410x410" -gravity center -extent "512x512" -background transparent "public/maskable-icon-512x512.png"

# Generate favicon
echo "Generating favicon..."
convert "$SOURCE_ICON" -resize "32x32" "public/favicon.ico"

# Generate Apple touch icon
echo "Generating Apple touch icon..."
convert "$SOURCE_ICON" -resize "180x180" "public/apple-touch-icon.png"

echo ""
echo "✅ All icons generated successfully!"
echo ""
echo "Generated files:"
echo "📱 Android icons: $OUTPUT_DIR/"
echo "🌐 PWA icons: public/pwa-*.png"
echo "🍎 Apple icon: public/apple-touch-icon.png"
echo "🔖 Favicon: public/favicon.ico"
echo "🎭 Maskable: public/maskable-icon-512x512.png"
echo ""
echo "Next steps:"
echo "1. Review generated icons for quality"
echo "2. Test maskable icon with PWA mask tool"
echo "3. Upload to your web server"
echo "4. Update manifest.json if needed"
