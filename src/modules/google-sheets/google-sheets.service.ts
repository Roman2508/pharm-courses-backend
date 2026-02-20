import * as path from 'path';
import { google, sheets_v4 } from 'googleapis';
import { Injectable, OnModuleInit } from '@nestjs/common';

@Injectable()
export class GoogleSheetsService implements OnModuleInit {
  private sheets: sheets_v4.Sheets;

  async onModuleInit() {
    const auth = new google.auth.GoogleAuth({
      keyFile: path.join(process.cwd(), 'secrets/google-keyfile.json'),
      scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
    });

    this.sheets = google.sheets({ version: 'v4', auth });
  }

  async getResponses() {
    const response = await this.sheets.spreadsheets.values.get({
      spreadsheetId: process.env.GOOGLE_SHEET_ID,
      range: process.env.GOOGLE_SHEET_RANGE,
    });

    const [headers, ...rows] = response.data.values ?? [];

    const allData = rows.map((row) =>
      Object.fromEntries(headers.map((h, i) => [h, row[i] ?? ''])),
    );

    return allData.map((row) => {
      const score = row['Результат'].split(' / ');
      const result = (+score[0] / +score[1]) * 100;

      return {
        email: row['Електронна адреса'],
        result: `${result.toFixed(0)}%`,
      };
    });
  }
}
