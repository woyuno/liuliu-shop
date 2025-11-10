<template>
  <up-popup :show="show" closeable @close="handleClose">
    <view class="spec-popup">
      <view class="popup-header">
        <image :src="product.main_pic" mode="aspectFill" />
        <view class="product-info">
          <view class="price">￥{{ finalPrice }}</view>
          <view class="selected">已选: {{ selectedSpec || '请选择规格' }}</view>
        </view>
      </view>
      <view class="spec-content">
        <view class="spec-group" v-for="group in specList" :key="group.attr_id">
          <view class="group-title">{{ group.attr_name }}</view>
          <view class="spec-items">
            <view
              class="spec-item"
              :class="{ active: selectedSpecs[group.attr_id] === item.value_id }"
              v-for="item in group.values"
              :key="item.value_id"
              @click="selectSpec(group.attr_id, item.value_id, item.value)"
              >{{ item.value }}</view
            >
          </view>
        </view>
        <view class="popup-footer">
          <view class="quantity">
            <text>数量</text>
            <view class="quantity-control">
              <view class="minus" @click="decrease">-</view>
              <view class="count">{{ quantity }}</view>
              <view class="plus" @click="increase">+</view>
            </view>
          </view>
          <view class="confirm-btn" @click="confirmSpec">加购</view>
        </view>
      </view>
    </view>
  </up-popup>
</template>
<script lang="ts" setup>
import { get, post } from '@/utils/http'
import { computed, watch } from 'vue'
import { ref, reactive } from 'vue'
interface ProductItem {
  id: number
  name: string
  price: string
  o_price: string
  stock: number
  category_id: number
  main_pic: string
  desc: string
}
// 规格分类值
interface SpecValue {
  value_id: number
  value: string
  multiple: string
}
// 规格分类名称
interface SpecArr {
  attr_id: number
  attr_name: string
  values: SpecValue[]
}
const props = defineProps<{ show: boolean; product: ProductItem }>()
const emit = defineEmits(['close'])
// 获取商品规格
watch(
  () => props.show,
  newVal => {
    if (newVal) {
      getSpec()
    }
  }
)
const specList = ref<SpecArr[]>([])
const getSpec = async () => {
  try {
    const res: any = await get('/cart/getSpec', { id: props.product.id })
    specList.value = res || []
    console.log(4, specList.value)
    if (!res) {
      handleClose()
      setTimeout(() => {
        uni.navigateTo({
          url: '/pages/login/login'
        })
      }, 500)
    }
  } catch (error) {
    console.log(error)
  }
}

const selectedSpecs = reactive<{ [key: string]: number }>({})
const selectedTexts = reactive<{ [key: string]: string }>({})
const selectedSpec = ref<String>('')
const selectSpec = (attr_id: number, value_id: number, value: string) => {
  selectedSpecs[attr_id] = value_id
  selectedTexts[attr_id] = value
  selectedSpec.value = Object.values(selectedTexts).join(',')
}
const handleClose = () => {
  emit('close')
  // 清空
  Object.keys(selectedSpecs).forEach(k => delete selectedSpecs[k])
  Object.keys(selectedTexts).forEach(k => delete selectedTexts[k])
  selectedSpec.value = ''
}
// 商品数量
const quantity = ref<number>(1)
const increase = () => {
  quantity.value++
}
const decrease = () => {
  if (quantity.value > 1) {
    quantity.value--
  }
}
const finalPrice = computed(() => {
  let price: number = Number(props.product.price)
  if (specList.value.length) {
    specList.value.forEach(group => {
      const selected = group.values.find(item => selectedSpecs[group.attr_id] === item.value_id)
      console.log(selected)
      if (selected?.multiple) {
        price *= Number(selected.multiple)
      }
    })
  }
  return price * quantity.value
})
// 调用加入购物车接口
const confirmSpec = async () => {
  // 判断该商品所有规格是否都选择了
  //every 检测数组中所有元素是否都符合指定套件
  const allSelected: boolean = specList.value.every(group => selectedSpecs[group.attr_id])
  if (!allSelected) {
    uni.showToast({
      title: '请选择完整规格',
      icon: 'error'
    })
    return
  }
  try {
    const res = await post('/cart/addCart', {
      product_id: props.product.id,
      name: props.product.name,
      price: finalPrice.value,
      count: quantity.value,
      spec: selectedSpec.value,
      main_pic: props.product.main_pic
    })
    uni.showToast({
      title: '加购成功',
      icon: 'success'
    })
    handleClose()
  } catch (error) {
    console.log(error)
  }
}
</script>
<style lang="scss" scoped>
.spec-popup {
  padding: 30rpx;
  .popup-header {
    display: flex;
    align-items: center;
    margin-bottom: 30rpx;
    image {
      width: 160rpx;
      height: 160rpx;
      border-radius: 12rpx;
      margin-right: 20rpx;
    }
    .product-info {
      flex: 1;
      .price {
        color: #ff4d4f;
        font-size: 36rpx;
        font-weight: bold;
        margin-bottom: 10rpx;
      }
      .selected {
        color: #666;
        font-size: 28rpx;
      }
    }
  }
  .spec-content {
    max-height: 600rpx;
    overflow-y: auto;
    .spec-group {
      margin-bottom: 30rpx;
      .group-title {
        font-size: 28rpx;
        color: #333;
        margin-bottom: 20rpx;
      }
      .spec-items {
        display: flex;
        flex-wrap: wrap;
        gap: 20rpx;
        .spec-item {
          padding: 10rpx 30rpx;
          border: 2rpx solid #ddd;
          border-radius: 30rpx;
          font-size: 26rpx;
          color: #666;
          &.active {
            color: $uni-color-primary;
            border-color: $uni-color-primary;
            background-color: rgba(255, 206, 44, 0.1);
          }
        }
      }
    }
    .popup-footer {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-top: 30rpx;
      padding-top: 30rpx;
      border-top: 2rpx solid #eee;
      .quantity {
        display: flex;
        align-items: center;
        text {
          margin-right: 20rpx;
          font-size: 28rpx;
          color: #333;
        }
        .quantity-control {
          display: flex;
          align-items: center;
          .minus,
          .plus {
            width: 60rpx;
            height: 60rpx;
            border: 2px solid #ddd;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 32rpx;
          }
          .count {
            width: 80rpx;
            height: 60rpx;
            text-align: center;
            border-top: 2rpx solid #ddd;
            border-bottom: 2rpx solid #ddd;
            line-height: 60rpx;
          }
        }
      }
      .confirm-btn {
        width: 240rpx;
        height: 80rpx;
        background-color: $uni-color-primary;
        color: #fff;
        border-radius: 40rpx;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 28rpx;
      }
    }
  }
}
</style>
