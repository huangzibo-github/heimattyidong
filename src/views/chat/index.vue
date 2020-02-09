<template>
  <div class="chat-container">
    <!-- 导航栏 -->
    <van-nav-bar
      title="小智同学"
      left-arrow
      @click-left="$router.back()"
      fixed
    />
    <!-- /导航栏 -->

    <!-- 消息列表 -->
    <div class="message-list" ref="message-list">
      <div
        class="message-item"
        :class="{ reverse: item.isMe }"
        v-for="(item,index) in messages"
        :key="index"
      >
        <van-image
          class="avatar"
          slot="icon"
          round
          width="30"
          height="30"
          src="https://img.yzcdn.cn/vant/cat.jpeg"
        />
        <div class="title">
          <span>{{ item.msg }}</span>
        </div>
      </div>
    </div>
    <!-- /消息列表 -->

    <!-- 发送消息 -->
    <van-cell-group class="send-message">
      <van-field v-model="message" center clearable>
        <van-button
        slot="button"
        size="small"
        type="primary"
        @click="onSendMessage"
        >发送</van-button>
      </van-field>
    </van-cell-group>
    <!-- /发送消息 -->
  </div>
</template>

<script>
import io from 'socket.io-client'
import { getItem, setItem } from '@/utils/storage'
export default {
  name: 'Chat',
  data () {
    return {
      message: '',
      socket: null,
      messages: getItem('chat-messages') || []
    }
  },
  watch: {
    messages (value) {
      // 当消息列表发生变化，持久化存储到本地
      setItem('chat-messages', value)
      this.$nextTick(() => {
        this.toBottom()
      })
    }
  },
  created () {
    const socket = io('http://ttapi.research.itcast.cn')
    this.socket = socket
    socket.on('connect', () => {
      console.log('建立连接成功')
    })
    socket.on('message', message => {
      console.log('收到服务器消息:', message)
      this.messages.push(message)
    })
  },
  methods: {
    onSendMessage () {
      const message = this.message
      if (!message.length) {
        return
      }
      const data = {
        msg: message,
        timestamp: Date.now(),
        isMe: true
      }

      //   发送消息
      this.socket.emit('message', data)
      //   将消息存储到列表中
      this.messages.push(data)
      //   清空文本框
      this.message = ''
    },
    toBottom () {
      const listContainer = this.$refs['message-list']
      listContainer.scrollTop = listContainer.scrollHeight
    }
  },
  mounted () {
    window.list = this.$refs['message-list']
  }
}
</script>

<style scoped lang="less">
  .chat-container {
    position: absolute;
    width: 100%;
    height: 100%;
    padding: 46px 0 50px 0;
    top: 0;
    left: 0;
    box-sizing: border-box;
    background: #f5f5f6;
    .message-list {
      height: 100%;
      overflow-y: scroll;
      .message-item {
        display: flex;
        align-items: center;
        padding: 10px;
        .title {
          background: #fff;
          padding: 5px;
          border-radius: 6px;
        }
        .avatar {
          margin-right: 5px;
        }
      }
      .reverse {
        flex-direction: row-reverse;
        .title {
          margin-right: 5px;
        }
      }
    }

    .send-message {
      position: fixed;
      bottom: 0;
      left: 0;
      right: 0;
      background: #f5f5f6 !important;
    }
  }
</style>
