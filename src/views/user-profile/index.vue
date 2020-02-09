<template>
  <div class="user-profile">
    <van-nav-bar title="编辑资料"
    left-arrow
    right-text="保存"
    @click-left="$router.back()"
    />
    <van-cell-group>
      <van-cell title="头像" is-link @click="onAvatarClick">
        <van-image
          round
          class="avatar"
          fit="cover"
          :src="user.photo"
        />
      </van-cell>
      <input
      ref="file"
      type="file"
      hidden
      @change="onFileChange">
        <!-- 头像预览 -->
        <van-image-preview v-model="isPreviewShow"
        :images="images"
        @close="$refs.file.value = ''">
        <van-nav-bar
            slot="cover"
            left-text="取消"
            right-text="确定"
            @click-left="isPreviewShow = false"
            @click-right="onUpdateAvatar"
        />
        </van-image-preview>
        <!-- /头像预览 -->
      <van-cell title="昵称"
      :value="user.name"
      is-link
      @click="isEditNameShow = true"/>
      <!-- <van-cell title="介绍" value="" is-link /> -->
      <van-cell title="性别"
      :value="user.gender === 0 ? '男' : '女'"
      is-link
      @click="isEditGenderShow = true"/>
      <van-cell title="生日"
      :value="user.birthday"
      is-link
      @click="isEditBirthdayShow = true"/>
    </van-cell-group>

    <!-- 修改昵称 -->
    <van-popup v-model="isEditNameShow" position="bottom">
        <van-nav-bar
            title="编辑昵称"
            left-text="取消"
            right-text="确定"
            @click-left="isEditNameShow = false"
            @click-right="onUpdateName"
        />
        <div>
            <van-field
            :value="user.name"
            @input="inputName = $event"
            rows="2"
            autosize
            type="textarea"
            maxlength="20"
            placeholder="请输入昵称"
            show-word-limit
            />
        </div>
    </van-popup>
    <!-- /修改昵称 -->

    <!-- 修改性别 -->
    <van-action-sheet
    v-model="isEditGenderShow"
    :actions="actions"
    @cancel="isEditGenderShow = false"
    @select="onGenderSelect"/>
    <!-- /修改性别 -->

    <!-- 编辑用户生日 -->
    <van-popup v-model="isEditBirthdayShow" position="bottom">
        <van-datetime-picker
            :value="currentDate"
            type="date"
            :min-date="minDate"
            :max-date="maxDate"
            @cancel="isEditBirthdayShow = false"
            @confirm="onUpdateBirthday"
        />
    </van-popup>
    <!-- /编辑用户生日 -->
  </div>
</template>

<script>
import { getUserProfile, updateUserPhoto, updateUserProfile } from '@/api/user'
// import { ImagePreview } from 'vant'
import moment from 'moment'
export default {
  name: 'UserIndex',
  components: {},
  props: {},
  data () {
    return {
      user: {},
      isPreviewShow: false,
      images: [],
      isEditNameShow: false,
      inputName: '',
      isEditGenderShow: false,
      actions: [
        { name: '男', value: 0 },
        { name: '女', value: 1 }
      ],
      isEditBirthdayShow: false,
      minDate: new Date(1970, 0, 1),
      maxDate: new Date()
    }
  },
  computed: {
    file () {
      return this.$refs['file']
    },
    currentDate () {
      return new Date(this.user.birthday)
    }
  },
  watch: {},
  created () {
    this.loadUserProfile()
  },
  mounted () {},
  methods: {
    async loadUserProfile () {
      try {
        const { data } = await getUserProfile()
        this.user = data.data
      } catch (err) {
        console.log(err)
        this.$toast.fail('获取数据失败')
      }
    },
    onAvatarClick () {
      this.$refs['file'].click()
    },
    onFileChange () {
      // 1.拿到file类型input选择的文件对象
      const fileObj = this.file.files[0]
      console.log(fileObj)
      // 2.得到文件数据  window.URL.createObjectURL(file)
      const fileData = window.URL.createObjectURL(fileObj)
      // 3.将img.src=第二步的结果
      //   this.$refs['img'].src = fileData
      //  ImagePreview({
      //     images: [
      //       fileData
      //     ]
      //   })
      this.images = [fileData]
      //   这里直接充值数组,防止出现多个预览图片
      this.isPreviewShow = true
      //  如果需要定义里面的模板内容，则通过模板的方式来使用这个组件
    },
    async onUpdateAvatar () {
      // 1.构造包含文件数据的表单对象
      const fd = new FormData()
      fd.append('photo', this.file.files[0])

      this.$toast.loading({
        duration: 0,
        message: '保存中...',
        forbidClick: true
      })

      // 2.请求提交
      try {
        const { data } = await updateUserPhoto(fd)
        // 更新页面
        this.user.photo = data.data.photo
        // 关闭图片预览
        this.isPreviewShow = false
        this.$toast.success('更新成功')
      } catch (err) {
        console.log(err)
        this.$toast.fail('请求失败')
      }

      // 3.根据相应结果执行后续处理
    },
    async updateUserProfile (field, value) {
      this.$toast.loading({
        duration: 0,
        message: '更新中...',
        forbidClick: true
      })

      try {
        await updateUserProfile({
          [field]: value
        })
        this.$toast.success('更新成功')
      } catch (err) {
        console.log(err)
        this.$toast.fail('更新失败')
      }
    },
    async onUpdateName () {
      await this.updateUserProfile('name', this.inputName)
      this.user.name = this.inputName
      this.isEditNameShow = false
    },
    async onGenderSelect (data) {
      await this.updateUserProfile('gender', data.value)
      this.user.gender = data.value
      this.isEditGenderShow = false
    },
    async onUpdateBirthday (value) {
      const date = moment(value).format('YYYY-MM-DD')
      await this.updateUserProfile('birthday', date)
      this.user.birthday = date
      this.isEditBirthdayShow = false
    }
  }
}
</script>
<style lang="less" scoped>
.user-profile {
    .avatar {
        width: 30px;
        height: 30px;
    }
    /deep/ .van-image-preview__cover {
        top:unset;
        left:0;
        right: 0;
        bottom: 0;
        .van-nav-bar {
            color: #000;
        }
    }
    .van-popup {
        /deep/ .van-nav-bar {
            background-color: #fff;
            .van-nav-bar__title {
                color: #323233;
            }
        }
    }
}
</style>
