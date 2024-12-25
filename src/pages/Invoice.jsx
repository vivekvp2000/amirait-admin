import {
  Table,
  TableBody,
  TableCaption,
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
import { CirclePlus, Download, LoaderCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { useAddInvoiceMutation, useGetInvoiceQuery, useGetInvoicesQuery } from "@/store/slices/apiSlice";
import { toast } from "react-toastify";
import { pdf } from "@react-pdf/renderer";
import InvoicePdf from "@/services/pdfs/InvoicePdf";

const Invoice = () => {
  // All The States 
  const [invoiceId, setInvoiceId] = useState(null);
  const [showInvoice, setShowInvoice] = useState(false);
  const [loadingPdf, setLoadingPdf] = useState(false);

  // RTK apis 
  const { data: allInvoice, isLoading: isInvoiceLoading } = useGetInvoicesQuery();
  const [addInvoice, { isLoading, error }] = useAddInvoiceMutation();
  const { data: signleInvoice, isLoading: isSingleInvoiceLoading } = useGetInvoiceQuery(invoiceId);

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

  // Calculate line total
  const calculateLineTotal = (qty, unitPrice, discount) => {
    const total = qty * unitPrice;
    const discountedTotal = total - (total * (discount / 100));
    return discountedTotal.toFixed(1);
  };

  // Handle dynamic row change (for items)
  const handleRowChange = (e, index) => {
    const { name, value } = e.target;
    const updatedItems = formData.items.map((item, i) => {
      if (i === index) {
        const updatedItem = { ...item, [name]: value };
        updatedItem.lineTotal = calculateLineTotal(updatedItem.qty, updatedItem.unitPrice, updatedItem.discount);
        return updatedItem;
      }
      return item;
    });
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

  // Form Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await addInvoice(formData).unwrap();
      console.log("Response:", response);
      toast.success("Invoice added successfully!");
    } catch (error) {
      console.log("Error:", error.data.errors);
      toast.error(error.data.message);
    }
  };

  const handleShowInvoice = () => {
    setShowInvoice(!showInvoice);
  };

  // Get Invoice  
  const handleGetInvoice = async (id) => {
    try {
      setInvoiceId(null); // Reset invoiceId to force re-fetch
      setTimeout(() => setInvoiceId(id), 0); // Set the new invoiceId after a short delay
    } catch (error) {
      console.error("Error setting invoice ID:", error);
    }
  };

  // Generate PDF when data is ready
  useEffect(() => {
    if (signleInvoice?.data) {
      setLoadingPdf(true);
      pdf(<InvoicePdf data={signleInvoice?.data} />)
        .toBlob()
        .then((blob) => {
          const url = URL.createObjectURL(blob);
          window.open(url, "_blank");
          setLoadingPdf(false);
        })
        .catch((error) => {
          console.error("Error generating PDF:", error);
          setLoadingPdf(false);
        });
    }
  }, [signleInvoice?.data]);

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
              <BreadcrumbPage>Invoice</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <div>
          <Button onClick={handleShowInvoice}>
            {showInvoice ? 'Cancel' : <><CirclePlus /> Add Invoice</>}
          </Button>
        </div>
      </div>

      <div>
        {showInvoice && (
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
                        className={`${error?.data?.errors?.invoice_date && "border-red-500"}`}
                      />
                      {error?.data?.errors?.invoice_date && <span className="text-red-500 text-sm">{error?.data?.errors?.invoice_date?.join('')}</span>}
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
                        className={`${error?.data?.errors?.customer_name && "border-red-500"}`}
                      />
                      {error?.data?.errors?.customer_name && <span className="text-red-500 text-sm">{error?.data?.errors?.customer_name?.join('')}</span>}
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
                        className={`${error?.data?.errors?.customer_address && "border-red-500"}`}
                      />
                      {error?.data?.errors?.customer_address && <span className="text-red-500 text-sm">{error?.data?.errors?.customer_address?.join('')}</span>}
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
                        className={`${error?.data?.errors?.customer_phone && "border-red-500"}`}
                      />
                      {error?.data?.errors?.customer_phone && <span className="text-red-500 text-sm">{error?.data?.errors?.customer_phone?.join('')}</span>}
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
                        className={`${error?.data?.errors?.payment_due_date && "border-red-500"}`}
                      />
                      {error?.data?.errors?.payment_due_date && <span className="text-red-500 text-sm">{error?.data?.errors?.payment_due_date?.join('')}</span>}
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
                        className={`${error?.data?.errors?.sales_person && "border-red-500"}`}
                      />
                      {error?.data?.errors?.sales_person && <span className="text-red-500 text-sm">{error?.data?.errors?.sales_person?.join('')}</span>}
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
                        placeholder="Enter Delivery Date"
                        className={`${error?.data?.errors?.delivery_date && "border-red-500"}`}
                      />
                      {error?.data?.errors?.delivery_date && <span className="text-red-500 text-sm">{error?.data?.errors?.delivery_date?.join('')}</span>}
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
                        name="payment_method"
                        value={formData.payment_method}
                        onChange={handleChange}
                        className={`${error?.data?.errors?.payment_method && "border-red-500"}`}
                      />
                      {error?.data?.errors?.payment_method && <span className="text-red-500 text-sm">{error?.data?.errors?.payment_method?.join('')}</span>}
                    </div>
                  </div>

                  <div className="mt-4">
                    <Table className="border light:border-gray-200 rounded-md">
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
                                type="number"
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
                                type="number"
                                placeholder="Enter Discount %"
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
                                readOnly
                                disabled
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
        )}
      </div>
      <div>
        {isInvoiceLoading && <h4>Invoice List Loading....</h4>}
        <Card>
          <CardHeader>
            <CardTitle>
              <h2 className="text-2xl font-semibold leading-none tracking-tight">
                All Invoice
              </h2>
            </CardTitle>
            <CardDescription>
              <p className="text-sm text-muted-foreground">
                All Invoice List
              </p>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table className='w-full border light:border-gray-200'>
              <TableCaption>A list of your recent invoices.</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-center font-bold text-black dark:text-white">Customer Id</TableHead>
                  <TableHead className="text-center font-bold text-black dark:text-white">Customer Name</TableHead>
                  <TableHead className="text-center font-bold text-black dark:text-white">Delivery Date</TableHead>
                  <TableHead className="text-center font-bold text-black dark:text-white">Sales Person</TableHead>
                  <TableHead className="text-center font-bold text-black dark:text-white">Export</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {allInvoice?.data?.map((invoice, index) => (
                  <TableRow key={index}>
                    <TableCell className="text-center font-medium">{invoice?.customer_id ? invoice?.customer_id : '---'}</TableCell>
                    <TableCell className="text-center">{invoice?.customer_name}</TableCell>
                    <TableCell className="text-center">{invoice?.delivery_date}</TableCell>
                    <TableCell className="text-center">{invoice?.sales_person}</TableCell>
                    <TableCell className="text-center">
                      <Button
                        type="button"
                        onClick={() => handleGetInvoice(invoice?.id)}
                        className="bg-green-700 dark:text-white"
                      >
                        <Download />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
      {loadingPdf && <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50">
        <LoaderCircle className="animate-spin" size={50} />
      </div>}
    </>
  );
};

export default Invoice;