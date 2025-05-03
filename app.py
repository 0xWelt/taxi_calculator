from flask import Flask, render_template, request, jsonify
from flask_cors import CORS
import os
from dotenv import load_dotenv

app = Flask(__name__)
CORS(app)  # 启用 CORS
load_dotenv()

# 日本出租车基本费率（东京地区）
BASE_FARE = 410  # 日元
PER_KM_RATE = 80  # 日元/公里
WAITING_RATE = 80  # 日元/分钟

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/calculate_fare', methods=['POST'])
def calculate_fare():
    try:
        data = request.get_json()
        print('收到请求数据:', data)
        
        distance = float(data.get('distance', 0))  # 公里
        duration = float(data.get('duration', 0))  # 分钟
        
        print(f'距离: {distance} 公里, 时间: {duration} 分钟')
        
        # 计算费用
        fare = BASE_FARE + (distance * PER_KM_RATE) + (duration * WAITING_RATE)
        
        result = {
            'fare': round(fare),
            'distance': round(distance, 2),
            'duration': round(duration, 2)
        }
        
        print('计算结果:', result)
        return jsonify(result)
    except Exception as e:
        print('计算错误:', str(e))
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True) 