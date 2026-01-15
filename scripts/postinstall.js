#!/usr/bin/env node
const { execSync } = require('child_process');

function run(cmd, silent = false) {
    try {
        execSync(cmd, { stdio: silent ? 'ignore' : 'inherit' });
        return true;
    } catch {
        return false;
    }
}

function hasCommand(cmd) {
    try {
        execSync(`command -v ${cmd}`, { stdio: 'ignore' });
        return true;
    } catch {
        return false;
    }
}

console.log('[wfmd] Installing dependencies...\n');

let allOk = true;

// 1. webfetcher (wf)
if (hasCommand('wf')) {
    console.log('[wfmd] ✓ wf is already installed');
} else {
    console.log('[wfmd] Installing webfetcher...');
    if (hasCommand('pipx')) {
        if (!run('pipx install git+https://github.com/ttieli/web-fetcher.git', true)) {
            console.log('[wfmd] ⚠ webfetcher installation failed');
            allOk = false;
        } else {
            console.log('[wfmd] ✓ webfetcher installed');
        }
    } else if (hasCommand('pip3')) {
        if (!run('pip3 install --user git+https://github.com/ttieli/web-fetcher.git', true)) {
            console.log('[wfmd] ⚠ webfetcher installation failed');
            allOk = false;
        } else {
            console.log('[wfmd] ✓ webfetcher installed');
        }
    } else {
        console.log('[wfmd] ⚠ pipx/pip3 not found');
        allOk = false;
    }
}

// 2. mineru-cli
if (hasCommand('mineru')) {
    console.log('[wfmd] ✓ mineru is already installed');
} else {
    console.log('[wfmd] Installing mineru-cli...');
    if (!run('npm install -g git+https://github.com/ttieli/mineru-cloud.git', true)) {
        console.log('[wfmd] ⚠ mineru-cli installation failed');
        allOk = false;
    } else {
        console.log('[wfmd] ✓ mineru-cli installed');
    }
}

// 3. docxjs-cli
if (hasCommand('docxjs')) {
    console.log('[wfmd] ✓ docxjs is already installed');
} else {
    console.log('[wfmd] Installing docxjs-cli...');
    if (!run('npm install -g github:ttieli/docxjs-cli', true)) {
        console.log('[wfmd] ⚠ docxjs-cli installation failed');
        allOk = false;
    } else {
        console.log('[wfmd] ✓ docxjs-cli installed');
    }
}

// Summary
console.log('');
if (allOk) {
    console.log('[wfmd] ✓ All dependencies ready');
} else {
    console.log('[wfmd] ⚠ Some dependencies need manual installation:');
    if (!hasCommand('wf')) console.log('  pipx install git+https://github.com/ttieli/web-fetcher.git');
    if (!hasCommand('mineru')) console.log('  npm install -g git+https://github.com/ttieli/mineru-cloud.git');
    if (!hasCommand('docxjs')) console.log('  npm install -g github:ttieli/docxjs-cli');
}
