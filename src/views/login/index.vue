<template>
  <div class="login">
    <!-- 登录组件 -->
      <van-nav-bar title="登录" />
    <!-- 表单验证 -->
    <!-- 1.使用ValidationObserver把需要验证的整个表单包起来 -->
    <!-- 2.使用ValidationProvider把具体的表单元素包起来
          name   配置字段的提示名称
          rules  配置校验规则
          v-solt={errors}  获取校验失败的错误提示消息
    -->

    <ValidationObserver ref="form">
      <ValidationProvider name="手机号" rules="required|mobile" immediate>
        <van-cell-group>
        <van-field
        label="手机号"
        placeholder="请输入手机号"
        left-icon="contact"
        v-model="user.mobile" />
        </van-cell-group>
      </ValidationProvider>

      <ValidationProvider name="验证码" rules="required|code" immediate>
        <van-cell-group>
        <van-field
        label="验证码"
        placeholder="请输入验证码"
        left-icon="smile-o"
        v-model="user.code">
          <van-count-down
            v-if="isCountDownShow"
            slot="button"
            :time="1000 * 5"
            format="ss s"
            @finish="isCountDownShow = false"
          />
          <van-button
            v-else
            slot="button"
            size="small"
            round
            type="primary"
            @click="onSendSmsCode"
          >发送验证码</van-button>
        </van-field>
        </van-cell-group>

      </ValidationProvider>
    </ValidationObserver>

    <div class="login-btn-box">
      <van-button type="info" class="login-btn" @click="onLogin">登录</van-button>
    </div>
  </div>
</template>

<script>
import { login, getSmsCode } from '@/api/user'
import { validate } from 'vee-validate'
export default {
  name: 'LoginPage',
  components: {},
  props: {},
  data () {
    return {
      user: {
        mobile: '',
        code: ''
      },
      isCountDownShow: false // 是否显示倒计时
    }
  },
  computed: {},
  watch: {},
  created () {},
  methods: {
    async onLogin () {
      // 1.获取表单数据
      // 2.表单验证

      // this.$refs.form.validate().then(success => {
      //   if (!success) {
      //     // 表单验证失败处理
      //   } else {
      //     // 表单验证通过处理
      //   }
      // })
      const success = await this.$refs.form.validate()
      if (!success) {
        // 表单验证失败处理
        const errors = this.$refs.form.errors
        for (let key in errors) {
          const item = errors[key]
          if (item[0]) {
            this.$toast(item[0])
            return
          }
        }
        return
      }

      // 3.请求登录
      // 4.根据后端返回结果执行后续业务处理
      this.$toast.loading({
        duration: 0, // 持续时间，0表示持续展示不停止
        forbidClick: true, // 是都禁止背景点击
        message: '登录中。。。' // 提示消息
      })

      try {
        const res = await login(this.user)
        console.log(res)
        this.$store.commit('setUser', res.data.data)
        console.log('登录成功', res)
        // 提示success 或者 fail 的时候 ，会把其他的toast先清除
        this.$toast.success('登陆成功')
        // 如果有redirect 则跳转到来源页，没有就跳转到首页
        const redirect = this.$route.query.redirect || '/'
        this.$router.push(redirect)
      } catch (err) {
        this.$toast.fail('登陆失败，手机号或验证码错误')
      }
    },
    async onSendSmsCode () {
      // try {
      const { mobile } = this.user
      // 1. 验证手机号是否有效
      // 2. 请求发送短信验证码
      // 3. 显示倒计时
      const res = await getSmsCode(mobile)
      const validateResult = await validate(mobile, 'required|mobile', {
        name: '手机号'
      })
      if (!validateResult.valid) {
        this.$toast(validateResult.errors[0])
        return
      }
      console.log(res)
      this.isCountDownShow = true
      // } catch (err) {
      //   console.log(err)
      //   this.$toast('请勿频繁操作')
      // }
    }
  }
}

</script>
<style lang="less" scoped>
.van-nav-bar {
  background-color: #3196fa;
  .van-nav-bar__title {
    color: #fff;
  }
}
.login-btn-box {
  padding: 20px;
  .login-btn {
    width: 100%;
  }
}
</style>
