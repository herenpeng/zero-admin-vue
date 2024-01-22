const eventMap = new Map()

// 事件键值
export const EVENT_KEY = { SERVER: 1 }

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
    const index = message.indexOf('@')
    if (index < 0) {
      return
    }
    const event = message.substring(0, index)
    const callback = eventMap.get(Number(event))
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
  webSocket.register = (event, callback) => {
    eventMap.set(event, callback)
  }
  webSocket.sendMessage = (event, message) => {
    if (webSocket.readyState === webSocket.OPEN) {
      webSocket.send(message)
      return true
    }
    return false
  }
  return webSocket
}

const webSocket = initWebSocket()

export default webSocket
