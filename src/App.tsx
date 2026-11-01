import { useState, useEffect } from "react";
import type { Todo } from "./types.ts";
import styles from './App.module.css';

function App() {
  const [todos, setTodos] = useState<Todo[]>(() => {
    const savedTodos = localStorage.getItem("todos");
    return savedTodos ? JSON.parse(savedTodos) : [];
  });

  const [title, setTitle] = useState("");
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todos));
  }, [todos]);

  const addTodo = () => {
    if (!title.trim()) return;

    const newTodo = {
      id: Date.now(),
      title: title.trim(),
      completed: false,
    };

    setTodos([...todos, newTodo]);
    setTitle("");
  };

  const toggleTodo = (id: number) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? {...todo, completed: !todo.completed } : todo
      )
    );
  };

  const deleteTodo = (id: number) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  const filteredTodos = todos.filter((todo) => {
    if (filter === "active") return !todo.completed;
    if (filter === "completed") return todo.completed;
    return true;
  });

  return (
    <div className={styles.todo}>
      <div>
        <h1 className={styles.todo__title}>Список задач</h1>

        <div className={styles.todo__blocks}>
          <input
            className={styles.todo__input}
            type="text"
            placeholder="Введите задачу"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <button onClick={addTodo} className={styles.todo__add}>Добавить</button>
        </div>

        <div className={styles.todo__filters}>
          <button onClick={() => setFilter("all")}>Все</button>
          <button onClick={() => setFilter("active")}>Активные</button>
          <button onClick={() => setFilter("completed")}>Выполненные</button>
        </div>
      </div>

      <ul className={styles.todo__list}>
        {filteredTodos.map((todo) => (
          <li className={styles.todo__item} key={todo.id}>
            <div>
              <input
                type="checkbox"
                checked={todo.completed}
                onChange={() => toggleTodo(todo.id)}
              />

              <span
                className={
                  todo.completed
                    ? `${styles["todo__text"]} ${styles["todo__text--completed"]}`
                    : styles["todo__text"]
                }
              >
              {todo.title}
            </span>
            </div>

            <button
              className={styles.todo__delete}
              onClick={() => deleteTodo(todo.id)}
            >
              Удалить
            </button>
          </li>
        ))}
      </ul>

      <p className={styles.todo__counter}>
        Осталось задач: {todos.filter((todo) => !todo.completed).length}
      </p>
    </div>
  )
}

export default App
