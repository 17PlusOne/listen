# 听见 Listen · 部署清单

> Vercel 一键部署 · 评审环境就绪
> 预计耗时:**10 分钟**(含 Vercel KV 配置)
> 必须项打 ⚠️,可选项打 ◎

---

## 1. 环境变量速查表

| 变量 | 必须 | 用途 | 获取方式 |
|------|------|------|---------|
| `GEMINI_API_KEY` | ⚠️ 必填 | 驱动访谈员「听见」的对话与聚合分析 | [aistudio.google.com/apikey](https://aistudio.google.com/apikey) 免费申请 |
| `ADMIN_PASSWORD` | ⚠️ 必填 | 研究员后台登录密码(自己设,至少 12 位) | 自己设,避免使用真实业务密码 |
| `JWT_SECRET` | ⚠️ 必填 | 签发管理员 session,保护后台路由 | `openssl rand -base64 32` 生成 |
| `BCRYPT_PEPPER` | ⚠️ 必填 | 密码加盐用,部署后不可更改 | `openssl rand -base64 32` 生成 |
| `ANTHROPIC_API_KEY` | ◎ 可选 | 如果要切换到 Claude 做访谈 | [console.anthropic.com](https://console.anthropic.com) |
| `AI_PROVIDER` | ◎ 可选 | `gemini`(默认)或 `claude` | 默认走 Gemini 即可 |
| `AI_MODEL` | ◎ 可选 | 覆盖默认模型选择 | 见 README 模型说明 |
| `KV_REST_API_URL` | ◎ 强烈建议 | Vercel KV(Upstash Redis)持久化研究与访谈 | Vercel Storage 自动注入 |
| `KV_REST_API_TOKEN` | ◎ 强烈建议 | 同上 | Vercel Storage 自动注入 |

**关于 KV:** 不配置 KV 时项目仍可运行,但**研究和访谈不会持久化**(刷新页面即消失),仅适合 Demo 演示。**评审建议配 KV**,因为示例数据需要在多次访问间稳定存在。

---

## 2. Vercel 一键部署(评审推荐路径)

### Step 1:Fork 仓库
访问 [github.com/17PlusOne/listen](https://github.com/17PlusOne/listen) → 右上角 **Fork** 到评审自己的 GitHub 账号。

### Step 2:导入到 Vercel
1. 登录 [vercel.com](https://vercel.com) → **Add New** → **Project**
2. 选 Fork 后的 `listen` 仓库 → **Import**
3. Framework Preset 自动识别为 **Next.js**,无需更改

### Step 3:填写环境变量
在 Vercel 导入页的 **Environment Variables** 区粘贴以下四条必填项:

```
GEMINI_API_KEY=你的_gemini_key
ADMIN_PASSWORD=你设的_12 位以上密码
JWT_SECRET=openssl_随机生成_的 32 字节 base64
BCRYPT_PEPPER=openssl_随机生成_的另一个 32 字节 base64
```

**生成 JWT_SECRET / BCRYPT_PEPPER 的快速方法**(任一终端):
```bash
openssl rand -base64 32
# 跑两次,各复制一份
```

### Step 4:点击 Deploy
等待 ~ 2 - 3 分钟。

### Step 5:配置 Vercel KV(强烈建议)
1. 进入项目 → **Storage** 标签 → **Create Database**
2. 选 **KV (Powered by Upstash)** → **Create**
3. Vercel 会自动把 `KV_REST_API_URL` / `KV_REST_API_TOKEN` 等环境变量注入项目
4. 回到项目 → **Deployments** → 右上角 **Redeploy**(让 KV 生效)

### Step 6:首次登录
- 访问部署后的 URL(形如 `https://listen-xxxxx.vercel.app`)
- 点击右上角「研究员登录」
- 输入 Step 3 设的 `ADMIN_PASSWORD`
- 进入后台 → 点击「加载示例研究」→ 立即看到「创作者退潮归因深访」+ 3 段访谈 + 聚合报告

---

## 3. 评审验收清单(15 分钟跑完所有路径)

| 序号 | 检查项 | 通过条件 |
|------|--------|---------|
| 1 | 落地页 zh/en 切换 | 右上角语言切换器即时切换,无刷新 |
| 2 | 三大模板卡片可点击 | 点击「商单决策深访」跳转至登录页,redirect 参数携带 template id |
| 3 | 登录成功后表单预填 | 登录后跳到 `/setup?template=brand-deal-decision`,表单 11 个字段已自动填充 |
| 4 | 示例研究一键加载 | StudyList 页点「加载示例研究」→ 3 段访谈 + 1 份聚合报告全部可见 |
| 5 | 单访谈洞察拆分正确 | 点击「小晚」的访谈记录 → 看到 stated / revealed 两栏分离 |
| 6 | 跨样本聚合可读 | 点击「跨样本聚合」→ 三主题 + 两分歧 + 五关键发现完整展示 |
| 7 | 生成参与者链接 | 在示例研究详情页 → 生成链接 → 复制到无痕窗口可直接进入访谈 |
| 8 | 真人访谈第三层追问 | 在参与者端简短回答「最近有点累」→ AI 必须在 3 轮内追问到具体事件,而非泛泛安慰 |
| 9 | 受访者中途退出 | 任一访谈轮次结束后关闭浏览器 → 已存的回答仍可在后台看到(若配 KV) |
| 10 | 知情同意页可读 | 受访者链接首屏 = 中文知情同意,语气温和不法律化 |

---

## 4. 常见排查

### Q1:登录提示密码错误,但我确定填对了
- 检查环境变量 `ADMIN_PASSWORD` 是否含尾部空格或换行(Vercel UI 复制时易混入)
- 检查 `JWT_SECRET` / `BCRYPT_PEPPER` 是否都已配置,任一缺失会触发认证 500

### Q2:Demo 数据加载后,刷新页面就消失了
- 这是因为没有配置 Vercel KV。**评审环境强烈建议按 Step 5 配 KV**,否则只能使用 sessionStorage 临时演示

### Q3:访谈中途 AI 突然报错
- 检查 `GEMINI_API_KEY` 是否在 Google AI Studio 还有配额
- 检查 Vercel 的 Function Logs 看具体错误码 —— 通常是 429(限速)或 401(key 失效)

### Q4:中英文切换后部分页面没翻译
- 后台部分次级页面(StudySetup / Synthesis 详情页)i18n 覆盖未达 100%,这是提交窗口期的已知取舍,评审主路径(落地页 / 登录 / StudyList / Dashboard / Consent / InterviewChat / 模板卡)均已 100% 双语

### Q5:想用 Claude 而不是 Gemini
- 加环境变量 `ANTHROPIC_API_KEY=你的_claude_key`
- 加 `AI_PROVIDER=claude`
- 重新部署即可

---

## 5. 安全与合规备注

- **API key 全程服务端**:`GEMINI_API_KEY` 和 `ANTHROPIC_API_KEY` 只在 Next.js Route Handlers 内使用,从未下发到浏览器
- **密码不可逆**:`ADMIN_PASSWORD` 在首次登录时用 bcrypt + `BCRYPT_PEPPER` 哈希,Vercel KV 里不存储明文
- **JWT 短期有效**:管理员 session 有效期 24h,过期自动登出
- **参与者链接可过期**:研究详情页可设置链接有效期(永久 / 7 天 / 30 天 / 90 天)
- **不收集真实账号**:参与者端没有任何登录环节,创作者只通过 token 链接进入,完成后链接可被研究员手动失效

---

## 6. 本地开发(可选)

```bash
git clone https://github.com/17PlusOne/listen.git
cd listen
npm install

# 创建 .env.local
cat > .env.local <<EOF
GEMINI_API_KEY=你的_gemini_key
ADMIN_PASSWORD=本地测试密码
JWT_SECRET=$(openssl rand -base64 32)
BCRYPT_PEPPER=$(openssl rand -base64 32)
EOF

npm run dev
# 访问 http://localhost:3000
```

本地开发模式下,数据存于内存,**进程重启会全部清空** —— 这是预期行为,适合快速迭代。

---

## 7. 联系

部署遇到任何问题,可直接联系提交人(见 SUBMISSION.md 末尾)。

提交时间:2026 Q2
最后更新:见 commit log
