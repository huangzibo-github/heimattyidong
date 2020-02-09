<template>
  <div class="channel-edit">
      <van-cell title="我的频道" :border="false">
          <van-button
          size="mini"
          round
          type="danger"
          plain
          @click="isEditShow = !isEditShow"
          >{{isEditShow ? '完成' : '编辑'}}</van-button>
      </van-cell>
      <van-grid :gutter="10" clickable>
          <van-grid-item
            v-for="(channel,index) in userChannels"
            :key="channel.id"
            :text="channel.name"
            @click="onUserChannelClick(index)"
           >
            <van-icon
            v-show="isEditShow && index !==0"
            slot="icon"
            name="close"
            />
          </van-grid-item>
      </van-grid>
      <van-cell title="推荐频道" :border="false" />
      <van-grid :gutter="10">
      <van-grid-item
        v-for="channel in remainingChannels"
        :key="channel.id"
        :text="channel.name"
        @click="onAdd(channel)"
       />
    </van-grid>
  </div>
</template>

<script>
import { getAllChannels } from '@/api/channel'
export default {
  name: 'ChannelEdit',
  components: {},
  props: {
    userChannels: {
      type: Array,
      required: true
    }
  },
  data () {
    return {
      allChannels: [], // 所有频道
      isEditShow: false
    }
  },
  computed: {
    remainingChannels () {
      const { allChannels, userChannels } = this
      // 剩余频道 = 所有频道 - 我的频道
      const channels = []
      // 遍历所有频道
      allChannels.forEach(item => {
      // 如果我的频道中不包含当前被遍历的频道，则要
        if (!userChannels.find(c => c.id === item.id)) {
          channels.push(item)
        }
      })
      return channels
    }
  },
  watch: {},
  created () {
    this.loadAllChannels()
  },
  mounted () {},
  methods: {
    async loadAllChannels () {
      const { data } = await getAllChannels()
      this.allChannels = data.data.channels
    },
    onAdd (channel) {
      this.userChannels.push(channel)
    },
    onUserChannelClick (index) {
      if (this.isEditShow && index !== 0) {
        this.userChannels.splice(index, 1)
      } else {
        //   如果是非编辑状态，就执行切换频道操作
        this.$emit('switch', index)
      }
    }
  }
}
</script>

<style lang="less" scoped>
.channel-edit {
    padding: 40px 0;
}
/deep/ .van-grid-item__icon-wrapper {
  position: absolute;
  top: -14px;
  right: -5px;
  .van-icon-close {
    font-size: 14px;
  }
}

</style>
