<template>
  <div class="search-container">
    <!-- 搜索栏 -->
    <form action="/" class="search-form">
      <van-search
        v-model="searchContent"
        placeholder="请输入搜索关键词"
        show-action
        background="#3296fa"
        @search="onSearch(searchContent)"
        @cancel="onCancel"
        @focus="isSearchResultShow = false"
        @input="onSearchInput"
      />
    </form>
    <!-- /搜索栏 -->

    <!-- 搜索结果 -->
    <search-result
    v-if="isSearchResultShow"
    :q="searchContent"
    />
    <!-- /搜索结果 -->

    <!-- 联想建议 -->
    <van-cell-group v-else-if="searchContent">
      <van-cell
        icon="search"
        :key="index"
        v-for="(item,index) in suggestions"
        @click="onSearch(item)">
        <div slot="title" v-html="highlight(item)"></div>
      </van-cell>
    </van-cell-group>
    <!-- /联想建议 -->

    <!-- 历史记录 -->
    <van-cell-group v-else>
      <van-cell title="历史记录">
        <template v-if="isDeleteShow">
          <span @click="searchHistories = [] ">全部删除</span>
          &nbsp;&nbsp;
          <span @click="isDeleteShow = false">完成</span>
        </template>
      <van-icon v-else name="delete" @click="isDeleteShow = true" />
    </van-cell>
      <van-cell
      :title="item"
      v-for="(item,index) in searchHistories"
      :key="index"
      @click="onHistoryClick(item,index)"
      >
        <van-icon v-show="isDeleteShow" name="close"></van-icon>
      </van-cell>
    </van-cell-group>
    <!-- /历史记录 -->
  </div>
</template>

<script>
import SearchResult from './components/search-result'
import { getSuggestions } from '@/api/search'
import { debounce } from 'loadsh'
import { getItem, setItem } from '@/utils/storage'
export default {
  name: 'SearchPage',
  components: {
    SearchResult
  },
  props: {},
  data () {
    return {
      searchContent: '', // 搜索内容
      isSearchResultShow: false, // 是否展示搜索结果
      suggestions: [], // 联想建议列表
      searchHistories: getItem('search-histories') || [], // 搜索历史结果
      isDeleteShow: false
    }
  },
  computed: {},
  watch: {
    searchHistories (val) {
      setItem('search-histories', val)
    }
  },
  created () {},
  mounted () {},
  methods: {
    onSearch (q) {
      // 1.更新搜索文本框的数据
      this.searchContent = q
      console.log('onSearch')
      // 2.记录搜索历史记录
      const searchHistories = this.searchHistories
      const index = searchHistories.indexOf(q)
      if (index !== -1) {
        searchHistories.splice(index)
      }
      searchHistories.unshift(q)
      // 3.展示搜索结果
      this.isSearchResultShow = true
    },
    onCancel () {
      console.log('onCancel')
    },
    // async onSearchInput () {
    //   const searchContent = this.searchContent
    //   if (!searchContent) {
    //     return
    //   }
    //   const { data } = await getSuggestions(searchContent)
    //   this.suggestions = data.data.options
    // }
    onSearchInput: debounce(async function () {
      const searchContent = this.searchContent
      if (!searchContent) {
        return
      }
      const { data } = await getSuggestions(searchContent)
      this.suggestions = data.data.options
    }, 200),
    highlight (str) {
      const searchContent = this.searchContent
      const reg = new RegExp(searchContent, 'gi')
      return str.replace(reg, `<span style="color:hotpink">${searchContent}</span>`)
    },
    onHistoryClick (item, index) {
      // 如果是删除状态，则执行删除操作
      if (this.isDeleteShow) {
        this.searchHistories.splice(index, 1)
      } else {
        this.onSearch(item)
      }
      // 否则执行搜索操作
    }
  }
}
</script>

<style scoped lang="less">
.search-container {
  padding-top: 54px;
  // 让搜索栏固定在顶部
  .search-form {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 999;
  }
  .van-search__action {
    color: #fff;
  }
}
</style>
