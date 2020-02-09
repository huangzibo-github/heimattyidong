<template>
  <div class="user-articles">
    <!-- 导航栏 -->
      <van-nav-bar
        title="我的收藏/历史/作品"
        left-arrow
        @click-left="$router.back()"
        fixed
        />
    <!-- 导航栏 -->
    <van-tabs v-model="active" fixed>
      <van-tab title="我的收藏">
        <collect-article />
      </van-tab>
      <van-tab title="我的历史">
        <history-article />
      </van-tab>
      <van-tab title="我的作品">
        <user-article />
      </van-tab>
    </van-tabs>
  </div>
</template>

<script>
import UserArticle from './components/article'
import CollectArticle from './components/collect'
import HistoryArticle from './components/history'
export default {
  name: 'UserArticles',
  components: {
    UserArticle,
    CollectArticle,
    HistoryArticle
  },
  props: {
    type: {
      type: String
    }
  },
  data () {
    let active = ['collect', 'history'].indexOf(this.type)
    if (active === -1) {
      active = 2 // 我的作品
    }
    return {
      active // 控制激活的标签选项
    }
  },
  computed: {},
  watch: {},
  created () {},
  mounted () {},
  methods: {},
  // 当前页面跳转的时候会触发这个路由钩子函数
  // to 要去哪的信息
  // from 来自于哪里的信息
  // next 放行的方法
  //     next()放行
  //     next(false)不放行
  beforeRouterLeave (to, from, next) {
    if (to.name === 'article') {
      this.$store.commit('addCachePage', 'UserArticles')
    } else {
      this.$store.commit('removeCachepage', 'UserArticles')
    }
    next()
  }
}
</script>

<style scoped lang="less">
.user-articles {
  padding-top: 90px;
  padding-bottom: 50px;
  /deep/ .van-tabs__wrap {
    position: fixed;
    top: 46px;
    left: 0;
    right: 0;
    z-index: 1;
  }
}
</style>
