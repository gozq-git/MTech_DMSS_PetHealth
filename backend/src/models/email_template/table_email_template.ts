import EmailTemplate from './email_template';

class TableEmailTemplate  extends EmailTemplate {

  setBody(body: any): this {
    // Convert the JSON object into an HTML table
    const tableRows = Object.entries(body)
      .map(([key, value]) => `<tr><td><strong>${key}</strong></td><td>${value}</td></tr>`)
      .join('');

    this.body = `
      <table border="1" cellpadding="5" cellspacing="0" style="border-collapse: collapse; width: 100%;">
        ${tableRows}
      </table>
    `;
    return this;
  }

}

export default TableEmailTemplate;
