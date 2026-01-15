# wfmd - Web to Markdown with OCR

[English](#english) | [中文](#中文)

---

## English

Fetch web pages and automatically extract text from images using OCR.

### Features

- Fetch web pages and convert to Markdown
- Automatically detect and OCR images in the page
- Smart routing: try direct image OCR first, fallback to document conversion
- Support for WeChat articles, Xiaohongshu, and other Chinese platforms
- Safe cleanup mechanism for temporary files

### Installation

```bash
npm install -g github:ttieli/web-to-md
```

This will automatically install the following dependencies:
- `mineru-cli` - MinerU Cloud OCR CLI
- `docxjs-cli` - Markdown to DOCX converter

**Note:** You also need to install `webfetcher` (Python package) for web scraping:

```bash
pipx install git+https://github.com/ttieli/web-fetcher.git
```

The postinstall script will attempt to install it automatically.

### Usage

#### Fetch a web page

```bash
wfmd "https://example.com/article"
wfmd "https://mp.weixin.qq.com/s/xxx" ~/Desktop/
```

#### Process an existing Markdown file

```bash
wfmd -f ./article.md
wfmd -f ./article.md ~/output/
```

#### Options

```
-f, --file    Process an existing Markdown file
-k, --keep    Keep temporary files (for debugging)
-h, --help    Show help
```

### How It Works

1. **Fetch**: Use WebFetcher to fetch the web page and convert to Markdown
2. **Detect**: Scan the Markdown for image URLs
3. **OCR (Fast Mode)**: Try to OCR image URLs directly using MinerU
4. **OCR (Fallback)**: If direct OCR fails, convert Markdown to PDF via docxjs, then OCR the entire document
5. **Output**: Generate an enhanced Markdown file with OCR content appended

### Output Files

| File | Description |
|------|-------------|
| `{timestamp} - {title}.md` | Original fetched content |
| `{name}_OCR.md` | Enhanced version with OCR content |
| `{name}_MinerU_{ts}/` | Fallback mode output directory |

### Dependencies

| Tool | Type | Purpose | Repository |
|------|------|---------|------------|
| webfetcher | Python | Web scraping | https://github.com/ttieli/web-fetcher |
| mineru-cli | Node.js | OCR processing | https://github.com/ttieli/mineru-cloud |
| docxjs-cli | Node.js | Document conversion | https://github.com/ttieli/docxjs-cli |

### Debug Mode

Enable debug output:

```bash
DEBUG_WRAPPER=1 wfmd "https://example.com"
```

### License

MIT

---

## 中文

抓取网页并自动使用 OCR 提取图片中的文字。

### 功能特点

- 抓取网页并转换为 Markdown
- 自动检测页面中的图片并进行 OCR
- 智能路由：优先尝试直接 OCR 图片，失败后回退到文档转换方案
- 支持微信公众号、小红书等中文平台
- 安全的临时文件清理机制

### 安装

```bash
npm install -g github:ttieli/web-to-md
```

安装时会自动安装以下依赖：
- `mineru-cli` - MinerU Cloud OCR 命令行工具
- `docxjs-cli` - Markdown 转 DOCX 转换器

**注意：** 还需要安装 `webfetcher`（Python 包）用于网页抓取：

```bash
pipx install git+https://github.com/ttieli/web-fetcher.git
```

安装后脚本会尝试自动安装此依赖。

### 使用方法

#### 抓取网页

```bash
wfmd "https://example.com/article"
wfmd "https://mp.weixin.qq.com/s/xxx" ~/Desktop/
```

#### 处理已有的 Markdown 文件

```bash
wfmd -f ./article.md
wfmd -f ./article.md ~/output/
```

#### 命令选项

```
-f, --file    处理已有的 Markdown 文件
-k, --keep    保留临时文件（用于调试）
-h, --help    显示帮助
```

### 工作原理

1. **抓取**：使用 WebFetcher 抓取网页并转换为 Markdown
2. **检测**：扫描 Markdown 中的图片 URL
3. **OCR（快速模式）**：尝试使用 MinerU 直接 OCR 图片 URL
4. **OCR（回退模式）**：如果直接 OCR 失败，通过 docxjs 将 Markdown 转换为 PDF，然后对整个文档进行 OCR
5. **输出**：生成带有 OCR 内容的增强版 Markdown 文件

### 输出文件

| 文件 | 说明 |
|------|------|
| `{timestamp} - {title}.md` | 原始抓取内容 |
| `{name}_OCR.md` | 带 OCR 内容的增强版 |
| `{name}_MinerU_{ts}/` | 回退模式输出目录 |

### 依赖项

| 工具 | 类型 | 用途 | 仓库地址 |
|------|------|------|----------|
| webfetcher | Python | 网页抓取 | https://github.com/ttieli/web-fetcher |
| mineru-cli | Node.js | OCR 处理 | https://github.com/ttieli/mineru-cloud |
| docxjs-cli | Node.js | 文档转换 | https://github.com/ttieli/docxjs-cli |

### 调试模式

启用调试输出：

```bash
DEBUG_WRAPPER=1 wfmd "https://example.com"
```

### 许可证

MIT
