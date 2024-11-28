import { TiDeleteOutline } from "react-icons/ti";
import { FaEdit } from "react-icons/fa";

import "./index.css";

const TodoItem = (props) => {
  const { todoDetails, deleteTodo, startEditing } = props;
  const { id, currentTodo, initialClassName } = todoDetails;

  const onDeleteButton = () => {
    deleteTodo(id);
  };

  const onEditButton = () => {
    startEditing(id, currentTodo);
  };

  return (
    <li className="todo-item">
      <div className={`todo-item-container ${initialClassName}`}>
        <span className="todo">{currentTodo}</span>
        <div className="icon-container">
          <button
            type="button"
            className="delete-icon"
            onClick={onDeleteButton}
          >
            <TiDeleteOutline size="20px" />
          </button>
          <button type="button" className="edit-icon" onClick={onEditButton}>
            <FaEdit size="16px" />
          </button>
        </div>
      </div>
    </li>
  );
};
export default TodoItem;
