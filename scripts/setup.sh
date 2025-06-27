#!/bin/bash

echo "🚀 Setting up Breeze Trading App for local development..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

echo "📦 Installing npm dependencies..."
npm install

echo "🔧 Installing BreezeConnect package..."
npm install breezeconnect

echo "📝 Creating environment file..."
cat > .env.local << EOL
# Environment configuration
NODE_ENV=development

# Add any additional environment variables here
# NEXT_PUBLIC_API_URL=http://localhost:3000
EOL

echo "✅ Setup complete!"
echo ""
echo "🎯 To run the application:"
echo "1. Make sure you have your ICICI Securities API credentials ready"
echo "2. Run: npm run dev"
echo "3. Open http://localhost:3000 in your browser"
echo ""
echo "📋 You'll need the following from ICICI Securities:"
echo "   - API Key"
echo "   - App Secret" 
echo "   - API Session (generated from the login URL)"
echo ""
echo "🔗 The app will show you the login URL to get your session key"
echo ""
echo "⚠️  Note: Make sure your ICICI Securities account has API access enabled"
