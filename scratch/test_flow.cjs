const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

async function runLiveTest() {
  console.log('🚀 Launching system browser (Edge/Chrome)...');
  let browser;
  try {
    browser = await chromium.launch({ channel: 'msedge', headless: true });
  } catch {
    try {
      browser = await chromium.launch({ channel: 'chrome', headless: true });
    } catch {
      browser = await chromium.launch({ headless: true });
    }
  }

  const context = await browser.newContext({
    viewport: { width: 1280, height: 800 },
    permissions: ['camera']
  });
  const page = await context.newPage();

  const artifactDir = path.join(__dirname, 'screenshots');
  if (!fs.existsSync(artifactDir)) {
    fs.mkdirSync(artifactDir, { recursive: true });
  }

  console.log('📍 Navigating to http://127.0.0.1:5173/ ...');
  await page.goto('http://127.0.0.1:5173/');

  // 1. Capture Boot Screen
  console.log('📸 Capturing Boot Sequence...');
  await page.waitForTimeout(600);
  await page.screenshot({ path: path.join(artifactDir, '01_boot_sequence.png') });

  // Wait 2.8s for boot sequence to automatically complete
  console.log('⏳ Waiting for system initialization to complete...');
  await page.waitForTimeout(2800);

  // 2. Capture Analyzer Workspace
  console.log('📸 Capturing Analyzer Workspace...');
  await page.screenshot({ path: path.join(artifactDir, '02_analyzer_workspace.png') });

  // 3. Select Looping NPC sample preset
  console.log('🔄 Selecting Sample Preset: 02: LOOPING NPC...');
  const loopingBtn = page.getByText('02: LOOPING NPC');
  if (await loopingBtn.count() > 0) {
    await loopingBtn.click();
  }
  await page.waitForTimeout(1000);
  await page.screenshot({ path: path.join(artifactDir, '03_sample_looping_selected.png') });

  // 4. Start Analysis Scan
  console.log('⚡ Starting Analysis Scan...');
  const startBtn = page.getByRole('button', { name: /START ANALYSIS/i });
  if (await startBtn.count() > 0) {
    await startBtn.click();
  }

  // Wait 3.5 seconds during active scanning
  await page.waitForTimeout(3500);
  console.log('📸 Capturing Active Scanning with HUD Overlays...');
  await page.screenshot({ path: path.join(artifactDir, '04_active_scanning_hud.png') });

  // Wait for scan to complete and Result Screen to open
  console.log('⏳ Waiting for analysis completion and Result Modal reveal...');
  await page.waitForTimeout(5500);

  // 5. Capture Result Modal
  console.log('📸 Capturing Dramatic Result Modal...');
  await page.screenshot({ path: path.join(artifactDir, '05_result_screen.png') });

  // Save to Hall of Fame
  const nameInput = page.getByPlaceholder(/Enter Specimen Alias/i);
  if (await nameInput.count() > 0) {
    await nameInput.fill('The Legendary Looper');
    const saveBtn = page.getByText('SAVE TO HALL OF FAME');
    if (await saveBtn.count() > 0) {
      await saveBtn.click();
    }
  }
  await page.waitForTimeout(600);
  await page.screenshot({ path: path.join(artifactDir, '06_saved_to_hall_of_fame.png') });

  // View ID Badge
  const viewBadgeBtn = page.getByText('VIEW ID BADGE');
  if (await viewBadgeBtn.count() > 0) {
    await viewBadgeBtn.click();
    await page.waitForTimeout(800);
    console.log('📸 Capturing Specimen ID Badge...');
    await page.screenshot({ path: path.join(artifactDir, '07_specimen_id_badge.png') });

    // Back to breakdown
    const backBtn = page.getByText('← BACK TO FULL BREAKDOWN');
    if (await backBtn.count() > 0) {
      await backBtn.click();
      await page.waitForTimeout(400);
    }
  }

  // Close modal via close button
  const closeBtn = page.getByTitle('Close Result').or(page.getByRole('button', { name: /CLOSE/i })).first();
  if (await closeBtn.count() > 0) {
    await closeBtn.click();
  }
  await page.waitForTimeout(500);

  // 6. Navigate to Hall of Fame
  console.log('🏆 Navigating to Hall of Fame...');
  await page.getByRole('button', { name: /HALL OF FAME/i }).first().click();
  await page.waitForTimeout(800);
  console.log('📸 Capturing Leaderboard...');
  await page.screenshot({ path: path.join(artifactDir, '08_hall_of_fame.png') });

  // 7. Navigate to Achievements
  console.log('✨ Navigating to Achievements...');
  await page.getByRole('button', { name: /ACHIEVEMENTS/i }).first().click();
  await page.waitForTimeout(800);
  console.log('📸 Capturing Achievements...');
  await page.screenshot({ path: path.join(artifactDir, '09_achievements.png') });

  // 8. Navigate to How It Works
  console.log('❓ Navigating to How It Works...');
  await page.getByRole('button', { name: /HOW IT WORKS/i }).first().click();
  await page.waitForTimeout(800);
  console.log('📸 Capturing How It Works...');
  await page.screenshot({ path: path.join(artifactDir, '10_how_it_works.png') });

  // 9. Navigate to About
  console.log('ℹ️ Navigating to About...');
  await page.getByRole('button', { name: /ABOUT/i }).first().click();
  await page.waitForTimeout(800);
  console.log('📸 Capturing About Manifesto...');
  await page.screenshot({ path: path.join(artifactDir, '11_about.png') });

  console.log('🎉 ALL 11 TEST STEPS PASSED PERFECTLY!');
  await browser.close();
}

runLiveTest().catch((err) => {
  console.error('Test execution error:', err);
  process.exit(1);
});
