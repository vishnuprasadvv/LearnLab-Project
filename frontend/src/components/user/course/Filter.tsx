import { getAllCategoriesApi } from '@/api/student'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { Category } from '@/types/categories'
import React, { useEffect, useState } from 'react'

const Filter = () => {

    const [categories , setCategories] = useState<Category[] | []>([])
    const [loading , setLoading] = useState<Category| []>([])

    useEffect(() => {
        const getCategories = async () => {
          try {
            const response = await getAllCategoriesApi();
            setCategories(response.data);
            console.log(response);
          } catch (error) {
            console.error("error fetching categories", error);
          }
        };
        getCategories();
      }, [loading]);

    const handleCategoryChange = (id:string) => {
        console.log(id)
    }
  return (
    <div className='w-full sm:w-[20%]'>
        <div className='flex items-center justify-between'>
            <h1 className='font-semibold text-lg md:text-xl'>Filter Options</h1>

            <Select>
                <SelectTrigger>
                   <SelectValue placeholder='Sort by'/> 
                </SelectTrigger>
                <SelectContent>
                    <SelectGroup>
                    <SelectLabel>Sort by price</SelectLabel>
                    <SelectItem value='low'>Low to high</SelectItem>
                    <SelectItem value='high'>High to low</SelectItem>
                    </SelectGroup>
                    
                </SelectContent>
            </Select>
        </div>
        <Separator className='my-4'/>
        <div >
            <h1 className='font-semibold mb-2'>Category</h1>
            {
                categories.map((category) => (
                    <div className='flex items-center space-x-2 my-2'>
                        <Checkbox id={category._id} onCheckedChange={() => handleCategoryChange(category._id)}>

                        </Checkbox>
                        <Label className='text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'>{category.name}</Label>
                    </div>
                ))
            }
        </div>

    </div>
  )
}

export default Filter