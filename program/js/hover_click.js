// 用于存储悬停开始时间和点击次数
let hoverStartTime = {};
let clickCounts = {};

// 初始化链接事件
function initLinkEvents() {
    // 查询页面上所有的<a>标签
    const links = document.querySelectorAll('a');

    // 遍历每个链接并绑定事件
    links.forEach((link, index) => {
        const linkId = `link${index}`; // 为每个链接生成一个唯一的标识符
        hoverStartTime[linkId] = 0;
        clickCounts[linkId] = 0;

        // 监听鼠标悬停
        link.addEventListener('mouseover', () => {
            hoverStartTime[linkId] = new Date().getTime(); // 记录悬停开始时间
        });

        // 监听鼠标移开
        link.addEventListener('mouseout', () => {
            if (hoverStartTime[linkId] > 0) {
                const hoverEndTime = new Date().getTime();
                const hoverDuration = (hoverEndTime - hoverStartTime[linkId]) / 1000; // 悬停时长，单位为秒
                console.log(`链接 ${index + 1} 悬停时间: ${hoverDuration} 秒`);
                sendDataToServer(linkId, "hover", hoverDuration); // 发送数据到服务器
                hoverStartTime[linkId] = 0; // 重置开始时间
            }
        });

        // 监听点击事件
        link.addEventListener('click', (event) => {
            event.preventDefault(); // 阻止默认行为
            clickCounts[linkId]++;
            console.log(`链接 ${index + 1} 点击次数: ${clickCounts[linkId]}`);
            sendDataToServer(linkId, "click", clickCounts[linkId]); // 发送点击数据到服务器
        });
    });
}

// 发送数据到服务器的函数
function sendDataToServer(linkId, eventType, data) {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", "/save-data", true); // 假设后端有个 /save-data 的路由
    xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");

    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            console.log("数据已成功发送到服务器");
        }
    };

    // 构建发送的数据
    const payload = {
        linkId: linkId,
        eventType: eventType,
        data: data,
        timestamp: new Date().toISOString()
    };

    xhr.send(JSON.stringify(payload));
}

// 初始化所有链接
initLinkEvents();
