// import { Observable } from 'rxjs/Observable'
// import { Observer } from 'rxjs/Observer'
// import { Subscription } from 'rxjs/Subscription'
import SockJS from 'sockjs-client'
import Stomp from 'stompjs'
export function trackerService() {
  this.stompClient = null
  this.subscriber = null
  this.connection = this.createConnection()
  this.connectedPromise = new Promise()
  this.listener = this.createListener()
  // this.listenerObserver = new Observer()
  this.alreadyConnectedOnce = false
  // this.subscription = new Subscription()
  this.connect = function() {
    if (this.connectedPromise === null) {
      this.connection = this.createConnection()
    }
    // building absolute path so that websocket doesn't fail when deploying with a context path
    const loc = this.$window.nativeWindow.location
    let url
    url = '//' + loc.host + loc.pathname + 'websocket/tracker'
    const authToken = this.authServerProvider.getToken()
    if (authToken) {
      url += '?access_token=' + authToken
    }
    const socket = new SockJS(url)
    this.stompClient = Stomp.over(socket)
    const headers = {}
    this.stompClient.connect(headers, () => {
      this.connectedPromise('success')
      this.connectedPromise = null
      this.sendActivity()
      if (!this.alreadyConnectedOnce) {
        this.subscription = this.$route.events.subscribe((event) => {
          // if (event instanceof NavigationEnd) {
          //   this.sendActivity()
          // }
        })
        this.alreadyConnectedOnce = true
      }
    }, (err) => {
      console.log('连接失败')
      console.log(err)
    })
  }
  this.disconnect = function() {
    if (this.stompClient !== null) {
      this.stompClient.disconnect()
      this.stompClient = null
    }
    if (this.subscription) {
      this.subscription.unsubscribe()
      this.subscription = null
    }
    this.alreadyConnectedOnce = false
  }

  this.receive = function() {
    return this.listener
  }

  this.sendActivity = function() {
    if (this.stompClient !== null && this.stompClient.connected) {
      this.stompClient.send(
        '/topic/activity', // destination
        JSON.stringify({ 'page': this.$route.path }), // body
        {} // header
      )
    }
  }

  this.subscribe = function() {
    this.connection.then(() => {
      this.subscriber = this.stompClient.subscribe('/topic/tracker', (data) => {
        this.listenerObserver.next(JSON.parse(data.body))
      })
    })
  }

  this.unsubscribe = function() {
    if (this.subscriber !== null) {
      this.subscriber.unsubscribe()
    }
    this.listener = this.createListener()
  }

  this.createListener = function() {
    // return new Observable((observer) => {
    //   this.listenerObserver = observer
    // })
  }

  this.createConnection = function() {
    return new Promise((resolve, reject) => { this.connectedPromise = resolve })
  }
}
