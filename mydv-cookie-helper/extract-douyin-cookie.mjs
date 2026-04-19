import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { chromium } from 'playwright-core';

const PRIMARY_LOGIN_COOKIE_NAMES = [
  'sessionid',
  'sessionid_ss'
];

const SECONDARY_LOGIN_COOKIE_NAMES = [
  'sid_guard',
  'sid_tt',
  'uid_tt',
  'uid_tt_ss',
  'passport_assist_user'
];

function fileExists(filePath) {
  try {
    return fs.existsSync(filePath);
  } catch {
    return false;
  }
}

function findBrowserExecutable() {
  const envPath = process.env.PLAYWRIGHT_EXECUTABLE_PATH;
  if (envPath && fileExists(envPath)) {
    return envPath;
  }

  const candidates = [
    'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe',
    'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
    'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe'
  ];

  return candidates.find(fileExists) ?? null;
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function buildCookieHeader(cookies) {
  return cookies
    .map(cookie => `${cookie.name}=${cookie.value}`)
    .join('; ');
}

function summarizeCookieNames(cookies) {
  return cookies
    .map(cookie => cookie.name)
    .sort((a, b) => a.localeCompare(b))
    .join(', ');
}

function hasAuthenticatedCookies(cookies) {
  const names = new Set(cookies.map(cookie => cookie.name));

  if (PRIMARY_LOGIN_COOKIE_NAMES.some(name => names.has(name))) {
    return true;
  }

  const secondaryCount = SECONDARY_LOGIN_COOKIE_NAMES.filter(name => names.has(name)).length;
  return secondaryCount >= 2;
}

function exportCookies(outputPath, cookies) {
  const header = buildCookieHeader(cookies);
  fs.writeFileSync(outputPath, `${header}\n`, 'utf8');
}

async function bestEffortOpenLogin(page) {
  const selectors = [
    'text=登录',
    'text=立即登录',
    '[class*="login"]',
    '[data-e2e*="login"]'
  ];

  for (const selector of selectors) {
    try {
      const locator = page.locator(selector).first();
      if (await locator.isVisible({ timeout: 1500 })) {
        await locator.click({ timeout: 1500 });
        return;
      }
    } catch {
      // Douyin page structure changes frequently; keep this best-effort only.
    }
  }
}

async function main() {
  const browserExecutable = findBrowserExecutable();

  if (!browserExecutable) {
    console.error('没有找到可用的 Edge/Chrome。');
    console.error('可选方案：');
    console.error('1. 安装 Microsoft Edge 或 Google Chrome 后重试。');
    console.error('2. 手动设置环境变量 PLAYWRIGHT_EXECUTABLE_PATH 指向浏览器 exe。');
    process.exit(1);
  }

  const userDataDir = path.join(os.tmpdir(), 'mydv-cookie-helper-profile');
  const outputPath = path.resolve(process.cwd(), 'douyin-cookie-for-mydv.txt');
  const loginUrl = 'https://www.douyin.com/user/self';

  console.log(`使用浏览器: ${browserExecutable}`);
  console.log(`Cookie 输出文件: ${outputPath}`);
  console.log('即将打开抖音网页登录。');
  console.log('如果页面没有自动弹出二维码，请在网页里手动点“登录”。');
  console.log('只有拿到真正的登录态 Cookie 后，脚本才会自动导出并退出。');

  try {
    fs.rmSync(outputPath, { force: true });
  } catch {
    // Ignore cleanup errors for previous output files.
  }

  const context = await chromium.launchPersistentContext(userDataDir, {
    executablePath: browserExecutable,
    headless: false,
    viewport: { width: 1440, height: 960 },
    args: [
      '--disable-blink-features=AutomationControlled',
      '--start-maximized'
    ]
  });

  try {
    const page = context.pages()[0] ?? await context.newPage();
    await page.goto(loginUrl, { waitUntil: 'domcontentloaded', timeout: 60000 });
    await sleep(3000);

    const initialCookies = await context.cookies('https://www.douyin.com', 'https://live.douyin.com');
    if (hasAuthenticatedCookies(initialCookies)) {
      exportCookies(outputPath, initialCookies);

      console.log('');
      console.log('检测到当前浏览器资料里已经有登录态，直接导出了现有 Cookie。');
      console.log(`文件: ${outputPath}`);
      console.log('');
      console.log('如果你想强制重新扫码，先退出抖音网页登录态后再运行一次。');
      return;
    }

    await bestEffortOpenLogin(page);

    const timeoutAt = Date.now() + 10 * 60 * 1000;
    let lastCookieSummary = summarizeCookieNames(initialCookies);

    while (Date.now() < timeoutAt) {
      const cookies = await context.cookies('https://www.douyin.com', 'https://live.douyin.com');
      const cookieSummary = summarizeCookieNames(cookies);

      if (cookieSummary !== lastCookieSummary) {
        lastCookieSummary = cookieSummary;
        console.log(`检测到 Cookie 变化: ${cookieSummary || '(空)'}`);
      }

      if (hasAuthenticatedCookies(cookies)) {
        exportCookies(outputPath, cookies);

        console.log('');
        console.log('扫码登录成功，Cookie 已导出。');
        console.log(`文件: ${outputPath}`);
        console.log('');
        console.log('把这个文件里的整行内容复制到 myDV 设置里的 Cookie 输入框即可。');
        return;
      }

      await sleep(2000);
    }

    console.error('等待扫码登录超时。你可以重新运行脚本再试一次。');
    console.error('如果你只看到 ttwid、s_v_web_id 这类 Cookie，说明还只是访客态，不算登录成功。');
    process.exitCode = 1;
  } finally {
    await context.close();
  }
}

main().catch(error => {
  console.error('脚本运行失败:');
  console.error(error);
  process.exit(1);
});
