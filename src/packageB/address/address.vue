<template>
  <view class="address-page">
    <!-- 地址列表 -->
    <view class="address-list">
      <view class="address-item">
        <view class="address-info">
          <view class="content-info">
            <text class="name">张三</text>
            <text class="phone">188888888</text>
            <text class="default-tag">默认</text>
          </view>
          <view class="address-detail"> 北京市北京市朝阳区某某街道 </view>
        </view>
        <view class="address-actions">
          <view class="acton-btn">
            <up-icon name="edit-pen" size="20" color="#666"></up-icon>
          </view>
          <view class="acton-btn">
            <up-icon name="trash" size="20" color="#666"></up-icon>
          </view>
        </view>
      </view>
    </view>
    <!-- 暂未地址信息 -->
    <view class="empty-state">
      <up-icon name="map" size="80" color="#ccc"></up-icon>
      <text class="empty-text">您还未添加收货地址</text>
    </view>
    <!-- 新增收货地址 -->
    <view class="add-btn">
      <up-icon name="plus" size="20" color="#fff"></up-icon>
      <text>新增收货地址</text>
    </view>
    <!-- 地址编辑弹窗 -->
    <up-popup :show="true" closeable>
      <view class="address-form">
        <view class="form-title">新增地址</view>
        <view class="form-item">
          <text>收货人</text>
          <input placeholder="请输入收货人姓名" class="input" />
        </view>
        <view class="form-item">
          <text>手机号</text>
          <input placeholder="请输入手机号" type="number" :maxlength="11" class="input" />
        </view>
        <view class="form-item">
          <text>所在地区</text>
          <view class="region-display">
            <text>请选择所在地区</text>
            <up-icon name="arrow-right" size="16" color="#999"></up-icon>
          </view>
        </view>
        <view class="form-item">
          <text>详细地址</text>
          <textarea placeholder="请输入详细地址" class="textarea"></textarea>
        </view>
        <view class="form-item">
          <text>设为默认地址</text>
          <switch color="#ffce2c"></switch>
        </view>
        <view class="form-actions">
          <view class="cancel-btn">取消</view>
          <view class="save-btn">保存</view>
        </view>
      </view>
    </up-popup>
  </view>
</template>

<script lang="ts" setup></script>

<style lang="scss" scoped></style>
