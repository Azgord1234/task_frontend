import Vue from 'vue'
import App from './App.vue'
import DateTimePicker from 'vue-vanilla-datetime-picker';

Vue.component('date-time-picker', DateTimePicker);

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
}).$mount('#app')
