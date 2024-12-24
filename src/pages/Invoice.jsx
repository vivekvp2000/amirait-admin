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
import { CirclePlus } from "lucide-react";
import { useState } from "react";

const Invoice = () => {
  // For Daynamic Row
  const [rows, setRows] = useState([
    {
      qty: "",
      item: "",
      description: "",
      unitPrice: "",
      discount: "",
      lineTotal: "",
    },
  ]);
  // For Add Row
  const handleAddRow = () => {
    setRows([
      ...rows,
      {
        qty: "",
        item: "",
        description: "",
        unitPrice: "",
        discount: "",
        lineTotal: "",
      },
    ]);
  };
  // For Get Form Data
  const [formData, setFormData] = useState({
    invoiceDate: "",
    custmorName: "",
    address: "",
    phone: "",
    paymentDue: "",
    salesPerson: "",
    deliveryDate: "",
    paymentMethod: "",
  });
  // change form data
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
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
            <form>
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
                    name="invoiceDate"
                    onChange={handleChange}
                    value={formData.invoiceDate}
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
                    name="custmorName"
                    onChange={handleChange}
                    value={formData.custmorName}
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
                    type="email"
                    id="address"
                    placeholder="Enter Address"
                    name="address"
                    onChange={handleChange}
                    value={formData.address}
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
                    name="phone"
                    onChange={handleChange}
                    value={formData.phone}
                    placeholder="Enter Your Number"
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
                    name="paymentDue"
                    value={formData.paymentDue}
                    onChange={handleChange}
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
                    value={formData.salesPerson}
                    onChange={handleChange}
                    name="salesPerson"
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
                    name="deliveryDate"
                    onChange={handleChange}
                    value={formData.deliveryDate}
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
                    name="paymentMethod"
                    value={formData.paymentMethod}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="overflow-x-auto mt-4">
                <Table className="min-w-full border border-gray-200 ">
                  <TableHeader>
                    <TableRow>
                      <TableHead className="font-bold text-black dark:text-white">
                        Qty.
                      </TableHead>
                      <TableHead className="font-bold text-black dark:text-white">
                        Item
                      </TableHead>
                      <TableHead className="font-bold text-black dark:text-white">
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
                    {rows.map((row, index) => (
                      <TableRow key={index}>
                        <TableCell>
                          <Input
                            type="text"
                            placeholder="Qty"
                            value={row.qty}
                            onChange={(e) =>
                              setRows(
                                rows.map((r, i) =>
                                  i === index
                                    ? { ...r, qty: e.target.value }
                                    : r
                                )
                              )
                            }
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            type="text"
                            placeholder="Enter Item Name"
                            value={row.item}
                            onChange={(e) =>
                              setRows(
                                rows.map((r, i) =>
                                  i === index
                                    ? { ...r, item: e.target.value }
                                    : r
                                )
                              )
                            }
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            type="text"
                            placeholder="Enter Description"
                            value={row.description}
                            onChange={(e) =>
                              setRows(
                                rows.map((r, i) =>
                                  i === index
                                    ? { ...r, description: e.target.value }
                                    : r
                                )
                              )
                            }
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            type="text"
                            placeholder="Enter Unit Price ₹"
                            value={row.unitPrice}
                            onChange={(e) =>
                              setRows(
                                rows.map((r, i) =>
                                  i === index
                                    ? { ...r, unitPrice: e.target.value }
                                    : r
                                )
                              )
                            }
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            type="text"
                            placeholder="Enter Discount"
                            value={row.discount}
                            onChange={(e) =>
                              setRows(
                                rows.map((r, i) =>
                                  i === index
                                    ? { ...r, discount: e.target.value }
                                    : r
                                )
                              )
                            }
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            type="number"
                            placeholder="Enter Line Total"
                            value={row.lineTotal}
                            onChange={(e) =>
                              setRows(
                                rows.map((r, i) =>
                                  i === index
                                    ? { ...r, lineTotal: e.target.value }
                                    : r
                                )
                              )
                            }
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
            </form>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default Invoice;
