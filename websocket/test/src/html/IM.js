(function () {

    var WS = require('./WS.js');

    var IM = {
        vm: null,
        addMsg: function (_data) {
            var username = _data.userKey;

            if(!IM.vm.$data.me){
                IM.vm.$data.me = username;
            }
            // this.$data.username = _data.data.to == username ? _data.data.from : _data.data.to;

            // console.log(_data);
            var _vm = IM.vm;
            var u = _vm.$data.username;
            var T = _data.data;
            _vm.$data.texts[u].push(T);
            _vm.$data.text = _vm.$data.texts[u];
            _vm.$refs.textarea.value = '';
            _vm.$refs.textarea.blur();
            _vm.$refs.textarea.focus();

            _vm.$nextTick(function () {
                // console.log('log: dom已更新');
                _vm.TscrollTop();
            });
        },
        init: function () {

            // require.ensure(["../js/jquery.min.js","../js/vue.js"], function(require) {
                // require('../js/jquery.min.js');
                // var $ = jQuery;
                // 定义

                var HM = require('./header.js');
                Vue.component('HM',HM);

                var FM = require('./footer.js');
                Vue.component('FM',FM);

                var _data = {
                        pageCls: 'IM',
                        usernames: [
                            {
                                user: 'user01'
                            },
                            {
                                user: 'user02'
                            },
                        ],
                        me: '',
                        // username: 'user01',
                        username: 'user01',
                        text: [
                            {
                                txt: '撒旦法user01师号大是大非',
                                pull: 'left'
                            },
                            {
                                txt: '阿斯顿user01发水电费',
                                pull: 'right'
                            },
                            {
                                txt: '撒旦阿user01斯顿发水电费法撒旦发送到',
                                pull: 'left'
                            },
                        ],
                        texts: {
                                    user01:[
                                        {
                                            txt: '撒旦法user01师号大是大非',
                                            pull: 'left'
                                        },
                                        {
                                            txt: '阿斯顿user01发水电费',
                                            pull: 'right'
                                        },
                                        {
                                            txt: '撒旦阿user01斯顿发水电费法撒旦发送到',
                                            pull: 'left'
                                        },
                                    ],
                                    user02:[
                                        {
                                            txt: '撒旦法user02师撒旦法师号大是大非号大是大非',
                                            pull: 'left'
                                        },
                                        {
                                            txt: '阿斯顿user02撒旦大非发水电费',
                                            pull: 'right'
                                        },
                                        {
                                            txt: '撒旦阿user02斯顿发水电费法撒旦发送到',
                                            pull: 'left'
                                        },
                                    ]
                                },
                            };

                this.vm = new Vue({
                    el: '#app'
                    ,template: `
                                <div :class="pageCls">
                                  <HM></HM>
                                  <div class="con bootclearfix">
                                    <div class="L" ref="L">
                                        <ul>
                                            <li v-for="item in usernames" @click="selectUser($event);" v-if="username == item.user" class="selected">
                                                <p :data-username="item.user">{{item.user}}</p>
                                            </li>
                                            <li @click="selectUser($event);" v-else>
                                                <p :data-username="item.user">{{item.user}}</p>
                                            </li>
                                        </ul>
                                    </div>
                                    <div class="R">
                                        <div class="T" ref="T">
                                            <ul>
                                                <li v-for="item in text" class="bootclearfix">
                                                    <pre :class="item.pull">{{item.txt}}</pre>
                                                </li>
                                            </ul>
                                        </div>
                                        <div class="B">
                                            <textarea ref="textarea" @keyup="keyCode($event);"></textarea>
                                            <button @click="add($event);">发送</button>
                                        </div>
                                    </div>
                                  </div>
                                  <FM></FM>
                                </div>
                                `
                    ,data: function () {
                        return _data;
                    }
                    ,methods: {
                        TscrollTop: function () {
                            var T = this.$refs.T;
                            var TH = T.clientHeight;
                            var ulH = T.querySelector('ul').clientHeight;
                            if(ulH > TH){
                                T.scrollTop = ulH;
                            }
                        },
                        selectUser: function (e) {
                            var li = e.currentTarget;
                            var p = li.querySelector('p');
                            var username = p.getAttribute('data-username');
                            this.$data.username = username;
                            this.$data.text = this.$data.texts[username];

                            this.$refs.textarea.blur();
                            this.$refs.textarea.focus();

                            this.$nextTick(function () {
                                // console.log('log: dom已更新');
                                this.TscrollTop();
                            });
                        },
                        add: function () {

                            var _data = {
                                clientsL: null,
                                userKey: this.$refs.textarea.value,
                                data: {
                                    form: this.$data.me || '',
                                    to: this.$data.username,
                                    txt: this.$refs.textarea.value,
                                    pull: 'right'
                                }
                            };
                            var str = JSON.stringify(_data);

                            WS.sendMsg(str);

                            IM.addMsg(_data);

                            this.$refs.textarea.value = '';
                            this.$refs.textarea.blur();
                            this.$refs.textarea.focus();

                        },
                        keyCode: function (e) {
                            var Code = e.keyCode;
                            // e.ctrlKey e.shiftKey
                            if(e.ctrlKey && Code == 13){
                                e.stopPropagation();
                                this.add();
                                return false;
                            }
                        }
                    }
                });

                WS.open({
                    onmessage: function (data) {
                        // console.log(data);
                        IM.addMsg(data);
                    },
                    onopen: function () {
                        console.log('IM: open');
                    },
                    onclose: function () {
                        console.log('IM: close');
                    },
                    onerror: function (arg) {
                        var _arg = arg[0];
                        console.log('IM: error');
                    }
                });

            // });
        }
    };

    IM.init();

    module.exports = IM;

}());

