<script setup lang="ts"></script>

<template>
  <router-view v-slot="{ Component, route }">
    <transition name="fade" mode="out-in">
      <keep-alive>
        <component :is="Component" :key="route.path" />
      </keep-alive>
    </transition>
  </router-view>
</template>
