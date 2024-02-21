import { getToken } from '@/utils/auth'

const cmdMap = new Map()

const KEY = '@'
let reconnectTimer = null
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
  const webSocket = new WebSocket(process.env.VUE_APP_BASE_WX_API + '/websocket/' + getToken())
  webSocket.onopen = () => {
    console.log('[WebSocket链接]链接开启')
    if (reconnectTimer) {
      clearInterval(reconnectTimer)
    }
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
    reconnect()
  }
  webSocket.onerror = () => {
    console.log('[WebSocket链接]链接发生错误')
    reconnect()
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

let webSocket = initWebSocket()

// 重连
function reconnect() {
  if (reconnectTimer) {
    return
  }
  console.log('[WebSocket链接]开始准备重连')
  reconnectTimer = setInterval(() => {
    console.log('[WebSocket链接]链接重连中……')
    webSocket = initWebSocket()
  }, 3000)
}

export default webSocket
