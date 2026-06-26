// scripts/pack.cjs
const { execSync } = require('child_process');
const { version } = require('../package.json');
const args = process.argv.slice(2).join(' ');  // 透传额外参数如 --win

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'

const cmd = `npx electron-builder ${args} --config.directories.output=release/${version}`;
console.log(`📦 ${cmd}`);
execSync(cmd, { stdio: 'inherit' });