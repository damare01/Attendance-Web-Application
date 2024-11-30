# Attendance Web Application

This project is an event attendance management system designed to manage and track attendance for various events hosted by an institution. The system allows users to register their attendance for events and records their program details along with their attendance status. The registration process is tightly controlled based on the configuration of the event.

## Features

### 1. **User Registration for Attendance**
   - Users can register their attendance for events by filling out a form with the following details:
     - **Full Name**: The user's full name.
     - **Email Address**: The user's email address for event communication.
     - **Year Level**: The user's year level or academic standing.
     - **Program**: The user's academic program (such as Bachelor of Science in Nursing or others).

### 2. **Dynamic Program List**
   - The program list is dynamically populated from a Google Spreadsheet, ensuring that any changes to the list of available programs are automatically reflected in the form. Users select their program from this list to register.

### 3. **Form Submission and Data Recording**
   - When the form is submitted, the system records the user's attendance details in a **Google Sheet** under the appropriate program and year combination.
   - The system ensures that the user’s data is accurately added, including the program and year. The "Proof Link" for attendance remains marked as "Pending" until further updates (such as proof submission) are integrated.

### 4. **Automated Email Confirmation**
   - Upon successful form submission, the user receives an automated confirmation email. The email includes:
     - Event name
     - User’s program and year level
     - A thank-you note acknowledging their participation in the event
   - This email is designed to ensure that users receive a formal acknowledgment of their attendance.

### 5. **Conditional Form Responses Based on `Attendance Open` Setting**
   - The system includes a feature that checks whether event attendance is open or closed.
   - The `Attendance Open` setting is stored in a Google Sheet under the `settings` tab. If the value is set to `yes`, users can submit the attendance form. If it is set to `no`, users will be prohibited from submitting the form.
     - **`Attendance Open: Yes/yes`**: The attendance form is open, and users can submit their details.
     - **`Attendance Open: No/no`**: The attendance form is closed, and users will be notified that registration is no longer available.
   
   - The `Attendance Open` status is used to manage event registration periods and ensure that users only register when the event is accepting responses. If the form is closed, an appropriate notification is shown to the user, indicating that the event registration is closed.

### 6. **Program-Specific Attendance Sheets**
   - For each program and year combination, the system automatically creates a new sheet in the Google Spreadsheet to store attendance records.
   - Each attendance sheet is organized with columns including:
     - Timestamp
     - User’s Name
     - User’s Email
     - Program
     - Year Level

## Technologies Used
- **Google Apps Script**: Handles backend logic, form processing, and communication with Google Sheets for data storage and retrieval.
- **Google Sheets**: Used to store event-related data, including user attendance and program details.
- **MailApp (Google Apps Script)**: Sends automated email confirmations to users after successful form submissions.
- **HTML/CSS**: The frontend form that users interact with to register their attendance.

## Key Configurations

### `Attendance Open` Setting
- The `attendanceOpen` setting is controlled in the `settings` sheet of the Google Spreadsheet. This setting is crucial for managing when users can submit their attendance. The following values can be configured:
  - **`Yes/yes`**: Users are allowed to submit their attendance.
  - **`No/no`**: Users are informed that attendance registration is closed.

### Example of Settings Sheet:
| Setting          | Value   |
|------------------|---------|
| `Event Name`      | Event Name Here |
| `Attendance Open` | Yes/No or yes/no |

- If the `Attendance Open` value is set to `no`, users who attempt to submit the form will see a notification that the registration is closed, and the form will not be submitted.

### Setup Instructions

Follow these steps to set up and deploy your web app seamlessly:

## Step 1: Create a Google Sheet
- Open Google Sheets and create a new spreadsheet.

## Step 2: Open the Apps Script Editor
- In the menu bar, click **Extensions > Apps Script**.

## Step 3: Add the `Code.gs` Script
1. In the Apps Script editor, ensure you are on the `Code.gs` file.
2. Paste the provided `Code.gs` script into the editor.

## Step 4: Add the HTML File
1. Click the **+** button next to the **Files** tab and select **HTML file**.
2. Name the file `Index` and paste the provided HTML code into the file.

## Step 5: Deploy the Web App
1. Click **Deploy > New deployment**.
2. Set the following:
   - **Type**: Web app.
   - **Execute as**: Me.
   - **Who has access**: Anyone.
3. Click **Deploy**.

## Step 6: Authorize the Script
- Review the permissions requested and click **Authorize**.
- Follow the instructions to grant access.

## Step 7: Access the Web App
- After deployment, copy the provided URL to share and access your app.

> **Note**:  
> If you are using an institutional email, you might encounter authorization restrictions. Use a personal Google account to complete the setup.

## Tips for a Smooth Setup
- Ensure your script and HTML are error-free before deployment.
- Test the web app link on different devices to ensure compatibility.
- Use **Manage deployments** for future updates.


## Future Enhancements
Future development will include additional features like file upload for attendance proof, better handling of event-specific data, and enhanced user interfaces for managing event details.
