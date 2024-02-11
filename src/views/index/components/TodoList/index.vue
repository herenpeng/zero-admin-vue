<template>
  <section class="todoapp">
    <!-- header -->
    <header class="header">
      <input class="new-todo" autocomplete="off" :placeholder="$t('index.todoList.name')" @keyup.enter="addTodo">
    </header>
    <!-- main section -->
    <section v-show="todos.length" class="main">
      <input id="toggle-all" :checked="allChecked" class="toggle-all" type="checkbox" @change="toggleAll({ done: !allChecked })">
      <label for="toggle-all" />
      <ul class="todo-list">
        <todo
          v-for="(todo, index) in filteredTodos"
          :key="index"
          :todo="todo"
          @toggleTodo="toggleTodo"
          @editTodo="editTodo"
          @deleteTodo="deleteTodo"
        />
      </ul>
    </section>
    <!-- footer -->
    <footer v-show="todos.length" class="footer">
      <span class="todo-count">
        <strong>{{ remaining }}</strong>
        {{ remaining === 1 ? $t('index.todoList.itemLeft') : $t('index.todoList.itemsLeft') }}
      </span>
      <ul class="filters">
        <li>
          <a :class="{ selected: visibility === 'all' }" @click.prevent="visibility = 'all'">{{ $t('index.todoList.all') }}</a>
          <a :class="{ selected: visibility === 'active' }" @click.prevent="visibility = 'active'">{{ $t('index.todoList.active') }}</a>
          <a :class="{ selected: visibility === 'completed' }" @click.prevent="visibility = 'completed'">{{ $t('index.todoList.completed') }}</a>
          <a v-show="todos.length > remaining" @click="clearCompleted">{{ $t('index.todoList.clearCompleted') }}</a>
        </li>
      </ul>
    </footer>
  </section>
</template>

<script>
import Todo from './Todo.vue'

const STORAGE_KEY = 'todos'
const filters = {
  all: todos => todos,
  active: todos => todos.filter(todo => !todo.done),
  completed: todos => todos.filter(todo => todo.done)
}
const defaultList = [
  { text: '首页Chart改造', done: false },
  { text: '前端i18n', done: false },
  { text: '后端i18n', done: false },
  { text: '首页Todo List改造', done: true },
  { text: '首页BoxCard改造', done: true },
  { text: '重构文件管理系统', done: true },
  { text: '鉴权逻辑优化', done: true },
  { text: 'Root权限保护机制', done: true }
]
export default {
  components: { Todo },
  data() {
    return {
      visibility: 'all',
      filters,
      todos: defaultList
    }
  },
  computed: {
    allChecked() {
      return this.todos.every(todo => todo.done)
    },
    filteredTodos() {
      return filters[this.visibility](this.todos)
    },
    remaining() {
      return this.todos.filter(todo => !todo.done).length
    }
  },
  methods: {
    setLocalStorage() {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(this.todos))
    },
    addTodo(e) {
      const text = e.target.value
      if (text.trim()) {
        // 在首位添加新的数据
        this.todos.unshift({
          text,
          done: false
        })
        this.setLocalStorage()
      }
      e.target.value = ''
    },
    toggleTodo(val) {
      val.done = !val.done
      this.setLocalStorage()
    },
    deleteTodo(todo) {
      this.todos.splice(this.todos.indexOf(todo), 1)
      this.setLocalStorage()
    },
    editTodo({ todo, value }) {
      todo.text = value
      this.setLocalStorage()
    },
    clearCompleted() {
      this.todos = this.todos.filter(todo => !todo.done)
      this.setLocalStorage()
    },
    toggleAll({ done }) {
      this.todos.forEach(todo => {
        todo.done = done
      })
      this.setLocalStorage()
    }
  }
}
</script>

<style lang="scss">
  @import './index.scss';
</style>
