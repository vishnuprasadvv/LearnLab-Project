import { Button } from '@/components/ui/button'
import { ImageIcon, Pencil, PlusCircle } from 'lucide-react'
import { useState } from 'react'
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

interface ImageFormProps {
    initialData: {
        imageUrl: string;
    },
    courseId: string
}

const formSchema = z.object({
    imageUrl: z.string().min(1, {
        message : 'Image is required',
    })
})
const ImageForm = ({
    initialData,
    courseId
} : ImageFormProps) => {

    const [isEditing , setIsEditing] = useState(false)
    const toggleEdit = () => setIsEditing((current) => !current)
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues : initialData
    })
   // const {isSubmitting, isValid} = form.formState
    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        console.log(values)
    }

  return (
    <div className='mt-6 border bg-slate-100 rounded-md p-4'>
        <div className='font-medium flex items-center justify-between'>
            Course image
            <Button variant='ghost' onClick={toggleEdit}>
                {isEditing && (
                    <>Cancel</>
                )} {!isEditing && !initialData.imageUrl && 
                 (
                    <>
                    <PlusCircle className='h-4 w-4 mr-2'/>
                    Add an image
                    </>
                )}
                {!isEditing && initialData.imageUrl && (
                    <>
                    <Pencil className='h-4 w-4 mr-2'/>
                    Edit image
                    </>
                )}
                
            </Button>
        </div>

        {!isEditing && (
!initialData.imageUrl ? (
    <div className='flex items-center justify-center h-60 bg-slate-200 rounded-md'>
        <ImageIcon className='h-10 w-10 text-slate-500' />
    </div>
):(
    <div className='relative aspect-video mt-2'>
        <img src={initialData.imageUrl} alt="upload" 
        className='object-cover rounded-md'/>
    </div>
)
            
        )}
        {isEditing && (
             <div className="grid w-full max-w-sm items-center gap-1.5">
             <Label htmlFor="picture">Image</Label>
             <Input id="picture" type="file" />
           </div>
        )}
    </div>
  )
}

export default ImageForm