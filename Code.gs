function doGet() {
  initializeSheets(); // Ensure all required sheets are set up
  return HtmlService.createHtmlOutputFromFile('Index')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

// Automatically initialize required sheets
function initializeSheets() {
  // Create or retrieve the Settings sheet
  getOrCreateSheet('Settings', ['Setting', 'Value'], [
    ['Event Name', 'Sample Event'],
    ['Attendance Open', 'Yes']
  ]);

  // Create or retrieve the Programs sheet
  getOrCreateSheet('Programs', ['Program', 'Abbreviation']);
}

// Ensure a sheet exists with specified headers and default rows
function getOrCreateSheet(sheetName, headers, defaultRows) {
  var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = spreadsheet.getSheetByName(sheetName);

  if (!sheet) {
    // Create the sheet if it doesn't exist
    sheet = spreadsheet.insertSheet(sheetName);
    sheet.appendRow(headers); // Add the header row
    if (defaultRows && defaultRows.length > 0) {
      defaultRows.forEach(function(row) {
        sheet.appendRow(row); // Add default rows
      });
    }
  } else {
    // Ensure headers are present in an existing sheet
    var existingHeaders = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
    if (existingHeaders.join() !== headers.join()) {
      sheet.insertRowBefore(1); // Insert a row for headers
      sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
    }
  }

  return sheet;
}

// Check if attendance is open
function isAttendanceOpen() {
  var sheet = getOrCreateSheet('Settings', ['Setting', 'Value'], [
    ['Event Name', 'Sample Event'],
    ['Attendance Open', 'Yes']
  ]);
  var data = sheet.getDataRange().getValues();

  for (var i = 0; i < data.length; i++) {
    if (data[i][0] === 'Attendance Open') {
      return data[i][1].toLowerCase() === 'yes'; // Check if attendance is open
    }
  }

  return false; // Default to closed if not found
}

// Get event name from the Settings sheet
function getEventName() {
  var sheet = getOrCreateSheet('Settings', ['Setting', 'Value'], [
    ['Event Name', 'Sample Event'],
    ['Attendance Open', 'Yes']
  ]);
  var data = sheet.getDataRange().getValues();

  for (var i = 0; i < data.length; i++) {
    if (data[i][0] === 'Event Name') {
      return data[i][1]; // Return the event name value
    }
  }

  return 'Event'; // Default value if not found
}

// Fetch programs from the Programs sheet
function getPrograms() {
  var sheet = getOrCreateSheet('Programs', ['Program', 'Abbreviation']);
  var data = sheet.getRange('A2:A').getValues(); // Start from A2 to skip the header row
  var programs = data.flat().filter(String); // Flatten the array and remove empty values

  return programs;
}

// Check for duplicate email and record attendance
function checkDuplicateAndRecordAttendance(email, program, year, name) {
  if (!isAttendanceOpen()) {
    return 'closed'; // Attendance is closed
  }

  var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  var programAbbreviations = getProgramAbbreviations();
  var programAbbreviation = programAbbreviations[program] || 'UNKNOWN';
  var sheetName = programAbbreviation + ' ' + year;
  var sheet = spreadsheet.getSheetByName(sheetName);

  if (!sheet) {
    sheet = spreadsheet.insertSheet(sheetName);
    sheet.appendRow(['Timestamp', 'Email', 'Name', 'Program', 'Year']);
  }

  var data = sheet.getDataRange().getValues();
  var emailColumnIndex = 1;

  // Check for existing email in the sheet
  for (var i = 1; i < data.length; i++) {
    if (data[i][emailColumnIndex] === email) {
      return 'exists'; // Email already exists
    }
  }

  // If email not found, record attendance
  sheet.appendRow([new Date(), email, name, program, year]);

  // Send confirmation email
  sendConfirmationEmail(email, name, program, year);

  return 'recorded';
}

// Retrieve program abbreviations from the Programs sheet
function getProgramAbbreviations() {
  var sheet = getOrCreateSheet('Programs', ['Program', 'Abbreviation']);
  var data = sheet.getRange('A:B').getValues();
  var abbreviations = {};

  // Skip the header row (first row)
  for (var i = 1; i < data.length; i++) {
    var programName = data[i][0];
    var abbreviation = data[i][1];

    if (programName && abbreviation) {
      abbreviations[programName] = abbreviation;
    }
  }

  return abbreviations;
}

// Send a confirmation email to the user
function sendConfirmationEmail(email, name, program, year) {
  var eventName = getEventName(); // Fetch the event name from the Settings sheet
  var subject = `Attendance Acknowledgement - ${eventName}`;
  var body = `
    <html>
    <head>
      <style>
        body {
          font-family: Arial, sans-serif;
          margin: 0;
          padding: 0;
        }
        .container {
          background-color: #f8f9fa;
          padding: 20px;
          border-radius: 8px;
          max-width: 600px;
          margin: 0 auto;
          text-align: center;
        }
        .header {
          margin-bottom: 20px;
        }
        .header img {
          width: 100%;
          max-width: 600px;
          height: auto;
          border-radius: 8px;
        }
        .content {
          background-color: #ffffff;
          padding: 20px;
          border-radius: 8px;
          box-shadow: 0 0 10px rgba(0,0,0,0.1);
        }
        .footer {
          margin-top: 20px;
          font-size: 12px;
          color: #888;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <img src="https://1drv.ms/i/s!Al0JXBvnsaVhgXgfFRPR6hAeF-3d?embed=1&width=1280&height=474" alt="${eventName} Event">
        </div>
        <div class="content">
          <h2 style="color: #d9534f;">Attendance Acknowledgement</h2>
          <p>Dear ${name},</p>
          <p>Thank you for attending the "${eventName}".</p>
          <p>Your participation is greatly appreciated, and we hope that the knowledge gained will be valuable in your academic and professional journey.</p>
          <p><strong>Program:</strong> ${program}</p>
          <p><strong>Year:</strong> ${year}</p>
          <p>We look forward to your participation in future events.</p>
          <p>Best regards,<br>San Pedro College - College Red Cross Youth</p>
        </div>
        <div class="footer">
          <p>&copy; ${new Date().getFullYear()} San Pedro College - College Red Cross Youth. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  MailApp.sendEmail({
    to: email,
    subject: subject,
    htmlBody: body
  });
}
