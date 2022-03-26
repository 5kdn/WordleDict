#!/usr/bin/env node

import {popup} from './popup'
import { createApp } from 'vue'
import App from './components/app.vue'

const app = createApp(App)
app.mount('App')

popup()
