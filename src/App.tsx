import { useState, useRef, useEffect, useCallback } from 'react'
import './App.css'
import { 
  Type,
  Download, 
  RefreshCw, 
  Palette, 
  Layout, 
  Check,
  ChevronDown,
  Plus,
  Upload,
  X,
  Bold,
  Italic,
  Underline,
  Highlighter,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Grid3X3,
  Circle,
  Minus,
  Waves,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Slider } from '@/components/ui/slider'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'

// 背景样式类型
interface BackgroundStyle {
  id: string
  name: string
  type: 'gradient' | 'solid' | 'texture' | 'image'
  colors?: string[]
  color?: string
  textColor?: string
  textureType?: string
  imageUrl?: string
}

// 渐变背景（12种）
const gradientStyles: BackgroundStyle[] = [
  { id: 'grad-1', type: 'gradient', colors: ['#667eea', '#764ba2'], name: '紫罗兰' },
  { id: 'grad-2', type: 'gradient', colors: ['#f093fb', '#f5576c'], name: '粉红糖果' },
  { id: 'grad-3', type: 'gradient', colors: ['#4facfe', '#00f2fe'], name: '天空蓝' },
  { id: 'grad-4', type: 'gradient', colors: ['#43e97b', '#38f9d7'], name: '清新薄荷' },
  { id: 'grad-5', type: 'gradient', colors: ['#fa709a', '#fee140'], name: '蜜桃暖阳' },
  { id: 'grad-6', type: 'gradient', colors: ['#30cfd0', '#330867'], name: '深海秘境' },
  { id: 'grad-7', type: 'gradient', colors: ['#a8edea', '#fed6e3'], name: '樱花粉蓝' },
  { id: 'grad-8', type: 'gradient', colors: ['#ff9a9e', '#fecfef'], name: '玫瑰晨露' },
  { id: 'grad-9', type: 'gradient', colors: ['#ffecd2', '#fcb69f'], name: '奶油杏色' },
  { id: 'grad-10', type: 'gradient', colors: ['#11998e', '#38ef7d'], name: '森林绿' },
  { id: 'grad-11', type: 'gradient', colors: ['#fc5c7d', '#6a82fb'], name: '霓虹渐变' },
  { id: 'grad-12', type: 'gradient', colors: ['#0f0c29', '#302b63', '#24243e'], name: '深邃星空' },
]

// 纯色背景（12种）
const solidStyles: BackgroundStyle[] = [
  { id: 'solid-1', type: 'solid', color: '#ffffff', name: '纯白', textColor: '#1a1a2e' },
  { id: 'solid-2', type: 'solid', color: '#f8f9fa', name: '米白', textColor: '#1a1a2e' },
  { id: 'solid-3', type: 'solid', color: '#fef9e7', name: '奶油', textColor: '#1a1a2e' },
  { id: 'solid-4', type: 'solid', color: '#e8f6f3', name: '薄荷', textColor: '#1a1a2e' },
  { id: 'solid-5', type: 'solid', color: '#fff5f5', name: '浅粉', textColor: '#1a1a2e' },
  { id: 'solid-6', type: 'solid', color: '#f3f0ff', name: '浅紫', textColor: '#1a1a2e' },
  { id: 'solid-7', type: 'solid', color: '#1a1a2e', name: '深夜', textColor: '#ffffff' },
  { id: 'solid-8', type: 'solid', color: '#2d3436', name: '深灰', textColor: '#ffffff' },
  { id: 'solid-9', type: 'solid', color: '#16213e', name: '海军蓝', textColor: '#ffffff' },
  { id: 'solid-10', type: 'solid', color: '#533483', name: '紫水晶', textColor: '#ffffff' },
  { id: 'solid-11', type: 'solid', color: '#e94560', name: '珊瑚红', textColor: '#ffffff' },
  { id: 'solid-12', type: 'solid', color: '#0f3460', name: '深海蓝', textColor: '#ffffff' },
]

// 纹理背景（12种）
const textureStyles: BackgroundStyle[] = [
  { id: 'texture-1', type: 'texture', textureType: 'paper', name: '纸张', textColor: '#2d3436' },
  { id: 'texture-2', type: 'texture', textureType: 'grid', name: '方格', textColor: '#2d3436' },
  { id: 'texture-3', type: 'texture', textureType: 'dots', name: '圆点', textColor: '#2d3436' },
  { id: 'texture-4', type: 'texture', textureType: 'lines', name: '横线', textColor: '#2d3436' },
  { id: 'texture-5', type: 'texture', textureType: 'diagonal', name: '斜线', textColor: '#2d3436' },
  { id: 'texture-6', type: 'texture', textureType: 'cross', name: '十字', textColor: '#2d3436' },
  { id: 'texture-7', type: 'texture', textureType: 'vertical', name: '竖线', textColor: '#2d3436' },
  { id: 'texture-8', type: 'texture', textureType: 'checkerboard', name: '棋盘', textColor: '#2d3436' },
  { id: 'texture-9', type: 'texture', textureType: 'noise', name: '噪点', textColor: '#2d3436' },
  { id: 'texture-10', type: 'texture', textureType: 'waves', name: '波浪', textColor: '#2d3436' },
  { id: 'texture-11', type: 'texture', textureType: 'hexagon', name: '六边', textColor: '#2d3436' },
  { id: 'texture-12', type: 'texture', textureType: 'stipple', name: '点阵', textColor: '#2d3436' },
]

// 字体配置
const fontFamilies = [
  { id: 'system', name: '系统默认', family: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif' },
  { id: 'serif', name: '思源宋体', family: '"Noto Serif SC", "Source Han Serif SC", "SimSun", "STSong", serif' },
  { id: 'heiti', name: '思源黑体', family: '"Noto Sans SC", "Source Han Sans SC", "SimHei", "STHeiti", sans-serif' },
  { id: 'rounded', name: '现代圆体', family: '"PingFang SC", "Microsoft YaHei", "Hiragino Sans GB", sans-serif' },
  { id: 'fantasy', name: '文艺手写', family: '"STXingkai", "Xingkai SC", "KaiTi", cursive' },
]

// 背景比例
const aspectRatios = [
  { id: '3:4', name: '3:4', width: 900, height: 1200 },
  { id: '1:1', name: '1:1', width: 1080, height: 1080 },
  { id: '4:3', name: '4:3', width: 1200, height: 900 },
  { id: '9:16', name: '9:16', width: 1080, height: 1920 },
]

// 文本片段类型
interface TextSegment {
  text: string
  isBold?: boolean
  isItalic?: boolean
  isUnderline?: boolean
  isHighlight?: boolean
}

// 解析 Markdown 格式 - 增强版支持嵌套、转义和边界处理
const parseMarkdown = (text: string): TextSegment[] => {
  const segments: TextSegment[] = []
  
  // 1. 处理转义字符: 将 \* \_ \= 替换为占位符
  let processedText = text.replace(/\\(\*|_|=)/g, (_, char) => {
    return `\u0000${char.charCodeAt(0)}\u0000`
  })

  // 2. 状态追踪
  let isBold = false
  let isItalic = false
  let isUnderline = false
  let isHighlight = false

  // 3. 匹配所有标记，优先级: ** (粗体), __ (下划线), == (高亮), * (斜体)
  const markerRegex = /(\*\*|__|==|\*)/g
  
  let lastIndex = 0
  let match

  while ((match = markerRegex.exec(processedText)) !== null) {
    const marker = match[0]
    const index = match.index

    // 添加之前的文本片段
    if (index > lastIndex) {
      const content = processedText.slice(lastIndex, index).replace(/\u0000(\d+)\u0000/g, (_, code) => String.fromCharCode(parseInt(code)))
      segments.push({ text: content, isBold, isItalic, isUnderline, isHighlight })
    }

    // 切换状态
    if (marker === '**') isBold = !isBold
    else if (marker === '*') isItalic = !isItalic
    else if (marker === '__') isUnderline = !isUnderline
    else if (marker === '==') isHighlight = !isHighlight

    lastIndex = markerRegex.lastIndex
  }

  // 添加剩余的文本
  if (lastIndex < processedText.length) {
    const content = processedText.slice(lastIndex).replace(/\u0000(\d+)\u0000/g, (_, code) => String.fromCharCode(parseInt(code)))
    segments.push({ text: content, isBold, isItalic, isUnderline, isHighlight })
  }

  // 4. 合并相同样式的相邻片段，过滤空片段
  const mergedSegments: TextSegment[] = []
  segments.forEach(seg => {
    if (!seg.text) return
    const last = mergedSegments[mergedSegments.length - 1]
    if (last && 
        last.isBold === seg.isBold && 
        last.isItalic === seg.isItalic && 
        last.isUnderline === seg.isUnderline && 
        last.isHighlight === seg.isHighlight) {
      last.text += seg.text
    } else {
      mergedSegments.push(seg)
    }
  })

  return mergedSegments.length > 0 ? mergedSegments : [{ text: '' }]
}

function App() {
  // 内容状态
  const [text, setText] = useState('在这里输入文字\n生成精美的图片')
  
  // 样式状态
  const [selectedStyle, setSelectedStyle] = useState<BackgroundStyle>(gradientStyles[0])
  const [customStyles, setCustomStyles] = useState<BackgroundStyle[]>([])
  const [selectedFont, setSelectedFont] = useState(fontFamilies[0])
  const [selectedRatio, setSelectedRatio] = useState(aspectRatios[0])
  const [fontSize, setFontSize] = useState(48)
  const [lineHeight, setLineHeight] = useState(1.6)
  const [padding, setPadding] = useState(80)
  const [shadowBlur, setShadowBlur] = useState(20)
  const [textAlign, setTextAlign] = useState<'left' | 'center' | 'right'>('center')
  const [activeBgTab, setActiveBgTab] = useState<'gradient' | 'solid' | 'texture'>('gradient')
  
  // 自定义图片弹窗
  const [customDialogOpen, setCustomDialogOpen] = useState(false)
  const [customImageUrl, setCustomImageUrl] = useState('')
  
  // 其他状态
  const [generatedImage, setGeneratedImage] = useState<string | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // 检测移动端
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // 绘制纹理
  const drawTexture = useCallback((ctx: CanvasRenderingContext2D, width: number, height: number, textureType: string) => {
    ctx.save()
    
    // 增加全局线条清晰度 (抗锯齿优化)
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'

    switch (textureType) {
      case 'paper':
        // 纸张纹理 - 增加噪点密度和对比度
        for (let i = 0; i < 5000; i++) {
          const x = Math.random() * width
          const y = Math.random() * height
          ctx.fillStyle = `rgba(0, 0, 0, ${Math.random() * 0.05 + 0.02})`
          ctx.fillRect(x, y, 1.5, 1.5)
        }
        // 增加纤维线条清晰度
        for (let i = 0; i < 40; i++) {
          ctx.beginPath()
          ctx.strokeStyle = 'rgba(0, 0, 0, 0.03)'
          ctx.lineWidth = 0.8
          const startX = Math.random() * width
          const startY = Math.random() * height
          ctx.moveTo(startX, startY)
          ctx.lineTo(startX + Math.random() * 100 - 50, startY + Math.random() * 100 - 50)
          ctx.stroke()
        }
        break
        
      case 'grid':
        // 方格纹理 - 加粗主线，细化副线
        ctx.strokeStyle = 'rgba(0, 0, 0, 0.08)'
        ctx.lineWidth = 1.2
        for (let x = 0; x <= width; x += 40) {
          ctx.beginPath()
          ctx.moveTo(x, 0)
          ctx.lineTo(x, height)
          ctx.stroke()
        }
        for (let y = 0; y <= height; y += 40) {
          ctx.beginPath()
          ctx.moveTo(0, y)
          ctx.lineTo(width, y)
          ctx.stroke()
        }
        // 细格线
        ctx.strokeStyle = 'rgba(0, 0, 0, 0.03)'
        ctx.lineWidth = 0.5
        for (let x = 20; x <= width; x += 40) {
          ctx.beginPath()
          ctx.moveTo(x, 0)
          ctx.lineTo(x, height)
          ctx.stroke()
        }
        for (let y = 20; y <= height; y += 40) {
          ctx.beginPath()
          ctx.moveTo(0, y)
          ctx.lineTo(width, y)
          ctx.stroke()
        }
        break
        
      case 'dots':
        // 圆点纹理 - 增大圆点并增加间距感
        for (let x = 25; x < width; x += 35) {
          for (let y = 25; y < height; y += 35) {
            ctx.beginPath()
            ctx.arc(x, y, 2.5, 0, Math.PI * 2)
            ctx.fillStyle = 'rgba(0, 0, 0, 0.1)'
            ctx.fill()
          }
        }
        break
        
      case 'lines':
        // 横线纹理 - 模拟信纸感
        ctx.strokeStyle = 'rgba(0, 0, 0, 0.08)'
        ctx.lineWidth = 1.5
        for (let y = 60; y <= height; y += 35) {
          ctx.beginPath()
          ctx.moveTo(40, y)
          ctx.lineTo(width - 40, y)
          ctx.stroke()
        }
        // 左侧红线 (模拟笔记本)
        ctx.strokeStyle = 'rgba(255, 0, 0, 0.15)'
        ctx.lineWidth = 2
        ctx.beginPath()
        ctx.moveTo(80, 0)
        ctx.lineTo(80, height)
        ctx.stroke()
        break
        
      case 'diagonal':
        // 斜线纹理 - 增加线条锐度
        ctx.strokeStyle = 'rgba(0, 0, 0, 0.07)'
        ctx.lineWidth = 1.2
        const spacing = 30
        for (let i = -height; i < width + height; i += spacing) {
          ctx.beginPath()
          ctx.moveTo(i, 0)
          ctx.lineTo(i + height, height)
          ctx.stroke()
        }
        break
        
      case 'cross':
        // 十字纹理 - 增加尺寸和对比度
        const crossSize = 6
        const crossSpacing = 45
        ctx.strokeStyle = 'rgba(0, 0, 0, 0.12)'
        ctx.lineWidth = 1.5
        for (let x = crossSpacing / 2; x < width; x += crossSpacing) {
          for (let y = crossSpacing / 2; y < height; y += crossSpacing) {
            ctx.beginPath()
            ctx.moveTo(x - crossSize, y)
            ctx.lineTo(x + crossSize, y)
            ctx.stroke()
            ctx.beginPath()
            ctx.moveTo(x, y - crossSize)
            ctx.lineTo(x, y + crossSize)
            ctx.stroke()
          }
        }
        break
        
      case 'vertical':
        // 竖线纹理
        ctx.strokeStyle = 'rgba(0, 0, 0, 0.08)'
        ctx.lineWidth = 1.2
        for (let x = 60; x <= width; x += 35) {
          ctx.beginPath()
          ctx.moveTo(x, 0)
          ctx.lineTo(x, height)
          ctx.stroke()
        }
        break
        
      case 'checkerboard':
        // 棋盘纹理 - 提高对比度
        const checkSize = 35
        ctx.fillStyle = 'rgba(0, 0, 0, 0.06)'
        for (let x = 0; x < width; x += checkSize) {
          for (let y = 0; y < height; y += checkSize) {
            if ((Math.floor(x / checkSize) + Math.floor(y / checkSize)) % 2 === 0) {
              ctx.fillRect(x, y, checkSize, checkSize)
            }
          }
        }
        break
        
      case 'noise':
        // 噪点纹理 - 增强颗粒感
        for (let i = 0; i < 10000; i++) {
          const x = Math.random() * width
          const y = Math.random() * height
          const opacity = Math.random() * 0.12 + 0.05
          ctx.fillStyle = Math.random() > 0.5 ? `rgba(0, 0, 0, ${opacity})` : `rgba(255, 255, 255, ${opacity})`
          ctx.fillRect(x, y, 2.5, 2.5)
        }
        break
        
      case 'waves':
        // 波浪纹理 - 增加线条连贯性
        ctx.strokeStyle = 'rgba(0, 0, 0, 0.08)'
        ctx.lineWidth = 1.5
        const waveSpacing = 30
        for (let y = 0; y < height + 20; y += waveSpacing) {
          ctx.beginPath()
          for (let x = -10; x <= width + 10; x += 5) {
            const waveY = y + Math.sin(x * 0.04) * 8
            if (x === -10) {
              ctx.moveTo(x, waveY)
            } else {
              ctx.lineTo(x, waveY)
            }
          }
          ctx.stroke()
        }
        break
        
      case 'hexagon':
        // 六边形纹理 - 调整比例和线条
        const hexSize = 22
        const hexHeight = hexSize * Math.sqrt(3)
        ctx.strokeStyle = 'rgba(0, 0, 0, 0.09)'
        ctx.lineWidth = 1.2
        for (let row = 0; row < height / (hexHeight * 0.75) + 2; row++) {
          for (let col = 0; col < width / (hexSize * 3) + 2; col++) {
            const x = col * hexSize * 3 + (row % 2) * hexSize * 1.5
            const y = row * hexHeight * 0.75
            ctx.beginPath()
            for (let i = 0; i < 6; i++) {
              const angle = (i * 60 - 30) * Math.PI / 180
              const hx = x + hexSize * Math.cos(angle)
              const hy = y + hexSize * Math.sin(angle)
              if (i === 0) ctx.moveTo(hx, hy)
              else ctx.lineTo(hx, hy)
            }
            ctx.closePath()
            ctx.stroke()
          }
        }
        break
        
      case 'stipple':
        // 点阵纹理 - 增加动态感
        for (let i = 0; i < 3000; i++) {
          const x = Math.random() * width
          const y = Math.random() * height
          const size = Math.random() > 0.8 ? 3 : 1.5
          ctx.fillStyle = `rgba(0, 0, 0, ${Math.random() * 0.15 + 0.05})`
          ctx.fillRect(x, y, size, size)
        }
        break
    }
    
    ctx.restore()
  }, [])

  // 设置 Canvas 字体样式
  const setCanvasFont = useCallback((ctx: CanvasRenderingContext2D, baseFontSize: number, baseFamily: string, isBold?: boolean, isItalic?: boolean) => {
    let style = ''
    if (isBold && isItalic) style = 'bold italic '
    else if (isBold) style = 'bold '
    else if (isItalic) style = 'italic '
    
    ctx.font = `${style}${baseFontSize}px ${baseFamily}`
  }, [])

  // 自动换行函数 - 高性能中英文混合换行策略
  const wrapText = useCallback((ctx: CanvasRenderingContext2D, text: string, maxWidth: number, baseFontSize: number, baseFamily: string): TextSegment[][] => {
    const lines: TextSegment[][] = []
    const paragraphs = text.split('\n')
    
    paragraphs.forEach((paragraph) => {
      if (paragraph.trim() === '') {
        lines.push([{ text: '' }])
        return
      }
      
      const segments = parseMarkdown(paragraph)
      let currentLine: TextSegment[] = []
      let currentLineWidth = 0
      
      segments.forEach(segment => {
        setCanvasFont(ctx, baseFontSize, baseFamily, segment.isBold, segment.isItalic)
        
        // 1. 块级尝试 (Fast Path)
        const segmentWidth = ctx.measureText(segment.text).width
        if (currentLineWidth + segmentWidth <= maxWidth) {
          currentLine.push(segment)
          currentLineWidth += segmentWidth
          return
        }

        // 2. 混合分词策略 (Hybrid Tokenization)
        // 匹配规则: 英文单词(包含空格) 或 单个中文字符(CJK)
        const tokens = segment.text.match(/[\u4e00-\u9fa5]|[\u3000-\u303f]|[\uff00-\uffef]|[^\u4e00-\u9fa5\u3000-\u303f\uff00-\uffef]+/g) || []
        
        let currentSegmentText = ''
        
        tokens.forEach(token => {
          const tokenWidth = ctx.measureText(token).width
          
          if (currentLineWidth + tokenWidth > maxWidth && currentLineWidth > 0) {
            // 换行
            if (currentSegmentText) {
              currentLine.push({ ...segment, text: currentSegmentText })
            }
            lines.push(currentLine)
            
            // 重置新行
            currentLine = []
            currentLineWidth = 0
            
            // 处理单个 token 就超过 maxWidth 的情况（如超长单词或中文字符）
            if (tokenWidth > maxWidth) {
              // 强制截断超长单词（保底逻辑）
              const chars = token.split('')
              let tempText = ''
              chars.forEach(char => {
                const charWidth = ctx.measureText(char).width
                if (currentLineWidth + charWidth > maxWidth && currentLineWidth > 0) {
                  currentLine.push({ ...segment, text: tempText })
                  lines.push(currentLine)
                  currentLine = []
                  currentLineWidth = 0
                  tempText = char
                  currentLineWidth = charWidth
                } else {
                  tempText += char
                  currentLineWidth += charWidth
                }
              })
              currentSegmentText = tempText
            } else {
              currentSegmentText = token
              currentLineWidth = tokenWidth
            }
          } else {
            currentSegmentText += token
            currentLineWidth += tokenWidth
          }
        })
        
        if (currentSegmentText) {
          currentLine.push({ ...segment, text: currentSegmentText })
        }
      })
      
      if (currentLine.length > 0) {
        lines.push(currentLine)
      }
    })
    
    return lines
  }, [setCanvasFont])

  // 绘制装饰元素
  const drawDecorations = useCallback((ctx: CanvasRenderingContext2D, width: number, height: number) => {
    ctx.save()
    for (let i = 0; i < 15; i++) {
      const x = Math.random() * width
      const y = Math.random() * height
      const radius = Math.random() * 40 + 20
      const opacity = Math.random() * 0.08 + 0.03
      
      ctx.beginPath()
      ctx.arc(x, y, radius, 0, Math.PI * 2)
      ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`
      ctx.fill()
    }
    ctx.restore()
  }, [])

  // 生成图片
  const generateImage = useCallback(async () => {
    if (!text.trim()) {
      setGeneratedImage(null)
      return
    }

    setIsGenerating(true)
    
    try {
      const canvas = canvasRef.current
      if (!canvas) return

      const ctx = canvas.getContext('2d')
      if (!ctx) return

      const width = selectedRatio.width
      const height = selectedRatio.height
      canvas.width = width
      canvas.height = height

      // 绘制背景
      if (selectedStyle.type === 'gradient') {
        const gradient = ctx.createLinearGradient(0, 0, width, height)
        const colors = selectedStyle.colors || ['#667eea', '#764ba2']
        colors.forEach((color, index) => {
          gradient.addColorStop(index / (colors.length - 1), color)
        })
        ctx.fillStyle = gradient
        ctx.fillRect(0, 0, width, height)
      } else if (selectedStyle.type === 'solid') {
        ctx.fillStyle = selectedStyle.color || '#ffffff'
        ctx.fillRect(0, 0, width, height)
      } else if (selectedStyle.type === 'texture' && selectedStyle.textureType) {
        // 纹理背景 - 白色底 + 纹理
        ctx.fillStyle = '#ffffff'
        ctx.fillRect(0, 0, width, height)
        drawTexture(ctx, width, height, selectedStyle.textureType)
      } else if (selectedStyle.type === 'image' && selectedStyle.imageUrl) {
        // 绘制图片背景 - 裁剪填充
        const img = document.createElement('img')
        img.crossOrigin = 'anonymous'
        await new Promise<void>((resolve, reject) => {
          img.onload = () => resolve()
          img.onerror = () => reject(new Error('图片加载失败'))
          img.src = selectedStyle.imageUrl!
        })
        
        // 计算裁剪区域（cover模式）
        const imgRatio = img.width / img.height
        const canvasRatio = width / height
        let sx = 0, sy = 0, sw = img.width, sh = img.height
        
        if (imgRatio > canvasRatio) {
          // 图片更宽，裁剪左右
          sw = img.height * canvasRatio
          sx = (img.width - sw) / 2
        } else {
          // 图片更高，裁剪上下
          sh = img.width / canvasRatio
          sy = (img.height - sh) / 2
        }
        
        ctx.drawImage(img, sx, sy, sw, sh, 0, 0, width, height)
        
        // 添加暗色遮罩确保文字可读
        ctx.fillStyle = 'rgba(0, 0, 0, 0.35)'
        ctx.fillRect(0, 0, width, height)
      }

      // 绘制装饰元素（图片背景不绘制）
      if (selectedStyle.type !== 'image') {
        drawDecorations(ctx, width, height)
      }

      // 设置文字样式
      let textColor = '#ffffff'
      if (selectedStyle.type === 'solid') {
        textColor = selectedStyle.textColor || '#2d3436'
      } else if (selectedStyle.type === 'texture') {
        textColor = selectedStyle.textColor || '#2d3436'
      }
      
      ctx.fillStyle = textColor
      ctx.font = `${fontSize}px ${selectedFont.family}`
      ctx.textAlign = textAlign as CanvasTextAlign
      ctx.textBaseline = 'middle'

      // 绘制文字阴影
      if (shadowBlur > 0) {
        ctx.shadowColor = 'rgba(0, 0, 0, 0.3)'
        ctx.shadowBlur = shadowBlur
        ctx.shadowOffsetX = 0
        ctx.shadowOffsetY = 4
      }

      // 计算文字区域宽度
      const maxTextWidth = width - padding * 2
      
      // 自动换行处理 - 传入字体信息
      const wrappedLines = wrapText(ctx, text, maxTextWidth, fontSize, selectedFont.family)
      
      const lineHeightPx = fontSize * lineHeight
      const totalHeight = wrappedLines.length * lineHeightPx
      const startY = (height - totalHeight) / 2 + lineHeightPx / 2

      wrappedLines.forEach((lineSegments, index) => {
        const y = startY + index * lineHeightPx
        
        // 计算整行宽度用于对齐
        let totalLineWidth = 0
        lineSegments.forEach(seg => {
          setCanvasFont(ctx, fontSize, selectedFont.family, seg.isBold, seg.isItalic)
          totalLineWidth += ctx.measureText(seg.text).width
        })

        // 确定起点 X
        let currentX = width / 2 - totalLineWidth / 2
        if (textAlign === 'left') currentX = padding
        if (textAlign === 'right') currentX = width - padding - totalLineWidth

        // 逐个绘制片段
        lineSegments.forEach(seg => {
          setCanvasFont(ctx, fontSize, selectedFont.family, seg.isBold, seg.isItalic)
          const segWidth = ctx.measureText(seg.text).width
          
          // 绘制高亮背景
          if (seg.isHighlight) {
            ctx.save()
            ctx.fillStyle = 'rgba(255, 255, 0, 0.4)' // 黄色半透明高亮
            ctx.fillRect(currentX, y - fontSize / 2, segWidth, fontSize)
            ctx.restore()
          }

          // 绘制文字
          ctx.fillStyle = textColor
          ctx.textAlign = 'left' // 片段绘制始终靠左接龙
          
          // 重新设置阴影（因为 fillRect 可能重置了或者需要保持）
          if (shadowBlur > 0) {
            ctx.shadowColor = 'rgba(0, 0, 0, 0.3)'
            ctx.shadowBlur = shadowBlur
          }
          
          ctx.fillText(seg.text, currentX, y)
          
          // 绘制下划线
          if (seg.isUnderline) {
            ctx.save()
            ctx.strokeStyle = textColor
            ctx.lineWidth = Math.max(1, fontSize / 20)
            ctx.beginPath()
            ctx.moveTo(currentX, y + fontSize / 2)
            ctx.lineTo(currentX + segWidth, y + fontSize / 2)
            ctx.stroke()
            ctx.restore()
          }

          currentX += segWidth
        })
      })

      // 重置阴影
      ctx.shadowColor = 'transparent'
      ctx.shadowBlur = 0
      ctx.shadowOffsetX = 0
      ctx.shadowOffsetY = 0

      // 生成图片
      const dataUrl = canvas.toDataURL('image/png', 1.0)
      setGeneratedImage(dataUrl)
    } catch (error) {
      console.error('生成图片时出错:', error)
    } finally {
      setIsGenerating(false)
    }
  }, [text, selectedStyle, selectedFont, textAlign, fontSize, lineHeight, padding, shadowBlur, selectedRatio, wrapText, drawTexture, drawDecorations, setCanvasFont])

  // 实时预览 - 无感知更新优化
  useEffect(() => {
    // 依赖 generateImage 即可，因为 generateImage 已使用 useCallback 包含所有状态依赖
    const timer = setTimeout(() => {
      generateImage()
    }, 100) // 缩短延迟，提高响应速度
    return () => clearTimeout(timer)
  }, [generateImage])

  // 下载图片
  const downloadImage = () => {
    if (!generatedImage) return
    const link = document.createElement('a')
    link.download = `文字图片_${Date.now()}.png`
    link.href = generatedImage
    link.click()
    toast.success('图片已下载！')
  }

  // 清空文字
  const clearText = () => {
    setText('')
    toast.success('文字已清空')
  }

  // 插入格式
  const insertFormat = (format: string) => {
    const textarea = document.querySelector('textarea') as HTMLTextAreaElement
    if (!textarea) return
    
    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const selectedText = text.substring(start, end)
    
    let newText = ''
    switch (format) {
      case 'bold':
        newText = `**${selectedText || '粗体'}**`
        break
      case 'italic':
        newText = `*${selectedText || '斜体'}*`
        break
      case 'underline':
        newText = `__${selectedText || '下划线'}__`
        break
      case 'highlight':
        newText = `==${selectedText || '高亮'}==`
        break
    }
    
    const newContent = text.substring(0, start) + newText + text.substring(end)
    setText(newContent)
    
    setTimeout(() => {
      textarea.focus()
      const newCursorPos = start + newText.length
      textarea.setSelectionRange(newCursorPos, newCursorPos)
    }, 0)
  }

  // 重置设置
  const resetSettings = () => {
    setText('在这里输入文字\n生成精美的图片')
    setSelectedStyle(gradientStyles[0])
    setCustomStyles([])
    setSelectedFont(fontFamilies[0])
    setSelectedRatio(aspectRatios[0])
    setFontSize(48)
    setLineHeight(1.6)
    setPadding(80)
    setShadowBlur(20)
    setTextAlign('center')
    toast.success('设置已重置')
  }

  // 处理图片上传
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (!file.type.startsWith('image/')) {
      toast.error('请选择图片文件')
      return
    }

    const reader = new FileReader()
    reader.onload = (event) => {
      const imageUrl = event.target?.result as string
      const newStyle: BackgroundStyle = {
        id: `custom-${Date.now()}`,
        name: '自定义图',
        type: 'image',
        imageUrl: imageUrl
      }
      setCustomStyles([...customStyles, newStyle])
      setSelectedStyle(newStyle)
      setCustomDialogOpen(false)
      toast.success('自定义背景已添加')
    }
    reader.readAsDataURL(file)
  }

  // 添加网络图片
  const addImageUrl = () => {
    if (!customImageUrl.trim()) {
      toast.error('请输入图片地址')
      return
    }
    const newStyle: BackgroundStyle = {
      id: `custom-${Date.now()}`,
      name: '自定义图',
      type: 'image',
      imageUrl: customImageUrl
    }
    setCustomStyles([...customStyles, newStyle])
    setSelectedStyle(newStyle)
    setCustomDialogOpen(false)
    setCustomImageUrl('')
    toast.success('自定义背景已添加')
  }

  // 删除自定义样式
  const deleteCustomStyle = (styleId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    setCustomStyles(customStyles.filter(s => s.id !== styleId))
    if (selectedStyle.id === styleId) {
      setSelectedStyle(gradientStyles[0])
    }
    toast.success('已删除')
  }

  // 获取纹理图标
  const getTextureIcon = (type: string) => {
    switch (type) {
      case 'paper': return <Waves className="w-4 h-4" />
      case 'grid': return <Grid3X3 className="w-4 h-4" />
      case 'dots': return <Circle className="w-4 h-4" />
      case 'lines': return <Minus className="w-4 h-4" />
      case 'diagonal': return <Minus className="w-4 h-4 rotate-45" />
      case 'cross': return <Plus className="w-4 h-4" />
      case 'vertical': return <Minus className="w-4 h-4 rotate-90" />
      case 'checkerboard': return <Grid3X3 className="w-4 h-4" />
      case 'noise': return <Circle className="w-4 h-4" />
      case 'waves': return <Waves className="w-4 h-4" />
      case 'hexagon': return <Circle className="w-4 h-4" />
      case 'stipple': return <Circle className="w-4 h-4" />
      default: return <Waves className="w-4 h-4" />
    }
  }

  return (
    <div className="min-h-screen hero-gradient text-black selection:bg-black/20">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white border-b-3 border-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 sm:h-16 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2.5 group cursor-default">
            <div className="w-9 h-9 bg-gradient-to-br from-pink-500 via-yellow-400 to-cyan-400 rounded-lg flex items-center justify-center shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] border-2 border-black group-hover:translate-x-[-1px] group-hover:translate-y-[-1px] transition-transform">
              <span className="text-lg font-black text-white drop-shadow-md">T</span>
            </div>
            <span className="text-xl sm:text-2xl font-black tracking-tight">字图</span>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={resetSettings}
              className="gap-1.5 text-gray-600 hover:text-black hover:bg-gray-100 transition-colors font-bold h-9 px-3"
            >
              <RefreshCw className="w-4 h-4" />
              <span className="hidden sm:inline text-sm">重置</span>
            </Button>
            <Button
              onClick={downloadImage}
              disabled={!generatedImage}
              className="btn-primary gap-1.5 px-4 h-9 text-sm rounded-md"
            >
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline font-bold">导出图片</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Left Panel - Controls */}
          <div className="lg:col-span-5 space-y-6 animate-fade-in">
            {/* Text Input Section */}
            <div className="control-section">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-black flex items-center justify-center">
                    <Type className="w-4 h-4 text-white" />
                  </div>
                  <h2 className="text-base font-black">文字内容</h2>
                </div>
                <div className="flex items-center bg-gray-100 rounded-lg p-1 border-2 border-black">
                  {[
                    { id: 'bold', icon: Bold, title: '粗体' },
                    { id: 'italic', icon: Italic, title: '斜体' },
                    { id: 'underline', icon: Underline, title: '下划线' },
                    { id: 'highlight', icon: Highlighter, title: '高亮' },
                  ].map((btn) => (
                    <button
                      key={btn.id}
                      onClick={() => insertFormat(btn.id)}
                      className="p-2 hover:bg-black hover:text-white rounded-md transition-all"
                      title={btn.title}
                    >
                      <btn.icon className="w-4 h-4" />
                    </button>
                  ))}
                </div>
              </div>
              
              <Textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="在这里输入你想要转换成图片的文字...&#10;支持 Markdown 格式：*斜体*、**粗体**、__下划线__、==高亮=="
                className="textarea-premium min-h-[160px] text-base leading-relaxed rounded-lg resize-none"
              />
              
              <div className="flex items-center justify-between mt-3">
                <p className="text-xs text-gray-500 font-bold">
                  支持 Markdown 格式
                </p>
                <button
                  onClick={clearText}
                  className="h-8 px-5 text-xs font-black text-white bg-black hover:bg-gray-800 rounded-lg transition-all border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,0.3)]"
                >
                  清空
                </button>
              </div>
            </div>

            {/* Layout Settings Section */}
            <div className="control-section">
              <div className="flex items-center gap-2.5 mb-3">
                <div className="w-8 h-8 rounded-lg bg-black flex items-center justify-center">
                  <Layout className="w-4 h-4 text-white" />
                </div>
                <h2 className="text-base font-black">图片比例</h2>
              </div>
              <div className="grid grid-cols-4 gap-3">
                {aspectRatios.map((ratio) => (
                  <button
                    key={ratio.id}
                    onClick={() => setSelectedRatio(ratio)}
                    className={`py-3 rounded-lg border-3 font-black transition-all ${
                      selectedRatio.id === ratio.id
                        ? 'border-black bg-black text-white shadow-[3px_3px_0px_0px_rgba(0,0,0,0.3)]'
                        : 'border-black text-black hover:bg-gray-100 bg-white'
                    }`}
                  >
                    <span className="text-sm">{ratio.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Appearance Section */}
            <div className="control-section">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-black flex items-center justify-center">
                    <Palette className="w-4 h-4 text-white" />
                  </div>
                  <h2 className="text-base font-black">背景与样式</h2>
                </div>
                <button
                  onClick={() => setCustomDialogOpen(true)}
                  className="px-4 py-2 text-xs font-black text-white bg-black hover:bg-gray-800 rounded-lg transition-all border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,0.3)]"
                >
                  + 自定义图片
                </button>
              </div>
              
              {/* Tab Switch */}
              <div className="flex p-1 bg-gray-100 rounded-lg mb-4 border-2 border-black">
                {[
                  { id: 'gradient', label: '魔法渐变' },
                  { id: 'solid', label: '极简纯色' },
                  { id: 'texture', label: '艺术纹理' },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveBgTab(tab.id as any)}
                    className={`flex-1 py-2 rounded-md text-xs font-black transition-all ${
                      activeBgTab === tab.id
                        ? 'bg-black text-white'
                        : 'text-gray-600 hover:text-black'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
              
              <div className="min-h-[100px]">
                {/* Gradient Grid */}
                {activeBgTab === 'gradient' && (
                  <div className="grid grid-cols-6 gap-2.5">
                    {gradientStyles.map((style) => (
                      <div
                        key={style.id}
                        onClick={() => setSelectedStyle(style)}
                        className={`style-chip aspect-square ${selectedStyle.id === style.id ? 'active' : ''}`}
                      >
                        <div
                          className="w-full h-full"
                          style={{ background: `linear-gradient(135deg, ${style.colors?.[0]}, ${style.colors?.[1]})` }}
                        />
                        {selectedStyle.id === style.id && (
                          <div className="absolute inset-0 flex items-center justify-center bg-white/20">
                            <Check className="w-4 h-4 text-white drop-shadow-sm" />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
                
                {/* Solid Grid */}
                {activeBgTab === 'solid' && (
                  <div className="grid grid-cols-6 gap-2.5">
                    {solidStyles.map((style) => (
                      <div
                        key={style.id}
                        onClick={() => setSelectedStyle(style)}
                        className={`style-chip aspect-square border border-slate-100 ${selectedStyle.id === style.id ? 'active' : ''}`}
                        style={{ backgroundColor: style.color }}
                      >
                        {selectedStyle.id === style.id && (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <Check className={`w-4 h-4 ${style.textColor === '#ffffff' ? 'text-white' : 'text-slate-800'}`} />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {/* Texture Grid */}
                {activeBgTab === 'texture' && (
                  <div className="grid grid-cols-4 gap-2.5">
                    {textureStyles.map((style) => (
                      <div
                        key={style.id}
                        onClick={() => setSelectedStyle(style)}
                        className={`style-chip h-16 border border-slate-100 bg-white flex flex-col items-center justify-center ${selectedStyle.id === style.id ? 'active' : ''}`}
                      >
                        <span className="text-slate-400 scale-110">{getTextureIcon(style.textureType!)}</span>
                        <span className="text-[10px] font-bold text-slate-500 mt-1">{style.name}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Custom Styles */}
              {customStyles.length > 0 && (
                <div className="mt-6 pt-6 border-t-2 border-black/10">
                  <p className="text-xs font-black text-gray-500 uppercase tracking-wider mb-3">我的上传</p>
                  <div className="grid grid-cols-6 gap-2.5">
                    {customStyles.map((style) => (
                      <div
                        key={style.id}
                        onClick={() => setSelectedStyle(style)}
                        className={`style-chip aspect-square ${selectedStyle.id === style.id ? 'active' : ''}`}
                      >
                        <img src={style.imageUrl} alt={style.name} className="w-full h-full object-cover rounded-lg border-2 border-black" />
                        <div
                          onClick={(e) => deleteCustomStyle(style.id, e)}
                          className="absolute top-1 right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity cursor-pointer border-2 border-white"
                        >
                          <X className="w-3 h-3 text-white" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Typography Section */}
            <div className="control-section">
              <div className="flex items-center gap-2.5 mb-4">
                <div className="w-8 h-8 rounded-lg bg-black flex items-center justify-center">
                  <Type className="w-4 h-4 text-white" />
                </div>
                <h2 className="text-base font-black">排版细节</h2>
              </div>
              
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-xs font-black text-gray-600">艺术字体</Label>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="w-full justify-between h-11 bg-white border-2 border-black rounded-lg font-bold px-3 text-black hover:bg-gray-50 hover:text-black">
                          <span style={{ fontFamily: selectedFont.family }} className="truncate">
                            {selectedFont.name}
                          </span>
                          <ChevronDown className="w-4 h-4 text-gray-500 shrink-0 ml-2" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent 
                        side="bottom" 
                        align="start" 
                        sideOffset={8}
                        className="w-48 rounded-lg p-1.5 shadow-2xl border-2 border-black bg-white"
                      >
                        {fontFamilies.map((font) => (
                          <DropdownMenuItem 
                            key={font.id} 
                            onClick={() => setSelectedFont(font)} 
                            className={`rounded-md px-3 py-2 cursor-pointer transition-all mb-1 last:mb-0 border-2 ${
                              selectedFont.id === font.id 
                                ? 'border-black bg-black text-white' 
                                : 'border-transparent hover:border-black bg-white text-black'
                            }`}
                          >
                            <span className="text-sm font-bold" style={{ fontFamily: font.family }}>{font.name}</span>
                            {selectedFont.id === font.id && (
                              <Check className="w-4 h-4 ml-auto" />
                            )}
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs font-black text-gray-600">对齐方式</Label>
                    <div className="flex p-1 bg-gray-100 rounded-lg h-11 border-2 border-black">
                      {[
                        { id: 'left', icon: AlignLeft },
                        { id: 'center', icon: AlignCenter },
                        { id: 'right', icon: AlignRight },
                      ].map((align) => (
                        <button
                          key={align.id}
                          onClick={() => setTextAlign(align.id as any)}
                          className={`flex-1 flex items-center justify-center rounded-md transition-all ${
                            textAlign === align.id
                              ? 'bg-black text-white'
                              : 'text-gray-600 hover:text-black'
                          }`}
                        >
                          <align.icon className="w-4 h-4" />
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <Label className="text-xs font-black text-gray-600">文字大小</Label>
                        <span className="text-xs font-black text-white bg-black px-2 py-0.5 rounded">{fontSize}px</span>
                      </div>
                      <Slider value={[fontSize]} onValueChange={(v) => setFontSize(v[0])} min={24} max={120} step={2} />
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <Label className="text-xs font-black text-gray-600">行间距</Label>
                        <span className="text-xs font-black text-white bg-black px-2 py-0.5 rounded">{lineHeight}</span>
                      </div>
                      <Slider value={[lineHeight]} onValueChange={(v) => setLineHeight(v[0])} min={1} max={3} step={0.1} />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <Label className="text-xs font-black text-gray-600">安全边距</Label>
                        <span className="text-xs font-black text-white bg-black px-2 py-0.5 rounded">{padding}px</span>
                      </div>
                      <Slider value={[padding]} onValueChange={(v) => setPadding(v[0])} min={20} max={200} step={5} />
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <Label className="text-xs font-black text-gray-600">投影深度</Label>
                        <span className="text-xs font-black text-white bg-black px-2 py-0.5 rounded">{shadowBlur}px</span>
                      </div>
                      <Slider value={[shadowBlur]} onValueChange={(v) => setShadowBlur(v[0])} min={0} max={100} step={1} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Panel - Preview */}
          <div className="lg:col-span-7 lg:sticky lg:top-28">
            <div className="preview-container animate-fade-in-up">
              {/* 标题 */}
              <div className="mb-4">
                <h2 className="text-xl font-black text-black tracking-tight">预览画布</h2>
                <p className="text-xs text-gray-500 font-black mt-1">{selectedRatio.width} × {selectedRatio.height} 像素 · PNG</p>
              </div>

              <div 
                className="preview-card-frame mx-auto group relative overflow-hidden transition-all duration-300 bg-white"
                style={{ 
                  aspectRatio: selectedRatio.id.replace(':', '/'),
                  width: '100%',
                  maxWidth: isMobile ? '100%' : 'min(480px, 70vh)',
                }}
              >
                {/* 双缓冲效果：始终显示生成的图片，通过过渡平滑更新 */}
                <div className="w-full h-full relative bg-gray-100">
                  {generatedImage && (
                    <img
                      src={generatedImage}
                      alt="Preview"
                      className="w-full h-full object-contain select-none transition-opacity duration-200"
                    />
                  )}
                  
                  {/* 只在第一次加载或无内容时显示占位 */}
                  {!generatedImage && !isGenerating && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center space-y-4">
                      <div className="w-20 h-20 rounded-2xl bg-white flex items-center justify-center border-3 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                        <Type className="w-10 h-10 text-black" />
                      </div>
                      <p className="text-gray-600 text-sm font-bold">输入文字开始创作...</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-8 grid grid-cols-2 gap-4">
                <div className="glass-panel p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 rounded-lg bg-black flex items-center justify-center">
                      <Check className="w-4 h-4 text-white" />
                    </div>
                    <h3 className="text-sm font-black text-black">高清渲染</h3>
                  </div>
                  <p className="text-xs text-gray-600 leading-relaxed font-bold">使用 Canvas 2D 引擎，确保导出的每一像素都极致清晰。</p>
                </div>
                <div className="glass-panel p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 rounded-lg bg-black flex items-center justify-center">
                      <Layout className="w-4 h-4 text-white" />
                    </div>
                    <h3 className="text-sm font-black text-black">自适应排版</h3>
                  </div>
                  <p className="text-xs text-gray-600 leading-relaxed font-bold">智能计算文字行高与边距，在任何比例下都完美呈现。</p>
                </div>
              </div>
              
              <Button
                onClick={downloadImage}
                disabled={!generatedImage}
                className="w-full mt-6 btn-primary h-14 text-white font-black text-lg lg:hidden rounded-lg"
              >
                <Download className="w-5 h-5 mr-2" />
                保存到相册
              </Button>
            </div>
          </div>
        </div>
      </main>

      {/* Custom Image Dialog */}
      <Dialog open={customDialogOpen} onOpenChange={setCustomDialogOpen}>
        <DialogContent className="sm:max-w-md !border-none p-0 overflow-hidden bg-white border-3 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
          <div className="bg-black p-5 text-white border-b-3 border-black">
            <DialogTitle className="text-lg font-black">自定义背景图片</DialogTitle>
            <p className="text-gray-400 text-xs mt-1 font-bold">上传或输入 URL 来定制专属背景</p>
          </div>
          <div className="p-5 space-y-5">
            <div className="space-y-2">
              <Label className="text-sm font-black text-black">本地上传</Label>
              <input type="file" ref={fileInputRef} onChange={handleImageUpload} accept="image/*" className="hidden" />
              <Button
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                className="w-full h-12 gap-2 border-2 border-dashed border-black hover:bg-gray-50 rounded-lg transition-all bg-white"
              >
                <Upload className="w-5 h-5 text-black" />
                <span className="font-bold text-black">点击选择图片文件</span>
              </Button>
            </div>
            
            <div className="relative">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t-2 border-black/10" /></div>
              <div className="relative flex justify-center text-xs uppercase font-black tracking-widest text-gray-400">
                <span className="bg-white px-3">或者</span>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-black text-black">网络图片 URL</Label>
              <div className="flex gap-2 items-center">
                <Input
                  value={customImageUrl}
                  onChange={(e) => setCustomImageUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="h-11 rounded-lg bg-white border-2 border-black text-black placeholder:text-gray-400 focus:border-black focus:ring-0 font-bold flex-1"
                />
                <Button onClick={addImageUrl} className="h-11 px-5 btn-primary rounded-lg font-black shrink-0">
                  确认
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <canvas ref={canvasRef} className="hidden" />
    </div>
  )
}

export default App
