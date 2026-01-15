#!/usr/bin/env node
const { spawn, execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

// Core script path
const scriptPath = path.join(__dirname, '..', 'wfmd');

// Required commands
const requiredCommands = ['wf', 'mineru', 'docxjs'];

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

// Check all dependencies
const missing = requiredCommands.filter(cmd => !checkCommand(cmd));
if (missing.length > 0) {
    console.error('\x1b[33m[wfmd] Warning: missing dependencies:\x1b[0m', missing.join(', '));
    console.error('\x1b[33m[wfmd] Please run the following commands to install:\x1b[0m');
    missing.forEach(cmd => {
        if (cmd === 'wf') {
            console.error('  pipx install git+https://github.com/ttieli/web-fetcher.git');
        } else if (cmd === 'mineru') {
            console.error('  npm install -g git+https://github.com/ttieli/mineru-cloud.git');
        } else if (cmd === 'docxjs') {
            console.error('  npm install -g github:ttieli/docxjs-cli');
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
