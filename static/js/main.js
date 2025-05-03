/**
 * 日本打车费用计算器 - 前端主脚本
 * 使用 OpenStreetMap 和 Leaflet.js 实现地图功能
 * 使用 OSRM 进行路线规划
 * 使用 Nominatim 进行地理编码
 */

let map;
let control;

/**
 * 日志显示函数
 * @param {string} message - 要显示的日志消息
 * @param {string} type - 日志类型：'info' | 'success' | 'error'
 */
function logMessage(message, type = 'info') {
    const logContainer = document.getElementById('log');
    const logEntry = document.createElement('div');
    logEntry.className = `log-entry ${type}`;
    logEntry.textContent = `[${new Date().toLocaleTimeString()}] ${message}`;
    logContainer.appendChild(logEntry);
    logContainer.scrollTop = logContainer.scrollHeight;
}

/**
 * 初始化地图和相关组件
 */
function initMap() {
    logMessage('正在初始化地图...');
    // 初始化地图，默认显示东京
    map = L.map('map').setView([35.6762, 139.6503], 12);
    
    // 添加 OpenStreetMap 图层
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    // 初始化路线控制
    control = L.Routing.control({
        waypoints: [],
        routeWhileDragging: true,
        show: false,
        addWaypoints: false,
        draggableWaypoints: false,
        fitSelectedRoutes: true,
        showAlternatives: false,
        language: 'en',
        serviceUrl: 'https://router.project-osrm.org/route/v1',
        createMarker: function(i, waypoint, n) {
            return L.marker(waypoint.latLng, {
                draggable: false
            });
        }
    }).addTo(map);

    // 添加计算按钮事件监听
    document.getElementById('calculate').addEventListener('click', calculateRoute);
    logMessage('地图初始化完成', 'success');
}

/**
 * 地理编码函数，将地点名称转换为坐标
 * @param {string} query - 要搜索的地点名称
 * @returns {Promise<{lat: number, lng: number, display_name: string}>}
 */
async function geocodeLocation(query) {
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&countrycodes=jp&limit=1`;
    logMessage(`正在搜索地点: ${query}`);
    
    try {
        const response = await fetch(url);
        const data = await response.json();
        
        if (data.length === 0) {
            logMessage(`未找到地点: ${query}`, 'error');
            throw new Error('未找到地点');
        }
        
        logMessage(`找到地点: ${data[0].display_name}`, 'success');
        return {
            lat: parseFloat(data[0].lat),
            lng: parseFloat(data[0].lon),
            display_name: data[0].display_name
        };
    } catch (error) {
        logMessage(`地理编码错误: ${error.message}`, 'error');
        throw error;
    }
}

/**
 * 计算路线和费用
 * 1. 获取起点和终点
 * 2. 进行地理编码
 * 3. 计算路线
 * 4. 计算费用
 */
function calculateRoute() {
    logMessage('开始计算路线...');
    const start = document.getElementById('start').value;
    const end = document.getElementById('end').value;

    if (!start || !end) {
        logMessage('请输入起点和终点', 'error');
        alert('请输入起点和终点');
        return;
    }

    logMessage(`起点: ${start}`);
    logMessage(`终点: ${end}`);

    // 使用地理编码函数
    Promise.all([
        geocodeLocation(start),
        geocodeLocation(end)
    ]).then(([startLocation, endLocation]) => {
        const startLatLng = L.latLng(startLocation.lat, startLocation.lng);
        const endLatLng = L.latLng(endLocation.lat, endLocation.lng);

        logMessage(`起点坐标: ${startLatLng.lat}, ${startLatLng.lng}`);
        logMessage(`终点坐标: ${endLatLng.lat}, ${endLatLng.lng}`);

        // 设置路线
        control.setWaypoints([
            startLatLng,
            endLatLng
        ]);

        // 监听路线计算完成事件
        control.on('routesfound', function(e) {
            const routes = e.routes;
            const route = routes[0];
            const distance = route.summary.totalDistance / 1000; // 转换为公里
            const duration = route.summary.totalTime / 60; // 转换为分钟

            logMessage(`路线计算完成: ${distance.toFixed(2)} 公里, ${duration.toFixed(0)} 分钟`, 'success');

            // 发送到后端计算费用
            fetch('/calculate_fare', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    distance: distance,
                    duration: duration
                })
            })
            .then(response => response.json())
            .then(data => {
                logMessage(`费用计算结果: ${data.fare} 日元`, 'success');
                document.getElementById('distance').textContent = data.distance;
                document.getElementById('duration').textContent = data.duration;
                document.getElementById('fare').textContent = data.fare;
            })
            .catch(error => {
                logMessage(`计算费用错误: ${error.message}`, 'error');
                alert('计算费用时发生错误，请稍后重试');
            });
        });

        // 添加错误处理
        control.on('routingerror', function(e) {
            logMessage(`路线规划错误: ${e.error.message}`, 'error');
            alert('无法规划路线，请检查输入的地点是否正确');
        });
    }).catch(error => {
        logMessage(`地理编码错误: ${error.message}`, 'error');
        alert('无法找到指定的地点，请检查输入是否正确');
    });
}

// 初始化地图
document.addEventListener('DOMContentLoaded', initMap); 