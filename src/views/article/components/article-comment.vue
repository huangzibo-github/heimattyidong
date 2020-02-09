<template>
  <div class="article-comments">
    <!-- 评论列表 -->
    <van-list
      v-model="loading"
      :finished="finished"
      finished-text="没有更多了"
      @load="onLoad"
    >
      <comment-item v-for="(item,index) in list"
      :key="index"
      :comment="item"
      @click-reply="$emit('click-reply',$event)" />
    </van-list>
    <!-- /评论列表 -->
  </div>
</template>

<script>
import { getComments } from '@/api/comment'
import CommentItem from './comment-item'
export default {
  name: 'ArticleComment',
  props: {
    articleId: {
      type: [Number, String, Object],
      required: true
    }
  },
  components: {
    CommentItem
  },
  data () {
    return {
      list: [], // 评论列表
      loading: false, // 上拉加载更多的 loading
      finished: false, // 是否加载结束
      offset: null, // 请求下一页数据的页码
      limit: 20
    }
  },
  methods: {
    async onLoad () {
      // 异步更新数据
    //   const articleComment = this.articleComment
      const { data } = await getComments({
        type: 'a',
        source: this.articleId,
        offset: this.offset,
        limit: this.limit
      })
      const { results } = data.data
      this.list.push(...results)
      //   articleComment.totalCount = data.data.total_count
      this.loading = false
      if (results.length) {
        this.offset = data.data.last_id
      } else {
        this.finished = true
      }
    }
  }
}
</script>

<style scoped lang="less">
  .publish-wrap {
    position: fixed;
    left: 0;
    bottom: 0;
    width: 100%;
  }

  .van-list {
    margin-bottom: 45px;
  }
</style>
