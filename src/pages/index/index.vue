<template>
	<view class="container">
		<view class="header">
			<view class="status-bar"></view>
			<view class="nav-content">
				<view class="location">
					<uni-icons type="location" size="28" color="#fff"></uni-icons>
					<text class="city">青岛市</text>
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
	// import { onLoad } from '@dcloudio/uni-app';
	// import { ref } from 'vue';

	// const menuButtonInfo = ref(null)
	// onLoad(() => {
	// 	// #ifdef MP-WEIXIN
	// 	menuButtonInfo.value = uni.getMenuButtonBoundingClientRect()
	// 	console.log(menuButtonInfo.value)
	// 	// #endif

	// 	// #ifdef H5 || APP-PLUS
	// 	menuButtonInfo.value = {
	// 		top: 0,
	// 		height: 44
	// 	}
	// 	// #endif
	// })
</script>

<style lang="scss" scoped>
	.container {
		background-color: #f7f7f7;

		vue .header {
			background-color: $uni-color-primary;

			.status-bar {
				width: 100%;
				height: var(--status-bar-height);
			}

			.nav-content {
				display: flex;
				align-items: center;
				padding: 0 30rpx;

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