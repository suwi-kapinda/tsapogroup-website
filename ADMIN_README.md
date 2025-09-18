# Tsapo Group - Image Management System

## Overview
This admin system allows you to manage images for all company pages without manually coding. You can upload, view, preview, and delete images for each company through a user-friendly interface.

## Features
- **Company Selection**: Choose from all available companies
- **Drag & Drop Upload**: Easy image upload with drag-and-drop support
- **Image Gallery**: View all images for each company
- **Image Preview**: Click to preview images in full size
- **Delete Images**: Remove unwanted images with confirmation
- **Download Images**: Download individual images
- **Statistics**: View total images, file sizes, and last updated dates
- **Progress Tracking**: Real-time upload progress
- **Error Handling**: Clear error messages and success notifications

## How to Use

### 1. Access the Admin Panel
- Open `admin.html` in your web browser
- The admin panel will load with a clean interface

### 2. Select a Company
- Use the dropdown menu to select which company's images you want to manage
- All available companies are listed alphabetically

### 3. Upload New Images
- **Method 1**: Click the "Select Images" button and choose files
- **Method 2**: Drag and drop images directly onto the upload area
- Supported formats: JPG, JPEG, PNG, GIF, WEBP
- Maximum file size: 10MB per image
- Multiple files can be uploaded at once

### 4. Manage Existing Images
- **View**: All images are displayed in a grid layout
- **Preview**: Click the "Preview" button to see full-size images
- **Download**: Click "Download" to save images to your computer
- **Delete**: Click "Delete" to remove images (with confirmation)

### 5. View Statistics
- Total number of images
- Total file size
- Last updated date

## File Structure
```
assets/images/gallery/
├── byd/
├── chinese-parts-solutions/
├── ctrack/
├── evca-center/
├── grand-auto/
├── harakati-zambia/
├── harakati-zimbabwe/
├── lindezi/
├── lovol/
├── massbreed-zambia/
├── massbreed-zimbabwe/
├── reno-systems/
├── sinotruk/
├── supreme-panel-beaters/
├── tsapo-industries-zambia/
├── tsapo-motors/
├── tsapo-southern-region/
└── zerobay/
```

## Technical Requirements
- Web server with PHP support
- Write permissions on the `assets/images/gallery/` directory
- Modern web browser with JavaScript enabled

## API Endpoints
The system uses a PHP API (`api/image-manager.php`) with the following endpoints:

- **GET**: `api/image-manager.php?company={company_name}` - Retrieve images for a company
- **POST**: `api/image-manager.php` - Upload new images
- **DELETE**: `api/image-manager.php` - Delete an image

## Security Notes
- The system automatically handles duplicate file names
- File type validation ensures only images are uploaded
- File size limits prevent oversized uploads
- Confirmation dialogs prevent accidental deletions

## Troubleshooting

### Images Not Loading
- Check that the `assets/images/gallery/` directory exists
- Ensure proper file permissions (755 for directories, 644 for files)
- Verify PHP is enabled on your server

### Upload Failures
- Check file size (must be under 10MB)
- Ensure file is a valid image format
- Verify server has write permissions

### API Errors
- Check that `api/image-manager.php` is accessible
- Ensure PHP is properly configured
- Check server error logs for detailed error messages

## Support
For technical support or questions about the image management system, please contact your web administrator.
