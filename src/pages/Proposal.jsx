
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
import { toast } from "react-toastify"
const Proposal = () => {

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


    const handleSubmit = () => {

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
            </div>
            <Card>
                <CardHeader>
                    <CardTitle>
                        <h2 className="text-2xl font-semibold leading-none tracking-tight">
                            Proposal
                        </h2>
                        <CardDescription>
                            <p className="text-sm font-normal text-muted-foreground mt-1">
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
                            <div>
                                <label
                                    htmlFor="title"
                                    className="block mb-2 text-sm font-semibold text-gray"
                                >
                                    Title
                                </label>
                                <Input
                                    type="text"
                                    id="title"
                                    placeholder="Enter Payment Method"
                                    name="title"
                                />
                            </div>
                            <div>
                                <label
                                    htmlFor="payment-method"
                                    className="block mb-2 text-sm font-semibold text-gray"
                                >
                                    Client Name
                                </label>
                                <Input
                                    type="text"
                                    id="payment-method"
                                    placeholder="Enter Payment Method"
                                    name="payment_method"
                                />
                            </div>
                        </div>


                        <div className="mt-3">
                            <Editor
                                apiKey={`${import.meta.env.VITE_TEXT_EDITOR}`}
                                initialValue="<p>Start writing here...</p>"
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
                    </form>
                </CardContent>
            </Card>

        </>
    )
}

export default Proposal