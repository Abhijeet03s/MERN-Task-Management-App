import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import AddTodo from "./components/Todo/AddTodo";
import TaskList from "./components/Task/TaskList";
import Signup from "./components/UserAuth/Signup";
import Login from "./components/UserAuth/Login";
import { AuthContextProvider } from "./context/AuthContext";

export default function App() {
  return (
    <>
      <AuthContextProvider>
        <div className="flex flex-col min-h-screen">
          <Navbar />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<AddTodo />}></Route>
              <Route path="/:todoId" element={<TaskList />}></Route>
              <Route path="/signup" element={<Signup />}></Route>
              <Route path="/login" element={<Login />}></Route>
            </Routes>
          </main>
        </div>
      </AuthContextProvider>
    </>
  );
}
