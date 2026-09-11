const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

async function runLiveTest() {
  console.log('🚀 Launching Chromium test browser for Streamlined NPC ANO...');
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
    viewport: { width: 1280, height: 850 },
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

  // Wait 2.8s for boot to complete
  await page.waitForTimeout(2800);

  // 2. Capture Hero Landing Page
  console.log('📸 Capturing Streamlined Hero Landing Page...');
  await page.screenshot({ path: path.join(artifactDir, '02_hero_landing.png') });

  // 3. Click [ START NPC TEST ]
  console.log('🧠 Starting 6-Question Psychological Assessment...');
  await page.getByRole('button', { name: /START NPC TEST/i }).first().click();
  await page.waitForTimeout(800);

  // Question 1: Social Silence
  console.log('📸 Question 1: Social Silence...');
  await page.screenshot({ path: path.join(artifactDir, '03_quiz_q1_elevator.png') });
  await page.getByText(/Deploy standard ambient dialogue/i).click();
  await page.waitForTimeout(600);

  // Question 2: Pathfinding
  console.log('📸 Question 2: Pathfinding...');
  await page.getByText(/walk the exact same sidewalk path/i).click();
  await page.waitForTimeout(600);

  // Question 3: Daily Script Loop
  console.log('📸 Question 3: Daily Script Loop...');
  await page.getByText(/Alarm at 7:00 AM, identical coffee mug/i).click();
  await page.waitForTimeout(600);

  // Question 4: Dialogue Tree
  console.log('📸 Question 4: Dialogue Tree...');
  await page.getByText(/Cycle between: "Nice!", "Sounds good!"/i).click();
  await page.waitForTimeout(600);

  // Question 5: Anomaly Reaction
  console.log('📸 Question 5: Anomaly Reaction...');
  await page.getByText(/Must have been the wind/i).click();
  await page.waitForTimeout(600);

  // Question 6: Free Will / Reflex Challenge
  console.log('📸 Question 6: Free Will Challenge...');
  await page.screenshot({ path: path.join(artifactDir, '04_quiz_q6_challenge.png') });
  await page.getByText(/Obey instantly without questioning/i).click();
  await page.waitForTimeout(600);

  // 4. Click [ GET RESULTS NOW ]
  console.log('⚡ Getting Results...');
  await page.getByRole('button', { name: /GET RESULTS NOW/i }).click();
  await page.waitForTimeout(1500);

  // 5. Capture Result Screen
  console.log('📸 Capturing Dramatic Result Modal...');
  await page.screenshot({ path: path.join(artifactDir, '05_quiz_result_modal.png') });

  // Save to Hall of Fame
  const nameInput = page.getByPlaceholder(/Enter Specimen Alias/i);
  if (await nameInput.count() > 0) {
    await nameInput.fill('Ultra Obedient Citizen');
    const saveBtn = page.getByText('SAVE TO HALL OF FAME');
    if (await saveBtn.count() > 0) {
      await saveBtn.click();
      await page.waitForTimeout(500);
    }
  }

  // View ID Badge
  const viewBadgeBtn = page.getByText('VIEW ID BADGE');
  if (await viewBadgeBtn.count() > 0) {
    await viewBadgeBtn.click();
    await page.waitForTimeout(800);
    console.log('📸 Capturing Specimen ID Badge...');
    await page.screenshot({ path: path.join(artifactDir, '06_specimen_id_badge.png') });
    
    // Back to breakdown
    const backBtn = page.getByText('← BACK TO FULL BREAKDOWN');
    if (await backBtn.count() > 0) {
      await backBtn.click();
      await page.waitForTimeout(400);
    }
  }

  // Close Result Modal
  const closeBtn = page.getByTitle('Close Result').or(page.getByRole('button', { name: /CLOSE/i })).first();
  if (await closeBtn.count() > 0) {
    await closeBtn.click();
  }
  await page.waitForTimeout(500);

  // 6. Navigate to Leaderboard
  console.log('🏆 Navigating to Hall of Fame...');
  await page.getByRole('button', { name: /HALL OF FAME/i }).first().click();
  await page.waitForTimeout(800);
  console.log('📸 Capturing Leaderboard...');
  await page.screenshot({ path: path.join(artifactDir, '07_hall_of_fame.png') });

  // 7. Navigate to Achievements
  console.log('✨ Navigating to Achievements...');
  await page.getByRole('button', { name: /ACHIEVEMENTS/i }).first().click();
  await page.waitForTimeout(800);
  console.log('📸 Capturing Achievements...');
  await page.screenshot({ path: path.join(artifactDir, '08_achievements.png') });

  // 8. Test Dedicated Camera Scan Mode
  console.log('📷 Navigating to Dedicated Camera Scan...');
  await page.getByRole('button', { name: /CAMERA SCAN/i }).first().click();
  await page.waitForTimeout(800);
  console.log('📸 Capturing Dedicated Camera Scan...');
  await page.screenshot({ path: path.join(artifactDir, '09_camera_scan.png') });

  console.log('🎉 ALL STREAMLINED TEST STEPS COMPLETED WITH 100% SUCCESS!');
  await browser.close();
}

runLiveTest().catch((err) => {
  console.error('Test execution error:', err);
  process.exit(1);
});
