"""
日本打车费用计算器 - 后端主程序
使用 Flask 框架提供 Web 服务
提供路线规划和费用计算功能
"""

import os
from datetime import datetime

import requests
from dotenv import load_dotenv
from flask import Flask, jsonify, render_template, request
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # 启用 CORS 支持
load_dotenv()

# 汇率缓存
exchange_rate = None
exchange_rate_date = None


def get_exchange_rate():
    """
    获取日元兑人民币汇率
    :return: 汇率和日期
    """
    global exchange_rate, exchange_rate_date

    if exchange_rate is None:
        try:
            # 使用公开的汇率API
            response = requests.get("https://api.exchangerate-api.com/v4/latest/JPY")
            data = response.json()
            exchange_rate = data["rates"]["CNY"]
            # 使用API返回的更新时间
            exchange_rate_date = data["date"]
            return exchange_rate, exchange_rate_date
        except Exception as e:
            print(f"获取汇率失败: {e}")
            return 0.05, datetime.now().strftime("%Y-%m-%d")  # 使用默认汇率和当前日期
    return exchange_rate, exchange_rate_date


# 东京出租车费用计算规则
# 起步价：410 日元（1.052 公里以内）
# 后续每 237 米加收 80 日元
# 夜间附加费（22:00-05:00）：20%
# 等待时间：每 1 分 45 秒加收 80 日元


def calculate_taxi_fare(distance_km, duration_min):
    """
    计算出租车费用
    :param distance_km: 距离（公里）
    :param duration_min: 时间（分钟）
    :return: 费用明细字典
    """
    # 起步价
    base_fare = 410

    # 超出起步距离的部分
    if distance_km > 1.052:
        extra_distance = distance_km - 1.052
        distance_fare = (extra_distance * 1000 / 237) * 80
    else:
        distance_fare = 0

    # 等待时间费用（低速行驶费）
    slow_fare = (duration_min / 1.75) * 80

    # 夜间附加费（假设当前时间为夜间）
    night_surcharge = (base_fare + distance_fare + slow_fare) * 0.2

    # 总费用
    total_fare = base_fare + distance_fare + slow_fare + night_surcharge

    return {
        "base_fare": round(base_fare),
        "distance_fare": round(distance_fare),
        "slow_fare": round(slow_fare),
        "night_surcharge": round(night_surcharge),
        "total_fare": round(total_fare),
    }


@app.route("/")
def index():
    """
    渲染主页面
    :return: HTML 页面
    """
    return render_template("index.html")


@app.route("/calculate_fare", methods=["POST"])
def calculate_fare():
    """
    计算路线费用
    :return: JSON 格式的响应，包含距离、时间和费用明细
    """
    data = request.get_json()
    distance = float(data["distance"])
    duration = float(data["duration"])

    fare_details = calculate_taxi_fare(distance, duration)
    rate, rate_date = get_exchange_rate()
    cny_fare = round(fare_details["total_fare"] * rate, 2)

    return jsonify(
        {
            "distance": f"{distance:.2f} km",
            "duration": f"{duration:.0f} min",
            "fare": f'{fare_details["total_fare"]:,} JPY',
            "cny_fare": f"{int(round(cny_fare)):,} CNY",
            "exchange_rate": f"{rate:.4f}",
            "exchange_rate_date": rate_date,
            "base_fare": f'{fare_details["base_fare"]:,}',
            "distance_fare": f'{fare_details["distance_fare"]:,}',
            "slow_fare": f'{fare_details["slow_fare"]:,}',
            "night_surcharge": f'{fare_details["night_surcharge"]:,}',
        }
    )


@app.route("/get_exchange_rate", methods=["GET"])
def get_exchange_rate_endpoint():
    """
    获取当前汇率信息
    :return: JSON 格式的响应，包含汇率和日期
    """
    rate, rate_date = get_exchange_rate()
    return jsonify({"exchange_rate": f"{rate:.4f}", "exchange_rate_date": rate_date})


# 添加 Vercel 所需的处理程序
@app.route("/api/<path:path>", methods=["GET", "POST"])
def api_handler(path):
    if path == "calculate_fare":
        return calculate_fare()
    elif path == "get_exchange_rate":
        return get_exchange_rate_endpoint()
    return jsonify({"error": "Not found"}), 404


# 本地运行代码
if __name__ == "__main__":
    print("正在启动本地服务器...")
    print("访问地址: http://localhost:5000")
    app.run(debug=True)
