// 用于存储悬停开始时间和点击次数
let hoverStartTime = {};
let clickCounts = {};
let userIP = '';

// 获取用户IP地址
function getUserIP() {
    fetch('https://api.ipify.org?format=json')
        .then(response => response.json())
        .then(data => {
            userIP = data.ip;
            console.log(`用户的IP地址是: ${userIP}`);
        })
        .catch(error => {
            console.error('获取IP地址失败:', error);
        });
}

// 初始化链接事件
function initLinkEvents() {
    // 查询页面上所有的<a>标签
    const links = document.querySelectorAll('a');

    // 遍历每个链接并绑定事件
    links.forEach((link, index) => {
        const linkId = `link${index}`; // 为每个链接生成一个唯一的标识符
        const linkurl = link.href;
        hoverStartTime[linkurl] = 0;
        clickCounts[linkurl] = 0;

        // 监听鼠标悬停
        link.addEventListener('mouseover', () => {
            hoverStartTime[linkurl] = new Date().getTime(); // 记录悬停开始时间
        });

        // 监听鼠标移开
        link.addEventListener('mouseout', () => {
            if (hoverStartTime[linkurl] > 0) {
                const hoverEndTime = new Date().getTime();
                const hoverDuration = (hoverEndTime - hoverStartTime[linkurl]) / 1000; // 悬停时长，单位为秒
                console.log(`链接 ${linkurl} 悬停时间: ${hoverDuration} 秒`);
                sendDataToServer(linkurl, "hover", hoverDuration); // 发送数据到服务器
                hoverStartTime[linkurl] = 0; // 重置开始时间
            }
        });

        // 监听点击事件
        link.addEventListener('click', () => {
            clickCounts[linkurl]++;
            console.log(`链接 ${linkurl} 点击次数: ${clickCounts[linkurl]}`);
            sendDataToServer(linkurl, "click", clickCounts[linkurl]); // 发送点击数据到服务器
        });
    });
}

// 发送数据到服务器的函数
function sendDataToServer(linkurl, eventType, data) {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", "/api/receive_data.php", true); // 假设后端有个 /api/receive_data.php 的路由
    xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");

    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            console.log("数据已成功发送到服务器");
        }
    };

    // 构建发送的数据
    const payload = {
        linkurl: linkurl,
        eventType: eventType,
        data: data,
        ip: userIP, // 添加用户IP地址
        timestamp: new Date().toISOString()
    };

    xhr.send(JSON.stringify(payload));
}

document.addEventListener('DOMContentLoaded', function () {
    getUserIP(); // 页面加载时获取用户IP地址
    initLinkEvents();
});
