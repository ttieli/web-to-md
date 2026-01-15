#!/bin/bash
# postinstall.sh - Install all dependencies for wfmd

echo "[wfmd] Installing dependencies..."

# Track installation status
INSTALL_OK=true

# ===== 1. Install webfetcher (wf) =====
if command -v wf &> /dev/null; then
    echo "[wfmd] ✓ wf is already installed"
else
    echo "[wfmd] Installing webfetcher (wf command)..."

    if command -v pipx &> /dev/null; then
        pipx install git+https://github.com/ttieli/web-fetcher.git 2>/dev/null && {
            echo "[wfmd] ✓ webfetcher installed successfully"
        } || {
            echo "[wfmd] ⚠ webfetcher installation failed"
            INSTALL_OK=false
        }
    elif command -v pip3 &> /dev/null; then
        pip3 install --user git+https://github.com/ttieli/web-fetcher.git 2>/dev/null && {
            echo "[wfmd] ✓ webfetcher installed successfully (via pip)"
        } || {
            echo "[wfmd] ⚠ webfetcher installation failed"
            INSTALL_OK=false
        }
    else
        echo "[wfmd] ⚠ Neither pipx nor pip3 found"
        INSTALL_OK=false
    fi
fi

# ===== 2. Install mineru-cli =====
if command -v mineru &> /dev/null; then
    echo "[wfmd] ✓ mineru is already installed"
else
    echo "[wfmd] Installing mineru-cli..."

    npm install -g git+https://github.com/ttieli/mineru-cloud.git 2>/dev/null && {
        echo "[wfmd] ✓ mineru-cli installed successfully"
    } || {
        echo "[wfmd] ⚠ mineru-cli installation failed"
        INSTALL_OK=false
    }
fi

# ===== 3. Install docxjs-cli =====
if command -v docxjs &> /dev/null; then
    echo "[wfmd] ✓ docxjs is already installed"
else
    echo "[wfmd] Installing docxjs-cli..."

    npm install -g github:ttieli/docxjs-cli 2>/dev/null && {
        echo "[wfmd] ✓ docxjs-cli installed successfully"
    } || {
        echo "[wfmd] ⚠ docxjs-cli installation failed"
        INSTALL_OK=false
    }
fi

# ===== Summary =====
echo ""
if [ "$INSTALL_OK" = true ]; then
    echo "[wfmd] ✓ All dependencies installed successfully"
else
    echo "[wfmd] ⚠ Some dependencies failed to install. Please install manually:"
    command -v wf &> /dev/null || echo "  pipx install git+https://github.com/ttieli/web-fetcher.git"
    command -v mineru &> /dev/null || echo "  npm install -g git+https://github.com/ttieli/mineru-cloud.git"
    command -v docxjs &> /dev/null || echo "  npm install -g github:ttieli/docxjs-cli"
fi

# Don't block npm install
exit 0
