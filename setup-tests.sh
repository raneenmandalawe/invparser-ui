#!/bin/bash

# Playwright Test Setup Script for InvParser UI
# This script installs all necessary dependencies for running Playwright tests

echo "🎭 Setting up Playwright tests for InvParser UI..."
echo ""

# Check if virtual environment is activated
if [[ -z "$VIRTUAL_ENV" ]]; then
    echo "⚠️  Warning: No virtual environment detected!"
    echo "It's recommended to activate your virtual environment first:"
    echo "  source .venv/bin/activate"
    echo ""
    read -p "Continue anyway? (y/N) " -n 1 -r
    echo ""
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

echo "📦 Installing Python test dependencies..."
pip install -r requirements-test.txt

if [ $? -ne 0 ]; then
    echo "❌ Failed to install Python dependencies"
    exit 1
fi

echo ""
echo "🌐 Installing Playwright browsers (this may take a few minutes)..."
playwright install

if [ $? -ne 0 ]; then
    echo "❌ Failed to install Playwright browsers"
    exit 1
fi

echo ""
echo "✅ Setup complete!"
echo ""
echo "📝 Next steps:"
echo "  1. Make sure your Next.js app is running:"
echo "     cd invparser-ui && npm run dev"
echo ""
echo "  2. Run the tests:"
echo "     pytest tests/ -v"
echo ""
echo "  3. Read the testing guide:"
echo "     cat TESTING.md"
echo ""
echo "Happy testing! 🚀"
