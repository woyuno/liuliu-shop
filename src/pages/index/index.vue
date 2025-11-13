<template>
  <view class="container">
    <view class="header" :style="headerStyle">
      <view class="status-bar"></view>
      <view class="nav-content" :style="navStyle">
        <view class="location">
          <uni-icons type="location" size="28" color="#fff"></uni-icons>
          <text class="city">{{ cityName }}</text>
        </view>
        <view class="search-box">
          <uni-search-bar
            radius="100"
            placeholder="搜索宠物服务"
            clearButton="none"
            cancelButton="none"
          ></uni-search-bar>
        </view>
      </view>
    </view>
    <view class="content">
      <swiper
        class="banner-swiper"
        indicator-dots
        autoplay
        circular
        indicator-color="rgba(255, 255, 255, 0.6)"
        indicator-active-color="#fff"
      >
        <swiper-item v-for="item in bannerList" :key="item.title">
          <view class="swiper-item-content">
            <image :src="item.url" mode="aspectFit"></image>
          </view>
        </swiper-item>
      </swiper>

      <view class="part">
        <up-scroll-list indicator indicatorColor="#fff0f0" indicatorActiveColor="#ffce2c" indicatorStyle="null">
          <view class="scroll-item" v-for="item in partList" :key="item.title" @click="goMerchant(item.title)">
            <image :src="item.url" mode="aspectFill"></image>
            <text>{{ item.title }}</text>
          </view>
        </up-scroll-list>
      </view>
      <view>
        <view class="p-4 bg-white box">
          <up-box height="180px" gap="12px" :bgColors="['#EEFCFF', '#FCF8FF', '#FDF8F2']">
            <template #left>
              <image src="/static/modules/home/pic1.png" mode="aspectFill"></image>
            </template>
            <template #rightTop>
              <image src="/static/modules/home/pic2.png" mode="aspectFill"></image>
            </template>
            <template #rightBottom>
              <image src="/static/modules/home/pic3.png" mode="aspectFill"></image>
            </template>
          </up-box>
        </view>
      </view>

      <view class="exchange-section">
        <view class="section-title-area">
          <text class="section-title">省钱速报</text>
          <text class="section-subtitle">折扣促销每日更新</text>
          <view class="go-btn">GO</view>
        </view>
        <view class="promo-cards">
          <view class="promo-card">
            <image src="/static/modules/home/pic4.jpg" mode="aspectFill"></image>
            <text class="promo-title">到店服务</text>
            <text class="promo-desc">限时降价</text>
            <view class="small-go">GO</view>
          </view>
          <view class="promo-card">
            <image src="/static/modules/home/pic5.jpg" mode="aspectFill"></image>
            <text class="promo-title">领劵中心</text>
            <text class="promo-desc">618立减</text>
            <view class="small-go">GO</view>
          </view>
        </view>
      </view>
      <view class="service-card" v-for="item in merchantList" :key="item.merchant_id">
        <image class="service-img" :src="item.pic" mode="aspectFill"></image>
        <view class="service-info">
          <text class="service-name">{{ item.merchant_name }}</text>
          <view class="rate-area">
            <up-rate v-model="item.rating" inactive-color="#b2b2b2" active-color="#ffce2c" readonly></up-rate>
            <text class="rate-text">{{ item.rating }}</text>
          </view>
          <text class="service-detail">{{ item.address }}</text>
          <view class="tag-area">
            <view class="tag-item" v-for="tag in item.service.split(',')" :key="tag">{{ tag }}</view>
          </view>
          <view class="price-area">
            <view>惠</view>
            【新客福利】<text>￥19.9</text>代金券可领
          </view>
        </view>
      </view>
      <up-divider text="我是有底线的"></up-divider>
    </view>
  </view>
</template>

<script setup lang="ts">
import { onLoad, onReachBottom } from '@dcloudio/uni-app'
import { computed, ref } from 'vue'
import { reverseCode } from '../../utils/getcode'
import { get } from '../../utils/http'

const menuButtonInfo = ref<any>(null)
onLoad(() => {
  // #ifdef MP-WEIXIN
  menuButtonInfo.value = uni.getMenuButtonBoundingClientRect()
  // #endif

  // #ifdef H5 || APP-PLUS
  menuButtonInfo.value = {
    top: 0,
    height: 44
  }
  // #endif
  startLocation()
  getBannerList()
  getPartList()
  getMerchantList(1)
})
interface BannerItem {
  url: string
  title: string
}
interface MerchantItem {
  merchant_id: number
  address: string
  business_hours: string
  merchant_name: string
  phone: string
  pic: string
  rating: string
  service: string
}
const headerStyle = computed(() => {
  let style = {
    height: '200px'
  }
  if (menuButtonInfo.value) {
    // #ifdef MP-WEIXIN
    style = {
      height: `${menuButtonInfo.value.top + menuButtonInfo.value.height + 20}px`
    }
    // #endif
  }
  // #ifdef H5
  style = {
    height: '90px'
  }
  // #endif
  return style
})
const navStyle = computed(() => {
  let style = {
    top: '0',
    height: '44px'
  }
  if (menuButtonInfo.value) {
    // #ifdef MP-WEIXIN
    style = {
      top: `${menuButtonInfo.value.top}px`,
      height: `${menuButtonInfo.value.height}px`
    }
    // #endif
  }
  // #ifdef H5
  style = {
    top: '20px',
    height: '50px'
  }
  // // #endif
  return style
})
// 地理位置信息
const cityName = ref<string>('')
const startLocation = () => {
  uni.getLocation({
    type: 'wgs84',
    geocode: true,
    success(res: any) {
      reverseCode(res.longitude, res.latitude)
        .then(res => {
          cityName.value = res
        })
        .catch(() => {
          cityName.value = '无法获取定位'
        })
    },
    fail(res: any) {
      cityName.value = '无法获取位置'
      uni.showModal({
        title: '提示',
        content: '需要获取您的位置信息，是否去设置开启定位',
        success(res) {
          if (res.confirm) {
            uni.openSetting({
              success(setting) {
                console.log(setting)
              }
            })
          }
        }
      })
    }
  })
}
// banner获取
const bannerList = ref<BannerItem[]>([])
const getBannerList = async () => {
  try {
    const data: any = await get('/home/banner')
    bannerList.value = data.banner
  } catch (err) {
    console.error(err)
  }
}
// 功能列表板块
const partList = ref<BannerItem[]>([])
const getPartList = async () => {
  try {
    const data: any = await get('/home/part')
    partList.value = data.part
  } catch (err) {
    console.error(err)
  }
}
// 商家列表
const merchantList = ref<MerchantItem[]>([])
const currentPage = ref<number>(1)
const totalPages = ref<number>(0)
const getMerchantList = async (page: number) => {
  try {
    const data: any = await get('/home/merchants', { page })
    merchantList.value = [...merchantList.value, ...data.list]
    totalPages.value = data.pagination.totalPages
    currentPage.value = data.pagination.current
  } catch (err) {
    console.error(err)
  }
}
onReachBottom(() => {
  if (currentPage.value < totalPages.value) {
    getMerchantList(currentPage.value + 1)
  }
})
const goMerchant = (title: string) => {
  uni.navigateTo({
    url: '/packageB/merchant/merchant?keyword=' + title
  })
}
</script>
<style lang="scss" scoped>
.container {
  background-color: #f7f7f7;

  .header {
    background-color: $uni-color-primary;

    .status-bar {
      width: 100%;
      height: var(--status-bar-height);
    }

    .nav-content {
      display: flex;
      align-items: center;
      padding: 0 30rpx;
      position: fixed;
      left: 0;
      right: 0;

      .location {
        display: flex;
        align-items: center;
        margin-right: 10rpx;

        .city {
          color: #fff;
          font-size: 28rpx;
          width: 120rpx;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
      }
    }
  }
}

.content {
  padding: 0 20rpx;

  .banner-swiper {
    // width: 100%;
    height: 350rpx;
    margin-top: 15rpx;

    .swiper-item-content {
      width: 100%;
      height: 100%;

      image {
        width: 100%;
        height: 100%;
        border-radius: 16px;
      }
    }
  }

  .part {
    background-color: #fff;
    border-radius: 16rpx;
    margin-top: 20rpx;
    margin-bottom: 24rpx;

    .scroll-item {
      text-align: center;

      image {
        width: 90rpx;
        height: 90rpx;
        margin: 0 40rpx;
      }

      text {
        font-size: 24rpx;
        color: $uni-text-color;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }
  }

  .box {
    margin-bottom: 24rpx;

    image {
      width: 100%;
      height: 100%;
      border-radius: 16rpx;
    }
  }

  .exchange-section {
    background-color: #fff;
    border-radius: 16rpx;
    padding: 30rpx;
    margin-bottom: 24rpx;

    .section-title-area {
      display: flex;
      align-items: center;

      .section-title {
        font-size: 32rpx;
        font-weight: bold;
        color: #000;
        margin-right: 16rpx;
      }

      .section-subtitle {
        font-size: 24rpx;
        color: $uni-text-color-grey;
        flex: 1;
      }

      .go-btn {
        background-color: #ff6b81;
        border-radius: 22rpx;
        font-size: 24rpx;
        color: #fff;
        padding: 4rpx 20rpx;
      }
    }

    .promo-cards {
      display: flex;
      justify-content: space-between;

      .promo-card {
        width: 300rpx;
        background-color: #f9f9f9;
        border-radius: 16rpx;
        padding: 20rpx;
        position: relative;

        image {
          width: 100%;
          height: 160rpx;
          border-radius: 8rpx;
          margin-bottom: 16rpx;
        }

        .promo-title {
          font-size: 28rpx;
          color: $uni-text-color;
          display: block;
          line-height: 40rpx;
        }

        .promo-desc {
          font-size: 24rpx;
          color: #999;
          display: block;
          line-height: 34rpx;
        }

        .small-go {
          position: absolute;
          right: 20rpx;
          bottom: 20rpx;
          background-color: #ff6b81;
          border-radius: 16rpx;
          font-size: 20rpx;
          color: #fff;
          padding: 2rpx 16rpx;
        }
      }
    }
  }

  .service-card {
    display: flex;
    background-color: #fff;
    border-radius: 16rpx;
    margin: 24rpx 0;
    padding: 20rpx;

    image {
      width: 160rpx;
      height: 160rpx;
      border-radius: 8rpx;
      margin-right: 20rpx;
      margin-top: 8rpx;
    }

    .service-info {
      flex: 1;

      .service-name {
        font-size: 32rpx;
        font-weight: bold;
        color: #000;
        line-height: 44rpx;
        display: block;
        margin-bottom: 8rpx;
      }

      .rate-area {
        display: flex;
        align-items: center;

        .rate-text {
          color: $uni-color-primary;
          font-size: 28rpx;
          margin-left: 10rpx;
        }
      }

      .service-detail {
        font-size: 24rpx;
        color: #999;
        line-height: 34rpx;
        display: blodk;
        margin-bottom: 20rpx;
      }

      .tag-area {
        display: flex;
        align-items: center;
        margin: 12rpx 0;

        .tag-item {
          font-size: 18rpx;
          padding: 4rpx 14rpx;
          border-radius: 20rpx;
          margin-right: 16rpx;
          border: 1px solid;

          &:nth-child(1) {
            color: #ff6b81;
            border-color: #ff6b81;
            background-color: rgba(255, 107, 129, 0.1);
          }

          &:nth-child(2) {
            color: #ffce2c;
            border-color: #ffce2c;
            background-color: rgba(255, 206, 44, 0.1);
          }

          &:nth-child(3) {
            color: #19be6b;
            border-color: #19be6b;
            background-color: rgba(25, 190, 107, 0.1);
          }

          &:nth-child(4) {
            color: #ff9900;
            border-color: #ff9900;
            background-color: rgba(255, 153, 0, 0.1);
          }

          // &:nth-child(5) {
          // }
        }
      }

      .price-area {
        display: flex;
        align-items: center;
        margin-top: 16rpx;
        font-size: 24rpx;
        color: #666;

        view {
          background-color: $uni-color-primary;
          color: #fff;
          font-size: 20rpx;
          padding: 2rpx 8rpx;
          border-radius: 4rpx;
          margin-right: 8rpx;
        }

        text {
          color: #ff6b81;
          font-size: 24rpx;
          margin: 0 4rpx;
        }
      }
    }
  }
}
</style>
