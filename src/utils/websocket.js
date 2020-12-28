// 判断当前的浏览器是否支持websocket协议
export function supportWebSocket() {
  return 'WebSocket' in window
}

// 打开websocket连接
export function connectWebSocket(url, onopen, onmessage, onclose, onerror) {
  // 打开一个 web socket
  const websocket = new WebSocket(process.env.VUE_APP_BASE_WX_API + url)
  websocket.onopen = function() {
    onopen()
  }
  websocket.onmessage = function(evt) {
    onmessage(evt)
  }
  websocket.onclose = function() {
    onclose()
  }
  websocket.onerror = function() {
    onerror()
  }
  return websocket
}

export function sendWebSocket(websocket, message) {
  if (websocket) {
    if (websocket.readyState === websocket.OPEN) {
      websocket.send(message)
      return true
    } else {
      return false
    }
  } else {
    return false
  }
}

export function closeWebSocket(websocket) {
  websocket.close()
}
