let map;
let control;

function initMap() {
    console.log('初始化地图...');
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
    console.log('地图初始化完成');
}

// 地理编码函数，限制在日本范围内
async function geocodeLocation(query) {
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&countrycodes=jp&limit=1`;
    console.log('地理编码请求:', url);
    
    try {
        const response = await fetch(url);
        const data = await response.json();
        console.log('地理编码响应:', data);
        
        if (data.length === 0) {
            throw new Error('未找到地点');
        }
        
        return {
            lat: parseFloat(data[0].lat),
            lng: parseFloat(data[0].lon),
            display_name: data[0].display_name
        };
    } catch (error) {
        console.error('地理编码错误:', error);
        throw error;
    }
}

function calculateRoute() {
    console.log('开始计算路线...');
    const start = document.getElementById('start').value;
    const end = document.getElementById('end').value;

    if (!start || !end) {
        alert('请输入起点和终点');
        return;
    }

    console.log('起点:', start);
    console.log('终点:', end);

    // 使用地理编码函数
    Promise.all([
        geocodeLocation(start),
        geocodeLocation(end)
    ]).then(([startLocation, endLocation]) => {
        console.log('地理编码结果:', { startLocation, endLocation });

        const startLatLng = L.latLng(startLocation.lat, startLocation.lng);
        const endLatLng = L.latLng(endLocation.lat, endLocation.lng);

        console.log('起点坐标:', startLatLng);
        console.log('终点坐标:', endLatLng);

        // 设置路线
        control.setWaypoints([
            startLatLng,
            endLatLng
        ]);

        // 监听路线计算完成事件
        control.on('routesfound', function(e) {
            console.log('路线计算完成:', e);
            const routes = e.routes;
            const route = routes[0];
            const distance = route.summary.totalDistance / 1000; // 转换为公里
            const duration = route.summary.totalTime / 60; // 转换为分钟

            console.log('距离:', distance, '公里');
            console.log('时间:', duration, '分钟');

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
            .then(response => {
                console.log('后端响应:', response);
                return response.json();
            })
            .then(data => {
                console.log('费用计算结果:', data);
                document.getElementById('distance').textContent = data.distance;
                document.getElementById('duration').textContent = data.duration;
                document.getElementById('fare').textContent = data.fare;
            })
            .catch(error => {
                console.error('请求错误:', error);
                alert('计算费用时发生错误，请稍后重试');
            });
        });

        // 添加错误处理
        control.on('routingerror', function(e) {
            console.error('路线规划错误:', e);
            alert('无法规划路线，请检查输入的地点是否正确');
        });
    }).catch(error => {
        console.error('地理编码错误:', error);
        alert('无法找到指定的地点，请检查输入是否正确');
    });
}

// 初始化地图
document.addEventListener('DOMContentLoaded', initMap); 