<template>
  <div class="container">
    <form>
      <h1>Создать событие</h1>
      <div class="form-input">
        <input type="text" id="title">
        <label for="title">Заголовок</label>
      </div>
      <div class="form-input">
        <textarea id="description"></textarea>
        <label for="description">Заголовок</label>
      </div>
      <div class="select-time">
        <date-time-picker
            v-model="date"
            :inline="true"
            :value-format="'yyyy-LL-dd HH:mm:ss'"
        ></date-time-picker>
        <p>Выбранное время: {{date}}</p>
      </div>
    </form>
    <ul class="task-list" v-if="taskList.length > 0">
      <li v-for="(item, index) in taskList" :key="index">{{ item }}</li>
    </ul>
    <p v-else>Задач еще нету</p>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'App',
  data () {
    return {
      date: '2019-10-01 00:00:00',
      taskList: []
    }
  },
  methods: {
    getListTasks: function () {
      axios.get('')
    }
  }
}
</script>
<style>
  * {
    padding: 0;
  }
  textarea {
    resize: none;
    width: 370px;
    height: 100px;
    padding: 16px;
  }
  .container {
    width: 80%;
    margin: 0 auto;
    display: flex;
    align-items: center;
    flex-direction: column;
  }
  .select-time {
    display: flex;
    align-items: center;
    flex-direction: column;
  }
  .form-input {
    display: flex;
    align-items: center;
    flex-direction: column;
    margin-bottom: 24px;
  }
  ul {
    list-style-type: none;
  }
</style>