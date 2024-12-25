import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { CirclePlus, LoaderCircle } from "lucide-react";
import { useState } from "react";
import { useAddInvoiceMutation } from "@/store/slices/apiSlice";

const Invoice = () => {
  // Post Invoice
  const [addInvoice, { isLoading, isError }] = useAddInvoiceMutation();

  // For form data including items
  const [formData, setFormData] = useState({
    invoice_date: "",
    customer_name: "",
    customer_address: "",
    customer_phone: "",
    payment_due_date: "",
    sales_person: "",
    delivery_date: "",
    payment_method: "",
    items: [
      {
        qty: "",
        item: "",
        description: "",
        unitPrice: "",
        discount: "",
        lineTotal: "",
      },
    ],
  });

  // Handle form data change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle dynamic row change (for items)
  const handleRowChange = (e, index) => {
    const { name, value } = e.target;
    const updatedItems = formData.items.map((item, i) =>
      i === index ? { ...item, [name]: value } : item
    );
    setFormData({ ...formData, items: updatedItems });
  };

  // Handle add new row
  const handleAddRow = () => {
    setFormData({
      ...formData,
      items: [
        ...formData.items,
        {
          qty: "",
          item: "",
          description: "",
          unitPrice: "",
          discount: "",
          lineTotal: "",
        },
      ],
    });
  };

  // const mutation = useMutation({
  //   mutationFn: addInvoice,
  //   onSuccess: (data) => {
  //     console.log(data);
  //   },
  // });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await addInvoice(formData).unwrap();
      console.log("Response:", response);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <>
      <div className="flex items-center">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <Link to="/">Home</Link>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Invoice</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      <div>
        <Card>
          <CardHeader>
            <CardTitle>
              <h2 className="text-2xl font-semibold leading-none tracking-tight">
                Invoice
              </h2>
            </CardTitle>
            <CardDescription>
              <p className="text-sm text-muted-foreground">
                Create Your Invoice Here
              </p>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="invoice-date"
                    id="date"
                    className="block mb-2 text-sm font-semibold text-gray"
                  >
                    Invoice Date
                  </label>
                  <Input
                    type="date"
                    id="invoice-date"
                    placeholder="Date"
                    name="invoice_date"
                    onChange={handleChange}
                    value={formData.invoice_date}
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="name"
                    className="block mb-2 text-sm font-semibold text-gray"
                  >
                    Customer Name
                  </label>
                  <Input
                    type="text"
                    id="name"
                    placeholder="Enter Your Name"
                    name="customer_name"
                    onChange={handleChange}
                    value={formData.customer_name}
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="address"
                    className="block mb-2 text-sm font-semibold text-gray"
                  >
                    Address
                  </label>
                  <Input
                    type="text"
                    id="address"
                    placeholder="Enter Address"
                    name="customer_address"
                    onChange={handleChange}
                    value={formData.customer_address}
                    required
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
                    name="customer_phone"
                    onChange={handleChange}
                    value={formData.customer_phone}
                    placeholder="Enter Your Number"
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="payment-due"
                    className="block mb-2 text-sm font-semibold text-gray"
                  >
                    Payment Due
                  </label>
                  <Input
                    type="date"
                    id="payment-due"
                    placeholder="Enter Date"
                    name="payment_due_date"
                    value={formData.payment_due_date}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="sales-person"
                    className="block mb-2 text-sm font-semibold text-gray"
                  >
                    Sales person
                  </label>
                  <Input
                    type="text"
                    id="sales-person"
                    placeholder="Enter Your Name"
                    value={formData.sales_person}
                    onChange={handleChange}
                    name="sales_person"
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="delivery-date"
                    className="block mb-2 text-sm font-semibold text-gray"
                  >
                    Delivery Date
                  </label>
                  <Input
                    type="date"
                    id="delivery-date"
                    name="delivery_date"
                    onChange={handleChange}
                    value={formData.delivery_date}
                    required
                    placeholder="Enter Delivery Date"
                  />
                </div>
                <div>
                  <label
                    htmlFor="payment-method"
                    className="block mb-2 text-sm font-semibold text-gray"
                  >
                    Payment Method
                  </label>
                  <Input
                    type="text"
                    id="payment-method"
                    placeholder="Enter Payment Method"
                    required
                    name="payment_method"
                    value={formData.payment_method}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="mt-4">
                <Table className="border border-gray-200 rounded-md">
                  <TableHeader>
                    <TableRow>
                      <TableHead className="font-bold text-black dark:text-white">
                        Qty.
                      </TableHead>
                      <TableHead className="font-bold text-black dark:text-white">
                        Item
                      </TableHead>
                      <TableHead className="font-bold text-black dark:text-white w-[250px]">
                        Description
                      </TableHead>
                      <TableHead className="font-bold text-black dark:text-white">
                        Unit Price
                      </TableHead>
                      <TableHead className="font-bold text-black dark:text-white">
                        Discount
                      </TableHead>
                      <TableHead className="font-bold text-black dark:text-white">
                        Line Total
                      </TableHead>
                      <TableHead className="font-bold text-black dark:text-white">
                        Add
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {formData.items.map((row, index) => (
                      <TableRow key={index}>
                        <TableCell>
                          <Input
                            type="text"
                            placeholder="Qty"
                            name="qty"
                            value={row.qty}
                            onChange={(e) => handleRowChange(e, index)}
                            required
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            type="text"
                            placeholder="Enter Item Name"
                            name="item"
                            value={row.item}
                            onChange={(e) => handleRowChange(e, index)}
                            required
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            type="text"
                            placeholder="Enter Description"
                            name="description"
                            value={row.description}
                            onChange={(e) => handleRowChange(e, index)}
                            required
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            type="number"
                            placeholder="Enter Unit Price ₹"
                            name="unitPrice"
                            value={row.unitPrice}
                            onChange={(e) => handleRowChange(e, index)}
                            required
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            type="text"
                            placeholder="Enter Discount"
                            name="discount"
                            value={row.discount}
                            onChange={(e) => handleRowChange(e, index)}
                            required
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            type="number"
                            placeholder="Enter Line Total"
                            name="lineTotal"
                            value={row.lineTotal}
                            onChange={(e) => handleRowChange(e, index)}
                            required
                          />
                        </TableCell>
                        <TableCell className="text-center">
                          <Button type="button" onClick={handleAddRow}>
                            <CirclePlus size={20} />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              <Button
                type="submit"
                className="mt-4 bg-green-600 font-extrabold"
                disabled={isLoading}
              >
                {isLoading ? (
                  <LoaderCircle className="animate-spin" />
                ) : (
                  "Submit"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default Invoice;
