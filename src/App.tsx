import React, { useState, useRef } from 'react';
import { FileText, Plus, Receipt, Download, Share2 } from 'lucide-react';
import html2canvas from 'html2canvas';

interface BusinessDetails {
  logo: string | null;
  name: string;
  address: string;
  phone: string;
  email: string;
}

interface InvoiceDetails {
  invoiceNumber: string;
  date: string;
  dueDate: string;
  paymentTerms: string;
}

interface BillTo {
  email: string;
  name: string;
  address: string;
}

interface InvoiceItem {
  description: string;
  quantity: number;
  price: number;
}

interface InvoiceStyle {
  fontFamily: string;
  termsAndConditions: string;
  paymentInstructions: string;
  importantInfo: string;
  bgTopColor: string;
  bgTopAccentColor: string;
  bgBottomColor: string;
  bgBottomAccentColor: string;
}

function App() {
  const invoiceRef = useRef<HTMLDivElement>(null);
  const [businessDetails, setBusinessDetails] = useState<BusinessDetails>({
    logo: null,
    name: '',
    address: '',
    phone: '',
    email: '',
  });

  const [invoiceDetails, setInvoiceDetails] = useState<InvoiceDetails>({
    invoiceNumber: '',
    date: new Date().toISOString().split('T')[0],
    dueDate: '',
    paymentTerms: 'Due on Receipt',
  });

  const [billTo, setBillTo] = useState<BillTo>({
    email: '',
    name: '',
    address: '',
  });

  const [items, setItems] = useState<InvoiceItem[]>([
    { description: '', quantity: 0, price: 0 },
  ]);

  const [taxRate, setTaxRate] = useState(0);

  const [style, setStyle] = useState<InvoiceStyle>({
    fontFamily: 'sans-serif',
    termsAndConditions: '',
    paymentInstructions: '',
    importantInfo: '',
    bgTopColor: '#4f46e5',
    bgTopAccentColor: '#f97316',
    bgBottomColor: '#4f46e5',
    bgBottomAccentColor: '#f97316',
  });

  const handleBusinessChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setBusinessDetails((prev) => ({ ...prev, [name]: value }));
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setBusinessDetails((prev) => ({
        ...prev,
        logo: URL.createObjectURL(file),
      }));
    }
  };

  const handleInvoiceChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setInvoiceDetails((prev) => ({ ...prev, [name]: value }));
  };

  const handleBillToChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setBillTo((prev) => ({ ...prev, [name]: value }));
  };

  const handleItemChange = (
    index: number,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    const updatedItems = [...items];
    updatedItems[index] = {
      ...updatedItems[index],
      [name]: name === 'description' ? value : parseFloat(value) || 0,
    };
    setItems(updatedItems);
  };

  const handleStyleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setStyle((prev) => ({ ...prev, [name]: value }));
  };

  const addItem = () => {
    setItems([...items, { description: '', quantity: 0, price: 0 }]);
  };

  const calculateSubtotal = () => {
    return items.reduce((sum, item) => sum + item.quantity * item.price, 0);
  };

  const calculateTax = () => {
    return calculateSubtotal() * taxRate;
  };

  const calculateGrandTotal = () => {
    return (calculateSubtotal() + calculateTax()).toFixed(2);
  };

  const downloadInvoice = async () => {
    if (invoiceRef.current) {
      const canvas = await html2canvas(invoiceRef.current);
      const image = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = image;
      link.download = `invoice-${invoiceDetails.invoiceNumber || 'draft'}.png`;
      link.click();
    }
  };

  const shareToWhatsApp = async () => {
    if (invoiceRef.current) {
      const canvas = await html2canvas(invoiceRef.current);
      const image = canvas.toDataURL('image/png');
      const message = `Invoice ${invoiceDetails.invoiceNumber || 'draft'}`;
      const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}&attachment=${encodeURIComponent(image)}`;
      window.open(whatsappUrl, '_blank');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-2 mb-8">
          <Receipt className="w-8 h-8 text-blue-600" />
          <h1 className="text-3xl font-bold text-gray-900">Invoice Generator</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <div className="space-y-8">
            {/* Style Customization */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold mb-6">Customize Design</h2>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Header Background
                    </label>
                    <input
                      type="color"
                      name="bgTopColor"
                      value={style.bgTopColor}
                      onChange={handleStyleChange}
                      className="mt-1 block w-full h-10"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Header Accent
                    </label>
                    <input
                      type="color"
                      name="bgTopAccentColor"
                      value={style.bgTopAccentColor}
                      onChange={handleStyleChange}
                      className="mt-1 block w-full h-10"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Footer Background
                    </label>
                    <input
                      type="color"
                      name="bgBottomColor"
                      value={style.bgBottomColor}
                      onChange={handleStyleChange}
                      className="mt-1 block w-full h-10"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Footer Accent
                    </label>
                    <input
                      type="color"
                      name="bgBottomAccentColor"
                      value={style.bgBottomAccentColor}
                      onChange={handleStyleChange}
                      className="mt-1 block w-full h-10"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Font Family
                  </label>
                  <select
                    name="fontFamily"
                    value={style.fontFamily}
                    onChange={handleStyleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  >
                    <option value="sans-serif">Sans Serif</option>
                    <option value="serif">Serif</option>
                    <option value="monospace">Monospace</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Terms and Conditions
                  </label>
                  <textarea
                    name="termsAndConditions"
                    value={style.termsAndConditions}
                    onChange={handleStyleChange}
                    rows={3}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    placeholder="Enter terms and conditions..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Payment Instructions
                  </label>
                  <textarea
                    name="paymentInstructions"
                    value={style.paymentInstructions}
                    onChange={handleStyleChange}
                    rows={3}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    placeholder="Enter payment instructions..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Important Information
                  </label>
                  <textarea
                    name="importantInfo"
                    value={style.importantInfo}
                    onChange={handleStyleChange}
                    rows={3}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    placeholder="Enter important information..."
                  />
                </div>
              </div>
            </div>

            {/* Business Details */}
            <div className="bg-gray-100 rounded-lg shadow-sm p-6">
              <div className="flex items-center gap-4 mb-6">
                <FileText className="w-5 h-5 text-blue-600" />
                <h2 className="text-xl font-semibold">Business Details</h2>
              </div>
              <div className="space-y-4">
                <label className="block">
                  <span className="text-sm font-medium text-gray-700">Logo</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleLogoChange}
                    className="mt-1 block w-full text-sm text-gray-500
                      file:mr-4 file:py-2 file:px-4
                      file:rounded-full file:border-0
                      file:text-sm file:font-semibold
                      file:bg-blue-50 file:text-blue-700
                      hover:file:bg-blue-100"
                  />
                </label>
                <input
                  type="text"
                  name="name"
                  placeholder="Business Name"
                  value={businessDetails.name}
                  onChange={handleBusinessChange}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
                <input
                  type="text"
                  name="address"
                  placeholder="Business Address"
                  value={businessDetails.address}
                  onChange={handleBusinessChange}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
                <input
                  type="tel"
                  name="phone"
                  placeholder="Phone Number"
                  value={businessDetails.phone}
                  onChange={handleBusinessChange}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={businessDetails.email}
                  onChange={handleBusinessChange}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Invoice Details */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold mb-6">Invoice Details</h2>
              <div className="space-y-4">
                <input
                  type="text"
                  name="invoiceNumber"
                  placeholder="Invoice Number"
                  value={invoiceDetails.invoiceNumber}
                  onChange={handleInvoiceChange}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
                <div className="grid grid-cols-2 gap-4">
                  <label className="block">
                    <span className="text-sm font-medium text-gray-700">Invoice Date</span>
                    <input
                      type="date"
                      name="date"
                      value={invoiceDetails.date}
                      onChange={handleInvoiceChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </label>
                  <label className="block">
                    <span className="text-sm font-medium text-gray-700">Due Date</span>
                    <input
                      type="date"
                      name="dueDate"
                      value={invoiceDetails.dueDate}
                      onChange={handleInvoiceChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </label>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Payment Terms
                  </label>
                  <select
                    name="paymentTerms"
                    value={invoiceDetails.paymentTerms}
                    onChange={handleInvoiceChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  >
                    <option value="Due on Receipt">Due on Receipt</option>
                    <option value="Net 15">Net 15</option>
                    <option value="Net 30">Net 30</option>
                    <option value="Net 60">Net 60</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Bill To */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold mb-6">Bill To</h2>
              <div className="space-y-4">
                <input
                  type="text"
                  name="name"
                  placeholder="Client Name"
                  value={billTo.name}
                  onChange={handleBillToChange}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
                <input
                  type="text"
                  name="address"
                  placeholder="Client Address"
                  value={billTo.address}
                  onChange={handleBillToChange}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
                <input
                  type="email"
                  name="email"
                  placeholder="Client Email"
                  value={billTo.email}
                  onChange={handleBillToChange}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Invoice Items */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold mb-6">Invoice Items</h2>
              <div className="space-y-4">
                {items.map((item, index) => (
                  <div key={index} className="grid grid-cols-3 gap-4">
                    <input
                      type="text"
                      name="description"
                      placeholder="Description"
                      value={item.description}
                      onChange={(e) => handleItemChange(index, e)}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                    <input
                      type="number"
                      name="quantity"
                      placeholder="Quantity"
                      value={item.quantity || ''}
                      onChange={(e) => handleItemChange(index, e)}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                    <input
                      type="number"
                      name="price"
                      placeholder="Price"
                      value={item.price || ''}
                      onChange={(e) => handleItemChange(index, e)}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                ))}
                <button
                  onClick={addItem}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Another Item
                </button>
              </div>
            </div>

            {/* Tax Rate */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold mb-6">Tax Rate</h2>
              <input
                type="number"
                placeholder="Tax Rate (%)"
                value={taxRate * 100}
                onChange={(e) => setTaxRate(parseFloat(e.target.value) / 100 || 0)}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Invoice Preview */}
          <div className="space-y-4">
            <div className="flex gap-2">
              <button
                onClick={downloadInvoice}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <Download className="w-4 h-4 mr-2" />
                Download Invoice
              </button>
              <button
                onClick={shareToWhatsApp}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <Share2 className="w-4 h-4 mr-2" />
                Share via WhatsApp
              </button>
            </div>

            <div 
              ref={invoiceRef}
              className="relative bg-white rounded-lg shadow-sm p-8 overflow-hidden"
              style={{ fontFamily: style.fontFamily }}
            >
              {/* Header Background */}
              <div 
                className="absolute top-0 left-0 w-full bg-opacity-20"
                style={{ 
                  backgroundColor: style.bgTopColor,
                  minHeight: '200px',
                  paddingBottom: '20px'
                }}
              >
                <div 
                  className="absolute top-0 right-0 w-1/3 h-full transform -skew-x-12 bg-opacity-30"
                  style={{ backgroundColor: style.bgTopAccentColor }}
                ></div>
              </div>

              {/* Header Content */}
              <div className="relative z-10 flex justify-between items-start mb-8 pt-4">
                <div className="space-y-2">
                  {businessDetails.logo && (
                    <img 
                      src={businessDetails.logo} 
                      alt="Company Logo" 
                      className="w-20 h-20 object-contain mb-2"
                    />
                  )}
                  <h1 className="text-4xl font-bold text-white uppercase">Invoice</h1>
                  <p className="text-lg font-semibold text-black mt-2">
                    <br></br>
                    {businessDetails.name || 'Aldenaire & Partners'}
                  </p>
                  <p className="text-sm text-black">
                    Invoice No: {invoiceDetails.invoiceNumber || '1234'}
                  </p>
                  <p className="text-sm text-black">
                    Date: {invoiceDetails.date || '17th May, 2022'}
                  </p>
                  <p className="text-sm text-black">
                    Due Date: {invoiceDetails.dueDate || '17th June, 2022'}
                  </p>
                  <p className="text-sm text-black">
                    Payment Terms: {invoiceDetails.paymentTerms}
                  </p>
                </div>
                <div className="text-right space-y-2">
                  <h3 className="text-lg font-semibold text-black">Invoice to:</h3>
                  <p className="text-black">{billTo.name || 'Yael Amari'}</p>
                  <p className="text-sm text-black">
                    {billTo.email || 'hello@reallygreatsite.com'}
                  </p>
                  <p className="text-sm text-black">
                    {billTo.address || '123 Anywhere St., Any City, ST 12345'}
                  </p>
                </div>
              </div>

              {/* Items Table */}
              <div className="relative z-10 mt-8">
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr style={{ backgroundColor: style.bgTopColor }} className="text-white">
                        <th className="py-3 px-4 text-left font-semibold">Description</th>
                        <th className="py-3 px-4 text-left font-semibold">Qty</th>
                        <th className="py-3 px-4 text-left font-semibold">Unit Price</th>
                        <th className="py-3 px-4 text-right font-semibold">Subtotal</th>
                      </tr>
                    </thead>
                    <tbody>
                      {items.map(
                        (item, index) =>
                          (item.description || item.quantity || item.price) && (
                            <tr key={index} className="border-b border-gray-200">
                              <td className="py-3 px-4">{item.description}</td>
                              <td className="py-3 px-4">{item.quantity}</td>
                              <td className="py-3 px-4">${item.price.toFixed(2)}</td>
                              <td className="py-3 px-4 text-right">
                                ${(item.quantity * item.price).toFixed(2)}
                              </td>
                            </tr>
                          )
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Totals Section */}
              <div className="relative z-10 mt-6 flex justify-end">
                <div className="space-y-2 text-right">
                  <div className="flex justify-between w-64">
                    <p className="font-medium">Subtotal:</p>
                    <p>${calculateSubtotal().toFixed(2)}</p>
                  </div>
                  <div className="flex justify-between w-64">
                    <p className="font-medium">Tax ({(taxRate * 100).toFixed(1)}%):</p>
                    <p>${calculateTax().toFixed(2)}</p>
                  </div>
                  <div className="flex justify-between w-64 text-lg font-semibold">
                    <p>Total:</p>
                    <p>${calculateGrandTotal()}</p>
                  </div>
                </div>
              </div>

              {/* Payment Details */}
              {style.paymentInstructions && (
                <div className="relative z-10 mt-6">
                  <h3 className="font-semibold mb-2">Payment Details:</h3>
                  <p className="text-sm text-gray-600 whitespace-pre-line">
                    {style.paymentInstructions}
                  </p>
                </div>
              )}

              {/* Important Information */}
              {style.importantInfo && (
                <div className="relative z-10 mt-6">
                  <h3 className="font-semibold mb-2">Important Information:</h3>
                  <p className="text-sm text-gray-600 whitespace-pre-line">
                    {style.importantInfo}
                  </p>
                </div>
              )}

              {/* Footer Background */}
              <div 
                className="absolute bottom-0 left-0 w-full h-40"
                style={{ backgroundColor: style.bgBottomColor }}
              ></div>
              <div 
                className="absolute bottom-0 left-0 w-1/3 h-40 transform skew-x-12"
                style={{ backgroundColor: style.bgBottomAccentColor }}
              ></div>

              {/* Footer Section */}
              <div className="relative z-10 mt-8 flex justify-between items-end">
                <div className="space-y-2">
                  <h3 className="font-semibold text-white">Contact Us</h3>
                  <p className="text-sm text-white flex items-center">
                    <span className="mr-2">📞</span> {businessDetails.phone || '+123-456-7890'}
                  </p>
                  <p className="text-sm text-white flex items-center">
                    <span className="mr-2">🌐</span> {businessDetails.email || 'www.reallygreatsite.com'}
                  </p>
                  <p className="text-sm text-white flex items-center">
                    <span className="mr-2">📍</span> {businessDetails.address || '123 Anywhere St., Any City, ST 12345'}
                  </p>
                </div>
                <div className="flex items-end space-x-4">
                  {/* Stamp */}
                  <div className="relative w-32 h-32 rounded-full bg-white border-2 border-gray-400 flex items-center justify-center">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <svg className="w-full h-full" viewBox="0 0 100 100">
                        {/* Outer circle with company name */}
                        <path
                          id="circlePath"
                          d="M 50, 50 m -45, 0 a 45,45 0 1,1 90,0 a 45,45 0 1,1 -90,0"
                          fill="none"
                        />
                        <text className="text-xs font-semibold fill-black">
                          <textPath href="#circlePath" startOffset="50%" textAnchor="middle">
                            {businessDetails.name.toUpperCase() || 'ALDENAIRE & PARTNERS'}
                          </textPath>
                        </text>
                        {/* Inner design - small stars */}
                        <circle cx="50" cy="10" r="2" fill="black" />
                        <circle cx="50" cy="90" r="2" fill="black" />
                        <circle cx="10" cy="50" r="2" fill="black" />
                        <circle cx="90" cy="50" r="2" fill="black" />
                        {/* Logo text in center */}
                        <text
                          x="50"
                          y="45"
                          textAnchor="middle"
                          className="text-lg font-bold fill-black"
                        >
                          {businessDetails.name ? businessDetails.name.charAt(0) : 'A&P'}
                        </text>
                        {/* Date below logo */}
                        <text
                          x="50"
                          y="65"
                          textAnchor="middle"
                          className="text-xs fill-black"
                        >
                          {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                        </text>
                      </svg>
                    </div>
                  </div>
                  {/* Thank You and Signature */}
                  <div className="text-right">
                    <h3 className="text-2xl font-bold" style={{ color: style.bgBottomAccentColor }}>
                      Thank You!
                    </h3>
                    <p className="text-sm text-white mt-2">Signature</p>
                    <p className="text-sm text-white">Administrator</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;       