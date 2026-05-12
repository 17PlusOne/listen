import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        'sans': ['"Inter"', '"PingFang SC"', '"Hiragino Sans GB"', '"Microsoft YaHei"', 'system-ui', 'sans-serif'],
        'serif': ['"Source Serif 4"', '"Source Han Serif SC"', '"Noto Serif SC"', '"Songti SC"', 'serif'],
        'mono': ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      colors: {
        // 听见 Listen 品牌色板
        // 温暖品牌风 + 小红书 DNA(温暖暖红 + 米白纸感 + 暖墨)
        listen: {
          paper: '#FAF7F2',       // 米白纸感 - 主背景
          paperDeep: '#F4EFE8',   // 略深米白 - 卡片
          ink: '#1A1814',         // 暖墨 - 主文字
          inkSoft: '#3D3935',     // 软墨 - 次文字
          inkMute: '#7A7066',     // 淡墨 - 辅助文字
          inkGhost: '#B8AEA1',    // 极淡 - 占位
          line: '#E5DDD0',        // 线条
          lineSoft: '#EFE9DD',    // 极淡线条
          accent: '#D94A4A',      // 强调暖红(小红书品牌色变体)
          accentDeep: '#B83838',  // 深红 - hover
          accentSoft: '#FBEEEE',  // 淡红底
          warm: '#E8A87C',        // 暖琥珀 - 二级强调
          gold: '#C9A961',        // 古金 - 高光
          mint: '#7FA88D',        // 静绿 - 成功
        },
        // 保留 stone 以避免破坏未升级的旧组件
        stone: {
          850: '#1c1917',
        }
      },
      letterSpacing: {
        'cn-tight': '-0.005em',
        'cn-normal': '0.01em',
        'cn-wide': '0.04em',
      },
      lineHeight: {
        'cn-tight': '1.4',
        'cn-normal': '1.7',
        'cn-relaxed': '1.85',
      },
      boxShadow: {
        'paper': '0 1px 0 rgba(26, 24, 20, 0.04), 0 2px 8px rgba(26, 24, 20, 0.04)',
        'paper-lg': '0 2px 0 rgba(26, 24, 20, 0.05), 0 12px 32px rgba(26, 24, 20, 0.06)',
        'paper-xl': '0 4px 0 rgba(26, 24, 20, 0.05), 0 24px 60px rgba(26, 24, 20, 0.08)',
        'accent': '0 8px 24px rgba(217, 74, 74, 0.18)',
      },
      animation: {
        'fade-up': 'fadeUp 0.7s cubic-bezier(0.22, 1, 0.36, 1) both',
        'fade-in': 'fadeIn 0.5s ease-out both',
        'slow-pulse': 'slowPulse 4s ease-in-out infinite',
        'ink-stroke': 'inkStroke 1.2s cubic-bezier(0.65, 0, 0.35, 1) forwards',
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slowPulse: {
          '0%, 100%': { opacity: '0.6' },
          '50%': { opacity: '1' },
        },
        inkStroke: {
          '0%': { transform: 'scaleX(0)', transformOrigin: 'left' },
          '100%': { transform: 'scaleX(1)', transformOrigin: 'left' },
        },
      },
    },
  },
  plugins: [],
}
export default config
