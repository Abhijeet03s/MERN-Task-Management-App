import { AiFillDelete } from "react-icons/ai";
import { FiEdit } from "react-icons/fi";

export default function TaskList() {
  return (
    <>
      <section className="container mx-auto flex items-center justify-center mt-20">
        <div className="w-fit py-10 px-10 mb-10 sm:px-20 rounded-md border-[1px] border-[#acb6bf]">
          <div className="flex flex-col justify-center space-y-3">
            <h1 className="text-2xl text-white font-bold">Task List:</h1>

            <div className="flex items-center space-x-2">
              <h1 className="w-[230px] sm:w-[400px] text-white  rounded-[4px]">
                
              </h1>
              <button
                // onClick={editTodoHandler}
                className="p-2 rounded-[50%] bg-[#eb7ea1] duration-200 ease-in-out"
              >
                <FiEdit />
              </button>
              <button
                // onClick={() => deleteTodoHandler(todo._id)}
                className="p-2 rounded-[50%] bg-[#eb7ea1] duration-200 ease-in-out"
              >
                <AiFillDelete />
              </button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
