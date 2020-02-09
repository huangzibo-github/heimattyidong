<template>
  <div class="home-container">
    <!-- 导航栏 -->
    <van-nav-bar title="首页" fixed />
    <!-- /导航栏 -->

    <!-- 频道列表 -->
    <van-tabs v-model="active">
      <!-- v-model="active"  用来控制标签激活 -->
      <van-icon
      class="wap-nav"
      slot="nav-right"
      name="wap-nav"
      @click="isChannelEditShow = true"
     />
      <van-tab
      :title="channel.name"
      :key="channel.id"
      v-for="channel in userChannels"
      >
      <article-list :channel="channel" />
      </van-tab>
    </van-tabs>
    <!-- /频道列表 -->

    <!-- 编辑频道 -->
    <van-popup
      v-model="isChannelEditShow"
      position="top"
      :style="{ height: '100%' }"
      round
      closeable
      close-icon-position="top-left"
    >
      <channel-edit
      :user-channels="userChannels"
      @switch="onChannelSwitch"
      />
    </van-popup>
    <!-- /编辑频道 -->
  </div>
</template>

<script>
import { getUserChannels } from '@/api/channel'
import ArticleList from './components/article-list'
import ChannelEdit from './components/channel-edit'
import { getItem, setItem } from '@/utils/storage'
export default {
  name: 'HomePage',
  components: {
    ArticleList,
    ChannelEdit
  },
  props: {},
  data () {
    return {
      active: 0,
      userChannels: [], // 用户频道列表
      isChannelEditShow: false
    }
  },
  computed: {},
  watch: {
    userChannels () {
      setItem('user-channels', this.userChannels)
    }
  },
  created () {
    this.loadUserChannels()
  },
  mounted () {},
  methods: {
    async loadUserChannels () {
      const { data } = await getUserChannels()
      this.userChannels = data.data.channels
      // 优先使用本地的，没有就使用线上的
      // 1. 定义一个变量用来存储频道列表
      let channels = []
      // 2. 获取本地存储的频道列表
      const localUserChannles = getItem('user-channels')
      // 3. 如果本地存储有，就使用本地存储的
      if (localUserChannles) {
        channels = localUserChannles
      } else {
        // 4. 如果本地存储没有，则请求获取接口推荐的频道列表
        const { data } = await getUserChannels()
        channels = data.data.channels
      }
      // 5. 最后，把数据赋值到当前组件中
      this.userChannels = channels
    },
    onChannelSwitch (index) {
      this.active = index // 切换激活频道
      this.isChannelEditShow = false // 关闭弹层
    }
  }
}
</script>

<style scoped lang="less">
.home-container {
  padding-top: 90px;
  padding-bottom: 50px;
  .nav-bar {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 15px;
    height: 46px;
    background-color: #3196fa;
    z-index: 1;
    .search-btn {
      background-color: #5babfb;
      width: 50%;
    }
  }
  .wap-nav {
    position: fixed;
    right: 0;
    line-height: 44px;
    background: #fff;
    opacity: .8;
  }
  /deep/ .van-tabs__wrap {
    position: fixed;
    top: 46px;
    left: 0;
    right: 0;
    z-index: 1;
  }
}
</style>
