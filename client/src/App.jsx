import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import AddTodo from "./components/Todo/AddTodo";
import TaskList from "./components/Todo/TodoList";
import Signup from "./components/UserAuth/Signup";
import Login from "./components/UserAuth/Login";
import UserProfile from "./components/UserAuth/UserProfile";
import { AuthContextProvider } from "./context/AuthContext";

export default function App() {
  return (
    <>
      <AuthContextProvider>
        <div>
          <Navbar />
          <Routes>
            <Route path="/" element={<AddTodo />}></Route>
            <Route path="/:todoId" element={<TaskList />}></Route>
            <Route path="/signup" element={<Signup />}></Route>
            <Route path="/login" element={<Login />}></Route>
            <Route path="/user" element={<UserProfile />}></Route>
          </Routes>
        </div>
      </AuthContextProvider>
    </>
  );
}
