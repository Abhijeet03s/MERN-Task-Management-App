import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import AddTodo from "./components/Todo/AddTodo";
import TaskList from "./components/Todo/TodoList";
import Signup from "./components/UserAuth/Signup";
import Login from "./components/UserAuth/Login";
import UserProfile from "./components/UserAuth/UserProfile";
// import TodoContextProvider from "./context/TodoContext";

export default function App() {
  return (
    <>
      {/* <TodoContextProvider> */}
        <Navbar />
        <Routes>
          <Route exact path="/" element={<AddTodo />}></Route>
          <Route
            exact
            path="/:todoId"
            element={<TaskList />}
          ></Route>
          <Route exact path="/signup" element={<Signup />}></Route>
          <Route exact path="/login" element={<Login />}></Route>
          <Route exact path="/user" element={<UserProfile />}></Route>
        </Routes>
      {/* </TodoContextProvider> */}
    </>
  );
}
