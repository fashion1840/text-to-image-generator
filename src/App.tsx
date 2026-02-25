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
  DialogHeader,
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
  { id: 'system', name: '系统默认', family: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' },
  { id: 'serif', name: '思源宋体', family: '"Noto Serif SC", "Source Han Serif SC", serif' },
  { id: 'mono', name: '等宽字体', family: '"SF Mono", "Consolas", monospace' },
]

// 图片比例
const aspectRatios = [
  { id: '3:4', name: '3:4', width: 900, height: 1200 },
  { id: '1:1', name: '1:1', width: 1080, height: 1080 },
  { id: '4:3', name: '4:3', width: 1200, height: 900 },
  { id: '9:16', name: '9:16', width: 1080, height: 1920 },
]

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
    
    switch (textureType) {
      case 'paper':
        // 纸张纹理 - 噪点效果
        for (let i = 0; i < 3000; i++) {
          const x = Math.random() * width
          const y = Math.random() * height
          ctx.fillStyle = `rgba(0, 0, 0, ${Math.random() * 0.03 + 0.01})`
          ctx.fillRect(x, y, 1, 1)
        }
        // 纤维线条
        for (let i = 0; i < 30; i++) {
          ctx.beginPath()
          ctx.strokeStyle = 'rgba(0, 0, 0, 0.015)'
          const startX = Math.random() * width
          const startY = Math.random() * height
          ctx.moveTo(startX, startY)
          ctx.lineTo(startX + Math.random() * 80 - 40, startY + Math.random() * 80 - 40)
          ctx.stroke()
        }
        break
        
      case 'grid':
        // 方格纹理
        ctx.strokeStyle = 'rgba(0, 0, 0, 0.06)'
        ctx.lineWidth = 1
        for (let x = 0; x <= width; x += 30) {
          ctx.beginPath()
          ctx.moveTo(x, 0)
          ctx.lineTo(x, height)
          ctx.stroke()
        }
        for (let y = 0; y <= height; y += 30) {
          ctx.beginPath()
          ctx.moveTo(0, y)
          ctx.lineTo(width, y)
          ctx.stroke()
        }
        break
        
      case 'dots':
        // 圆点纹理
        for (let x = 20; x < width; x += 25) {
          for (let y = 20; y < height; y += 25) {
            ctx.beginPath()
            ctx.arc(x, y, 2, 0, Math.PI * 2)
            ctx.fillStyle = 'rgba(0, 0, 0, 0.06)'
            ctx.fill()
          }
        }
        break
        
      case 'lines':
        // 横线纹理
        ctx.strokeStyle = 'rgba(0, 0, 0, 0.05)'
        ctx.lineWidth = 1
        for (let y = 40; y <= height; y += 28) {
          ctx.beginPath()
          ctx.moveTo(0, y)
          ctx.lineTo(width, y)
          ctx.stroke()
        }
        break
        
      case 'diagonal':
        // 斜线纹理
        ctx.strokeStyle = 'rgba(0, 0, 0, 0.05)'
        ctx.lineWidth = 1
        const spacing = 25
        for (let i = -height; i < width + height; i += spacing) {
          ctx.beginPath()
          ctx.moveTo(i, 0)
          ctx.lineTo(i + height, height)
          ctx.stroke()
        }
        break
        
      case 'cross':
        // 十字纹理
        const crossSize = 5
        const crossSpacing = 35
        ctx.strokeStyle = 'rgba(0, 0, 0, 0.08)'
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
        ctx.strokeStyle = 'rgba(0, 0, 0, 0.05)'
        ctx.lineWidth = 1
        for (let x = 40; x <= width; x += 28) {
          ctx.beginPath()
          ctx.moveTo(x, 0)
          ctx.lineTo(x, height)
          ctx.stroke()
        }
        break
        
      case 'checkerboard':
        // 棋盘纹理
        const checkSize = 25
        ctx.fillStyle = 'rgba(0, 0, 0, 0.04)'
        for (let x = 0; x < width; x += checkSize) {
          for (let y = 0; y < height; y += checkSize) {
            if ((Math.floor(x / checkSize) + Math.floor(y / checkSize)) % 2 === 0) {
              ctx.fillRect(x, y, checkSize, checkSize)
            }
          }
        }
        break
        
      case 'noise':
        // 噪点纹理 - 更密集
        for (let i = 0; i < 8000; i++) {
          const x = Math.random() * width
          const y = Math.random() * height
          const opacity = Math.random() * 0.08 + 0.02
          ctx.fillStyle = Math.random() > 0.5 ? `rgba(0, 0, 0, ${opacity})` : `rgba(255, 255, 255, ${opacity})`
          ctx.fillRect(x, y, 2, 2)
        }
        break
        
      case 'waves':
        // 波浪纹理
        ctx.strokeStyle = 'rgba(0, 0, 0, 0.05)'
        ctx.lineWidth = 1
        const waveSpacing = 20
        for (let y = 0; y < height; y += waveSpacing) {
          ctx.beginPath()
          for (let x = 0; x <= width; x += 5) {
            const waveY = y + Math.sin(x * 0.05) * 5
            if (x === 0) {
              ctx.moveTo(x, waveY)
            } else {
              ctx.lineTo(x, waveY)
            }
          }
          ctx.stroke()
        }
        break
        
      case 'hexagon':
        // 六边形纹理
        const hexSize = 18
        const hexHeight = hexSize * Math.sqrt(3)
        ctx.strokeStyle = 'rgba(0, 0, 0, 0.06)'
        ctx.lineWidth = 1
        for (let row = 0; row < height / hexHeight + 2; row++) {
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
        // 点阵纹理 - 不规则点阵
        for (let i = 0; i < 2000; i++) {
          const x = Math.random() * width
          const y = Math.random() * height
          const size = Math.random() > 0.8 ? 2 : 1
          ctx.fillStyle = `rgba(0, 0, 0, ${Math.random() * 0.1 + 0.03})`
          ctx.fillRect(x, y, size, size)
        }
        break
    }
    
    ctx.restore()
  }, [])

  // 自动换行函数
  const wrapText = useCallback((ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string[] => {
    const lines: string[] = []
    const paragraphs = text.split('\n')
    
    paragraphs.forEach((paragraph) => {
      if (paragraph.trim() === '') {
        lines.push('')
        return
      }
      
      let currentLine = ''
      const chars = paragraph.split('')
      
      for (let i = 0; i < chars.length; i++) {
        const char = chars[i]
        const testLine = currentLine + char
        const metrics = ctx.measureText(testLine)
        const testWidth = metrics.width
        
        if (testWidth > maxWidth && currentLine !== '') {
          lines.push(currentLine)
          currentLine = char
        } else {
          currentLine = testLine
        }
      }
      
      if (currentLine !== '') {
        lines.push(currentLine)
      }
    })
    
    return lines
  }, [])

  // 绘制装饰元素
  const drawDecorations = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
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
  }

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
      
      // 自动换行处理
      const wrappedLines = wrapText(ctx, text, maxTextWidth)
      
      const lineHeightPx = fontSize * lineHeight
      const totalHeight = wrappedLines.length * lineHeightPx
      const startY = (height - totalHeight) / 2 + lineHeightPx / 2

      let x = width / 2
      if (textAlign === 'left') x = padding
      if (textAlign === 'right') x = width - padding

      wrappedLines.forEach((line, index) => {
        const y = startY + index * lineHeightPx
        ctx.fillText(line, x, y)
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
  }, [text, selectedStyle, selectedFont, textAlign, fontSize, lineHeight, padding, shadowBlur, selectedRatio, wrapText, drawTexture])

  // 实时预览
  useEffect(() => {
    const timer = setTimeout(() => {
      generateImage()
    }, 150)
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 sm:h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-violet-500 to-fuchsia-500 rounded-xl flex items-center justify-center">
              <Type className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </div>
            <h1 className="text-base sm:text-xl font-bold bg-gradient-to-r from-violet-600 to-fuchsia-600 bg-clip-text text-transparent">
              文字转图片
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={resetSettings}
              className="gap-1 sm:gap-2 text-xs sm:text-sm h-8 sm:h-9"
            >
              <RefreshCw className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">重置</span>
            </Button>
            <Button
              onClick={downloadImage}
              disabled={!generatedImage}
              size="sm"
              className="gap-1 sm:gap-2 bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-700 hover:to-fuchsia-700 text-xs sm:text-sm h-8 sm:h-9"
            >
              <Download className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">下载</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:items-start">
          {/* Left Panel - Controls */}
          <div className="space-y-3 sm:space-y-4 lg:max-h-[calc(100vh-100px)] lg:overflow-y-auto lg:pr-2">
            {/* Text Input */}
            <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-slate-200">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Type className="w-4 h-4 sm:w-5 sm:h-5 text-violet-500" />
                  <h2 className="text-sm sm:text-base font-semibold text-slate-800">文字内容</h2>
                </div>
                <div className="flex items-center gap-1">
                  <button onClick={() => insertFormat('bold')} className="p-1.5 hover:bg-slate-100 rounded-lg" title="粗体">
                    <Bold className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-600" />
                  </button>
                  <button onClick={() => insertFormat('italic')} className="p-1.5 hover:bg-slate-100 rounded-lg" title="斜体">
                    <Italic className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-600" />
                  </button>
                  <button onClick={() => insertFormat('underline')} className="p-1.5 hover:bg-slate-100 rounded-lg" title="下划线">
                    <Underline className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-600" />
                  </button>
                  <button onClick={() => insertFormat('highlight')} className="p-1.5 hover:bg-slate-100 rounded-lg" title="高亮">
                    <Highlighter className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-600" />
                  </button>
                </div>
              </div>
              
              <Textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="在这里输入你想要转换成图片的文字...&#10;支持 **粗体** *斜体* __下划线__ ==高亮=="
                className="min-h-[100px] sm:min-h-[120px] resize-none text-sm sm:text-base"
              />
              
              <div className="flex items-center justify-between mt-3">
                <p className="text-xs text-slate-500">
                  支持 **粗体** *斜体* __下划线__ ==高亮==
                </p>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearText}
                  className="text-slate-500 hover:text-red-500 hover:bg-red-50 text-xs h-7"
                >
                  清空
                </Button>
              </div>
            </div>

            {/* Aspect Ratio */}
            <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-slate-200">
              <div className="flex items-center gap-2 mb-3">
                <Layout className="w-4 h-4 sm:w-5 sm:h-5 text-violet-500" />
                <h2 className="text-sm sm:text-base font-semibold text-slate-800">图片比例</h2>
              </div>
              <div className="grid grid-cols-4 gap-2">
                {aspectRatios.map((ratio) => (
                  <button
                    key={ratio.id}
                    onClick={() => setSelectedRatio(ratio)}
                    className={`py-2 px-1 sm:px-3 rounded-xl border-2 text-xs sm:text-sm font-medium transition-all ${
                      selectedRatio.id === ratio.id
                        ? 'border-violet-500 bg-violet-50 text-violet-700'
                        : 'border-slate-200 text-slate-600 hover:border-slate-300'
                    }`}
                  >
                    {ratio.id}
                  </button>
                ))}
              </div>
            </div>

            {/* Background Style */}
            <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-slate-200">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Palette className="w-4 h-4 sm:w-5 sm:h-5 text-violet-500" />
                  <h2 className="text-sm sm:text-base font-semibold text-slate-800">背景样式</h2>
                </div>
                <button
                  onClick={() => setCustomDialogOpen(true)}
                  className="flex items-center gap-1 px-2 py-1 text-xs font-medium text-violet-600 bg-violet-50 hover:bg-violet-100 rounded-lg transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  自定义
                </button>
              </div>
              
              {/* Tab Switch - 3 tabs */}
              <div className="flex gap-1.5 mb-3">
                {[
                  { id: 'gradient', label: '渐变' },
                  { id: 'solid', label: '纯色' },
                  { id: 'texture', label: '纹理' },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveBgTab(tab.id as 'gradient' | 'solid' | 'texture')}
                    className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-medium transition-all ${
                      activeBgTab === tab.id
                        ? 'bg-violet-500 text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
              
              {/* Gradient Backgrounds */}
              {activeBgTab === 'gradient' && (
                <div className="grid grid-cols-6 gap-1.5">
                  {gradientStyles.map((style) => (
                    <button
                      key={style.id}
                      onClick={() => setSelectedStyle(style)}
                      className={`relative aspect-square rounded-lg overflow-hidden transition-all ${
                        selectedStyle.id === style.id
                          ? 'ring-2 ring-violet-500 ring-offset-1'
                          : 'hover:scale-105'
                      }`}
                      title={style.name}
                    >
                      <div
                        className="w-full h-full"
                        style={{ background: `linear-gradient(135deg, ${style.colors?.[0]}, ${style.colors?.[1]})` }}
                      />
                      {selectedStyle.id === style.id && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                          <Check className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              )}
              
              {/* Solid Backgrounds */}
              {activeBgTab === 'solid' && (
                <div className="grid grid-cols-6 gap-1.5">
                  {solidStyles.map((style) => (
                    <button
                      key={style.id}
                      onClick={() => setSelectedStyle(style)}
                      className={`relative aspect-square rounded-lg overflow-hidden transition-all border ${
                        selectedStyle.id === style.id
                          ? 'ring-2 ring-violet-500 ring-offset-1 border-violet-500'
                          : 'border-slate-200 hover:scale-105'
                      }`}
                      title={style.name}
                      style={{ backgroundColor: style.color }}
                    >
                      {selectedStyle.id === style.id && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/10">
                          <Check className={`w-3 h-3 sm:w-4 sm:h-4 ${style.textColor === '#ffffff' ? 'text-white' : 'text-slate-800'}`} />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              )}

              {/* Texture Backgrounds */}
              {activeBgTab === 'texture' && (
                <div className="grid grid-cols-6 gap-1.5">
                  {textureStyles.map((style) => (
                    <button
                      key={style.id}
                      onClick={() => setSelectedStyle(style)}
                      className={`relative aspect-square rounded-lg overflow-hidden transition-all border bg-white ${
                        selectedStyle.id === style.id
                          ? 'ring-2 ring-violet-500 ring-offset-1 border-violet-500'
                          : 'border-slate-200 hover:scale-105'
                      }`}
                      title={style.name}
                    >
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-slate-400">{getTextureIcon(style.textureType!)}</span>
                        <span className="text-[9px] text-slate-500 mt-0.5">{style.name}</span>
                      </div>
                      {selectedStyle.id === style.id && (
                        <div className="absolute inset-0 flex items-center justify-center bg-violet-500/10">
                          <Check className="w-3 h-3 sm:w-4 sm:h-4 text-violet-500" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              )}

              {/* 自定义背景 */}
              {customStyles.length > 0 && (
                <div className="mt-3">
                  <p className="text-xs text-slate-500 mb-2">自定义</p>
                  <div className="grid grid-cols-6 gap-1.5">
                    {customStyles.map((style) => (
                      <button
                        key={style.id}
                        onClick={() => setSelectedStyle(style)}
                        className={`relative aspect-square rounded-lg overflow-hidden transition-all ${
                          selectedStyle.id === style.id
                            ? 'ring-2 ring-violet-500 ring-offset-1'
                            : 'hover:scale-105'
                        }`}
                      >
                        <img
                          src={style.imageUrl}
                          alt={style.name}
                          className="w-full h-full object-cover"
                        />
                        {selectedStyle.id === style.id && (
                          <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                            <Check className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                          </div>
                        )}
                        <div
                          onClick={(e) => deleteCustomStyle(style.id, e)}
                          className="absolute top-0.5 right-0.5 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity"
                        >
                          <X className="w-2.5 h-2.5 text-white" />
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Font Settings */}
            <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-slate-200">
              <div className="flex items-center gap-2 mb-3">
                <Layout className="w-4 h-4 sm:w-5 sm:h-5 text-violet-500" />
                <h2 className="text-sm sm:text-base font-semibold text-slate-800">字体设置</h2>
              </div>
              
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label className="text-xs text-slate-500 mb-1.5 block">字体</Label>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="w-full justify-between h-8 sm:h-9 text-xs">
                          {selectedFont.name}
                          <ChevronDown className="w-3 h-3" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        {fontFamilies.map((font) => (
                          <DropdownMenuItem key={font.id} onClick={() => setSelectedFont(font)} className="text-xs">
                            {font.name}
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  <div>
                    <Label className="text-xs text-slate-500 mb-1.5 block">对齐</Label>
                    <div className="flex gap-1">
                      {[
                        { id: 'left', icon: AlignLeft },
                        { id: 'center', icon: AlignCenter },
                        { id: 'right', icon: AlignRight },
                      ].map((align) => (
                        <button
                          key={align.id}
                          onClick={() => setTextAlign(align.id as 'left' | 'center' | 'right')}
                          className={`flex-1 py-2 rounded-lg border transition-all ${
                            textAlign === align.id
                              ? 'border-violet-500 bg-violet-50 text-violet-700'
                              : 'border-slate-200 text-slate-600 hover:border-slate-300'
                          }`}
                        >
                          <align.icon className="w-4 h-4 mx-auto" />
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <div className="flex justify-between mb-1">
                      <Label className="text-xs text-slate-500">字号</Label>
                      <span className="text-xs text-slate-400">{fontSize}px</span>
                    </div>
                    <Slider value={[fontSize]} onValueChange={(v) => setFontSize(v[0])} min={24} max={120} step={4} />
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <Label className="text-xs text-slate-500">行高</Label>
                      <span className="text-xs text-slate-400">{lineHeight}</span>
                    </div>
                    <Slider value={[lineHeight]} onValueChange={(v) => setLineHeight(v[0])} min={1} max={2.5} step={0.1} />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <div className="flex justify-between mb-1">
                      <Label className="text-xs text-slate-500">边距</Label>
                      <span className="text-xs text-slate-400">{padding}px</span>
                    </div>
                    <Slider value={[padding]} onValueChange={(v) => setPadding(v[0])} min={40} max={150} step={10} />
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <Label className="text-xs text-slate-500">阴影</Label>
                      <span className="text-xs text-slate-400">{shadowBlur}px</span>
                    </div>
                    <Slider value={[shadowBlur]} onValueChange={(v) => setShadowBlur(v[0])} min={0} max={50} step={2} />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Panel - Preview */}
          <div className="lg:sticky lg:top-20">
            <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-slate-200">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-sm sm:text-base font-semibold text-slate-800">实时预览</h2>
                <span className="text-xs text-slate-400">
                  {selectedRatio.width} × {selectedRatio.height}
                </span>
              </div>

              <div 
                className="relative rounded-xl overflow-hidden shadow-lg bg-slate-100 mx-auto"
                style={{ 
                  aspectRatio: selectedRatio.id.replace(':', '/'),
                  maxWidth: isMobile ? '100%' : '380px'
                }}
              >
                {generatedImage ? (
                  <img
                    src={generatedImage}
                    alt="Preview"
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <p className="text-slate-400 text-sm">输入文字以预览</p>
                  </div>
                )}
                {isGenerating && (
                  <div className="absolute inset-0 bg-black/10 flex items-center justify-center">
                    <div className="w-8 h-8 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
                  </div>
                )}
              </div>

              <Button
                onClick={downloadImage}
                disabled={!generatedImage}
                className="w-full mt-4 gap-2 bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-700 hover:to-fuchsia-700 sm:hidden"
              >
                <Download className="w-4 h-4" />
                下载图片
              </Button>

              <div className="mt-4 p-3 bg-violet-50 rounded-xl">
                <h3 className="text-xs font-semibold text-violet-800 mb-1">使用提示</h3>
                <ul className="text-xs text-violet-700 space-y-0.5">
                  <li>• 修改设置后会实时更新预览</li>
                  <li>• 文字会根据图片宽度自动换行</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Custom Image Dialog */}
      <Dialog open={customDialogOpen} onOpenChange={setCustomDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>自定义背景图片</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <div>
              <Label className="text-sm text-slate-600 mb-2 block">上传本地图片</Label>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageUpload}
                accept="image/*"
                className="hidden"
              />
              <Button
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                className="w-full gap-2"
              >
                <Upload className="w-4 h-4" />
                选择图片
              </Button>
            </div>
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-slate-500">或</span>
              </div>
            </div>
            <div>
              <Label className="text-sm text-slate-600 mb-2 block">图片链接</Label>
              <div className="flex gap-2">
                <Input
                  value={customImageUrl}
                  onChange={(e) => setCustomImageUrl(e.target.value)}
                  placeholder="https://example.com/image.jpg"
                />
                <Button onClick={addImageUrl} variant="outline">
                  添加
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
