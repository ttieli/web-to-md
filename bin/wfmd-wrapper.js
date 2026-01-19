#!/usr/bin/env node
const { spawn, execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

// Core script path
const scriptPath = path.join(__dirname, '..', 'wfmd');

// Required commands (macocr is default OCR engine, mineru is optional for --mineru mode)
const requiredCommands = ['wf', 'macocr'];
const optionalCommands = ['mineru', 'docxjs'];

// Possible bin paths (handle dependency hoisting)
const possibleBinPaths = [
    path.join(__dirname, '..', 'node_modules', '.bin'),  // Local dependencies
    path.join(__dirname, '..', '..', '.bin'),            // Hoisted location
    path.join(process.env.HOME || '', '.local', 'bin'), // pipx install location
    '/usr/local/bin',                                    // Global install location
].filter(p => fs.existsSync(p));

// Construct enhanced PATH
const newPath = possibleBinPaths.join(path.delimiter) + path.delimiter + process.env.PATH;

// Debug mode
if (process.env.DEBUG_WRAPPER) {
    console.log('[Wrapper] Script:', scriptPath);
    console.log('[Wrapper] Search paths:', possibleBinPaths);
}

// Check if command is available
function checkCommand(cmd) {
    try {
        execSync(`command -v ${cmd}`, {
            env: { ...process.env, PATH: newPath },
            stdio: 'ignore'
        });
        return true;
    } catch {
        return false;
    }
}

// Check required dependencies
const missingRequired = requiredCommands.filter(cmd => !checkCommand(cmd));
if (missingRequired.length > 0) {
    console.error('\x1b[31m[wfmd] Error: missing required dependencies:\x1b[0m', missingRequired.join(', '));
    console.error('\x1b[33m[wfmd] Please run the following commands to install:\x1b[0m');
    missingRequired.forEach(cmd => {
        if (cmd === 'wf') {
            console.error('  pipx install git+https://github.com/ttieli/web-fetcher.git');
        } else if (cmd === 'macocr') {
            console.error('  # macocr (macOS native OCR) - see installation guide');
        }
    });
    process.exit(1);
}

// Check optional dependencies (show warning only)
const missingOptional = optionalCommands.filter(cmd => !checkCommand(cmd));
if (missingOptional.length > 0) {
    console.error('\x1b[33m[wfmd] Note: optional dependencies not installed:\x1b[0m', missingOptional.join(', '));
    console.error('\x1b[33m[wfmd] Install for additional features:\x1b[0m');
    missingOptional.forEach(cmd => {
        if (cmd === 'mineru') {
            console.error('  npm install -g git+https://github.com/ttieli/mineru-cloud.git  # for --mineru mode');
        } else if (cmd === 'docxjs') {
            console.error('  npm install -g github:ttieli/docxjs-cli  # for fallback mode');
        }
    });
}

// Launch bash script
const args = process.argv.slice(2);
const child = spawn('bash', [scriptPath, ...args], {
    stdio: 'inherit',
    env: {
        ...process.env,
        PATH: newPath,
        WFMD_WRAPPER_ENV: 'true'
    }
});

child.on('error', (err) => {
    console.error('\x1b[31m[Error] Failed to start wfmd:\x1b[0m', err);
    process.exit(1);
});

child.on('exit', (code) => {
    process.exit(code);
});
