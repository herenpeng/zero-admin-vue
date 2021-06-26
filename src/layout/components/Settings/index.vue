<template>
  <div class="drawer-container">
    <div>
      <h3 class="drawer-title">{{ $t('settings.title') }}</h3>

      <div class="drawer-item">
        <span>{{ $t('settings.theme') }}</span>
        <theme-picker style="float: right;height: 26px;margin: -3px 8px 0 0;" @change="themeChange" />
      </div>

      <div class="drawer-item">
        <span>{{ $t('settings.tagsView') }}</span>
        <el-switch v-model="tagsView" class="drawer-switch" />
      </div>

      <div class="drawer-item">
        <span>{{ $t('settings.fixedHeader') }}</span>
        <el-switch v-model="fixedHeader" class="drawer-switch" />
      </div>

      <div class="drawer-item">
        <span>{{ $t('settings.sidebarLogo') }}</span>
        <el-switch v-model="sidebarLogo" class="drawer-switch" />
      </div>

      <div v-if="lang === 'zh'" class="drawer-item">
        <span>菜单支持拼音搜索</span>
        <el-switch v-model="supportPinyinSearch" class="drawer-switch" />
      </div>

    </div>
  </div>
</template>

<script>
import ThemePicker from '@/components/ThemePicker'
const config = require('@/config')
import { loadConfig, setConfig, updateUserConfig } from '@/utils/config-util'

export default {
  name: 'Settings',
  components: { ThemePicker },
  data() {
    return {}
  },
  computed: {
    fixedHeader: {
      get() {
        return this.$store.state.settings.fixedHeader
      },
      set(val) {
        this.setConfigChange('fixedHeader', val)
      }
    },
    tagsView: {
      get() {
        return this.$store.state.settings.tagsView
      },
      set(val) {
        this.setConfigChange('tagsView', val)
      }
    },
    sidebarLogo: {
      get() {
        return this.$store.state.settings.sidebarLogo
      },
      set(val) {
        this.setConfigChange('sidebarLogo', val)
      }
    },
    supportPinyinSearch: {
      get() {
        return this.$store.state.settings.supportPinyinSearch
      },
      set(val) {
        this.setConfigChange('supportPinyinSearch', val)
      }
    },
    lang() {
      return this.$store.getters.language
    }
  },
  created() {
    loadConfig()
  },
  methods: {
    themeChange(val) {
      updateUserConfig(config.THEME_COLOR, val)
      setConfig('theme', val)
    }
  }
}
</script>

<style lang="scss" scoped>
  .drawer-container {
    padding: 24px;
    font-size: 14px;
    line-height: 1.5;
    word-wrap: break-word;

    .drawer-title {
      margin-bottom: 12px;
      color: rgba(0, 0, 0, .85);
      font-size: 14px;
      line-height: 22px;
    }

    .drawer-item {
      color: rgba(0, 0, 0, .65);
      font-size: 14px;
      padding: 12px 0;
    }

    .drawer-switch {
      float: right
    }

    .job-link {
      display: block;
      position: absolute;
      width: 100%;
      left: 0;
      bottom: 0;
    }
  }
</style>
