<template>
  <div class="container">
    <form>
      <h1 v-if="editTask">Изменить событие</h1>
      <h1 v-else>Создать событие</h1>
      <div class="form-input">
        <input type="text" id="title" v-model="taskData.title">
        <label for="title">Заголовок</label>
      </div>
      <div class="form-input">
        <textarea id="description" v-model="taskData.description"></textarea>
        <label for="description">Заголовок</label>
      </div>
      <div class="select-time">
        <date-time-picker
            v-model="taskData.time_spend_task"
            :inline="true"
            :value-format="'yyyy-LL-dd HH:mm:ss'"
            :today-button="true"
        ></date-time-picker>
        <p>Выбранное время: {{taskData.time_spend_task}}</p>
      </div>
      <button @click.prevent="createTask" v-if="!editTask">Сохранить</button>
      <div class="control-buttons" v-else>
        <button @click.prevent="updateTask">Сохранить</button>
        <button @click.prevent="cancelUpdate">Отмена</button>
      </div>
      <p v-if="showError" class="error">Данные заполнены не верно</p>
    </form>
    <div class="search-block">
      <div class="form-input">
        <input type="text" id="search" @keyup="getListTasks" v-model="searchDate">
        <label for="search">Поиск по заголовку</label>
      </div>
      <div class="form-input">
        <select class="form-select__filters" @change="getListTasks" id="filter" v-model="filterParams">
          <option value="">Не указано</option>
          <option value="day">За день</option>
          <option value="week">За неделю</option>
          <option value="month">За месяц</option>
        </select>
        <label for="filter">Выбрать параметр фильтрации</label>
      </div>
    </div>
    <div class="task-list" v-if="taskList.length > 0 && !editTask">
      <h1>Список задач</h1>
      <div class="task-list__item" v-for="item in taskList" :key="item.id">
        <p>id: {{item.id}}</p>
        <p>Заголовок: {{item.title}}</p>
        <p>Описание: {{item.description}}</p>
        <p>Время выполнения: {{item.time_spend_task}}</p>
        <div class="control-buttons">
          <button @click.prevent="deleteTask(item.id)">Удалить</button>
          <button @click.prevent="showUpdateTaskForm(item)">Редактировать</button>
        </div>
      </div>
    </div>
    <p v-else-if="!editTask">Задач еще нету</p>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'App',
  data () {
    return {
      taskList: [],
      taskData: {
        id: '',
        title: '',
        description: '',
        time_spend_task: '2019-10-01 00:00:00'
      },
      showError: false,
      editTask: false,
      searchDate: '',
      filterParams: ''
    }
  },
  methods: {
    getListTasks: async function () {
      try {
        let url = `http://127.0.0.1:8000/api/v1/task_list/?search=${this.searchDate}&time_range=${this.filterParams}`
        const response = await axios.get(url)
        this.taskList = response.data
      } catch (e) {
        console.error(e)
      }
    },
    createTask: async function () {
      this.showError = false
      try {
        if (this.taskData.title && this.taskData.description && this.taskData.time_spend_task) {
          await axios.post('http://127.0.0.1:8000/api/v1/create_task/', this.taskData)
          await this.getListTasks()
          this.taskData = {
            id: '',
            title: '',
            description: '',
            time_spend_task: '2019-10-01 00:00:00'
          }
        } else {
          this.showError = true
        }
      } catch (e) {
        console.error(e)
      }
    },
    deleteTask: async function (id) {
      try {
        if (id) {
          await axios.delete('http://127.0.0.1:8000/api/v1/delete_task/?id=' + id)
          await this.getListTasks()
        }
      }
      catch (e) {
        console.log(e)
      }
    },
    showUpdateTaskForm: function (task) {
      this.editTask = true
      for (let key in this.taskData) {
        if (key ==='time_spend_task') {
          this.taskData[key] = task[key].replace('T', ' ')
        } else {
          this.taskData[key] = task[key]
        }
      }
      this.taskData['id'] = task['id']
    },
    updateTask: async function () {
      try {
        await axios.put('http://127.0.0.1:8000/api/v1/update_task/', this.taskData)
        await this.getListTasks()
        this.taskData = {
          id: '',
          title: '',
          description: '',
          time_spend_task: '2019-10-01 00:00:00'
        }
      } catch (e) {
        console.error(e)
      } finally {
        this.editTask = false
      }
    },
    cancelUpdate: function () {
      this.taskData = {
        title: '',
        description: '',
        time_spend_task: '2019-10-01 00:00:00',
      }
      this.editTask = false
    }
  },
  mounted () {
    this.getListTasks()
  }
}
</script>
<style>
  * {
    padding: 0;
  }
  form {
    display: flex;
    align-items: center;
    flex-direction: column;
    margin-bottom: 18px;
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
  .error {
    color: red;
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
  .task-list {
    display: flex;
    align-items: center;
    flex-direction: column;
  }
  .task-list__item {
    border: 1px solid;
    margin-bottom: 11px;
    padding: 10px;
  }
  .control-buttons {
    display: flex;
    justify-content: space-around;
    width: 100%;
  }
</style>