import RNHTMLtoPDF from 'react-native-html-to-pdf';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';


const generatePDF = async (module, tableData, tableHeads) => {
  // console.log(module, tableData, tableHeads)
  try {
    const tableHeadHtml = tableHeads.map(head => `<th>${head}</th>`).join('');
    const tableBodyHtml = tableData.map(data => `<tr>${tableHeads.map(head => `<td>${data[head]}</td>`).join('')}</tr>`).join('');

    const html = `
        <html>
          <head>
            <style>
              body {
                font-family: 'Helvetica';
                font-size: 12px;
              }
              header, footer {
                height: 50px;
                background-color: #fff;
                color: #000;
                display: flex;
                justify-content: center;
                padding: 0 20px;
              }
              table {
                width: 100%;
                border-collapse: collapse;
              }
              th, td {
                border: 1px solid #000;
                padding: 5px;
              }
              th {
                background-color: #ccc;
              }
            </style>
          </head>
          <body>
            <header>
              <h1>${module} Report</h1>
            </header>
            <table>
              <tr>${tableHeadHtml}</tr>
              ${tableBodyHtml}
            </table>
          </body>
        </html>
      `;

    const options = {
      html,
      fileName: `${module}_report_${Date.now()}`,
      directory: module,
    };
    const file = await RNHTMLtoPDF.convert(options);
    Alert.alert('Success', `PDF saved to ${file.filePath}`);
    return file;

  } catch (error) {
    Alert.alert('Error', error.message);
  }
};




export default generatePDF;