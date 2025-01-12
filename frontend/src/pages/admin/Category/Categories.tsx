import { getAllCategories } from "@/api/adminApi";
import { useEffect, useState } from "react";
import { MdBlock, MdEdit } from "react-icons/md";
import { Input } from "../../../components/ui/input";
import { Button } from "../../../components/ui/button";
import { useNavigate } from "react-router-dom";

interface Category {
  name: string;
  description: string;
  isActive: boolean;
  parentCategoryId?: string;
}

const Categories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const navigate = useNavigate();

  //search & pagination
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const itemsPerPage = 7;

  const handleSearch = (e: any) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  useEffect(() => {
    const getCategories = async () => {
      try {
        const response = await getAllCategories(
          currentPage,
          itemsPerPage,
          searchQuery
        );
        setCategories(response.data.categories);
        setTotalPages(response.data.totalPages)
      } catch (error) {
        console.error("error fetching categories", error);
      }
    };
    getCategories();
  }, [searchQuery, currentPage]);

  const handleCreateCategory = () => {
    navigate("/admin/categories/create");
  };

  const handleEditButton = (userId: string) => {
    navigate(`/admin/categories/${userId}/edit`);
  };

  return (
    <div className="flex flex-col w-full">
      <h1 className="text-2xl font-bold text-dark-500 text-center">
        Categories
      </h1>
      
    
        <div className=" m-2 overflow-auto">
          <div className="flex mt-1">
            <Input
              type="text"
              placeholder="Search category..."
              value={searchQuery}
              onChange={handleSearch}
              className="mb-4 p-2 border border-blue-100 rounded-full h-10 w-1/3 ml-2 shadow-md shadow-blue-100"
            />
            {/* <Button variant='outline' size='icon' onClick={handleSearch}><CiSearch /></Button> */}
            <Button
              className="bg-blue-600 rounded-full hover:bg-blue-700 ml-auto mr-2"
              onClick={handleCreateCategory}
            >
              Create category
            </Button>
          </div>
          {!categories || categories?.length == 0 ? (
        <div>
            {searchQuery.length ? ( <h1>No result found</h1>) : ( <h1>No category available. Create new one </h1>)}
        </div>
      ) : (
        <div>

          <table className="text-sm text-left w-full rtl:text-right text-gray-500 dark:text-gray-400 overflow-x-scroll">
            <thead className=" text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
              <tr className="bg-blue-200">
                <th scope="col" className="lg:px-6 px-2 py-4 w-[25%]">
                  Name
                </th>
                <th scope="col" className="lg:px-6 px-2 py-4 hidden md:block">
                  Description
                </th>
                <th scope="col" className="lg:px-6 px-2 py-4 w-[20%]">
                  Created Date
                </th>
                <th
                  scope="col"
                  className="lg:px-6 px-2 py-4 text-center w-[10%]"
                >
                  Status
                </th>
                <th scope="col" className="lg:px-6 px-2 py-4 w-[5%]">
                  Remove
                </th>
              </tr>
            </thead>
            <tbody>
              {categories.map((category: any, index: number) => (
                <tr
                  key={index}
                  className="odd:bg-white  odd:dark:bg-gray-900 hover:bg-gray-100 even:bg-gray-50
             even:dark:bg-gray-800 border-b dark:border-gray-700"
                >
                  <td
                    scope="row"
                    className="w-[25%] lg:px-6 px-1 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                  >
                    {category.name}
                  </td>
                  <td className="lg:px-6 px-2 py-4 hidden md:block">
                    {category.description}
                  </td>
                  <td className="lg:px-6 px-2 py-4  w-[20%] ">
                    {new Date(category.createdAt).toDateString()}
                  </td>
                  <td className="lg:px-6 px-2 py-4  w-[10%]">
                    <div
                      className={`${
                        category?.isActive ? "bg-green-400" : "bg-red-400"
                      } py-1 px-2 text-white text-xs font-semibold text-center rounded-full uppercase`}
                    >
                      {category.isActive ? "Active" : "Inactive"}
                    </div>
                  </td>
                  <td className="lg:px-6 px-2 py-4 w-[5%]">
                    <div className="flex gap-1">
                      <div className="p-2 border rounded-md flex items-center justify-center w-10 h-10">
                        <MdBlock
                          className={`text-xl center `}
                        />
                      </div>
                      <div className="p-2 border rounded-md flex items-center justify-center w-10 h-10" onClick={() => handleEditButton(category._id)}>
                        <MdEdit className="text-xl center" />
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination Controls */}

          <div className="flex justify-center mt-4 items-center">
            <Button
              variant="outline"
              className="px-4 py-2 mx-1 border rounded "
              onClick={() =>
                setCurrentPage(currentPage > 1 ? currentPage - 1 : 1)
              }
              disabled={currentPage === 1}
            >
              Previous
            </Button>

            {/* Display previous page if not at the start */}
            {currentPage > 2 && (
              <Button
                variant="outline"
                size="icon"
                className="px-4 py-2 mx-1 border rounded"
                onClick={() => setCurrentPage(currentPage - 2)}
              >
                {currentPage - 2}
              </Button>
            )}

            {/* Display the page before current */}
            {currentPage > 1 && (
              <Button
                variant="outline"
                size="icon"
                className="px-4 py-2 mx-1 border rounded "
                onClick={() => setCurrentPage(currentPage - 1)}
              >
                {currentPage - 1}
              </Button>
            )}

            {/* Current page */}
            <Button
              variant="default"
              size="icon"
              className="px-4 py-2 mx-1 border rounded bg-blue-500 text-white"
            >
              {currentPage}
            </Button>

            {/* Display the page after current */}
            {currentPage < totalPages && (
              <Button
                variant="outline"
                size="icon"
                className="px-4 py-2 mx-1 border rounded "
                onClick={() => setCurrentPage(currentPage + 1)}
              >
                {currentPage + 1}
              </Button>
            )}

            {/* Display next page if not at the end */}
            {currentPage < totalPages - 1 && (
              <Button
                variant="outline"
                size="icon"
                className="px-4 py-2 mx-1 border rounded "
                onClick={() => setCurrentPage(currentPage + 2)}
              >
                {currentPage + 2}
              </Button>
            )}

            <Button
              variant="outline"
              className="px-4 py-2 mx-1 border rounded "
              onClick={() =>
                setCurrentPage(
                  currentPage < totalPages ? currentPage + 1 : totalPages
                )
              }
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
          </div>
        </div>
      )}
      </div>
    </div>
  );
};

export default Categories;
