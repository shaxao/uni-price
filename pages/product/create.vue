<template>
  <view class="create-container">
    <base-card class="form-card">
      <template #header>
        <text class="form-title">发布产品</text>
      </template>
      
      <view class="form-content">
        <base-input
          v-model="form.name"
          label="产品名称"
          placeholder="请输入产品名称"
          :error="errors.name"
        />
        
        <base-input
          v-model="form.description"
          label="产品描述"
          placeholder="请输入产品描述"
          :error="errors.description"
        />
        
        <view class="form-row">
          <base-input
            v-model="form.length"
            label="长度(cm)"
            type="number"
            placeholder="请输入长度"
            :error="errors.length"
          />
          
          <base-input
            v-model="form.width"
            label="宽度(cm)"
            type="number"
            placeholder="请输入宽度"
            :error="errors.width"
          />
          
          <base-input
            v-model="form.height"
            label="高度(cm)"
            type="number"
            placeholder="请输入高度"
            :error="errors.height"
          />
        </view>
        
        <view class="form-row">
          <base-input
            v-model="form.grossWeight"
            label="毛重(kg)"
            type="number"
            placeholder="请输入毛重"
            :error="errors.grossWeight"
          />
          
          <base-input
            v-model="form.packageWeight"
            label="箱体重(kg)"
            type="number"
            placeholder="请输入箱体重"
            :error="errors.packageWeight"
          />
          
          <base-input
            v-model="form.chargeableWeight"
            label="计费重(kg)"
            type="number"
            placeholder="请输入计费重"
            :error="errors.chargeableWeight"
          />
        </view>
        
        <view class="form-row">
          <base-input
            v-model="form.totalQuantity"
            label="总件数"
            type="number"
            placeholder="请输入总件数"
            :error="errors.totalQuantity"
          />
          
          <base-input
            v-model="form.totalVolume"
            label="总体积(m³)"
            type="number"
            placeholder="请输入总体积"
            :error="errors.totalVolume"
          />
          
          <base-input
            v-model="form.totalGrossWeight"
            label="总毛重(kg)"
            type="number"
            placeholder=""
            :error="errors.totalGrossWeight"
          />
        </view>
        
        <base-input
          v-model="form.warehouse"
          label="仓库地址"
          placeholder="请输入仓库地址"
          :error="errors.warehouse"
        />
        
        <base-input
          v-model="form.zipcode"
          label="邮编"
          placeholder="请输入邮编"
          :error="errors.zipcode"
        />
        
        <view class="form-date">
          <text class="form-label">截止日期</text>
          <picker
            mode="date"
            :value="form.expiryDate"
            :start="minDate"
            :end="maxDate"
            @change="handleDateChange"
          >
            <view class="picker-value">
              {{ form.expiryDate || '请选择截止日期' }}
            </view>
          </picker>
          <text v-if="errors.expiryDate" class="form-error">{{ errors.expiryDate }}</text>
        </view>
      </view>
      
      <template #footer>
        <view class="form-footer">
          <base-button
            type="secondary"
            class="mr-md"
            @click="handleCancel"
          >
            取消
          </base-button>
          <base-button
            type="primary"
            :loading="loading"
            @click="handleSubmit"
          >
            发布
          </base-button>
        </view>
      </template>
    </base-card>
  </view>
</template>

<script>
import { mapActions } from 'vuex'
import dayjs from 'dayjs'
import BaseCard from '../../components/BaseCard.vue'
import BaseButton from '../../components/BaseButton.vue'
import BaseInput from '../../components/BaseInput.vue'

export default {
  name: 'ProductCreate',
  components: {
    BaseCard,
    BaseButton,
    BaseInput
  },
  data() {
    return {
      loading: false,
      form: {
        name: '',
        description: '',
        length: '',
        width: '',
        height: '',
        grossWeight: '',
        packageWeight: '',
        chargeableWeight: '',
        totalQuantity: '',
        totalVolume: '',
        totalGrossWeight: '',
        warehouse: '',
        zipcode: '',
        expiryDate: ''
      },
      errors: {}
    }
  },
  computed: {
    minDate() {
      return dayjs().format('YYYY-MM-DD')
    },
    maxDate() {
      return dayjs().add(1, 'year').format('YYYY-MM-DD')
    }
  },
  methods: {
    ...mapActions('product', ['createProduct']),
    
    handleDateChange(e) {
      this.form.expiryDate = e.detail.value
    },
    
    validateForm() {
      const errors = {}
      
      if (!this.form.name) {
        errors.name = '请输入产品名称'
      }
      
      if (!this.form.description) {
        errors.description = '请输入产品描述'
      }
      
      if (!this.form.length) {
        errors.length = '请输入长度'
      }
      
      if (!this.form.width) {
        errors.width = '请输入宽度'
      }
      
      if (!this.form.height) {
        errors.height = '请输入高度'
      }
      
      if (!this.form.grossWeight) {
        errors.grossWeight = '请输入毛重'
      }
      
      if (!this.form.packageWeight) {
        errors.packageWeight = '请输入箱体重'
      }
      
      if (!this.form.chargeableWeight) {
        errors.chargeableWeight = '请输入计费重'
      }
      
      if (!this.form.totalQuantity) {
        errors.totalQuantity = '请输入总件数'
      }
      
      if (!this.form.totalVolume) {
        errors.totalVolume = '请输入总体积'
      }
      
      if (!this.form.totalGrossWeight) {
        errors.totalGrossWeight = '请输入总毛重'
      }
      
      if (!this.form.warehouse) {
        errors.warehouse = '请输入仓库地址'
      }
      
      if (!this.form.zipcode) {
        errors.zipcode = '请输入邮编'
      }
      
      if (!this.form.expiryDate) {
        errors.expiryDate = '请选择截止日期'
      }
      
      this.errors = errors
      return Object.keys(errors).length === 0
    },
    
    async handleSubmit() {
      if (!this.validateForm()) {
        return
      }
      
      this.loading = true
      try {
        await this.createProduct(this.form)
        uni.showToast({
          title: '发布成功',
          icon: 'success'
        })
        setTimeout(() => {
          uni.navigateBack()
        }, 1500)
      } catch (error) {
        uni.showToast({
          title: error.message || '发布失败',
          icon: 'none'
        })
      } finally {
        this.loading = false
      }
    },
    
    handleCancel() {
      uni.navigateBack()
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../../styles/theme.scss';

.create-container {
  min-height: 100vh;
  background-color: $bg-secondary;
  padding: $spacing-md;
}

.form-card {
  .form-title {
    font-size: $font-size-lg;
    font-weight: bold;
    color: $text-primary;
  }
}

.form-content {
  .form-row {
    display: flex;
    gap: $spacing-md;
    margin-bottom: $spacing-md;
    
    .base-input {
      flex: 1;
    }
  }
}

.form-date {
  margin-bottom: $spacing-md;
  
  .form-label {
    font-size: $font-size-sm;
    color: $text-secondary;
    margin-bottom: $spacing-xs;
    display: block;
  }
  
  .picker-value {
    padding: $spacing-sm;
    border: 1px solid $border-color;
    border-radius: $border-radius-md;
    font-size: $font-size-md;
    color: $text-primary;
    background-color: $bg-primary;
  }
  
  .form-error {
    font-size: $font-size-xs;
    color: $error-color;
    margin-top: $spacing-xs;
  }
}

.form-footer {
  display: flex;
  justify-content: flex-end;
}
</style> 