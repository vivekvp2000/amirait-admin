import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"

import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb"
import { Link } from "react-router-dom"
import { Input } from "@/components/ui/input"
import { Editor } from "@tinymce/tinymce-react"
import { Button } from "@/components/ui/button"
import useToggle from "@/hooks/useToggle"
import { CirclePlus, Download, LoaderCircle } from "lucide-react"
import { useAddProposalMutation, useGetProposalsQuery } from "@/store/slices/apiSlice"
import { toast } from "react-toastify"
import { Badge } from "@/components/ui/badge"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

const Proposal = () => {
    // RTK apis
    const [addProposal, { isLoading: isProposalAdded }] = useAddProposalMutation()
    const { data: proposals, isLoading: isProposalLoaded } = useGetProposalsQuery()
    const [toggleValue, toggler] = useToggle(false)

    // Zod form validation schema
    const formSchema = z.object({
        name: z.string().min(1, "Name is required"),
        email: z.string().email("Invalid email address.."),
        phone: z.string().min(10, "Phone number must be at least 10 digits"),
        content: z.string().min(1, "Content is required"),
    })

    // RHF hook
    const { register, handleSubmit, reset, formState: { errors }, setValue } = useForm({
        resolver: zodResolver(formSchema),
    })
    // Form submit handler
    const onSubmit = async (formData) => {
        try {
            await addProposal(formData).unwrap()
            toast.success("Proposal Added Successfully")
            reset();
        } catch (error) {
            toast.error("Something Went Wrong")
        }
    }


    // Handle content change for the TinyMCE editor
    const handleEditorChange = (newContent) => {
        setValue("content", newContent)
    }

    return (
        <>
            <div className="flex items-center justify-between">
                <Breadcrumb>
                    <BreadcrumbList>
                        <BreadcrumbItem>
                            <Link to="/">Home</Link>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <BreadcrumbPage>Proposal</BreadcrumbPage>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>
                <div>
                    <Button type="button" onClick={() => toggler()}>{toggleValue ? 'Cancel' : <><CirclePlus /> Add Proposal</>}</Button>
                </div>
            </div>
            <div>
                {toggleValue && (
                    <div>
                        <Card>
                            <CardHeader>
                                <CardTitle>
                                    <h2 className="text-2xl font-semibold leading-none tracking-tight">
                                        Proposal
                                    </h2>
                                    <CardDescription>
                                        <p className="text-sm font-medium text-muted-foreground mt-2">
                                            All Proposal List
                                        </p>
                                    </CardDescription>
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <form onSubmit={handleSubmit(onSubmit)}>
                                    <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                                        <div>
                                            <label
                                                htmlFor="name"
                                                className="block mb-2 text-sm font-semibold text-gray"
                                            >
                                                Name
                                            </label>
                                            <Input
                                                type="text"
                                                id="name"
                                                placeholder="Enter Your Name"
                                                {...register("name")}
                                            />
                                            {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
                                        </div>
                                        <div>
                                            <label
                                                htmlFor="email"
                                                className="block mb-2 text-sm font-semibold text-gray"
                                            >
                                                Email
                                            </label>
                                            <Input
                                                type="email"
                                                id="email"
                                                placeholder="Enter Your Email"
                                                {...register("email")}
                                            />
                                            {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
                                        </div>
                                        <div>
                                            <label
                                                htmlFor="phone"
                                                className="block mb-2 text-sm font-semibold text-gray"
                                            >
                                                Phone
                                            </label>
                                            <Input
                                                type="text"
                                                id="phone"
                                                placeholder="Enter Your Number"
                                                {...register("phone")}
                                            />
                                            {errors.phone && <p className="text-red-500 text-sm">{errors.phone.message}</p>}
                                        </div>
                                    </div>
                                    <div className="mt-4">
                                        <label
                                            htmlFor="content"
                                            className="block mb-2 text-sm font-semibold text-gray"
                                        >
                                            Content
                                        </label>
                                        <Editor
                                            apiKey={`${import.meta.env.VITE_TEXT_EDITOR}`}
                                            initialValue="<p>Start writing here...</p>"
                                            id="content"
                                            init={{
                                                height: 300,
                                                menubar: true,
                                                plugins: [
                                                    "advlist autolink lists link image charmap print preview anchor",
                                                    "searchreplace visualblocks code fullscreen",
                                                    "insertdatetime media table paste code help wordcount",
                                                ],
                                                toolbar:
                                                    "undo redo | formatselect | bold italic backcolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | removeformat | help",
                                            }}
                                            onEditorChange={handleEditorChange}
                                        />
                                        {errors.content && <p className="text-red-500 text-sm">{errors.content.message}</p>}
                                    </div>
                                    <Button type="submit" className="mt-3" disabled={isProposalAdded}>
                                        {isProposalAdded ? <LoaderCircle className="animate-spin" /> : "Submit"}
                                    </Button>
                                </form>
                            </CardContent>
                        </Card>
                    </div>
                )}
            </div>
            <div>
                <Card>
                    <CardHeader>
                        <CardTitle>
                            <h2 className="text-2xl font-semibold leading-none tracking-tight">
                                Proposal
                            </h2>
                            <CardDescription>
                                <p className="text-sm font-medium text-muted-foreground mt-2">
                                    All Proposal List
                                </p>
                            </CardDescription>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {isProposalLoaded && <h5>Proposals are loading...</h5>}
                        <Table className="w-full border light:border-gray-200">
                            <TableCaption>A list of your recent invoices.</TableCaption>
                            <TableHeader className="bg-black">
                                <TableRow>
                                    <TableHead className="text-center font-bold text-white">Name</TableHead>
                                    <TableHead className="text-center font-bold text-white">Email</TableHead>
                                    <TableHead className="text-center font-bold text-white">Number</TableHead>
                                    <TableHead className="text-center font-bold text-white">Export</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {proposals?.data.map((proposal, index) => {
                                    return (
                                        <TableRow key={index}>
                                            <TableCell className="text-center">{proposal?.name}</TableCell>
                                            <TableCell className="text-center">
                                                <Badge>{proposal?.email}</Badge>
                                            </TableCell>
                                            <TableCell className="text-center">{proposal?.phone}</TableCell>
                                            <TableCell className="text-center">
                                                <Button type="button" className="bg-green-700 dark:text-white">
                                                    <Download />
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    )
                                })}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
        </>
    )
}

export default Proposal
