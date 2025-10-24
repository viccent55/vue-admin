/**
 * Vuetify Plugin — clean + modular version
 * Supports:
 *  - Material Design 3 blueprint
 *  - Dynamic color theme
 *  - Local SVG icons under `/assets/icons/*.svg`
 *  - MDI SVG icon set fallback
 */

import 'vuetify/styles/main.sass'
import { createVuetify } from 'vuetify'
import { h } from 'vue'

import type { IconSet, IconProps } from 'vuetify'
import { aliases, mdi } from 'vuetify/iconsets/mdi-svg'
import { md3 } from 'vuetify/blueprints'
import colors from 'vuetify/util/colors'
/* -------------------------------------------------------------------------- */
/* 🌈 1. THEME CONFIGURATION                                                  */
/* -------------------------------------------------------------------------- */

const defaultPrimary = colors.red.darken1

const themePrimary = localStorage.getItem('theme-primary') || defaultPrimary

const theme = {
  light: {
    dark: false,
    colors: {
      primary: themePrimary,
    },
  },
  dark: {
    dark: true,
    colors: {
      primary: themePrimary,
    },
  },
}

/* -------------------------------------------------------------------------- */
/* 🖼️ 2. CUSTOM SVG ICON LOADER                                              */
/* -------------------------------------------------------------------------- */
/** Extracts filename (without extension) from path. */
function getFilename(path: string): string {
  return path
    .split(/(\\|\/)/g)
    .pop()!
    .replace(/\.[^/.]+$/, '')
}

/** Eagerly imports all SVGs in `/assets/icons/*.svg` as raw strings. */
const rawSVGs = import.meta.glob('@/assets/icons/*.svg', {
  eager: true,
  import: 'default',
  query: '?raw',
})

/** Key → SVG content map */
const svgIcons = Object.fromEntries(
  Object.entries(rawSVGs).map(([key, value]) => [getFilename(key), value]),
)

/** Vue render function component that injects the SVG raw markup. */
const customIconSet: IconSet = {
  component: (props: IconProps) =>
    h(props.tag, { innerHTML: svgIcons[props.icon as string] }),
}

/* -------------------------------------------------------------------------- */
/* ⚙️ 3. CREATE VUETIFY INSTANCE                                             */
/* -------------------------------------------------------------------------- */

export default createVuetify({
  blueprint: md3,

  // Default component props
  defaults: {
    VSwitch: { color: 'primary' },
  },

  theme: {
    defaultTheme: 'light',
    themes: theme,
  },

  icons: {
    defaultSet: 'mdi',
    aliases,
    sets: {
      mdi,
      custom: customIconSet,
    },
  },

  display: {
    mobileBreakpoint: 'sm', // breakpoint threshold for mobile view
  },

})
