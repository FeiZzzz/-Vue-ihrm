<template>
  <div class="dashboard-container">
    <div class="app-container">
      <ImageUpload :limit="limit" />
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      limit: 2
    }
  }
}
</script>

<style>

</style>
