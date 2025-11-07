<template>
	<view class="container">
		<view class="header" :style="headerStyle">
			<view class="status-bar"></view>
			<view class="nav-content" :style="navStyle">
				<view class="location">
					<uni-icons type="location" size="28" color="#fff"></uni-icons>
					<text class="city"></text>
				</view>
				<view class="search-box">
					<uni-search-bar radius="100" placeholder="搜索宠物服务" clearButton="none" cancelButton="none">
					</uni-search-bar>
				</view>
			</view>
		</view>
	</view>
</template>

<script setup lang="ts">
	import { onLoad } from '@dcloudio/uni-app';
	import { computed, ref } from 'vue';
	import { reverseCode } from '../../utils/getcode';

	const menuButtonInfo = ref(null)
	onLoad(() => {
		// #ifdef MP-WEIXIN
		menuButtonInfo.value = uni.getMenuButtonBoundingClientRect()
		console.log(menuButtonInfo.value)
		// #endif

		// #ifdef H5 || APP-PLUS
		menuButtonInfo.value = {
			top: 0,
			height: 44
		}
		// #endif
		startLocation()
	})
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
	const cityName = ref<string>("")
	const startLocation = (() => {
		console.log('开始定位')
		uni.getLocation({
			type: 'wgs84',
			geocode: true,
			success(res){
				console.log('获取定位成功')
				console.log('经度是',res.longitude)
				console.log('维度是',res.latitude)
				reverseCode(res.longitude,res.latitude)
			},
			fail(res){
				cityName.value = '无法获取位置'
				console.log('获取定位失败')
				uni.showModal({
					title:'提示',
					content:'需要获取您的位置信息，是否去设置开启定位',
					success(res) {
						if(res.confirm){
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

	})
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
</style>