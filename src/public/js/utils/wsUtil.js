var wsUtil = {
    wsUrl: _wsUrl,
    token: "",
    socket: null,
    wsIntervalId: null,
    wstimeout: 5000,
    wstimer: null,

    channels: null,
    wsHandler: function() {},
    startHandler: function() {},
    stopHandler: function() {},
    getToken: function() {
        return new Promise((resolve, reject) => {
            $.get("/ajax/getwebsockettoken?rnum=" + Math.random(), function(result) {
                if (result) {
                    resolve(result)
                } else {
                    reject("getTokn fail!")
                }
            })
        })
    },
    connectWs: function(channels, wsHandler, startHandler, stopHandler) {
        if (channels) this.channels = channels;
        if (wsHandler) this.wsHandler = wsHandler;
        if (startHandler) this.startHandler = startHandler;
        if (stopHandler) this.stopHandler = stopHandler;

        if (this.token == "") {
            this.getToken().then(data => {
                this.token = data;
                this.createWs();
            });
        } else {
            this.createWs();
        }

    },
    createWs: function() {
        var self = this;
        if (this.socket == null || this.socket.readyState != WebSocket.OPEN || this.socket.readyState != WebSocket.CONNECTING) {
            var url = this.wsUrl.replace("{0}", encodeURIComponent(this.channels.join(','))).replace("{1}", this.token);
            this.socket = new WebSocket(url);

            this.wstimer = setTimeout(() => {
                self.socket.close();
                console.log("ws timeout");
            }, this.wstimeout)

            this.socket.onopen = function(event) {
                if (self.wstimer) clearTimeout(self.wstimer)
                console.log("ws open");
                self.updateState();
            };

            this.socket.onclose = function(event) {
                if (self.wstimer) clearTimeout(self.wstimer)
                console.log("ws close");
                self.token = "";
                self.updateState();
            };

            this.socket.onerror = function(event) {
                if (self.wstimer) clearTimeout(self.wstimer)
                console.log("ws error");
            };

            this.socket.onmessage = function(event) {
                var data = event.data;
                if (data == "ok") return;

                try {
                    // Kiểm tra nếu dữ liệu là JSON hợp lệ
                    var json = JSON.parse(data);
                    self.wsHandler(json);
                } catch (error) {
                    // Nếu không phải JSON, xử lý dữ liệu XML
                    handleXML(data);
                }
            };

            // Add event listener after WebSocket is created
            // this.socket.addEventListener("message", function(event) {
            //     var data = event.data;
            //     if (data == "ok") return;
            //     var json = JSON.parse(data);
            //     self.wsHandler(json);
            // });

        }
    },


    updateState: function() {
        var self = this;

        function disable() {
            self.startHandler();
            if (!self.wsIntervalId) {
                self.wsIntervalId = setInterval(() => { self.connectWs() }, 30 * 1000) //写成箭头函数,否则this指向不明确
            }
        }

        function enable() {
            self.stopHandler();
            if (self.wsIntervalId) {
                clearInterval(self.wsIntervalId);
                self.wsIntervalId = null;
            }
        }

        if (!this.socket) {
            disable();
        } else {
            switch (this.socket.readyState) {
                case WebSocket.CLOSED:
                    disable();
                    break;
                case WebSocket.CLOSING:
                    disable();
                    break;
                case WebSocket.CONNECTING:
                    disable();
                    break;
                case WebSocket.OPEN:
                    enable();
                    break;
                default:
                    disable();
                    break;
            }
        }
    },
    changeChannel: function(channels) {
        this.channels = channels;
        if (!this.socket || this.socket.readyState !== WebSocket.OPEN) {
            console.log("socket not connected");
            return
        }
        var data = { type: 0, channels: channels }
        this.socket.send(JSON.stringify(data));
    },
    closeWs: function(data) {
        this.socket.close();
    }
}