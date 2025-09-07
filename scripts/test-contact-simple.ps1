$body = @{
    name = "Test User"
    email = "test@example.com"
    subject = "Test Subject"
    message = "Test message"
} | ConvertTo-Json

$response = Invoke-RestMethod -Uri "http://localhost:4444/api/contact" -Method Post -Body $body -ContentType "application/json"
Write-Output $response
