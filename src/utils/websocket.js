const cmdMap = new Map()

const KEY = '@'
// 事件键值
export const WEBSOCKET_CMD = { SERVER: 1 }

// 判断当前的浏览器是否支持websocket协议
function supportWebSocket() {
  return 'WebSocket' in window
}

// 打开websocket连接
function initWebSocket() {
  console.log('[WebSocket链接]开始初始化WebSocket')
  if (!supportWebSocket()) {
    return null
  }
  // 打开一个 webSocket
  const webSocket = new WebSocket(process.env.VUE_APP_BASE_WX_API + '/websocket')
  webSocket.onopen = () => {
    console.log('[WebSocket链接]链接开启')
  }
  webSocket.onmessage = (evt) => {
    const message = evt.data
    const index = message.indexOf(KEY)
    if (index < 0) {
      return
    }
    const cmd = message.substring(0, index)
    const callback = cmdMap.get(Number(cmd))
    if (callback) {
      callback(message.substring(index + 1))
    }
  }
  webSocket.onclose = () => {
    console.log('[WebSocket链接]链接关闭')
  }
  webSocket.onerror = () => {
    console.log('[WebSocket链接]链接发生错误')
  }
  // 自己定义添加的方法
  webSocket.register = (cmd, callback) => {
    cmdMap.set(cmd, callback)
  }
  webSocket.sendMessage = (cmd, message) => {
    if (webSocket.readyState === webSocket.OPEN) {
      webSocket.send(cmd + KEY + message)
      return true
    }
    return false
  }
  return webSocket
}

const webSocket = initWebSocket()

export default webSocket
