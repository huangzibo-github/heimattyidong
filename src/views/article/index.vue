<template>
  <div class="article-container">
    <!-- 导航栏 -->
    <van-nav-bar
      title="文章详情"
      left-arrow
      fixed
      @click-left="$router.back()"
    ></van-nav-bar>
    <!-- /导航栏 -->

    <!-- 加载中 -->
    <van-loading
      v-if="loading"
      class="loading"
      color="#1989fa"
      vertical
    >
      <slot>加载中...</slot>
    </van-loading>
    <!-- /加载中 -->

    <!-- 文章详情 -->
    <div v-else-if="article.title" class="detail">
      <h3 class="title">{{article.title}}</h3>
      <div class="author-wrap">
        <div class="base-info">
          <van-image
            class="avatar"
            round
            fit="cover"
            :src="article.aut_photo"
          />
          <div class="text">
            <p class="name">{{ article.aut_name }}</p>
            <p class="time">{{ article.pubdate | relativeTime}}</p>
          </div>
        </div>
        <!--
            展示关注按钮
            1.如果用户没有登录
            2.如果当前文章作者不是当前登录用户 -->
        <van-button
        v-if="!user || article.aut_id !== user.id"
        class="follow-btn"
        :type="article.is_followed ? 'default' : 'info'"
        size="small"
        round
        :loading="isFollowLoading"
        @click="onFollow"
        >{{article.is_followed ? '已关注' : '+ 关注'}}</van-button>
      </div>
      <div class="markdown-body" v-html="article.content"></div>

      <!-- 文章评论 -->
      <article-comment
      ref="article-comment"
      :article-id="articleId"
      @click-reply="onReplyShow"
      />
      <!-- /文章评论 -->
    </div>
    <!-- /文章详情 -->

    <!-- 加载失败提示 -->
    <div v-else class="error">
      <!-- <img src="./no-network.png" alt="no-network"> -->
      <p class="text">亲，网络不给力哦~</p>
      <van-button
        class="btn"
        type="default"
        size="small"
      >点击重试</van-button>
    </div>
    <!-- /加载失败提示 -->

    <!-- 底部区域 -->
    <div class="footer">
      <van-button
        class="write-btn"
        type="default"
        round
        size="small"
        @click="isPostShow = true "
      >写评论</van-button>
      <van-icon
        class="comment-icon"
        name="comment-o"
        info="9"
      />
      <van-icon
        color="orange"
        :name="article.is_collected ? 'star' : 'star-o'"
        @click="onCollect"
      />
      <van-icon
        color="#e5645f"
        :name="article.attitude === 1 ? 'good-job' : 'good-job-o'"
        @click="onLike"
      />
      <van-icon class="share-icon" name="share" />
    </div>
    <!-- /底部区域 -->

    <!-- 发布文章区域 -->
    <van-popup
      v-model="isPostShow"
      position="bottom">
      <post-comment v-model="postMessage" @click-post="onPost" />
    </van-popup>
    <!-- /发布文章区域 -->

    <!-- 评论回复 -->
    <van-popup
      v-model="isReplyShow"
      position="bottom"
      style="height:90%"
    >
      <comment-reply :comment="currentComment" :article-id="articleId" />
    </van-popup>
    <!-- /评论回复 -->
  </div>
</template>

<script>
import { getArticleById, addCollect, deleteCollect, addLike, deleteLike } from '@/api/article'
import { addFollow, deleteFollow } from '@/api/user'
import { mapState } from 'vuex'
import ArticleComment from './components/article-comment'
import PostComment from './components/post-comment'
import CommentReply from './components/comment-reply'
import { addComment } from '@/api/comment'
export default {
  name: 'ArticlePage',
  components: {
    ArticleComment,
    PostComment,
    CommentReply
  },
  props: {
    articleId: {
      type: [Number, String, Object],
      required: true
    }
  },
  data () {
    return {
      article: {},
      loading: true,
      isFollowLoading: false,
      isPostShow: false,
      postMessage: '',
      isReplyShow: false,
      currentComment: {}
    }
  },
  computed: {
    ...mapState(['user'])
  },
  watch: {},
  created () {
    this.loadArticle()
  },
  mounted () {},
  methods: {
    async loadArticle () {
      this.loading = true
      try {
        const { data } = await getArticleById(this.articleId)
        this.article = data.data
      } catch (err) {
        console.log(err)
      }
      this.loading = false
    },
    async onCollect () {
      // 这里 loading 不仅仅是为了交互提示，更重要的是请求期间禁用背景点击功能，防止用户不断的操作界面发出请求
      this.$toast.loading({
        duration: 0, // 持续展示toast
        message: '操作中',
        forbidClick: true // 是否禁止背景点击
      })
      try {
        if (this.article.is_collected) {
          await deleteCollect(this.articleId)
          this.$toast.success('取消收藏')
        } else {
          await addCollect(this.articleId)
          this.$toast.success('收藏成功')
        }
        this.article.is_collected = !this.article.is_collected
      } catch (err) {
        console.log(err)
        this.$toast.fail('操作失败')
      }
    },
    async onLike () {
      // 防止网络慢用户连续不断的点击按钮请求
      this.$toast.loading({
        duration: 0,
        message: '操作中',
        forbidClick: true
      })
      try {
        if (this.article.attitude === 1) {
          await deleteLike(this.articleId)
          this.article.attitude = -1
          this.$toast.success('取消点赞')
        } else {
          await addLike(this.articleId)
          this.article.attitude = 1
          this.$toast.success('点赞成功')
        }
      } catch (err) {
        console.log(err)
        this.$toast.fail('操作失败')
      }
    },
    async onFollow () {
      this.isFollowLoading = true
      try {
        const authorId = this.article.aut_id
        if (this.article.is_followed) {
          await deleteFollow(authorId)
        } else {
          await addFollow(authorId)
        }
        this.article.is_followed = !this.article.is_followed
      } catch (err) {
        console.log(err)
        this.$toast.fail('操作失败')
      }
      this.isFollowLoading = false
    },
    async onPost () {
      this.$toast.loading({
        duration: 0,
        message: '发布中...',
        forbidClick: true
      })

      try {
        const { data } = await addComment({
          target: this.articleId,
          content: this.postMessage
        })
        this.postMessage = ''
        this.isPostShow = false
        this.$refs['article-comment'].list.unshift(data.data.new_obj)
        this.$toast.success('发布成功')
      } catch (err) {
        console.log(err)
        this.$toast.fail('发布失败')
      }
    },
    onReplyShow (comment) {
      this.currentComment = comment
      this.isReplyShow = true
    }
  }
}
</script>

<style scoped lang="less">
@import "./github-markdown.css";
.article-container {
  padding: 46px 20px 50px;
  background: #fff;
  .loading {
    padding-top: 100px;
    text-align: center;
  }
  .detail {
    .title {
      margin: 0;
      padding-top: 24px;
      font-size: 20px;
      color: #3A3A3A;
    }
    .author-wrap {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 20px 0;
      height: 40px;
      .base-info {
        display: flex;
        align-items: center;
        .avatar {
          width: 40px;
          height: 40px;
          margin-right: 8px;
        }
        .text {
          line-height: 1.5;
          .name {
            margin: 0;
            font-size: 14px;
          }
          .time {
            margin: 0;
            font-size: 12px;
            color: #999;
          }
        }
      }
      .follow-btn {
        width: 85px;
      }
    }
  }
  .error {
    padding-top: 100px;
    text-align: center;
    .text {
      font-size: 15px;
    }
    .btn {
      width: 30%;
    }
  }
  .footer {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    box-sizing: border-box;
    display: flex;
    justify-content: space-around;
    align-items: center;
    height: 44px;
    border-top: 1px solid #d8d8d8;
    background-color: #fff;
    .write-btn {
      width: 160px;
    }
    .van-icon {
      font-size: 20px;
    }
    .comment-icon {
      bottom: -2px;
    }
    .share-icon {
      bottom: -2px;
    }
  }
}
</style>
