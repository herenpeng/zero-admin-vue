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
        <el-switch v-model="tagsView" class="drawer-switch" @change="tagsViewChange" />
      </div>

      <div class="drawer-item">
        <span>{{ $t('settings.fixedHeader') }}</span>
        <el-switch v-model="fixedHeader" class="drawer-switch" @change="fixedHeaderChange" />
      </div>

      <div class="drawer-item">
        <span>{{ $t('settings.sidebarLogo') }}</span>
        <el-switch v-model="sidebarLogo" class="drawer-switch" @change="sidebarLogoChange" />
      </div>

    </div>
  </div>
</template>

<script>
import ThemePicker from '@/components/ThemePicker'
const config = require('@/config')
import { loadConfig, setConfig, updateUserConfig } from '@/utils/config-util'
import { mapState } from 'vuex'

export default {
  name: 'Settings',
  components: { ThemePicker },
  data() {
    return {}
  },
  computed: {
    ...mapState({
      recordNumber: state => state.settings.recordNumber,
      tagsView: state => state.settings.tagsView,
      showSettings: state => state.settings.showSettings,
      fixedHeader: state => state.settings.fixedHeader,
      sidebarLogo: state => state.settings.sidebarLogo
    }),
    lang() {
      return this.$store.getters.language
    }
  },
  created() {
    loadConfig()
  },
  methods: {
    themeChange(val) {
      this.configChange(config.THEME_COLOR, 'theme', val)
    },
    tagsViewChange(val) {
      this.configChange(config.TAGS_VIEW, 'tagsView', val)
    },
    fixedHeaderChange(val) {
      this.configChange(config.FIXED_HEADER, 'fixedHeader', val)
    },
    sidebarLogoChange(val) {
      this.configChange(config.SIDEBAR_LOGO, 'sidebarLogo', val)
    },
    configChange(configKey, storeKey, value) {
      updateUserConfig(configKey, value)
      setConfig(storeKey, value)
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
