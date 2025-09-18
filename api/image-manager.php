<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Configuration
$basePath = '../assets/images/gallery/';
$allowedExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp'];
$maxFileSize = 10 * 1024 * 1024; // 10MB

function sendResponse($data, $status = 200) {
    http_response_code($status);
    echo json_encode($data);
    exit();
}

function getFileSize($filePath) {
    if (!file_exists($filePath)) return 0;
    return round(filesize($filePath) / (1024 * 1024), 2);
}

function getFileDate($filePath) {
    if (!file_exists($filePath)) return null;
    return date('Y-m-d', filemtime($filePath));
}

function scanDirectory($company) {
    global $basePath;
    $companyPath = $basePath . $company . '/';
    
    if (!is_dir($companyPath)) {
        return [];
    }
    
    $files = [];
    $items = scandir($companyPath);
    
    foreach ($items as $item) {
        if ($item === '.' || $item === '..') continue;
        
        $filePath = $companyPath . $item;
        if (is_file($filePath)) {
            $extension = strtolower(pathinfo($item, PATHINFO_EXTENSION));
            if (in_array($extension, ['jpg', 'jpeg', 'png', 'gif', 'webp'])) {
                $files[] = [
                    'name' => $item,
                    'size' => getFileSize($filePath) . ' MB',
                    'date' => getFileDate($filePath),
                    'path' => $filePath
                ];
            }
        }
    }
    
    return $files;
}

// Handle different request methods
$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        // Get images for a company
        if (!isset($_GET['company']) || empty($_GET['company'])) {
            sendResponse(['error' => 'Company parameter is required'], 400);
        }
        
        $company = $_GET['company'];
        $images = scanDirectory($company);
        
        sendResponse([
            'success' => true,
            'company' => $company,
            'images' => $images,
            'count' => count($images)
        ]);
        break;
        
    case 'POST':
        // Upload new images
        if (!isset($_POST['company']) || empty($_POST['company'])) {
            sendResponse(['error' => 'Company parameter is required'], 400);
        }
        
        $company = $_POST['company'];
        $companyPath = $basePath . $company . '/';
        
        // Create directory if it doesn't exist
        if (!is_dir($companyPath)) {
            mkdir($companyPath, 0755, true);
        }
        
        $uploadedFiles = [];
        $errors = [];
        
        if (isset($_FILES['images'])) {
            $files = $_FILES['images'];
            
            // Handle single file
            if (!is_array($files['name'])) {
                $files = [
                    'name' => [$files['name']],
                    'type' => [$files['type']],
                    'tmp_name' => [$files['tmp_name']],
                    'error' => [$files['error']],
                    'size' => [$files['size']]
                ];
            }
            
            for ($i = 0; $i < count($files['name']); $i++) {
                if ($files['error'][$i] !== UPLOAD_ERR_OK) {
                    $errors[] = "Error uploading file: " . $files['name'][$i];
                    continue;
                }
                
                if ($files['size'][$i] > $maxFileSize) {
                    $errors[] = "File too large: " . $files['name'][$i];
                    continue;
                }
                
                $extension = strtolower(pathinfo($files['name'][$i], PATHINFO_EXTENSION));
                if (!in_array($extension, $allowedExtensions)) {
                    $errors[] = "Invalid file type: " . $files['name'][$i];
                    continue;
                }
                
                $fileName = $files['name'][$i];
                $targetPath = $companyPath . $fileName;
                
                // Handle duplicate names
                $counter = 1;
                $originalName = pathinfo($fileName, PATHINFO_FILENAME);
                $originalExt = pathinfo($fileName, PATHINFO_EXTENSION);
                
                while (file_exists($targetPath)) {
                    $fileName = $originalName . ' (' . $counter . ').' . $originalExt;
                    $targetPath = $companyPath . $fileName;
                    $counter++;
                }
                
                if (move_uploaded_file($files['tmp_name'][$i], $targetPath)) {
                    $uploadedFiles[] = [
                        'name' => $fileName,
                        'size' => getFileSize($targetPath) . ' MB',
                        'date' => getFileDate($targetPath)
                    ];
                } else {
                    $errors[] = "Failed to upload: " . $files['name'][$i];
                }
            }
        }
        
        sendResponse([
            'success' => count($uploadedFiles) > 0,
            'uploaded' => $uploadedFiles,
            'errors' => $errors,
            'message' => count($uploadedFiles) . ' file(s) uploaded successfully'
        ]);
        break;
        
    case 'DELETE':
        // Delete an image
        $input = json_decode(file_get_contents('php://input'), true);
        
        if (!isset($input['company']) || !isset($input['filename'])) {
            sendResponse(['error' => 'Company and filename parameters are required'], 400);
        }
        
        $company = $input['company'];
        $filename = $input['filename'];
        $filePath = $basePath . $company . '/' . $filename;
        
        if (!file_exists($filePath)) {
            sendResponse(['error' => 'File not found'], 404);
        }
        
        if (unlink($filePath)) {
            sendResponse([
                'success' => true,
                'message' => 'File deleted successfully'
            ]);
        } else {
            sendResponse(['error' => 'Failed to delete file'], 500);
        }
        break;
        
    default:
        sendResponse(['error' => 'Method not allowed'], 405);
}
?>
