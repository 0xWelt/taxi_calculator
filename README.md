# 日本打车费用计算器

<div align="center">

![应用界面截图](static/images/screenshot1.png)

[![Python Version](https://img.shields.io/badge/python-3.x-blue.svg)](https://www.python.org/downloads/)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)
[![uv](https://img.shields.io/badge/package%20manager-uv-blue)](https://github.com/astral-sh/uv)
[![Generated with Cursor](https://img.shields.io/badge/generated%20with-Cursor-blue)](https://cursor.sh)

</div>

## 项目简介

这是一个基于 Web 的日本打车费用计算应用，具有交互式地图界面，可以计算任意两点之间的打车费用。

## 快速开始

### 一键部署

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone)

1. 点击上方的 "Deploy with Vercel" 按钮
2. 登录您的 Vercel 账户（如果没有，需要先注册）
3. 选择您的 GitHub 账户
4. 选择要部署的仓库（Fork 后的仓库）
5. 点击 "Deploy" 按钮

部署完成后，Vercel 会自动为您提供一个域名，您可以通过这个域名访问您的应用。

### 本地开发

1. 克隆项目到本地
2. 安装 uv（如果尚未安装）：
   ```bash
   curl -LsSf https://astral.sh/uv/install.sh | sh
   ```
3. 创建并激活虚拟环境：

   ```bash
   # 创建虚拟环境
   uv venv

   # 在 Unix/macOS 上激活虚拟环境
   source .venv/bin/activate

   # 在 Windows 上激活虚拟环境
   .venv\Scripts\activate
   ```

4. 安装依赖（包括开发依赖）：
   ```bash
   uv pip install -e ".[dev]"
   # 或
   pip install -e ".[dev]"
   ```
5. 运行应用：
   ```bash
   python app.py
   ```

### 依赖与格式化说明

- 所有依赖均在 `pyproject.toml` 中统一管理
- 主依赖：Flask、requests、python-dotenv、flask-cors
- 开发依赖：black、isort、pre-commit
- 依赖安装和格式化命令：
  ```bash
  uv pip install -e ".[dev]"
  pre-commit install
  pre-commit run --all-files
  ```
- Python 代码使用 black、isort
- 前端代码使用 prettier

> **云端部署兼容性说明**：
> Vercel 等平台默认识别 `requirements.txt`，本项目已自动同步生成该文件，内容与 `pyproject.toml` 主依赖一致。推荐本地开发用 `pyproject.toml`，云端部署无需额外操作。

## 功能特点

- 🗺️ 交互式地图界面（基于 OpenStreetMap）
- 📝 实时操作日志显示
- 🔍 地点自动搜索和模糊匹配（限制在日本境内）
- 🛣️ 实时路线显示
- 💰 费用计算（基于距离和时间）
- 📱 响应式设计
- 🎯 直观的用户界面
- 🌐 智能地点推荐（支持中文、日文和英文输入）

## 费用计算规则

- 基础费用：410 日元（1.052 公里以内）
- 后续每 237 米加收 80 日元
- 等待时间费用：每 1 分 45 秒加收 80 日元
- 夜间附加费（22:00-05:00）：20%

## 技术栈

- 后端：Python Flask
- 前端：HTML, CSS, JavaScript
- 地图服务：OpenStreetMap + Leaflet.js
- 路线规划：OSRM（Open Source Routing Machine）
- 地理编码：Nominatim
- 包管理：uv

## 使用说明

1. 在起点和终点输入框中输入或选择地点

   - 支持中文、日文和英文输入
   - 输入时会自动显示相关地点建议
   - 点击建议项可快速选择
   - 例如：东京站、涩谷站、新宿站等

2. 点击"计算费用"按钮

   - 系统会自动搜索地点
   - 在地图上显示路线
   - 计算预计费用
   - 实时显示操作日志

3. 查看结果
   - 地图上显示路线
   - 显示距离、时间和费用信息
   - 右侧面板显示详细的操作日志

## 注意事项

- 费用计算基于东京地区的标准费率
- 实际费用可能因交通状况、时间等因素有所不同
- 地理编码服务有使用限制，建议在实际生产环境中使用自己的地理编码服务
- 路线规划可能不如商业地图服务精确，但基本功能都能满足需求
- 地点搜索功能使用防抖处理，输入后会有短暂延迟

## 界面说明

- 左侧面板：

  - 地点搜索框（带智能推荐）
  - 费用计算结果
  - 使用提示
  - 交互式地图

- 右侧面板：
  - 实时操作日志
  - 显示所有操作的状态和结果

## 开发说明

- 前端日志系统使用自定义的 `logMessage` 函数
- 地理编码限制在日本境内（countrycodes=jp）
- 使用 OSRM 的演示服务器进行路线规划
- 地点搜索使用防抖处理，延迟300毫秒
- 搜索结果按重要性排序，最多显示5个结果
- 所有 API 调用都有错误处理和用户提示

## 贡献指南

请查看 [CONTRIBUTING.md](CONTRIBUTING.md) 了解如何为项目做出贡献。

## 安全策略

请查看 [SECURITY.md](SECURITY.md) 了解项目的安全策略。

## 许可证

本项目采用 MIT 许可证 - 详情请参阅 [LICENSE](LICENSE) 文件。
