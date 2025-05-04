# 日本打车费用计算器

<div align="center">

![应用界面截图](static/images/screenshot1.png)

[![Python Version](https://img.shields.io/badge/python-3.x-blue.svg)](https://www.python.org/downloads/)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)
[![uv](https://img.shields.io/badge/package%20manager-uv-blue)](https://github.com/astral-sh/uv)
[![Generated with Cursor](https://img.shields.io/badge/generated%20with-Cursor-blue)](https://cursor.sh)

</div>

## 项目简介

基于 Web 的日本打车费用计算应用，支持交互式地图、实时路线与费用明细、操作日志、地点智能搜索等功能。

---

## 快速开始

### 一键部署（推荐 Vercel）

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone)

1. 点击上方按钮，登录 Vercel 并选择仓库，自动部署。
2. 部署完成后，Vercel 会分配访问域名。

### 本地开发

1. 克隆项目到本地
2. 安装 uv（如未安装）：
   ```bash
   curl -LsSf https://astral.sh/uv/install.sh | sh
   ```
3. 创建并激活虚拟环境：
   ```bash
   uv venv
   source .venv/bin/activate  # macOS/Linux
   .venv\Scripts\activate     # Windows
   ```
4. 安装依赖（含开发依赖）：
   ```bash
   uv pip install -e ".[dev]"
   ```
5. 运行应用：
   ```bash
   python app.py
   ```

---

## 依赖与格式化

- 所有依赖均在 `pyproject.toml` 统一管理，主依赖自动同步到 `requirements.txt`（云端兼容）。
- 开发依赖：black、isort、pre-commit、pip-tools
- 推荐命令：
  ```bash
  uv pip install -e ".[dev]"
  pre-commit install
  pre-commit run --all-files
  ```
- Python 代码用 black/isort，前端用 prettier
- **pre-commit hook** 自动同步 requirements.txt，确保与 pyproject.toml 一致

> **云端部署兼容性**：Vercel 等平台默认识别 `requirements.txt`，本地开发推荐用 `pyproject.toml`。

---

## 功能特点

- 🗺️ 交互式地图（OpenStreetMap）
- 📝 实时操作日志
- 🔍 地点智能搜索（中/日/英）
- 🛣️ 路线与费用明细
- 💰 费用计算（距离+时间+夜间+低速）
- 📱 响应式设计

---

## 费用计算规则

- 起步价：410 日元（1.052 公里内）
- 每 237 米加收 80 日元
- 低速行驶：每 1分45秒加收 80 日元
- 夜间加价（22:00-05:00）：20%

---

## 技术栈

- 后端：Python Flask
- 前端：HTML, CSS, JavaScript
- 地图：OpenStreetMap + Leaflet.js
- 路线规划：OSRM
- 地理编码：Nominatim
- 包管理：uv

---

## 使用说明

1. 输入起点和终点（支持中/日/英，智能建议）
2. 点击"计算费用"按钮
3. 查看地图路线、费用明细和操作日志

---

## 注意事项

- 费用基于东京标准，实际费用可能有差异
- 地理编码和路线规划服务有访问限制
- 地点搜索有防抖处理，输入后稍等建议

---

## 贡献与安全

- 贡献指南见 [CONTRIBUTING.md](CONTRIBUTING.md)
- 安全策略见 [SECURITY.md](SECURITY.md)

---

## 许可证

MIT，详见 [LICENSE](LICENSE)
