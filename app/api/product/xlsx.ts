import xlsx, { IJsonSheet } from "json-as-xlsx";

export function downloadToExcel(data: any) {
  let columns: IJsonSheet[] = [
    {
      sheet: "Products",
      columns: [
        { label: "Product ID", value: "id" },
        { label: "Product Name", value: "title" },
        { label: "Product Status", value: "productStatus" },
        { label: "Product Inventory", value: "quantity" },
      ],
      content: data,
    },
  ];

  let settings = {
    fileName: "Products Excel",
  };

  xlsx(columns, settings);
}
