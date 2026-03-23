#!/bin/bash
# MacOS Build Script for Unisis Bot

echo "Setting up environment..."
cd "$(dirname "$0")"

if [ ! -d "venv" ]; then
    /opt/homebrew/bin/python3 -m venv venv
fi

source venv/bin/activate
pip install -r requirements.txt
pip install pyinstaller

echo "Building macOS application..."
pyinstaller --noconfirm --onedir --windowed --name "Unisis Bot" --icon "app_icon.icns" "unisis_bot.py"

echo "Building DMG installer with custom background..."
npx appdmg dmg.json "dist/Unisis_Bot.dmg"

echo "Build complete. Check the 'dist' folder for 'Unisis_Bot.dmg'"
