# 听见 Listen

> 给创作者经济的 AI 深度访谈室

听见 Listen 是一个面向创作者经济场景的研究员工作台。研究员在后台 5 分钟配置一个研究 → 生成可分享链接 → 创作者与访谈员「听见」一对一对话 → 自动产出 stated / revealed 双栏洞察 + 跨样本聚合报告。

**作者:** RED · Finance 团队
**提交时间:** 2026 Q2

---

## 三大开箱模板

| 模板 | 场景 | 主要研究问题 |
|------|------|------|
| **商单决策深访** | 商业化 | 同样的预算,创作者为什么有的接有的拒?把模糊的「看情况」追到第三层 |
| **创作者退潮归因** | 留存 | 过去 60 天发文量下降 ≥ 30% 的创作者,Dashboard 不会告诉你的那些原因 |
| **新人扶持期望** | 新人 | 入驻 90 天内最影响留存的那一次对话 / 一次推荐 / 一次失望 |

---

## 快速开始

### 评审 / 部署
请直接参阅 [DEPLOYMENT.md](./DEPLOYMENT.md) —— 10 分钟在 Vercel 上跑起来。

### 作品提交说明
请直接参阅 [SUBMISSION.md](./SUBMISSION.md) —— 五字段定稿,包含动机、技术、启发全部内容。

---

## 本地开发

```bash
git clone https://github.com/17PlusOne/listen.git
cd listen
npm install

# 创建 .env.local(详见 DEPLOYMENT.md)
cat > .env.local <<EOF
GEMINI_API_KEY=你的_gemini_key
ADMIN_PASSWORD=本地测试密码
JWT_SECRET=$(openssl rand -base64 32)
BCRYPT_PEPPER=$(openssl rand -base64 32)
EOF

npm run dev
```

访问 http://localhost:3000

---

## 技术栈

- **Next.js 14 App Router** · TypeScript · React 18
- **Tailwind CSS** + 自建纸感品牌系统(`bg #FAF7F2` / `ink #1A1814` / `accent #D94A4A`)
- **Framer Motion** 用于落地页与卡片入场动画
- **Gemini 2.5 / Claude Sonnet 4.5** 双 provider 可切换
- **Vercel KV (Upstash Redis)** 持久化研究与访谈(可选)
- **自建轻量 LocaleProvider** 处理 zh / en 双语,不引入沉重 i18n 依赖

---

## 关键设计决策(详见 SUBMISSION.md §5)

1. **AI 是访谈员,不是创作者** —— 我们不替创作者生成内容,我们替研究员追问真相
2. **第三层追问硬约束** —— prompt 层禁止 AI 在出现「看情况」「主要是」等模糊词时推进话题
3. **stated vs revealed 双栏拆分** —— 聚合报告天然区分「说什么」和「透露什么」
4. **纸感品牌** —— 创作者聊的是私密话题,界面温度决定他们愿不愿意说

---

## 目录结构

```
src/
├── app/                    # Next.js App Router 路由
│   ├── page.tsx           # 落地页 (HomeLanding)
│   ├── login/             # 研究员登录
│   ├── setup/             # 研究配置
│   ├── studies/           # 研究列表与详情
│   ├── dashboard/         # 访谈记录
│   ├── consent/           # 知情同意
│   ├── interview/         # 访谈对话
│   └── p/[token]/         # 参与者链接入口
├── components/
│   ├── HomeLanding.tsx    # 落地页(中英双语 hero/价值/模板/引文)
│   ├── BrandHeader.tsx    # 顶部品牌栏
│   ├── LocaleProvider.tsx # 自建 i18n provider
│   ├── LocaleToggle.tsx   # zh/en 切换器
│   ├── StudyList.tsx      # 研究列表
│   ├── StudySetup.tsx     # 研究配置表单(支持 ?template= 预填)
│   ├── Consent.tsx        # 知情同意页(纸感)
│   ├── InterviewChat.tsx  # 参与者对话页
│   └── Synthesis.tsx      # 聚合分析视图
├── lib/
│   ├── i18n.ts            # 中英文文案表
│   ├── templates.ts       # 三大研究模板
│   ├── demoData.ts        # 创作者退潮研究 + 3 段示例访谈
│   └── prompts/           # 访谈员「听见」的全部 prompt
│       ├── interview.ts   # 第三层追问硬约束 + 不复述 + 不评价
│       ├── greeting.ts    # 开场白(按场景定制)
│       └── synthesis.ts   # 单访谈 + 跨访谈聚合
└── types.ts               # 全局 TypeScript 类型
```

---

## 评审主路径(15 分钟跑完)

详见 [DEPLOYMENT.md §3 评审验收清单](./DEPLOYMENT.md#3-评审验收清单15-分钟跑完所有路径)。

---

## 许可

私有项目,提交评审使用。
