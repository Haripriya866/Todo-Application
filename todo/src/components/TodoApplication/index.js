import { Component } from "react";
import { v4 as uuidv4 } from "uuid";

import TodoItem from "../TodoItem";

import "./index.css";

const initialContainerBackgroundClassNames = [
  "amber",
  "blue",
  "orange",
  "teal",
  "red",
  "light-blue",
];

class TodoApplication extends Component {
  state = {
    todosList: [],
    currentTodo: "",
    editingTodoId: null,
    editingText: "",
  };

  componentDidMount() {
    const stringifiedTodoList = localStorage.getItem("todosList");
    if (stringifiedTodoList) {
      this.setState({ todosList: JSON.parse(stringifiedTodoList) });
    }
  }

  componentDidUpdate(prevProps, prevState) {
    const { todosList } = this.state;
    if (prevState.todosList !== todosList) {
      localStorage.setItem("todosList", JSON.stringify(todosList));
    }
  }

  onChangeInputValue = (event) => {
    this.setState({
      currentTodo: event.target.value,
    });
  };

  onEditingTextChange = (event) => {
    this.setState({
      editingText: event.target.value,
    });
  };

  saveEdit = () => {
    const { todosList, editingTodoId, editingText } = this.state;
    const updatedTodosList = todosList.map((todo) =>
      todo.id === editingTodoId ? { ...todo, currentTodo: editingText } : todo
    );
    this.setState({
      todosList: updatedTodosList,
      editingTodoId: null,
      editingText: "",
    });
  };

  startEditing = (id, text) => {
    this.setState({
      editingTodoId: id,
      editingText: text,
    });
  };

  addTodo = () => {
    const { currentTodo } = this.state;
    if (currentTodo === "") {
      alert("Enter Valid Text");
      return;
    }
    const initialBackgroundClassName =
      initialContainerBackgroundClassNames[
        Math.ceil(
          Math.random() * initialContainerBackgroundClassNames.length - 1
        )
      ];
    const newTodo = {
      id: uuidv4(),
      currentTodo,
      initialClassName: initialBackgroundClassName,
    };
    this.setState((prevState) => ({
      todosList: [...prevState.todosList, newTodo],
      currentTodo: "",
    }));
  };

  deleteTodo = (id) => {
    const { todosList } = this.state;
    this.setState({
      todosList: todosList.filter((todo) => todo.id !== id),
    });
  };



  render() {
    const { todosList, currentTodo, editingTodoId, editingText } = this.state;
    return (
      <>
        <div className="todo-application-container">
          <div className="todo-app">
            <h1 className="todo-heading">What's the Plan for Today?</h1>
            <div className="todo-input-container">
              <input
                type="text"
                className="todo-user-input"
                placeholder="Add a todo"
                value={currentTodo}
                onChange={this.onChangeInputValue}
              />
              <button
                type="button"
                className="add-button"
                onClick={this.addTodo}
              >
                Add Todo
              </button>
            </div>

            <ul className="todos-list-container">
              {todosList.map((eachTodo) =>
                editingTodoId === eachTodo.id ? (
                  <li key={eachTodo.id} className="new-todo-item">
                    <input
                      type="text"
                      value={editingText}
                      onChange={this.onEditingTextChange}
                      className="new-input-field"
                    />
                    <button className="save-button" onClick={this.saveEdit}>Save</button>
                  </li>
                ) : (
                  <TodoItem
                    key={eachTodo.id}
                    todoDetails={eachTodo}
                    deleteTodo={this.deleteTodo}
                    startEditing={this.startEditing}
                  />
                )
              )}
            </ul>
          </div>
        </div>
      </>
    );
  }
}
export default TodoApplication;
