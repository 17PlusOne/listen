# 听见 Listen · 跑通工作日志(Round 1)

> 跑通日期:2026-05-12
> 环境:本地 next dev,placeholder GEMINI_API_KEY,无 KV
> 工具:Playwright headless + 截图

## 已验证可用的环节(不需要改)

- ✅ 首页中文 Hero / 价值 / 引文 / 严肃性 区(无报错)
- ✅ 首页英文(EN 切换 h1/价值卡/严肃性 全切)
- ✅ 模板卡片点击 → 跳 `/login?redirect=/setup?template=<id>` 正确
- ✅ 登录成功 → 跳回 `/setup?template=brand-deal-decision` 正确
- ✅ **模板预填**:研究名/研究问题/描述/5 profile/5 questions/6 topics 全部正确注入
- ✅ Generate Participant Link 成功(JWT 包含全配置)
- ✅ 受访者 Consent 页(手机视口):纸感、双语、4 步说明、隐私保护卡完美
- ✅ StudyList(我的研究):全中文、纸感、KV 警告优雅
- ✅ Dashboard(访谈仪表台):全中文、纸感、空状态优雅

## 需要修复的断点

### 视觉一致性(严重)

- ❌ **#2 首页底部 CTA 区黑底白字** —— 与纸感全站不一致(`<section class="bg-listen-paperDeep ...">` 之后的 dark 段)
- ❌ **#19 Settings 页整页黑底白字** + 全英文 + 无 BrandHeader
- ❌ **#20 Export 页整页黑底白字** + 全英文 + 无 BrandHeader
- ❌ **#18 Synthesis 页全英文** + 无 BrandHeader

### StudySetup 大量英文文案(严重)

- ❌ **#6** 顶栏 "Study Setup" / "Load Example" / "Save Study" / "Preview" / "Configure your research interview study"
- ❌ **#7** 区块标题:Study Details / Profile Fields / Core Questions / Topic Areas / AI Provider / Model / AI Reasoning Mode / AI Interview Style / Link Settings / Consent Text / Participant Link
- ❌ **#8** 字段标签:Study Name / Research Question / Description (optional) / Quick add / Current Role / Industry / Years of Experience / Team Size / Location / REQ / OPT / Add Custom / Add Question / Add Topic / Generate Participant Link / Start Interview
- ❌ **#9** AI Behavior 三选项 + 描述
- ❌ **#10** Link Expiration 选项 + Consent Text label + AI 模型 desc

### 体验逻辑(严重)

- ❌ **#13 保存研究弹「Save Failed」** —— 因为无 KV 时保存失败但链接生成成功,UI 显示矛盾。应该明确告诉用户「未配 KV → 链接是自包含的 JWT,无需保存到服务器」
- ❌ **#17 加载示例研究按钮 disabled** —— 当 kvWarning 存在时,「加载示例」也被禁用,导致评审用例完全跑不起来。SUBMISSION.md 承诺了「无 KV 也能用示例研究」,这里直接打脸
- ❌ **#14 真实受访者通过 token 链接进入显示「Preview Mode - Participant View」** —— `/p/[token]` 入口把 viewMode 设为 'participant',与 StudySetup 的 Preview 按钮共用同一个 viewMode,导致 PreviewBanner 错误显示。需要引入独立的 `isPreview` 状态

### 体验细节

- ❌ **#5 locale 不持久化**:点击切换器后,localStorage 没存,刷新页面会丢失语言选择
- ❌ **#11** StudySetup 内 toggle/radio 选中态颜色还是 stone 灰,不是 listen accent
- ❌ **#12** Profile Field 卡片 REQ/OPT 徽章风格突兀

### 残留品牌

- 旧 README 留存为 `docs/legacy-readme.md.bak` (含 OpenInterviewer 名字)— 应直接 git rm

## 修复优先级(按 Round 排序)

**Round 2 立刻修(影响评审一进首页就翻车的):**
1. #17 加载示例禁用 → 改条件,KV 警告不阻塞示例加载
2. #13 Save Failed 提示 → 优雅降级文案
3. #14 PreviewBanner 错显 → 加 isPreview 状态

**Round 3 i18n + 纸感(花时间):**
4. #18 #19 #20 Synthesis/Settings/Export 整体重绘 + i18n
5. #6 #7 #8 #9 #10 StudySetup 全量 i18n
6. #2 首页底部 CTA 区改纸感
7. #11 #12 微调

**Round 4 清理:**
8. #5 locale 持久化
9. 删除 docs/legacy-readme.md.bak
10. metadata 检查
