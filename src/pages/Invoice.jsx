import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import { Skeleton } from "@/components/ui/skeleton"
import { Helmet } from "react-helmet";
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
  const [filteredInvoice, setFilteredInvoice] = useState([]);
  const [inputSearchInvoice, setInputSearchInvoice] = useState('')
  const [tax, setTax] = useState(0);
  const [getGrandTotal, setGrandTotal] = useState(0);
  const [pendingAmount, setPendingAmount] = useState(0);
  // RTK apis 
  const { data: allInvoice, isLoading: isInvoiceLoading } = useGetInvoicesQuery();
  const [addInvoice, { isLoading, error }] = useAddInvoiceMutation();
  const { data: signleInvoice } = useGetInvoiceQuery(invoiceId);

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
    paid_amount: "",
    tax_percent: "",
    discount_percent: '',
    invoice_curreny: '',
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
  console.log('Form Data', formData)

  useEffect(() => {
    if (allInvoice?.data) {
      setFilteredInvoice(allInvoice.data);
    }
  }, [allInvoice]);

  // Handle form data change
  useEffect(() => {
    if (formData.items.length > 0) {
      grandTotal(
        formData.items,
        Number(formData.tax_percent) || 0,
        Number(formData.discount_percent) || 0
      );
    }
  }, [formData.items, formData.tax_percent, formData.discount_percent]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    console.log(value)
    if (name === "tax_percent") {
      const updatedTax = Number(value);
      setTax(updatedTax);
    }
    setFormData({ ...formData, [name]: value });
  };

  const handleSelectChange = (value) => {
    setFormData((prevState) => ({
      ...prevState,
      invoice_curreny: value,
    }));
  };


  // Calculate line total
  const calculateLineTotal = (qty, unitPrice) => {
    const total = qty * unitPrice;
    return total;
  };

  // Pass tax as a parameter to grandTotal
  const grandTotal = (allItems, currentTax, discount) => {
    const totalUnitPrice = allItems.reduce((acc, singleItem) => {
      console.log(singleItem); // Check individual item details
      return acc + Number(singleItem.lineTotal || 0);
    }, 0);
    const totalTax = totalUnitPrice * (currentTax / 100);
    const totalWithTax = totalUnitPrice + totalTax;
    const finalTotal = totalWithTax - discount;
    setGrandTotal(finalTotal);
    return finalTotal;
  };

  // Example usage
  useEffect(() => {
    if (formData.items.length > 0) {
      const total = grandTotal(formData.items, tax, formData.discount_percent);
    }
  }, [formData.items, tax]);

  useEffect(() => {
    // Calculate pending amount dynamically when grand total or paid amount changes
    const paidAmount = Number(formData.paid_amount) || 0;

    if (getGrandTotal) {
      const newPendingAmount = getGrandTotal - paidAmount;
      setPendingAmount(newPendingAmount);
    }
  }, [formData.paid_amount, getGrandTotal]);


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
    grandTotal(updatedItems, tax)
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
      await addInvoice(formData).unwrap();
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
      setInvoiceId(null);
      setTimeout(() => setInvoiceId(id), 0);
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
          const customerName = signleInvoice?.data?.customer_name || "Invoice";
          const filename = `${customerName.replace(/\s+/g, '_')}_Invoice.pdf`;
          const file = new File([blob], filename, { type: "application/pdf" });

          const url = URL.createObjectURL(file);
          const a = document.createElement("a");
          a.href = url;
          a.download = file.name;
          a.click();

          // Clean up
          URL.revokeObjectURL(url);
          setLoadingPdf(false);
        })
        .catch((error) => {
          console.error("Error generating PDF:", error);
          setLoadingPdf(false);
        });
    }
  }, [signleInvoice?.data]);

  // Filter Invoice 
  const handleFiterInvoice = () => {
    if (!allInvoice?.data) return;
    const filterInvoice = allInvoice.data.filter((invoice) => {
      return invoice.customer_name.toLowerCase().includes(inputSearchInvoice.toLowerCase())
    });
    setFilteredInvoice(filterInvoice);
  };
  return (
    <>
      <Helmet>
        <title>Amirait | Invoice</title>
      </Helmet>
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
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-muted-foreground">
                      Create Your Invoice Here
                    </p>
                    <Select name="invoice_curreny" onValueChange={handleSelectChange}
                      value={formData.invoice_curreny} >
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Select Currency" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="INR">INR</SelectItem>
                        <SelectItem value="USD">USD</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

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
                    <div className="col-span-2">
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
                              {/* <TableHead className="font-bold text-black dark:text-white">
                            Discount
                          </TableHead> */}
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
                                {/* <TableCell>
                              <Input
                                type="number"
                                placeholder="Enter Discount %"
                                name="discount"
                                value={row.discount}
                                onChange={(e) => handleRowChange(e, index)}
                                required
                              />
                            </TableCell> */}
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
                    </div>


                    <div>
                      <label
                        htmlFor="paid-amount"
                        className="block mb-2 text-sm font-semibold text-gray"
                      >
                        Paid Amount
                      </label>
                      <Input
                        type="number"
                        id="paid-amount"
                        placeholder="Enter Paid Amount"
                        name="paid_amount"
                        value={formData.paid_amount}
                        onChange={handleChange}
                        className={`${error?.data?.errors?.paid_amount && "border-red-500"}`}
                      />
                      {error?.data?.errors?.paid_amount && <span className="text-red-500 text-sm">{error?.data?.errors?.paid_amount?.join('')}</span>}
                    </div>
                    <div>
                      <label
                        htmlFor="tax_percent"
                        className="block mb-2 text-sm font-semibold text-gray"
                      >
                        Tax %
                      </label>
                      <Input
                        type="number"
                        id="tax_percent"
                        placeholder="Enter in percentage"
                        name="tax_percent"
                        value={formData.tax_percent}
                        onChange={handleChange}
                        className={`${error?.data?.errors?.tax_percent && "border-red-500"}`}
                      />
                      {error?.data?.errors?.tax_percent && <span className="text-red-500 text-sm">{error?.data?.errors?.tax_percent?.join('')}</span>}
                    </div>
                    <div>
                      <label
                        htmlFor="discount_percent"
                        className="block mb-2 text-sm font-semibold text-gray"
                      >
                        Discount Amount
                      </label>
                      <Input
                        type="number"
                        id="discount_percent"
                        placeholder="Enter Discount"
                        name="discount_percent"
                        value={formData.discount_percent}
                        onChange={handleChange}
                        className={`${error?.data?.errors?.discount_percent && "border-red-500"}`}
                      />
                      {error?.data?.errors?.discount_percent && <span className="text-red-500 text-sm">{error?.data?.errors?.discount_percent?.join('')}</span>}
                    </div>
                    <div>
                      <label
                        htmlFor="grand-total"
                        className="block mb-2 text-sm font-semibold text-gray"
                      >
                        Grand Total
                      </label>
                      <Input
                        type="number"
                        id="grand-total"
                        placeholder="Get Grand Total"
                        name="grand-total"
                        value={getGrandTotal === 0 ? "" : getGrandTotal}
                        disabled
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="pending-amount"
                        className="block mb-2 text-sm font-semibold text-gray"
                      >
                        Pending Amount
                      </label>
                      <Input
                        type="number"
                        id="pending-amount"
                        placeholder="Pending Amount"
                        name="pending-amount"
                        value={pendingAmount}
                        disabled
                        className="text-red-600 "
                      />
                    </div>
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

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>
                <h2 className="text-2xl font-semibold leading-none tracking-tight">
                  All Invoice
                </h2>
              </CardTitle>
              <CardDescription>
                <p className="text-sm text-muted-foreground mt-1">
                  All Invoice List
                </p>
              </CardDescription>
            </div>
            <div className="flex itemsc-center gap-2">
              <Input type="text" placeholder="Search Invoice" onChange={(e) => setInputSearchInvoice(e.target.value)} />
              <Button onClick={handleFiterInvoice}>Search</Button>
            </div>
          </CardHeader>
          <CardContent>

            <Table className='w-full border light:border-gray-200'>
              <TableHeader className="bg-black ">
                <TableRow>
                  <TableHead className="text-center font-bold text-white">Customer Id</TableHead>
                  <TableHead className="text-center font-bold text-white">Customer Name</TableHead>
                  <TableHead className="text-center font-bold text-white">Delivery Date</TableHead>
                  <TableHead className="text-center font-bold text-white">Total Amount</TableHead>
                  <TableHead className="text-center font-bold text-white">Sales Person</TableHead>
                  <TableHead className="text-center font-bold text-white">Export</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isInvoiceLoading ? (
                  Array.from({ length: 5 }).map((_, index) => (
                    <TableRow key={`skeleton-${index}`}>
                      <TableCell className="text-center mt-2">
                        <Skeleton className="h-5 w-[100px]" />
                      </TableCell>
                      <TableCell className="text-center mt-2">
                        <Skeleton className="h-5 w-[150px]" />
                      </TableCell>
                      <TableCell className="text-center mt-2">
                        <Skeleton className="h-5 w-[120px]" />
                      </TableCell>
                      <TableCell className="text-center mt-2">
                        <Skeleton className="h-5 w-[100px]" />
                      </TableCell>
                      <TableCell className="text-center mt-2">
                        <Skeleton className="h-5 w-[150px]" />
                      </TableCell>
                      <TableCell className="text-center mt-2">
                        <Skeleton className="h-5 w-[50px]" />
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  filteredInvoice.map((invoice, index) => (
                    <TableRow key={index}>
                      <TableCell className="text-center font-medium">
                        {invoice?.custome_invoice_id ? invoice?.custome_invoice_id : "---"}
                      </TableCell>
                      <TableCell className="text-center">{invoice?.customer_name}</TableCell>
                      <TableCell className="text-center">{invoice?.delivery_date}</TableCell>
                      <TableCell className="text-center">{invoice?.grand_total}</TableCell>
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
                  ))
                )}
              </TableBody>
            </Table>
            {/* <Pagination className='mt-4'>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious href="#" />
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink href="#">1</PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationEllipsis />
                </PaginationItem>
                <PaginationItem>
                  <PaginationNext href="#" className='bg-green-500 text-white' />
                </PaginationItem>
              </PaginationContent>
            </Pagination> */}
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