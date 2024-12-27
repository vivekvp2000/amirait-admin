
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
import { useState } from "react"
import useToggle from "@/hooks/useToggle"
import { CirclePlus, Download, LoaderCircle } from "lucide-react"
import { useAddProposalMutation, useGetProposalsQuery } from "@/store/slices/apiSlice"
import { toast } from "react-toastify"
const Proposal = () => {
    // RTK apis 
    const [addProposal, { isLoading: isProposalAdded }] = useAddProposalMutation()
    const { data: proposals } = useGetProposalsQuery()
    const [toggleValue, toggler] = useToggle(false)
    console.log(proposals?.data)
    // Form Value 
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        content: ''
    })

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData, [name]: value
        })
    }


    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            await addProposal(formData).unwrap()
            toast.success('Proposal Added Successfully')
        } catch (error) {
            console.log(error)
            toast.error('Something Went Wrong')
        }
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
                {toggleValue && <div>
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
                            <form onSubmit={handleSubmit}>
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
                                            name="name"
                                            onChange={handleChange}
                                        />
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
                                            name="email"
                                            onChange={handleChange}
                                        />
                                    </div>
                                    <div>
                                        <label
                                            htmlFor="number"
                                            className="block mb-2 text-sm font-semibold text-gray"
                                        >
                                            Phone
                                        </label>
                                        <Input
                                            type="number"
                                            id="number"
                                            placeholder="Enter Your Number"
                                            name="phone"
                                            onChange={handleChange}
                                        />
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
                                                'advlist autolink lists link image charmap print preview anchor',
                                                'searchreplace visualblocks code fullscreen',
                                                'insertdatetime media table paste code help wordcount',
                                            ],
                                            toolbar:
                                                'undo redo | formatselect | bold italic backcolor | \
             alignleft aligncenter alignright alignjustify | \
             bullist numlist outdent indent | removeformat | help',
                                        }}
                                        onEditorChange={(newContent) => setFormData({ ...formData, content: newContent })}
                                    />
                                </div>
                                <Button type="submit" className="mt-3" disabled={isProposalAdded}>{isProposalAdded ? <LoaderCircle className="animate-spin" /> : 'Submit'}</Button>

                            </form>
                        </CardContent>
                    </Card>
                </div>}
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

                        <Table>
                            <TableCaption>A list of your recent invoices.</TableCaption>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="text-center font-bold text-black dark:text-white">Name</TableHead>
                                    <TableHead className="text-center font-bold text-black dark:text-white">Email</TableHead>
                                    <TableHead className="text-center font-bold text-black dark:text-white">Number</TableHead>
                                    <TableHead className="text-center font-bold text-black dark:text-white">Export</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {proposals?.data.map((perposal) => {

                                })}

                                <TableRow>
                                    <TableCell className="font-medium">INV001</TableCell>
                                    <TableCell >Paid</TableCell>
                                    <TableCell >Credit Card</TableCell>
                                    <TableCell  ><Button><Download /></Button></TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
        </>
    )
}

export default Proposal