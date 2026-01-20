# wfmd - Web to Markdown with OCR

[English](#english) | [中文](#中文)

---

## English

Fetch web pages and automatically extract text from images using OCR.

### Features

- Fetch web pages and convert to Markdown
- Automatically detect and OCR images in the page
- **Default OCR**: macocr (macOS native, fast, offline)
- **Advanced OCR**: MinerU Cloud (supports formulas/tables)
- Smart routing: try direct image OCR first, fallback to document conversion
- Support for WeChat articles, Xiaohongshu, and other Chinese platforms
- Safe cleanup mechanism for temporary files
- Default output to `./output/` directory

### API Specification (Stable Interface)

This section defines the stable interface contract. Future updates will maintain backward compatibility with this specification.

#### Command Line Interface

```
wfmd [OPTIONS] <URL> [OUTPUT_DIR]
wfmd -f <FILE> [OUTPUT_DIR]
```

#### Input

| Mode | Input | Description |
|------|-------|-------------|
| URL mode | `<URL>` | Any valid HTTP/HTTPS URL |
| File mode | `-f <FILE>` | Local Markdown file path |

#### Output

| File | Pattern | Description |
|------|---------|-------------|
| Original | `{YYYY-MM-DD-HHmmss} - {title}.md` | Raw fetched content |
| OCR Enhanced | `{YYYY-MM-DD-HHmmss} - {title}_OCR.md` | With OCR content appended |

**Default output directory:** `./output/` (auto-created)

#### Options

| Option | Description | Default |
|--------|-------------|---------|
| `-k, --keep` | Keep temporary files | `false` |
| `--mineru` | Use MinerU Cloud OCR | `false` |
| `-f, --file` | Process local file | - |
| `-h, --help` | Show help | - |

#### Environment Variables

| Variable | Values | Default | Description |
|----------|--------|---------|-------------|
| `WFMD_OCR_ENGINE` | `macocr`, `mineru` | `macocr` | OCR engine selection |
| `WFMD_KEEP_TEMP` | `true`, `false` | `false` | Keep temporary files |

#### Exit Codes

| Code | Meaning |
|------|---------|
| `0` | Success |
| `1` | Error (dependency missing, fetch failed, etc.) |

#### stdout

The last line of stdout contains the output file path:
```
Output: /path/to/output/file.md
```

---

### Installation

```bash
npm install -g git+https://github.com/ttieli/web-to-md.git
```

**Required dependencies:**
- `wf` (WebFetcher) - Web scraping
- `macocr` - macOS native OCR (default engine)

```bash
# Install WebFetcher
pipx install git+https://github.com/ttieli/web-fetcher.git
```

**Optional dependencies (for advanced features):**
- `mineru` - MinerU Cloud OCR (for --mineru mode)
- `docxjs` - Document conversion (for fallback mode)

```bash
# Optional: Install MinerU for advanced OCR
npm install -g git+https://github.com/ttieli/mineru-cloud.git

# Optional: Install docxjs for fallback mode
npm install -g github:ttieli/docxjs-cli
```

### Usage

#### Fetch a web page

```bash
wfmd "https://example.com/article"              # Output to ./output/
wfmd "https://mp.weixin.qq.com/s/xxx" ~/Desktop/  # Output to custom dir
```

#### Use MinerU Cloud OCR (advanced)

```bash
wfmd --mineru "https://example.com/article"
# Or via environment variable
WFMD_OCR_ENGINE=mineru wfmd "https://example.com"
```

#### Process an existing Markdown file

```bash
wfmd -f ./article.md
wfmd -f ./article.md ~/output/
```

### How It Works

1. **Fetch**: Use WebFetcher to fetch the web page and convert to Markdown
2. **Detect**: Scan the Markdown for image URLs
3. **OCR (Fast Mode)**: Try to OCR image URLs directly using macocr/mineru
4. **OCR (Fallback)**: If direct OCR fails, convert Markdown to PDF via docxjs, then OCR the entire document
5. **Output**: Generate an enhanced Markdown file with OCR content appended

### Dependencies

| Tool | Type | Required | Purpose |
|------|------|----------|---------|
| wf (webfetcher) | Python | Yes | Web scraping |
| macocr | CLI | Yes | Default OCR engine |
| mineru | Node.js | No | Advanced OCR (--mineru) |
| docxjs | Node.js | No | Fallback mode |

### Debug Mode

```bash
DEBUG_WRAPPER=1 wfmd "https://example.com"
wfmd -k "https://example.com"  # Keep temp files
```

### License

MIT

---

## 中文

抓取网页并自动使用 OCR 提取图片中的文字。

### 功能特点

- 抓取网页并转换为 Markdown
- 自动检测页面中的图片并进行 OCR
- **默认 OCR**：macocr（macOS 原生，快速，离线）
- **高级 OCR**：MinerU 云端（支持公式/表格识别）
- 智能路由：优先尝试直接 OCR 图片，失败后回退到文档转换方案
- 支持微信公众号、小红书等中文平台
- 安全的临时文件清理机制
- 默认输出到 `./output/` 目录

### 接口规范（稳定契约）

本节定义稳定的接口契约。未来更新将保持与此规范的向后兼容性。

#### 命令行接口

```
wfmd [选项] <URL> [输出目录]
wfmd -f <文件> [输出目录]
```

#### 输入

| 模式 | 输入 | 说明 |
|------|------|------|
| URL 模式 | `<URL>` | 任意有效的 HTTP/HTTPS URL |
| 文件模式 | `-f <文件>` | 本地 Markdown 文件路径 |

#### 输出

| 文件 | 命名规则 | 说明 |
|------|----------|------|
| 原始文件 | `{YYYY-MM-DD-HHmmss} - {标题}.md` | 抓取的原始内容 |
| OCR 增强版 | `{YYYY-MM-DD-HHmmss} - {标题}_OCR.md` | 附加 OCR 内容 |

**默认输出目录：** `./output/`（自动创建）

#### 选项

| 选项 | 说明 | 默认值 |
|------|------|--------|
| `-k, --keep` | 保留临时文件 | `false` |
| `--mineru` | 使用 MinerU 云端 OCR | `false` |
| `-f, --file` | 处理本地文件 | - |
| `-h, --help` | 显示帮助 | - |

#### 环境变量

| 变量 | 可选值 | 默认值 | 说明 |
|------|--------|--------|------|
| `WFMD_OCR_ENGINE` | `macocr`, `mineru` | `macocr` | OCR 引擎选择 |
| `WFMD_KEEP_TEMP` | `true`, `false` | `false` | 保留临时文件 |

#### 退出码

| 代码 | 含义 |
|------|------|
| `0` | 成功 |
| `1` | 错误（依赖缺失、抓取失败等） |

#### 标准输出

stdout 的最后一行包含输出文件路径：
```
Output: /path/to/output/file.md
```

---

### 安装

```bash
npm install -g git+https://github.com/ttieli/web-to-md.git
```

**必需依赖：**
- `wf` (WebFetcher) - 网页抓取
- `macocr` - macOS 原生 OCR（默认引擎）

```bash
# 安装 WebFetcher
pipx install git+https://github.com/ttieli/web-fetcher.git
```

**可选依赖（高级功能）：**
- `mineru` - MinerU 云端 OCR（用于 --mineru 模式）
- `docxjs` - 文档转换（用于回退模式）

```bash
# 可选：安装 MinerU 用于高级 OCR
npm install -g git+https://github.com/ttieli/mineru-cloud.git

# 可选：安装 docxjs 用于回退模式
npm install -g github:ttieli/docxjs-cli
```

### 使用方法

#### 抓取网页

```bash
wfmd "https://example.com/article"              # 输出到 ./output/
wfmd "https://mp.weixin.qq.com/s/xxx" ~/Desktop/  # 输出到指定目录
```

#### 使用 MinerU 云端 OCR（高级模式）

```bash
wfmd --mineru "https://example.com/article"
# 或通过环境变量
WFMD_OCR_ENGINE=mineru wfmd "https://example.com"
```

#### 处理已有的 Markdown 文件

```bash
wfmd -f ./article.md
wfmd -f ./article.md ~/output/
```

### 工作原理

1. **抓取**：使用 WebFetcher 抓取网页并转换为 Markdown
2. **检测**：扫描 Markdown 中的图片 URL
3. **OCR（快速模式）**：尝试使用 macocr/mineru 直接 OCR 图片 URL
4. **OCR（回退模式）**：如果直接 OCR 失败，通过 docxjs 将 Markdown 转换为 PDF，然后对整个文档进行 OCR
5. **输出**：生成带有 OCR 内容的增强版 Markdown 文件

### 依赖项

| 工具 | 类型 | 必需 | 用途 |
|------|------|------|------|
| wf (webfetcher) | Python | 是 | 网页抓取 |
| macocr | CLI | 是 | 默认 OCR 引擎 |
| mineru | Node.js | 否 | 高级 OCR (--mineru) |
| docxjs | Node.js | 否 | 回退模式 |

### 调试模式

```bash
DEBUG_WRAPPER=1 wfmd "https://example.com"
wfmd -k "https://example.com"  # 保留临时文件
```

### 许可证

MIT
