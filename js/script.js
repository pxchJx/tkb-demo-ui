// ============ MOBILE DRAWER ============
const hamburgerBtn = document.getElementById('hamburgerBtn');
const mobileDrawer = document.getElementById('mobileDrawer');
const drawerOverlay = document.getElementById('drawerOverlay');
const closeDrawer = document.getElementById('closeDrawer');

function openDrawer() {
  mobileDrawer.classList.add('open');
  drawerOverlay.classList.add('open');
}
function closeDrawerFn() {
  mobileDrawer.classList.remove('open');
  drawerOverlay.classList.remove('open');
}
hamburgerBtn.addEventListener('click', openDrawer);
closeDrawer.addEventListener('click', closeDrawerFn);
drawerOverlay.addEventListener('click', closeDrawerFn);

// ============ INSTALL APP / SMART BANNER ============
const installBanner = document.getElementById('installBanner');
const installCloseBtn = document.getElementById('installCloseBtn');
const installActionBtn = document.getElementById('installActionBtn');
const INSTALL_DISMISS_KEY = 'installBannerDismissed';

if (installBanner && !localStorage.getItem(INSTALL_DISMISS_KEY)) {
  setTimeout(() => installBanner.classList.add('show'), 1200);
}

function dismissInstallBanner() {
  installBanner.classList.remove('show');
  localStorage.setItem(INSTALL_DISMISS_KEY, '1');
  setTimeout(() => installBanner.classList.add('hidden'), 300);
}

installCloseBtn.addEventListener('click', dismissInstallBanner);
installActionBtn.addEventListener('click', dismissInstallBanner);

// ============ LOGIN / REGISTER (DEMO ONLY — NO REAL BACKEND) ============
const authOverlay = document.getElementById('authOverlay');
const authCloseBtn = document.getElementById('authCloseBtn');
const authTabLogin = document.getElementById('authTabLogin');
const authTabRegister = document.getElementById('authTabRegister');
const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');
const authError = document.getElementById('authError');
const headerActions = document.getElementById('headerActions');
const drawerActions = document.getElementById('drawerActions');
const AUTH_STORAGE_KEY = 'ogxbetDemoUser';

function openAuthModal(tab) {
  authOverlay.classList.add('open');
  showAuthTab(tab || 'login');
  hideAuthError();
}
function closeAuthModal() {
  authOverlay.classList.remove('open');
}
function showAuthTab(tab) {
  const isLogin = tab === 'login';
  authTabLogin.classList.toggle('active', isLogin);
  authTabRegister.classList.toggle('active', !isLogin);
  loginForm.classList.toggle('hidden', !isLogin);
  registerForm.classList.toggle('hidden', isLogin);
  hideAuthError();
}
function showAuthError(message) {
  authError.textContent = message;
  authError.classList.add('show');
}
function hideAuthError() {
  authError.classList.remove('show');
}

document.querySelectorAll('.auth-open-btn').forEach(btn => {
  btn.addEventListener('click', () => openAuthModal(btn.dataset.authTab));
});
authCloseBtn.addEventListener('click', closeAuthModal);
authOverlay.addEventListener('click', (e) => { if (e.target === authOverlay) closeAuthModal(); });
authTabLogin.addEventListener('click', () => showAuthTab('login'));
authTabRegister.addEventListener('click', () => showAuthTab('register'));
document.querySelectorAll('[data-switch-to]').forEach(el => {
  el.addEventListener('click', (e) => { e.preventDefault(); showAuthTab(el.dataset.switchTo); });
});

function renderLoggedInState(profile) {
  const chipHtml = `
    <div class="user-chip">
      <button class="user-chip-btn">
        <span class="user-avatar">${profile.username.charAt(0).toUpperCase()}</span>
        <span>${profile.username}</span>
        <span class="lang-caret">▾</span>
      </button>
      <ul class="user-menu">
        <li><button class="user-open-settings" data-i18n="settingsMenuItem">⚙️ Account Settings</button></li>
        <li><button class="user-logout" data-i18n="authLogout">🚪 Log Out</button></li>
      </ul>
    </div>`;
  headerActions.innerHTML = chipHtml;
  drawerActions.innerHTML = chipHtml;
  document.querySelectorAll('.user-chip').forEach(chip => {
    const btn = chip.querySelector('.user-chip-btn');
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      document.querySelectorAll('.user-chip').forEach(c => { if (c !== chip) c.classList.remove('open'); });
      chip.classList.toggle('open');
    });
  });
  document.querySelectorAll('.user-open-settings').forEach(btn => {
    btn.dataset.i18n = 'settingsMenuItem';
    btn.textContent = (TRANSLATIONS[currentLang] || TRANSLATIONS.en).settingsMenuItem;
    btn.addEventListener('click', () => {
      document.querySelectorAll('.user-chip').forEach(c => c.classList.remove('open'));
      openSettingsModal();
    });
  });
  document.querySelectorAll('.user-logout').forEach(btn => {
    btn.dataset.i18n = 'authLogout';
    btn.textContent = (TRANSLATIONS[currentLang] || TRANSLATIONS.en).authLogout;
    btn.addEventListener('click', logoutDemoUser);
  });
}

function renderLoggedOutState() {
  const actionsHtml = (extraClass) => `
    <button class="btn btn-ghost${extraClass} auth-open-btn" data-auth-tab="login" data-i18n="logIn">Log In</button>
    <button class="btn btn-primary${extraClass} auth-open-btn" data-auth-tab="register" data-i18n="joinNow">Join Now</button>`;
  headerActions.innerHTML = actionsHtml('');
  drawerActions.innerHTML = actionsHtml(' btn-block');
  document.querySelectorAll('.auth-open-btn').forEach(btn => {
    btn.addEventListener('click', () => openAuthModal(btn.dataset.authTab));
  });
  applyTranslations(currentLang);
}

function getDemoProfile() {
  const raw = localStorage.getItem(AUTH_STORAGE_KEY);
  return raw ? JSON.parse(raw) : null;
}

function loginDemoUser(profile) {
  localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(profile));
  renderLoggedInState(profile);
}
function logoutDemoUser() {
  localStorage.removeItem(AUTH_STORAGE_KEY);
  renderLoggedOutState();
}

loginForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const [emailInput, passwordInput] = loginForm.querySelectorAll('input');
  if (!emailInput.value.trim() || !passwordInput.value) {
    showAuthError('Please fill in both fields.');
    return;
  }
  hideAuthError();
  const submitBtn = loginForm.querySelector('.auth-submit');
  submitBtn.disabled = true;
  setTimeout(() => {
    submitBtn.disabled = false;
    closeAuthModal();
    const rawEmail = emailInput.value.trim();
    loginForm.reset();
    loginDemoUser({ username: rawEmail.split('@')[0], email: rawEmail.includes('@') ? rawEmail : '' });
  }, 500);
});

registerForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const [usernameInput, emailInput, passwordInput, confirmInput] = registerForm.querySelectorAll('input:not([type="checkbox"])');
  if (!usernameInput.value.trim() || !emailInput.value.trim() || !passwordInput.value || !confirmInput.value) {
    showAuthError('Please fill in all fields.');
    return;
  }
  if (passwordInput.value !== confirmInput.value) {
    showAuthError('Passwords do not match.');
    return;
  }
  hideAuthError();
  const submitBtn = registerForm.querySelector('.auth-submit');
  submitBtn.disabled = true;
  setTimeout(() => {
    submitBtn.disabled = false;
    closeAuthModal();
    const profile = { username: usernameInput.value.trim(), email: emailInput.value.trim() };
    registerForm.reset();
    loginDemoUser(profile);
  }, 500);
});

document.addEventListener('click', (e) => {
  document.querySelectorAll('.user-chip.open').forEach(chip => {
    if (!chip.contains(e.target)) chip.classList.remove('open');
  });
});

// ============ ACCOUNT SETTINGS (DEMO ONLY) ============
const settingsOverlay = document.getElementById('settingsOverlay');
const settingsCloseBtn = document.getElementById('settingsCloseBtn');
const settingsError = document.getElementById('settingsError');
const settingsSuccess = document.getElementById('settingsSuccess');
const settingsTabs = document.querySelectorAll('[data-settings-tab]');
const settingsPanels = document.querySelectorAll('[data-settings-panel]');
const settingsUsernameInput = document.getElementById('settingsUsername');
const settingsEmailInput = document.getElementById('settingsEmail');
const settingsCurrencySelect = document.getElementById('settingsCurrency');
const settingsNotifEmail = document.getElementById('settingsNotifEmail');
const settingsNotifMarketing = document.getElementById('settingsNotifMarketing');
const currencyDisplay = document.getElementById('currencyDisplay');
const PREFS_STORAGE_KEY = 'ogxbetDemoPrefs';

function getDemoPrefs() {
  const raw = localStorage.getItem(PREFS_STORAGE_KEY);
  return raw ? JSON.parse(raw) : { currency: 'USD', emailNotif: true, marketing: false };
}

function openSettingsModal() {
  const profile = getDemoProfile();
  if (!profile) return;
  settingsUsernameInput.value = profile.username;
  settingsEmailInput.value = profile.email || '';
  const prefs = getDemoPrefs();
  settingsCurrencySelect.value = prefs.currency;
  settingsNotifEmail.checked = prefs.emailNotif;
  settingsNotifMarketing.checked = prefs.marketing;
  showSettingsTab('profile');
  settingsOverlay.classList.add('open');
}
function closeSettingsModal() {
  settingsOverlay.classList.remove('open');
}
function showSettingsTab(tab) {
  settingsTabs.forEach(t => t.classList.toggle('active', t.dataset.settingsTab === tab));
  settingsPanels.forEach(p => p.classList.toggle('hidden', p.dataset.settingsPanel !== tab));
  hideSettingsMessages();
}
function showSettingsError(message) {
  settingsSuccess.classList.remove('show');
  settingsError.textContent = message;
  settingsError.classList.add('show');
}
function showSettingsSuccess(message) {
  settingsError.classList.remove('show');
  settingsSuccess.textContent = message;
  settingsSuccess.classList.add('show');
  setTimeout(() => settingsSuccess.classList.remove('show'), 2500);
}
function hideSettingsMessages() {
  settingsError.classList.remove('show');
  settingsSuccess.classList.remove('show');
}

settingsCloseBtn.addEventListener('click', closeSettingsModal);
settingsOverlay.addEventListener('click', (e) => { if (e.target === settingsOverlay) closeSettingsModal(); });
settingsTabs.forEach(tab => tab.addEventListener('click', () => showSettingsTab(tab.dataset.settingsTab)));

document.querySelector('[data-settings-panel="profile"]').addEventListener('submit', (e) => {
  e.preventDefault();
  if (!settingsUsernameInput.value.trim() || !settingsEmailInput.value.trim()) {
    showSettingsError('Please fill in both fields.');
    return;
  }
  const profile = { username: settingsUsernameInput.value.trim(), email: settingsEmailInput.value.trim() };
  localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(profile));
  renderLoggedInState(profile);
  showSettingsSuccess('Profile updated.');
});

document.querySelector('[data-settings-panel="preferences"]').addEventListener('submit', (e) => {
  e.preventDefault();
  const prefs = {
    currency: settingsCurrencySelect.value,
    emailNotif: settingsNotifEmail.checked,
    marketing: settingsNotifMarketing.checked
  };
  localStorage.setItem(PREFS_STORAGE_KEY, JSON.stringify(prefs));
  currencyDisplay.textContent = `💰 ${prefs.currency}`;
  showSettingsSuccess('Preferences saved.');
});

document.querySelector('[data-settings-panel="security"]').addEventListener('submit', (e) => {
  e.preventDefault();
  const current = document.getElementById('settingsCurrentPassword');
  const next = document.getElementById('settingsNewPassword');
  const confirm = document.getElementById('settingsConfirmPassword');
  if (!current.value || !next.value || !confirm.value) {
    showSettingsError('Please fill in all fields.');
    return;
  }
  if (next.value !== confirm.value) {
    showSettingsError('New passwords do not match.');
    return;
  }
  e.target.reset();
  showSettingsSuccess('Password updated.');
});

(function initDemoPrefs() {
  const prefs = getDemoPrefs();
  if (currencyDisplay) currencyDisplay.textContent = `💰 ${prefs.currency}`;
})();

// ============ TRANSLATIONS ============
const TRANSLATIONS = {
  en: {
    settingsMenuItem: '⚙️ Account Settings', settingsHeading: 'Account Settings',
    settingsTabProfile: 'Profile', settingsTabPreferences: 'Preferences', settingsTabSecurity: 'Security',
    settingsSaveProfile: 'Save Changes', settingsSavePrefs: 'Save Preferences', settingsUpdatePassword: 'Update Password',
    settingsEmailNotif: 'Email Notifications', settingsMarketing: 'Marketing Offers', settingsCurrency: 'Preferred Currency',
    settingsCurrentPassword: 'Current Password', settingsNewPassword: 'New Password',
    authTabLogin: 'Log In', authTabRegister: 'Register',
    authEmailLabel: 'Email or Username', authPasswordLabel: 'Password', authForgot: 'Forgot password?',
    authLoginSubmit: 'Log In', authNoAccount: "Don't have an account?",
    authUsernameLabel: 'Username', authEmailFieldLabel: 'Email', authConfirmPasswordLabel: 'Confirm Password',
    authAgreeTerms: 'I agree to the Terms of Service', authRegisterSubmit: 'Create Account', authHaveAccount: 'Already have an account?',
    authDemoNote: 'This is a UI demo — no real account is created and no data is sent anywhere.', authLogout: 'Log Out',
    installTitle: 'Install App', installSubtitle: 'Get quick access and exclusive bonuses', installAction: 'Install',
    support: 'Support', downloadApp: 'Download App', vipClub: 'VIP Club',
    navCasino: 'Casino', navLiveCasino: 'Live Casino', navSports: 'Sports', navSlots: 'Slots', navPromotions: 'Promotions', navVip: 'VIP',
    searchPlaceholder: 'Search games...', logIn: 'Log In', joinNow: 'Join Now',
    drawerHome: '🏠 Home', drawerCasino: '🎰 Casino', drawerLiveCasino: '🎥 Live Casino', drawerSports: '⚽ Sports', drawerPoker: '🃏 Poker', drawerPromotions: '🎁 Promotions', drawerVipClub: '👑 VIP Club', drawerSupport: '💬 Support',
    ticker1: '🔥 Weekend Reload Bonus — up to 50% extra', ticker2: '🎉 New Player Pack — Welcome Bundle available', ticker3: '🏆 Leaderboard Race — prize pool live now', ticker4: '⚡ Instant Withdrawals — 24/7 processing',
    heroBadge: 'Limited Time Offer', heroTitle1: 'Welcome Bundle', heroTitle2: 'Up To $1,000', heroDesc: 'Plus bonus spins on featured slot titles. New players only — join in under a minute.',
    claimBonus: 'Claim Bonus', browseGames: 'Browse Games',
    statGames: 'Games', statSupport: 'Live Support', statPayout: 'Avg. Payout', statProviders: 'Providers',
    categories: 'Categories', catSlots: '🎰 Slots', catLive: '🎥 Live Casino', catTable: '🃏 Table Games', catJackpots: '🎯 Jackpots', catFishing: '🐟 Fishing', catSportsbook: '⚽ Sportsbook', catNew: '🆕 New Releases',
    providersHeading: 'Providers', vipTitle: '👑 Join the VIP Club', vipDesc: 'Unlock exclusive perks', learnMore: 'Learn More',
    featuredPromotions: 'Featured Promotions', seeAll: 'See all →',
    promoTagNew: 'New', promoTitle1: 'First Deposit Match', promoDesc1: '100% up to $500 + 100 bonus spins', claim: 'Claim',
    promoTagWeekly: 'Weekly', promoTitle2: 'Cashback Friday', promoDesc2: 'Up to 15% cashback on net losses',
    promoTagHot: 'Hot', promoTitle3: 'Refer a Friend', promoDesc3: 'Earn $25 for every friend you invite',
    exploreGames: 'Explore Games', tabAll: 'All', tabSlots: 'Slots', tabLive: 'Live', tabTable: 'Table', tabJackpot: 'Jackpot',
    loadMore: 'Load More Games', jackpotLabel: 'Progressive Jackpot', playNow: 'Play Now',
    trustSSL: '🔒 SSL Secured', trustLicensed: '✅ Licensed &amp; Regulated', trustPayouts: '⚡ Fast Payouts', trustSupport: '🎧 24/7 Support', trust18: '🔞 18+ Responsible Play',
    footerTagline: 'A demo casino UI built for front-end testing and prototyping purposes only. Not a real gambling service.',
    badgeHot: 'HOT', badgeNew: 'NEW', badgeJackpot: 'JACKPOT',
    footerCasinoHeading: 'Casino', catSlots2: 'Slots', catTable2: 'Table Games', catJackpots2: 'Jackpots',
    footerCompanyHeading: 'Company', aboutUs: 'About Us', affiliates: 'Affiliates',
    footerSupportHeading: 'Support', helpCenter: 'Help Center', responsibleGaming: 'Responsible Gaming', termsOfService: 'Terms of Service', privacyPolicy: 'Privacy Policy',
    footerDisclaimer: '⚠️ Demo / placeholder site — for UI development and testing only. No real-money gambling occurs here.',
    footerCopyright: '© 2026 OGXBET Demo. All rights reserved.'
  },
  vi: {
    settingsMenuItem: '⚙️ Cài Đặt Tài Khoản', settingsHeading: 'Cài Đặt Tài Khoản',
    settingsTabProfile: 'Hồ Sơ', settingsTabPreferences: 'Tùy Chọn', settingsTabSecurity: 'Bảo Mật',
    settingsSaveProfile: 'Lưu Thay Đổi', settingsSavePrefs: 'Lưu Tùy Chọn', settingsUpdatePassword: 'Cập Nhật Mật Khẩu',
    settingsEmailNotif: 'Thông Báo Qua Email', settingsMarketing: 'Ưu Đãi Tiếp Thị', settingsCurrency: 'Đơn Vị Tiền Tệ Ưa Thích',
    settingsCurrentPassword: 'Mật Khẩu Hiện Tại', settingsNewPassword: 'Mật Khẩu Mới',
    authTabLogin: 'Đăng Nhập', authTabRegister: 'Đăng Ký',
    authEmailLabel: 'Email hoặc Tên đăng nhập', authPasswordLabel: 'Mật khẩu', authForgot: 'Quên mật khẩu?',
    authLoginSubmit: 'Đăng Nhập', authNoAccount: 'Chưa có tài khoản?',
    authUsernameLabel: 'Tên đăng nhập', authEmailFieldLabel: 'Email', authConfirmPasswordLabel: 'Xác Nhận Mật Khẩu',
    authAgreeTerms: 'Tôi đồng ý với Điều Khoản Dịch Vụ', authRegisterSubmit: 'Tạo Tài Khoản', authHaveAccount: 'Đã có tài khoản?',
    authDemoNote: 'Đây là bản demo giao diện — không có tài khoản thật nào được tạo và không có dữ liệu nào được gửi đi.', authLogout: 'Đăng Xuất',
    installTitle: 'Cài Đặt Ứng Dụng', installSubtitle: 'Truy cập nhanh và ưu đãi độc quyền', installAction: 'Cài Đặt',
    support: 'Hỗ trợ', downloadApp: 'Tải ứng dụng', vipClub: 'Câu lạc bộ VIP',
    navCasino: 'Casino', navLiveCasino: 'Casino Trực Tiếp', navSports: 'Thể Thao', navSlots: 'Slots', navPromotions: 'Khuyến Mãi', navVip: 'VIP',
    searchPlaceholder: 'Tìm kiếm trò chơi...', logIn: 'Đăng Nhập', joinNow: 'Tham Gia Ngay',
    drawerHome: '🏠 Trang Chủ', drawerCasino: '🎰 Casino', drawerLiveCasino: '🎥 Casino Trực Tiếp', drawerSports: '⚽ Thể Thao', drawerPoker: '🃏 Poker', drawerPromotions: '🎁 Khuyến Mãi', drawerVipClub: '👑 Câu Lạc Bộ VIP', drawerSupport: '💬 Hỗ Trợ',
    ticker1: '🔥 Thưởng Nạp Cuối Tuần — thêm tới 50%', ticker2: '🎉 Gói Người Chơi Mới — Ưu Đãi Chào Mừng đang chờ', ticker3: '🏆 Đua Top Bảng Xếp Hạng — quỹ thưởng đang diễn ra', ticker4: '⚡ Rút Tiền Tức Thì — xử lý 24/7',
    heroBadge: 'Ưu Đãi Có Thời Hạn', heroTitle1: 'Gói Chào Mừng', heroTitle2: 'Lên Đến $1,000', heroDesc: 'Cộng thêm vòng quay miễn phí cho các tựa game slot nổi bật. Chỉ dành cho người chơi mới — đăng ký chưa đến một phút.',
    claimBonus: 'Nhận Thưởng', browseGames: 'Xem Trò Chơi',
    statGames: 'Trò Chơi', statSupport: 'Hỗ Trợ Trực Tuyến', statPayout: 'TG Rút Tiền TB', statProviders: 'Nhà Cung Cấp',
    categories: 'Danh Mục', catSlots: '🎰 Slots', catLive: '🎥 Casino Trực Tiếp', catTable: '🃏 Trò Chơi Bàn', catJackpots: '🎯 Jackpot', catFishing: '🐟 Bắn Cá', catSportsbook: '⚽ Cá Cược Thể Thao', catNew: '🆕 Mới Ra Mắt',
    providersHeading: 'Nhà Cung Cấp', vipTitle: '👑 Tham Gia Câu Lạc Bộ VIP', vipDesc: 'Mở khóa đặc quyền riêng', learnMore: 'Tìm Hiểu Thêm',
    featuredPromotions: 'Khuyến Mãi Nổi Bật', seeAll: 'Xem tất cả →',
    promoTagNew: 'Mới', promoTitle1: 'Thưởng Nạp Lần Đầu', promoDesc1: '100% lên đến $500 + 100 vòng quay miễn phí', claim: 'Nhận Ngay',
    promoTagWeekly: 'Hàng Tuần', promoTitle2: 'Hoàn Tiền Thứ Sáu', promoDesc2: 'Hoàn tiền lên đến 15% trên số tiền thua ròng',
    promoTagHot: 'Hot', promoTitle3: 'Giới Thiệu Bạn Bè', promoDesc3: 'Nhận $25 cho mỗi người bạn mời',
    exploreGames: 'Khám Phá Trò Chơi', tabAll: 'Tất Cả', tabSlots: 'Slots', tabLive: 'Trực Tiếp', tabTable: 'Bàn', tabJackpot: 'Jackpot',
    loadMore: 'Xem Thêm Trò Chơi', jackpotLabel: 'Jackpot Lũy Tiến', playNow: 'Chơi Ngay',
    trustSSL: '🔒 Bảo Mật SSL', trustLicensed: '✅ Được Cấp Phép & Quản Lý', trustPayouts: '⚡ Rút Tiền Nhanh', trustSupport: '🎧 Hỗ Trợ 24/7', trust18: '🔞 18+ Chơi Có Trách Nhiệm',
    footerTagline: 'Giao diện casino demo được xây dựng chỉ nhằm mục đích kiểm thử và tạo mẫu front-end. Không phải dịch vụ cá cược thật.',
    badgeHot: 'HOT', badgeNew: 'MỚI', badgeJackpot: 'JACKPOT',
    footerCasinoHeading: 'Casino', catSlots2: 'Slots', catTable2: 'Trò Chơi Bàn', catJackpots2: 'Jackpot',
    footerCompanyHeading: 'Công Ty', aboutUs: 'Về Chúng Tôi', affiliates: 'Đối Tác',
    footerSupportHeading: 'Hỗ Trợ', helpCenter: 'Trung Tâm Trợ Giúp', responsibleGaming: 'Chơi Có Trách Nhiệm', termsOfService: 'Điều Khoản Dịch Vụ', privacyPolicy: 'Chính Sách Bảo Mật',
    footerDisclaimer: '⚠️ Trang demo / giữ chỗ — chỉ dùng để phát triển và kiểm thử giao diện. Không có cá cược tiền thật tại đây.',
    footerCopyright: '© 2026 OGXBET Demo. Đã đăng ký bản quyền.'
  },
  zh: {
    settingsMenuItem: '⚙️ 账户设置', settingsHeading: '账户设置',
    settingsTabProfile: '个人资料', settingsTabPreferences: '偏好设置', settingsTabSecurity: '安全',
    settingsSaveProfile: '保存更改', settingsSavePrefs: '保存偏好', settingsUpdatePassword: '更新密码',
    settingsEmailNotif: '邮件通知', settingsMarketing: '营销优惠信息', settingsCurrency: '首选货币',
    settingsCurrentPassword: '当前密码', settingsNewPassword: '新密码',
    authTabLogin: '登录', authTabRegister: '注册',
    authEmailLabel: '邮箱或用户名', authPasswordLabel: '密码', authForgot: '忘记密码？',
    authLoginSubmit: '登录', authNoAccount: '还没有账户？',
    authUsernameLabel: '用户名', authEmailFieldLabel: '邮箱', authConfirmPasswordLabel: '确认密码',
    authAgreeTerms: '我同意服务条款', authRegisterSubmit: '创建账户', authHaveAccount: '已有账户？',
    authDemoNote: '这是界面演示 — 不会创建真实账户，也不会发送任何数据。', authLogout: '退出登录',
    installTitle: '安装应用', installSubtitle: '快速访问并享受专属优惠', installAction: '安装',
    support: '客服支持', downloadApp: '下载应用', vipClub: 'VIP俱乐部',
    navCasino: '娱乐场', navLiveCasino: '真人娱乐场', navSports: '体育', navSlots: '老虎机', navPromotions: '优惠活动', navVip: 'VIP',
    searchPlaceholder: '搜索游戏...', logIn: '登录', joinNow: '立即加入',
    drawerHome: '🏠 首页', drawerCasino: '🎰 娱乐场', drawerLiveCasino: '🎥 真人娱乐场', drawerSports: '⚽ 体育', drawerPoker: '🃏 扑克', drawerPromotions: '🎁 优惠活动', drawerVipClub: '👑 VIP俱乐部', drawerSupport: '💬 客服支持',
    ticker1: '🔥 周末回存红利 — 最高额外50%', ticker2: '🎉 新玩家礼包 — 欢迎礼金现已开放', ticker3: '🏆 排行榜竞赛 — 奖池实时更新', ticker4: '⚡ 即时提款 — 24/7全天处理',
    heroBadge: '限时优惠', heroTitle1: '欢迎礼金', heroTitle2: '最高$1,000', heroDesc: '另享精选老虎机免费旋转。仅限新玩家 — 不到一分钟即可完成注册。',
    claimBonus: '领取奖金', browseGames: '浏览游戏',
    statGames: '游戏数量', statSupport: '在线客服', statPayout: '平均提款时间', statProviders: '游戏供应商',
    categories: '游戏分类', catSlots: '🎰 老虎机', catLive: '🎥 真人娱乐场', catTable: '🃏 桌上游戏', catJackpots: '🎯 累积奖池', catFishing: '🐟 捕鱼游戏', catSportsbook: '⚽ 体育博彩', catNew: '🆕 新游戏',
    providersHeading: '游戏供应商', vipTitle: '👑 加入VIP俱乐部', vipDesc: '解锁专属特权', learnMore: '了解更多',
    featuredPromotions: '精选优惠', seeAll: '查看全部 →',
    promoTagNew: '新', promoTitle1: '首存红利', promoDesc1: '100%最高$500 + 100次免费旋转', claim: '领取',
    promoTagWeekly: '每周', promoTitle2: '周五返水', promoDesc2: '净亏损最高返还15%',
    promoTagHot: '热门', promoTitle3: '邀请好友', promoDesc3: '每邀请一位好友即可获得$25',
    exploreGames: '探索游戏', tabAll: '全部', tabSlots: '老虎机', tabLive: '真人', tabTable: '桌上游戏', tabJackpot: '累积奖池',
    loadMore: '加载更多游戏', jackpotLabel: '累积奖池', playNow: '立即游玩',
    trustSSL: '🔒 SSL加密', trustLicensed: '✅ 持牌合规运营', trustPayouts: '⚡ 快速提款', trustSupport: '🎧 24/7客服', trust18: '🔞 18+ 理性游戏',
    footerTagline: '此为演示用娱乐场界面，仅供前端测试与原型开发使用，并非真实博彩服务。',
    badgeHot: '热门', badgeNew: '新', badgeJackpot: '奖池',
    footerCasinoHeading: '娱乐场', catSlots2: '老虎机', catTable2: '桌上游戏', catJackpots2: '累积奖池',
    footerCompanyHeading: '公司', aboutUs: '关于我们', affiliates: '联盟合作',
    footerSupportHeading: '客服支持', helpCenter: '帮助中心', responsibleGaming: '理性博彩', termsOfService: '服务条款', privacyPolicy: '隐私政策',
    footerDisclaimer: '⚠️ 演示/占位网站 — 仅用于界面开发与测试，本站不涉及真实金钱博彩。',
    footerCopyright: '© 2026 OGXBET Demo. 保留所有权利。'
  },
  ms: {
    settingsMenuItem: '⚙️ Tetapan Akaun', settingsHeading: 'Tetapan Akaun',
    settingsTabProfile: 'Profil', settingsTabPreferences: 'Keutamaan', settingsTabSecurity: 'Keselamatan',
    settingsSaveProfile: 'Simpan Perubahan', settingsSavePrefs: 'Simpan Keutamaan', settingsUpdatePassword: 'Kemas Kini Kata Laluan',
    settingsEmailNotif: 'Pemberitahuan E-mel', settingsMarketing: 'Tawaran Pemasaran', settingsCurrency: 'Mata Wang Pilihan',
    settingsCurrentPassword: 'Kata Laluan Semasa', settingsNewPassword: 'Kata Laluan Baharu',
    authTabLogin: 'Log Masuk', authTabRegister: 'Daftar',
    authEmailLabel: 'E-mel atau Nama Pengguna', authPasswordLabel: 'Kata Laluan', authForgot: 'Lupa kata laluan?',
    authLoginSubmit: 'Log Masuk', authNoAccount: 'Belum ada akaun?',
    authUsernameLabel: 'Nama Pengguna', authEmailFieldLabel: 'E-mel', authConfirmPasswordLabel: 'Sahkan Kata Laluan',
    authAgreeTerms: 'Saya bersetuju dengan Terma Perkhidmatan', authRegisterSubmit: 'Cipta Akaun', authHaveAccount: 'Sudah ada akaun?',
    authDemoNote: 'Ini ialah demo antara muka — tiada akaun sebenar dicipta dan tiada data dihantar ke mana-mana.', authLogout: 'Log Keluar',
    installTitle: 'Pasang Aplikasi', installSubtitle: 'Akses pantas dan bonus eksklusif', installAction: 'Pasang',
    support: 'Sokongan', downloadApp: 'Muat Turun Aplikasi', vipClub: 'Kelab VIP',
    navCasino: 'Kasino', navLiveCasino: 'Kasino Langsung', navSports: 'Sukan', navSlots: 'Slot', navPromotions: 'Promosi', navVip: 'VIP',
    searchPlaceholder: 'Cari permainan...', logIn: 'Log Masuk', joinNow: 'Sertai Sekarang',
    drawerHome: '🏠 Laman Utama', drawerCasino: '🎰 Kasino', drawerLiveCasino: '🎥 Kasino Langsung', drawerSports: '⚽ Sukan', drawerPoker: '🃏 Poker', drawerPromotions: '🎁 Promosi', drawerVipClub: '👑 Kelab VIP', drawerSupport: '💬 Sokongan',
    ticker1: '🔥 Bonus Muat Semula Hujung Minggu — tambahan sehingga 50%', ticker2: '🎉 Pek Pemain Baharu — Bonus Sambutan kini tersedia', ticker3: '🏆 Pertandingan Papan Pendahulu — kolam hadiah sedang berlangsung', ticker4: '⚡ Pengeluaran Segera — pemprosesan 24/7',
    heroBadge: 'Tawaran Masa Terhad', heroTitle1: 'Bonus Sambutan', heroTitle2: 'Sehingga $1,000', heroDesc: 'Ditambah putaran percuma pada slot pilihan. Untuk pemain baharu sahaja — daftar dalam masa kurang seminit.',
    claimBonus: 'Tuntut Bonus', browseGames: 'Lihat Permainan',
    statGames: 'Permainan', statSupport: 'Sokongan Langsung', statPayout: 'Purata Bayaran', statProviders: 'Pembekal',
    categories: 'Kategori', catSlots: '🎰 Slot', catLive: '🎥 Kasino Langsung', catTable: '🃏 Permainan Meja', catJackpots: '🎯 Jackpot', catFishing: '🐟 Tembak Ikan', catSportsbook: '⚽ Pertaruhan Sukan', catNew: '🆕 Terbaharu',
    providersHeading: 'Pembekal', vipTitle: '👑 Sertai Kelab VIP', vipDesc: 'Buka kelebihan eksklusif', learnMore: 'Ketahui Lebih Lanjut',
    featuredPromotions: 'Promosi Pilihan', seeAll: 'Lihat semua →',
    promoTagNew: 'Baharu', promoTitle1: 'Padanan Deposit Pertama', promoDesc1: '100% sehingga $500 + 100 putaran percuma', claim: 'Tuntut',
    promoTagWeekly: 'Mingguan', promoTitle2: 'Cashback Jumaat', promoDesc2: 'Cashback sehingga 15% daripada kerugian bersih',
    promoTagHot: 'Popular', promoTitle3: 'Jemput Rakan', promoDesc3: 'Peroleh $25 untuk setiap rakan yang anda jemput',
    exploreGames: 'Terokai Permainan', tabAll: 'Semua', tabSlots: 'Slot', tabLive: 'Langsung', tabTable: 'Meja', tabJackpot: 'Jackpot',
    loadMore: 'Muat Lagi Permainan', jackpotLabel: 'Jackpot Progresif', playNow: 'Main Sekarang',
    trustSSL: '🔒 Selamat dengan SSL', trustLicensed: '✅ Berlesen & Dikawal Selia', trustPayouts: '⚡ Bayaran Pantas', trustSupport: '🎧 Sokongan 24/7', trust18: '🔞 18+ Bermain Secara Bertanggungjawab',
    footerTagline: 'Antara muka kasino demo ini dibina khas untuk tujuan ujian front-end dan prototaip sahaja. Bukan perkhidmatan perjudian sebenar.',
    badgeHot: 'POPULAR', badgeNew: 'BAHARU', badgeJackpot: 'JACKPOT',
    footerCasinoHeading: 'Kasino', catSlots2: 'Slot', catTable2: 'Permainan Meja', catJackpots2: 'Jackpot',
    footerCompanyHeading: 'Syarikat', aboutUs: 'Tentang Kami', affiliates: 'Ahli Gabungan',
    footerSupportHeading: 'Sokongan', helpCenter: 'Pusat Bantuan', responsibleGaming: 'Permainan Bertanggungjawab', termsOfService: 'Terma Perkhidmatan', privacyPolicy: 'Dasar Privasi',
    footerDisclaimer: '⚠️ Laman demo / tempat letak — untuk pembangunan dan ujian antara muka sahaja. Tiada perjudian wang sebenar berlaku di sini.',
    footerCopyright: '© 2026 OGXBET Demo. Hak cipta terpelihara.'
  },
  th: {
    settingsMenuItem: '⚙️ ตั้งค่าบัญชี', settingsHeading: 'ตั้งค่าบัญชี',
    settingsTabProfile: 'โปรไฟล์', settingsTabPreferences: 'การตั้งค่า', settingsTabSecurity: 'ความปลอดภัย',
    settingsSaveProfile: 'บันทึกการเปลี่ยนแปลง', settingsSavePrefs: 'บันทึกการตั้งค่า', settingsUpdatePassword: 'อัปเดตรหัสผ่าน',
    settingsEmailNotif: 'การแจ้งเตือนทางอีเมล', settingsMarketing: 'ข้อเสนอทางการตลาด', settingsCurrency: 'สกุลเงินที่ต้องการ',
    settingsCurrentPassword: 'รหัสผ่านปัจจุบัน', settingsNewPassword: 'รหัสผ่านใหม่',
    authTabLogin: 'เข้าสู่ระบบ', authTabRegister: 'สมัครสมาชิก',
    authEmailLabel: 'อีเมลหรือชื่อผู้ใช้', authPasswordLabel: 'รหัสผ่าน', authForgot: 'ลืมรหัสผ่าน?',
    authLoginSubmit: 'เข้าสู่ระบบ', authNoAccount: 'ยังไม่มีบัญชี?',
    authUsernameLabel: 'ชื่อผู้ใช้', authEmailFieldLabel: 'อีเมล', authConfirmPasswordLabel: 'ยืนยันรหัสผ่าน',
    authAgreeTerms: 'ฉันยอมรับข้อกำหนดการให้บริการ', authRegisterSubmit: 'สร้างบัญชี', authHaveAccount: 'มีบัญชีอยู่แล้ว?',
    authDemoNote: 'นี่คือหน้าตาตัวอย่างเท่านั้น — ไม่มีการสร้างบัญชีจริงและไม่มีการส่งข้อมูลใด ๆ', authLogout: 'ออกจากระบบ',
    installTitle: 'ติดตั้งแอป', installSubtitle: 'เข้าถึงได้รวดเร็วพร้อมโบนัสสุดพิเศษ', installAction: 'ติดตั้ง',
    support: 'ฝ่ายสนับสนุน', downloadApp: 'ดาวน์โหลดแอป', vipClub: 'คลับ VIP',
    navCasino: 'คาสิโน', navLiveCasino: 'คาสิโนสด', navSports: 'กีฬา', navSlots: 'สล็อต', navPromotions: 'โปรโมชั่น', navVip: 'VIP',
    searchPlaceholder: 'ค้นหาเกม...', logIn: 'เข้าสู่ระบบ', joinNow: 'สมัครเลย',
    drawerHome: '🏠 หน้าแรก', drawerCasino: '🎰 คาสิโน', drawerLiveCasino: '🎥 คาสิโนสด', drawerSports: '⚽ กีฬา', drawerPoker: '🃏 โป๊กเกอร์', drawerPromotions: '🎁 โปรโมชั่น', drawerVipClub: '👑 คลับ VIP', drawerSupport: '💬 ฝ่ายสนับสนุน',
    ticker1: '🔥 โบนัสเติมเงินวันหยุดสุดสัปดาห์ — เพิ่มสูงสุด 50%', ticker2: '🎉 แพ็กผู้เล่นใหม่ — โบนัสต้อนรับพร้อมให้รับแล้ว', ticker3: '🏆 การแข่งขันอันดับ — เงินรางวัลกำลังสะสม', ticker4: '⚡ ถอนเงินทันที — ดำเนินการตลอด 24 ชั่วโมง',
    heroBadge: 'ข้อเสนอมีเวลาจำกัด', heroTitle1: 'โบนัสต้อนรับ', heroTitle2: 'สูงสุด $1,000', heroDesc: 'พร้อมฟรีสปินสำหรับเกมสล็อตแนะนำ สำหรับผู้เล่นใหม่เท่านั้น — สมัครใช้เวลาไม่ถึงหนึ่งนาที',
    claimBonus: 'รับโบนัส', browseGames: 'ดูเกมทั้งหมด',
    statGames: 'เกม', statSupport: 'ฝ่ายสนับสนุนสด', statPayout: 'เวลาถอนเฉลี่ย', statProviders: 'ผู้ให้บริการเกม',
    categories: 'หมวดหมู่', catSlots: '🎰 สล็อต', catLive: '🎥 คาสิโนสด', catTable: '🃏 เกมโต๊ะ', catJackpots: '🎯 แจ็คพอต', catFishing: '🐟 เกมยิงปลา', catSportsbook: '⚽ พนันกีฬา', catNew: '🆕 เกมใหม่ล่าสุด',
    providersHeading: 'ผู้ให้บริการเกม', vipTitle: '👑 เข้าร่วมคลับ VIP', vipDesc: 'ปลดล็อกสิทธิพิเศษเฉพาะสมาชิก', learnMore: 'ดูเพิ่มเติม',
    featuredPromotions: 'โปรโมชั่นแนะนำ', seeAll: 'ดูทั้งหมด →',
    promoTagNew: 'ใหม่', promoTitle1: 'โบนัสฝากครั้งแรก', promoDesc1: '100% สูงสุด $500 + ฟรีสปิน 100 ครั้ง', claim: 'รับสิทธิ์',
    promoTagWeekly: 'รายสัปดาห์', promoTitle2: 'คืนเงินวันศุกร์', promoDesc2: 'คืนเงินสูงสุด 15% จากยอดขาดทุนสุทธิ',
    promoTagHot: 'ยอดนิยม', promoTitle3: 'แนะนำเพื่อน', promoDesc3: 'รับ $25 สำหรับทุกคนที่คุณเชิญ',
    exploreGames: 'สำรวจเกม', tabAll: 'ทั้งหมด', tabSlots: 'สล็อต', tabLive: 'คาสิโนสด', tabTable: 'เกมโต๊ะ', tabJackpot: 'แจ็คพอต',
    loadMore: 'โหลดเกมเพิ่มเติม', jackpotLabel: 'แจ็คพอตสะสม', playNow: 'เล่นเลย',
    trustSSL: '🔒 ปลอดภัยด้วย SSL', trustLicensed: '✅ ได้รับใบอนุญาตถูกต้อง', trustPayouts: '⚡ ถอนเงินรวดเร็ว', trustSupport: '🎧 บริการตลอด 24 ชม.', trust18: '🔞 อายุ 18+ เล่นอย่างมีความรับผิดชอบ',
    footerTagline: 'หน้าตาคาสิโนตัวอย่างนี้สร้างขึ้นเพื่อการทดสอบส่วนหน้าเว็บไซต์และการสร้างต้นแบบเท่านั้น ไม่ใช่บริการการพนันจริง',
    badgeHot: 'ยอดนิยม', badgeNew: 'ใหม่', badgeJackpot: 'แจ็คพอต',
    footerCasinoHeading: 'คาสิโน', catSlots2: 'สล็อต', catTable2: 'เกมโต๊ะ', catJackpots2: 'แจ็คพอต',
    footerCompanyHeading: 'บริษัท', aboutUs: 'เกี่ยวกับเรา', affiliates: 'พันธมิตร',
    footerSupportHeading: 'ฝ่ายสนับสนุน', helpCenter: 'ศูนย์ช่วยเหลือ', responsibleGaming: 'การเล่นอย่างมีความรับผิดชอบ', termsOfService: 'ข้อกำหนดการให้บริการ', privacyPolicy: 'นโยบายความเป็นส่วนตัว',
    footerDisclaimer: '⚠️ เว็บไซต์ตัวอย่าง/ทดสอบ — ใช้สำหรับการพัฒนาและทดสอบหน้าตาเว็บเท่านั้น ไม่มีการพนันด้วยเงินจริงเกิดขึ้นที่นี่',
    footerCopyright: '© 2026 OGXBET Demo สงวนลิขสิทธิ์'
  }
};

let currentLang = 'en';

function applyTranslations(lang) {
  currentLang = lang;
  const dict = TRANSLATIONS[lang] || TRANSLATIONS.en;
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.dataset.i18n;
    if (dict[key]) el.innerHTML = dict[key];
  });
  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    const key = el.dataset.i18nPlaceholder;
    if (dict[key]) el.placeholder = dict[key];
  });
  document.documentElement.lang = lang;
  renderGames();
}

const existingDemoProfile = getDemoProfile();
if (existingDemoProfile) renderLoggedInState(existingDemoProfile);

// ============ LANGUAGE SELECTOR ============
const langSelect = document.getElementById('langSelect');
const langCurrentBtn = document.getElementById('langCurrentBtn');
const langMenu = document.getElementById('langMenu');
const langCurrentFlag = document.getElementById('langCurrentFlag');
const langCurrentLabel = document.getElementById('langCurrentLabel');

langCurrentBtn.addEventListener('click', (e) => {
  e.stopPropagation();
  const isOpen = langSelect.classList.toggle('open');
  langCurrentBtn.setAttribute('aria-expanded', isOpen);
});

langMenu.querySelectorAll('button').forEach(btn => {
  btn.addEventListener('click', () => {
    langCurrentFlag.textContent = btn.dataset.flag;
    langCurrentLabel.textContent = btn.dataset.label;
    langMenu.querySelectorAll('button').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    langSelect.classList.remove('open');
    langCurrentBtn.setAttribute('aria-expanded', 'false');
    applyTranslations(btn.dataset.lang);
  });
});

document.addEventListener('click', (e) => {
  if (!langSelect.contains(e.target)) {
    langSelect.classList.remove('open');
    langCurrentBtn.setAttribute('aria-expanded', 'false');
  }
});

// ============ HERO DOTS AUTO-ROTATE ============
const dots = document.querySelectorAll('.hero-dots .dot');
let dotIndex = 0;
setInterval(() => {
  dots[dotIndex].classList.remove('active');
  dotIndex = (dotIndex + 1) % dots.length;
  dots[dotIndex].classList.add('active');
}, 3500);

// ============ GAME DATA (placeholder demo content) ============
const GAME_ICONS = ['🎰', '🍒', '💎', '🃏', '🎲', '🐉', '👑', '🍀', '⭐', '🔔', '🦁', '🐯', '🍇', '🎯', '🥇'];
const PROVIDERS = ['Starforge', 'NovaPlay', 'RedTiger Labs', 'PixelWin', 'GoldenRock'];
const CATEGORIES = ['slots', 'live', 'table', 'jackpot'];
const CATEGORY_LABEL_KEY = { slots: 'tabSlots', live: 'navLiveCasino', table: 'catTable2', jackpot: 'tabJackpot' };
function categoryLabel(category) {
  const dict = TRANSLATIONS[currentLang] || TRANSLATIONS.en;
  return dict[CATEGORY_LABEL_KEY[category]];
}
const BADGE_LABEL_KEY = { hot: 'badgeHot', new: 'badgeNew', jackpot: 'badgeJackpot' };
function badgeLabel(badge) {
  const dict = TRANSLATIONS[currentLang] || TRANSLATIONS.en;
  return dict[BADGE_LABEL_KEY[badge]];
}
const NAME_PARTS_A = ['Golden', 'Wild', 'Mystic', 'Royal', 'Fortune', 'Blazing', 'Crystal', 'Neon', 'Ancient', 'Diamond'];
const NAME_PARTS_B = ['Reels', 'Riches', 'Fortune', 'Vault', 'Strike', 'Empire', 'Quest', 'Rush', 'Kingdom', 'Odyssey'];

function generateGames(count) {
  const games = [];
  for (let i = 0; i < count; i++) {
    const category = CATEGORIES[Math.floor(Math.random() * CATEGORIES.length)];
    const badgeRoll = Math.random();
    let badge = null;
    if (badgeRoll < 0.15) badge = 'hot';
    else if (badgeRoll < 0.3) badge = 'new';
    else if (category === 'jackpot') badge = 'jackpot';

    games.push({
      name: `${NAME_PARTS_A[Math.floor(Math.random() * NAME_PARTS_A.length)]} ${NAME_PARTS_B[Math.floor(Math.random() * NAME_PARTS_B.length)]}`,
      provider: PROVIDERS[Math.floor(Math.random() * PROVIDERS.length)],
      icon: GAME_ICONS[Math.floor(Math.random() * GAME_ICONS.length)],
      category,
      badge
    });
  }
  return games;
}

let allGames = generateGames(20);
let visibleCount = 10;
let activeFilter = 'all';

const gameGrid = document.getElementById('gameGrid');
const loadMoreBtn = document.getElementById('loadMoreBtn');
const tabs = document.querySelectorAll('.tab');

function renderGames() {
  const filtered = activeFilter === 'all'
    ? allGames
    : allGames.filter(g => g.category === activeFilter);

  const toShow = filtered.slice(0, visibleCount);
  gameGrid.innerHTML = toShow.map(game => `
    <div class="game-card">
      <div class="game-thumb">
        ${game.badge ? `<span class="game-badge badge-${game.badge}">${badgeLabel(game.badge)}</span>` : ''}
        <span>${game.icon}</span>
        <div class="play-overlay"><span class="play-btn">▶</span></div>
      </div>
      <div class="game-info">
        <h4>${game.name}</h4>
        <span>${game.provider} · ${categoryLabel(game.category)}</span>
      </div>
    </div>
  `).join('');

  loadMoreBtn.style.display = filtered.length > visibleCount ? 'inline-flex' : 'none';
}

tabs.forEach(tab => {
  tab.addEventListener('click', () => {
    tabs.forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    activeFilter = tab.dataset.filter;
    visibleCount = 10;
    renderGames();
  });
});

loadMoreBtn.addEventListener('click', () => {
  visibleCount += 10;
  if (visibleCount > allGames.length) {
    allGames = allGames.concat(generateGames(10));
  }
  renderGames();
});

renderGames();

// ============ JACKPOT TICKER ============
const jackpotEl = document.getElementById('jackpotAmount');
let jackpotValue = 1284502.17;
setInterval(() => {
  jackpotValue += Math.random() * 8;
  jackpotEl.textContent = '$' + jackpotValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}, 1200);
