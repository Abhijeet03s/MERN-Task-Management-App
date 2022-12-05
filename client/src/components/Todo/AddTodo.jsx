import React from "react";
import { FiPlus } from "react-icons/fi";
import TodoList from "./TodoList";

export default function AddTodo() {
  return (
    <>
      <section className="container mx-auto flex items-center justify-center mt-20">
        <div className="w-fit py-10 px-10 sm:px-20 rounded-md border-[1px] border-[#A6B2BC]">
          <div className="flex flex-col justify-center space-y-3">
            <label
              className="text-[20px] sm:text-[2rem] text-white font-bold"
              htmlFor="title"
            >
              Todo:
            </label>
            <div className="space-x-2">
              <input
                className="w-[230px] sm:w-[600px] mt-3 p-2 rounded-[4px]"
                name="title"
                id="title"
                type="text"
              />
              <button className="p-3 rounded-[50%] bg-[#FD77A1] duration-200 ease-in-out">
                <FiPlus />
              </button>
            </div>
          </div>
        </div>
      </section>
      <TodoList />
    </>
  );
}
