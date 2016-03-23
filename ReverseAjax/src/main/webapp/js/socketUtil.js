function connSocket(initCallback, notifyCallback) {
    var sessionId;
    if (!window.wsUrl) {
        alert(window.wsUrl+' connect error.');
        return;
    }
    // 建立连接
    var socket = io.connect(window.wsUrl, {'force new connection': true});
    // 初始化，获取sessionId
    socket.emit('init', {timeout: 7200}, function (data) {
        if (data.result == 0) {
            console.log('init ws ok, data: ');
            console.log(data);
            sessionId = data.data.sessionId;
            if (!sessionId) {
                alert("can't get sessionId");
                return;
            }
            if (initCallback) {
                initCallback(sessionId);
            }
        } else {
            alert('socket连接出错，请稍后重试');
        }
    }).on('connect', function () {
        console.log('connected....');
        // 等待消息推送提醒
        socket.on('notify', function (data) {
            console.log('get notify data:');
            console.log(data);
            if (notifyCallback) {
                notifyCallback(data);
            }
        });
        socket.on('timeout', function (data) {
            // todo 前期测试先不做操作
            alert('连接超时，请重试');
        });
    });
}