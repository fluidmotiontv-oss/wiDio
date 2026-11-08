#!/bin/bash
echo "[1/2] Installing Node.js dependencies..."
npm install

echo "[2/2] Launching Server & Chrome with Autoplay Flags..."
node server.js &

# Wait 2 seconds for server boot
sleep 2

# Launch Chrome in Kiosk mode for OBS / Displays (bypasses user gesture audio locks)
if command -v google-chrome &> /dev/null
then
    google-chrome --autoplay-policy=no-user-gesture-required --use-fake-ui-for-media-stream --kiosk "http://localhost:3000"
elif command -v open &> /dev/null
then
    open -a "Google Chrome" --args --autoplay-policy=no-user-gesture-required --use-fake-ui-for-media-stream "http://localhost:3000"
else
    echo "Server running at http://localhost:3000. Please open in browser."
fi
