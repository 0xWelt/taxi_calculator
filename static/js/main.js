let map;
let directionsService;
let directionsRenderer;
let startAutocomplete;
let endAutocomplete;

function initMap() {
    // 初始化地图，默认显示东京
    map = new google.maps.Map(document.getElementById('map'), {
        center: { lat: 35.6762, lng: 139.6503 },
        zoom: 12
    });

    directionsService = new google.maps.DirectionsService();
    directionsRenderer = new google.maps.DirectionsRenderer({
        map: map
    });

    // 初始化自动完成
    startAutocomplete = new google.maps.places.Autocomplete(
        document.getElementById('start'),
        { types: ['geocode'] }
    );

    endAutocomplete = new google.maps.places.Autocomplete(
        document.getElementById('end'),
        { types: ['geocode'] }
    );

    // 添加计算按钮事件监听
    document.getElementById('calculate').addEventListener('click', calculateRoute);
}

function calculateRoute() {
    const start = document.getElementById('start').value;
    const end = document.getElementById('end').value;

    if (!start || !end) {
        alert('请输入起点和终点');
        return;
    }

    const request = {
        origin: start,
        destination: end,
        travelMode: 'DRIVING'
    };

    directionsService.route(request, function(result, status) {
        if (status == 'OK') {
            directionsRenderer.setDirections(result);
            
            // 获取距离和时间
            const route = result.routes[0].legs[0];
            const distance = route.distance.value / 1000; // 转换为公里
            const duration = route.duration.value / 60; // 转换为分钟

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
                document.getElementById('distance').textContent = data.distance;
                document.getElementById('duration').textContent = data.duration;
                document.getElementById('fare').textContent = data.fare;
            })
            .catch(error => console.error('Error:', error));
        } else {
            alert('无法计算路线，请检查输入的地点是否正确');
        }
    });
}

// 初始化地图
google.maps.event.addDomListener(window, 'load', initMap); 