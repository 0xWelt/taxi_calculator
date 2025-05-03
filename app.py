"""
日本打车费用计算器 - 后端主程序
使用 Flask 框架提供 Web 服务
提供路线规划和费用计算功能
"""

from flask import Flask, render_template, request, jsonify
from flask_cors import CORS
import os
from dotenv import load_dotenv

app = Flask(__name__)
CORS(app)  # 启用 CORS 支持
load_dotenv()

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
    :return: 费用（日元）
    """
    # 起步价
    base_fare = 410
    
    # 超出起步距离的部分
    if distance_km > 1.052:
        extra_distance = distance_km - 1.052
        extra_fare = (extra_distance * 1000 / 237) * 80
    else:
        extra_fare = 0
    
    # 等待时间费用
    wait_fare = (duration_min / 1.75) * 80
    
    # 总费用
    total_fare = base_fare + extra_fare + wait_fare
    
    return round(total_fare)

@app.route('/')
def index():
    """
    渲染主页面
    :return: HTML 页面
    """
    return render_template('index.html')

@app.route('/calculate_fare', methods=['POST'])
def calculate_fare():
    """
    计算路线费用
    :return: JSON 格式的响应，包含距离、时间和费用
    """
    data = request.get_json()
    distance = float(data['distance'])
    duration = float(data['duration'])
    
    fare = calculate_taxi_fare(distance, duration)
    
    return jsonify({
        'distance': f'{distance:.2f} 公里',
        'duration': f'{duration:.0f} 分钟',
        'fare': f'{fare:,} 日元'
    })

if __name__ == '__main__':
    app.run(debug=True) 