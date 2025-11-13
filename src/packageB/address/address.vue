<template>
  <view class="address-page">
    <!-- 地址列表 -->
    <view class="address-list" v-if="addressList?.length">
      <view class="address-item" v-for="item in addressList" :key="item.id">
        <view class="address-info">
          <view class="content-info">
            <text class="name">{{ item.name }}</text>
            <text class="phone">{{ item.phone }}</text>
            <text class="default-tag" v-if="item.is_default">默认</text>
          </view>
          <view class="address-detail">{{ item.province }}{{ item.city }}{{ item.district }}{{ item.detail }}</view>
        </view>
        <view class="address-actions">
          <view class="acton-btn" @click="editAddress(item)">
            <up-icon name="edit-pen" size="20" color="#666"></up-icon>
          </view>
          <view class="acton-btn" @click="deleteAddress(item.id)">
            <up-icon name="trash" size="20" color="#666"></up-icon>
          </view>
        </view>
      </view>
    </view>
    <!-- 暂未地址信息 -->
    <view class="empty-state" v-else>
      <up-icon name="map" size="60" color="#ccc"></up-icon>
      <text class="empty-text">您还未添加收货地址</text>
    </view>
    <!-- 新增收货地址 -->
    <view class="add-btn" @click="showAddressPopup">
      <up-icon name="plus" size="20" color="#fff"></up-icon>
      <text>新增收货地址</text>
    </view>
    <!-- 地址编辑弹窗 -->
    <up-popup :show="showPopup" closeable @close="closePopup">
      <view class="address-form">
        <view class="form-title">{{ isEdit ? '编辑地址' : '新增地址' }}</view>
        <view class="form-item">
          <text class="label">收货人</text>
          <input v-model="addressForm.name" placeholder="请输入收货人姓名" class="input" />
        </view>
        <view class="form-item">
          <text class="label">手机号</text>
          <input v-model="addressForm.phone" placeholder="请输入手机号" type="number" :maxlength="11" class="input" />
        </view>
        <view class="form-item" @click="showRegionPicker">
          <text class="label">所在地区</text>
          <view class="region-display">
            <text v-if="addressForm.region.length">{{ addressForm.region.join(' ') }}</text>
            <text v-else>请选择所在地区</text>
            <up-icon name="arrow-right" size="16" color="#999"></up-icon>
          </view>
        </view>
        <view class="form-item">
          <text class="label">详细地址</text>
          <textarea v-model="addressForm.detail" placeholder="请输入详细地址" class="textarea"></textarea>
        </view>
        <view class="form-item">
          <text class="label">设为默认地址</text>
          <switch :checked="!!addressForm.is_default" color="#ffce2c" @change="onDefaultChange"></switch>
        </view>
        <view class="form-actions">
          <view class="cancel-btn" @click="closePopup">取消</view>
          <view class="save-btn" @click="saveAddress">保存</view>
        </view>
      </view>
    </up-popup>
    <!-- 省市区联动 -->
    <up-picker
      :show="show"
      ref="uPickerRef"
      :columns="columns"
      @confirm="confirm"
      @change="changeHandler"
      @cancel="cancel"
    ></up-picker>
  </view>
</template>

<script lang="ts" setup>
import { get, post } from '@/utils/http'
import { onLoad } from '@dcloudio/uni-app'
import { reactive, ref } from 'vue'
interface AddressItem {
  city: string
  detail: string
  district: string
  id: number
  is_default: 1 | 0
  name: string
  phone: string
  province: string
  user_id: number
}
interface AddressForm {
  name: string
  phone: string
  region: string[]
  detail: string
  is_default: 1 | 0
}
onLoad(() => {
  getAddressList()
})
const addressList = ref<AddressItem[]>([])
const getAddressList = async () => {
  try {
    const result: any = await get('/cart/address')
    addressList.value = result
  } catch (error) {
    console.log(error)
  }
}
const deleteAddress = (id: number) => {
  uni.showModal({
    title: '提示',
    content: '确认要删除这个地址吗?',
    async success(res) {
      if (res.confirm) {
        try {
          await post('/cart/deleteAddress', { id })
          uni.showToast({
            title: '删除成功',
            icon: 'success'
          })
          getAddressList()
        } catch (error) {
          console.log(error)
        }
      }
    }
  })
}
// 省市区级联选择
const columns = reactive([
  ['山东', '北京', '广东', '江苏'],
  ['青岛', '济南', '威海', '烟台'],
  ['市南区', '市北区', '崂山区', '李沧区']
])
// 市数据
const cityData = reactive([
  ['青岛', '济南', '威海', '烟台'],
  ['北京'],
  ['广州市', '深圳市', '珠海市'],
  ['南京市', '苏州市', '无锡市']
])
//区域数据
const districtData = reactive([
  // 山东
  [
    ['市南区', '市北区', '崂山区', '李沧区'], //青岛市
    ['历下区', '市中区', '槐荫区', '天桥区'], // 济南市
    ['环翠区', '文登区', '茉成市', '乳山市'], // 威海市
    ['芝罘区', '福山区', '牟平区', '莱山区'] // 烟台市
  ],
  [
    //  北京
    ['东城区', '西城区', '朝阳区', '海淀区', '丰台区']
  ],
  [
    // 广东
    ['越秀区', '海珠区', '荔湾区', '天河区'], // 广州市
    ['福田区', '罗湖区', '南山区', '盐田区'], //深圳市
    ['香洲区', '斗门区', '金湾区'] // 珠海市
  ],
  [
    // 江苏省
    ['玄武区', '秦淮区', '建邺区', '鼓楼区'], //南京市
    ['姑苏区', '虎丘区', '吴中区', '相城区'], // 苏州市
    ['梁溪区', '锡山区', '惠山区', '滨湖区'] //无锡市
  ]
])

const uPickerRef: any = ref(null)
const changeHandler = (e: any) => {
  const { columnIndex, value, values, index } = e
  console.log(columnIndex, value, values, index)
  // 省变化
  if (columnIndex === 0) {
    uPickerRef.value?.setColumnValues(1, cityData[index])
    uPickerRef.value.setColumnValues(2, districtData[index][0])
  }
  // 市变化
  if (columnIndex === 1) {
    // 获得省索引
    const provIndex = columns[0].indexOf(value[0])
    // 市索引
    const cityIndex = index // 当前市索引
    console.log('cityIndex', cityIndex)
    const districts = districtData[provIndex][cityIndex]
    uPickerRef.value.setColumnValues(2, districts)
  }
}

const confirm = (e: any) => {
  console.log('confirm', e)
  show.value = false
  addressForm.region = e.value
}
const cancel = () => {
  show.value = false
  addressForm.region = []
}

// 地址编辑弹窗
const show = ref<boolean>(false)
const showPopup = ref<boolean>(false)
const isEdit = ref<boolean>(false)
const showAddressPopup = () => {
  isEdit.value = false
  showPopup.value = true
}
const closePopup = () => {
  showPopup.value = false
  resetForm()
}
const addressForm = reactive<AddressForm>({
  name: '',
  phone: '',
  region: [],
  detail: '',
  is_default: 0
})
const currentId = ref<number | null>(null)
const onDefaultChange = (e: any) => {
  addressForm.is_default = e.detail.value ? 1 : 0
}

const editAddress = (item: AddressItem) => {
  isEdit.value = true
  currentId.value = item.id
  addressForm.name = item.name
  addressForm.phone = item.phone
  addressForm.region = [item.province, item.city, item.district]
  addressForm.detail = item.detail
  addressForm.is_default = item.is_default
  showPopup.value = true
}
// 重置表单
const resetForm = () => {
  addressForm.name = ''
  addressForm.phone = ''
  addressForm.region = []
  addressForm.detail = ''
  addressForm.is_default = 0
}
// 打开地址选择弹窗
const showRegionPicker = () => {
  show.value = true
}
const saveAddress = async () => {
  if (
    !addressForm.name.trim() ||
    !addressForm.phone.trim() ||
    !addressForm.region.length ||
    !addressForm.detail.trim()
  ) {
    uni.showToast({
      title: '请填写每一项地址信息',
      icon: 'none'
    })
    return
  }
  const newAddress = {
    id: isEdit.value ? currentId.value : null,
    name: addressForm.name,
    phone: addressForm.phone,
    province: addressForm.region[0],
    city: addressForm.region[1],
    district: addressForm.region[2],
    detail: addressForm.detail,
    is_default: addressForm.is_default
  }
  try {
    await post('/cart/addOrUpdate', newAddress)
    uni.showToast({
      title: '操作成功'
    })
    closePopup()
    getAddressList()
  } catch (error) {
    console.log(error)
  }
}
</script>

<style lang="scss" scoped>
.address-page {
  min-height: 100vh;
  background-color: #f5f5f5;
  padding-bottom: 120rpx;
  .address-list {
    .address-item {
      background-color: #fff;
      margin-bottom: 20rpx;
      padding: 30rpx;
      display: flex;
      align-items: center;
      .address-info {
        flex: 1;
        .content-info {
          margin-bottom: 10rpx;
          .name {
            font-size: 32rpx;
            font-weight: bold;
            color: #333;
            margin-right: 20rpx;
          }
          .phone {
            font-size: 28rpx;
            color: #666;
            margin-right: 20rpx;
          }
          .default-tag {
            background-color: #ffce2c;
            color: #fff;
            font-size: 24rpx;
            padding: 4rpx 12rpx;
            border-radius: 6rps;
          }
        }
        .address-detail {
          font-size: 28rpx;
          color: #666;
          line-height: 1.4;
        }
      }
      .address-actions {
        display: flex;
        .acton-btn {
          width: 60rpx;
          height: 60rpx;
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: #f5f5f5;
          border-radius: 50%;
          margin-right: 16rpx;
        }
      }
    }
  }
  .empty-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 100rpx 0;
    .empty-text {
      margin-top: 20rpx;
      font-size: 28rpx;
      color: #999;
    }
  }
  .add-btn {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    height: 120rpx;
    background-color: #ffce2c;
    color: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 32rpx;
    font-weight: bold;
    text {
      margin-left: 16rpx;
    }
  }
  .address-form {
    padding: 30rpx;
    .form-title {
      font-size: 36rpx;
      font-weight: bold;
      color: #333;
      text-align: center;
      margin-bottom: 40rpx;
    }
    .form-item {
      display: flex;
      align-items: center;
      padding: 30rpx 0;
      border-bottom: 1rpx solid #eee;
      .label {
        width: 160rpx;
        font-size: 28rpx;
        color: #333;
      }
      text {
      }
      .input {
        flex: 1;
        font-size: 28rpx;
        color: #333;
      }
      textarea {
        flex: 1;
        height: 120rpx;
        font-size: 28rpx;
        color: #333;
      }
      .region-display {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: space-between;
        font-size: 28rpx;
        color: #333;
        text {
          color: #777;
        }
      }
    }
    .form-actions {
      display: flex;
      margin-top: 40rpx;
      .cancel-btn,
      .save-btn {
        flex: 1;
        height: 80rpx;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 32rpx;
        font-weight: bold;
        border-radius: 40rpx;
        margin-right: 16rpx;
      }
      .cancel-btn {
        background-color: #f5f5f5;
        color: #666;
      }
      .save-btn {
        background-color: #ffce2c;
        color: #fff;
      }
    }
  }
}
</style>
