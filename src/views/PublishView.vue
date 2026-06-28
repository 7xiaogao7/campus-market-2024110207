<script setup lang="ts">
import { ref } from 'vue'

const title = ref('')
const price = ref<number | ''>('')
const category = ref('')
const desc = ref('')

const categories = ['电子数码', '教材书籍', '生活用品', '服饰鞋包', '运动户外', '其他']

const submit = () => {
  if (!title.value || !price.value || !category.value) {
    alert('请填写标题、价格和分类')
    return
  }
  alert(`发布成功！\n标题：${title.value}\n价格：¥${price.value}\n分类：${category.value}`)
  title.value = ''
  price.value = ''
  category.value = ''
  desc.value = ''
}
</script>

<template>
  <div class="publish">
    <h1>发布页</h1>

    <form class="form" @submit.prevent="submit">
      <div class="field">
        <label>商品标题 <span class="required">*</span></label>
        <input v-model="title" type="text" placeholder="例如：九成新 iPad Air 5" />
      </div>

      <div class="field">
        <label>售价（元） <span class="required">*</span></label>
        <input v-model.number="price" type="number" placeholder="例如：3299" />
      </div>

      <div class="field">
        <label>商品分类 <span class="required">*</span></label>
        <select v-model="category">
          <option value="">请选择分类</option>
          <option v-for="c in categories" :key="c" :value="c">{{ c }}</option>
        </select>
      </div>

      <div class="field">
        <label>商品描述</label>
        <textarea v-model="desc" rows="4" placeholder="介绍一下商品成色、购买时间、是否包邮等..."></textarea>
      </div>

      <div class="actions">
        <button type="submit" class="btn-primary">发布商品</button>
        <button type="reset" class="btn-plain">清空重填</button>
      </div>
    </form>
  </div>
</template>

<style scoped>
.publish {
  display: flex;
  flex-direction: column;
  gap: 20px;
  max-width: 640px;
}

.publish h1 {
  margin: 0;
  font-size: 26px;
}

.form {
  display: flex;
  flex-direction: column;
  gap: 18px;
  padding: 26px;
  background: #fff;
  border: 1px solid #e8ecf2;
  border-radius: 10px;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

label {
  font-size: 14px;
  color: #303133;
  font-weight: 500;
}

.required {
  color: #f56c6c;
  margin-left: 2px;
}

input,
select,
textarea {
  padding: 10px 12px;
  border: 1px solid #dcdfe6;
  border-radius: 6px;
  font-size: 14px;
  color: #303133;
  outline: none;
  transition: border-color 0.2s;
  font-family: inherit;
}

input:focus,
select:focus,
textarea:focus {
  border-color: #409eff;
}

textarea {
  resize: vertical;
}

.actions {
  display: flex;
  gap: 12px;
  margin-top: 6px;
}

.btn-primary {
  padding: 10px 24px;
  background: #409eff;
  color: #fff;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  cursor: pointer;
  transition: background 0.2s;
}

.btn-primary:hover {
  background: #66b1ff;
}

.btn-plain {
  padding: 10px 24px;
  background: #fff;
  color: #606266;
  border: 1px solid #dcdfe6;
  border-radius: 6px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-plain:hover {
  color: #409eff;
  border-color: #b3d8ff;
  background: #ecf5ff;
}
</style>
