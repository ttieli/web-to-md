#!/bin/bash
# postinstall.sh - Install Python dependencies

echo "[wfmd] Checking Python dependencies..."

# Check if wf command is already installed
if command -v wf &> /dev/null; then
    echo "[wfmd] ✓ wf is already installed"
    exit 0
fi

echo "[wfmd] Installing webfetcher (wf command)..."

# Prefer pipx
if command -v pipx &> /dev/null; then
    pipx install git+https://github.com/ttieli/web-fetcher.git && {
        echo "[wfmd] ✓ webfetcher installed successfully"
        exit 0
    }
fi

# Fallback: use pip
if command -v pip3 &> /dev/null; then
    pip3 install --user git+https://github.com/ttieli/web-fetcher.git && {
        echo "[wfmd] ✓ webfetcher installed successfully (via pip)"
        exit 0
    }
fi

# Installation failed, provide manual instructions
echo "[wfmd] ⚠ webfetcher auto-install failed"
echo "[wfmd] Please run manually: pipx install git+https://github.com/ttieli/web-fetcher.git"
exit 0  # Don't block npm install
